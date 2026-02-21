import { useState } from 'react';
import { Sidebar } from '../components/dashboard/sidebar';
import { DashboardTopBar } from '../components/dashboard/dashboard-top-bar';
import { Download, Check, AlertTriangle, ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function History() {
  const [activeTab, setActiveTab] = useState<'fast-checks' | 'hrv-anomalies' | 'calendar'>('fast-checks');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fastCheckEntries = [
    { date: 'Today 09:14', status: 'clear', f: true, a: true, s: true, time: '1m 42s' },
    { date: '18 Feb 16:02', status: 'clear', f: true, a: true, s: true, time: '1m 35s' },
    { date: '14 Feb 08:45', status: 'flagged', f: true, a: false, s: true, time: '2m 10s', note: 'arm drift detected' },
    { date: '11 Feb 13:20', status: 'clear', f: true, a: true, s: true, time: '1m 28s' },
    { date: '05 Feb 10:10', status: 'clear', f: true, a: true, s: true, time: '1m 52s' },
    { date: '28 Jan 09:55', status: 'flagged', f: false, a: false, s: true, time: '2m 45s', note: 'run during red HRV zone' },
    { date: '21 Jan 11:30', status: 'clear', f: true, a: true, s: true, time: '1m 40s' },
  ];

  const hrvEvents = [
    { date: '20 Feb 14:22', type: 'red', sdnn: 14, duration: '14 minutes', action: 'FAST Check run' },
    { date: '14 Feb 08:30', type: 'red', sdnn: 16, duration: '22 minutes', action: 'FAST Check run' },
    { date: '08 Feb 11:15', type: 'borderline', sdnn: 38, duration: '18 minutes', action: 'No action' },
    { date: '28 Jan 09:40', type: 'borderline', sdnn: 42, duration: '12 minutes', action: 'No action' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar activePage="history" />
      
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
        <DashboardTopBar />
        
        {/* Breadcrumb */}
        <div className="px-8 py-3 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B' }}>
            Dashboard / History
          </p>
        </div>

        {/* Page Header */}
        <div className="bg-white px-8 py-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                Health History
              </h1>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                Your complete record of FAST checks, HRV events, and health patterns.
              </p>
            </div>
            
            <button
              className="h-11 px-4 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-80"
              style={{
                border: '1px solid #E2E8F0',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#334155',
              }}
            >
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex gap-6">
            {['fast-checks', 'hrv-anomalies', 'calendar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className="py-3 relative"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: activeTab === tab ? '#0EA5E9' : '#64748B',
                }}
              >
                {tab === 'fast-checks' ? 'FAST Checks' : tab === 'hrv-anomalies' ? 'HRV Anomalies' : 'Health Calendar'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0EA5E9' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {activeTab === 'fast-checks' && (
            <div>
              {/* Filter Row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {['all', 'clear', 'flagged', 'this-month', 'last-3-months'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className="h-9 px-3 rounded-full transition-colors"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        backgroundColor: selectedFilter === filter ? '#0EA5E9' : '#F1F5F9',
                        color: selectedFilter === filter ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {filter === 'all' ? 'All' : filter === 'clear' ? 'All Clear' : filter === 'flagged' ? 'Flagged' : filter === 'this-month' ? 'This Month' : 'Last 3 Months'}
                    </button>
                  ))}
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8' }}>
                  7 checks total
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#E2E8F0' }} />
                
                {/* Entries */}
                <div className="space-y-4">
                  {fastCheckEntries.map((entry, index) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div
                        className="absolute left-5 w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: entry.status === 'clear' ? '#10B981' : '#EF4444',
                          transform: 'translateX(-50%)',
                        }}
                      />
                      
                      {/* Card */}
                      <div
                        className="flex-1 ml-11 rounded-xl p-5"
                        style={{
                          backgroundColor: entry.status === 'flagged' ? '#FFFCFC' : '#FFFFFF',
                          border: entry.status === 'flagged' ? '1px solid #E2E8F0' : '1px solid #E2E8F0',
                          borderLeft: entry.status === 'flagged' ? '3px solid #EF4444' : '1px solid #E2E8F0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#94A3B8' }}>
                            {entry.date}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded text-[11px] font-semibold"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: entry.status === 'clear' ? '#ECFDF5' : '#FEF2F2',
                              color: entry.status === 'clear' ? '#10B981' : '#EF4444',
                            }}
                          >
                            {entry.status === 'clear' ? 'All Clear' : 'Flagged'}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <span
                            className="px-3 py-1.5 rounded-full text-xs"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: entry.f ? '#ECFDF5' : '#FEF2F2',
                              color: entry.f ? '#10B981' : '#EF4444',
                            }}
                          >
                            <strong>F</strong> {entry.f ? '✓' : '⚠'}
                          </span>
                          <span
                            className="px-3 py-1.5 rounded-full text-xs"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: entry.a ? '#ECFDF5' : '#FEF2F2',
                              color: entry.a ? '#10B981' : '#EF4444',
                            }}
                          >
                            <strong>A</strong> {entry.a ? '✓' : '⚠'}
                          </span>
                          <span
                            className="px-3 py-1.5 rounded-full text-xs"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: entry.s ? '#ECFDF5' : '#FEF2F2',
                              color: entry.s ? '#10B981' : '#EF4444',
                            }}
                          >
                            <strong>S</strong> {entry.s ? '✓' : '⚠'}
                          </span>
                          <span
                            className="px-3 py-1.5 rounded-full text-xs"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: '#EFF6FF',
                              color: '#0EA5E9',
                            }}
                          >
                            <strong>T</strong> · {entry.time}
                          </span>
                        </div>
                        
                        {entry.note && (
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#EF4444', marginTop: '8px' }}>
                            {entry.note}
                          </p>
                        )}
                        
                        <button className="flex items-center gap-1 mt-3">
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#0EA5E9' }}>
                            View details
                          </span>
                          <ChevronDown size={12} style={{ color: '#94A3B8' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8', textAlign: 'center', marginTop: '32px', padding: '20px' }}>
                  You have viewed all 7 checks.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'hrv-anomalies' && (
            <div>
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    HRV Events This Month
                  </h3>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                    4
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    times SDNN dropped below 50ms
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    Days in Red Zone
                  </h3>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: 700, color: '#EF4444' }}>
                    2
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    SDNN below 20ms
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                    Average SDNN (30d)
                  </h3>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '28px', fontWeight: 700, color: '#10B981' }}>
                    58 <span style={{ fontSize: '16px', color: '#94A3B8' }}>ms</span>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Healthy range
                  </p>
                </div>
              </div>

              {/* HRV Trend Chart */}
              <div
                className="rounded-xl p-6 mb-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                    30-Day SDNN Trend
                  </h3>
                  <div className="flex gap-3">
                    <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0EA5E9', textDecoration: 'underline' }}>
                      30D
                    </button>
                    <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
                      60D
                    </button>
                    <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
                      90D
                    </button>
                  </div>
                </div>
                
                <div className="h-48" style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '80px' }}>
                    Chart visualization with threshold lines at 20ms, 50ms, and 70ms
                  </p>
                </div>
              </div>

              {/* Anomaly Event Log */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                    Anomaly Events
                  </h3>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#94A3B8' }}>
                    4 events
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#E2E8F0' }} />
                  
                  <div className="space-y-4">
                    {hrvEvents.map((event, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div
                          className="absolute left-5 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: event.type === 'red' ? '#EF4444' : '#F59E0B',
                            transform: 'translateX(-50%)',
                          }}
                        />
                        
                        <div
                          className="flex-1 ml-11 rounded-xl p-4"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#94A3B8' }}>
                              {event.date}
                            </span>
                            <span
                              className="px-2.5 py-1 rounded text-[11px] font-semibold"
                              style={{
                                fontFamily: 'DM Sans, sans-serif',
                                backgroundColor: event.type === 'red' ? '#FEF2F2' : '#FFFBEB',
                                color: event.type === 'red' ? '#EF4444' : '#F59E0B',
                              }}
                            >
                              {event.type === 'red' ? 'Red Zone' : 'Borderline'}
                            </span>
                          </div>
                          
                          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: event.type === 'red' ? '#EF4444' : '#F59E0B', marginBottom: '4px' }}>
                            {event.sdnn} ms
                          </div>
                          
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                            Lasted {event.duration}
                          </p>
                          
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8' }}>
                            {event.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              {/* Calendar Card */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} style={{ color: '#0EA5E9' }} />
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                      Health Calendar
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ChevronLeft size={16} style={{ color: '#94A3B8', cursor: 'pointer' }} />
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '14px', color: '#0F172A' }}>
                      February 2026
                    </span>
                    <ChevronRight size={16} style={{ color: '#94A3B8', cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#64748B' }}>
                      Healthy HRV
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#64748B' }}>
                      Borderline HRV
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#64748B' }}>
                      At Risk / FAST Check
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0EA5E9' }} />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#64748B' }}>
                      Check-In Completed
                    </span>
                  </div>
                </div>

                {/* Calendar Grid Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div
                      key={day}
                      className="text-center py-2"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#94A3B8',
                      }}
                    >
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-blue-200 relative"
                      style={{
                        backgroundColor: i % 7 === 0 || i % 7 === 6 ? '#F8FAFC' : i % 5 === 0 ? '#FEF2F2' : i % 3 === 0 ? '#FFFBEB' : '#ECFDF5',
                        height: '48px',
                      }}
                    >
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                        {i + 1}
                      </span>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {i % 3 === 0 && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#10B981' }} />}
                        {i % 5 === 0 && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#EF4444' }} />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B' }}>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>17 healthy</span> ·{' '}
                    <span style={{ color: '#F59E0B', fontWeight: 600 }}>9 borderline</span> ·{' '}
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>2 at risk</span>
                  </p>
                </div>
              </div>

              {/* Heatmap */}
              <div
                className="rounded-xl p-6 mt-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '16px' }}>
                  HRV Heatmap — Past 12 Weeks
                </h3>
                
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 84 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded"
                      style={{
                        backgroundColor: i % 9 === 0 ? '#EF4444' : i % 5 === 0 ? '#F59E0B' : i % 3 === 0 ? '#10B981' : '#F1F5F9',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
