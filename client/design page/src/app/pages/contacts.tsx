import { useState } from 'react';
import { Sidebar } from '../components/dashboard/sidebar';
import { DashboardTopBar } from '../components/dashboard/dashboard-top-bar';
import { UserPlus, Phone, MessageCircle, Pencil, Trash2, Info, MapPin, Users, Clock, Bell, Send, Share2, Mail, ChevronRight, GripVertical, X } from 'lucide-react';

export default function EmergencyContacts() {
  const [showAddModal, setShowAddModal] = useState(false);

  const contacts = [
    {
      id: 1,
      priority: '1st',
      name: 'Sarah Adeyemi',
      relationship: 'Spouse',
      phone: '+234 801 234 5567',
      initials: 'SA',
      alertPreference: 'both',
    },
    {
      id: 2,
      priority: '2nd',
      name: 'Kunle Adeyemi',
      relationship: 'Brother',
      phone: '+234 807 891 2345',
      initials: 'KA',
      alertPreference: 'sms',
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar activePage="contacts" />
      
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#F4F6FA' }}>
        <DashboardTopBar />
        
        {/* Breadcrumb */}
        <div className="px-8 py-3 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B' }}>
            Dashboard / Emergency Contacts
          </p>
        </div>

        {/* Page Header */}
        <div className="bg-white px-8 py-8 border-b" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '28px', fontWeight: 700, color: '#0F172A' }}>
                Emergency Contacts
              </h1>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                Your emergency dispatch list — always ready when you need it.
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="h-11 px-4 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0EA5E9' }}
            >
              <UserPlus size={14} style={{ color: '#FFFFFF' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                Add Contact
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 max-w-[1200px]">
          {/* SECTION 1 — Emergency Services */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: '#0A1628',
            }}
          >
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
              Emergency Services
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.50)', marginBottom: '20px' }}>
              Nigeria · Tap to dial immediately
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* 112 - National Emergency */}
              <a
                href="tel:112"
                className="rounded-xl p-5 text-center transition-all hover:bg-opacity-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Phone size={20} style={{ color: '#EF4444', margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '36px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  112
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                  National Emergency
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.40)', marginBottom: '12px' }}>
                  Ambulance · Police · Fire
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Phone size={10} style={{ color: 'rgba(255,255,255,0.50)' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.50)' }}>
                    Tap to call
                  </span>
                </div>
              </a>

              {/* 199 - Lagos Emergency */}
              <a
                href="tel:199"
                className="rounded-xl p-5 text-center transition-all hover:bg-opacity-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Phone size={20} style={{ color: '#EF4444', margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '36px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  199
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                  Lagos State Emergency
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.40)', marginBottom: '12px' }}>
                  LASEMA — Lagos-specific response
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Phone size={10} style={{ color: 'rgba(255,255,255,0.50)' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.50)' }}>
                    Tap to call
                  </span>
                </div>
              </a>

              {/* NEMA */}
              <a
                href="tel:08021523225"
                className="rounded-xl p-5 text-center transition-all hover:bg-opacity-80"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Phone size={20} style={{ color: '#EF4444', margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  NEMA
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  08021523225
                </div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px' }}>
                  National Emergency Mgmt.
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.40)', marginBottom: '8px' }}>
                  Non-life-threatening emergencies
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <Phone size={10} style={{ color: 'rgba(255,255,255,0.50)' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.50)' }}>
                    Tap to call
                  </span>
                </div>
              </a>
            </div>

            {/* Warning */}
            <div
              className="rounded-lg p-2.5 flex items-start gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <Info size={12} style={{ color: 'rgba(255,255,255,0.40)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.60)', lineHeight: '1.5' }}>
                If you are experiencing a stroke or witnessing one, call 112 immediately. Do not wait for a FAST Check result.
              </p>
            </div>
          </div>

          {/* SECTION 2 — Personal Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 600, color: '#0F172A' }}>
                Personal Contacts
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8' }}>
                Priority order — first contact is alerted first
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <GripVertical size={16} style={{ color: '#CBD5E1', cursor: 'grab' }} />
                    
                    <span
                      className="px-2.5 py-1 rounded text-[12px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: '#EFF6FF',
                        color: '#0EA5E9',
                      }}
                    >
                      {contact.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-13 h-13 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: '#DBEAFE',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#1D4ED8',
                      }}
                    >
                      {contact.initials}
                    </div>
                    
                    <div className="flex-1">
                      <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                        {contact.name}
                      </h3>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B', marginBottom: '2px' }}>
                        {contact.relationship}
                      </p>
                      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '13px', color: '#64748B' }}>
                        {contact.phone}
                      </p>
                    </div>
                  </div>

                  {/* Alert Preference */}
                  <div className="mb-4">
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#94A3B8', marginBottom: '8px' }}>
                      Alert preference
                    </p>
                    <div className="flex gap-2">
                      {['sms', 'call', 'both'].map((pref) => (
                        <button
                          key={pref}
                          className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            backgroundColor: contact.alertPreference === pref ? '#0EA5E9' : '#F1F5F9',
                            color: contact.alertPreference === pref ? '#FFFFFF' : '#64748B',
                          }}
                        >
                          {pref === 'sms' ? 'SMS' : pref === 'call' ? 'Call' : 'Both'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#ECFDF5' }}
                    >
                      <Phone size={16} style={{ color: '#10B981' }} />
                    </button>
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      <MessageCircle size={16} style={{ color: '#0EA5E9' }} />
                    </button>
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <Pencil size={16} style={{ color: '#64748B' }} />
                    </button>
                    <button
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#FEF2F2' }}
                    >
                      <Trash2 size={16} style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Settings */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#EFF6FF' }}
              >
                <Bell size={15} style={{ color: '#0EA5E9' }} />
              </div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                Alert Settings
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { icon: MapPin, title: 'Include GPS Location', subtitle: 'Your location is shared with contacts during SOS.', enabled: true },
                { icon: Users, title: 'Alert All Contacts Simultaneously', subtitle: 'Otherwise contacts are alerted in priority order.', enabled: false },
                { icon: Clock, title: 'Auto-Alert After FAST Check Flag', subtitle: 'Contacts are alerted if a FAST Check is flagged.', enabled: true },
                { icon: Bell, title: 'Include FAST Check Summary in Alert', subtitle: 'Contacts receive your F-A-S-T results with the alert.', enabled: true },
              ].map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: '#F1F5F9' }}
                      >
                        <Icon size={14} style={{ color: '#64748B' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500, color: '#0F172A', marginBottom: '2px' }}>
                          {setting.title}
                        </p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#64748B' }}>
                          {setting.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <div
                      className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                      style={{
                        backgroundColor: setting.enabled ? '#0EA5E9' : '#E2E8F0',
                      }}
                    >
                      <div
                        className="absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all"
                        style={{
                          left: setting.enabled ? '22px' : '2px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SMS Preview */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                Alert Message Preview
              </h3>
              <button style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500, color: '#0EA5E9' }}>
                Edit template
              </button>
            </div>

            <div
              className="rounded-xl p-4 mb-3"
              style={{
                backgroundColor: '#DBEAFE',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#1E293B',
                lineHeight: '1.6',
              }}
            >
              <strong>StrokeGuard Alert:</strong> John Adeyemi may need help. Location: [Google Maps link]. FAST Check result: F ✓ A ⚠ S ✓. Time: 09:14, 21 Feb 2026. Please call immediately.
            </div>

            <div className="flex items-center justify-between">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#94A3B8' }}>
                This is sent to: Sarah Adeyemi, Kunle Adeyemi
              </p>
              <button className="flex items-center gap-1.5">
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#0EA5E9' }}>
                  Test alert
                </span>
                <Send size={13} style={{ color: '#0EA5E9' }} />
              </button>
            </div>
          </div>

          {/* Caregiver Invite */}
          <div
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderLeft: '3px solid #0EA5E9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#EFF6FF' }}
            >
              <Share2 size={20} style={{ color: '#0EA5E9' }} />
            </div>
            
            <div className="flex-1">
              <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                Invite a Caregiver
              </h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#64748B' }}>
                Give a trusted person view-only access to your risk score and FAST check history.
              </p>
            </div>

            <button
              className="h-11 px-4 rounded-lg flex items-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0EA5E9' }}
            >
              <Mail size={14} style={{ color: '#FFFFFF' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                Send Invite Link
              </span>
            </button>

            <ChevronRight size={18} style={{ color: '#CBD5E1' }} />
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.40)' }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="rounded-3xl p-8 relative"
            style={{
              backgroundColor: '#FFFFFF',
              width: '480px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.20)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
                Add Emergency Contact
              </h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} style={{ color: '#94A3B8' }} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Adeyemi"
                  className="w-full h-12 px-4 rounded-lg"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '15px',
                    color: '#0F172A',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Relationship
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spouse, Parent, Sibling"
                  className="w-full h-12 px-4 rounded-lg"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '15px',
                    color: '#0F172A',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '15px',
                      color: '#64748B',
                    }}
                  >
                    +234
                  </span>
                  <input
                    type="tel"
                    placeholder="801 234 5567"
                    className="w-full h-12 pl-16 pr-4 rounded-lg"
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '15px',
                      color: '#0F172A',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Alert Preference
                </label>
                <div className="flex gap-2">
                  {['SMS', 'Call', 'Both'].map((pref) => (
                    <button
                      key={pref}
                      className="flex-1 h-10 rounded-lg text-[13px] font-semibold"
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        backgroundColor: pref === 'Both' ? '#0EA5E9' : '#F1F5F9',
                        color: pref === 'Both' ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Priority Order
                </label>
                <select
                  className="w-full h-12 px-4 rounded-lg"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '15px',
                    color: '#0F172A',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option>1st contact</option>
                  <option>2nd contact</option>
                  <option>3rd contact</option>
                </select>
              </div>
            </div>

            <button
              className="w-full h-13 rounded-lg mb-3 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#0EA5E9',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              Save Contact
            </button>

            <button
              onClick={() => setShowAddModal(false)}
              className="w-full h-11 rounded-lg"
              style={{
                border: '1px solid #E2E8F0',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#64748B',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
