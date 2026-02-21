import { ReactNode } from 'react';

interface StatusBadgeProps {
  variant: 'required' | 'recommended' | 'granted' | 'optional';
  children: ReactNode;
}

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const styles = {
    required: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    recommended: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    granted: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    optional: 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wide border ${styles[variant]}`}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {children}
    </span>
  );
}
