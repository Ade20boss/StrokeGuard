import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Heart, Activity, Phone, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { emergencyContacts: true }
      }
    }
  });

  if (!user?.hasCompletedOnboarding) {
    redirect("/onboarding/health-profile");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <h1 className="text-xl font-bold">
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
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#3B82F6] rounded-2xl p-8 text-white mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {user.name?.split(" ")[0] || "User"}
          </h2>
          <p className="text-white/90 text-[15px]">
            Your StrokeGuard setup is complete. Stay healthy and vigilant.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Awareness Score */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-[#64748B] text-xs">
                  Awareness Score
                </p>
                <p className="text-2xl font-bold font-mono">
                  85
                </p>
              </div>
            </div>
            <p className="text-[#64748B] text-sm">
              Good standing. Keep monitoring your health.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#D97706]" />
              </div>
              <div>
                <p className="text-[#64748B] text-xs">
                  Emergency Contacts
                </p>
                <p className="text-2xl font-bold font-mono">
                  {user._count.emergencyContacts}
                </p>
              </div>
            </div>
            <Link
              href="/onboarding/emergency-contacts"
              className="text-[#0EA5E9] text-sm hover:underline"
            >
              Manage contacts
            </Link>
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#059669]" />
              </div>
              <div>
                <p className="text-[#64748B] text-xs">
                  Health Status
                </p>
                <p className="text-2xl font-bold">
                  Active
                </p>
              </div>
            </div>
            <p className="text-[#64748B] text-sm">
              All systems monitoring
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h3 className="text-lg font-bold mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border border-[#E2E8F0] rounded-xl text-left hover:border-[#0EA5E9] hover:bg-[#EFF6FF] transition-all">
              <p className="text-[15px] font-semibold mb-1">
                Run FAST Check
              </p>
              <p className="text-[#64748B] text-sm">
                Quick stroke symptom assessment
              </p>
            </button>
            <Link 
              href="/onboarding/health-profile"
              className="p-4 border border-[#E2E8F0] rounded-xl text-left hover:border-[#0EA5E9] hover:bg-[#EFF6FF] transition-all"
            >
              <p className="text-[15px] font-semibold mb-1">
                Update Profile
              </p>
              <p className="text-[#64748B] text-sm">
                Keep your health data current
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
