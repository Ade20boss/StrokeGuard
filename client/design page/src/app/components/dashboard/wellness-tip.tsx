import { Lightbulb } from 'lucide-react';

const tip = "Take a 10-minute walk after meals to help regulate blood sugar and support cardiovascular health.";

export function WellnessTip() {
  return (
    <div 
      className="mx-5 rounded-xl p-3.5"
      style={{ backgroundColor: '#EFF6FF' }}
    >
      <div className="flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h4 
            className="text-[11px] font-semibold text-[#0284C7] uppercase"
            style={{ 
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Today's Tip
          </h4>
          <p 
            className="text-[12px] text-[#1E40AF] mt-1 line-clamp-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {tip}
          </p>
          <p 
            className="text-[10px] text-[#60A5FA] mt-1.5"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Source: American Heart Association
          </p>
        </div>
      </div>
    </div>
  );
}
