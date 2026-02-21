import { Lock, Activity, ChevronRight, Shield } from 'lucide-react';

interface FastCheckCardProps {
  sdnn: number;
}

export function FastCheckCard({ sdnn }: FastCheckCardProps) {
  const isElevated = sdnn < 20;

  if (!isElevated) {
    // Variant A - Locked State
    return (
      <div 
        className="bg-white rounded-2xl p-5 mx-5 border border-[#E2E8F0]"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-[30px] h-[30px] rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
            <Lock className="w-[15px] h-[15px] text-[#94A3B8]" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 
                className="text-[14px] font-semibold text-[#64748B]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                FAST Check
              </h2>
              
              <span 
                className="px-2.5 py-1 bg-[#F1F5F9] text-[#94A3B8] text-[11px] font-semibold rounded-full"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Monitoring
              </span>
            </div>
          </div>
        </div>
        
        <p 
          className="text-[13px] text-[#94A3B8] leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          FAST Check activates automatically when your HRV enters the elevated risk zone (SDNN &lt; 20ms or HRVI threshold exceeded).
        </p>
      </div>
    );
  }

  // Variant B - Active State
  return (
    <div 
      className="bg-white rounded-2xl p-5 mx-5 border-l-[3px] border-[#EF4444] border-r border-t border-b border-[#E2E8F0]"
      style={{ boxShadow: '0 4px 16px rgba(239,68,68,0.12)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-[30px] h-[30px] rounded-lg bg-[#FEF2F2] flex items-center justify-center flex-shrink-0">
          <Activity className="w-[15px] h-[15px] text-[#EF4444]" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 
              className="text-[14px] font-semibold text-[#0F172A]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              FAST Check
            </h2>
            
            <span 
              className="px-2.5 py-1 bg-[#FEF2F2] text-[#EF4444] text-[11px] font-semibold rounded-full"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Action Required
            </span>
          </div>
        </div>
      </div>
      
      <p 
        className="text-[13px] text-[#64748B] mb-4"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Your HRV has entered the elevated risk zone. Run a FAST Check now.
      </p>
      
      <button 
        className="w-full h-12 rounded-lg bg-[#EF4444] text-white text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#DC2626] transition-colors"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Start FAST Check
        <ChevronRight className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1.5 mt-3">
        <Shield className="w-[11px] h-[11px] text-[#94A3B8]" />
        <span 
          className="text-[11px] text-[#94A3B8]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Camera stays on your device
        </span>
      </div>
    </div>
  );
}
