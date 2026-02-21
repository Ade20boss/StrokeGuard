import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  User,
  Users,
  ChevronRight,
  Camera,
  Circle,
  CheckCircle,
  AlertCircle,
  Shield,
  MoveHorizontal,
  Activity,
  ArrowRight,
  Phone,
  Send,
  Info,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/sidebar';
import { PageTopBar } from '../components/dashboard/page-top-bar';
import { StepProgress } from '../components/fast-check/step-progress';

type CheckMode = 'self' | 'other' | null;
type TestResult = 'clear' | 'flagged' | null;

interface FASTResults {
  face: TestResult;
  arm: TestResult;
  speech: TestResult;
  timestamp: string;
}

export default function FASTCheck() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<CheckMode>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [results, setResults] = useState<FASTResults>({
    face: null,
    arm: null,
    speech: null,
    timestamp: '',
  });
  const [speechTimer, setSpeechTimer] = useState(0);
  const [speechRunning, setSpeechRunning] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Auto-advance to result
      if (step === 1) {
        // Simulate face test result (random for demo)
        setResults((prev) => ({
          ...prev,
          face: Math.random() > 0.7 ? 'flagged' : 'clear',
        }));
        setCountdown(null);
      } else if (step === 2) {
        // Simulate arm test result
        setResults((prev) => ({
          ...prev,
          arm: Math.random() > 0.7 ? 'flagged' : 'clear',
        }));
        setCountdown(null);
      }
    }
  }, [countdown, step]);

  // Speech timer
  useEffect(() => {
    if (speechRunning) {
      const timer = setInterval(() => {
        setSpeechTimer((prev) => prev + 0.1);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [speechRunning]);

  const handleBeginCheck = () => {
    if (mode) {
      setStep(1);
      setCountdown(5);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      setCountdown(10);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setResults((prev) => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setStep(4);
    }
  };

  const handleSpeechConfirmation = (result: 'clear' | 'flagged') => {
    setResults((prev) => ({ ...prev, speech: result }));
    setSpeechRunning(false);
  };

  const hasAnyFlags =
    results.face === 'flagged' ||
    results.arm === 'flagged' ||
    results.speech === 'flagged';

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F4F6FA' }}>
      <Sidebar activePage="fast-check" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageTopBar breadcrumbSecond="FAST Check" />
        
        {step > 0 && <StepProgress currentStep={step} onCancel={() => navigate('/dashboard')} />}

        <div className="flex-1 overflow-y-auto">
          {/* STEP 0 — Mode Selector */}
          {step === 0 && (
            <div className="flex justify-center pt-12">
              <div className="w-full max-w-[520px] px-6">
                <h1
                  className="text-[28px] font-bold text-center mb-2"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  Who are you checking?
                </h1>
                <p
                  className="text-[15px] text-center mb-6"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                >
                  Select a mode to begin the FAST assessment.
                </p>

                {/* Disclaimer Banner */}
                <div
                  className="rounded-xl border p-5 mb-6 flex items-start gap-3"
                  style={{
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FECACA',
                  }}
                >
                  <AlertCircle size={15} style={{ color: '#EF4444', marginTop: 2 }} />
                  <p
                    className="text-[13px] flex-1"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#EF4444' }}
                  >
                    This is a structured awareness check, not a medical diagnosis. If you have any
                    concern, call emergency services immediately.
                  </p>
                </div>

                {/* Mode Cards */}
                <div className="flex gap-5 mb-6">
                  <button
                    onClick={() => setMode('self')}
                    className="flex-1 rounded-2xl p-8 text-center transition-all"
                    style={{
                      backgroundColor: mode === 'self' ? '#EFF6FF' : '#FFFFFF',
                      border: mode === 'self' ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                      boxShadow:
                        mode === 'self'
                          ? '0 4px 16px rgba(14, 165, 233, 0.15)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <User size={36} style={{ color: '#0EA5E9', margin: '0 auto 12px' }} />
                    <h3
                      className="text-lg font-semibold mb-1.5"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Check Myself
                    </h3>
                    <p
                      className="text-[13px]"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Run the FAST test on yourself using your front camera and sensors.
                    </p>
                  </button>

                  <button
                    onClick={() => setMode('other')}
                    className="flex-1 rounded-2xl p-8 text-center transition-all"
                    style={{
                      backgroundColor: mode === 'other' ? '#EFF6FF' : '#FFFFFF',
                      border: mode === 'other' ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                      boxShadow:
                        mode === 'other'
                          ? '0 4px 16px rgba(14, 165, 233, 0.15)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Users size={36} style={{ color: '#0EA5E9', margin: '0 auto 12px' }} />
                    <h3
                      className="text-lg font-semibold mb-1.5"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Check Someone Else
                    </h3>
                    <p
                      className="text-[13px]"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Guide another person through each test step by step.
                    </p>
                  </button>
                </div>

                {/* Begin Button */}
                <button
                  onClick={handleBeginCheck}
                  disabled={!mode}
                  className="w-full h-[52px] rounded-lg flex items-center justify-center gap-2 transition-opacity"
                  style={{
                    backgroundColor: mode ? '#0EA5E9' : '#94A3B8',
                    opacity: mode ? 1 : 0.45,
                    cursor: mode ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                  >
                    Begin FAST Check
                  </span>
                  <ChevronRight size={18} style={{ color: '#FFFFFF' }} />
                </button>
                <p
                  className="text-xs text-center mt-3"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                >
                  Takes approximately 2 minutes
                </p>
              </div>
            </div>
          )}

          {/* STEP 1 — Face Test */}
          {step === 1 && (
            <div className="grid grid-cols-[52%_48%] gap-6 p-8">
              {/* Left — Camera Zone */}
              <div>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div
                    className="relative aspect-[4/3] flex items-center justify-center"
                    style={{ backgroundColor: '#0A1628' }}
                  >
                    <div className="text-center">
                      <Camera size={48} style={{ color: 'rgba(255,255,255,0.3)', margin: '0 auto 12px' }} />
                      <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                        Camera feed would appear here
                      </p>
                    </div>
                    {/* Bottom Strip */}
                    <div
                      className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-3"
                      style={{ backgroundColor: 'rgba(10, 22, 40, 0.75)' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#10B981' }} />
                        <span
                          className="text-[11px]"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.8)' }}
                        >
                          Camera active — on device only
                        </span>
                      </div>
                      <Shield size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </div>
                  </div>
                </div>

                {/* Countdown or Result */}
                <div className="mt-6 flex justify-center">
                  {countdown !== null ? (
                    <div className="text-center relative">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E2E8F0"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#0EA5E9"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(countdown / 5) * 351.86} 351.86`}
                          style={{ transition: 'stroke-dasharray 1s linear' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="text-[64px] font-bold leading-none"
                          style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                        >
                          {countdown}
                        </span>
                        <span
                          className="text-[13px] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                        >
                          seconds remaining
                        </span>
                      </div>
                    </div>
                  ) : results.face ? (
                    <div className="w-full">
                      <div
                        className="rounded-2xl border p-4 flex items-start gap-3"
                        style={{
                          backgroundColor: results.face === 'clear' ? '#ECFDF5' : '#FEF2F2',
                          borderColor: results.face === 'clear' ? '#A7F3D0' : '#FECACA',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                      >
                        {results.face === 'clear' ? (
                          <>
                            <CheckCircle size={20} style={{ color: '#10B981' }} />
                            <div className="flex-1">
                              <p
                                className="text-sm font-semibold mb-1"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#065F46' }}
                              >
                                No asymmetry detected.
                              </p>
                              <p
                                className="text-xs"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#064E3B' }}
                              >
                                Facial symmetry appears normal.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={20} style={{ color: '#EF4444' }} />
                            <div className="flex-1">
                              <p
                                className="text-sm font-semibold mb-1"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#991B1B' }}
                              >
                                Asymmetry observed.
                              </p>
                              <p
                                className="text-xs"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7F1D1D' }}
                              >
                                One or more facial landmarks showed asymmetry.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <p
                        className="text-[11px] text-center mt-3"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        This is an observational aid only. If anything looks unusual, seek help immediately.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Right — Instruction Panel */}
              <div className="flex flex-col">
                <h2
                  className="text-[22px] font-bold mb-1"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  F — Face
                </h2>
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                  >
                    F
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    A
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    S
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    T
                  </span>
                </div>

                {/* Instruction Card */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Camera size={16} style={{ color: '#0EA5E9', marginTop: 2 }} />
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Look directly at the camera and smile naturally.
                    </p>
                  </div>
                  <div className="space-y-1.5 ml-6">
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Hold your face still and level
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Smile gently — show both sides of your face
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Hold for 5 seconds while the scan runs
                      </p>
                    </div>
                  </div>
                </div>

                {/* What We're Checking */}
                <p
                  className="text-[13px] font-semibold mb-2"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  What we're checking
                </p>
                <div
                  className="rounded-xl p-3 mb-5"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Left–right facial symmetry
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      {results.face ? (results.face === 'clear' ? '✓' : '✗') : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Eye and mouth droop
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      {results.face ? (results.face === 'clear' ? '✓' : '✗') : '—'}
                    </span>
                  </div>
                </div>

                {/* Privacy Callout */}
                <div
                  className="rounded-xl p-3 mb-5"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <div className="flex items-start gap-2">
                    <Shield size={14} style={{ color: '#0EA5E9', marginTop: 1 }} />
                    <p
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#1E40AF' }}
                    >
                      Video is processed entirely on your device. Nothing is transmitted.
                    </p>
                  </div>
                </div>

                <div className="flex-1" />

                {/* Actions */}
                <button
                  onClick={handleNextStep}
                  disabled={!results.face}
                  className="w-full h-12 rounded-lg flex items-center justify-between px-5 mb-3 transition-opacity"
                  style={{
                    backgroundColor: results.face ? '#0EA5E9' : '#CBD5E1',
                    opacity: results.face ? 1 : 0.5,
                    cursor: results.face ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span
                    className="text-[15px] font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                  >
                    Next — Arm Test
                  </span>
                  <ArrowRight size={18} style={{ color: '#FFFFFF' }} />
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#94A3B8' }}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Arm Test */}
          {step === 2 && (
            <div className="grid grid-cols-[52%_48%] gap-6 p-8">
              {/* Left — Sensor Visualizer */}
              <div>
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                    >
                      Accelerometer Active
                    </span>
                  </div>

                  {/* Arm Bars */}
                  <div className="space-y-6">
                    <div>
                      <p
                        className="text-xs mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: '#64748B' }}
                      >
                        Left Arm
                      </p>
                      <div
                        className="h-3 rounded-full relative"
                        style={{ backgroundColor: '#F1F5F9' }}
                      >
                        <div
                          className="absolute h-full rounded-full"
                          style={{
                            backgroundColor: '#10B981',
                            width: '50%',
                            left: '25%',
                          }}
                        />
                      </div>
                      <p
                        className="text-xs mt-1.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                      >
                        No drift
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-xs mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: '#64748B' }}
                      >
                        Right Arm
                      </p>
                      <div
                        className="h-3 rounded-full relative"
                        style={{ backgroundColor: '#F1F5F9' }}
                      >
                        <div
                          className="absolute h-full rounded-full"
                          style={{
                            backgroundColor: '#10B981',
                            width: '50%',
                            left: '25%',
                          }}
                        />
                      </div>
                      <p
                        className="text-xs mt-1.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                      >
                        No drift
                      </p>
                    </div>
                  </div>
                </div>

                {/* Countdown or Result */}
                <div className="mt-6 flex justify-center">
                  {countdown !== null ? (
                    <div className="text-center relative">
                      <svg className="w-32 h-32 -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E2E8F0"
                          strokeWidth="4"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#0EA5E9"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${(countdown / 10) * 351.86} 351.86`}
                          style={{ transition: 'stroke-dasharray 1s linear' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="text-[64px] font-bold leading-none"
                          style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                        >
                          {countdown}
                        </span>
                        <span
                          className="text-[13px] mt-1"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                        >
                          seconds remaining
                        </span>
                      </div>
                    </div>
                  ) : results.arm ? (
                    <div className="w-full">
                      <div
                        className="rounded-2xl border p-4 flex items-start gap-3"
                        style={{
                          backgroundColor: results.arm === 'clear' ? '#ECFDF5' : '#FEF2F2',
                          borderColor: results.arm === 'clear' ? '#A7F3D0' : '#FECACA',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                        }}
                      >
                        {results.arm === 'clear' ? (
                          <>
                            <CheckCircle size={20} style={{ color: '#10B981' }} />
                            <div className="flex-1">
                              <p
                                className="text-sm font-semibold mb-1"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#065F46' }}
                              >
                                No drift detected.
                              </p>
                              <p
                                className="text-xs"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#064E3B' }}
                              >
                                Both arms remained stable.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={20} style={{ color: '#EF4444' }} />
                            <div className="flex-1">
                              <p
                                className="text-sm font-semibold mb-1"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#991B1B' }}
                              >
                                Drift detected.
                              </p>
                              <p
                                className="text-xs"
                                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7F1D1D' }}
                              >
                                One arm showed drifting or weakness.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <p
                        className="text-[11px] text-center mt-3"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        This is an observational aid only. If anything looks unusual, seek help immediately.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Right — Instruction Panel */}
              <div className="flex flex-col">
                <h2
                  className="text-[22px] font-bold mb-1"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  A — Arm
                </h2>
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                  >
                    F✓
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                  >
                    A
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    S
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    T
                  </span>
                </div>

                {/* Instruction Card */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <MoveHorizontal size={16} style={{ color: '#0EA5E9', marginTop: 2 }} />
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Hold both arms straight out in front of you.
                    </p>
                  </div>
                  <div className="space-y-1.5 ml-6">
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Stretch arms forward at shoulder height
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Keep both arms level and as still as possible
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Circle size={8} style={{ color: '#0EA5E9', marginTop: 5 }} fill="#0EA5E9" />
                      <p
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                      >
                        Hold for 10 seconds while sensors read
                      </p>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center mb-5">
                  <svg width="100" height="80" viewBox="0 0 100 80">
                    <ellipse cx="50" cy="40" rx="15" ry="25" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="35" y1="40" x2="5" y2="40" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="65" y1="40" x2="95" y2="40" stroke="#CBD5E1" strokeWidth="2" />
                  </svg>
                </div>

                {/* What We're Checking */}
                <p
                  className="text-[13px] font-semibold mb-2"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  What we're checking
                </p>
                <div
                  className="rounded-xl p-3 mb-5"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Left arm drift vs right arm
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      {results.arm ? (results.arm === 'clear' ? '✓' : '✗') : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Tremor or weakness signals
                    </span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      {results.arm ? (results.arm === 'clear' ? '✓' : '✗') : '—'}
                    </span>
                  </div>
                </div>

                {/* Privacy Callout */}
                <div
                  className="rounded-xl p-3 mb-5"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <div className="flex items-start gap-2">
                    <Activity size={14} style={{ color: '#0EA5E9', marginTop: 1 }} />
                    <p
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#1E40AF' }}
                    >
                      Accelerometer data is processed locally. No data leaves your device.
                    </p>
                  </div>
                </div>

                <div className="flex-1" />

                {/* Actions */}
                <button
                  onClick={handleNextStep}
                  disabled={!results.arm}
                  className="w-full h-12 rounded-lg flex items-center justify-between px-5 mb-3 transition-opacity"
                  style={{
                    backgroundColor: results.arm ? '#0EA5E9' : '#CBD5E1',
                    opacity: results.arm ? 1 : 0.5,
                    cursor: results.arm ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span
                    className="text-[15px] font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                  >
                    Next — Speech Test
                  </span>
                  <ArrowRight size={18} style={{ color: '#FFFFFF' }} />
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="text-center"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#94A3B8' }}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Speech Test */}
          {step === 3 && (
            <div className="flex justify-center pt-10">
              <div className="w-full max-w-[560px] px-6">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                  >
                    F✓
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                  >
                    A✓
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                  >
                    S
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
                  >
                    T
                  </span>
                </div>

                {/* Phrase Card */}
                <div
                  className="rounded-2xl p-9 mb-5 text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <p
                    className="text-sm font-semibold uppercase mb-4"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#64748B',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Read this phrase out loud
                  </p>
                  <p
                    className="text-[28px] font-bold mb-4"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    "You know it is noon in New York"
                  </p>
                  <p
                    className="text-[13px]"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                  >
                    Read it clearly and at your normal pace.
                  </p>
                </div>

                {/* Timer Section */}
                {!speechRunning && results.speech === null ? (
                  <div>
                    <button
                      onClick={() => setSpeechRunning(true)}
                      className="w-full h-[52px] rounded-lg mb-3"
                      style={{ backgroundColor: '#0EA5E9' }}
                    >
                      <span
                        className="text-base font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                      >
                        Start Timer
                      </span>
                    </button>
                    <p
                      className="text-xs text-center"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      The timer begins when you tap — stop it when you finish speaking.
                    </p>
                  </div>
                ) : speechRunning ? (
                  <div className="text-center">
                    <p
                      className="text-[48px] font-bold mb-2"
                      style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                    >
                      {speechTimer.toFixed(1)}
                    </p>
                    <p
                      className="text-[13px] mb-4"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Tap when you finish reading
                    </p>
                    <button
                      onClick={() => setSpeechRunning(false)}
                      className="w-full h-[52px] rounded-lg mb-2"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      <span
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                      >
                        I Finished
                      </span>
                    </button>
                    <p
                      className="text-[11px]"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      Typical completion time is 3–5 seconds
                    </p>
                  </div>
                ) : !speechRunning && results.speech === null ? (
                  <div
                    className="rounded-xl p-5 mb-5"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <p
                      className="text-[15px] font-semibold text-center mb-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Did the speech sound normal?
                    </p>
                    <p
                      className="text-[13px] text-center mb-4"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      If checking someone else, assess their speech now.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSpeechConfirmation('clear')}
                        className="h-12 rounded-lg"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          Yes — sounded normal
                        </span>
                      </button>
                      <button
                        onClick={() => handleSpeechConfirmation('flagged')}
                        className="h-12 rounded-lg"
                        style={{ backgroundColor: '#EF4444' }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          No — sounded off
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Result Card */}
                {results.speech && (
                  <div className="mb-5">
                    <div
                      className="rounded-2xl border p-4 flex items-start gap-3 mb-3"
                      style={{
                        backgroundColor: results.speech === 'clear' ? '#ECFDF5' : '#FEF2F2',
                        borderColor: results.speech === 'clear' ? '#A7F3D0' : '#FECACA',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      {results.speech === 'clear' ? (
                        <>
                          <CheckCircle size={20} style={{ color: '#10B981' }} />
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold mb-1"
                              style={{ fontFamily: 'DM Sans, sans-serif', color: '#065F46' }}
                            >
                              Speech sounded normal.
                            </p>
                            <p
                              className="text-xs"
                              style={{ fontFamily: 'DM Sans, sans-serif', color: '#064E3B' }}
                            >
                              No slurring or difficulty detected.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={20} style={{ color: '#EF4444' }} />
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold mb-1"
                              style={{ fontFamily: 'DM Sans, sans-serif', color: '#991B1B' }}
                            >
                              Speech difficulty observed.
                            </p>
                            <p
                              className="text-xs"
                              style={{ fontFamily: 'DM Sans, sans-serif', color: '#7F1D1D' }}
                            >
                              Speech sounded slurred or unclear.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <p
                      className="text-[11px] text-center mb-5"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      If speech sounded slurred, slow, or unusual in any way — seek help immediately.
                    </p>

                    <button
                      onClick={handleNextStep}
                      className="w-full h-[52px] rounded-lg mb-3"
                      style={{ backgroundColor: '#0EA5E9' }}
                    >
                      <span
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                      >
                        See Results
                      </span>
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="text-center w-full"
                      style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#94A3B8' }}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 — Results */}
          {step === 4 && (
            <div className="flex justify-center pt-10 pb-10">
              <div className="w-full max-w-[600px] px-6">
                <div className="flex items-center gap-2 mb-6 justify-center">
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: results.face === 'clear' ? '#10B981' : '#EF4444' }}
                  >
                    F{results.face === 'clear' ? '✓' : '✗'}
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: results.arm === 'clear' ? '#10B981' : '#EF4444' }}
                  >
                    A{results.arm === 'clear' ? '✓' : '✗'}
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: results.speech === 'clear' ? '#10B981' : '#EF4444' }}
                  >
                    S{results.speech === 'clear' ? '✓' : '✗'}
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                  >
                    T
                  </span>
                </div>

                {/* Results Summary Card */}
                <div
                  className="rounded-2xl p-7 mb-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <h2
                    className="text-[22px] font-bold mb-1"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    FAST Check Complete
                  </h2>
                  <p
                    className="text-xs mb-6"
                    style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                  >
                    Completed at {results.timestamp} · 21 Feb 2026
                  </p>

                  {/* Result Rows */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: results.face === 'clear' ? '#10B981' : '#EF4444' }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          F
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold flex-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Face Symmetry
                      </span>
                      <span
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: results.face === 'clear' ? '#ECFDF5' : '#FEF2F2',
                          color: results.face === 'clear' ? '#10B981' : '#EF4444',
                        }}
                      >
                        {results.face === 'clear' ? 'Clear' : 'Asymmetry Observed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: results.arm === 'clear' ? '#10B981' : '#EF4444' }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          A
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold flex-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Arm Stability
                      </span>
                      <span
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: results.arm === 'clear' ? '#ECFDF5' : '#FEF2F2',
                          color: results.arm === 'clear' ? '#10B981' : '#EF4444',
                        }}
                      >
                        {results.arm === 'clear' ? 'No Drift' : 'Drift Detected'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: results.speech === 'clear' ? '#10B981' : '#EF4444' }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          S
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold flex-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Speech
                      </span>
                      <span
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: results.speech === 'clear' ? '#ECFDF5' : '#FEF2F2',
                          color: results.speech === 'clear' ? '#10B981' : '#EF4444',
                        }}
                      >
                        {results.speech === 'clear' ? 'Normal' : 'Affected'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 py-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#0EA5E9' }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                        >
                          T
                        </span>
                      </div>
                      <span
                        className="text-sm font-semibold flex-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Time Recorded
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#64748B' }}
                      >
                        {results.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Overall Outcome Banner */}
                  <div
                    className="rounded-xl border p-5 flex items-start gap-3 mt-4"
                    style={{
                      backgroundColor: hasAnyFlags ? '#FEF2F2' : '#ECFDF5',
                      borderColor: hasAnyFlags ? '#FECACA' : '#A7F3D0',
                    }}
                  >
                    {hasAnyFlags ? (
                      <>
                        <AlertCircle size={20} style={{ color: '#EF4444', marginTop: 2 }} />
                        <div className="flex-1">
                          <p
                            className="text-base font-semibold mb-1"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#991B1B' }}
                          >
                            One or more warning signs were flagged.
                          </p>
                          <p
                            className="text-[13px]"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#7F1D1D' }}
                          >
                            Do not wait. Contact emergency services or a medical professional immediately.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} style={{ color: '#10B981', marginTop: 2 }} />
                        <div className="flex-1">
                          <p
                            className="text-base font-semibold mb-1"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#065F46' }}
                          >
                            No warning signs detected.
                          </p>
                          <p
                            className="text-[13px]"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#064E3B' }}
                          >
                            Stay alert. If any new symptoms appear, run another check or call emergency services.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {hasAnyFlags ? (
                  <div className="space-y-3 mb-5">
                    <button
                      className="w-full h-14 rounded-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      <Phone size={18} style={{ color: '#FFFFFF' }} />
                      <span
                        className="text-base font-bold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                      >
                        Call Emergency Services Now
                      </span>
                    </button>
                    <button
                      className="w-full h-12 rounded-lg flex items-center justify-center gap-2 border"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#EF4444',
                      }}
                    >
                      <Send size={16} style={{ color: '#EF4444' }} />
                      <span
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#EF4444' }}
                      >
                        Alert Emergency Contact
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-[52px] rounded-lg mb-5"
                    style={{ backgroundColor: '#0EA5E9' }}
                  >
                    <span
                      className="text-[15px] font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                    >
                      Back to Dashboard
                    </span>
                  </button>
                )}

                <button
                  className="text-center w-full mb-5"
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, color: '#0EA5E9' }}
                >
                  Save this result to history
                </button>

                {/* Critical Disclaimer */}
                <div
                  className="rounded-xl p-4 flex items-start gap-2"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <Info size={13} style={{ color: '#94A3B8', marginTop: 2 }} />
                  <p
                    className="text-xs"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    StrokeGuard is a wellness awareness tool. It does not diagnose stroke. If you have any concern
                    regardless of this result, contact emergency services or a doctor.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
