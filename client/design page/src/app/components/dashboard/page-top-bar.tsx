import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PageTopBarProps {
  breadcrumbFirst?: string;
  breadcrumbSecond: string;
}

export function PageTopBar({ breadcrumbFirst = 'Dashboard', breadcrumbSecond }: PageTopBarProps) {
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
          {breadcrumbFirst}
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
          {breadcrumbSecond}
        </span>
      </div>

      {/* Right: Notifications, Profile */}
      <div className="flex items-center gap-4">
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
