import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';
import { Calendar, Shield } from 'lucide-react';

type BiologicalSex = 'male' | 'female' | 'prefer-not-to-say';
type Unit = 'metric' | 'imperial';

export default function HealthProfile() {
  const navigate = useNavigate();
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [heightUnit, setHeightUnit] = useState<Unit>('metric');
  const [weightUnit, setWeightUnit] = useState<Unit>('metric');
  
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    height: '',
    weight: '',
    country: 'United States'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/contacts');
  };

  return (
    <AuthLayout currentStep={2} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto">
        <h1 
          className="text-[26px] font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Tell us about yourself.
        </h1>
        
        <p 
          className="text-[13px] text-[#64748B] mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Used to calculate your personal stroke awareness score.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Date of Birth */}
          <div className="border-b border-[#F1F5F9]">
            <label className="flex items-center justify-between h-12 cursor-pointer">
              <span 
                className="text-[14px] font-medium text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Date of Birth
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="text-[14px] text-[#64748B] border-none bg-transparent"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                />
                <Calendar className="w-4 h-4 text-[#64748B]" />
              </div>
            </label>
          </div>

          {/* Biological Sex */}
          <div className="border-b border-[#F1F5F9] py-4">
            <div className="flex items-center justify-between mb-3">
              <span 
                className="text-[14px] font-medium text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Biological Sex
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`flex-1 h-9 rounded-full text-[13px] font-medium transition-colors ${
                  sex === 'male' 
                    ? 'bg-[#0EA5E9] text-white' 
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`flex-1 h-9 rounded-full text-[13px] font-medium transition-colors ${
                  sex === 'female' 
                    ? 'bg-[#0EA5E9] text-white' 
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setSex('prefer-not-to-say')}
                className={`flex-1 h-9 rounded-full text-[13px] font-medium transition-colors ${
                  sex === 'prefer-not-to-say' 
                    ? 'bg-[#0EA5E9] text-white' 
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Prefer not to say
              </button>
            </div>
          </div>

          {/* Height */}
          <div className="border-b border-[#F1F5F9]">
            <label className="flex items-center justify-between h-12">
              <span 
                className="text-[14px] font-medium text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Height
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                  className="w-20 text-[14px] text-[#0F172A] text-right border-none bg-transparent placeholder:text-[#9CA3AF]"
                  style={{ fontFamily: 'Space Mono, monospace' }}
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as Unit)}
                  className="text-[14px] text-[#64748B] border-none bg-transparent"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="metric">cm</option>
                  <option value="imperial">ft</option>
                </select>
              </div>
            </label>
          </div>

          {/* Weight */}
          <div className="border-b border-[#F1F5F9]">
            <label className="flex items-center justify-between h-12">
              <span 
                className="text-[14px] font-medium text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Weight
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="70"
                  className="w-20 text-[14px] text-[#0F172A] text-right border-none bg-transparent placeholder:text-[#9CA3AF]"
                  style={{ fontFamily: 'Space Mono, monospace' }}
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as Unit)}
                  className="text-[14px] text-[#64748B] border-none bg-transparent"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <option value="metric">kg</option>
                  <option value="imperial">lb</option>
                </select>
              </div>
            </label>
          </div>

          {/* Country */}
          <div className="border-b border-[#F1F5F9]">
            <label className="flex items-center justify-between h-12">
              <span 
                className="text-[14px] font-medium text-[#0F172A]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Country
              </span>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="text-[14px] text-[#64748B] border-none bg-transparent"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Nigeria</option>
                <option>Kenya</option>
                <option>South Africa</option>
              </select>
            </label>
          </div>

          {/* Privacy notice */}
          <div className="flex items-center gap-2 pt-6 pb-4">
            <Shield className="w-3 h-3 text-[#0EA5E9]" />
            <span 
              className="text-[12px] text-[#64748B]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              All data stays on your device
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] hover:bg-[#0284C7] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Save and Continue
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}