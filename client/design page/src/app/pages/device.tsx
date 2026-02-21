import { useState } from 'react';
import {
  Bluetooth,
  BluetoothOff,
  Battery,
  Wifi,
  Heart,
  Droplets,
  Activity,
  Check,
  Circle,
} from 'lucide-react';
import { Sidebar } from '../components/dashboard/sidebar';
import { PageTopBar } from '../components/dashboard/page-top-bar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

// Mock data for 24-hour charts
const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  bpm: i < 6 ? 55 + Math.random() * 10 : i === 8 ? 95 : 65 + Math.random() * 15,
}));

const spo2Data = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  percent: i === 3 ? 94.2 : 97 + Math.random() * 2,
}));

const hrvData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  sdnn: i === 11 ? 38 : 50 + Math.random() * 20,
}));

export default function DeviceHub() {
  const [isConnected, setIsConnected] = useState(true);

  const supportedDevices = [
    { brand: 'Oraimo', initial: 'O' },
    { brand: 'itel', initial: 'I' },
    { brand: 'Fitbit', initial: 'F' },
    { brand: 'Samsung Wear OS', initial: 'S' },
    { brand: 'Google Pixel Watch', initial: 'G' },
    { brand: 'Generic HR Monitor', initial: 'H' },
  ];

  const pairingSteps = [
    { id: 1, text: 'Enable Bluetooth on your phone', done: true },
    { id: 2, text: 'Open your smartwatch app and enable pairing mode', done: true },
    { id: 3, text: "Tap 'Scan for Devices' above", done: true },
    { id: 4, text: 'Select your device from the list and confirm', done: false },
  ];

  const syncLog = [
    { status: 'success', message: 'Heart rate batch synced (50 readings)', time: '09:14:02' },
    { status: 'success', message: 'SpO2 data synced', time: '09:14:01' },
    { status: 'success', message: 'HRV — SDNN calculated', time: '09:13:58' },
    { status: 'success', message: 'Device handshake confirmed', time: '09:13:55' },
    { status: 'success', message: 'Bluetooth connection established', time: '09:13:54' },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#F4F6FA' }}>
      <Sidebar activePage="device" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageTopBar breadcrumbSecond="Device Hub" />

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
              Device Hub
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
            >
              Manage your connected smartwatch and view real-time health data.
            </p>
          </div>
          <button
            className="h-11 px-5 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: '#0EA5E9' }}
          >
            <Bluetooth size={15} style={{ color: '#FFFFFF' }} />
            <span
              className="text-[13px] font-semibold"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
            >
              Scan for Devices
            </span>
          </button>
        </div>

        {/* Main Grid — Two Column */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-[42%_56%] gap-6">
            {/* LEFT COLUMN — Connection Manager */}
            <div className="space-y-4">
              {/* Card 1 — Connection Status */}
              {isConnected ? (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#EFF6FF' }}
                      >
                        <Bluetooth size={20} style={{ color: '#0EA5E9' }} />
                      </div>
                      <span
                        className="text-base font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Device Connected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                      <span
                        className="text-xs font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                      >
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Device Name */}
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    Oraimo Watch 3
                  </h3>
                  <p
                    className="text-xs mb-1"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    Connected via Bluetooth LE · Web Bluetooth API
                  </p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Wifi size={13} style={{ color: '#10B981' }} />
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#10B981' }}
                    >
                      Strong signal
                    </span>
                  </div>

                  <div className="h-px mb-4" style={{ backgroundColor: '#F1F5F9' }} />

                  {/* Device Info Rows */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between py-0.5">
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Device Name
                      </span>
                      <span
                        className="text-[13px] font-medium"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Oraimo Watch 3
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Battery Level
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[13px] font-medium"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                        >
                          78%
                        </span>
                        <Battery size={13} style={{ color: '#10B981' }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Last Sync
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        2 min ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        GATT Profile
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        Heart Rate (0x180D)
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                      >
                        Firmware
                      </span>
                      <span
                        className="text-xs"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        v2.4.1
                      </span>
                    </div>
                  </div>

                  <div className="h-px my-4" style={{ backgroundColor: '#F1F5F9' }} />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsConnected(false)}
                      className="flex-1 h-10 rounded-lg border"
                      style={{
                        borderColor: '#E2E8F0',
                        color: '#EF4444',
                      }}
                    >
                      <span
                        className="text-[13px] font-medium"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Disconnect
                      </span>
                    </button>
                    <button
                      className="flex-1 h-10 rounded-lg border"
                      style={{
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                      }}
                    >
                      <span
                        className="text-[13px] font-medium"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Reconnect
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <BluetoothOff size={48} style={{ color: '#CBD5E1', margin: '0 auto 12px' }} />
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    No device connected
                  </h3>
                  <p
                    className="text-[13px] mb-5 max-w-xs mx-auto"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                  >
                    Connect a BLE heart rate monitor or smartwatch to enable live HRV monitoring.
                  </p>
                  <button
                    onClick={() => setIsConnected(true)}
                    className="w-full h-12 rounded-lg flex items-center justify-center gap-2 mb-2.5"
                    style={{ backgroundColor: '#0EA5E9' }}
                  >
                    <Bluetooth size={15} style={{ color: '#FFFFFF' }} />
                    <span
                      className="text-[15px] font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                    >
                      Scan for Devices
                    </span>
                  </button>
                  <button
                    className="text-[13px] font-medium"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                  >
                    Using Google Fit instead?
                  </button>
                </div>
              )}

              {/* Card 2 — Supported Devices */}
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <h3
                  className="text-[15px] font-semibold mb-1"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                >
                  Supported Devices
                </h3>
                <p
                  className="text-xs mb-4"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                >
                  Any BLE device broadcasting the standard Heart Rate GATT service (0x180D)
                </p>

                <div className="space-y-0">
                  {supportedDevices.map((device, index) => (
                    <div key={device.brand}>
                      <div className="flex items-center gap-3 py-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#F1F5F9' }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                          >
                            {device.initial}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p
                            className="text-[13px] font-medium"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                          >
                            {device.brand}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            backgroundColor: '#ECFDF5',
                            color: '#10B981',
                          }}
                        >
                          Compatible
                        </span>
                      </div>
                      {index < supportedDevices.length - 1 && (
                        <div className="h-px" style={{ backgroundColor: '#F1F5F9' }} />
                      )}
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 rounded-lg p-2.5 flex items-start gap-2"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <Circle size={12} style={{ color: '#0EA5E9', marginTop: 1 }} fill="#0EA5E9" />
                  <p
                    className="text-[11px]"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#1E40AF' }}
                  >
                    Devices using Apple HealthKit require iOS. Google Fit sync available as an alternative.
                  </p>
                </div>
              </div>

              {/* Card 3 — Bluetooth Pairing Steps (only when disconnected) */}
              {!isConnected && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <h3
                    className="text-sm font-semibold mb-4"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                  >
                    How to Connect
                  </h3>

                  <div className="space-y-4">
                    {pairingSteps.map((step) => (
                      <div key={step.id} className="flex items-start gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#0EA5E9' }}
                        >
                          <span
                            className="text-[13px] font-bold"
                            style={{ fontFamily: 'Space Mono, monospace', color: '#FFFFFF' }}
                          >
                            {step.id}
                          </span>
                        </div>
                        <p
                          className="text-[13px] flex-1 pt-0.5"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                        >
                          {step.text}
                        </p>
                        {step.done && <Check size={16} style={{ color: '#10B981', marginTop: 4 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — Live Data & Trends */}
            {isConnected ? (
              <div className="space-y-4">
                {/* Card 4 — Live Metrics */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3
                      className="text-[15px] font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Live Health Data
                    </h3>
                    <span
                      className="text-[11px]"
                      style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                    >
                      Updated 2s ago
                    </span>
                  </div>

                  <div className="grid grid-cols-3 divide-x" style={{ borderColor: '#F1F5F9' }}>
                    {/* Tile 1: Heart Rate */}
                    <div className="px-4 py-3 text-center">
                      <p
                        className="text-[11px] mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Heart Rate
                      </p>
                      <p
                        className="text-[32px] font-bold leading-none mb-1"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        74
                      </p>
                      <p
                        className="text-xs mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        bpm
                      </p>
                      <span
                        className="px-2 py-1 rounded text-[10px] font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                        }}
                      >
                        Normal
                      </span>
                    </div>

                    {/* Tile 2: SpO2 */}
                    <div className="px-4 py-3 text-center">
                      <p
                        className="text-[11px] mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        SpO2
                      </p>
                      <p
                        className="text-[32px] font-bold leading-none mb-1"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        98
                      </p>
                      <p
                        className="text-xs mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        %
                      </p>
                      <span
                        className="px-2 py-1 rounded text-[10px] font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                        }}
                      >
                        Normal
                      </span>
                    </div>

                    {/* Tile 3: HRV */}
                    <div className="px-4 py-3 text-center">
                      <p
                        className="text-[11px] mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        HRV — SDNN
                      </p>
                      <p
                        className="text-[32px] font-bold leading-none mb-1"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        62
                      </p>
                      <p
                        className="text-xs mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        ms
                      </p>
                      <span
                        className="px-2 py-1 rounded text-[10px] font-semibold"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                        }}
                      >
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 5 — 24-Hour Heart Rate Chart */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Heart size={15} style={{ color: '#EF4444' }} />
                      <h3
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        Heart Rate — 24hr Trend
                      </h3>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className="text-[13px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0EA5E9' }}
                      >
                        24h
                      </button>
                      <button
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        7d
                      </button>
                      <button
                        className="text-[13px]"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        30d
                      </button>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <YAxis
                        domain={[40, 120]}
                        ticks={[40, 60, 80, 100, 120]}
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <ReferenceLine y={68} stroke="#94A3B8" strokeDasharray="3 3" />
                      <ReferenceLine y={95} stroke="#F59E0B" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="bpm"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#hrGradient)"
                      />
                      <defs>
                        <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(239,68,68,0.15)" />
                          <stop offset="100%" stopColor="rgba(239,68,68,0)" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="flex gap-3 mt-4">
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Avg today
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        71 bpm
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Min
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        54 bpm
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Max
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        95 bpm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 6 — 24-Hour SpO2 Chart */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Droplets size={15} style={{ color: '#0EA5E9' }} />
                      <h3
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        SpO2 — 24hr Trend
                      </h3>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={spo2Data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <YAxis
                        domain={[90, 100]}
                        ticks={[90, 93, 95, 97, 100]}
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <ReferenceLine y={95} stroke="#10B981" strokeDasharray="3 3" />
                      <ReferenceLine y={93} stroke="#EF4444" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="percent"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#spo2Gradient)"
                      />
                      <defs>
                        <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(14,165,233,0.12)" />
                          <stop offset="100%" stopColor="rgba(14,165,233,0)" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="flex gap-3 mt-4">
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Avg today
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        97.8%
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Min
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        94.2%
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Max
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        99.1%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 7 — HRV Trend (SDNN) */}
                <div
                  className="rounded-2xl p-6"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity size={15} style={{ color: '#0EA5E9' }} />
                      <h3
                        className="text-[15px] font-semibold"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                      >
                        HRV Trend — SDNN
                      </h3>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={hrvData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <YAxis
                        domain={[0, 80]}
                        ticks={[0, 20, 40, 60, 80]}
                        tick={{ fontSize: 9, fontFamily: 'Space Mono, monospace', fill: '#CBD5E1' }}
                        stroke="#E2E8F0"
                      />
                      <ReferenceLine y={50} stroke="#10B981" strokeDasharray="3 3" />
                      <ReferenceLine y={20} stroke="#F59E0B" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="sdnn"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#hrvGradient)"
                      />
                      <defs>
                        <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(16,185,129,0.12)" />
                          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="flex gap-3 mt-4">
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Current SDNN
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        62 ms
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Min today
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        38 ms
                      </p>
                    </div>
                    <div
                      className="flex-1 rounded-lg px-3 py-2.5"
                      style={{ backgroundColor: '#F8FAFC' }}
                    >
                      <p
                        className="text-[11px] mb-1"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                      >
                        Avg today
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: 'Space Mono, monospace', color: '#0F172A' }}
                      >
                        57 ms
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 8 — Device Sync Log */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-sm font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#0F172A' }}
                    >
                      Sync Log
                    </h3>
                    <button
                      className="text-xs font-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-0">
                    {syncLog.map((log, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-3 py-2.5">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: log.status === 'success' ? '#10B981' : '#EF4444' }}
                          />
                          <p
                            className="text-[13px] flex-1"
                            style={{ fontFamily: 'DM Sans, sans-serif', color: '#334155' }}
                          >
                            {log.message}
                          </p>
                          <span
                            className="text-[11px]"
                            style={{ fontFamily: 'Space Mono, monospace', color: '#94A3B8' }}
                          >
                            {log.time}
                          </span>
                        </div>
                        {index < syncLog.length - 1 && (
                          <div className="h-px" style={{ backgroundColor: '#F8FAFC' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  <p
                    className="text-[9px] text-center mt-4"
                    style={{ fontFamily: 'Space Mono, monospace', color: '#CBD5E1' }}
                  >
                    Characteristic: 0x2A37 · Profile: Heart Rate (0x180D) · Protocol: GATT/BLE
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div
                  className="rounded-2xl p-16 text-center max-w-md"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <BluetoothOff size={64} style={{ color: '#E2E8F0', margin: '0 auto 16px' }} />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B' }}
                  >
                    Connect a device to view live data
                  </h3>
                  <p
                    className="text-sm mb-6"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: '#94A3B8' }}
                  >
                    Heart rate, SpO2, and HRV trends will appear here once your smartwatch is paired.
                  </p>
                  <button
                    onClick={() => setIsConnected(true)}
                    className="w-full h-[52px] rounded-lg flex items-center justify-center gap-2 mb-4"
                    style={{ backgroundColor: '#0EA5E9' }}
                  >
                    <Bluetooth size={16} style={{ color: '#FFFFFF' }} />
                    <span
                      className="text-[15px] font-semibold"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: '#FFFFFF' }}
                    >
                      Scan for Devices
                    </span>
                  </button>

                  <div className="flex gap-2 justify-center">
                    {['Oraimo', 'itel', 'Fitbit', 'Wear OS'].map((brand) => (
                      <div
                        key={brand}
                        className="px-4 py-2 rounded-full text-xs"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          backgroundColor: '#F8FAFC',
                          color: '#64748B',
                        }}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
