import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';

const articles = [
  { title: 'What is a Stroke?', summary: 'A stroke occurs when blood supply to part of the brain is cut off. Learn the signs, types, and what to do immediately.', tag: 'Basics' },
  { title: 'F.A.S.T. — The 4 Warning Signs', summary: 'Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Act fast to save lives.', tag: 'Emergency' },
  { title: 'Risk Factors You Can Control', summary: 'High blood pressure, diabetes, smoking and inactivity all increase stroke risk. Find out how to reduce them.', tag: 'Prevention' },
  { title: 'Understanding PRV and Brain Health', summary: 'Pulse Rate Variability reflects autonomic nervous system activity, an important early indicator of cardiovascular health.', tag: 'Science' },
  { title: 'Recovery After a Stroke', summary: 'Most stroke survivors regain significant function. Learn about rehabilitation and what to expect in recovery.', tag: 'Recovery' },
];

export default async function EducationPage() {
  const session = await auth();
  if (!session?.user) redirect('/signin');

  const userName = session.user.name || 'User';
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="education" userName={userName} userInitials={userName.slice(0,2).toUpperCase()} />
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#F4F6FA' }}>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>Health Education</h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}>
            Learn about stroke prevention, recognition, and recovery.
          </p>
          <div className="space-y-4">
            {articles.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl px-6 py-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold" style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}>{a.title}</p>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold" style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: '#EFF6FF', color: '#0EA5E9' }}>{a.tag}</span>
                </div>
                <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B', lineHeight: '1.6' }}>{a.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
