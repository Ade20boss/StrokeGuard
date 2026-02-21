type HRVStatus = 'healthy' | 'borderline' | 'elevated';

interface HRVOrbProps {
  sdnn: number;
}

export function HRVOrb({ sdnn }: HRVOrbProps) {
  // Determine status based on SDNN thresholds
  const getStatus = (): HRVStatus => {
    if (sdnn >= 50) return 'healthy';
    if (sdnn >= 20) return 'borderline';
    return 'elevated';
  };

  const status = getStatus();

  const statusConfig = {
    healthy: {
      color: '#10B981',
      label: 'Healthy'
    },
    borderline: {
      color: '#F59E0B',
      label: 'Borderline'
    },
    elevated: {
      color: '#EF4444',
      label: 'Elevated Risk'
    }
  };

  const config = statusConfig[status];
  
  return (
    <div className="flex flex-col items-center my-7">
      <div 
        className="w-24 h-24 rounded-full relative"
        style={{ 
          backgroundColor: config.color,
          boxShadow: `inset 0 0 32px ${config.color}66`
        }}
      />
      
      <p 
        className="text-[12px] text-[#94A3B8] mt-2" 
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        Heart Rate Variability
      </p>
      
      <p 
        className="text-[18px] font-bold mt-1" 
        style={{ 
          fontFamily: 'Space Mono, monospace',
          color: config.color 
        }}
      >
        {sdnn} ms
      </p>
      
      <p 
        className="text-[13px] font-semibold mt-1" 
        style={{ 
          fontFamily: 'DM Sans, sans-serif',
          color: config.color 
        }}
      >
        {config.label}
      </p>
    </div>
  );
}
