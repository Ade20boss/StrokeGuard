import { useState } from 'react';
import { TopNavigation } from '../components/dashboard/top-navigation';
import { Greeting } from '../components/dashboard/greeting';
import { HRVOrb } from '../components/dashboard/hrv-orb';
import { FastCheckCard } from '../components/dashboard/fast-check-card';
import { WatchDataCard } from '../components/dashboard/watch-data-card';
import { BloodPressureCard } from '../components/dashboard/blood-pressure-card';
import { TimerCard } from '../components/dashboard/timer-card';
import { ActivityFeed } from '../components/dashboard/activity-feed';
import { RiskFactorCallout } from '../components/dashboard/risk-factor-callout';
import { EmergencyContact } from '../components/dashboard/emergency-contact';
import { HealthTipsCard } from '../components/dashboard/health-tips-card';
import { WellnessTip } from '../components/dashboard/wellness-tip';
import { BottomNavigation } from '../components/dashboard/bottom-navigation';
import { SOSButton } from '../components/dashboard/sos-button';

export default function Dashboard() {
  // Mock data - in production would come from state/API
  const [sdnn] = useState(62); // Change to < 20 to see FAST Check activate
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <TopNavigation />
      
      {/* Main content with top padding for fixed nav */}
      <main className="pt-16">
        <Greeting />
        
        <HRVOrb sdnn={sdnn} />
        
        <div className="space-y-5">
          <FastCheckCard sdnn={sdnn} />
          
          <WatchDataCard 
            heartRate={74}
            spO2={98}
            hrv={sdnn}
            deviceName="Oraimo Watch 3"
          />
          
          <BloodPressureCard
            systolic={124}
            diastolic={82}
            lastLogged="Today at 08:20"
            history={[122, 118, 124, 120, 124]}
          />
          
          <TimerCard />
          
          <ActivityFeed />
          
          <RiskFactorCallout 
            hasRisk={true}
            riskFactor="Elevated blood pressure detected 3 times this week"
            recommendation="Consider scheduling a check-up with your primary care physician"
          />
          
          <EmergencyContact />
          
          <HealthTipsCard />
          
          <WellnessTip />
          
          {/* Bottom spacing for fixed elements */}
          <div className="h-4" />
        </div>
      </main>
      
      <BottomNavigation />
      <SOSButton />
    </div>
  );
}
