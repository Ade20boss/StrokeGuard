import { Phone, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export function EmergencyContactStrip({ contacts }: { contacts: Contact[] }) {
  // Take only the first contact for the main display, per the Figma spec's singular focus
  const primaryContact = contacts?.[0];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans font-semibold text-[15px] text-[#0F172A]">
          Emergency Contacts
        </h3>
        <Link 
          href="/contacts" 
          className="font-sans font-medium text-[13px] text-[#0EA5E9] hover:underline"
        >
          Manage
        </Link>
      </div>

      {primaryContact ? (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full bg-[#DBEAFE] flex flex-shrink-0 items-center justify-center font-sans font-bold text-[14px] text-[#1D4ED8]">
              {getInitials(primaryContact.name)}
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-[14px] text-[#0F172A]">
                {primaryContact.name}
              </span>
              <span className="font-mono text-[12px] text-[#64748B]">
                {primaryContact.phone}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="w-[32px] h-[32px] rounded-full bg-[#ECFDF5] flex items-center justify-center hover:opacity-80 transition-opacity">
              <Phone size={14} className="text-[#10B981] fill-[#10B981]" />
            </button>
            <button className="w-[32px] h-[32px] rounded-full bg-[#EFF6FF] flex items-center justify-center hover:opacity-80 transition-opacity">
              <MessageCircle size={14} className="text-[#0EA5E9] fill-[#0EA5E9]" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 mb-4">
          <p className="font-sans text-[13px] text-[#94A3B8]">No emergency contacts found.</p>
        </div>
      )}

      {/* Add contact row */}
      <Link 
        href="/contacts"
        className="w-full flex items-center justify-center gap-2 h-[48px] rounded-[12px] bg-[#F8FAFC] border border-dashed border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
      >
        <Plus size={16} className="text-[#0EA5E9]" />
        <span className="font-sans font-medium text-[13px] text-[#0EA5E9]">
          Add contact
        </span>
      </Link>

    </div>
  );
}
