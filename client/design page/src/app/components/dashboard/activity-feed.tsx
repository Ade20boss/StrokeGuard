import { Activity, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'fast-check' | 'score-update' | 'sos-alert';
  description: string;
  timestamp: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'fast-check',
    description: 'FAST Check completed — all clear',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'score-update',
    description: 'Risk score improved to 4.2/10',
    timestamp: 'Yesterday'
  },
  {
    id: '3',
    type: 'sos-alert',
    description: 'SOS alert sent to emergency contacts',
    timestamp: '3 days ago'
  }
];

const activityConfig = {
  'fast-check': {
    icon: Activity,
    bgColor: '#EFF6FF',
    iconColor: '#0EA5E9'
  },
  'score-update': {
    icon: TrendingUp,
    bgColor: '#ECFDF5',
    iconColor: '#10B981'
  },
  'sos-alert': {
    icon: AlertCircle,
    bgColor: '#FEF2F2',
    iconColor: '#EF4444'
  }
};

export function ActivityFeed() {
  return (
    <div 
      className="bg-white rounded-2xl p-5 mx-5 border border-[#E2E8F0]"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-[15px] font-semibold text-[#0F172A]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Recent Activity
        </h3>
        <button 
          className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          See all
        </button>
      </div>
      
      <div className="space-y-0">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div key={activity.id}>
              <div className="flex items-center gap-3 py-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.iconColor }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-[13px] text-[#334155]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {activity.description}
                  </p>
                  <p 
                    className="text-[11px] text-[#94A3B8] mt-0.5"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {activity.timestamp}
                  </p>
                </div>
                
                <ChevronRight className="w-[13px] h-[13px] text-[#E2E8F0] flex-shrink-0" />
              </div>
              
              {index < activities.length - 1 && (
                <div className="h-px bg-[#F8FAFC]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
