import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface RiskFactorCalloutCardProps {
  hasRisk: boolean;
  riskFactor?: string;
  recommendation?: string;
}

export function RiskFactorCalloutCard({ hasRisk, riskFactor, recommendation }: RiskFactorCalloutCardProps) {
  if (!hasRisk) {
    // All-clear state
    return (
      <div
        className="rounded-xl p-4 border-l-[3px]"
        style={{
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          border: '1px solid #A7F3D0',
          borderLeftWidth: '3px',
          borderLeftColor: '#10B981',
        }}
      >
        <div className="flex items-start gap-3">
          <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
          <div className="flex-1">
            <p
              className="text-xs font-semibold uppercase mb-1"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#065F46',
                letterSpacing: '0.5px',
              }}
            >
              All Clear
            </p>
            <p
              className="text-[13px] mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#065F46',
                lineHeight: '1.5',
              }}
            >
              No major risk factors detected. Great work keeping up your habits.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Risk detected state
  return (
    <div
      className="rounded-xl p-4 border-l-[3px]"
      style={{
        backgroundColor: '#FFFBEB',
        borderColor: '#F59E0B',
        border: '1px solid #FDE68A',
        borderLeftWidth: '3px',
        borderLeftColor: '#F59E0B',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
        <div className="flex-1">
          <p
            className="text-xs font-semibold uppercase mb-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#92400E',
              letterSpacing: '0.5px',
            }}
          >
            Top Risk Factor
          </p>
          <p
            className="text-[13px] mb-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#92400E',
              lineHeight: '1.5',
            }}
          >
            {riskFactor}
          </p>
          {recommendation && (
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#B45309',
                lineHeight: '1.4',
              }}
            >
              {recommendation}
            </p>
          )}
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span
              className="text-xs font-medium"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#92400E',
              }}
            >
              Learn more
            </span>
            <ArrowRight size={12} style={{ color: '#92400E' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
