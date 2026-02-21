"use client";

import { Shield, Check, Info } from 'lucide-react';

interface FastCheckStatusCardProps {
  sdnn: number | null;
  onStartCheck?: () => void;
}

function SemicircleGaugeWithNeedle({ value }: { value: number }) {
  const radius = 70;
  const strokeWidth = 8;
  const circumference = Math.PI * radius;
  
  // Custom gradient arc for SDNN (Red -> Amber -> Green)
  return (
    <div className="relative flex flex-col items-center justify-end" style={{ width: '160px', height: '80px', overflow: 'hidden' }}>
      <svg width="160" height="160" viewBox="0 0 160 160" className="absolute top-0 rotate-180">
        <defs>
          <linearGradient id="sdnnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <circle 
          cx="80" cy="80" r={radius} 
          fill="transparent" 
          stroke="url(#sdnnGrad)" 
          strokeWidth={strokeWidth} 
          strokeDasharray={`${circumference} ${circumference}`} 
          strokeDashoffset="0" 
          strokeLinecap="round" 
        />
      </svg>
      
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-[2px] h-[30px] bg-[#0F172A] origin-bottom transition-transform duration-1000"
        style={{ transform: `translateX(-50%) rotate(${Math.min(Math.max((value / 100) * 180 - 90, -90), 90)}deg)` }}
      />
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#0F172A]" />
    </div>
  );
}

export function FastCheckStatusCard({ sdnn }: FastCheckStatusCardProps) {
  const displaySDNN = sdnn ?? 60;
  const distancePercentage = Math.min((displaySDNN / 100) * 100, 100);

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] relative overflow-hidden flex flex-col p-[24px]">
      {/* 3px #0EA5E9 top accent border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0EA5E9]" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] rounded-[8px] bg-[#EFF6FF] flex items-center justify-center">
            <Shield size={16} className="text-[#0EA5E9]" />
          </div>
          <span className="font-sans font-semibold text-[15px] text-[#0F172A]">FAST Check</span>
        </div>
        <div className="bg-[#F1F5F9] px-[10px] py-1 rounded-full">
          <span className="font-sans font-medium text-[11px] text-[#64748B]">Standby</span>
        </div>
      </div>

      {/* SDNN Gauge */}
      <div className="flex flex-col items-center mb-6">
        <SemicircleGaugeWithNeedle value={displaySDNN} />
        <span className="font-mono font-bold text-[20px] text-[#0EA5E9] mt-3">
          {displaySDNN} ms
        </span>
        <span className="font-sans text-[11px] text-[#94A3B8] mt-0.5">
          SDNN · Safe zone
        </span>
      </div>

      {/* Threshold Info */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-start gap-2">
          <Check size={14} className="text-[#10B981] mt-[2px] flex-shrink-0" />
          <span className="font-sans text-[12px] text-[#64748B]">Activates when SDNN (PRV) drops below 20ms</span>
        </div>
        <div className="flex items-start gap-2">
          <Check size={14} className="text-[#10B981] mt-[2px] flex-shrink-0" />
          <span className="font-sans text-[12px] text-[#64748B]">Or when PRVI exceeds threshold</span>
        </div>
      </div>

      {/* Distance Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="font-sans font-medium text-[12px] text-[#64748B]">Distance to alert threshold</span>
        </div>
        <div className="h-[8px] w-full bg-gradient-to-r from-[#EF4444] via-[#F59E0B] to-[#10B981] rounded-full relative">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#10B981] rounded-full transition-all duration-1000 shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            style={{ left: `calc(${distancePercentage}% - 6px)` }}
          />
        </div>
        <p className="font-sans text-[10px] text-[#EF4444] mt-1 ml-[20%]">20ms threshold</p>
      </div>

      {/* Footer Note */}
      <div className="flex items-start gap-2 mt-auto">
        <Info size={14} className="text-[#94A3B8] mt-[1px] flex-shrink-0" />
        <p className="font-sans text-[11px] text-[#94A3B8] leading-tight">
          FAST Check will activate automatically when thresholds are breached.
        </p>
      </div>

    </div>
  );
}
