import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';

type WatchPlatform = 'google-fit' | 'apple-health' | null;

export default function ConnectWatch() {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<WatchPlatform>(null);

  const handleConnect = () => {
    navigate('/auth/complete');
  };

  const handleSkip = () => {
    navigate('/auth/complete');
  };

  return (
    <AuthLayout currentStep={5} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <h1 
            className="text-[26px] font-bold text-[#0F172A]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Connect your smartwatch.
          </h1>
          <span 
            className="px-2.5 py-1 bg-[#FFFBEB] text-[#F59E0B] text-[11px] font-semibold rounded"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Optional
          </span>
        </div>
        
        <p 
          className="text-[13px] text-[#64748B] mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Enables live HRV monitoring for stroke risk detection.
        </p>
        
        {/* Illustration */}
        <div className="flex items-center justify-center py-12 mb-8">
          <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Phone outline - right */}
            <rect x="150" y="20" width="60" height="80" rx="8" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="165" y="30" width="30" height="50" rx="2" fill="#F8FAFC" />
            <circle cx="180" cy="90" r="3" fill="#E2E8F0" />
            
            {/* Watch outline - left */}
            <rect x="30" y="35" width="50" height="50" rx="8" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="38" y="43" width="34" height="34" rx="4" fill="#F8FAFC" />
            <line x1="26" y1="50" x2="30" y2="50" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="26" y1="70" x2="30" y2="70" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="80" y1="50" x2="84" y2="50" stroke="#E2E8F0" strokeWidth="2" />
            <line x1="80" y1="70" x2="84" y2="70" stroke="#E2E8F0" strokeWidth="2" />
            
            {/* Connection lines with dots */}
            <line x1="85" y1="45" x2="145" y2="45" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="110" cy="45" r="2.5" fill="#0EA5E9" />
            
            <line x1="85" y1="60" x2="145" y2="60" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="115" cy="60" r="2.5" fill="#0EA5E9" />
            
            <line x1="85" y1="75" x2="145" y2="75" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="120" cy="75" r="2.5" fill="#0EA5E9" />
          </svg>
        </div>

        {/* Platform Selection */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {/* Google Fit */}
          <button
            type="button"
            onClick={() => setSelectedPlatform('google-fit')}
            className={`p-4 rounded-xl border transition-all ${
              selectedPlatform === 'google-fit'
                ? 'border-[#0EA5E9] bg-[#EFF6FF]'
                : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#4285F4" />
                  <path d="M16 8v16M8 16h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <p 
                className="text-[13px] font-semibold text-[#0F172A] mb-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Google Fit
              </p>
              <p 
                className="text-[11px] text-[#64748B] leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Android · Wear OS · Oraimo · itel · Fitbit
              </p>
            </div>
          </button>

          {/* Apple Health - Disabled */}
          <button
            type="button"
            disabled
            className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] opacity-60 cursor-not-allowed"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="#9CA3AF" />
                  <path d="M16 10c-1.5 0-2.5 1-2.5 2.5 0 1 .5 1.8 1.2 2.3L16 22l1.3-7.2c.7-.5 1.2-1.3 1.2-2.3 0-1.5-1-2.5-2.5-2.5z" fill="white" />
                </svg>
              </div>
              <p 
                className="text-[13px] font-semibold text-[#9CA3AF] mb-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Apple Health
              </p>
              <p 
                className="text-[11px] text-[#9CA3AF] leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Apple Watch — iOS only
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={handleConnect}
          disabled={!selectedPlatform}
          className={`w-full h-[52px] rounded-lg font-semibold text-[16px] transition-colors ${
            selectedPlatform
              ? 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
              : 'bg-[#F1F5F9] text-[#9CA3AF] cursor-not-allowed'
          }`}
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Connect via Bluetooth
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-3 text-[13px] text-[#94A3B8] hover:text-[#64748B] transition-colors mt-4"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Skip for now
        </button>
      </div>
    </AuthLayout>
  );
}