import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/dashboard/sidebar';
import { DashboardTopBar } from '../components/dashboard/dashboard-top-bar';
import { HeroBanner } from '../components/dashboard/hero-banner';
import { MetricTiles } from '../components/dashboard/metric-tiles';
import { HRVOrbDetailCard } from '../components/dashboard/hrv-orb-detail-card';
import { HRVCalendar } from '../components/dashboard/hrv-calendar';
import { BloodPressureLog } from '../components/dashboard/blood-pressure-log';
import { RecentActivityFeed } from '../components/dashboard/recent-activity-feed';
import { FastCheckStatusCard } from '../components/dashboard/fast-check-status-card';
import { EmergencyContactStrip } from '../components/dashboard/emergency-contact-strip';
import { ImOkTimerCard } from '../components/dashboard/im-ok-timer-card';
import { RiskFactorCalloutCard } from '../components/dashboard/risk-factor-callout-card';
import { HealthTipsCard } from '../components/dashboard/health-tips-card-new';
import { FloatingSOSButton } from '../components/dashboard/floating-sos-button';

/**
 * StrokeGuard Dashboard - Upgraded Premium Design
 * 
 * Features:
 * - Fixed left sidebar (240px) with dark navy background (#0A1628)
 * - Dynamic FAST Check activation when SDNN < 20ms
 * - HRV monitoring centerpiece with orb visualization
 * - Interactive HRV calendar with color-coded history
 * - Two-column layout (58% / 40%) for optimal information hierarchy
 * - Premium shadows, gradients, and spacing following medical UI standards
 * - DM Sans for all UI copy, Space Mono for all numbers/data
 * 
 * Design System:
 * - Primary blue: #0EA5E9, hover: #0284C7
 * - Success: #10B981, Warning: #F59E0B, Danger: #EF4444
 * - Slate neutrals for text hierarchy
 * - Consistent 8px/12px/16px radius tokens
 * - Shadow depth: sm/md/lg with proper elevation
 */
export default function DashboardUpgraded() {
  const navigate = useNavigate();
  
  // Mock data - adjust SDNN to < 20 to see FAST Check activate
  const [sdnn] = useState(62);
  
  // Calculate HRV status
  const getHRVStatus = (): 'healthy' | 'borderline' | 'elevated' => {
    if (sdnn >= 50) return 'healthy';
    if (sdnn >= 20) return 'borderline';
    return 'elevated';
  };

  const hrvStatus = getHRVStatus();
  const showFastCheckAlert = sdnn < 20;

  // Mock sparkline data (7 hours of HRV readings)
  const sparklineData = [58, 62, 55, 60, 64, 59, 62];

  // Mock blood pressure history
  const bpHistory: number[][] = [
    [122, 80],
    [118, 78],
    [124, 82],
    [120, 79],
    [124, 82],
  ];

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <Sidebar activePage="dashboard" showFastCheckAlert={showFastCheckAlert} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
        {/* Top Bar */}
        <DashboardTopBar />

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-8 py-6 space-y-5">
            {/* Hero Banner */}
            <HeroBanner
              userName="John"
              heartRate={74}
              spO2={98}
              hrv={sdnn}
              sdnn={sdnn}
              onFastCheckClick={() => navigate('/fast-check')}
            />

            {/* Metric Summary Tiles */}
            <MetricTiles
              riskScore={74}
              hrv={sdnn}
              hrvStatus={hrvStatus}
              systolic={124}
              diastolic={82}
              bpStatus="normal"
              deviceName="Oraimo Watch 3"
              deviceConnected={true}
              lastSync="2 min ago"
            />

            {/* Main Grid - Two Column */}
            <div className="grid grid-cols-[58%_40%] gap-5">
              {/* LEFT COLUMN */}
              <div className="space-y-5">
                {/* HRV Orb Detail Card */}
                <HRVOrbDetailCard
                  sdnn={sdnn}
                  hrvi={18.4}
                  restingHR={68}
                  spO2={98}
                  deviceName="Oraimo Watch 3"
                  sparklineData={sparklineData}
                />

                {/* HRV Calendar */}
                <HRVCalendar />

                {/* Blood Pressure Log */}
                <BloodPressureLog
                  systolic={124}
                  diastolic={82}
                  status="normal"
                  history={bpHistory}
                  averageSystolic={122}
                  averageDiastolic={80}
                />

                {/* Recent Activity Feed */}
                <RecentActivityFeed />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-5">
                {/* FAST Check Status Card */}
                <FastCheckStatusCard
                  sdnn={sdnn}
                  onStartCheck={() => navigate('/fast-check')}
                />

                {/* Emergency Contact Strip */}
                <EmergencyContactStrip />

                {/* I'm OK Timer Card */}
                <ImOkTimerCard />

                {/* Risk Factor Callout */}
                <RiskFactorCalloutCard
                  hasRisk={true}
                  riskFactor="Elevated blood pressure detected 3 times this week"
                  recommendation="Consider scheduling a check-up with your primary care physician"
                />

                {/* Health Tips Card */}
                <HealthTipsCard />
              </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>
      </div>

      {/* Floating SOS Button */}
      <FloatingSOSButton onClick={() => navigate('/sos')} />
    </div>
  );
}