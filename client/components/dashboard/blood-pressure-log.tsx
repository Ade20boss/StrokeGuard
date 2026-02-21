import { HeartPulse, Plus, Info } from 'lucide-react';

interface BloodPressureLogProps {
  systolic: number;
  diastolic: number;
  status: 'normal' | 'elevated';
  history: number[][];
  averageSystolic: number;
  averageDiastolic: number;
}

export function BloodPressureLog({
  systolic,
  diastolic,
  status,
  history,
  averageSystolic,
  averageDiastolic,
}: BloodPressureLogProps) {
  const statusConfig = {
    normal: { bg: '#ECFDF5', color: '#10B981', label: 'Normal' },
    elevated: { bg: '#FEF2F2', color: '#EF4444', label: 'Elevated' },
  };

  // Generate sparkline path for systolic readings
  const generateSparkline = () => {
    const width = 300;
    const height = 52;
    const padding = 4;
    const values = history.map(([sys]) => sys);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points.replace(/ /g, ' L ')}`;
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 border"
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HeartPulse size={16} style={{ color: '#EF4444' }} />
          <span
            className="text-[15px] font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
            }}
          >
            Blood Pressure
          </span>
        </div>
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <span
            className="text-[13px] font-medium"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#0EA5E9',
            }}
          >
            Log Reading
          </span>
          <Plus size={13} style={{ color: '#0EA5E9' }} />
        </button>
      </div>

      {/* Current Reading */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <span
            className="text-[40px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {systolic}
          </span>
          <span
            className="text-[36px] font-light"
            style={{ color: '#CBD5E1' }}
          >
            /
          </span>
          <span
            className="text-[40px] font-bold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {diastolic}
          </span>
          <span
            className="text-xs ml-2"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            mmHg
          </span>
        </div>
        <span
          className="px-2 py-1 text-[11px] font-semibold rounded"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            backgroundColor: statusConfig[status].bg,
            color: statusConfig[status].color,
          }}
        >
          {statusConfig[status].label}
        </span>
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <svg width="100%" height="52" viewBox="0 0 300 52" preserveAspectRatio="none">
          <path
            d={generateSparkline()}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex items-center justify-between mt-1">
          <span
            className="text-[10px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Last 5 readings
          </span>
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#64748B',
            }}
          >
            Avg: {averageSystolic}/{averageDiastolic}
          </span>
        </div>
      </div>

      {/* 7-day Averages */}
      <div className="flex gap-4 mb-3 pb-3 border-b" style={{ borderColor: '#F1F5F9' }}>
        <div className="flex-1">
          <p
            className="text-[11px] mb-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Systolic avg 7d
          </p>
          <p
            className="text-sm font-semibold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {averageSystolic} mmHg
          </p>
        </div>
        <div className="w-px" style={{ backgroundColor: '#F1F5F9' }} />
        <div className="flex-1">
          <p
            className="text-[11px] mb-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Diastolic avg 7d
          </p>
          <p
            className="text-sm font-semibold"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {averageDiastolic} mmHg
          </p>
        </div>
      </div>

      {/* Target Range */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#94A3B8',
            }}
          >
            Target: below 120/80
          </span>
          <Info size={11} style={{ color: '#CBD5E1' }} />
        </div>
        <span
          className="text-[10px]"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#CBD5E1',
          }}
        >
          Source: AHA
        </span>
      </div>
    </div>
  );
}
