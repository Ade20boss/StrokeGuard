import { useState } from 'react';
import {
  Search,
  Bookmark,
  Eye,
  MoveHorizontal,
  Mic,
  Phone,
  Clock,
  ExternalLink,
  FileText,
  Download,
  Lock,
  BrainCircuit,
  Heart,
  Activity,
  Shield,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/sidebar';
import { PageTopBar } from '../components/dashboard/page-top-bar';

type Tab = 'articles' | 'training' | 'resources';

export default function Education() {
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F4F6FA' }}>
      <Sidebar activePage="education" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageTopBar breadcrumbSecond="Health Education" />

        {/* Page Header Section */}
        <div
          className="px-8 py-8 border-b flex items-start justify-between"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
          }}
        >
          <div>
            <h1
              className="text-[28px] font-bold mb-1"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
            >
              Health Education
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
            >
              Evidence-based stroke awareness resources, guides, and FAST training.
            </p>
          </div>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-[240px] h-10 pl-10 pr-3 rounded-lg border-0 text-[13px] focus:outline-none focus:ring-1"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
              }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className="px-8 border-b flex items-center gap-6"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E2E8F0',
          }}
        >
          <button
            onClick={() => setActiveTab('articles')}
            className="pb-4 relative"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: activeTab === 'articles' ? '#0EA5E9' : '#94A3B8',
                }}
              >
                Articles
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[11px]"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  backgroundColor: '#F1F5F9',
                  color: '#94A3B8',
                }}
              >
                6
              </span>
            </div>
            {activeTab === 'articles' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#0EA5E9' }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className="pb-4 relative"
          >
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: activeTab === 'training' ? '#0EA5E9' : '#94A3B8',
              }}
            >
              FAST Training
            </span>
            {activeTab === 'training' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#0EA5E9' }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className="pb-4 relative"
          >
            <span
              className="text-sm font-medium"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: activeTab === 'resources' ? '#0EA5E9' : '#94A3B8',
              }}
            >
              Resources
            </span>
            {activeTab === 'resources' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#0EA5E9' }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* TAB 1 — Articles */}
          {activeTab === 'articles' && (
            <div>
              {/* Featured Article — Hero Card */}
              <div
                className="rounded-2xl overflow-hidden mb-5 grid grid-cols-[45%_55%]"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Image Area */}
                <div
                  className="relative p-12 flex items-center justify-center"
                  style={{
                    backgroundColor: '#0A1628',
                    backgroundImage:
                      'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%)',
                  }}
                >
                  <div className="absolute top-6 left-6">
                    <span
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#0EA5E9',
                        color: '#FFFFFF',
                      }}
                    >
                      Featured
                    </span>
                  </div>
                  <BrainCircuit size={80} style={{ color: 'rgba(14, 165, 233, 0.3)' }} />
                </div>

                {/* Content Area */}
                <div className="p-9">
                  <p
                    className="text-[11px] font-semibold uppercase mb-2"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#0EA5E9',
                      letterSpacing: '1px',
                    }}
                  >
                    Stroke Basics
                  </p>
                  <h2
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    What Is a Stroke? Types, Causes, and Why Minutes Matter
                  </h2>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    A stroke occurs when blood supply to part of the brain is cut off. Every minute without
                    treatment, approximately 1.9 million neurons are lost. Understanding the two main types —
                    ischemic and hemorrhagic — is the first step in prevention.
                  </p>

                  {/* Meta Row */}
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#DBEAFE' }}
                    >
                      <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#1D4ED8', fontSize: 10, fontWeight: 700 }}>
                        SG
                      </span>
                    </div>
                    <span
                      className="font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                    >
                      StrokeGuard Medical Team
                    </span>
                    <span style={{ color: '#CBD5E1' }}>·</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                      8 min read
                    </span>
                    <span style={{ color: '#CBD5E1' }}>·</span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                      Feb 2026
                    </span>
                  </div>

                  <button
                    className="h-10 px-5 rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: '#0EA5E9' }}
                  >
                    <span
                      className="text-[13px] font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                    >
                      Read Article
                    </span>
                    <ChevronRight size={14} style={{ color: '#FFFFFF' }} />
                  </button>
                </div>
              </div>

              {/* Article Grid — 2x2 */}
              <div className="grid grid-cols-2 gap-5 mb-6">
                {/* Article 1 */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ backgroundColor: '#EFF6FF' }}
                  >
                    <BrainCircuit size={40} style={{ color: '#0EA5E9' }} />
                  </div>
                  <div className="p-5">
                    <p
                      className="text-[11px] font-semibold uppercase mb-2"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#0EA5E9',
                        letterSpacing: '1px',
                      }}
                    >
                      Nigeria Health
                    </p>
                    <h3
                      className="text-base font-semibold mb-2 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Stroke in Nigeria: The Numbers You Need to Know
                    </h3>
                    <p
                      className="text-[13px] mb-3 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Nigeria accounts for approximately 11% of all stroke deaths in sub-Saharan Africa. Rural
                      populations face the highest risk due to limited access to emergency care.
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>
                          6 min read
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                          Feb 2026
                        </span>
                      </div>
                      <Bookmark size={14} style={{ color: '#CBD5E1' }} />
                    </div>
                  </div>
                </div>

                {/* Article 2 */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ backgroundColor: '#ECFDF5' }}
                  >
                    <Heart size={40} style={{ color: '#10B981' }} />
                  </div>
                  <div className="p-5">
                    <p
                      className="text-[11px] font-semibold uppercase mb-2"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#10B981',
                        letterSpacing: '1px',
                      }}
                    >
                      Prevention
                    </p>
                    <h3
                      className="text-base font-semibold mb-2 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      The FAST Method: Why Four Letters Can Save a Life
                    </h3>
                    <p
                      className="text-[13px] mb-3 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Face drooping, Arm weakness, Speech difficulty, Time to act. The FAST acronym is endorsed by
                      the WHO and the American Heart Association as the primary public awareness tool.
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>
                          4 min read
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                          Feb 2026
                        </span>
                      </div>
                      <Bookmark size={14} style={{ color: '#CBD5E1' }} />
                    </div>
                  </div>
                </div>

                {/* Article 3 */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ backgroundColor: '#FFFBEB' }}
                  >
                    <Activity size={40} style={{ color: '#F59E0B' }} />
                  </div>
                  <div className="p-5">
                    <p
                      className="text-[11px] font-semibold uppercase mb-2"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#F59E0B',
                        letterSpacing: '1px',
                      }}
                    >
                      Science
                    </p>
                    <h3
                      className="text-base font-semibold mb-2 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Understanding HRV and Its Role in Stroke Risk
                    </h3>
                    <p
                      className="text-[13px] mb-3 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Heart Rate Variability (HRV) is emerging as one of the most sensitive early indicators of
                      cardiovascular stress. Low SDNN values have been correlated with increased stroke risk in
                      multiple longitudinal studies.
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>
                          7 min read
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                          Feb 2026
                        </span>
                      </div>
                      <Bookmark size={14} style={{ color: '#CBD5E1' }} />
                    </div>
                  </div>
                </div>

                {/* Article 4 */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ backgroundColor: '#FEF2F2' }}
                  >
                    <Shield size={40} style={{ color: '#EF4444' }} />
                  </div>
                  <div className="p-5">
                    <p
                      className="text-[11px] font-semibold uppercase mb-2"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#EF4444',
                        letterSpacing: '1px',
                      }}
                    >
                      Recovery
                    </p>
                    <h3
                      className="text-base font-semibold mb-2 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Stroke Recovery: What the First 72 Hours Look Like
                    </h3>
                    <p
                      className="text-[13px] mb-3 line-clamp-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      The acute phase of stroke recovery begins immediately after treatment. Understanding what to
                      expect — from clot-busting medications to physical therapy — helps patients and families
                      prepare.
                    </p>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}>
                          9 min read
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}>
                          Feb 2026
                        </span>
                      </div>
                      <Bookmark size={14} style={{ color: '#CBD5E1' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Load More */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px]"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                >
                  Showing 5 of 12 articles
                </span>
                <button
                  className="h-10 px-5 rounded-lg border"
                  style={{
                    borderColor: '#E2E8F0',
                    color: '#334155',
                  }}
                >
                  <span
                    className="text-[13px] font-medium"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Load More
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2 — FAST Training */}
          {activeTab === 'training' && (
            <div>
              {/* Header Card */}
              <div
                className="rounded-2xl p-6 mb-4 grid grid-cols-[1fr_auto] gap-6 items-center"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    FAST Training Module
                  </h2>
                  <p
                    className="text-sm mb-4"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    Learn to recognize the warning signs before you ever need to use them.
                  </p>
                  <p
                    className="text-[13px] mb-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    2 of 4 modules completed
                  </p>
                  <div className="w-[200px] h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#0EA5E9', width: '50%' }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="h-12 px-6 rounded-lg"
                    style={{ backgroundColor: '#0EA5E9' }}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                    >
                      Continue Training
                    </span>
                  </button>
                  <button
                    className="text-[13px]"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                  >
                    Start from Beginning
                  </button>
                </div>
              </div>

              {/* Training Module Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Module 1 — Completed */}
                <div
                  className="rounded-xl p-5 border-l-[3px]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeftColor: '#10B981',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Eye size={20} style={{ color: '#10B981' }} />
                      <h3
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Recognizing Facial Drooping
                      </h3>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#ECFDF5',
                        color: '#10B981',
                      }}
                    >
                      Completed
                    </span>
                  </div>
                  <p
                    className="text-[13px] mb-3 line-clamp-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    Learn what facial asymmetry looks like in a real stroke event — and how to distinguish it from
                    normal expressions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                      >
                        5 min
                      </span>
                    </div>
                    <button
                      className="text-[13px] font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                    >
                      Review
                    </button>
                  </div>
                </div>

                {/* Module 2 — In Progress */}
                <div
                  className="rounded-xl p-5 border-l-[3px]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeftColor: '#0EA5E9',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MoveHorizontal size={20} style={{ color: '#0EA5E9' }} />
                      <h3
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        The Arm Weakness Test
                      </h3>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#EFF6FF',
                        color: '#0EA5E9',
                      }}
                    >
                      In Progress
                    </span>
                  </div>
                  <p
                    className="text-[13px] mb-3 line-clamp-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    Step-by-step guide to conducting the arm raise test on yourself or another person accurately.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                      >
                        5 min
                      </span>
                    </div>
                    <button
                      className="text-[13px] font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                    >
                      Continue
                    </button>
                  </div>
                </div>

                {/* Module 3 — Locked */}
                <div
                  className="rounded-xl p-5 border-l-[3px]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeftColor: '#E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Mic size={20} style={{ color: '#E2E8F0' }} />
                      <h3
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Speech Difficulty Detection
                      </h3>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#F8FAFC',
                        color: '#94A3B8',
                      }}
                    >
                      Locked
                    </span>
                  </div>
                  <p
                    className="text-[13px] mb-3 line-clamp-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    How to assess speech slurring and difficulty with common phrases used in clinical settings.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                      >
                        5 min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock size={12} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[13px] font-medium"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Locked
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module 4 — Locked */}
                <div
                  className="rounded-xl p-5 border-l-[3px]"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderLeftColor: '#E2E8F0',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Phone size={20} style={{ color: '#E2E8F0' }} />
                      <h3
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Time: When to Call for Help
                      </h3>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[11px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#F8FAFC',
                        color: '#94A3B8',
                      }}
                    >
                      Locked
                    </span>
                  </div>
                  <p
                    className="text-[13px] mb-3 line-clamp-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    The critical decision window — when FAST signs appear, what actions to take in the first 60
                    seconds.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[11px]"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                      >
                        5 min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock size={12} style={{ color: '#94A3B8' }} />
                      <span
                        className="text-[13px] font-medium"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Locked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 — Resources */}
          {activeTab === 'resources' && (
            <div className="space-y-8">
              {/* Section 1: Emergency Contacts */}
              <div>
                <div className="flex items-center mb-4">
                  <h3
                    className="text-base font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    Emergency Numbers
                  </h3>
                  <div className="flex-1 ml-4 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                </div>
                <div className="space-y-3">
                  <div
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FEF2F2' }}
                    >
                      <Phone size={18} style={{ color: '#EF4444' }} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Nigeria Emergency Services
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        National emergency dispatch
                      </p>
                    </div>
                    <span
                      className="text-base font-bold"
                      style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                    >
                      112
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FEF2F2' }}
                    >
                      <Phone size={18} style={{ color: '#EF4444' }} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Lagos State Emergency Management
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Lagos-specific emergency response
                      </p>
                    </div>
                    <span
                      className="text-base font-bold"
                      style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                    >
                      767
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FEF2F2' }}
                    >
                      <Phone size={18} style={{ color: '#EF4444' }} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        NEMA Nigeria
                      </p>
                      <p
                        className="text-xs"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        National Emergency Management Agency
                      </p>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                    >
                      0800-CALL-NEMA
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Stroke Organizations */}
              <div>
                <div className="flex items-center mb-4">
                  <h3
                    className="text-base font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    Stroke Organizations
                  </h3>
                  <div className="flex-1 ml-4 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className="rounded-xl p-4 relative"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <ExternalLink
                      size={14}
                      className="absolute top-4 right-4"
                      style={{ color: '#0EA5E9' }}
                    />
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center mb-3"
                      style={{ backgroundColor: '#F1F5F9' }}
                    >
                      <span
                        className="text-base font-bold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        WHO
                      </span>
                    </div>
                    <h4
                      className="text-[13px] font-semibold mb-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      WHO Stroke Initiative
                    </h4>
                    <p
                      className="text-xs mb-3"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Global stroke data, prevention guidelines, and policy resources.
                    </p>
                    <button
                      className="text-xs font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                    >
                      Visit Website
                    </button>
                  </div>

                  <div
                    className="rounded-xl p-4 relative"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <ExternalLink
                      size={14}
                      className="absolute top-4 right-4"
                      style={{ color: '#0EA5E9' }}
                    />
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center mb-3"
                      style={{ backgroundColor: '#F1F5F9' }}
                    >
                      <span
                        className="text-base font-bold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        AHA
                      </span>
                    </div>
                    <h4
                      className="text-[13px] font-semibold mb-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      American Heart Association
                    </h4>
                    <p
                      className="text-xs mb-3"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Life's Essential 8 framework and stroke prevention research.
                    </p>
                    <button
                      className="text-xs font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                    >
                      Visit Website
                    </button>
                  </div>

                  <div
                    className="rounded-xl p-4 relative"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <ExternalLink
                      size={14}
                      className="absolute top-4 right-4"
                      style={{ color: '#0EA5E9' }}
                    />
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center mb-3"
                      style={{ backgroundColor: '#F1F5F9' }}
                    >
                      <span
                        className="text-base font-bold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        SA
                      </span>
                    </div>
                    <h4
                      className="text-[13px] font-semibold mb-2"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Stroke Association NG
                    </h4>
                    <p
                      className="text-xs mb-3"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                    >
                      Nigeria-specific stroke resources, support groups, and rehabilitation guidance.
                    </p>
                    <button
                      className="text-xs font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Downloadable Guides */}
              <div>
                <div className="flex items-center mb-4">
                  <h3
                    className="text-base font-semibold"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    Downloadable Guides
                  </h3>
                  <div className="flex-1 ml-4 h-px" style={{ backgroundColor: '#E2E8F0' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="rounded-xl p-4 flex items-start gap-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <FileText size={24} style={{ color: '#0EA5E9' }} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        StrokeGuard Quick Reference Card
                      </h4>
                      <p
                        className="text-xs mb-3"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        A printable one-page FAST guide and risk factor checklist.
                      </p>
                      <button className="flex items-center gap-1.5">
                        <span
                          className="text-[13px] font-medium"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                        >
                          Download PDF
                        </span>
                        <Download size={13} style={{ color: '#0EA5E9' }} />
                      </button>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 flex items-start gap-4"
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <FileText size={24} style={{ color: '#0EA5E9' }} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Caregiver's Stroke Response Guide
                      </h4>
                      <p
                        className="text-xs mb-3"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Step-by-step guide for caregivers during and after a stroke event.
                      </p>
                      <button className="flex items-center gap-1.5">
                        <span
                          className="text-[13px] font-medium"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                        >
                          Download PDF
                        </span>
                        <Download size={13} style={{ color: '#0EA5E9' }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
