"use client";

import { Play, Square, Activity, Clock, Power } from 'lucide-react';
import type { CheckResult, MonitoringMode } from './useStrokeMonitoring';
import { useMemo } from 'react';

interface StrokeScoreCardProps {
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
  onStartQuickCheck: () => void;
  onCancelQuickCheck: () => void;
  onToggleActiveMonitoring: () => void;
}

function scoreConfig(score: number | null, triageStatus: 'GREEN' | 'YELLOW' | 'RED' | null) {
  if (triageStatus === 'GREEN') return { color: '#10B981', bg: '#ECFDF5', label: 'LOW RISK', ring: '#10B981' };
  if (triageStatus === 'YELLOW') return { color: '#F59E0B', bg: '#FFFBEB', label: 'MODERATE RISK', ring: '#F59E0B' };
  if (triageStatus === 'RED') return { color: '#EF4444', bg: '#FEF2F2', label: 'HIGH RISK', ring: '#EF4444' };
  
  const displayScore = score ?? 0;
  if (displayScore === 0 && score === null) return { color: '#94A3B8', bg: '#F8FAFC', label: 'NO DATA', ring: '#E2E8F0' };
  if (displayScore < 30) return { color: '#10B981', bg: '#ECFDF5', label: 'LOW RISK', ring: '#10B981' };
  if (displayScore < 60) return { color: '#F59E0B', bg: '#FFFBEB', label: 'MODERATE RISK', ring: '#F59E0B' };
  return { color: '#EF4444', bg: '#FEF2F2', label: 'HIGH RISK', ring: '#EF4444' };
}

