"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DayData {
  date: number;
  status: 'healthy' | 'borderline' | 'at-risk' | 'no-data';
  sdnn?: number;
  isToday?: boolean;
}

const statusConfig = {
  healthy: { bg: '#ECFDF5', text: '#10B981', label: 'Healthy' },
  borderline: { bg: '#FFFBEB', text: '#F59E0B', label: 'Borderline' },
  'at-risk': { bg: '#FEF2F2', text: '#EF4444', label: 'At Risk' },
  'no-data': { bg: '#F8FAFC', text: '#CBD5E1', label: 'No Data' },
};

const generateCalendarData = (): DayData[] => {
  const redDays = [3, 11, 19];
  const amberDays = [5, 8, 14, 16, 23, 25, 27];
  return Array.from({ length: 28 }, (_, i) => {
    const date = i + 1;
    let status: DayData['status'] = 'healthy';
    let sdnn = 55 + Math.floor(Math.random() * 20);
    if (redDays.includes(date)) { status = 'at-risk'; sdnn = 15 + Math.floor(Math.random() * 5); }
    else if (amberDays.includes(date)) { status = 'borderline'; sdnn = 25 + Math.floor(Math.random() * 20); }
    return { date, status, sdnn, isToday: date === new Date().getDate() };
  });
};

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calendarData = generateCalendarData();

export function HRVCalendar() {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (day: DayData, event: React.MouseEvent) => {
    if (day.status !== 'no-data') {
      setHoveredDay(day);
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePosition({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-[24px]">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-semibold text-[16px] text-[#0F172A]">PRV History</h3>
        <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <button className="p-1 hover:bg-slate-50 rounded transition-colors text-[#94A3B8]">
            <ChevronLeft size={16} />
          </button>
          <span className="font-sans font-medium text-[14px] text-[#0F172A]">February 2026</span>
          <button className="p-1 hover:bg-slate-50 rounded transition-colors text-[#94A3B8]">
            <ChevronRight size={16} />
          </button>
        </div>
        <div /> {/* Spacer for flex-between */}
      </div>

      {/* Legend row */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="font-sans text-[11px] text-[#64748B]">Healthy (SDNN ≥ 50ms)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span className="font-sans text-[11px] text-[#64748B]">Borderline (20–49ms)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="font-sans text-[11px] text-[#64748B]">At Risk (&lt; 20ms)</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders.map((day) => (
            <div key={day} className="h-6 flex items-center justify-center">
              <span className="font-sans font-medium text-[12px] text-[#94A3B8]">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Date Cells */}
        <div className="grid grid-cols-7 gap-y-2 place-items-center">
          {calendarData.map((day) => {
            const config = statusConfig[day.status];
            return (
              <div
                key={day.date}
                className="relative w-[36px] h-[36px] flex items-center justify-center rounded-[8px] cursor-pointer transition-opacity hover:opacity-80"
                style={{ 
                  backgroundColor: config.bg,
                  border: day.isToday ? '2px solid #0EA5E9' : 'none' 
                }}
                onMouseEnter={(e) => handleMouseEnter(day, e)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <span className={`font-sans text-[13px] ${day.isToday ? 'font-bold' : 'font-medium'}`} style={{ color: config.text }}>
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <div 
            className="fixed z-50 bg-white rounded-lg border border-[#E2E8F0] px-3 py-2 pointer-events-none shadow-[0_4px_16px_rgba(0,0,0,0.08)]" 
            style={{ left: mousePosition.x, top: mousePosition.y - 60, transform: 'translateX(-50%)' }}
          >
            <p className="font-sans font-semibold text-xs text-[#0F172A] mb-0.5">Feb {hoveredDay.date}</p>
            <p className="font-mono text-xs" style={{ color: statusConfig[hoveredDay.status].text }}>
              {hoveredDay.sdnn} ms
            </p>
            <p className="font-sans text-[11px] text-[#64748B]">{statusConfig[hoveredDay.status].label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
