import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1684752397429-4ce4d7856cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsJTIwc29mdCUyMGxpZ2h0aW5nfGVufDF8fHx8MTc3MTYzMjk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Medical professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
        
        {/* Logo and tagline - bottom left */}
        <div className="absolute bottom-12 left-12 z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#0EA5E9]" fill="#0EA5E9" />
            </div>
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-sans)' }}>
              StrokeGuard
            </h1>
          </div>
          <p className="text-white/90 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
            Predict. Recognize. Respond.
          </p>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Wordmark */}
          <div className="mb-8">
            <h2 
              className="text-[#0F172A] text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              StrokeGuard
            </h2>
          </div>

          {/* Main heading */}
          <h1 
            className="text-[#0F172A] text-[32px] font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Your stroke awareness starts here.
          </h1>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[15px] mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Set up takes 4 minutes. It could save your life or someone you love.
          </p>

          {/* Get Started Button */}
          <button
            onClick={() => navigate('/signup')}
            className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Get Started
          </button>

          {/* Sign in link */}
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/signin')}
              className="text-[#0EA5E9] text-sm hover:underline"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              I already have an account
            </button>
          </div>

          {/* Bottom credential */}
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-[11px]" style={{ fontFamily: 'var(--font-sans)' }}>
            <Heart className="w-3 h-3 text-[#0EA5E9]" />
            <span>Backed by AHA Life's Essential 8 framework</span>
          </div>
        </div>
      </div>
    </div>
  );
}
