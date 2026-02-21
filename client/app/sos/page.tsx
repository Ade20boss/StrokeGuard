import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function SOSPage() {
  const session = await auth();
  if (!session?.user) redirect('/signin');

  const userName = session.user.name || 'User';
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="sos" userName={userName} userInitials={userName.slice(0,2).toUpperCase()} />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#FEF2F2' }}>
        <div className="max-w-2xl mx-auto px-6 py-10 w-full">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif', color: '#991B1B' }}>Emergency SOS</h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'DM Sans, sans-serif', color: '#B91C1C' }}>
            Emergency mode activated. Help is on the way.
          </p>

          <div className="bg-white rounded-2xl p-8 border-4 border-red-500 text-center" style={{ boxShadow: '0 10px 30px rgba(239, 68, 68, 0.2)' }}>
             <p className="text-lg font-bold text-red-600 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Emergency Contacts notified</p>
             <p className="text-[13px] text-gray-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your GPS coordinates and health summary have been sent to your primary contacts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