function SemicircleGauge({ value, color, bg }: { value: number | null, color: string, bg: string }) {
  const radius = 62;
  const strokeWidth = 8;
  const circumference = Math.PI * radius; // Half circle
  const pct = value !== null ? Math.min(value / 100, 1) : 0;
  const dashoffset = circumference * (1 - pct);

  return (
    <div className="relative flex items-end justify-center" style={{ width: '140px', height: '70px', overflow: 'hidden' }}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="absolute top-0" style={{ transform: 'rotate(180deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="transparent" stroke={bg} strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset="0" strokeLinecap="round" />
        <circle cx="70" cy="70" r={radius} fill="transparent" stroke={color} strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={dashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
      </svg>
      {/* Inner circular background matching semantic light color */}
      <div className="absolute overflow-hidden" style={{ width: '116px', height: '58px', bottom: 0, borderTopLeftRadius: '116px', borderTopRightRadius: '116px', backgroundColor: bg, zIndex: -1 }} />
      
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center translate-y-2">
        <div className="flex items-baseline gap-1" style={{ transform: 'translateY(-12px)' }}>
          <span className="font-mono font-bold text-[32px] leading-none" style={{ color: color }}>
            {value ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function CountdownGauge({ remaining, total }: { remaining: number; total: number }) {
  const radius = 62;
  const strokeWidth = 8;
  const circumference = Math.PI * radius;
  const dashoffset = circumference * (1 - remaining / total);

  return (
    <div className="relative flex items-end justify-center" style={{ width: '140px', height: '70px', overflow: 'hidden' }}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="absolute top-0" style={{ transform: 'rotate(180deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset="0" strokeLinecap="round" />
        <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#0EA5E9" strokeWidth={strokeWidth} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={dashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-end">
        <div className="flex items-baseline gap-1" style={{ transform: 'translateY(-14px)' }}>
          <span className="font-mono font-bold text-[28px] leading-none text-[#0EA5E9]">
            {remaining}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StrokeScoreCard({
  mode, strokeScore, countdown, sessionPulseRate, sessionPRV,
  checkResult, activeMinutesLeft,
  triageStatus, aiAdvice,
  onStartQuickCheck, onCancelQuickCheck, onToggleActiveMonitoring,
}: StrokeScoreCardProps) {
  const cfg = scoreConfig(strokeScore, triageStatus);
  const isActive = mode === 'active';
  const isQuick = mode === 'quick-check';

  const lastUpdatedFormatted = useMemo(() => {
    if (!checkResult) return null;
    return new Date(checkResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [checkResult]);

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] relative overflow-hidden flex flex-col">
      {/* 3px #0EA5E9 top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0EA5E9]" />
      
      <div className="p-[24px] flex-1">
        {aiAdvice && (
          <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-xl border border-indigo-100 flex items-start gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-sans">{aiAdvice}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Left Side: Score Gauge */}
          <div className="flex flex-col items-center w-[140px]">
            {isQuick && countdown !== null ? (
              <CountdownGauge remaining={countdown} total={30} />
            ) : (
              <SemicircleGauge value={strokeScore ?? 0} color={cfg.ring} bg={cfg.bg} />
            )}
            
            <div className="text-center mt-3">
              <span className="font-mono text-[12px] font-bold text-[#94A3B8]">
                {isQuick ? 'SECS' : '/ 100'}
              </span>
              <p className="font-sans font-semibold text-[9px] uppercase text-[#94A3B8] mt-0.5 tracking-[0.05em]">
                {isQuick ? 'MEASURING' : 'RISK SCORE'}
              </p>
            </div>
          </div>

          {/* Right Side: Details Columns */}
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            {/* Left Sub-column */}
            <div className="flex flex-col">
               <p className="font-sans font-medium text-[10px] uppercase text-[#94A3B8] tracking-[0.8px] mb-1">
                 Pulse Rate
               </p>
               <div className="flex items-baseline gap-1 mb-3">
                 <span className="font-mono font-bold text-[22px] text-[#0F172A]">
                   {sessionPulseRate ?? '--'}
                 </span>
                 <span className="font-sans text-[11px] text-[#94A3B8]">bpm</span>
               </div>
               
               <div className="h-[1px] bg-[#F1F5F9] w-full mb-3" />
               
               <div>
                 {isQuick ? (
                     <div className="inline-flex items-center px-[10px] py-1 bg-[#EFF6FF] rounded-full">
                       <span className="font-sans font-bold text-[10px] text-[#0EA5E9] tracking-[0.5px]">CALIBRATING</span>
                     </div>
                 ) : (
                     <div className="inline-flex items-center px-[10px] py-1 rounded-full" style={{ backgroundColor: cfg.bg }}>
                       <span className="font-sans font-bold text-[10px] tracking-[0.5px]" style={{ color: cfg.color }}>{cfg.label}</span>
                     </div>
                 )}
               </div>
            </div>

            {/* Right Sub-column */}
            <div className="flex flex-col">
               <p className="font-sans font-medium text-[10px] uppercase text-[#94A3B8] mb-1">
                 PRV (SDNN)
               </p>
               <div className="flex items-baseline gap-1 mb-3">
                 <span className="font-mono font-bold text-[22px] text-[#0F172A]">
                   {sessionPRV ?? '--'}
                 </span>
                 <span className="font-sans text-[11px] text-[#94A3B8]">ms</span>
               </div>
               
               {lastUpdatedFormatted && !isQuick && (
                 <div className="flex items-center gap-1.5 mt-auto pb-1">
                   <Clock size={10} className="text-[#94A3B8]" />
                   <span className="font-sans text-[11px] text-[#94A3B8]">
                     Last: {lastUpdatedFormatted}
                   </span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-[24px] pb-[24px] flex gap-4">
        {isActive ? (
          <button onClick={onToggleActiveMonitoring}
            className="flex-1 h-[48px] rounded-[8px] bg-[#FEF2F2] border-[#FECACA] border flex items-center justify-center gap-2 transition-colors hover:bg-red-100"
          >
            <Power size={18} className="text-[#EF4444]" />
            <span className="font-sans font-semibold text-[14px] text-[#EF4444]">Stop Monitoring</span>
            {activeMinutesLeft !== null && (
              <span className="font-mono text-[10px] text-[#EF4444] ml-2">({activeMinutesLeft}m)</span>
            )}
          </button>
        ) : isQuick ? (
          <button onClick={onCancelQuickCheck}
            className="flex-1 h-[48px] rounded-[8px] bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-100 font-sans font-semibold text-[14px]"
          >
            <Square size={16} />
            Cancel Measurement
          </button>
        ) : (
          <>
            <button onClick={onStartQuickCheck}
              className="flex-[6] h-[48px] rounded-[8px] bg-[#0EA5E9] flex items-center justify-center gap-2 text-white hover:bg-[#0284C7] transition-colors font-sans font-semibold text-[14px]"
            >
              <Play size={16} fill="white" />
              Quick Check
            </button>
            <button onClick={onToggleActiveMonitoring}
              className="flex-[4] h-[48px] rounded-[8px] bg-white border border-[#E2E8F0] flex items-center justify-center gap-2 text-[#64748B] hover:bg-slate-50 transition-colors font-sans font-semibold text-[14px]"
            >
              <Activity size={16} />
              Monitor
            </button>
          </>
        )}
      </div>
    </div>
  );
}
