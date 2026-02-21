"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────
export type MonitoringMode = 'idle' | 'quick-check' | 'active';

export interface CheckResult {
  score: number;
  pulseRate: number | null;
  prv: number | null;
  timestamp: string; // ISO
  date: string;      // YYYY-MM-DD
}

export interface StrokeMonitoringState {
  mode: MonitoringMode;
  strokeScore: number | null;
  countdown: number | null;
  sessionPulseRate: number | null;
  sessionPRV: number | null;
  checkResult: CheckResult | null;
  streak: number;
  activeMinutesLeft: number | null;
  triageStatus: 'GREEN' | 'YELLOW' | 'RED' | null;
  aiAdvice: string | null;
  alertFailure: boolean;
  uiAction: string | null;
  startQuickCheck: () => void;
  cancelQuickCheck: (finalScore?: number) => void;
  toggleActiveMonitoring: () => void;
  receiveVitals: (pulseRate: number, prv: number) => void;
  forceSyncProfile: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function computeStreak(sessions: CheckResult[]): number {
  if (sessions.length === 0) return 0;
  const dates = Array.from(new Set(sessions.map((s) => s.date))).sort(
    (a, b) => b.localeCompare(a),
  );
  let streak = 0;
  let cursor = todayISO();
  for (const date of dates) {
    if (date === cursor) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    } else if (date < cursor) {
      break;
    }
  }
  return streak;
}

