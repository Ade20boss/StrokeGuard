import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface StrokeGuardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'text';
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

export function StrokeGuardButton({
  variant = 'primary',
  icon,
  loading,
  children,
  className = '',
  disabled,
  ...props
}: StrokeGuardButtonProps) {
  const baseStyles = 'relative w-full h-[52px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#3B82F6] text-white shadow-[0_8px_32px_rgba(14,165,233,0.15)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.25)] active:scale-[0.98]',
    ghost: 'rounded-full border-2 border-[#0EA5E9] text-[#0EA5E9] bg-transparent hover:bg-[#0EA5E9]/10 active:scale-[0.98]',
    text: 'text-[#64748B] hover:text-[#0EA5E9] underline underline-offset-4 h-auto',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      style={{ fontFamily: 'var(--font-sans)' }}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-5 animate-spin mx-auto" />
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
          {icon && <span className="ml-1">{icon}</span>}
        </span>
      )}
    </button>
  );
}
