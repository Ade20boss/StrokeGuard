import { Timer } from 'lucide-react';
import { useState } from 'react';

export function TimerCard() {
  const [isActive, setIsActive] = useState(false);
  
  if (!isActive) {
    return (
      <div 
        className="bg-white rounded-xl p-5 mx-5 border border-[#E2E8F0]"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center flex-shrink-0">
              <Timer className="w-4 h-4 text-[#F59E0B]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 
                className="text-[14px] font-semibold text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                I'm OK Timer
              </h3>
              <p 
                className="text-[12px] text-[#64748B] mt-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Set a check-in — contacts are alerted if you don't confirm.
              </p>
            </div>
          </div>
          
          <button 
            className="text-[13px] font-medium text-[#0EA5E9] whitespace-nowrap ml-3 hover:text-[#0284C7]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => setIsActive(true)}
          >
            Set Timer
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white rounded-xl p-5 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center flex-shrink-0 relative">
            <Timer className="w-4 h-4 text-[#F59E0B]" />
            <div className="absolute inset-0 rounded-lg border-2 border-[#F59E0B]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="text-[14px] font-semibold text-[#0F172A]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Check in by 16:45
            </h3>
            <p 
              className="text-[15px] font-bold text-[#F59E0B] mt-1"
              style={{ fontFamily: 'Space Mono, monospace' }}
            >
              in 1h 23m
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-3">
          <button 
            className="h-[30px] px-3 rounded-lg bg-[#10B981] text-white text-[13px] font-medium whitespace-nowrap hover:bg-[#059669]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => setIsActive(false)}
          >
            I'm OK
          </button>
          <button 
            className="h-[30px] px-3 rounded-lg border border-[#E2E8F0] text-[#64748B] text-[13px] font-medium whitespace-nowrap hover:bg-[#F8FAFC]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => setIsActive(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
