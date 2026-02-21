import { useNavigate } from 'react-router';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { StrokeGuardButton } from '../components/StrokeGuardButton';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <AlertCircle className="size-16 text-[#EF4444] mb-6" />
        <h1 
          className="text-[32px] font-bold text-white mb-3"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Page Not Found
        </h1>
        <p 
          className="text-[16px] text-[#94A3B8] text-center mb-8 max-w-md"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="w-full max-w-md">
          <StrokeGuardButton onClick={() => navigate('/')}>
            Go to Home
          </StrokeGuardButton>
        </div>
      </div>
    </OnboardingLayout>
  );
}
