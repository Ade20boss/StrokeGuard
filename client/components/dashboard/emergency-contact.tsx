import { Phone, MessageSquare } from 'lucide-react';

interface Contact {
  initials: string;
  name: string;
  relationship: string;
  number: string;
}

const contact: Contact = {
  initials: 'SM',
  name: 'Sarah Mitchell',
  relationship: 'Spouse',
  number: '+1 (555) 123-4567'
};

export function EmergencyContact() {
  return (
    <div 
      className="bg-white rounded-2xl p-5 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-[14px] font-semibold text-[#0F172A]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Emergency Contacts
        </h3>
        <button 
          className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Manage
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
          <span 
            className="text-[#1D4ED8] font-bold text-[15px]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {contact.initials}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <p 
            className="text-[14px] font-semibold text-[#0F172A]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {contact.name}
          </p>
          <p 
            className="text-[12px] text-[#64748B]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            {contact.relationship} • {contact.number}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button 
            className="w-[34px] h-[34px] rounded-full bg-[#ECFDF5] flex items-center justify-center hover:bg-[#D1FAE5]"
            aria-label="Call contact"
          >
            <Phone className="w-4 h-4 text-[#10B981]" />
          </button>
          
          <button 
            className="w-[34px] h-[34px] rounded-full bg-[#EFF6FF] flex items-center justify-center hover:bg-[#DBEAFE]"
            aria-label="Message contact"
          >
            <MessageSquare className="w-4 h-4 text-[#0EA5E9]" />
          </button>
        </div>
      </div>
    </div>
  );
}
