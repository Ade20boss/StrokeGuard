import { useNavigate } from 'react-router';
import { Heart, Activity, Phone, Settings } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <h1 
              className="text-[#0F172A] text-xl font-bold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              StrokeGuard
            </h1>
          </div>
          <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] rounded-2xl p-8 text-white mb-8">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Welcome to Your Dashboard
          </h2>
          <p 
            className="text-white/90 text-[15px]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Your StrokeGuard setup is complete. Stay healthy and vigilant.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Awareness Score */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#0EA5E9]" />
              </div>
              <div>
                <p 
                  className="text-[#64748B] text-xs"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Awareness Score
                </p>
                <p 
                  className="text-[#0F172A] text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  85
                </p>
              </div>
            </div>
            <p 
              className="text-[#64748B] text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Good standing. Keep monitoring your health.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#D97706]" />
              </div>
              <div>
                <p 
                  className="text-[#64748B] text-xs"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Emergency Contacts
                </p>
                <p 
                  className="text-[#0F172A] text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  1
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/emergency-contacts')}
              className="text-[#0EA5E9] text-sm hover:underline"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Manage contacts
            </button>
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#059669]" />
              </div>
              <div>
                <p 
                  className="text-[#64748B] text-xs"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Health Status
                </p>
                <p 
                  className="text-[#0F172A] text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Active
                </p>
              </div>
            </div>
            <p 
              className="text-[#64748B] text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              All systems monitoring
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h3 
            className="text-[#0F172A] text-lg font-bold mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-[#E2E8F0] rounded-xl text-left hover:border-[#0EA5E9] hover:bg-[#EFF6FF] transition-all">
              <p 
                className="text-[#0F172A] text-[15px] font-semibold mb-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Run FAST Check
              </p>
              <p 
                className="text-[#64748B] text-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Quick stroke symptom assessment
              </p>
            </button>
            <button className="p-4 border border-[#E2E8F0] rounded-xl text-left hover:border-[#0EA5E9] hover:bg-[#EFF6FF] transition-all">
              <p 
                className="text-[#0F172A] text-[15px] font-semibold mb-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Update Profile
              </p>
              <p 
                className="text-[#64748B] text-sm"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Keep your health data current
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
