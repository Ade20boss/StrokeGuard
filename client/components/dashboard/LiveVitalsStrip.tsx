"use client";

import { Heart, Droplet, Activity } from 'lucide-react';

interface LiveVitalsStripProps {
  pulseRate: number | null;
  prv: number | null;
  spO2: number | null;
}

export function LiveVitalsStrip({ pulseRate, prv, spO2 }: LiveVitalsStripProps) {
  return (
    <div className="px-8 pb-6 flex items-center gap-3 flex-wrap">
      {/* Chip 1 - Pulse Rate */}
      <div className="h-9 rounded-full bg-[#FEF2F2] border border-[#FECACA] border-[1px] flex items-center px-4 gap-2">
        <Heart size={12} className="text-[#EF4444] fill-[#EF4444]" />
        <div>
          <span className="font-mono font-bold text-[13px] text-[#EF4444]">
            {pulseRate ?? '--'}
          </span>
          {pulseRate !== null && (
            <span className="font-sans text-[11px] text-[#94A3B8] ml-1">pulse/min</span>
          )}
        </div>
        <span className="font-sans text-[10px] text-[#94A3B8] ml-1">Pulse Rate</span>
      </div>

      {/* Chip 2 - SpO2 */}
      <div className="h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] border-[1px] flex items-center px-4 gap-2">
        <Droplet size={12} className="text-[#0EA5E9] fill-[#0EA5E9]" />
        <div>
          <span className="font-mono font-bold text-[13px] text-[#64748B]">
            {spO2 ?? '--'} {spO2 !== null ? '%' : '%'}
          </span>
        </div>
        <span className="font-sans text-[10px] text-[#94A3B8] ml-1">SpO2</span>
      </div>

      {/* Chip 3 - PRV */}
      <div className="h-9 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] border-[1px] flex items-center px-4 gap-2">
        <Activity size={12} className="text-[#10B981]" />
        <div>
          <span className="font-mono font-bold text-[13px] text-[#10B981]">
            {prv ?? '--'}
          </span>
          {prv !== null && (
            <span className="font-sans text-[11px] text-[#94A3B8] ml-1">ms</span>
          )}
        </div>
        <span className="font-sans text-[10px] text-[#94A3B8] ml-1">PRV</span>
      </div>
    </div>
  );
}
