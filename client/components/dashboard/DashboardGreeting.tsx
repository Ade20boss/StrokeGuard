import React from 'react';

interface DashboardGreetingProps {
  userName: string;
}

export function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const firstName = userName.split(' ')[0];
  
  // Format date like: Saturday, 21 February 2026
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  const currentDate = new Date().toLocaleDateString('en-GB', dateOptions);
  
  // Determine time of day
  const hour = new Date().getHours();
  let timeOfDay = "evening";
  if (hour < 12) timeOfDay = "morning";
  else if (hour < 17) timeOfDay = "afternoon";

  return (
    <div className="pt-8 px-8 pb-6">
      <h1 className="font-sans font-bold text-[28px] text-[#0F172A]">
        Good {timeOfDay}, {firstName}.
      </h1>
      <p className="font-sans text-[13px] text-[#94A3B8] mt-1">
        {currentDate}
      </p>
    </div>
  );
}
