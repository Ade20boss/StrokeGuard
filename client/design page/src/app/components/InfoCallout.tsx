import { ReactNode } from 'react';

interface InfoCalloutProps {
  icon: ReactNode;
  children: ReactNode;
}

export function InfoCallout({ icon, children }: InfoCalloutProps) {
  return (
    <div className="w-full p-4 rounded-xl bg-[#0D1F3C] border-l-4 border-[#0EA5E9] flex items-start gap-3">
      <div className="text-[#0EA5E9] mt-0.5">{icon}</div>
      <p className="text-[12px] text-[#94A3B8] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
      </p>
    </div>
  );
}
