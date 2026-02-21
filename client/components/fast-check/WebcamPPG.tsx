"use client";

import React, { useEffect, useRef, useState } from "react";

export default function WebcamPPG({
  patientId,
  isActiveExternally,
  onVitalsUpdate,
  onComplete,
}: {
  patientId?: string;
  isActiveExternally?: boolean;
  onVitalsUpdate?: (pulseRate: number, prv: number) => void;
  onComplete?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState("Initializing camera...");
  const [currentBpm, setCurrentBpm] = useState<number | string>("--");
  const [signalQuality, setSignalQuality] = useState<"waiting" | "poor" | "good">("waiting");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Signal buffers
  const rawSignalBuffer = useRef<number[]>([]);
  const pulseTimesRef = useRef<number[]>([]);
  const isRisingRef = useRef(false);
  const lastPeakTimeRef = useRef(0);
  const syncCountRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  
  // Accumulated backend vitals
  const accumulatedPulseRatesRef = useRef<number[]>([]);
  const accumulatedPrvRef = useRef<number[]>([]);

  const startCamera = () => {
    setStatus("Requesting camera access...");
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
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
            processFrame();
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
  };

  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Sync external active state with internal camera state
  useEffect(() => {
    if (isActiveExternally === true && !isScanning) {
      startCamera();
    } else if (isActiveExternally === false && isScanning) {
      stopCamera();
    }
  }, [isActiveExternally, isScanning]);

  // ── 2. Processing loop ───────────────────────────────────
    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        // Sync canvas dims to actual video output once
        if (canvas.width !== video.videoWidth && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Forehead ROI — center top region
          const boxW = 80;
          const boxH = 100;
          const startX = (canvas.width - boxW) / 2;
          const startY = canvas.height * 0.15;

          // Draw the targeting box
          ctx.strokeStyle = "#00FF00";
          ctx.lineWidth = 3;
          ctx.strokeRect(startX, startY, boxW, boxH);

          // Sample pixels in the ROI
          const frame = ctx.getImageData(startX, startY, boxW, boxH);
          const data = frame.data;

          let totalR = 0, totalG = 0, totalB = 0;
          const pixelCount = data.length / 4;
          for (let i = 0; i < data.length; i += 4) {
            totalR += data[i];
            totalG += data[i + 1];
            totalB += data[i + 2];
          }

          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;

          // Check lighting quality
          const brightness = (avgR + avgG + avgB) / 3;
          if (brightness < 40) {
            setStatus("Too dark — move to better lighting");
            setSignalQuality("poor");
            animationFrameIdRef.current = requestAnimationFrame(processFrame);
            return;
          }

          // Ratiometric signal — isolates pulse, cancels lighting noise
          const ratiometricSignal = avgG / (avgR + avgB + 0.001);

          // Raw signal buffer — 3 seconds at 30fps
          rawSignalBuffer.current.push(ratiometricSignal);
          if (rawSignalBuffer.current.length > 90) {
            rawSignalBuffer.current.shift();
          }

          // Need at least 1 second of data before processing
          if (rawSignalBuffer.current.length < 30) {
            animationFrameIdRef.current = requestAnimationFrame(processFrame);
            return;
          }

          // Dynamic threshold — mean of buffer
          const bufferMean =
            rawSignalBuffer.current.reduce((a, b) => a + b, 0) /
            rawSignalBuffer.current.length;

          const current = rawSignalBuffer.current[rawSignalBuffer.current.length - 1];
          const previous = rawSignalBuffer.current[rawSignalBuffer.current.length - 2];
          const now = performance.now();
          const minPeakGap = 400; // minimum 400ms between peaks

          // Peak detection
          if (current > previous) {
            isRisingRef.current = true;
          } else if (
            isRisingRef.current &&
            current < previous &&
            current > bufferMean &&
            now - lastPeakTimeRef.current > minPeakGap
          ) {
            // Valid peak
            isRisingRef.current = false;
            lastPeakTimeRef.current = now;
            pulseTimesRef.current.push(now);

            if (pulseTimesRef.current.length >= 2) {
              const lastInterval =
                now - pulseTimesRef.current[pulseTimesRef.current.length - 2];
              if (lastInterval > 330 && lastInterval < 1500) {
                const bpm = Math.round(60000 / lastInterval);
                setCurrentBpm(bpm);
                setSignalQuality("good");
              }
            }

            if (pulseTimesRef.current.length > 30) {
              pulseTimesRef.current.shift();
            }
          }

          // Status updates
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
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    // ── 3. Sync to backend every 5 seconds ───────────────────
    useEffect(() => {
    if (!isScanning) return;
    const syncInterval = setInterval(() => {
      const times = pulseTimesRef.current;
      if (times.length < 5) return;

      const ppIntervals: number[] = [];
      const pulseRates: number[] = [];

      for (let i = 1; i < times.length; i++) {
        const interval = Math.round(times[i] - times[i - 1]);
        if (interval > 330 && interval < 1500) {
          ppIntervals.push(interval);
          pulseRates.push(parseFloat((60000 / interval).toFixed(1)));
        }
      }

      if (pulseRates.length < 3) return;

      // Compute PRV (Pulse Rate Variability)
      const mean = ppIntervals.reduce((a, b) => a + b, 0) / ppIntervals.length;
      const variance =
        ppIntervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        ppIntervals.length;
      const prvScore = parseFloat(Math.sqrt(variance).toFixed(2));

      // Average pulse rate for this batch
      const avgPulseRate = parseFloat(
        (pulseRates.reduce((a, b) => a + b, 0) / pulseRates.length).toFixed(1)
      );
      
      // Accumulate for backend sync
      accumulatedPulseRatesRef.current.push(...pulseRates);
      accumulatedPrvRef.current.push(prvScore);

      // Notify parent (e.g. Dashboard Stroke Score) for live UI updates
      if (onVitalsUpdate) {
        onVitalsUpdate(avgPulseRate, prvScore);
      }

      syncCountRef.current += 1;
      
      // Stop and sync to backend after 30 seconds (6 intervals)
      if (syncCountRef.current === 6) { 
         setIsCompleted(true);
         stopCamera();
         setStatus("Finalizing sync...");

         const finalPulseRates = accumulatedPulseRatesRef.current;
         // Ensure we have at least 30 readings, duplicate last if slightly short
         while (finalPulseRates.length > 0 && finalPulseRates.length < 30) {
           finalPulseRates.push(finalPulseRates[finalPulseRates.length - 1]);
         }
         
         const finalPrv = accumulatedPrvRef.current.reduce((a, b) => a + b, 0) / accumulatedPrvRef.current.length || 0;

         fetch("/api/internal/vitals/sync", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             pulseRates: finalPulseRates,
             prvScore: finalPrv,
             isExercising: false,
             source: "rppg_webcam",
             mode: "QUICK_CHECK"
           }),
         })
           .then((res) => res.json())
           .then((data) => {
             console.log("BFF Sync success:", data);
             if (onComplete) onComplete();
           })
           .catch((err) => {
             console.error("BFF Sync error:", err);
             if (onComplete) onComplete();
           });
      }
    }, 5000);

    // ── 4. Cleanup ───────────────────────────────────────────
    return () => {
      clearInterval(syncInterval);
    };
  }, [patientId, isScanning, onVitalsUpdate, onComplete]);

  const qualityStyles: Record<string, React.CSSProperties> = {
    good:    { background: "#ECFDF5", color: "#065F46" },
    poor:    { background: "#FEF2F2", color: "#991B1B" },
    waiting: { background: "#F1F5F9", color: "#475569" },
  };
  const qualityLabel =
    signalQuality === "good" ? "● Signal Good"
    : signalQuality === "poor" ? "● Poor Signal"
    : "● Waiting...";

  if (isCompleted) {
    return null; // Hide the component when scanning is complete
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[280px] h-full relative" style={{ backgroundColor: "#0F172A", padding: "16px" }}>

      {!isScanning && (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <p className="text-slate-300 text-sm text-center px-4">
              We need to access your camera to measure your pulse rate and PRV for the daily check.
            </p>
            <button
               onClick={startCamera}
               className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg transition-colors flex items-center gap-2"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
               Start Camera Scan
            </button>
            {hasPermission === false && (
                <p className="text-red-400 text-xs mt-2 font-medium">Camera access was denied.</p>
            )}
        </div>
      )}

      {/* Camera canvas and video always rendered so refs are immediately available */}
      <div style={{ position: "relative", display: isScanning ? "inline-block" : "none" }}>
        <video
          ref={videoRef}
          width="640"
          height="480"
          autoPlay
          playsInline
          muted
          className="hidden"
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            transform: "scaleX(-1)", // Mirror view
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
          {/* Signal quality pill */}
          <div
            style={{
              ...qualityStyles[signalQuality],
              display: "inline-block",
              padding: "4px 14px",
              borderRadius: "100px",
              marginBottom: "12px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.3px",
            }}
          >
            {qualityLabel}
          </div>

          {/* Live pulse rate display */}
          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <span style={{ color: "#EF4444", fontSize: "36px", fontFamily: "monospace", fontWeight: "bold" }}>
              {currentBpm}
            </span>
            <span style={{ color: "#94A3B8", fontSize: "14px", marginLeft: "6px" }}>pulse/min</span>
          </div>

          {/* PRV note */}
          <p style={{ color: "#64748B", fontSize: "12px", marginTop: "4px" }}>
            PRV computed from pulse intervals · Source: webcam rPPG
          </p>

          {/* Status message */}
          <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "6px" }}>{status}</p>
        </>
      )}
    </div>
  );
}
