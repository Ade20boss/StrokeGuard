"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { calculateFinalRiskScore, AHABaseline } from "@/lib/risk-logic";

interface HealthProfile {
  bloodPressure: string | null;
  diabetesStatus: string | null;
  smokingStatus: string | null;
  familyHistory: string | null;
  activityLevel: string | null;
}

interface WebcamPPGProps {
  patientId?: string;
  isActiveExternally?: boolean;
  onVitalsUpdate?: (pulseRate: number, prv: number) => void;
  onComplete?: (finalScore?: number) => void;
  healthProfile?: HealthProfile | null;
}

// ── Constants ────────────────────────────────────────────────────────────────
const ROI_BOX_W = 80;
const ROI_BOX_H = 100;
const BUFFER_SIZE = 90;           // 3 s at 30 fps
const MIN_BUFFER_BEFORE_PROCESS = 30; // 1 s of data before we start detecting
const MIN_PEAK_GAP_MS = 400;      // 400 ms minimum between peaks (~150 bpm max)
const MIN_INTERVAL_MS = 330;      // sanity filter low-end
const MAX_INTERVAL_MS = 1500;     // sanity filter high-end (~40 bpm min)
const SYNC_EVERY_N = 6;           // sync after 6 × 5 s = 30 s
const MIN_SIGNAL_RANGE = 0.002;   // below this → no face / static background
const MIN_BRIGHTNESS = 40;        // below this → too dark

