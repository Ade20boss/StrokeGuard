import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Pencil, Trash2, Send } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  initials: string;
}

export function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 123-4567',
      initials: 'SJ'
    }
  ]);
  const [sendGPS, setSendGPS] = useState(true);
  const [notifyAll, setNotifyAll] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/permissions');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1607362842559-c96dd7146aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0d28lMjBwZW9wbGUlMjBzdXBwb3J0JTIwY2FyaW5nJTIwd2FybXxlbnwxfHx8fDE3NzE2MzI5NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Two people supporting each other"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[42%] transition-all duration-300" />
            </div>
            <p 
              className="text-[#64748B] text-[11px] tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              STEP 3 OF 7
            </p>
          </div>

          {/* Heading */}
          <h1 
            className="text-[#0F172A] text-[26px] font-bold mb-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Who should we contact in an emergency?
          </h1>

          {/* Subtext */}
          <p 
            className="text-[#64748B] text-[13px] mb-8"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            They'll receive your location and a summary if you trigger SOS.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Cards */}
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                  <span 
                    className="text-[#1D4ED8] text-sm font-bold"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {contact.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-[#0F172A] text-[15px] font-semibold"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {contact.name}
                  </h3>
                  <p 
                    className="text-[#64748B] text-sm"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    {contact.relationship}
                  </p>
                  <p 
                    className="text-[#9CA3AF] text-xs"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {contact.phone}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-[#9CA3AF] hover:text-[#64748B] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Contact Button */}
            <button
              type="button"
              className="w-full border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 flex items-center gap-3 text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-[#F0F9FF] transition-all"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Add another contact</span>
            </button>

            {/* Toggle Options */}
            <div className="space-y-3 pt-4">
              {/* Send GPS Toggle */}
              <div className="flex items-center justify-between">
                <span 
                  className="text-[#374151] text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Send GPS location with alerts
                </span>
                <button
                  type="button"
                  onClick={() => setSendGPS(!sendGPS)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sendGPS ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sendGPS ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notify All Toggle */}
              <div className="flex items-center justify-between">
                <span 
                  className="text-[#374151] text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Notify all contacts at once
                </span>
                <button
                  type="button"
                  onClick={() => setNotifyAll(!notifyAll)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifyAll ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifyAll ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Test Alert Link */}
            <button
              type="button"
              className="flex items-center gap-2 text-[#0EA5E9] text-[13px] pt-2 hover:underline"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <Send className="w-4 h-4" />
              Send a test alert
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
