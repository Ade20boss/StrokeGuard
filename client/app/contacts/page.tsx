import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import prisma from '@/lib/prisma';
import { ManageContacts } from '@/components/contacts/ManageContacts';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ContactsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  const contacts = await prisma.emergencyContact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  });

  const userName = session.user.name || 'User';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar activePage="contacts" userName={userName} userInitials={userName.slice(0,2).toUpperCase()} />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-6 py-10 w-full space-y-6">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </Link>
            <div>
              <h1 className="text-[24px] font-bold font-sans text-[#0F172A]">Emergency Contacts</h1>
            </div>
          </div>
          
          <ManageContacts initialContacts={contacts.map(c => ({
            ...c,
            initials: c.name.split(" ").map(n => n[0]).join("").toUpperCase()
          }))} />
        </div>
      </div>
    </div>
  );
}
