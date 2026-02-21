import { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge';
import { Check } from 'lucide-react';

interface PermissionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  status: 'required' | 'recommended';
  granted?: boolean;
}

export function PermissionCard({ icon, title, description, status, granted }: PermissionCardProps) {
  return (
    <div className="w-full p-5 rounded-xl bg-[#0D1526] border border-[#1E2D45] flex items-start gap-4">
      <div className="size-12 rounded-xl bg-[#081020] flex items-center justify-center text-[#0EA5E9] flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-semibold text-white mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
          {title}
        </h3>
        <p className="text-[13px] text-[#94A3B8] leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
          {description}
        </p>
      </div>
      <div className="flex-shrink-0">
        {granted ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
            <Check className="size-3.5" />
            <span className="text-[11px] uppercase tracking-wide" style={{ fontFamily: 'var(--font-mono)' }}>
              Granted
            </span>
          </div>
        ) : (
          <StatusBadge variant={status}>{status}</StatusBadge>
        )}
      </div>
    </div>
  );
}
