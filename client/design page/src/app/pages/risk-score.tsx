import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/dashboard/sidebar';
import { DashboardTopBar } from '../components/dashboard/dashboard-top-bar';
import { 
  Calendar, 
  ArrowRight, 
  Clock, 
  TrendingDown, 
  ClipboardList, 
  Target, 
  Info,
  HeartPulse,
  Activity,
  Moon,
  Utensils,
  CigaretteOff,
  Droplet,
  Gauge,
  Weight,
  Flame,
  Check
} from 'lucide-react';
import { HRVShield } from '../components/dashboard/hrv-shield';

export default function RiskScore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'checkin'>('overview');
  const [checkInStep, setCheckInStep] = useState(0);
  const [checkInComplete, setCheckInComplete] = useState(false);

  // Mock data
  const currentScore = 74;
  const scoreChange = 6;
  const scoreHistory = [
    { month: 'Nov', score: 88 },
    { month: 'Dec', score: 85 },
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 79 },
    { month: 'Mar', score: 77 },
    { month: 'Apr', score: 74 },
  ];

  const factors = [
    { id: 1, icon: HeartPulse, name: 'Blood Pressure', score: 48, color: '#EF4444' },
    { id: 2, icon: Activity, name: 'Physical Activity', score: 55, color: '#F59E0B' },
    { id: 3, icon: Moon, name: 'Sleep Health', score: 70, color: '#F59E0B' },
    { id: 4, icon: Utensils, name: 'Diet Quality', score: 60, color: '#F59E0B' },
    { id: 5, icon: CigaretteOff, name: 'Nicotine', score: 100, color: '#10B981' },
    { id: 6, icon: Droplet, name: 'Cholesterol', score: 78, color: '#10B981' },
    { id: 7, icon: Gauge, name: 'Blood Sugar', score: 72, color: '#F59E0B' },
    { id: 8, icon: Weight, name: 'BMI', score: 65, color: '#F59E0B' },
  ];

  const actionPlan = [
    {
      priority: 1,
      title: 'Reduce Blood Pressure',
      description: 'Your systolic reading of 132mmHg is in the elevated range. Reduce sodium intake and check weekly.',
      target: 'Goal: below 120/80 mmHg',
      progress: 45,
      badgeColor: '#FEF2F2',
      badgeText: '#EF4444',
      progressColor: '#F59E0B',
    },
    {
      priority: 2,
      title: 'Increase Physical Activity',
      description: 'You reported exercising 1–2 times per week. AHA recommends 150 minutes of moderate activity weekly.',
      target: 'Goal: 5+ sessions per week',
      progress: 30,
      badgeColor: '#FFFBEB',
      badgeText: '#F59E0B',
      progressColor: '#F59E0B',
    },
    {
      priority: 3,
      title: 'Maintain Non-Smoking Status',
      description: 'You are a non-smoker — excellent. Continue avoiding secondhand smoke exposure.',
      target: 'Status: Maintained ✓',
      progress: 100,
      badgeColor: '#EFF6FF',
      badgeText: '#0EA5E9',
      progressColor: '#10B981',
    },
  ];

  const handleCheckInSubmit = () => {
    setCheckInComplete(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar activePage="risk-score" />
      
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
        <DashboardTopBar />
        
        {/* Breadcrumb */}
        <div className="px-8 py-3 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B' }}>
            Dashboard / Risk Score
          </p>
        </div>

        {/* Page Header */}
        <div className="bg-white px-8 py-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                Stroke Risk Score
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={13} style={{ color: '#94A3B8' }} />
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748B' }}>
                  Based on AHA Life's Essential 8 framework · Last updated 14 Feb 2026
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div
                className="px-3.5 py-2 rounded-full flex items-center gap-2"
                style={{ backgroundColor: '#FFFBEB' }}
              >
                <Clock size={12} style={{ color: '#F59E0B' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#F59E0B' }}>
                  Monthly Check-In Due
                </span>
              </div>
              
              <button
                onClick={() => setActiveTab('checkin')}
                className="h-11 px-4 rounded-lg flex items-center gap-2 transition-colors hover:opacity-90"
                style={{ backgroundColor: '#0EA5E9' }}
              >
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                  Start Check-In
                </span>
                <ArrowRight size={14} style={{ color: '#FFFFFF' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white px-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className="py-3 relative"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'overview' ? '#0EA5E9' : '#64748B',
              }}
            >
              Overview
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0EA5E9' }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('checkin')}
              className="py-3 relative"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'checkin' ? '#0EA5E9' : '#64748B',
              }}
            >
              Monthly Check-In
              {activeTab === 'checkin' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0EA5E9' }} />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' ? (
            <div className="max-w-[1440px] mx-auto px-8 py-8">
              <div className="grid grid-cols-[55%_43%] gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-5">
                  {/* Score Hero Card */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Top Zone - Gradient */}
                    <div
                      className="px-8 py-8 relative"
                      style={{
                        background: 'linear-gradient(135deg, #0D2240 0%, #0E4A7A 60%, #0EA5E9 100%)',
                        height: '140px',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '72px', fontWeight: 700, color: '#FFFFFF' }}>
                              {currentScore}
                            </span>
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', color: 'rgba(255,255,255,0.50)' }}>
                              / 100
                            </span>
                          </div>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: 700, color: '#34D399', marginTop: '4px' }}>
                            Low Risk
                          </p>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.70)', marginTop: '4px' }}>
                            Your score has improved by +{scoreChange} points since last month.
                          </p>
                        </div>
                        
                        {/* Shield */}
                        <div className="relative">
                          <div
                            className="absolute"
                            style={{
                              width: '120px',
                              height: '120px',
                              background: 'radial-gradient(circle, rgba(52,211,153,0.20) 0%, transparent 70%)',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                          <div style={{ transform: 'scale(0.75)' }}>
                            <HRVShield state="healthy" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Zone - Score Spectrum */}
                    <div className="p-6">
                      <div className="relative">
                        <div
                          className="w-full h-2.5 rounded-full"
                          style={{
                            background: 'linear-gradient(to right, #10B981, #F59E0B, #EF4444)',
                          }}
                        />
                        <div
                          className="absolute w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '2px solid #0F172A',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.20)',
                            top: '50%',
                            left: `${currentScore}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#10B981' }}>
                          Safe 0–39
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#F59E0B' }}>
                          Moderate 40–69
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#EF4444' }}>
                          High Risk 70–100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score History Chart */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown size={15} style={{ color: '#10B981' }} />
                        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                          Score Over Time
                        </h3>
                      </div>
                      
                      <div className="flex gap-3">
                        <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#0EA5E9', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                          3M
                        </button>
                        <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
                          6M
                        </button>
                        <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
                          1Y
                        </button>
                      </div>
                    </div>

                    {/* Simple chart placeholder */}
                    <div className="h-44 relative">
                      <svg width="100%" height="100%" viewBox="0 0 600 180">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(14,165,233,0.12)" />
                            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="0" y1="36" x2="600" y2="36" stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" />
                        <line x1="0" y1="72" x2="600" y2="72" stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" />
                        <line x1="0" y1="108" x2="600" y2="108" stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" />
                        <line x1="0" y1="144" x2="600" y2="144" stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" />
                        
                        {/* Threshold line */}
                        <line x1="0" y1="126" x2="600" y2="126" stroke="#F59E0B" strokeDasharray="6 3" strokeWidth="1.5" opacity="0.4" />
                        <text x="590" y="122" fill="#F59E0B" fontSize="9" fontFamily="DM Sans" textAnchor="end">Moderate threshold</text>
                        
                        {/* Area and line */}
                        <path
                          d="M 0,21.6 L 100,27 L 200,32.4 L 300,37.8 L 400,41.4 L 500,46.8 L 500,180 L 0,180 Z"
                          fill="url(#chartGradient)"
                        />
                        <path
                          d="M 0,21.6 L 100,27 L 200,32.4 L 300,37.8 L 400,41.4 L 500,46.8"
                          stroke="#0EA5E9"
                          strokeWidth="2"
                          fill="none"
                        />
                        
                        {/* Data points */}
                        {scoreHistory.map((data, i) => {
                          const x = i * 100;
                          const y = 180 - (data.score * 1.8);
                          return (
                            <g key={i}>
                              <circle cx={x} cy={y} r="5" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2" />
                              <text x={x} y="175" fill="#CBD5E1" fontSize="9" fontFamily="Space Mono" textAnchor="middle">
                                {data.month}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <TrendingDown size={12} style={{ color: '#10B981' }} />
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#10B981' }}>
                        Score improving — down 14 points in 6 months
                      </p>
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <ClipboardList size={15} style={{ color: '#0EA5E9' }} />
                        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                          Your Action Plan
                        </h3>
                      </div>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#94A3B8' }}>
                        Updated Feb 2026
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {actionPlan.map((action) => (
                        <div
                          key={action.priority}
                          className="rounded-xl p-4"
                          style={{
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span
                              className="px-2.5 py-1 rounded text-[10px] font-semibold"
                              style={{
                                fontFamily: 'DM Sans, sans-serif',
                                backgroundColor: action.badgeColor,
                                color: action.badgeText,
                              }}
                            >
                              Priority {action.priority}
                            </span>
                            <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                              {action.title}
                            </h4>
                          </div>
                          
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>
                            {action.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Target size={12} style={{ color: '#94A3B8' }} />
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#64748B' }}>
                              {action.target}
                            </span>
                          </div>
                          
                          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${action.progress}%`,
                                backgroundColor: action.progressColor,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-5">
                  {/* Factor Breakdown */}
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                      Factor Breakdown
                    </h3>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
                      AHA Life's Essential 8 — your scores per factor
                    </p>

                    <div className="space-y-0">
                      {factors.map((factor, index) => {
                        const Icon = factor.icon;
                        return (
                          <div key={factor.id}>
                            <div className="flex items-center gap-3 py-3.5">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: '#F1F5F9' }}
                              >
                                <Icon size={16} style={{ color: '#64748B' }} />
                              </div>
                              
                              <div className="flex-1">
                                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0F172A' }}>
                                  {factor.name}
                                </p>
                                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 600, color: factor.color }}>
                                  {factor.score}/100
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${factor.score}%`,
                                      backgroundColor: factor.color,
                                    }}
                                  />
                                </div>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700, color: factor.color, minWidth: '30px', textAlign: 'right' }}>
                                  {factor.score}
                                </span>
                              </div>
                            </div>
                            {index < factors.length - 1 && (
                              <div className="h-px" style={{ backgroundColor: '#F8FAFC' }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-start gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #F8FAFC' }}>
                      <Info size={11} style={{ color: '#CBD5E1', marginTop: '2px' }} />
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#94A3B8' }}>
                        Based on your onboarding assessment and most recent monthly check-in.
                      </p>
                    </div>
                  </div>

                  {/* Check-In Streak */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Flame size={16} style={{ color: '#F59E0B' }} />
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                        Monthly Check-In Streak
                      </h3>
                    </div>

                    <div className="text-center mb-4">
                      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '48px', fontWeight: 700, color: '#F59E0B' }}>
                        3
                      </div>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#94A3B8' }}>
                        months in a row
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5, 6].map((month) => {
                        if (month <= 3) {
                          return (
                            <div
                              key={month}
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#10B981' }}
                            >
                              <Check size={12} style={{ color: '#FFFFFF' }} />
                            </div>
                          );
                        } else if (month === 4) {
                          return (
                            <div
                              key={month}
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: '#FFFBEB',
                                border: '2px dashed #F59E0B',
                              }}
                            >
                              <Clock size={12} style={{ color: '#F59E0B' }} />
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={month}
                              className="w-7 h-7 rounded-full"
                              style={{
                                backgroundColor: '#F1F5F9',
                                border: '1px dashed #CBD5E1',
                              }}
                            />
                          );
                        }
                      })}
                    </div>

                    <div className="text-center">
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8', marginBottom: '8px' }}>
                        Next check-in due: Mar 1, 2026
                      </p>
                      <button
                        onClick={() => setActiveTab('checkin')}
                        style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0EA5E9' }}
                      >
                        Start Check-In
                      </button>
                    </div>
                  </div>

                  {/* Last Assessment Summary */}
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                        Last Assessment
                      </h3>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#94A3B8' }}>
                        14 Feb 2026
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HeartPulse size={14} style={{ color: '#64748B' }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#0F172A' }}>
                            Blood Pressure
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#64748B' }}>
                            132/86 mmHg
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: '#FEF2F2',
                              color: '#EF4444',
                            }}
                          >
                            Elevated
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity size={14} style={{ color: '#64748B' }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#0F172A' }}>
                            Exercise Frequency
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#64748B' }}>
                            1–2x per week
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: '#FFFBEB',
                              color: '#F59E0B',
                            }}
                          >
                            Below target
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Moon size={14} style={{ color: '#64748B' }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#0F172A' }}>
                            Sleep Quality
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#64748B' }}>
                            6–7 hrs avg
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              backgroundColor: '#FFFBEB',
                              color: '#F59E0B',
                            }}
                          >
                            Fair
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="flex items-center gap-1 mt-4 w-full justify-center">
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0EA5E9' }}>
                        View full assessment
                      </span>
                      <ArrowRight size={13} style={{ color: '#0EA5E9' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Check-In Tab
            <div className="max-w-[560px] mx-auto px-8 py-10" style={{ backgroundColor: '#F4F6FA' }}>
              {!checkInComplete ? (
                <>
                  {/* Header Card */}
                  <div
                    className="rounded-2xl p-6 mb-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                      Monthly Check-In
                    </h2>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>
                      5 quick questions · Takes about 90 seconds · Updates your risk score immediately.
                    </p>
                    
                    <div className="mb-2">
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F1F5F9' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(checkInStep / 5) * 100}%`,
                            backgroundColor: '#0EA5E9',
                          }}
                        />
                      </div>
                    </div>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8', textAlign: 'right' }}>
                      Question {checkInStep} of 5
                    </p>
                  </div>

                  {/* Question Cards Placeholder */}
                  <div className="space-y-4">
                    <div
                      className="rounded-2xl p-6"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #0EA5E9',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: '#FEF2F2' }}
                        >
                          <HeartPulse size={18} style={{ color: '#EF4444' }} />
                        </div>
                        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 600, color: '#0F172A', flex: 1 }}>
                          What was your most recent blood pressure?
                        </h3>
                      </div>
                      
                      <div className="flex gap-3 mb-3">
                        <div>
                          <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                            Systolic
                          </label>
                          <input
                            type="number"
                            placeholder="120"
                            className="w-20 h-12 rounded-lg px-3 text-center"
                            style={{
                              fontFamily: 'Space Mono, monospace',
                              fontSize: '18px',
                              fontWeight: 700,
                              color: '#0F172A',
                              backgroundColor: '#F1F5F9',
                              border: 'none',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                            Diastolic
                          </label>
                          <input
                            type="number"
                            placeholder="80"
                            className="w-20 h-12 rounded-lg px-3 text-center"
                            style={{
                              fontFamily: 'Space Mono, monospace',
                              fontSize: '18px',
                              fontWeight: 700,
                              color: '#0F172A',
                              backgroundColor: '#F1F5F9',
                              border: 'none',
                            }}
                          />
                        </div>
                      </div>
                      
                      <label className="flex items-center gap-2 mb-3">
                        <input type="checkbox" className="w-4 h-4" />
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B' }}>
                          I don't know my BP
                        </span>
                      </label>
                      
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#94A3B8' }}>
                        Normal is below 120/80 mmHg
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleCheckInSubmit}
                      className="w-full h-13 rounded-lg transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: '#0EA5E9',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                      }}
                    >
                      Update My Risk Score
                    </button>
                    
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>
                      Your score will update immediately after submission.
                    </p>
                  </div>
                </>
              ) : (
                // Post-submit result
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '22px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>
                    Score Updated
                  </h2>
                  
                  <div className="mb-4">
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '48px', fontWeight: 700, color: '#0F172A' }}>
                      {currentScore}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <TrendingDown size={13} style={{ color: '#10B981' }} />
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#10B981' }}>
                        +2 improvement from last check-in
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="w-full h-12 rounded-lg mb-3 transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: '#0EA5E9',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    Back to Overview
                  </button>
                  
                  <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0EA5E9' }}>
                    View full breakdown
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