export default function WebcamPPG({
  patientId,
  isActiveExternally,
  onVitalsUpdate,
  onComplete,
  healthProfile,
}: WebcamPPGProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // FIX 1: Store processFrame in a ref so the rAF loop always calls the
  // latest version and never holds a stale closure from a previous render.
  const processFrameRef = useRef<() => void>(() => {});

  // Signal state — all in refs to avoid triggering re-renders inside the hot loop
  const rawSignalBuffer = useRef<number[]>([]);
  const pulseTimesRef = useRef<number[]>([]);
  const isRisingRef = useRef(false);
  const lastPeakTimeRef = useRef(0);
  const syncCountRef = useRef(0);
  const accumulatedPulseRatesRef = useRef<number[]>([]);
  const accumulatedPrvRef = useRef<number[]>([]);

  // FIX 4: healthProfile in a ref so the sync interval always uses the latest
  // value even if it loads asynchronously after the scan starts.
  const healthProfileRef = useRef<HealthProfile | null>(healthProfile ?? null);
  useEffect(() => { healthProfileRef.current = healthProfile ?? null; }, [healthProfile]);

  const [status, setStatus] = useState("Initializing camera...");
  const [currentBpm, setCurrentBpm] = useState<number | string>("--");
  const [signalQuality, setSignalQuality] = useState<"waiting" | "poor" | "good">("waiting");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // ── Stop camera ──────────────────────────────────────────────────────────
  // FIX 2: Wrapped in useCallback so its reference is stable and can be safely
  // included in dependency arrays and called from interval closures.
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Processing loop ──────────────────────────────────────────────────────
  // FIX 1: The actual processing logic is assigned to processFrameRef.current
  // on every render. The rAF loop calls processFrameRef.current(), which always
  // points to the freshest closure with up-to-date state and props.
  useEffect(() => {
    processFrameRef.current = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrameRef.current);
        return;
      }

      // Sync canvas size to video output once per size change
      if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(processFrameRef.current);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Forehead ROI — center top region
      const startX = (canvas.width - ROI_BOX_W) / 2;
      const startY = canvas.height * 0.15;

      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 3;
      ctx.strokeRect(startX, startY, ROI_BOX_W, ROI_BOX_H);

      const frame = ctx.getImageData(startX, startY, ROI_BOX_W, ROI_BOX_H);
      const data = frame.data;
      const pixelCount = data.length / 4;

      let totalR = 0, totalG = 0, totalB = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
      }

      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;
      const brightness = (avgR + avgG + avgB) / 3;

      // ── FIX 5a: Darkness check ──────────────────────────────────────────
      if (brightness < MIN_BRIGHTNESS) {
        setStatus("Too dark — move to better lighting");
        setSignalQuality("poor");
        animFrameRef.current = requestAnimationFrame(processFrameRef.current);
        return;
      }

      const ratiometricSignal = avgG / (avgR + avgB + 0.001);

      rawSignalBuffer.current.push(ratiometricSignal);
      if (rawSignalBuffer.current.length > BUFFER_SIZE) rawSignalBuffer.current.shift();

      if (rawSignalBuffer.current.length < MIN_BUFFER_BEFORE_PROCESS) {
        animFrameRef.current = requestAnimationFrame(processFrameRef.current);
        return;
      }

      // ── FIX 5b: Static background / no-face detection ──────────────────
      // If the signal in the ROI is completely flat, there's no face there.
      const bufMin = Math.min(...rawSignalBuffer.current);
      const bufMax = Math.max(...rawSignalBuffer.current);
      const signalRange = bufMax - bufMin;

      if (signalRange < MIN_SIGNAL_RANGE) {
        setStatus("No face detected — center your face in the frame");
        setSignalQuality("poor");
        setCurrentBpm("--");
        // Clear pulse history so we don't compute a score from noise
        pulseTimesRef.current = [];
        animFrameRef.current = requestAnimationFrame(processFrameRef.current);
        return;
      }

      const bufferMean = rawSignalBuffer.current.reduce((a, b) => a + b, 0) / rawSignalBuffer.current.length;
      const current = rawSignalBuffer.current[rawSignalBuffer.current.length - 1];
      const previous = rawSignalBuffer.current[rawSignalBuffer.current.length - 2];
      const now = performance.now();

      // Peak detection
      if (current > previous) {
        isRisingRef.current = true;
      } else if (
        isRisingRef.current &&
        current < previous &&
        current > bufferMean &&
        now - lastPeakTimeRef.current > MIN_PEAK_GAP_MS
      ) {
        isRisingRef.current = false;
        lastPeakTimeRef.current = now;
        pulseTimesRef.current.push(now);

        if (pulseTimesRef.current.length >= 2) {
          const lastInterval = now - pulseTimesRef.current[pulseTimesRef.current.length - 2];
          if (lastInterval > MIN_INTERVAL_MS && lastInterval < MAX_INTERVAL_MS) {
            const bpm = Math.round(60000 / lastInterval);
            setCurrentBpm(bpm);
            setSignalQuality("good");
          }
        }

        if (pulseTimesRef.current.length > 30) pulseTimesRef.current.shift();
      }

      const peakCount = pulseTimesRef.current.length;
      if (peakCount === 0) {
        setStatus("Hold still — detecting your pulse...");
      } else if (peakCount < 5) {
        setStatus(`Detecting pulse... ${peakCount} beats captured`);
      } else if (peakCount < 10) {
        setStatus("Good signal — keep still for best accuracy");
      } else {
        setStatus("Measuring — syncing every 5 seconds");
      }

      animFrameRef.current = requestAnimationFrame(processFrameRef.current);
    };
  }); // No dep array — runs after every render to keep the ref fresh

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(() => {
    syncCountRef.current = 0;
    accumulatedPulseRatesRef.current = [];
    accumulatedPrvRef.current = [];
    rawSignalBuffer.current = [];
    pulseTimesRef.current = [];
    isRisingRef.current = false;
    lastPeakTimeRef.current = 0;
    setIsCompleted(false);
    setCurrentBpm("--");
    setSignalQuality("waiting");
    setStatus("Requesting camera access...");

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
      })
      .then(async (stream) => {
        setHasPermission(true);
        setIsScanning(true);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStatus("Place your face in the camera view and hold still");
          try {
            await videoRef.current.play();
            // FIX 1: Start the rAF loop via the ref, not a direct function call
            animFrameRef.current = requestAnimationFrame(processFrameRef.current);
          } catch (e) {
            console.error("Video autoplay blocked:", e);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setHasPermission(false);
        setStatus("Camera access denied. Please allow camera access and try again.");
        setSignalQuality("poor");
      });
  }, []);

  // Sync external active state
  useEffect(() => {
    if (isActiveExternally === true && !isScanning) startCamera();
    else if (isActiveExternally === false && isScanning) stopCamera();
  }, [isActiveExternally, isScanning, startCamera, stopCamera]);

  // ── Sync to backend every 5 seconds ──────────────────────────────────────
  useEffect(() => {
    if (!isScanning) return;

    const syncInterval = setInterval(() => {
      syncCountRef.current += 1;

      const times = pulseTimesRef.current;
      
      // If we have valid pulses in this interval, process them
      if (times.length >= 5) {
        const ppIntervals: number[] = [];
        const pulseRates: number[] = [];

        for (let i = 1; i < times.length; i++) {
          const interval = Math.round(times[i] - times[i - 1]);
          if (interval > MIN_INTERVAL_MS && interval < MAX_INTERVAL_MS) {
            ppIntervals.push(interval);
            pulseRates.push(parseFloat((60000 / interval).toFixed(1)));
          }
        }

        if (pulseRates.length >= 3) {
          const mean = ppIntervals.reduce((a, b) => a + b, 0) / ppIntervals.length;
          const variance = ppIntervals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / ppIntervals.length;
          const prvScore = parseFloat(Math.sqrt(variance).toFixed(2));
          const avgPulseRate = parseFloat(
            (pulseRates.reduce((a, b) => a + b, 0) / pulseRates.length).toFixed(1),
          );

          accumulatedPulseRatesRef.current.push(...pulseRates);
          accumulatedPrvRef.current.push(prvScore);

          if (onVitalsUpdate) onVitalsUpdate(avgPulseRate, prvScore);
        }
      }

      // ── Stop condition: 6 intervals × 5s = 30s strict time ──
      if (syncCountRef.current >= SYNC_EVERY_N) {
        setIsCompleted(true);
        // FIX 2: stopCamera is stable via useCallback — safe to call here
        stopCamera();
        setStatus("Finalizing sync...");

        const finalPulseRates = [...accumulatedPulseRatesRef.current];

        // FIX 3: Abort if we have insufficient real data rather than padding
        // with duplicates (which artificially collapses PRV toward zero).
        if (finalPulseRates.length < 10) {
          console.warn("[WebcamPPG] Insufficient pulse data — aborting sync.");
          setStatus("Not enough signal detected. Please try again in better lighting.");
          if (onComplete) onComplete();
          return;
        }

        const finalPrv =
          accumulatedPrvRef.current.reduce((a, b) => a + b, 0) /
          accumulatedPrvRef.current.length || 0;
        const currentPulseRate = finalPulseRates[finalPulseRates.length - 1];

        // FIX 4: Read from ref — always has the latest healthProfile value
        const hp = healthProfileRef.current;
        const baseline: AHABaseline = {
          bloodPressure: hp?.bloodPressure || "",
          diabetesStatus: hp?.diabetesStatus || "no",
          smokingStatus: hp?.smokingStatus || "never",
          familyHistory: hp?.familyHistory || "no",
          activityLevel: hp?.activityLevel || "3-4",
        };

        const riskResult = calculateFinalRiskScore(baseline, {
          pulseRate: currentPulseRate,
          sdnnMs: finalPrv,
          pulseRateHistory: finalPulseRates,
          isExercising: false,
        });

        console.info("[WebcamPPG] Risk computed:", riskResult);

        fetch("/api/internal/vitals/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pulseRates: finalPulseRates,
            prvScore: finalPrv,
            isExercising: false,
            source: "rppg_webcam",
            mode: "QUICK_CHECK",
            lifestyleScore: riskResult.lifestyle,
            finalRiskScore: riskResult.total,
            riskLevel: riskResult.riskLevel,
            systolic: hp?.bloodPressure?.split("/").map(Number)[0] || 120,
            diastolic: hp?.bloodPressure?.split("/").map(Number)[1] || 80,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.info("[WebcamPPG] Sync success:", data);
            if (onComplete) onComplete(riskResult.total);
          })
          .catch((err) => {
            console.error("[WebcamPPG] Sync error:", err);
            if (onComplete) onComplete();
          });
      }
    }, 5000);

    return () => clearInterval(syncInterval);
    // FIX 2: stopCamera is now stable (useCallback) so it's safe as a dep
  }, [isScanning, onVitalsUpdate, onComplete, stopCamera]);

  // ── Render ────────────────────────────────────────────────────────────────
  const qualityStyles: Record<string, React.CSSProperties> = {
    good:    { background: "#ECFDF5", color: "#065F46" },
    poor:    { background: "#FEF2F2", color: "#991B1B" },
    waiting: { background: "#F1F5F9", color: "#475569" },
  };
  const qualityLabel =
    signalQuality === "good" ? "● Signal Good"
    : signalQuality === "poor" ? "● Poor Signal"
    : "● Waiting...";

  if (isCompleted) return null;

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-[280px] h-full relative"
      style={{ backgroundColor: "#0F172A", padding: "16px" }}
    >
      {!isScanning && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p className="text-slate-300 text-sm text-center px-4">
            We need camera access to measure your pulse rate and PRV for the daily check.
          </p>
          <button
            onClick={startCamera}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            Start Camera Scan
          </button>
          {hasPermission === false && (
            <p className="text-red-400 text-xs mt-2 font-medium">Camera access was denied.</p>
          )}
        </div>
      )}

      {/* Video + canvas always in DOM so refs are immediately available */}
      <div style={{ position: "relative", display: isScanning ? "inline-block" : "none" }}>
        <video ref={videoRef} width="640" height="480" autoPlay playsInline muted className="hidden" />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            transform: "scaleX(-1)",
            borderRadius: "12px",
            border: "2px solid #1E293B",
            maxWidth: "100%",
            maxHeight: "220px",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {isScanning && (
        <>
          <div
            style={{
              ...qualityStyles[signalQuality],
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: "100px",
              marginTop: "12px",
              marginBottom: "4px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.3px",
            }}
          >
            {qualityLabel}
          </div>

          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <span style={{ color: "#EF4444", fontSize: "36px", fontFamily: "monospace", fontWeight: "bold" }}>
              {currentBpm}
            </span>
            <span style={{ color: "#94A3B8", fontSize: "14px", marginLeft: "6px" }}>pulse/min</span>
          </div>

          <p style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>
            PRV computed from pulse intervals · Source: webcam rPPG
          </p>
          <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "6px" }}>{status}</p>
        </>
      )}
    </div>
  );
}