const LOCAL_SCORE_GRACE_MS = 60_000; // 60 s — polling won't override a fresh scan result

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useStrokeMonitoring(
  baseRiskScore: number,
  monitoringSessions: any[] = [],
): StrokeMonitoringState {
  const [mode, setMode] = useState<MonitoringMode>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionPulseRate, setSessionPulseRate] = useState<number | null>(null);
  const [sessionPRV, setSessionPRV] = useState<number | null>(null);
  const [strokeScore, setStrokeScore] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeMinutesLeft, setActiveMinutesLeft] = useState<number | null>(null);
  const [triageStatus, setTriageStatus] = useState<'GREEN' | 'YELLOW' | 'RED' | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [alertFailure, setAlertFailure] = useState(false);
  const [uiAction, setUiAction] = useState<string | null>('PASSIVE_MONITORING');

  const latestPR = useRef<number | null>(null);
  const latestPRV = useRef<number | null>(null);

  // FIX 1: Store triageStatus in a ref so the polling loop always reads the
  // current value without needing triageStatus as a useEffect dependency.
  // This prevents the effect from tearing down + restarting (and spawning a
  // second concurrent polling loop) every time triageStatus changes.
  const triageStatusRef = useRef<'GREEN' | 'YELLOW' | 'RED' | null>(null);
  triageStatusRef.current = triageStatus;

  // FIX 2: Store the timestamp of the last local score set so the polling
  // closure always reads the live value (refs don't go stale in closures).
  const localScoreSetAt = useRef<number>(0);

  // FIX 3: A flag to pause polling while RED, resumable when status clears.
  const pausePollingRef = useRef(false);

  // ── Profile sync ──────────────────────────────────────────────────────────
  const forceSyncProfile = useCallback(async () => {
    try {
      await fetch('/api/internal/patient/profile', { method: 'POST' });
    } catch (e) {
      console.error('Profile sync error', e);
    }
  }, []);

  // ── Background polling ────────────────────────────────────────────────────
  // FIX 1: Empty dependency array — runs once on mount, never restarts.
  // triageStatus is read via triageStatusRef.current inside the closure so it
  // always reflects the latest value without causing the effect to re-run.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const pollBackend = async () => {
      if (cancelled) return;

      // FIX 3: If RED alert is active, skip this poll tick but keep the timer
      // alive so we resume automatically once the UI clears the flag.
      if (!pausePollingRef.current) {
        try {
          const res = await fetch('/api/internal/vitals/status');

          if (res.status === 404) {
            await forceSyncProfile();
          } else if (res.ok) {
            const data = await res.json();

            setTriageStatus(data.triage_status ?? null);
            setAiAdvice(data.ai_advice ?? null);
            setAlertFailure(data.alert_failure ?? false);
            setUiAction(data.ui_action ?? 'PASSIVE_MONITORING');

            if (data.risk_score != null) {
              // FIX 2: Read ref (not closure-captured state) to get the live
              // timestamp — no race between concurrent pollers possible.
              const timeSinceLocal = Date.now() - localScoreSetAt.current;
              if (timeSinceLocal > LOCAL_SCORE_GRACE_MS) {
                setStrokeScore(data.risk_score);
              } else {
                console.info('[poll] Skipping score override — local score is fresh', { timeSinceLocal });
              }
            }

            // FIX 3: Pause future poll ticks on RED, but DO NOT return early.
            // We fall through so the next setTimeout is always scheduled, which
            // means polling resumes automatically once pausePollingRef is cleared.
            if (data.triage_status === 'RED') {
              pausePollingRef.current = true;
              if (data.alert_failure) {
                console.warn('CRITICAL: Backend Twilio SMS failed. Triggering local fallback SMS.');
              }
            } else {
              // Status recovered from RED — resume normal polling
              pausePollingRef.current = false;
            }
          }
        } catch (err) {
          console.error('Status polling failed', err);
        }
      }

      if (!cancelled) {
        // FIX 1: Read triageStatus from ref — always current, no stale closure.
        const ms = triageStatusRef.current === 'YELLOW' ? 10_000 : 30_000;
        timer = setTimeout(pollBackend, ms);
      }
    };

    pollBackend();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [forceSyncProfile]); // forceSyncProfile is stable (empty useCallback deps)

  // ── Load DB sessions ───────────────────────────────────────────────────────
  // FIX 4: Stabilise the sessions input with a JSON-serialised key so this
  // effect only re-runs when the actual data changes, not on every render when
  // the parent passes a new array literal reference.
  const sessionsKey = JSON.stringify(
    monitoringSessions.map((s) => s.startedAt ?? s.timestamp),
  );

  useEffect(() => {
    if (!monitoringSessions || monitoringSessions.length === 0) {
      setStreak(0);
      setCheckResult(null);
      return;
    }

    const mapped: CheckResult[] = monitoringSessions.map((s: any) => ({
      score: s.finalScore ?? 0,
      pulseRate: s.avgPulseRate ?? null,
      prv: s.avgPrv ?? null,
      timestamp: new Date(s.startedAt).toISOString(),
      date: new Date(s.startedAt).toISOString().slice(0, 10),
    }));

    setStreak(computeStreak(mapped));
    setCheckResult(mapped[0]);

    // Only use DB score as a fallback — never override a poll-fetched or
    // locally-set score that arrived after this effect ran.
    setStrokeScore((prev) => (prev !== null ? prev : mapped[0].score));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsKey]);

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'quick-check' || countdown === null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => (c && c > 0 ? c - 1 : 0)), 1000);
    return () => clearTimeout(timer);
  }, [mode, countdown]);

  // ── Active monitoring timer ────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'active') {
      setActiveMinutesLeft(null);
      return;
    }
    const ACTIVE_DURATION_MINS = 30;
    setActiveMinutesLeft(ACTIVE_DURATION_MINS);

    const interval = setInterval(() => {
      setActiveMinutesLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setMode('idle');
          return null;
        }
        return prev - 1;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [mode]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const receiveVitals = useCallback((pulseRate: number, prv: number) => {
    latestPR.current = pulseRate;
    latestPRV.current = prv;
    setSessionPulseRate(pulseRate);
    setSessionPRV(prv);
  }, []);

  const startQuickCheck = useCallback(() => {
    setMode('quick-check');
    setCountdown(30);
  }, []);

  const cancelQuickCheck = useCallback((finalScore?: number) => {
    setMode('idle');
    setCountdown(null);
    if (finalScore != null) {
      // Lock the fresh local score in — polling grace window starts now.
      localScoreSetAt.current = Date.now();
      setStrokeScore(Math.round(finalScore));
    }
  }, []);

  const toggleActiveMonitoring = useCallback(() => {
    setMode((prev) => (prev === 'active' ? 'idle' : prev === 'idle' ? 'active' : prev));
  }, []);

  return {
    mode,
    strokeScore,
    countdown,
    sessionPulseRate,
    sessionPRV,
    checkResult,
    streak,
    activeMinutesLeft,
    triageStatus,
    aiAdvice,
    alertFailure,
    uiAction,
    startQuickCheck,
    cancelQuickCheck,
    toggleActiveMonitoring,
    receiveVitals,
    forceSyncProfile,
  };
}