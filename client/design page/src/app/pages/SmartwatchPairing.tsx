import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SmartwatchPairing() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'googlefit' | 'applehealth' | null>(null);

  const handleConnect = () => {
    navigate('/setup-complete');
  };

  const handleSkip = () => {
    navigate('/setup-complete');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1764946192307-8fbd83126af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd3Jpc3QlMjBjbG9zZSUyMHVwJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Smartwatch on wrist"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[71%] transition-all duration-300" />
            </div>
            <p 
              className="text-[#64748B] text-[11px] tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              STEP 5 OF 7
            </p>
          </div>

          {/* Heading with Optional badge */}
          <div className="flex items-center gap-2 mb-2">
            <h1 
              className="text-[#0F172A] text-[26px] font-bold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Connect your smartwatch
            </h1>
            <span 
              className="px-2 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Optional
            </span>
          </div>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[13px] mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Automatically feeds heart rate, SpO2, and activity into your risk score.
          </p>

          {/* Connection Illustration */}
          <div className="flex items-center justify-center gap-6 mb-10 py-8">
            {/* Smartwatch */}
            <div className="w-16 h-20 border-2 border-[#E2E8F0] rounded-xl relative">
              <div className="absolute top-2 left-2 right-2 h-12 border border-[#E2E8F0] rounded" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#E2E8F0] rounded-full" />
            </div>

            {/* Connection lines with animated dots */}
            <div className="flex-1 flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative h-0.5 bg-[#E2E8F0] border-t-2 border-dashed border-[#CBD5E1]">
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0EA5E9] rounded-full animate-pulse"
                    style={{ 
                      left: '30%',
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Phone */}
            <div className="w-14 h-24 border-2 border-[#E2E8F0] rounded-2xl relative">
              <div className="absolute top-3 left-3 right-3 bottom-5 border border-[#E2E8F0] rounded-lg" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#E2E8F0] rounded-full" />
            </div>
          </div>

          {/* Platform Options */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {/* Google Fit */}
            <button
              type="button"
              onClick={() => setSelectedOption('googlefit')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedOption === 'googlefit'
                  ? 'border-[#0EA5E9] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🏃</div>
                <h3 
                  className="text-[#0F172A] text-sm font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Google Fit
                </h3>
                <p 
                  className="text-[#64748B] text-[11px] leading-tight"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Android, Oraimo, itel, Fitbit, Wear OS
                </p>
              </div>
            </button>

            {/* Apple Health - Greyed out */}
            <button
              type="button"
              disabled
              className="p-4 rounded-lg border-2 border-[#E2E8F0] bg-[#F1F5F9] cursor-not-allowed opacity-60"
            >
              <div className="text-center">
                <div className="text-2xl mb-2 grayscale">🍎</div>
                <h3 
                  className="text-[#9CA3AF] text-sm font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Apple Health
                </h3>
                <p 
                  className="text-[#9CA3AF] text-[11px] leading-tight"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Apple Watch — iOS only
                </p>
              </div>
            </button>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={!selectedOption}
            className={`w-full h-12 rounded-full text-[15px] font-medium transition-colors ${
              selectedOption
                ? 'bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90'
                : 'bg-[#E2E8F0] text-[#9CA3AF] cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Connect Google Fit
          </button>

          {/* Skip Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-[#9CA3AF] text-sm hover:text-[#64748B] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
