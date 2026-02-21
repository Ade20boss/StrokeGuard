"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import WebcamPPG from '@/components/fast-check/WebcamPPG';
import { useStrokeMonitoring } from './useStrokeMonitoring';
import { StrokeScoreCard } from './StrokeScoreCard';
import { Sidebar } from './Sidebar';
import { DashboardTopBar } from './DashboardTopBar';
import { DashboardGreeting } from './DashboardGreeting';
import { LiveVitalsStrip } from './LiveVitalsStrip';
import { HRVOrbDetailCard } from './HRVOrbDetailCard';
import { HRVCalendar } from './HRVCalendar';
import { BloodPressureLog } from './BloodPressureLog';
import { RecentActivityFeed } from './RecentActivityFeed';
import { FastCheckStatusCard } from './FastCheckStatusCard';
import { EmergencyContactStrip } from './EmergencyContactStrip';
import { ImOkTimerCard } from './ImOkTimerCard';
import { RiskFactorCalloutCard } from './RiskFactorCalloutCard';
import { HealthTipsCard } from './HealthTipsCard';
import { FloatingSOSButton } from './FloatingSOSButton';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  createdAt: Date;
}

interface HealthProfile {
  bloodPressure: string | null;
  hasDiabetes: boolean;
  smokes: boolean;
  activityLevel: string | null;
}

interface DashboardClientProps {
  userName: string;
  emergencyContacts: Contact[];
  healthProfile: HealthProfile | null;
  monitoringSessions: any[];
}

function parseBloodPressure(bp: string | null): {
  systolic: number | null;
  diastolic: number | null;
  status: 'normal' | 'elevated';
} {
  if (!bp) return { systolic: null, diastolic: null, status: 'normal' };
  const match = bp.match(/(\d+)\/(\d+)/);
  if (!match) return { systolic: null, diastolic: null, status: 'normal' };
  const sys = parseInt(match[1]);
  const dia = parseInt(match[2]);
  return {
    systolic: sys,
    diastolic: dia,
    status: sys >= 130 || dia >= 80 ? 'elevated' : 'normal',
  };
}

function computeRiskScore(profile: HealthProfile | null): number {
  if (!profile) return 30;
  let score = 10;
  if (profile.hasDiabetes) score += 25;
  if (profile.smokes) score += 30;
  if (profile.activityLevel === 'sedentary') score += 15;
  else if (profile.activityLevel === 'moderate') score += 5;
  const { status } = parseBloodPressure(profile.bloodPressure);
  if (status === 'elevated') score += 20;
  return Math.min(score, 100);
}

