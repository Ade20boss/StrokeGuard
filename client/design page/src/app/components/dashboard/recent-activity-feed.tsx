import { CheckCircle, TrendingUp, Droplets, Watch } from 'lucide-react';
import { useState } from 'react';

interface ActivityItem {
  id: string;
  icon: 'check' | 'trending' | 'droplet' | 'watch';
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

export function RecentActivityFeed() {
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');

  const activities: ActivityItem[] = [
    {
      id: '1',
      icon: 'check',
      iconColor: '#10B981',
      iconBg: '#ECFDF5',
      title: 'FAST Check Completed',
      description: 'All signs clear — no flags raised',
      time: '09:14',
    },
    {
      id: '2',
      icon: 'trending',
      iconColor: '#0EA5E9',
      iconBg: '#EFF6FF',
      title: 'Risk Score Updated',
      description: 'Score improved to 74 / 100',
      time: '08:50',
    },
    {
      id: '3',
      icon: 'droplet',
      iconColor: '#F59E0B',
      iconBg: '#FFFBEB',
      title: 'SpO2 Dip Detected',
      description: 'Recovered within 2 minutes',
      time: '07:30',
    },
    {
      id: '4',
      icon: 'watch',
      iconColor: '#0EA5E9',
      iconBg: '#EFF6FF',
      title: 'Watch Synced',
      description: 'Oraimo Watch 3 connected',
      time: '07:00',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'check':
        return CheckCircle;
      case 'trending':
        return TrendingUp;
      case 'droplet':
        return Droplets;
      case 'watch':
        return Watch;
      default:
        return CheckCircle;
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 border"
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[15px] font-semibold"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0F172A',
          }}
        >
          Recent Activity
        </span>
        <button
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0EA5E9',
          }}
        >
          See all
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 border-b" style={{ borderColor: '#F1F5F9' }}>
        <button
          onClick={() => setActiveTab('today')}
          className="pb-2 text-[13px] transition-all"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: activeTab === 'today' ? 600 : 400,
            color: activeTab === 'today' ? '#0EA5E9' : '#94A3B8',
            borderBottom: activeTab === 'today' ? '2px solid #0EA5E9' : 'none',
            marginBottom: '-1px',
          }}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('week')}
          className="pb-2 text-[13px] transition-all"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: activeTab === 'week' ? 600 : 400,
            color: activeTab === 'week' ? '#0EA5E9' : '#94A3B8',
            borderBottom: activeTab === 'week' ? '2px solid #0EA5E9' : 'none',
            marginBottom: '-1px',
          }}
        >
          This Week
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-0">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.icon);
          return (
            <div
              key={activity.id}
              className="flex items-center gap-3 py-3"
              style={{
                borderBottom: index < activities.length - 1 ? `1px solid #F8FAFC` : 'none',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: activity.iconBg }}
              >
                <Icon size={16} style={{ color: activity.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px] font-medium mb-0.5"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#0F172A',
                  }}
                >
                  {activity.title}
                </p>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#64748B',
                  }}
                >
                  {activity.description}
                </p>
              </div>
              <span
                className="text-[11px] flex-shrink-0"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  color: '#94A3B8',
                }}
              >
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
