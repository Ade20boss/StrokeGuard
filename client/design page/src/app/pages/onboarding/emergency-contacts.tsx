import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';
import { Pencil, Trash2, PlusCircle, MapPin, Users } from 'lucide-react';

interface Contact {
  id: string;
  initials: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const [includeGPS, setIncludeGPS] = useState(true);
  const [alertAll, setAlertAll] = useState(true);
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      initials: 'SM',
      name: 'Sarah Mitchell',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/permissions');
  };

  return (
    <AuthLayout currentStep={3} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto">
        <h1 
          className="text-[26px] font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Who should we contact in an emergency?
        </h1>
        
        <p 
          className="text-[13px] text-[#64748B] mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          They'll be alerted instantly with your location if you trigger SOS.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Cards */}
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3"
              >
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
                    {contact.relationship} • {contact.phone}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button type="button" className="text-[#94A3B8] hover:text-[#64748B]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" className="text-[#94A3B8] hover:text-[#EF4444]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add Contact */}
            <button
              type="button"
              className="w-full border border-dashed border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 hover:border-[#0EA5E9] hover:bg-[#EFF6FF] transition-colors"
            >
              <PlusCircle className="w-[18px] h-[18px] text-[#0EA5E9]" />
              <span 
                className="text-[14px] font-medium text-[#0EA5E9]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Add another contact
              </span>
            </button>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-4 pt-4">
            {/* GPS Toggle */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#64748B]" />
              </div>
              
              <div className="flex-1">
                <p 
                  className="text-[14px] font-medium text-[#0F172A]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Include GPS location in alerts
                </p>
                <p 
                  className="text-[12px] text-[#64748B]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Share your exact location during emergencies
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setIncludeGPS(!includeGPS)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  includeGPS ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    includeGPS ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Alert All Toggle */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[#64748B]" />
              </div>
              
              <div className="flex-1">
                <p 
                  className="text-[14px] font-medium text-[#0F172A]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Alert all contacts simultaneously
                </p>
                <p 
                  className="text-[12px] text-[#64748B]"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Send emergency alerts to everyone at once
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => setAlertAll(!alertAll)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  alertAll ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    alertAll ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Test Alert */}
          <button
            type="button"
            className="w-full py-3 text-[13px] font-medium text-[#0EA5E9] hover:text-[#0284C7] transition-colors flex items-center justify-center gap-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <svg className="w-[13px] h-[13px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send a test alert
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] hover:bg-[#0284C7] transition-colors mt-6"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Continue
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}