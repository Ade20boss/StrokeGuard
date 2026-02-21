import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';
import { CheckCircle, Check, Lock } from 'lucide-react';

export default function SetupComplete() {
  const navigate = useNavigate();

  const confirmations = [
    'Profile saved',
    'Contacts added',
    'Permissions granted'
  ];

  return (
    <AuthLayout currentStep={6} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-240px)]">
        <CheckCircle className="w-14 h-14 text-[#10B981] mb-6" strokeWidth={2} />
        
        <h1 
          className="text-[32px] font-bold text-[#0F172A] text-center mb-3"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          You are all set.
        </h1>
        
        <p 
          className="text-[16px] text-[#64748B] text-center max-w-sm mb-10"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          StrokeGuard is now watching out for you and the people you love.
        </p>
        
        <div className="space-y-2 mb-12 w-full max-w-xs">
          {confirmations.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={3} />
              <span 
                className="text-[13px] text-[#334155]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full h-14 bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] hover:bg-[#0284C7] transition-colors mb-4"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Go to my Dashboard
        </button>
        
        <div className="flex items-center gap-1.5">
          <Lock className="w-[11px] h-[11px] text-[#94A3B8]" />
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Your data is processed on-device and never sold.
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}
