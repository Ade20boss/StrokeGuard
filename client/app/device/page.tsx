import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function DevicePage() {
  const session = await auth();
  if (!session?.user) redirect('/signin');

  const userName = session.user.name || 'User';
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="device" userName={userName} userInitials={userName.slice(0,2).toUpperCase()} />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#F4F6FA' }}>
        <div className="max-w-2xl mx-auto px-6 py-10 w-full">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Device</h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
            Camera and sensor configuration for pulse monitoring.
          </p>

          {/* Camera status */}
          <div className="bg-white rounded-2xl px-6 py-5 mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Webcam (rPPG)</p>
            <p className="text-[13px] mb-3" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
              StrokeGuard uses your device camera to measure pulse rate and PRV in real time. No data leaves your device — processing is done locally.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#ECFDF5' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-[12px] font-semibold" style={{ fontFamily: 'DM Sans, sans-serif', color: '#065F46' }}>Camera active on Dashboard</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl px-6 py-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Tips for accurate readings</p>
            <ul className="space-y-2 mt-2">
              {['Good, even lighting on your face','Sit still during measurement','Face the camera directly at eye level','Avoid strong backlighting or shadows'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#0EA5E9] font-bold mt-0.5">·</span>
                  <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
