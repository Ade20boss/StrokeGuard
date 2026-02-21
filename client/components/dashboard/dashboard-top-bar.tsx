"use client";

import { Search, Bell, ChevronDown, Ruler } from 'lucide-react';
import { useState } from 'react';

export function DashboardTopBar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div
      className="h-16 border-b flex items-center justify-between px-8"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center">
        <span
          className="text-base font-semibold"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0F172A',
          }}
        >
          Dashboard
        </span>
        <span className="mx-2 text-sm" style={{ color: '#CBD5E1' }}>
          /
        </span>
        <span
          className="text-sm"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          Overview
        </span>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#94A3B8' }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-[200px] h-9 pl-10 pr-3 rounded-lg border-0 text-[13px] focus:outline-none focus:ring-1"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
            }}
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell size={20} style={{ color: '#64748B' }} />
            <div
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-white border"
              style={{ backgroundColor: '#EF4444' }}
            />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-[300px] rounded-xl border overflow-hidden z-50"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
                <span
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#0F172A',
                  }}
                >
                  Reminders
                </span>
                <button
                  className="text-xs font-medium"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#0EA5E9',
                  }}
                >
                  Mark all read
                </button>
              </div>

              {/* Notification Item */}
              <div className="flex items-start gap-3 px-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FFFBEB' }}
                >
                  <Ruler size={15} style={{ color: '#F59E0B' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-semibold mb-0.5"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#0F172A',
                    }}
                  >
                    Update your measurements
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#64748B',
                    }}
                  >
                    Height and weight not updated in 30 days.
                  </p>
                </div>
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    color: '#94A3B8',
                  }}
                >
                  2d ago
                </span>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 text-center">
                <button
                  className="text-xs font-medium"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#0EA5E9',
                  }}
                >
                  See all reminders
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#DBEAFE',
              color: '#1D4ED8',
            }}
          >
            JA
          </div>
          <div>
            <p
              className="text-[13px] font-medium leading-tight"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#0F172A',
              }}
            >
              John A.
            </p>
            <p
              className="text-[11px] leading-tight"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#64748B',
              }}
            >
              Patient
            </p>
          </div>
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </div>
      </div>
    </div>
  );
}