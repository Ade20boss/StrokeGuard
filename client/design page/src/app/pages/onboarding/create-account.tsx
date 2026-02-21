import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    navigate('/auth/profile');
  };

  return (
    <AuthLayout currentStep={1} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto">
        <h1 
          className="text-[26px] font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Create your account
        </h1>
        
        <p 
          className="text-[13px] text-[#64748B] mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Your health data stays private and on your device.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label 
              className="block text-[13px] font-medium text-[#374151] mb-1.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className={`w-full h-12 px-4 rounded-lg border text-[15px] text-[#0F172A] placeholder:text-[#9CA3AF] ${
                errors.fullName ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
              } focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[rgba(14,165,233,0.10)]`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.fullName && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                <span className="text-[12px] text-[#EF4444]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.fullName}
                </span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label 
              className="block text-[13px] font-medium text-[#374151] mb-1.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className={`w-full h-12 px-4 rounded-lg border text-[15px] text-[#0F172A] placeholder:text-[#9CA3AF] ${
                errors.email ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
              } focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[rgba(14,165,233,0.10)]`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            {errors.email && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                <span className="text-[12px] text-[#EF4444]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.email}
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label 
              className="block text-[13px] font-medium text-[#374151] mb-1.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full h-12 px-4 pr-12 rounded-lg border text-[15px] text-[#0F172A] placeholder:text-[#9CA3AF] ${
                  errors.password ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                } focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[rgba(14,165,233,0.10)]`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                <span className="text-[12px] text-[#EF4444]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.password}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              className="block text-[13px] font-medium text-[#374151] mb-1.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={`w-full h-12 px-4 pr-12 rounded-lg border text-[15px] text-[#0F172A] placeholder:text-[#9CA3AF] ${
                  errors.confirmPassword ? 'border-[#EF4444]' : 'border-[#E2E8F0]'
                } focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[rgba(14,165,233,0.10)]`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                <span className="text-[12px] text-[#EF4444]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {errors.confirmPassword}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center">
              <span 
                className="bg-white px-3 text-[13px] text-[#94A3B8]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                or
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full h-12 border border-[#E2E8F0] rounded-lg flex items-center justify-center gap-3 hover:bg-[#F8FAFC] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
              </g>
            </svg>
            <span 
              className="text-[14px] text-[#334155]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Continue with Google
            </span>
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] hover:bg-[#0284C7] transition-colors mt-6"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Create Account
          </button>

          {/* Terms */}
          <p 
            className="text-[11px] text-[#94A3B8] text-center mt-4"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            By continuing you agree to our{' '}
            <a href="#" className="text-[#0EA5E9] hover:text-[#0284C7]">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#0EA5E9] hover:text-[#0284C7]">Privacy Policy</a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}