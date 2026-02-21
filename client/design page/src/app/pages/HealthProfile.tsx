import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function HealthProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    biologicalSex: 'male',
    height: '',
    weight: '',
    country: 'US'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/emergency-contacts');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1628246987032-166e3280ba8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGFuZHMlMjBjaGFydCUyMGNsaW5pY2FsJTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3MTYzMjk2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Medical chart consultation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[28%] transition-all duration-300" />
            </div>
            <p 
              className="text-[#64748B] text-[11px] tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              STEP 2 OF 7
            </p>
          </div>

          {/* Heading */}
          <h1 
            className="text-[#0F172A] text-[26px] font-bold mb-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Tell us about yourself
          </h1>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[13px] mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Used only to calculate your personal stroke awareness score.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date of Birth */}
            <div>
              <label 
                htmlFor="dob"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>

            {/* Biological Sex - Segmented Control */}
            <div>
              <label 
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Biological Sex
              </label>
              <div className="flex gap-2 p-1 bg-[#F1F5F9] rounded-full">
                {['male', 'female', 'other'].map((sex) => (
                  <button
                    key={sex}
                    type="button"
                    onClick={() => setFormData({ ...formData, biologicalSex: sex })}
                    className={`flex-1 h-10 rounded-full text-sm font-medium transition-all ${
                      formData.biologicalSex === sex
                        ? 'bg-[#0EA5E9] text-white shadow-sm'
                        : 'bg-transparent text-[#0F172A] hover:bg-white/50'
                    }`}
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {sex.charAt(0).toUpperCase() + sex.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div>
              <label 
                htmlFor="height"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                style={{ fontFamily: 'var(--font-sans)' }}
                placeholder="175"
              />
            </div>

            {/* Weight */}
            <div>
              <label 
                htmlFor="weight"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                style={{ fontFamily: 'var(--font-sans)' }}
                placeholder="70"
              />
            </div>

            {/* Country */}
            <div>
              <label 
                htmlFor="country"
                className="block text-[#374151] text-sm font-medium mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Country
              </label>
              <div className="relative">
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full h-12 pl-4 pr-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all appearance-none"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="ZA">South Africa</option>
                  <option value="IN">India</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>

            {/* Privacy info row */}
            <div className="flex items-center gap-2 pt-2">
              <Shield className="w-[14px] h-[14px] text-[#0EA5E9]" />
              <p className="text-[#64748B] text-xs" style={{ fontFamily: 'var(--font-sans)' }}>
                All data stays on your device
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Save and Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
