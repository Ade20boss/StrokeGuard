import { Heart, Droplets, Activity } from 'lucide-react';

interface HeroBannerProps {
  userName: string;
  heartRate: number;
  spO2: number;
  hrv: number;
  sdnn: number;
  onFastCheckClick?: () => void;
}

export function HeroBanner({ userName, heartRate, spO2, hrv, sdnn, onFastCheckClick }: HeroBannerProps) {
  const isFastCheckActive = sdnn < 20;

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[120px] px-8 py-6"
      style={{
        background: 'linear-gradient(135deg, #0D2240 0%, #0E4A7A 55%, #0EA5E9 100%)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full -translate-y-1/3 translate-x-1/3"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
      />
      <div
        className="absolute top-0 right-20 w-[80px] h-[80px] rounded-full -translate-y-1/4"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
      />

      <div className="relative z-10 flex items-center justify-between h-full">
        {/* Left: Greeting and Stats */}
        <div>
          <h1
            className="text-[26px] font-bold text-white mb-1"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Good morning, {userName}.
          </h1>
          <p
            className="text-[13px] mb-2.5"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            Saturday, 21 February 2026
          </p>

          {/* Stat Chips */}
          <div className="flex gap-3">
            {/* Heart Rate Chip */}
            <div
              className="flex flex-col gap-1 px-4.5 py-2.5 rounded-full transition-all cursor-pointer hover:bg-opacity-90"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Heart size={14} style={{ color: 'rgba(239, 68, 68, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '15px',
                    color: '#FFFFFF',
                  }}
                >
                  {heartRate}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: 'rgba(255, 255, 255, 0.65)',
                  }}
                >
                  bpm
                </span>
              </div>
              <span
                className="text-[10px]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'rgba(255, 255, 255, 0.50)',
                  letterSpacing: '0.3px',
                }}
              >
                Heart Rate
              </span>
            </div>

            {/* SpO2 Chip */}
            <div
              className="flex flex-col gap-1 px-4.5 py-2.5 rounded-full transition-all cursor-pointer hover:bg-opacity-90"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Droplets size={14} style={{ color: 'rgba(14, 165, 233, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '15px',
                    color: '#FFFFFF',
                  }}
                >
                  {spO2}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: 'rgba(255, 255, 255, 0.65)',
                  }}
                >
                  %
                </span>
              </div>
              <span
                className="text-[10px]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'rgba(255, 255, 255, 0.50)',
                  letterSpacing: '0.3px',
                }}
              >
                SpO2
              </span>
            </div>

            {/* HRV Chip */}
            <div
              className="flex flex-col gap-1 px-4.5 py-2.5 rounded-full transition-all cursor-pointer hover:bg-opacity-90"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Activity size={14} style={{ color: 'rgba(16, 185, 129, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '15px',
                    color: '#FFFFFF',
                  }}
                >
                  {hrv}
                </span>
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: 'rgba(255, 255, 255, 0.65)',
                  }}
                >
                  ms
                </span>
              </div>
              <span
                className="text-[10px]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'rgba(255, 255, 255, 0.50)',
                  letterSpacing: '0.3px',
                }}
              >
                HRV
              </span>
            </div>
          </div>
        </div>

        {/* Right: FAST Check Button */}
        <button
          onClick={onFastCheckClick}
          disabled={!isFastCheckActive}
          className="h-10 px-5 rounded-lg flex items-center gap-2 transition-all duration-200"
          style={{
            backgroundColor: isFastCheckActive ? '#EF4444' : 'rgba(255, 255, 255, 0.15)',
            border: isFastCheckActive ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
            opacity: isFastCheckActive ? 1 : 0.5,
            animation: isFastCheckActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
          }}
        >
          <Activity size={14} style={{ color: '#FFFFFF' }} />
          <span
            className="text-[13px] font-semibold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Run FAST Check
          </span>
        </button>
      </div>
    </div>
  );
}