import { Activity, BarChart2, Heart, Droplets, RefreshCw, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { HRVShield } from './hrv-shield';

interface HRVOrbDetailCardProps {
  sdnn: number;
  hrvi: number;
  restingHR: number;
  spO2: number;
  deviceName: string;
  sparklineData: number[];
}

export function HRVOrbDetailCard({
  sdnn,
  hrvi,
  restingHR,
  spO2,
  deviceName,
  sparklineData,
}: HRVOrbDetailCardProps) {
  // Determine status based on SDNN
  const getStatus = () => {
    if (sdnn >= 50) return {
      state: 'healthy' as const,
      color: '#10B981',
      label: 'Healthy',
      message: 'Your heart rhythm is strong. Keep up your routine.',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      icon: CheckCircle,
      halo: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
    };
    if (sdnn >= 20) return {
      state: 'borderline' as const,
      color: '#F59E0B',
      label: 'Borderline',
      message: 'Some variability detected. Rest and stay hydrated.',
      bgColor: '#FFFBEB',
      textColor: '#92400E',
      icon: AlertTriangle,
      halo: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
    };
    return {
      state: 'at-risk' as const,
      color: '#EF4444',
      label: 'At Risk',
      message: 'HRV critically low. Run a FAST Check now.',
      bgColor: '#FEF2F2',
      textColor: '#991B1B',
      icon: AlertCircle,
      halo: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Generate sparkline with threshold coloring
  const generateSparklinePath = () => {
    const width = 100;
    const height = 120;
    const max = 80;
    const min = 0;
    const range = max - min;
    
    const points = sparklineData.map((value, index) => {
      const x = (index / (sparklineData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return { x, y, value };
    });
    
    let path = '';
    points.forEach((point, index) => {
      if (index === 0) {
        path += `M ${point.x},${point.y}`;
      } else {
        path += ` L ${point.x},${point.y}`;
      }
    });
    
    return { path, points };
  };

  const { path: sparklinePath } = generateSparklinePath();

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10)',
        borderTop: '1px solid rgba(14, 165, 233, 0.15)',
      }}
    >
      <div className="grid grid-cols-[35%_38%_27%] divide-x" style={{ borderColor: '#F1F5F9' }}>
        {/* ZONE A — Orb Display */}
        <div className="p-6 flex flex-col items-center justify-center relative">
          {/* Halo background */}
          <div
            className="absolute w-40 h-40 rounded-full pointer-events-none"
            style={{ background: status.halo }}
          />
          
          {/* The Shield - replaces the plain circle orb */}
          <div className="relative z-10 mb-2">
            <HRVShield state={status.state} />
          </div>
          
          {/* Value */}
          <div className="text-center mb-1">
            <span
              className="font-bold"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '22px',
                color: status.color,
              }}
            >
              {sdnn}
            </span>
            <span
              className="ml-1"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '13px',
                color: '#94A3B8',
              }}
            >
              ms
            </span>
          </div>
          
          {/* Status Label */}
          <p
            className="font-bold mb-3"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              color: status.color,
              letterSpacing: '0.3px',
            }}
          >
            {status.label}
          </p>
          
          {/* Encouraging Copy Pill */}
          <div
            className="rounded-full px-3.5 py-2 w-full flex items-start gap-2"
            style={{ backgroundColor: status.bgColor }}
          >
            <StatusIcon size={11} style={{ color: status.color, marginTop: 2, flexShrink: 0 }} />
            <p
              className="text-[12px] leading-snug"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: status.textColor,
              }}
            >
              {status.message}
            </p>
          </div>
        </div>

        {/* ZONE B — Live Metrics Panel */}
        <div className="p-6">
          {/* Zone Header */}
          <div className="mb-4">
            <h3
              className="font-semibold mb-0.5"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#0F172A',
              }}
            >
              Heart Rate Variability
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              >
                Real-time · {deviceName}
              </span>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="space-y-0">
            {/* SDNN Row */}
            <div className="flex items-center justify-between h-11 border-b" style={{ borderColor: '#F8FAFC' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[26px] h-[26px] rounded flex items-center justify-center"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <Activity size={14} style={{ color: '#CBD5E1' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#64748B',
                  }}
                >
                  SDNN
                </span>
              </div>
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '15px',
                  color: status.color,
                }}
              >
                {sdnn} ms
              </span>
            </div>

            {/* HRVI Row */}
            <div className="flex items-center justify-between h-11 border-b" style={{ borderColor: '#F8FAFC' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[26px] h-[26px] rounded flex items-center justify-center"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <BarChart2 size={14} style={{ color: '#CBD5E1' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#64748B',
                  }}
                >
                  HRVI
                </span>
              </div>
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '15px',
                  color: '#0F172A',
                }}
              >
                {hrvi}
              </span>
            </div>

            {/* Resting HR Row */}
            <div className="flex items-center justify-between h-11 border-b" style={{ borderColor: '#F8FAFC' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[26px] h-[26px] rounded flex items-center justify-center"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <Heart size={14} style={{ color: '#CBD5E1' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#64748B',
                  }}
                >
                  Resting HR
                </span>
              </div>
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '15px',
                  color: '#0F172A',
                }}
              >
                {restingHR} bpm
              </span>
            </div>

            {/* SpO2 Row */}
            <div className="flex items-center justify-between h-11">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-[26px] h-[26px] rounded flex items-center justify-center"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <Droplets size={14} style={{ color: '#CBD5E1' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: '#64748B',
                  }}
                >
                  SpO2
                </span>
              </div>
              <span
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '15px',
                  color: '#0F172A',
                }}
              >
                {spO2}%
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1.5 mt-3">
            <RefreshCw size={10} style={{ color: '#CBD5E1' }} />
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11px',
                color: '#94A3B8',
              }}
            >
              Updated just now
            </span>
          </div>
        </div>

        {/* ZONE C — 7-Hour Sparkline */}
        <div className="p-6">
          {/* Zone Header */}
          <div className="mb-3">
            <h3
              className="font-semibold mb-0.5"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#0F172A',
              }}
            >
              7-Hour Trend
            </h3>
            <p
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                color: '#94A3B8',
              }}
            >
              02:00 — 09:14
            </p>
          </div>

          {/* Sparkline Chart */}
          <div className="relative mb-3">
            <svg width="100%" height="120" viewBox="0 0 100 120" preserveAspectRatio="none">
              {/* Reference lines */}
              <line x1="0" y1="105" x2="100" y2="105" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="52.5" x2="100" y2="52.5" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" strokeDasharray="2,2" />
              
              {/* Labels */}
              <text x="102" y="107" fontSize="8" fill="#CBD5E1" fontFamily="Space Mono, monospace">20ms</text>
              <text x="102" y="54" fontSize="8" fill="#CBD5E1" fontFamily="Space Mono, monospace">50ms</text>
              
              {/* Area fill */}
              <path
                d={`${sparklinePath} L 100,120 L 0,120 Z`}
                fill="url(#sparklineGradient)"
              />
              
              {/* Line */}
              <path
                d={sparklinePath}
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <defs>
                <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(14, 165, 233, 0.15)" />
                  <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stat Chips */}
          <div className="flex gap-2">
            <div
              className="flex-1 rounded-lg px-2 py-2"
              style={{ backgroundColor: '#F8FAFC' }}
            >
              <p
                className="mb-1"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '10px',
                  color: '#94A3B8',
                }}
              >
                Min 7h
              </p>
              <p
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '13px',
                  color: '#F59E0B',
                }}
              >
                {Math.min(...sparklineData)} ms
              </p>
            </div>
            <div
              className="flex-1 rounded-lg px-2 py-2"
              style={{ backgroundColor: '#F8FAFC' }}
            >
              <p
                className="mb-1"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '10px',
                  color: '#94A3B8',
                }}
              >
                Max 7h
              </p>
              <p
                className="font-semibold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '13px',
                  color: '#10B981',
                }}
              >
                {Math.max(...sparklineData)} ms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}