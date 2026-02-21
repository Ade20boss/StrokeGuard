import { ReactNode } from 'react';

interface ToggleRowProps {
  icon: ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleRow({ icon, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D1526] border border-[#1E2D45]">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-[#0EA5E9] mt-1">{icon}</div>
        <div>
          <p className="text-[15px] text-white" style={{ fontFamily: 'var(--font-sans)' }}>
            {label}
          </p>
          {description && (
            <p className="text-[12px] text-[#64748B] mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          checked ? 'bg-[#0EA5E9]' : 'bg-[#1E2D45]'
        }`}
      >
        <span
          className={`absolute top-1 left-1 size-4 rounded-full bg-white transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
