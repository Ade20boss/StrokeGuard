"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface VitalsState {
  heartRate: number | null;
  spO2: number | null;
  sdnn: number | null;
  hrvi: number | null;
  sparklineData: number[];
  deviceConnected: boolean;
  lastSync: string;
  reconnectNeeded: boolean;
}

interface PairedDevice {
  id: string;
  name: string;
  hasStandardHeartRate: boolean;
  pairedAt: string;
}

// ALL services listed here MUST exactly match what was declared in
// optionalServices during the original requestDevice() call. If a UUID
// was not listed there, getPrimaryService() will throw a SecurityError.
export const ALL_OPTIONAL_SERVICES: BluetoothServiceUUID[] = [
  'heart_rate',
  'pulse_oximeter',
  'battery_service',
  'device_information',
  '0000fee0-0000-1000-8000-00805f9b34fb', // Xiaomi / Mi Band primary
  '0000fee1-0000-1000-8000-00805f9b34fb', // Xiaomi / Mi Band secondary
  '0000ffd0-0000-1000-8000-00805f9b34fb', // Oraimo / generic fitness
  '0000ffd5-0000-1000-8000-00805f9b34fb', // Oraimo secondary
  '0000fff0-0000-1000-8000-00805f9b34fb', // itel / generic BLE HR
  '0000fff5-0000-1000-8000-00805f9b34fb', // itel secondary
];

// Known proprietary HR service + characteristic combos to probe as fallback
const PROPRIETARY_HR_CHARS: Array<{ service: string; char: string }> = [
  { service: '0000ffd0-0000-1000-8000-00805f9b34fb', char: '0000ffd4-0000-1000-8000-00805f9b34fb' },
  { service: '0000ffd5-0000-1000-8000-00805f9b34fb', char: '0000ffd4-0000-1000-8000-00805f9b34fb' },
  { service: '0000fff0-0000-1000-8000-00805f9b34fb', char: '0000fff4-0000-1000-8000-00805f9b34fb' },
  { service: '0000fee0-0000-1000-8000-00805f9b34fb', char: '0000fee1-0000-1000-8000-00805f9b34fb' },
];