function computeRiskFactor(profile: HealthProfile | null): {
  hasRisk: boolean;
  riskFactor?: string;
  recommendation?: string;
} {
  if (!profile) return { hasRisk: false };
  if (profile.smokes)
    return {
      hasRisk: true,
      riskFactor: 'Active smoker — significantly elevated stroke risk.',
      recommendation: 'Talk to your doctor about a cessation program. Quitting can halve your risk within 2 years.',
    };
  if (profile.hasDiabetes)
    return {
      hasRisk: true,
      riskFactor: 'Diabetes detected in your health profile.',
      recommendation: 'Ensure your blood sugar is well-controlled and monitor blood pressure regularly.',
    };
  const { status } = parseBloodPressure(profile.bloodPressure);
  if (status === 'elevated')
    return {
      hasRisk: true,
      riskFactor: 'Elevated blood pressure recorded in your health profile.',
      recommendation: 'Consider scheduling a check-up with your primary care physician.',
    };
  if (profile.activityLevel === 'sedentary')
    return {
      hasRisk: true,
      riskFactor: 'Sedentary activity level detected.',
      recommendation: 'Aim for 30 minutes of moderate activity per day to reduce stroke risk.',
    };
  return { hasRisk: false };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardClient({
  userName,
  emergencyContacts,
  healthProfile,
  monitoringSessions,
}: DashboardClientProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when navigating (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { systolic, diastolic, status: bpStatus } = parseBloodPressure(
    healthProfile?.bloodPressure ?? null
  );
  const riskScore = computeRiskScore(healthProfile);
  const { hasRisk, riskFactor, recommendation } = computeRiskFactor(healthProfile);

  // PRV is now sourced from the webcam rPPG session in /fast-check
  // No Bluetooth / smartwatch dependency anymore
  const sdnn = null as number | null;
  const hrvStatus: 'healthy' | 'borderline' | 'elevated' = 'healthy';
  const showFastCheckAlert = false;
  const userInitials = getInitials(userName || 'User');

  // ── Stroke monitoring (Quick Check + Active Monitoring) ───────────────
  const monitoring = useStrokeMonitoring(riskScore, monitoringSessions);

  // Stable callback ref so WebcamPPG doesn't re-render every time
  const handleVitals = useCallback(
    (pr: number, prv: number) => monitoring.receiveVitals(pr, prv),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monitoring.receiveVitals]
  );

  const bpHistory: number[][] =
    systolic && diastolic
      ? [
          [systolic, diastolic],
          [systolic - 2, diastolic - 1],
          [systolic + 2, diastolic + 1],
          [systolic - 1, diastolic],
          [systolic, diastolic - 2],
        ]
      : [];

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, shows as drawer on tap */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar
          activePage="dashboard"
          showFastCheckAlert={showFastCheckAlert}
          userName={userName}
          userInitials={userInitials}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
        {/* Top bar — includes hamburger on mobile */}
        <div className="flex items-center gap-3 lg:gap-0">
          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden ml-4 mt-0 flex-shrink-0 p-2 rounded-lg hover:bg-white/60 transition-colors"
            onClick={() => setSidebarOpen(true)}
            style={{ marginTop: '0px' }}
          >
            <Menu size={22} style={{ color: '#0F172A' }} />
          </button>
          <div className="flex-1">
            <DashboardTopBar userName={userName} userInitials={userInitials} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-[20px]">

            {/* Greeting & Quick Vitals */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <DashboardGreeting userName={userName} />
              <LiveVitalsStrip 
                pulseRate={monitoring.sessionPulseRate} 
                prv={monitoring.sessionPRV} 
                spO2={null} 
              />
            </div>

            {/* Two-column grid — stacks on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-[20px]">
              {/* LEFT COLUMN */}
              <div className="space-y-[20px]">
              {/* Stroke Score Card — dynamic, session-based */}
              <StrokeScoreCard
                mode={monitoring.mode}
                strokeScore={monitoring.strokeScore}
                countdown={monitoring.countdown}
                sessionPulseRate={monitoring.sessionPulseRate}
                sessionPRV={monitoring.sessionPRV}
                checkResult={monitoring.checkResult}
                streak={monitoring.streak}
                activeMinutesLeft={monitoring.activeMinutesLeft}
                triageStatus={monitoring.triageStatus}
                aiAdvice={monitoring.aiAdvice}
                alertFailure={monitoring.alertFailure}
                uiAction={monitoring.uiAction}
                onStartQuickCheck={monitoring.startQuickCheck}
                onCancelQuickCheck={monitoring.cancelQuickCheck}
                onToggleActiveMonitoring={monitoring.toggleActiveMonitoring}
              />

                <HRVOrbDetailCard
                  sdnn={sdnn}
                  hrvi={0}
                  restingHR={null}
                  spO2={null}
                  deviceName={null}
                  sparklineData={[58, 62, 55, 60, 64, 59, 62]}
                />
                <HRVCalendar />
                <BloodPressureLog
                  systolic={systolic}
                  diastolic={diastolic}
                  status={bpStatus}
                  history={bpHistory}
                  averageSystolic={systolic ?? 0}
                  averageDiastolic={diastolic ?? 0}
                />
                <RecentActivityFeed />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-[20px]">
                {/* Live daily pulse monitor - Moved here to be side-by-side with StrokeScoreCard per user request */}
                <div className="bg-white rounded-[16px] overflow-hidden animate-in fade-in duration-500 border border-[#E2E8F0]">
                  <div className="flex items-center justify-between px-[24px] py-4 border-b border-[#F1F5F9]">
                    <div>
                      <p className="text-[16px] font-semibold font-sans text-[#0F172A]">Daily Pulse Monitor</p>
                      <p className="text-[11px] font-sans text-[#94A3B8]">rPPG · webcam · PRV computed live</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-sans font-medium text-[11px] text-[#10B981]">
                         {monitoring.mode !== 'idle' ? 'Live' : 'Ready'}
                       </span>
                       <div className={`w-2 h-2 rounded-full bg-[#10B981] ${monitoring.mode !== 'idle' ? 'animate-pulse' : ''}`} />
                    </div>
                  </div>
                  {/* WebcamPPG — handles its own aspect ratio now */}
                  <div className="bg-[#0F172A] p-[12px] relative flex justify-center w-full">
                    <WebcamPPG 
                      isActiveExternally={monitoring.mode !== 'idle'} 
                      onVitalsUpdate={handleVitals}
                      onComplete={monitoring.cancelQuickCheck}
                    />
                  </div>
                </div>

                <FastCheckStatusCard
                  sdnn={sdnn}
                  onStartCheck={() => router.push('/fast-check')}
                />
                <EmergencyContactStrip contacts={emergencyContacts} />
                <ImOkTimerCard />
                <RiskFactorCalloutCard
                  hasRisk={hasRisk}
                  riskFactor={riskFactor}
                  recommendation={recommendation}
                />
                <HealthTipsCard />
              </div>
            </div>

            <div className="h-6 sm:h-8" />
          </div>
        </div>
      </div>

      <FloatingSOSButton firstContactPhone={emergencyContacts[0]?.phone} />
    </div>
  );
}
