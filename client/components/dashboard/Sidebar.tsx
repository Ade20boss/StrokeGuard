"use client";

import { Home, Activity, HeartPulse, Clock, Users, BookOpen, Watch, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
interface SidebarProps {
  activePage?: string;
  showFastCheckAlert?: boolean;
  userName?: string;
  userInitials?: string;
  onClose?: () => void;
}

export function Sidebar({ activePage = 'dashboard', showFastCheckAlert = false, userName = 'John', userInitials = 'JA', onClose }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'fast-check', icon: Activity, label: 'FAST Check', path: '/fast-check', hasAlert: showFastCheckAlert },
    { id: 'risk-score', icon: HeartPulse, label: 'Risk Score', path: '/risk-score' },
    { id: 'history', icon: Clock, label: 'History', path: '/history' },
  ];

  const careItems = [
    { id: 'sos', icon: Activity, label: 'Emergency SOS', path: '/sos' },
    { id: 'contacts', icon: Users, label: 'Emergency Contacts', path: '/contacts' },
    { id: 'education', icon: BookOpen, label: 'Health Education', path: '/education' },
    { id: 'device', icon: Watch, label: 'Device', path: '/device' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'logout', icon: LogOut, label: 'Sign Out', path: '/welcome' },
  ];

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon;
    const isHovered = hoveredItem === item.id;
    const isFastCheck = item.id === 'fast-check';

    return (
      <div
        className="relative px-3 mb-1 cursor-pointer"
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => router.push(item.path)}
      >
        <div
          className="flex items-center h-11 px-4 rounded-lg transition-all duration-200"
          style={{
            backgroundColor: item.hasAlert
              ? 'rgba(239, 68, 68, 0.12)'
              : isActive
              ? 'rgba(14, 165, 233, 0.14)'
              : isFastCheck && !isActive
              ? 'rgba(14, 165, 233, 0.05)'
              : isHovered
              ? 'rgba(255, 255, 255, 0.05)'
              : 'transparent',
            borderLeft: item.hasAlert ? '3px solid #EF4444' : isActive ? '3px solid #0EA5E9' : '3px solid transparent',
            marginLeft: '-3px',
          }}
        >
          <div className="flex-1 flex flex-col">
            <div className="flex items-center">
              <Icon
                size={20}
                style={{
                  color: item.hasAlert ? '#EF4444' : isActive ? '#0EA5E9' : isFastCheck ? '#94A3B8' : isHovered ? '#CBD5E1' : '#94A3B8',
                }}
              />
              <span
                className="ml-2.5 text-sm"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: item.hasAlert ? 600 : isActive ? 600 : 500,
                  color: item.hasAlert ? '#EF4444' : isActive ? '#E2E8F0' : isFastCheck ? '#94A3B8' : isHovered ? '#CBD5E1' : '#94A3B8',
                }}
              >
                {item.label}
              </span>
            </div>
            {/* Sub-label for FAST Check */}
            {isFastCheck && (
              <span
                className="text-[9px] ml-7"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: item.hasAlert ? '#EF4444' : '#64748B',
                }}
              >
                {item.hasAlert ? 'Action Required' : 'Monitoring'}
              </span>
            )}
          </div>
          {item.hasAlert && (
            <div
              className="ml-auto w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#EF4444' }}
            >
              <span
                className="text-[11px] font-bold text-white"
                style={{ fontFamily: 'Space Mono, monospace' }}
              >
                !
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-60 h-screen flex flex-col overflow-y-auto"
      style={{ backgroundColor: '#0A1628' }}
    >
      {/* Logo Section */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center">
          <Shield size={28} style={{ color: '#0EA5E9' }} />
          <span
            className="ml-2.5 text-lg font-bold text-white"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            StrokeGuard
          </span>
        </div>
        <p
          className="text-[11px] mt-1"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
            letterSpacing: '0.3px',
          }}
        >
          Stroke Awareness Platform
        </p>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      />

      {/* User Profile Section */}
      <div className="px-5 py-4">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              backgroundColor: '#1D4ED8',
              color: '#93C5FD',
            }}
          >
            {userInitials || 'U'}
          </div>
          <div className="ml-3 flex-1">
            <p
              className="text-[13px] font-semibold"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#E2E8F0',
              }}
            >
              {userName || 'User'}
            </p>
            <p
              className="text-[11px]"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#64748B',
              }}
            >
              Patient
            </p>
          </div>
          <ChevronDown size={14} style={{ color: '#64748B' }} />
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      />

      {/* Main Navigation */}
      <div className="py-3">
        {navItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === activePage} />
        ))}
      </div>

      {/* Care Section */}
      <div className="py-3">
        <p
          className="px-5 mb-2 mt-4 text-[10px] font-semibold uppercase"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#475569',
            letterSpacing: '1.5px',
          }}
        >
          CARE
        </p>
        {careItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === activePage} />
        ))}
      </div>

      {/* Spacer to push bottom items down */}
      <div className="flex-1" />

      {/* Divider */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      />

      {/* Bottom Navigation */}
      <div className="py-3">
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={false} />
        ))}
      </div>
    </div>
  );
}