export function useBluetoothVitals(): VitalsState & { manualReconnect: () => Promise<void> } {
  const [state, setState] = useState<VitalsState>({
    heartRate: null,
    spO2: null,
    sdnn: null,
    hrvi: null,
    sparklineData: [],
    deviceConnected: false,
    lastSync: 'never',
    reconnectNeeded: false,
  });

  const rrIntervals = useRef<number[]>([]);
  const hrListenerRef = useRef<((e: Event) => void) | null>(null);
  const spo2ListenerRef = useRef<((e: Event) => void) | null>(null);
  const hrCharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const spo2CharRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);

  const computeSDNN = (rrs: number[]): number | null => {
    if (rrs.length < 2) return null;
    const mean = rrs.reduce((a, b) => a + b, 0) / rrs.length;
    const variance = rrs.reduce((sum, rr) => sum + Math.pow(rr - mean, 2), 0) / rrs.length;
    return Math.round(Math.sqrt(variance));
  };

  // Standard GATT heart_rate handler — parses HR + RR intervals per spec
  const handleHRNotification = useCallback((event: Event) => {
    const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
    if (!value) return;

    const flags = value.getUint8(0);
    const hr = flags & 0x1 ? value.getUint16(1, true) : value.getUint8(1);

    if (flags & 0x10) {
      let offset = flags & 0x1 ? 3 : 2;
      while (offset + 1 < value.byteLength) {
        const rr = (value.getUint16(offset, true) / 1024) * 1000;
        rrIntervals.current.push(rr);
        if (rrIntervals.current.length > 60) rrIntervals.current.shift();
        offset += 2;
      }
    }

    const sdnn = computeSDNN(rrIntervals.current);
    const hrvi = sdnn !== null ? parseFloat((sdnn / 5.0).toFixed(1)) : null;

    setState(prev => {
      const newSparkline = sdnn !== null
        ? [...prev.sparklineData.slice(-6), sdnn]
        : prev.sparklineData;
      try {
        localStorage.setItem('liveVitals', JSON.stringify({
          heartRate: hr, sdnn, hrvi, spO2: prev.spO2,
          timestampISO: new Date().toISOString(),
        }));
      } catch {}
      return {
        ...prev, heartRate: hr, sdnn, hrvi,
        sparklineData: newSparkline,
        deviceConnected: true,
        lastSync: new Date().toLocaleTimeString(),
        reconnectNeeded: false,
      };
    });
  }, []);

  // Proprietary handler — most clone watches put HR as uint8 at byte index 1
  const makeProprietaryHRHandler = useCallback(() => {
    return (event: Event) => {
      const val = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (!val || val.byteLength < 2) return;
      const hr = val.getUint8(1);
      if (hr > 30 && hr < 250) {
        setState(prev => ({
          ...prev,
          heartRate: hr,
          deviceConnected: true,
          lastSync: new Date().toLocaleTimeString(),
          reconnectNeeded: false,
        }));
        try {
          const stored = JSON.parse(localStorage.getItem('liveVitals') || '{}');
          localStorage.setItem('liveVitals', JSON.stringify({
            ...stored, heartRate: hr, timestampISO: new Date().toISOString(),
          }));
        } catch {}
      }
    };
  }, []);

  const handleSpO2Notification = useCallback((event: Event) => {
    const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
    if (!value || value.byteLength < 3) return;
    const raw = value.getUint16(1, true);
    const exponent = raw >> 12;
    const mantissa = raw & 0x0fff;
    const spO2 = mantissa * Math.pow(10, exponent);
    if (spO2 > 0 && spO2 <= 100) {
      setState(prev => ({ ...prev, spO2: Math.round(spO2) }));
    }
  }, []);

  const cleanupListeners = useCallback(() => {
    if (hrCharRef.current && hrListenerRef.current) {
      hrCharRef.current.stopNotifications().catch(() => {});
      hrCharRef.current.removeEventListener('characteristicvaluechanged', hrListenerRef.current);
      hrCharRef.current = null;
      hrListenerRef.current = null;
    }
    if (spo2CharRef.current && spo2ListenerRef.current) {
      spo2CharRef.current.stopNotifications().catch(() => {});
      spo2CharRef.current.removeEventListener('characteristicvaluechanged', spo2ListenerRef.current);
      spo2CharRef.current = null;
      spo2ListenerRef.current = null;
    }
  }, []);

  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    deviceRef.current = device;
    try {
      const server = await device.gatt?.connect();
      if (!server) throw new Error('GATT connect failed');

      device.addEventListener('gattserverdisconnected', () => {
        setState(prev => ({ ...prev, deviceConnected: false, reconnectNeeded: true }));
      });

      // ── 1. Try standard heart_rate service ──────────────────────────────────
      let hrConnected = false;
      try {
        const hrService = await server.getPrimaryService('heart_rate');
        const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
        hrCharRef.current = hrChar;
        hrListenerRef.current = handleHRNotification;
        hrChar.addEventListener('characteristicvaluechanged', handleHRNotification);
        await hrChar.startNotifications();
        hrConnected = true;
        console.info('[BLE] Standard heart_rate service connected');
      } catch {
        console.info('[BLE] Standard heart_rate not found, probing proprietary...');
      }

      // ── 2. Probe proprietary HR characteristics ──────────────────────────────
      if (!hrConnected) {
        for (const { service, char } of PROPRIETARY_HR_CHARS) {
          try {
            const svc = await server.getPrimaryService(service);
            const characteristic = await svc.getCharacteristic(char);
            if (characteristic.properties.notify || characteristic.properties.indicate) {
              const handler = makeProprietaryHRHandler();
              hrListenerRef.current = handler;
              hrCharRef.current = characteristic;
              characteristic.addEventListener('characteristicvaluechanged', handler);
              await characteristic.startNotifications();
              hrConnected = true;
              console.info(`[BLE] Proprietary HR connected: ${char}`);
              break;
            }
          } catch {
            // Not available on this device — try next
          }
        }
      }

      if (!hrConnected) {
        console.warn('[BLE] No heart rate characteristic found on this device');
        setState(prev => ({ ...prev, deviceConnected: false, reconnectNeeded: true }));
        return;
      }

      // ── 3. Try standard SpO2 (optional) ─────────────────────────────────────
      try {
        const spo2Service = await server.getPrimaryService('pulse_oximeter');
        const spo2Char = await spo2Service
          .getCharacteristic('plx_continuous_measurement')
          .catch(() => spo2Service.getCharacteristic('plx_spot_check_measurement'));
        spo2CharRef.current = spo2Char;
        spo2ListenerRef.current = handleSpO2Notification;
        spo2Char.addEventListener('characteristicvaluechanged', handleSpO2Notification);
        await spo2Char.startNotifications();
      } catch {
        console.info('[BLE] SpO2 service not available');
      }

      setState(prev => ({ ...prev, deviceConnected: true, reconnectNeeded: false }));

    } catch (err) {
      console.warn('[BLE] connectToDevice failed:', err);
      setState(prev => ({ ...prev, deviceConnected: false, reconnectNeeded: true }));
    }
  }, [handleHRNotification, handleSpO2Notification, makeProprietaryHRHandler]);

  const silentReconnect = useCallback(async () => {
    if (!('bluetooth' in navigator)) return;

    let paired: PairedDevice | null = null;
    try {
      const raw = localStorage.getItem('pairedDevice');
      if (!raw) return;
      paired = JSON.parse(raw);
    } catch {
      setState(prev => ({ ...prev, reconnectNeeded: true }));
      return;
    }

    try {
      const nav = navigator as any;
      // getDevices() works without a user prompt but requires Chrome flag on most devices
      if (nav.bluetooth?.getDevices) {
        const devices: BluetoothDevice[] = await nav.bluetooth.getDevices();
        const match = devices.find((d: BluetoothDevice) => d.id === paired!.id);
        if (match) {
          await connectToDevice(match);
          return;
        }
      }
      // getDevices() unavailable — can't reconnect silently, show the button
      setState(prev => ({ ...prev, reconnectNeeded: true }));
    } catch (err) {
      console.warn('[BLE] silentReconnect failed:', err);
      setState(prev => ({ ...prev, reconnectNeeded: true }));
    }
  }, [connectToDevice]);

  const manualReconnect = useCallback(async () => {
    if (!('bluetooth' in navigator)) return;
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        // CRITICAL: must match the UUIDs declared during initial pairing
        optionalServices: ALL_OPTIONAL_SERVICES,
      });

      localStorage.setItem('pairedDevice', JSON.stringify({
        id: device.id,
        name: device.name ?? 'Unknown',
        hasStandardHeartRate: true,
        pairedAt: new Date().toISOString(),
      }));

      cleanupListeners();
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }

      await connectToDevice(device);
    } catch (err) {
      console.warn('[BLE] manualReconnect failed:', err);
    }
  }, [connectToDevice, cleanupListeners]);

  useEffect(() => {
    silentReconnect();
    return () => {
      cleanupListeners();
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    };
  }, [silentReconnect, cleanupListeners]);

  return { ...state, manualReconnect };
}