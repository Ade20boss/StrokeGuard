import { Shield, Activity, HeartPulse, Watch, Battery } from 'lucide-react';

interface MetricTilesProps {
  riskScore: number;
  hrv: number;
  hrvStatus: 'healthy' | 'borderline' | 'elevated';
  systolic: number;
  diastolic: number;
  bpStatus: 'normal' | 'elevated';
  deviceName: string;
  deviceConnected: boolean;
  lastSync: string;
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

  // Mini sparkline data for HRV tile (last 5 readings)
  const miniSparkline = [58, 62, 59, 64, hrv];
  const sparklinePoints = miniSparkline.map((val, i) => {
    const x = (i / (miniSparkline.length - 1)) * 40;
    const y = 20 - ((val - 50) / 20) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Tile 1: Stroke Risk Score */}
      <div
        className="bg-white rounded-xl p-5 border relative overflow-hidden"
        style={{
          borderColor: '#E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Decorative corner accent */}
        <div
          className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }}
        />
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            <Shield size={18} style={{ color: '#0EA5E9' }} />
          </div>
          <span
            className="text-[13px]"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#94A3B8',
            }}
          >
            / 100
          </span>
        </div>

        <div className="flex items-baseline gap-1 mb-1">
          <span
            className="text-[28px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {riskScore}
          </span>
        </div>

        <p
          className="text-xs mb-3"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          Stroke Risk Score
        </p>

        {/* Enhanced progress bar with gradient and thumb */}
        <div className="relative mb-2">
          <div
            className="w-full h-2 rounded-xl overflow-hidden"
            style={{ backgroundColor: '#F1F5F9' }}
          >
            <div
              className="h-full rounded-xl transition-all duration-500"
              style={{
                width: `${riskScore}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 60%, #EF4444 100%)',
              }}
            />
          </div>
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3.5 rounded-full border bg-white"
            style={{
              left: `${riskScore}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: '#E2E8F0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          />
        </div>
        
        {/* Axis labels */}
        <div className="flex justify-between">
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#10B981',
            }}
          >
            Low Risk
          </span>
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#EF4444',
            }}
          >
            High Risk
          </span>
        </div>
      </div>

      {/* Tile 2: HRV Today */}
      <div
        className="bg-white rounded-xl p-5 border relative overflow-hidden"
        style={{
          borderColor: '#E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Decorative corner accent */}
        <div
          className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }}
        />
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: hrvConfig[hrvStatus].bg }}
          >
            <Activity size={18} style={{ color: hrvConfig[hrvStatus].color }} />
          </div>
          <span
            className="px-2 py-0.5 text-[11px] font-semibold rounded"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: hrvConfig[hrvStatus].bg,
              color: hrvConfig[hrvStatus].color,
            }}
          >
            {hrvConfig[hrvStatus].label}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="text-[28px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {hrv}
          </span>
          <span
            className="text-[13px]"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#94A3B8',
            }}
          >
            ms
          </span>
        </div>

        <p
          className="text-xs mb-2"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          HRV — SDNN
        </p>
        
        {/* Mini sparkline */}
        <svg width="40" height="20" viewBox="0 0 40 20">
          <polyline
            points={sparklinePoints}
            fill="none"
            stroke={hrvConfig[hrvStatus].color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Tile 3: Blood Pressure */}
      <div
        className="bg-white rounded-xl p-5 border relative overflow-hidden"
        style={{
          borderColor: '#E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Decorative corner accent */}
        <div
          className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }}
        />
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FEF2F2' }}
          >
            <HeartPulse size={18} style={{ color: '#EF4444' }} />
          </div>
          <span
            className="px-2 py-0.5 text-[11px] font-semibold rounded"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: bpConfig[bpStatus].bg,
              color: bpConfig[bpStatus].color,
            }}
          >
            {bpConfig[bpStatus].label}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mb-1">
          {/* Enhanced BP display with different sizes */}
          <span
            className="text-[28px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {systolic}
          </span>
          <span
            className="text-[22px] font-light"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#CBD5E1',
            }}
          >
            /
          </span>
          <span
            className="text-[22px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {diastolic}
          </span>
        </div>

        <p
          className="text-xs mb-0.5"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          Blood Pressure
        </p>
        <p
          className="text-xs"
          style={{
            fontFamily: 'Space Mono, monospace',
            color: '#94A3B8',
          }}
        >
          mmHg
        </p>
      </div>

      {/* Tile 4: Watch Status */}
      <div
        className="bg-white rounded-xl p-5 border relative overflow-hidden"
        style={{
          borderColor: '#E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Decorative corner accent */}
        <div
          className="absolute -top-5 -right-5 w-10 h-10 rounded-full pointer-events-none"
          style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)' }}
        />
        
        <div className="flex items-start justify-between mb-3 relative z-10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFFBEB' }}
          >
            <Watch size={18} style={{ color: '#F59E0B' }} />
          </div>
          {/* Enhanced connected dot with ring */}
          <div className="relative">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: deviceConnected ? '#10B981' : '#94A3B8',
                boxShadow: deviceConnected ? '0 0 0 4px rgba(16, 185, 129, 0.25)' : 'none',
              }}
            />
          </div>
        </div>

        <div className="mb-1">
          <span
            className="text-base font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: deviceConnected ? '#10B981' : '#94A3B8',
            }}
          >
            {deviceConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <p
          className="text-xs mb-2"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          {deviceName}
        </p>
        
        {/* Battery indicator */}
        {deviceConnected && (
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-3 rounded-sm border" style={{ borderColor: '#10B981' }}>
              <div
                className="absolute inset-0.5 rounded-sm"
                style={{
                  backgroundColor: '#10B981',
                  width: '78%',
                }}
              />
              <div
                className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 rounded-r-sm"
                style={{ backgroundColor: '#10B981' }}
              />
            </div>
            <span
              className="text-[11px]"
              style={{
                fontFamily: 'Space Mono, monospace',
                color: '#10B981',
              }}
            >
              78%
            </span>
          </div>
        )}
        
        {!deviceConnected && (
          <p
            className="text-[11px]"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#94A3B8',
            }}
          >
            Last sync: {lastSync}
          </p>
        )}
      </div>
    </div>
  );
}