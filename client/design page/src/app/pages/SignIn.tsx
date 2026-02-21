import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EyeOff, Eye } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1684752397429-4ce4d7856cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsJTIwc29mdCUyMGxpZ2h0aW5nfGVufDF8fHx8MTc3MTYzMjk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Medical professional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-25" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 
            className="text-[#0F172A] text-[26px] font-bold mb-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Welcome back
          </h1>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[13px] mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Sign in to access your stroke awareness dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                style={{ fontFamily: 'var(--font-sans)' }}
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 px-4 pr-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#64748B]"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-[#0EA5E9] text-sm hover:underline"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-[#64748B] text-sm mt-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-[#0EA5E9] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
