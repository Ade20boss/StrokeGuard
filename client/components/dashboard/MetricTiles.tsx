"use client";

import { Shield, Activity, HeartPulse, Watch } from 'lucide-react';

interface MetricTilesProps {
  riskScore: number;
  hrv: number | null;
  hrvStatus: 'healthy' | 'borderline' | 'elevated';
  systolic: number | null;
  diastolic: number | null;
  bpStatus: 'normal' | 'elevated';
  deviceName: string | null;
  deviceConnected: boolean;
  lastSync: string | null;
  onConnectWatch?: () => void;
}

export function MetricTiles({
  riskScore,
  hrv,
  hrvStatus,
  systolic,
  diastolic,
  bpStatus,
  deviceName,
  deviceConnected,
  lastSync,
  onConnectWatch,
}: MetricTilesProps) {
  const hrvConfig = {
    healthy: { color: '#10B981', bg: '#ECFDF5', label: 'Healthy' },
    borderline: { color: '#F59E0B', bg: '#FFFBEB', label: 'Borderline' },
    elevated: { color: '#EF4444', bg: '#FEF2F2', label: 'At Risk' },
  };
  const bpConfig = {
    normal: { color: '#10B981', bg: '#ECFDF5', label: 'Normal' },
    elevated: { color: '#EF4444', bg: '#FEF2F2', label: 'Elevated' },
  };

  const miniSparkline = [58, 62, 59, 64, hrv ?? 62];
  const sparklinePoints = miniSparkline
    .map((val, i) => {
      const x = (i / (miniSparkline.length - 1)) * 40;
      const y = 20 - ((val - 50) / 20) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  const tileStyle = {
    borderColor: '#E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Stroke Risk Score */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border relative overflow-hidden" style={tileStyle}>
        <div className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }} />
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
            <Shield size={16} style={{ color: '#0EA5E9' }} />
          </div>
          <span className="text-[12px] sm:text-[13px]" style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>/ 100</span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[26px] sm:text-[28px] font-bold" style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}>{riskScore}</span>
        </div>
        <p className="text-xs mb-3" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>Stroke Risk Score</p>
        <div className="relative mb-2">
          <div className="w-full h-2 rounded-xl overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
            <div className="h-full rounded-xl transition-all duration-500" style={{ width: `${riskScore}%`, background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 60%, #EF4444 100%)' }} />
          </div>
          <div
            className="absolute top-1/2 w-3 h-3.5 rounded-full border bg-white"
            style={{ left: `${riskScore}%`, transform: 'translate(-50%, -50%)', borderColor: '#E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] sm:text-[11px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}>Low Risk</span>
          <span className="text-[10px] sm:text-[11px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#EF4444' }}>High Risk</span>
        </div>
      </div>

      {/* PRV Today */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border relative overflow-hidden" style={tileStyle}>
        <div className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }} />
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: hrvConfig[hrvStatus].bg }}>
            <Activity size={16} style={{ color: hrvConfig[hrvStatus].color }} />
          </div>
          <span
            className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded"
            style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: hrvConfig[hrvStatus].bg, color: hrvConfig[hrvStatus].color }}
          >
            {hrvConfig[hrvStatus].label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[26px] sm:text-[28px] font-bold" style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}>{hrv ?? '--'}</span>
          <span className="text-[12px] sm:text-[13px]" style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>ms</span>
        </div>
        <p className="text-xs mb-2" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>PRV — SDNN</p>
        <svg width="40" height="20" viewBox="0 0 40 20">
          <polyline points={sparklinePoints} fill="none" stroke={hrvConfig[hrvStatus].color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Blood Pressure */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border relative overflow-hidden" style={tileStyle}>
        <div className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }} />
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
            <HeartPulse size={16} style={{ color: '#EF4444' }} />
          </div>
          <span
            className="px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold rounded"
            style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: bpConfig[bpStatus].bg, color: bpConfig[bpStatus].color }}
          >
            {bpConfig[bpStatus].label}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-[22px] sm:text-[28px] font-bold" style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}>{systolic ?? '--'}</span>
          <span className="text-[18px] sm:text-[22px] font-light" style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}>/</span>
          <span className="text-[22px] sm:text-[22px] font-bold" style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}>{diastolic ?? '--'}</span>
        </div>
        <p className="text-xs mb-0.5" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>Blood Pressure</p>
        <p className="text-xs" style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>mmHg</p>
      </div>

      {/* Watch Status — clickable to connect */}
      <button
        onClick={!deviceConnected ? onConnectWatch : undefined}
        className="bg-white rounded-xl p-4 sm:p-5 border relative overflow-hidden text-left transition-all duration-200"
        style={{
          ...tileStyle,
          cursor: deviceConnected ? 'default' : 'pointer',
        }}
        title={deviceConnected ? 'Watch connected' : 'Click to connect watch'}
      >
        <div className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }} />
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFFBEB' }}>
            <Watch size={16} style={{ color: '#F59E0B' }} />
          </div>
          <div
            className="w-2.5 h-2.5 rounded-full mt-1"
            style={{
              backgroundColor: deviceConnected ? '#10B981' : '#94A3B8',
              boxShadow: deviceConnected ? '0 0 0 4px rgba(16, 185, 129, 0.25)' : 'none',
            }}
          />
        </div>
        <div className="mb-1">
          <span
            className="text-sm sm:text-base font-semibold"
            style={{ fontFamily: 'DM Sans, sans-serif', color: deviceConnected ? '#10B981' : '#94A3B8' }}
          >
            {deviceConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <p className="text-xs mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
          {deviceName || 'No watch paired'}
        </p>
        {!deviceConnected && (
          <p className="text-[11px] font-medium" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}>
            Tap to connect →
          </p>
        )}
        {deviceConnected && (
          <p className="text-[11px]" style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>
            Last sync: {lastSync}
          </p>
        )}
      </button>
    </div>
  );
}
