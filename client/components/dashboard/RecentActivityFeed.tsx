"use client";

import { CheckCircle, TrendingUp, AlertTriangle, Watch } from 'lucide-react';
import { useState } from 'react';

interface ActivityItem {
  id: string;
  type: 'fast-check' | 'risk-score' | 'spo2-dip' | 'watch-sync';
  title: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  { id: '1', type: 'fast-check', title: 'FAST Check Completed', description: 'All signs clear — no flags raised', time: '09:14' },
  { id: '2', type: 'risk-score', title: 'Risk Score Updated', description: 'Score improved to 74 / 100', time: '08:50' },
  { id: '3', type: 'spo2-dip', title: 'SpO2 Dip Detected', description: 'Recovered within 2 minutes', time: '07:30' },
  { id: '4', type: 'watch-sync', title: 'Watch Synced', description: 'Connected successfully', time: '07:00' },
];

const getIconConfig = (type: ActivityItem['type']) => {
  switch (type) {
    case 'fast-check': return { icon: CheckCircle, color: '#10B981', bg: '#ECFDF5' };
    case 'risk-score': return { icon: TrendingUp, color: '#0EA5E9', bg: '#EFF6FF' };
    case 'spo2-dip': return { icon: AlertTriangle, color: '#F59E0B', bg: '#FFFBEB' };
    case 'watch-sync': return { icon: Watch, color: '#64748B', bg: '#F1F5F9' };
  }
};

export function RecentActivityFeed() {
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-semibold text-[16px] text-[#0F172A]">Recent Activity</h3>
        <button className="font-sans text-[13px] text-[#0EA5E9] hover:underline">See all</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-4 border-b border-[#F1F5F9]">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 font-sans text-[13px] border-b-2 transition-colors ${
            activeTab === 'today' 
              ? 'border-[#0EA5E9] text-[#0EA5E9] font-semibold' 
              : 'border-transparent text-[#94A3B8] font-medium'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('week')}
          className={`pb-3 font-sans text-[13px] border-b-2 transition-colors ${
            activeTab === 'week' 
              ? 'border-[#0EA5E9] text-[#0EA5E9] font-semibold' 
              : 'border-transparent text-[#94A3B8] font-medium'
          }`}
        >
          This Week
        </button>
      </div>

      {/* Activity List */}
      <div className="flex flex-col">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = getIconConfig(activity.type);
          return (
            <div 
              key={activity.id} 
              className={`flex items-center gap-4 py-[12px] ${
                index !== activities.length - 1 ? 'border-b border-[#F1F5F9]' : ''
              }`}
            >
              <div 
                className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0" 
                style={{ backgroundColor: bg }}
              >
                <Icon size={16} strokeWidth={2.5} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-[13px] text-[#334155] leading-snug">
                  {activity.description}
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#94A3B8] flex-shrink-0">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
