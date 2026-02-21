import { Shield } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showProgress?: boolean;
}

export function AuthLayout({ children, currentStep, totalSteps = 6, showProgress = false }: AuthLayoutProps) {
  const progressPercentage = currentStep ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Desktop */}
      <div 
        className="hidden md:flex md:w-[45%] relative overflow-hidden flex-col justify-end p-10"
        style={{ 
          background: 'linear-gradient(160deg, #0D2040 0%, #050A14 100%)'
        }}
      >
        {/* Subtle glow orb top-right */}
        <div 
          className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.20) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        
        {/* Logo and tagline - bottom left */}
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#0EA5E9]" />
            <span 
              className="text-white font-bold text-[20px]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              StrokeGuard
            </span>
          </div>
          
          <p 
            className="text-[#94A3B8] text-[10px] mt-2"
            style={{ 
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '2px'
            }}
          >
            PREDICT · RECOGNIZE · RESPOND
          </p>
        </div>
      </div>

      {/* Mobile Top Banner */}
      <div 
        className="md:hidden h-[180px] relative overflow-hidden flex items-end p-6"
        style={{ 
          background: 'linear-gradient(160deg, #0D2040 0%, #050A14 100%)'
        }}
      >
        {/* Subtle glow orb */}
        <div 
          className="absolute top-0 right-0 w-[100px] h-[100px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.20) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#0EA5E9]" />
            <span 
              className="text-white font-bold text-[20px]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              StrokeGuard
            </span>
          </div>
          
          <p 
            className="text-[#94A3B8] text-[10px] mt-2"
            style={{ 
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '2px'
            }}
          >
            PREDICT · RECOGNIZE · RESPOND
          </p>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 bg-white md:w-[55%] overflow-y-auto">
        {showProgress && currentStep && (
          <div className="w-full">
            {/* Progress bar */}
            <div className="w-full h-1 bg-[#F1F5F9]">
              <div 
                className="h-full bg-[#0EA5E9] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Step indicator */}
            <div className="px-10 md:px-10 pt-3">
              <p 
                className="text-[11px] text-[#94A3B8]"
                style={{ fontFamily: 'Space Mono, monospace' }}
              >
                STEP {currentStep} OF {totalSteps}
              </p>
            </div>
          </div>
        )}
        
        <div className="px-6 md:px-10 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
