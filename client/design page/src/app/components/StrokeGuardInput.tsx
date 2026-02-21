import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface StrokeGuardInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function StrokeGuardInput({
  label,
  error,
  showPasswordToggle,
  type = 'text',
  className = '',
  ...props
}: StrokeGuardInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[15px] text-[#CBD5E1]" style={{ fontFamily: 'var(--font-sans)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full h-[52px] px-4 rounded-xl bg-[#081020] border-2 transition-all duration-300 text-white placeholder:text-[#64748B] focus:outline-none ${
            error
              ? 'border-[#EF4444]'
              : isFocused
              ? 'border-[#0EA5E9] shadow-[0_0_20px_rgba(14,165,233,0.2)]'
              : 'border-[#1E2D45]'
          } ${className}`}
          style={{ fontFamily: 'var(--font-sans)' }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0EA5E9] transition-colors"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
        {error && (
          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#EF4444]" />
        )}
      </div>
      {error && (
        <p className="mt-1 text-[12px] text-[#EF4444]" style={{ fontFamily: 'var(--font-sans)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
