import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DayData {
  date: number;
  status: 'healthy' | 'borderline' | 'at-risk' | 'no-data';
  sdnn?: number;
  isToday?: boolean;
}

export function HRVCalendar() {
  const [currentMonth] = useState('February 2026');

  // Sample data for February 2026
  const generateCalendarData = (): DayData[] => {
    const daysInMonth = 28;
    const data: DayData[] = [];
    
    // Red days on 3rd, 11th, 19th
    const redDays = [3, 11, 19];
    // Amber days scattered
    const amberDays = [5, 8, 14, 16, 23, 25, 27];
    
    for (let i = 1; i <= daysInMonth; i++) {
      let status: DayData['status'] = 'healthy';
      let sdnn = 55 + Math.floor(Math.random() * 20);
      
      if (redDays.includes(i)) {
        status = 'at-risk';
        sdnn = 15 + Math.floor(Math.random() * 5);
      } else if (amberDays.includes(i)) {
        status = 'borderline';
        sdnn = 25 + Math.floor(Math.random() * 20);
      }
      
      data.push({
        date: i,
        status,
        sdnn,
        isToday: i === 21,
      });
    }
    
    return data;
  };

  const calendarData = generateCalendarData();
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const statusConfig = {
    healthy: { bg: '#ECFDF5', text: '#10B981', label: 'Healthy' },
    borderline: { bg: '#FFFBEB', text: '#F59E0B', label: 'Borderline' },
    'at-risk': { bg: '#FEF2F2', text: '#EF4444', label: 'At Risk' },
    'no-data': { bg: '#F8FAFC', text: '#CBD5E1', label: 'No Data' },
  };

  const handleMouseEnter = (day: DayData, event: React.MouseEvent) => {
    if (day.status !== 'no-data') {
      setHoveredDay(day);
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePosition({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Generate empty cells for days before the 1st (Feb 2026 starts on Sunday)
  const emptyCells = 0; // February 2026 starts on Sunday
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} style={{ color: '#0EA5E9' }} />
          <span
            className="text-[15px] font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#0F172A',
            }}
          >
            HRV History
          </span>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-50 rounded transition-colors">
            <ChevronLeft size={16} style={{ color: '#94A3B8' }} />
          </button>
          <span
            className="text-[13px]"
            style={{
              fontFamily: 'Space Mono, monospace',
              color: '#0F172A',
            }}
          >
            {currentMonth}
          </span>
          <button className="p-1 hover:bg-gray-50 rounded transition-colors">
            <ChevronRight size={16} style={{ color: '#94A3B8' }} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            Healthy (SDNN ≥ 50ms)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            Borderline (20–49ms)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
          <span
            className="text-[11px]"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            At Risk (&lt; 20ms)
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center"
            >
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#94A3B8',
                }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Date Cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array(emptyCells)
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="h-[38px]" />
            ))}
          
          {calendarData.map((day) => {
            const config = statusConfig[day.status];
            const ringColor = statusConfig[day.status].text;
            
            return (
              <div
                key={day.date}
                className="relative h-[38px] flex items-center justify-center rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: config.bg,
                  border: day.isToday ? `2px solid ${ringColor}` : 'none',
                  boxShadow: day.isToday ? `0 0 0 3px ${ringColor}26` : 'none',
                }}
                onMouseEnter={(e) => handleMouseEnter(day, e)}
                onMouseLeave={handleMouseLeave}
              >
                <span
                  className="text-[13px]"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: day.isToday ? 700 : 500,
                    color: config.text,
                  }}
                >
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="absolute z-50 bg-white rounded-lg border px-2 py-1.5 pointer-events-none"
            style={{
              left: mousePosition.x,
              top: mousePosition.y - 60,
              transform: 'translateX(-50%)',
              borderColor: '#E2E8F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            }}
          >
            <p
              className="text-xs font-semibold mb-0.5"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#0F172A',
              }}
            >
              Feb {hoveredDay.date}
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: 'Space Mono, monospace',
                color: statusConfig[hoveredDay.status].text,
              }}
            >
              {hoveredDay.sdnn} ms
            </p>
            <p
              className="text-[11px]"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#64748B',
              }}
            >
              {statusConfig[hoveredDay.status].label}
            </p>
            {/* Arrow pointer */}
            <div
              className="absolute left-1/2 -bottom-1 w-2 h-2 bg-white border-b border-r transform rotate-45 -translate-x-1/2"
              style={{ borderColor: '#E2E8F0' }}
            />
          </div>
        )}
      </div>

      {/* Summary Row */}
      <div
        className="rounded-lg px-3.5 py-2.5 mt-4"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        <p
          className="text-[11px] text-center"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
            Feb 2026 —{' '}
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: '#10B981' }}>
            17
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
            {' '}healthy days ·{' '}
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: '#F59E0B' }}>
            9
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
            {' '}borderline ·{' '}
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', color: '#EF4444' }}>
            2
          </span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
            {' '}at risk
          </span>
        </p>
      </div>
    </div>
  );
}