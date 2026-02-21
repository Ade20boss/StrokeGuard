"use client";

import { Heart, Droplets, Activity } from 'lucide-react';

interface HeroBannerProps {
  userName: string;
  heartRate: number | null;
  spO2: number | null;
  hrv: number | null;
  sdnn: number | null;
  onFastCheckClick?: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

export function HeroBanner({ userName, heartRate, spO2, hrv, sdnn, onFastCheckClick }: HeroBannerProps) {
  const isFastCheckActive = sdnn !== null && sdnn < 20;
  const firstName = userName.split(' ')[0] || 'there';
  const greeting = getGreeting();

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="relative rounded-2xl overflow-hidden px-5 sm:px-8 py-6 sm:py-7"
      style={{
        background: 'linear-gradient(135deg, #0D2240 0%, #0E4A7A 55%, #0EA5E9 100%)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full -translate-y-1/3 translate-x-1/3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }} />
      <div className="absolute top-0 right-20 w-[80px] h-[80px] rounded-full -translate-y-1/4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left — greeting + vitals */}
        <div>
          <h1
            className="text-2xl sm:text-[26px] font-bold text-white mb-1"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {greeting}, {firstName}.
          </h1>
          <p
            className="text-[13px] mb-3 sm:mb-4"
            style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.65)' }}
          >
            {dateStr}
          </p>

          {/* Vitals chips */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Heart Rate */}
            <div
              className="flex flex-col gap-0.5 px-3 sm:px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Heart size={13} style={{ color: 'rgba(239, 68, 68, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#FFFFFF' }}
                >
                  {heartRate !== null ? heartRate : '--'}
                </span>
                <span className="text-xs" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.65)' }}>
                  pulse/min
                </span>
              </div>
              <span className="text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.50)', letterSpacing: '0.3px' }}>
                Pulse Rate
              </span>
            </div>

            {/* SpO2 */}
            <div
              className="flex flex-col gap-0.5 px-3 sm:px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Droplets size={13} style={{ color: 'rgba(14, 165, 233, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#FFFFFF' }}
                >
                  {spO2 !== null ? spO2 : '--'}
                </span>
                <span className="text-xs" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.65)' }}>
                  %
                </span>
              </div>
              <span className="text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.50)', letterSpacing: '0.3px' }}>
                SpO2
              </span>
            </div>

            {/* HRV */}
            <div
              className="flex flex-col gap-0.5 px-3 sm:px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-1">
                <Activity size={13} style={{ color: 'rgba(16, 185, 129, 0.8)' }} />
                <span
                  className="font-semibold"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#FFFFFF' }}
                >
                  {hrv !== null ? hrv : '--'}
                </span>
                <span className="text-xs" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.65)' }}>
                  ms
                </span>
              </div>
              <span className="text-[10px]" style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255, 255, 255, 0.50)', letterSpacing: '0.3px' }}>
                PRV
              </span>
            </div>
          </div>
        </div>

        {/* Right — FAST Check button */}
        <button
          onClick={onFastCheckClick}
          disabled={!isFastCheckActive}
          className="self-start sm:self-center h-10 px-5 rounded-lg flex items-center gap-2 transition-all duration-200"
          style={{
            backgroundColor: isFastCheckActive ? '#EF4444' : 'rgba(255, 255, 255, 0.15)',
            border: isFastCheckActive ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
            opacity: isFastCheckActive ? 1 : 0.6,
            cursor: isFastCheckActive ? 'pointer' : 'not-allowed',
          }}
        >
          <Activity size={14} style={{ color: '#FFFFFF' }} />
          <span className="text-[13px] font-semibold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {isFastCheckActive ? 'Run FAST Check!' : 'FAST Check'}
          </span>
        </button>
      </div>
    </div>
  );
}
