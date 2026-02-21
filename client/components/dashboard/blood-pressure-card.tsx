import { HeartPulse, Clock } from 'lucide-react';

interface BloodPressureCardProps {
  systolic: number;
  diastolic: number;
  lastLogged: string;
  history: number[];
}

type BPStatus = 'normal' | 'elevated' | 'high';

export function BloodPressureCard({ systolic, diastolic, lastLogged, history }: BloodPressureCardProps) {
  const getStatus = (): BPStatus => {
    if (systolic >= 130 || diastolic >= 80) return 'high';
    if (systolic >= 120 || diastolic >= 75) return 'elevated';
    return 'normal';
  };

  const status = getStatus();

  const statusConfig = {
    normal: {
      label: 'Normal',
      bgColor: '#ECFDF5',
      textColor: '#10B981'
    },
    elevated: {
      label: 'Elevated',
      bgColor: '#FFFBEB',
      textColor: '#F59E0B'
    },
    high: {
      label: 'High',
      bgColor: '#FEF2F2',
      textColor: '#EF4444'
    }
  };

  const config = statusConfig[status];

  // Simple chart path generation
  const chartPoints = history.map((value, index) => {
    const x = (index / (history.length - 1)) * 100;
    const y = 40 - ((value - 110) / 30) * 40; // Normalized to chart height
    return `${x},${y}`;
  }).join(' ');

  return (
    <div 
      className="bg-white rounded-2xl p-6 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-[15px] h-[15px] text-[#0EA5E9]" />
          <span 
            className="text-[14px] font-semibold text-[#0F172A]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Blood Pressure
          </span>
        </div>
        
        <button 
          className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Log Reading
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span 
            className="text-[32px] font-bold text-[#0F172A]"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {systolic}
          </span>
          <span 
            className="text-[24px] text-[#CBD5E1]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            /
          </span>
          <span 
            className="text-[32px] font-bold text-[#0F172A]"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {diastolic}
          </span>
        </div>
        
        <span 
          className="text-[12px] text-[#94A3B8]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          mmHg
        </span>
        
        <div 
          className="ml-auto px-2.5 py-1 rounded"
          style={{ backgroundColor: config.bgColor }}
        >
          <span 
            className="text-[11px] font-semibold"
            style={{ 
              fontFamily: 'DM Sans, sans-serif',
              color: config.textColor
            }}
          >
            {config.label}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mb-4">
        <Clock className="w-[11px] h-[11px] text-[#94A3B8]" />
        <span 
          className="text-[11px] text-[#94A3B8]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Last logged: {lastLogged}
        </span>
      </div>
      
      {/* Mini chart */}
      <div className="mb-4">
        <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline
            points={chartPoints}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      
      <div className="border-t border-[#F1F5F9] pt-3 flex items-center justify-between">
        <span 
          className="text-[11px] text-[#94A3B8]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Normal range: below 120/80
        </span>
        <span 
          className="text-[10px] text-[#CBD5E1]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          AHA
        </span>
      </div>
    </div>
  );
}
