"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Send, Loader2, X } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { addEmergencyContact, deleteEmergencyContact } from "@/lib/actions/onboarding";
import { toast } from "react-hot-toast";

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  initials: string;
}

export default function EmergencyContactsForm({ initialContacts }: { initialContacts: Contact[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [sendGPS, setSendGPS] = useState(true);
  const [notifyAll, setNotifyAll] = useState(true);

  const handleAddContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await addEmergencyContact(formData);
    if (result.success) {
      toast.success("Contact added successfully!");
      e.currentTarget.reset();
      setIsAdding(false);
    } else {
      toast.error(result.error || "Failed to add contact");
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteEmergencyContact(id);
    if (result.success) {
      toast.success("Contact removed");
    } else {
      toast.error(result.error || "Failed to delete contact");
    }
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen flex text-[#0F172A]">
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
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 3 OF 7
            </p>
          </div>

          <h1 className="text-[26px] font-bold mb-2">
            Who should we contact in an emergency?
          </h1>

          <p className="text-[#64748B] text-[13px] mb-8">
            They'll receive your location and a summary if you trigger SOS.
          </p>

          <div className="space-y-4">
            {initialContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1D4ED8] text-sm font-bold">
                    {contact.initials}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold">
                    {contact.name}
                  </h3>
                  <p className="text-[#64748B] text-sm">
                    {contact.relationship}
                  </p>
                  <p className="text-[#9CA3AF] text-xs font-mono">
                    {contact.phone}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={isDeleting === contact.id}
                    className="p-2 text-[#9CA3AF] hover:text-[#EF4444] transition-colors disabled:opacity-50"
                  >
                    {isDeleting === contact.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {isAdding ? (
              <form onSubmit={handleAddContact} className="bg-[#F8FAFC] border border-[#0EA5E9] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold">New Contact</h4>
                  <button type="button" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <input
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-1 focus:ring-[#0EA5E9]"
                />
                <input
                  name="relationship"
                  placeholder="Relationship (e.g. Spouse)"
                  required
                  className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-1 focus:ring-[#0EA5E9]"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  required
                  className="w-full h-10 px-3 text-sm border rounded-lg focus:ring-1 focus:ring-[#0EA5E9]"
                />
                <button
                  type="submit"
                  className="w-full h-10 bg-[#0EA5E9] text-white rounded-lg text-sm font-medium"
                >
                  Add Contact
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="w-full border-2 border-dashed border-[#E2E8F0] rounded-lg p-4 flex items-center gap-3 text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-[#F0F9FF] transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm font-medium">Add another contact</span>
              </button>
            )}

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-[#374151] text-sm">
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

              <div className="flex items-center justify-between">
                <span className="text-[#374151] text-sm">
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

            <button
              type="button"
              className="flex items-center gap-2 text-[#0EA5E9] text-[13px] pt-2 hover:underline"
            >
              <Send className="w-4 h-4" />
              Send a test alert
            </button>

            <button
              onClick={() => router.push("/onboarding/risk-assessment")}
              className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mt-6"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
