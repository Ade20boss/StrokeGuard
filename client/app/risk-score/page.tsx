import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function RiskScorePage() {
  const session = await auth();
  if (!session?.user) redirect('/signin');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="risk-score" userName={session.user.name || 'User'} userInitials={(session.user.name || 'U').slice(0,2).toUpperCase()} />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#F4F6FA' }}>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Risk Score</h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
            Your personalised stroke risk score based on health profile and live PRV data.
          </p>
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>Full Risk Score breakdown coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
