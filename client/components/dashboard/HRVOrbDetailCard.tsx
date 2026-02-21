"use client";

import { ShieldCheck, Clock, Activity, Heart, Droplet, MoveUpRight } from 'lucide-react';

interface HRVOrbDetailCardProps {
  sdnn: number | null;
  hrvi: number | null;
  restingHR: number | null;
  spO2: number | null;
  deviceName?: string | null;
  sparklineData?: number[];
}

function SimpleSparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[80px] flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">
        <span className="text-xs text-slate-400 font-sans">No data</span>
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 10;
  
  const width = 300; // SVG viewBox width
  const height = 80;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * (height - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-[80px]">
      <svg width="100%" height="80" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

export function HRVOrbDetailCard({
  sdnn,
  hrvi,
  restingHR,
  spO2,
  sparklineData = [58, 62, 55, 60, 64, 59, 62]
}: HRVOrbDetailCardProps) {
  // Safe min/max calculation
  let min7h = '--';
  let max7h = '--';
  if (sparklineData.length > 0) {
    min7h = Math.min(...sparklineData).toString();
    max7h = Math.max(...sparklineData).toString();
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1 - Shield score */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-[64px] h-[64px] rounded-[16px] bg-[#ECFDF5] flex items-center justify-center mb-4">
            <ShieldCheck size={32} className="text-[#10B981]" />
          </div>
          <span className="font-mono font-bold text-[20px] text-[#10B981] mb-1">
            {sdnn !== null ? `${sdnn.toFixed(1)} ms` : '-- ms'}
          </span>
          <h3 className="font-sans font-bold text-[16px] text-[#10B981] mb-1">Healthy</h3>
          <p className="font-sans text-[12px] text-[#64748B] max-w-[180px]">
            Your heart rhythm is strong.
          </p>
        </div>

        {/* Column 2 - PRV Metrics */}
        <div className="flex flex-col">
          <h3 className="font-sans font-semibold text-[14px] text-[#0F172A] mb-0.5">
            Pulse Rate Variability
          </h3>
          <p className="font-sans text-[11px] text-[#94A3B8] mb-4">
            Real-time · No watch
          </p>

          <div className="flex flex-col gap-[12px] flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#64748B]" />
                <span className="font-sans font-medium text-[13px] text-[#64748B]">SDNN</span>
              </div>
              <span className="font-mono text-[13px] text-[#0F172A]">{sdnn !== null ? `${sdnn.toFixed(1)} ms` : '-- ms'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoveUpRight size={14} className="text-[#64748B]" />
                <span className="font-sans font-medium text-[13px] text-[#64748B]">PRVI</span>
              </div>
              <span className="font-mono text-[13px] text-[#0F172A]">{hrvi !== null ? `${hrvi.toFixed(2)}` : '--'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-[#64748B]" />
                <span className="font-sans font-medium text-[13px] text-[#64748B]">Pulse Rate</span>
              </div>
              <span className="font-mono text-[13px] text-[#0F172A]">{restingHR !== null ? restingHR : '--'} pulse/min</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet size={14} className="text-[#64748B]" />
                <span className="font-sans font-medium text-[13px] text-[#64748B]">SpO2</span>
              </div>
              <span className="font-mono text-[13px] text-[#0F172A]">{spO2 !== null ? `${spO2} %` : '-- %'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4">
            <Clock size={10} className="text-[#94A3B8]" />
            <span className="font-sans text-[11px] text-[#94A3B8]">Updated just now</span>
          </div>
        </div>

        {/* Column 3 - 7-Hour Trend */}
        <div className="flex flex-col">
          <h3 className="font-sans font-semibold text-[14px] text-[#0F172A] mb-0.5">
            7-Hour Trend
          </h3>
          <p className="font-sans text-[11px] text-[#94A3B8] mb-4">
            02:00 — 09:00
          </p>

          <SimpleSparkline data={sparklineData} />

          <div className="flex items-center gap-4 mt-auto pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="font-mono text-[11px] text-[#94A3B8]">Min 7h {min7h}ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="font-mono text-[11px] text-[#94A3B8]">Max 7h {max7h}ms</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
