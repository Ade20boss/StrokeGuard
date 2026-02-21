import { Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-96px)]">
        <Shield className="w-8 h-8 text-[#0EA5E9] mb-8" />
        
        <h1 
          className="text-[30px] font-bold text-[#0F172A] text-center max-w-md mb-4"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Your stroke awareness starts here.
        </h1>
        
        <p 
          className="text-[15px] text-[#64748B] text-center max-w-md mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Setup takes 4 minutes. It could help save your life or someone you love.
        </p>
        
        <button
          onClick={() => navigate('/auth/signup')}
          className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] mb-4 hover:bg-[#0284C7] transition-colors"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Get Started
        </button>
        
        <button
          disabled
          className="text-[14px] cursor-default"
          style={{ fontFamily: 'DM Sans, sans-serif', color: '#CBD5E1' }}
          title="Login flow not yet implemented"
        >
          Already have an account? Sign in
        </button>
        
        <div className="flex items-center gap-1.5 mt-12">
          <Heart className="w-[11px] h-[11px] text-[#0EA5E9]" />
          <span 
            className="text-[11px] text-[#94A3B8]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Backed by AHA Life's Essential 8
          </span>
        </div>
      </div>
    </AuthLayout>
  );
}