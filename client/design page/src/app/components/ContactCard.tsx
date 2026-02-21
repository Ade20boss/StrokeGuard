import { Pencil, Trash2 } from 'lucide-react';

interface ContactCardProps {
  name: string;
  relationship: string;
  phone: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ContactCard({ name, relationship, phone, onEdit, onDelete }: ContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full p-4 rounded-xl bg-[#0D1526] border border-[#1E2D45] flex items-center gap-4">
      <div className="relative">
        <div className="size-12 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] flex items-center justify-center">
          <span className="text-white font-semibold text-[14px]" style={{ fontFamily: 'var(--font-sans)' }}>
            {getInitials(name)}
          </span>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#10B981] border-2 border-[#0D1526]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white" style={{ fontFamily: 'var(--font-sans)' }}>
          {name}
        </p>
        <p className="text-[13px] text-[#64748B]" style={{ fontFamily: 'var(--font-sans)' }}>
          {relationship}
        </p>
        <p className="text-[13px] text-[#94A3B8] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
          {phone}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-[#64748B] hover:text-[#0EA5E9] transition-colors"
          >
            <Pencil className="size-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-[#64748B] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
