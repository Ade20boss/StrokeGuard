"use client";

import { Bell, Shield, Ruler } from 'lucide-react';
import { useState } from 'react';

export function TopNavigation() {
  const [showNotifications, setShowNotifications] = useState(false);
  const hasUnread = true;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E2E8F0] z-40">
        <div className="h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#0EA5E9]" />
            <span 
              className="font-bold text-[17px] text-[#0F172A]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              StrokeGuard
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                onMouseEnter={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="w-5 h-5 text-[#94A3B8]" />
                {hasUnread && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div 
                  className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-[#E2E8F0] rounded-xl overflow-hidden"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="p-4 border-b border-[#F1F5F9]">
                    <h3 
                      className="text-[14px] font-semibold text-[#0F172A]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Reminders
                    </h3>
                  </div>
                  
                  <div className="p-4 border-b border-[#F1F5F9]">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] flex items-center justify-center flex-shrink-0">
                        <Ruler className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-[13px] font-semibold text-[#0F172A] mb-0.5"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Update your measurements
                        </p>
                        <p 
                          className="text-[12px] text-[#64748B] leading-relaxed"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Your height and weight haven't been updated in 30 days. Tap to update.
                        </p>
                      </div>
                      
                      <span 
                        className="text-[10px] text-[#94A3B8] flex-shrink-0"
                        style={{ fontFamily: 'Space Mono, monospace' }}
                      >
                        2d ago
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 text-center">
                    <button 
                      className="text-[12px] font-medium text-[#0EA5E9] hover:text-[#0284C7]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      See all reminders
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-[34px] h-[34px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <span 
                className="text-[#1D4ED8] font-bold text-[13px]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                JD
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
