"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Watch,
  Smartphone,
  Bluetooth,
  Check,
  Loader2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function SmartwatchPairingPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [hasHeartRate, setHasHeartRate] = useState<boolean | null>(null);

  const connectToWatch = async () => {
    // Guard — Web Bluetooth not supported on this browser
    if (!navigator.bluetooth) {
      setError(
        "Web Bluetooth is not supported on this browser. Please use Chrome or Edge on Android or Desktop. iOS Safari is not supported."
      );
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // acceptAllDevices: true shows ALL nearby BLE devices in the picker
      // This is the fix — filters: [{ services: ['heart_rate'] }] only shows
      // devices actively broadcasting that UUID, which most consumer watches
      // (Oraimo, itel, Mi Band etc.) do NOT do.
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "heart_rate",             // 0x180D — standard HR GATT service
          "battery_service",        // 0x180F — battery level
          "device_information",     // 0x180A — device name and model
          // Proprietary services for common African market watches
          "0000fee0-0000-1000-8000-00805f9b34fb", // Xiaomi / Mi Band primary
          "0000fee1-0000-1000-8000-00805f9b34fb", // Xiaomi / Mi Band secondary
          "0000ffd0-0000-1000-8000-00805f9b34fb", // Oraimo / generic fitness
          "0000ffd5-0000-1000-8000-00805f9b34fb", // Oraimo secondary
          "0000fff0-0000-1000-8000-00805f9b34fb", // itel / generic BLE HR
          "0000fff5-0000-1000-8000-00805f9b34fb", // itel secondary
        ],
      });

      console.log("Device selected:", device.name);
      setDeviceName(device.name || "Unknown Device");

      // Connect to the GATT server on the watch
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT server");

      console.log("Connected to GATT server");

      // Try to confirm the heart rate service exists
      // Some watches use proprietary services — connection still works
      // we just note whether standard HR is available for later use
      let hrServiceAvailable = false;
      try {
        await server.getPrimaryService("heart_rate");
        console.log("Standard heart rate service confirmed");
        hrServiceAvailable = true;
        setHasHeartRate(true);
      } catch {
        console.warn(
          "Standard heart rate service not found — device may use proprietary protocol. " +
          "BPM collection will use camera rPPG as fallback during FAST Check."
        );
        setHasHeartRate(false);
      }

      // Store paired device info in localStorage for use in FAST Check and dashboard
      // IMPORTANT: use hrServiceAvailable (local var), NOT hasHeartRate (React state)
      // because setState is async and hasHeartRate would still be null here.
      localStorage.setItem(
        "pairedDevice",
        JSON.stringify({
          id: device.id,
          name: device.name || "Unknown Device",
          hasStandardHeartRate: hrServiceAvailable,
          pairedAt: new Date().toISOString(),
        })
      );

      setSuccess(true);

      // Auto-redirect after showing success state
      setTimeout(() => {
        router.push("/onboarding/permissions");
      }, 2500);

    } catch (err: any) {
      console.error("Bluetooth connection failed:", err);

      // Handle each error type with a clear, actionable message
      if (err.name === "NotFoundError") {
        setError(
          "No device was selected. Make sure your watch Bluetooth is switched on, bring it within 30cm of your phone, then try again."
        );
      } else if (err.name === "SecurityError") {
        setError(
          "Bluetooth access was denied by the browser. Click the lock icon in your address bar and allow Bluetooth access, then try again."
        );
      } else if (err.name === "NetworkError") {
        setError(
          "Connection dropped. Keep your watch close to your phone and try again."
        );
      } else if (err.name === "NotSupportedError") {
        setError(
          "Your watch was found but could not be connected. Try putting it into pairing mode from its settings."
        );
      } else {
        setError(
          `Connection failed: ${err.message}. Make sure your watch is in pairing mode and try again.`
        );
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/permissions");
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(false);
    setDeviceName(null);
    setHasHeartRate(null);
  };

  return (
    <div className="min-h-screen flex text-[#0F172A]">
      {/* ── LEFT PANEL — Photo ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd3Jpc3QlMjBjbG9zZSUyMHVwJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Smartwatch on wrist"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#050A14] opacity-40" />
        {/* Blue tint */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-15" />
        {/* Blue glow orb */}
        <div
          className="absolute top-10 right-10 w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)",
          }}
        />
        {/* Bottom branding */}
        <div className="absolute bottom-8 left-8 z-10">
          <p className="text-white font-bold text-xl tracking-tight">
            StrokeGuard
          </p>
          <p
            className="text-white/50 text-[11px] mt-1 tracking-widest"
            style={{ fontFamily: "monospace" }}
          >
            PREDICT · RECOGNIZE · RESPOND
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Content ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-[#0EA5E9] transition-all duration-500"
                style={{ width: "71%" }}
              />
            </div>
            <p
              className="text-[#94A3B8] text-[11px] tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              STEP 5 OF 7
            </p>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[26px] font-bold text-[#0F172A]">
              Connect your watch
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#D97706] text-[11px] font-semibold uppercase tracking-wider">
              Optional
            </span>
          </div>

          <p className="text-[#64748B] text-[13px] leading-relaxed mb-8">
            Connects directly to your Oraimo, itel, or any Bluetooth watch for
            real-time heart rate and SpO2 during your FAST Check.
          </p>

          {/* Connection Illustration */}
          <div className="flex items-center justify-center gap-6 mb-8 py-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            {/* Watch icon */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  success
                    ? "bg-[#ECFDF5] text-[#10B981]"
                    : isConnecting
                    ? "bg-[#EFF6FF] text-[#0EA5E9]"
                    : "bg-[#F1F5F9] text-[#94A3B8]"
                }`}
              >
                <Watch className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Watch
              </span>
            </div>

            {/* Connection dots */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5 w-full justify-center">
                {[0, 75, 150, 225, 300].map((delay, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      success
                        ? "bg-[#10B981]"
                        : isConnecting
                        ? "bg-[#0EA5E9] animate-bounce"
                        : "bg-[#E2E8F0]"
                    }`}
                    style={
                      isConnecting ? { animationDelay: `${delay}ms` } : {}
                    }
                  />
                ))}
              </div>
              <Bluetooth
                className={`w-4 h-4 transition-all ${
                  success
                    ? "text-[#10B981]"
                    : isConnecting
                    ? "text-[#0EA5E9] animate-pulse"
                    : "text-[#CBD5E1]"
                }`}
              />
              <span
                className={`text-[10px] font-semibold tracking-wider transition-all ${
                  success
                    ? "text-[#10B981]"
                    : isConnecting
                    ? "text-[#0EA5E9]"
                    : "text-[#CBD5E1]"
                }`}
                style={{ fontFamily: "monospace" }}
              >
                {success
                  ? "CONNECTED"
                  : isConnecting
                  ? "PAIRING..."
                  : "BLUETOOTH"}
              </span>
            </div>

            {/* Phone icon */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  success
                    ? "bg-[#ECFDF5] text-[#10B981]"
                    : isConnecting
                    ? "bg-[#EFF6FF] text-[#0EA5E9]"
                    : "bg-[#F1F5F9] text-[#94A3B8]"
                }`}
              >
                <Smartphone className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Phone
              </span>
            </div>
          </div>

          {/* ── STATE: Default info box ── */}
          {!success && !error && (
            <div className="mb-6 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#0EA5E9] mt-0.5 flex-shrink-0" />
              <div className="text-[13px] text-[#334155] leading-relaxed space-y-1.5">
                <p className="font-semibold text-[#0284C7]">
                  Before you tap Connect:
                </p>
                <p>1. Open your watch settings and enable Bluetooth</p>
                <p>2. Keep your watch within 30cm of your phone</p>
                <p>
                  3. All nearby Bluetooth devices will appear — select your
                  watch by name
                </p>
              </div>
            </div>
          )}

          {/* ── STATE: Error ── */}
          {error && (
            <div className="mb-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[#EF4444] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#991B1B] mb-1">
                  Connection failed
                </p>
                <p className="text-[13px] text-[#B91C1C] leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ── STATE: Success ── */}
          {success && (
            <div className="mb-6 p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-start gap-3">
              <Check className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#065F46] mb-1">
                  Connected successfully
                </p>
                <p className="text-[13px] text-[#047857]">
                  {deviceName} is now paired with StrokeGuard.
                </p>
                {hasHeartRate === false && (
                  <p className="text-[11px] text-[#059669] mt-1.5 leading-relaxed">
                    Note: Your watch uses a proprietary protocol. Heart rate
                    will be measured via camera during FAST Check as a fallback.
                  </p>
                )}
                <p className="text-[11px] text-[#94A3B8] mt-1.5">
                  Redirecting to next step...
                </p>
              </div>
            </div>
          )}

          {/* ── MAIN CTA BUTTON ── */}
          {!success && (
            <button
              onClick={error ? handleRetry : connectToWatch}
              disabled={isConnecting}
              className={`w-full h-14 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-3 mb-4 ${
                error
                  ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                  : "bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              style={{
                boxShadow: error
                  ? "0 4px 12px rgba(239,68,68,0.3)"
                  : "0 4px 12px rgba(14,165,233,0.3)",
              }}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening device picker...
                </>
              ) : error ? (
                <>
                  <Bluetooth className="w-5 h-5" />
                  Try Again
                </>
              ) : (
                <>
                  <Bluetooth className="w-5 h-5" />
                  Connect My Watch
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>
          )}

          {/* Continue button after success */}
          {success && (
            <button
              onClick={() => router.push("/onboarding/permissions")}
              className="w-full h-14 rounded-xl text-[15px] font-bold bg-[#10B981] hover:bg-[#059669] text-white transition-all flex items-center justify-center gap-3 mb-4"
              style={{ boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              <Check className="w-5 h-5" />
              Continue to Next Step
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {/* Privacy note */}
          <div className="flex items-center gap-2 justify-center mb-6">
            <Shield className="w-3.5 h-3.5 text-[#94A3B8]" />
            <p className="text-[11px] text-[#94A3B8]">
              Bluetooth data is processed on-device only. Nothing is transmitted
              to any server.
            </p>
          </div>

          {/* Skip link */}
          {!success && (
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-[#94A3B8] text-[13px] font-medium hover:text-[#64748B] transition-colors"
              >
                Skip pairing for now
              </button>
              <p className="text-[11px] text-[#CBD5E1] mt-1">
                You can connect a watch anytime from your profile
              </p>
            </div>
          )}

          {/* Supported devices note */}
          {!success && !isConnecting && (
            <div className="mt-8 pt-6 border-t border-[#F1F5F9]">
              <p className="text-[11px] text-[#94A3B8] text-center mb-3 uppercase tracking-wider font-semibold">
                Compatible devices
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Oraimo Watch",
                  "itel Smart Watch",
                  "Mi Band",
                  "Fitbit",
                  "Samsung Galaxy Watch",
                  "Generic BLE HR Monitor",
                ].map((brand) => (
                  <span
                    key={brand}
                    className="px-2.5 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[11px] text-[#64748B]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#CBD5E1] text-center mt-3">
                Requires Chrome or Edge on Android or Desktop. iOS not
                supported.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}