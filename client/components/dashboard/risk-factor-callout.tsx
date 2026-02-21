import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface RiskFactorCalloutProps {
  hasRisk: boolean;
  riskFactor?: string;
  recommendation?: string;
}

export function RiskFactorCallout({ hasRisk, riskFactor, recommendation }: RiskFactorCalloutProps) {
  if (!hasRisk) {
    return (
      <div 
        className="mx-5 rounded-xl p-4 border-l-[3px] border-[#10B981]"
        style={{ 
          backgroundColor: '#ECFDF5',
          borderTop: '1px solid #10B981',
          borderRight: '1px solid #10B981',
          borderBottom: '1px solid #10B981'
        }}
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
          
          <div className="flex-1">
            <p 
              className="text-[13px] text-[#065F46]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              No major risk factors detected. Keep up your current habits.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="mx-5 rounded-xl p-4 border-l-[3px] border-[#F59E0B]"
      style={{ 
        backgroundColor: '#FFFBEB',
        borderTop: '1px solid #FDE68A',
        borderRight: '1px solid #FDE68A',
        borderBottom: '1px solid #FDE68A'
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <h4 
            className="text-[12px] font-semibold text-[#92400E]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            TOP RISK FACTOR
          </h4>
          <p 
            className="text-[13px] text-[#92400E] mt-1"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {riskFactor}
          </p>
          {recommendation && (
            <p 
              className="text-[12px] text-[#B45309] mt-2"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {recommendation}
            </p>
          )}
        </div>
        
        <button className="flex items-center gap-1 text-[#92400E] whitespace-nowrap hover:text-[#78350F]">
          <span 
            className="text-[12px] font-medium"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Learn more
          </span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
