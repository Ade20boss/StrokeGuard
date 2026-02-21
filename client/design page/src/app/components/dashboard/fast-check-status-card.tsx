import { Activity, ShieldCheck, Check, Shield, Info } from 'lucide-react';

interface FastCheckStatusCardProps {
  sdnn: number;
  onStartCheck?: () => void;
}

export function FastCheckStatusCard({ sdnn, onStartCheck }: FastCheckStatusCardProps) {
  const isUnlocked = sdnn < 20;

  if (isUnlocked) {
    // Variant B: Unlocked (Red Alert)
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: '#FFFCFC',
          border: '3px solid #EF4444',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <Activity size={16} style={{ color: '#EF4444' }} />
            </div>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#0F172A',
              }}
            >
              FAST Check
            </span>
          </div>
          <span
            className="px-2 py-1 text-[11px] font-semibold rounded-full"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
            }}
          >
            Action Required
          </span>
        </div>

        {/* Message */}
        <p
          className="text-[13px] mb-4"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#334155',
            lineHeight: '1.5',
          }}
        >
          Your HRV has entered the elevated risk zone. Run a FAST Check immediately.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartCheck}
          className="w-full h-[52px] rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-2"
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
          }}
        >
          <span
            className="text-[15px] font-semibold"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Start FAST Check Now
          </span>
          <Activity size={16} />
        </button>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5">
          <Shield size={11} style={{ color: '#94A3B8' }} />
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Camera stays on your device
          </span>
        </div>
      </div>
    );
  }

  // Variant A: Locked (Normal State) - Redesigned with gauge
  // Calculate needle angle (180 degrees = full semicircle, left is green/low, right is red/high)
  const maxSDNN = 80;
  const needleAngle = ((sdnn / maxSDNN) * 180) - 90; // -90 to 90 degrees
  const needleColor = sdnn >= 50 ? '#10B981' : sdnn >= 20 ? '#F59E0B' : '#EF4444';
  
  // Calculate distance to threshold (0-80 scale, 20ms is the threshold)
  const distancePercentage = Math.min((sdnn / 80) * 100, 100);
  const thumbColor = sdnn >= 50 ? '#10B981' : sdnn >= 20 ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="bg-white rounded-2xl p-6"
      style={{
        borderTop: '3px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#F1F5F9' }}
          >
            <ShieldCheck size={16} style={{ color: '#94A3B8' }} />
          </div>
          <span
            className="text-sm font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            FAST Check
          </span>
        </div>
        <span
          className="px-2 py-1 text-[11px] font-semibold rounded-full"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            backgroundColor: '#F1F5F9',
            color: '#94A3B8',
          }}
        >
          Standby
        </span>
      </div>

      {/* SDNN Gauge */}
      <div className="flex flex-col items-center mb-4">
        <p
          className="text-xs mb-3"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          SDNN Level
        </p>
        
        {/* Semicircular Arc Gauge */}
        <div className="relative w-[120px] h-[60px] mb-2">
          <svg width="120" height="60" viewBox="0 0 120 60">
            {/* Arc segments */}
            {/* Green segment (left third) */}
            <path
              d="M 10,60 A 50,50 0 0,1 50,10"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Amber segment (middle third) */}
            <path
              d="M 50,10 A 50,50 0 0,1 90,35"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Red segment (right third) */}
            <path
              d="M 90,35 A 50,50 0 0,1 110,60"
              fill="none"
              stroke="#EF4444"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Needle */}
            <line
              x1="60"
              y1="60"
              x2={60 + Math.cos((needleAngle * Math.PI) / 180) * 45}
              y2={60 + Math.sin((needleAngle * Math.PI) / 180) * 45}
              stroke="#0F172A"
              strokeWidth="2"
            />
            
            {/* Center dot */}
            <circle cx="60" cy="60" r="3" fill="#0F172A" />
          </svg>
        </div>
        
        {/* Value Display */}
        <div className="text-center mb-3">
          <span
            className="text-lg font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: needleColor,
            }}
          >
            {sdnn} ms
          </span>
        </div>
        
        <p
          className="text-[11px] text-center"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          SDNN · Safe zone
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px mb-3" style={{ backgroundColor: '#F1F5F9' }} />

      {/* Condition Rows */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2">
          <Check size={12} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
          <span
            className="text-xs"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Activates when SDNN drops below 20ms
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Check size={12} style={{ color: '#CBD5E1', flexShrink: 0, marginTop: '2px' }} />
          <span
            className="text-xs"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Or when HRVI exceeds threshold
          </span>
        </div>
      </div>

      {/* Distance to Threshold */}
      <div className="mb-3">
        <p
          className="text-[11px] mb-2"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          Distance to alert threshold
        </p>
        
        <div className="relative">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#F1F5F9' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${distancePercentage}%`,
                background: 'linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)',
              }}
            />
          </div>
          
          {/* Thumb indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3.5 rounded-full border bg-white"
            style={{
              left: `${distancePercentage}%`,
              transform: 'translate(-50%, -50%)',
              borderColor: thumbColor,
              backgroundColor: thumbColor,
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          />
          
          {/* Threshold marker and label */}
          <div
            className="absolute -top-1"
            style={{
              left: '25%',
              transform: 'translateX(-50%)',
            }}
          >
            <div
              className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
              style={{ borderTopColor: '#EF4444' }}
            />
          </div>
        </div>
        
        <p
          className="text-[9px] mt-1"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#EF4444',
            marginLeft: '25%',
            transform: 'translateX(-50%)',
          }}
        >
          20 ms threshold
        </p>
      </div>

      {/* Footer */}
      <div
        className="rounded-lg px-3.5 py-2.5 flex items-start gap-2"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <Info size={11} style={{ color: '#94A3B8', marginTop: 1, flexShrink: 0 }} />
        <p
          className="text-[11px]"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          FAST Check will activate automatically when thresholds are breached.
        </p>
      </div>
    </div>
  );
}