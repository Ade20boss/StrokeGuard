import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/signin');

  const userName = session.user.name || 'User';
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="settings" userName={userName} userInitials={userName.slice(0,2).toUpperCase()} />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#F4F6FA' }}>
        <div className="max-w-2xl mx-auto px-6 py-10 w-full">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Settings</h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
            Manage your account and app preferences.
          </p>

          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
             <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>App settings coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
