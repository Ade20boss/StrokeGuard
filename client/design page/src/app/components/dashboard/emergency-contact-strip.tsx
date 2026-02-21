import { Phone, MessageCircle, Plus } from 'lucide-react';

interface Contact {
  name: string;
  relationship: string;
  phone: string;
  initials: string;
}

export function EmergencyContactStrip() {
  const contact: Contact = {
    name: 'Sarah Adeyemi',
    relationship: 'Spouse',
    phone: '+1 (555) 123-4567',
    initials: 'SA',
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 border"
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-sm font-semibold"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0F172A',
          }}
        >
          Emergency Contacts
        </span>
        <button
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0EA5E9',
          }}
        >
          Manage
        </button>
      </div>

      {/* Contact Row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-bold flex-shrink-0"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            backgroundColor: '#DBEAFE',
            color: '#1D4ED8',
          }}
        >
          {contact.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold mb-0.5"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
            }}
          >
            {contact.name}
          </p>
          <p
            className="text-xs"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            {contact.relationship} · {contact.phone}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#ECFDF5' }}
          >
            <Phone size={15} style={{ color: '#10B981' }} />
          </button>
          <button
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            <MessageCircle size={15} style={{ color: '#0EA5E9' }} />
          </button>
        </div>
      </div>

      {/* Additional Contacts Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
            }}
          >
            DA
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#DBEAFE',
              color: '#1E40AF',
            }}
          >
            KA
          </div>
        </div>
        <span
          className="text-xs"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          +2 more
        </span>
      </div>

      {/* Add Contact */}
      <button
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed hover:bg-gray-50 transition-colors"
        style={{
          backgroundColor: '#F8FAFC',
          borderColor: '#E2E8F0',
        }}
      >
        <Plus size={14} style={{ color: '#0EA5E9' }} />
        <span
          className="text-[13px] font-medium"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0EA5E9',
          }}
        >
          Add contact
        </span>
      </button>
    </div>
  );
}
