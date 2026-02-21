import { useNavigate } from 'react-router';
import { CheckCircle, Check, Lock } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SetupComplete() {
  const navigate = useNavigate();

  const confirmations = [
    'Profile saved',
    'Contacts added',
    'Permissions granted'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1719448683409-c3b2cb97e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBoZWFsdGh5JTIwbmF0dXJhbCUyMGxpZ2h0JTIwd2luZG93JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Person in natural light"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lighter overlay for hopeful feel */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-15" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Progress bar - 100% */}
          <div className="mb-12">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-full transition-all duration-300" />
            </div>
            <p 
              className="text-[#64748B] text-[11px] tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              STEP 7 OF 7
            </p>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-14 h-14 text-[#10B981]" />
          </div>

          {/* Heading */}
          <h1 
            className="text-[#0F172A] text-[32px] font-bold text-center mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            You are all set
          </h1>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[15px] text-center mb-10"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Your Stroke Awareness Score is ready. StrokeGuard is watching out for you.
          </p>

          {/* Confirmation List */}
          <div className="space-y-3 mb-10">
            {confirmations.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                <span 
                  className="text-[#374151] text-[13px]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Go to my Dashboard
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-[11px]">
            <Lock className="w-3 h-3" />
            <p style={{ fontFamily: 'var(--font-sans)' }}>
              Your data is processed on-device and never sold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
