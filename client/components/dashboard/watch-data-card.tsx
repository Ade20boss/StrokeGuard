import { Watch } from 'lucide-react';

interface WatchDataCardProps {
  heartRate: number;
  spO2: number;
  hrv: number;
  deviceName?: string;
}

export function WatchDataCard({ heartRate, spO2, hrv, deviceName = 'Oraimo Watch 3' }: WatchDataCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-5 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Watch className="w-[15px] h-[15px] text-[#0EA5E9]" />
          <span 
            className="text-[14px] font-semibold text-[#0F172A]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Live Watch Data
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span 
            className="text-[11px] text-[#10B981]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Connected
          </span>
        </div>
      </div>
      
      <p 
        className="text-[10px] text-[#94A3B8] mb-4"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {deviceName}
      </p>
      
      <div className="grid grid-cols-3 divide-x divide-[#F1F5F9]">
        <div className="flex flex-col items-center py-3">
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Heart Rate
          </span>
          <span 
            className="text-[22px] font-bold text-[#0F172A] my-1"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {heartRate}
          </span>
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            bpm
          </span>
        </div>
        
        <div className="flex flex-col items-center py-3">
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            SpO2
          </span>
          <span 
            className="text-[22px] font-bold text-[#0F172A] my-1"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {spO2}
          </span>
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            %
          </span>
        </div>
        
        <div className="flex flex-col items-center py-3">
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            HRV
          </span>
          <span 
            className="text-[22px] font-bold text-[#0F172A] my-1"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            {hrv}
          </span>
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ms SDNN
          </span>
        </div>
      </div>
      
      <div className="border-t border-[#F1F5F9] mt-4 pt-3 flex items-center justify-between">
        <span 
          className="text-[11px] text-[#94A3B8]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Updated just now
        </span>
        <button 
          className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          View full data
        </button>
      </div>
    </div>
  );
}
