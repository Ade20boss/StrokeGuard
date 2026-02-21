"use client";

import { Search, Bell, ChevronDown, Ruler } from 'lucide-react';
import { useState } from 'react';

interface DashboardTopBarProps {
  userName?: string;
  userInitials?: string;
}

export function DashboardTopBar({ userName = 'User', userInitials = 'U' }: DashboardTopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="h-16 border-b border-[#E2E8F0] bg-white flex items-center justify-between px-8 flex-shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center text-[13px] font-sans">
        <span className="text-[#94A3B8]">Dashboard</span>
        <span className="mx-2 text-[#CBD5E1]">/</span>
        <span className="text-[#0F172A] font-semibold">Overview</span>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-[480px] h-10 pl-10 pr-3 rounded-lg border-0 text-[13px] bg-[#F1F5F9] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 font-sans"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={20} className="text-[#64748B]" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-white border bg-[#EF4444]" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[300px] rounded-xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
                <span className="text-sm font-semibold font-sans text-[#0F172A]">Reminders</span>
                <button className="text-xs font-medium font-sans text-[#0EA5E9]">Mark all read</button>
              </div>
              <div className="flex items-start gap-3 px-4 py-4 border-b border-[#F1F5F9]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#FFFBEB]">
                  <Ruler size={15} className="text-[#F59E0B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold mb-0.5 font-sans text-[#0F172A]">Update your measurements</p>
                  <p className="text-xs font-sans text-[#64748B]">Height and weight not updated in 30 days.</p>
                </div>
                <span className="text-[10px] flex-shrink-0 font-mono text-[#94A3B8]">2d ago</span>
              </div>
              <div className="px-4 py-3 text-center">
                <button className="text-xs font-medium font-sans text-[#0EA5E9]">See all reminders</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 ml-2 cursor-pointer">
          <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold bg-[#DBEAFE] text-[#1D4ED8] font-sans">
            {userInitials}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[13px] font-medium leading-[14px] text-[#0F172A] font-sans">{userName.toLowerCase()}</p>
            <p className="text-[11px] leading-[14px] text-[#94A3B8] font-sans mt-0.5">Patient</p>
          </div>
        </div>
      </div>
    </div>
  );
}
