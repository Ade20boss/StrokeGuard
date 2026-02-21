import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function OnboardingLayout({ children, showBack = false, showSkip = false, onSkip }: OnboardingLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-radial from-[#0D1F3C] via-[#050A14] to-[#050A14] relative overflow-hidden">
      {/* Subtle dot grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      
      {/* Navigation */}
      {(showBack || showSkip) && (
        <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between z-10">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-[#64748B] hover:text-[#0EA5E9] transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
          ) : (
            <div />
          )}
          {showSkip && onSkip && (
            <button
              onClick={onSkip}
              className="text-[#64748B] hover:text-[#0EA5E9] transition-colors text-[14px]"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Skip
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
