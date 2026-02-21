"use client";

import { Timer } from 'lucide-react';
import { useState } from 'react';

export function ImOkTimerCard() {
  const [isActive, setIsActive] = useState(true);

  if (isActive) {
    // Active Timer State
    return (
      <div
        className="bg-white rounded-2xl p-5 border"
        style={{
          borderColor: '#E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="relative w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FFFBEB' }}
            >
              <Timer size={18} style={{ color: '#F59E0B' }} />
              {/* Ring indicator */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{ border: '2px solid #F59E0B', opacity: 0.3 }}
              />
            </div>
            <div>
              <p
                className="text-sm font-semibold mb-0.5"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#0F172A',
                }}
              >
                Check in by 16:45
              </p>
              <p
                className="text-base font-bold"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  color: '#F59E0B',
                }}
              >
                in 1h 23m
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(false)}
              className="h-8 px-3 rounded-lg hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                I'm OK
              </span>
            </button>
            <button
              onClick={() => setIsActive(false)}
              className="h-8 px-3 rounded-lg border hover:bg-gray-50 transition-colors"
              style={{
                borderColor: '#E2E8F0',
                color: '#64748B',
              }}
            >
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Cancel
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inactive State
  return (
    <div
      className="bg-white rounded-2xl p-5 border"
      style={{
        borderColor: '#E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFFBEB' }}
          >
            <Timer size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <p
              className="text-sm font-semibold mb-0.5"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#0F172A',
              }}
            >
              I'm OK Timer
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#64748B',
              }}
            >
              Contacts alerted automatically if you don't check in.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsActive(true)}
          className="text-[13px] font-medium hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0EA5E9',
          }}
        >
          Set Timer
        </button>
      </div>
    </div>
  );
}
