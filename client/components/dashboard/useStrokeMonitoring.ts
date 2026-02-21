"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
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
  cancelQuickCheck: () => void;
  toggleActiveMonitoring: () => void;
  receiveVitals: (pulseRate: number, prv: number) => void;
  forceSyncProfile: () => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const SESSIONS_KEY = 'sg_stroke_sessions';
const ACTIVE_START_KEY = 'sg_active_monitoring_start';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadSessions(): CheckResult[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function computeStreak(sessions: CheckResult[]): number {
  if (sessions.length === 0) return 0;
  const dates = Array.from(new Set(sessions.map((s) => s.date))).sort(
    (a, b) => b.localeCompare(a)
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

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useStrokeMonitoring(baseRiskScore: number, monitoringSessions: any[] = []): StrokeMonitoringState {
  const [mode, setMode] = useState<MonitoringMode>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sessionPulseRate, setSessionPulseRate] = useState<number | null>(null);
  const [sessionPRV, setSessionPRV] = useState<number | null>(null);
  const [strokeScore, setStrokeScore] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeMinutesLeft, setActiveMinutesLeft] = useState<number | null>(null);
  
  // Backend State
  const [triageStatus, setTriageStatus] = useState<'GREEN' | 'YELLOW' | 'RED' | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [alertFailure, setAlertFailure] = useState(false);
  const [uiAction, setUiAction] = useState<string | null>("PASSIVE_MONITORING");

  const latestPRV = useRef<number | null>(null);
  const latestPR = useRef<number | null>(null);
  const activeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 1. Profile Auto-Registration ──────────────────────────────────────────
  const forceSyncProfile = useCallback(async () => {
    try {
      await fetch('/api/internal/patient/profile', { method: 'POST' });
    } catch (e) {
      console.error("Profile sync error", e);
    }
  }, []);

  // ── 2. Background Polling ─────────────────────────────────────────────────
  useEffect(() => {
    let timer: any;
    const pollBackend = async () => {
      try {
        const res = await fetch('/api/internal/vitals/status');
        if (res.status === 404) {
          // Profile doesn't exist on ML backend, create it
          await forceSyncProfile();
        } else if (res.ok) {
          const data = await res.json();
          setTriageStatus(data.triage_status);
          setAiAdvice(data.ai_advice || null);
          setAlertFailure(data.alert_failure || false);
          setUiAction(data.ui_action || "PASSIVE_MONITORING");
          
          if (data.risk_score !== undefined && data.risk_score !== null) {
            setStrokeScore(data.risk_score);
          }
          
          // If RED, we want to immediately trigger UI overlay and stop aggressive polling
          if (data.triage_status === 'RED') {
             // Handle local fallback if Twilio failed
             if (data.alert_failure) {
                 console.warn("CRITICAL: Backend Twilio SMS failed. Triggering local fallback SMS.");
             }
             return; // Stop polling on RED until user resolves
          }
        }
      } catch (err) {
        console.error("Status polling failed", err);
      }
      
      // Dynamic polling rate
      const ms = triageStatus === 'YELLOW' ? 10_000 : 30_000;
      timer = setTimeout(pollBackend, ms);
    };

    pollBackend();
    return () => clearTimeout(timer);
  }, [triageStatus, forceSyncProfile]);

  // ── Load persisted data on mount ───────────────────────────────────────
  useEffect(() => {
    // If we have DB sessions, use them to calculate streak and prepopulate score
    if (monitoringSessions && monitoringSessions.length > 0) {
      // Map back to CheckResult shape for UI compatibility
      const mappedSessions: CheckResult[] = monitoringSessions.map((s: any) => ({
        score: s.finalScore ?? 0,
        pulseRate: s.avgPulseRate,
        prv: s.avgPrv,
        timestamp: new Date(s.startedAt).toISOString(),
        date: new Date(s.startedAt).toISOString().slice(0, 10),
      }));

      setStreak(computeStreak(mappedSessions));
      setCheckResult(mappedSessions[0]);
      // Only set strokeScore if we don't have one fetched directly from the external backend's /status poll yet
      setStrokeScore((prev) => prev !== null ? prev : mappedSessions[0].score);
    } else {
      setStreak(0);
      setCheckResult(null);
    }
  }, [monitoringSessions]);

  // ── Receive incoming vitals from WebcamPPG for Live UI ───────────────────
  const receiveVitals = useCallback(
    (pulseRate: number, prv: number) => {
      latestPR.current = pulseRate;
      latestPRV.current = prv;
      setSessionPulseRate(pulseRate);
      setSessionPRV(prv);
      // NOTE: We no longer reliably compute the final strokeScore locally!
      // The local calculation is just a temporary fallback for UI feedback.
      // The real authoritative score comes from the BFF via the sync and poll loops.
    },
    []
  );

  const startQuickCheck = useCallback(() => {
    // Let the WebcamPPG handle the 30-sec scan and sync to BFF.
    setMode('quick-check');
    setCountdown(30);
  }, []);

  useEffect(() => {
    if (mode === 'quick-check' && countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (mode === 'quick-check' && countdown === 0) {
       // Just wait for BFF sync to finish and auto-revert to idle via polling 
       // but we'll stop the countdown visually.
    }
  }, [mode, countdown]);

  const cancelQuickCheck = useCallback(() => {
    setMode('idle');
    setCountdown(null);
  }, []);

  const toggleActiveMonitoring = useCallback(() => {
    if (mode === 'active') {
      setMode('idle');
    } else if (mode === 'idle') {
      setMode('active');
    }
  }, [mode]);

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
    forceSyncProfile
  };
}
