"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { addEmergencyContact, deleteEmergencyContact } from "@/lib/actions/onboarding";
import { toast } from "react-hot-toast";

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  initials: string;
}

export function ManageContacts({ initialContacts }: { initialContacts: Contact[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-sans font-semibold text-[16px] text-[#0F172A]">
          Your Contacts
        </h3>
        <p className="font-sans text-[13px] text-[#64748B]">
          These contacts are alerted during emergencies.
        </p>
      </div>

      <div className="space-y-4">
        {initialContacts.length === 0 && !isAdding && (
          <div className="text-center py-6 bg-[#F8FAFC] rounded-[12px] border border-dashed border-[#E2E8F0]">
            <p className="font-sans text-[13px] text-[#94A3B8]">
              You don't have any emergency contacts yet.
            </p>
          </div>
        )}

        {initialContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1D4ED8] text-sm font-bold font-sans">
                {contact.initials}
              </span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <span className="font-sans font-semibold text-[15px] text-[#0F172A]">
                {contact.name}
              </span>
              <span className="font-sans text-[13px] text-[#64748B]">
                {contact.relationship}
              </span>
              <span className="font-mono text-[12px] text-[#94A3B8] mt-1">
                {contact.phone}
              </span>
            </div>

            <button
              onClick={() => handleDelete(contact.id)}
              disabled={isDeleting === contact.id}
              className="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors disabled:opacity-50 hover:bg-[#FEF2F2] rounded-full"
            >
              {isDeleting === contact.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}

        {isAdding ? (
          <form onSubmit={handleAddContact} className="bg-[#F8FAFC] border border-[#0EA5E9] rounded-[12px] p-[20px] space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-sans font-semibold text-[14px] text-[#0F172A]">Add a new contact</h4>
              <button type="button" onClick={() => setIsAdding(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                required
                className="w-full h-10 px-3 font-sans text-sm border border-[#E2E8F0] rounded-[8px] focus:ring-1 focus:ring-[#0EA5E9] outline-none"
              />
              <input
                name="relationship"
                placeholder="Relationship (e.g. Spouse)"
                required
                className="w-full h-10 px-3 font-sans text-sm border border-[#E2E8F0] rounded-[8px] focus:ring-1 focus:ring-[#0EA5E9] outline-none"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                required
                className="w-full h-10 px-3 font-mono text-sm border border-[#E2E8F0] rounded-[8px] focus:ring-1 focus:ring-[#0EA5E9] outline-none md:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-[#0EA5E9] text-white rounded-[8px] font-sans font-semibold text-[14px] hover:bg-[#0284C7] transition-colors"
            >
              Save Contact
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full h-[54px] border border-dashed border-[#CBD5E1] rounded-[12px] flex items-center justify-center gap-2 text-[#0EA5E9] hover:border-[#0EA5E9] hover:bg-[#F0F9FF] transition-all bg-[#F8FAFC]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-sans font-medium text-[14px]">Add another contact</span>
          </button>
        )}
      </div>
    </div>
  );
}
