"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Watch, Smartphone, Bluetooth, Check, Loader2, XCircle, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function SmartwatchPairingPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);

  const connectToWatch = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // filters: [{ services: ['heart_rate'] }] is the standard GATT service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service', 'device_information']
      });

      console.log('Device selected:', device.name);
      setDeviceName(device.name || "Unknown Device");
      
      const server = await device.gatt?.connect();
      console.log('Connected to GATT server');

      // We don't need to do more here for onboarding, just proving we can connect
      // Real monitoring happens in the dashboard/FAST check
      setSuccess(true);
      
      // Auto-redirect after success
      setTimeout(() => {
        router.push("/onboarding/permissions");
      }, 2000);

    } catch (err: any) {
      console.error('Bluetooth connection failed:', err);
      if (err.name === 'NotFoundError') {
        setError("Pairing cancelled or no device found.");
      } else if (err.name === 'SecurityError') {
        setError("Bluetooth access was denied.");
      } else {
        setError("Could not connect to the watch. Ensure it's in pairing mode.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/permissions");
  };

  return (
    <div className="min-h-screen flex text-[#0F172A]">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd3Jpc3QlMjBjbG9zZSUyMHVwJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Smartwatch on wrist"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-20" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-[71%] transition-all duration-300" />
            </div>
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 5 OF 7
            </p>
          </div>

          {/* Heading with Optional badge */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-[26px] font-bold">
              Pair your watch
            </h1>
            <span className="px-2 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-medium">
              Direct Sync
            </span>
          </div>

          {/* Subtext */}
          <p className="text-[#64748B] text-[13px] mb-8">
            Connects directly to your Oraimo, itel, or any BLE watch for real-time vitals tracking.
          </p>

          {/* Connection Visual Illustration */}
          <div className="flex items-center justify-center gap-8 mb-10 py-12 relative">
            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${success ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                <Watch className={`w-10 h-10 ${success ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Watch</span>
            </div>

            <div className="flex-1 flex flex-col items-center pt-2">
              <div className="w-full flex justify-between items-center px-2">
                 <div className={`w-2 h-2 rounded-full transition-all duration-300 ${success ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
                 <div className={`w-2 h-2 rounded-full transition-all duration-300 delay-75 ${success ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
                 <div className={`w-2 h-2 rounded-full transition-all duration-300 delay-150 ${isConnecting ? 'animate-bounce bg-[#0EA5E9]' : success ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
                 <div className={`w-2 h-2 rounded-full transition-all duration-300 delay-200 ${success ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
                 <div className={`w-2 h-2 rounded-full transition-all duration-300 delay-300 ${success ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
              </div>
              <Bluetooth className={`w-5 h-5 mt-4 transition-all ${isConnecting ? 'text-[#0EA5E9] animate-pulse' : success ? 'text-[#10B981]' : 'text-[#CBD5E1]'}`} />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${success ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                <Smartphone className={`w-10 h-10 ${success ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Phone</span>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-4">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 animate-in fade-in slide-in-from-top-4">
              <Check className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Connected Successfully!</p>
                <p className="text-xs">{deviceName} is now synced.</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          {!success && !error && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#0EA5E9] mt-0.5" />
              <p className="text-[13px] text-[#0EA5E9] leading-relaxed">
                Make sure your watch is close by and has <b>Bluetooth enabled</b>. You'll see a device picker after clicking connect.
              </p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={connectToWatch}
            disabled={isConnecting || success}
            className={`w-full h-14 rounded-full text-[15px] font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${
              success
                ? 'bg-[#10B981] text-white'
                : 'bg-[#0F172A] text-white hover:bg-[#0F172A]/90'
            } disabled:opacity-70`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching for heart rate service...
              </>
            ) : success ? (
              <>
                <Check className="w-5 h-5" />
                Watch Paired
              </>
            ) : (
              <>
                <Bluetooth className="w-5 h-5" />
                Connect My Watch
              </>
            )}
          </button>

          {/* Skip Link */}
          {!success && (
            <div className="text-center mt-6">
              <button
                onClick={handleSkip}
                className="text-[#9CA3AF] text-sm font-medium hover:text-[#64748B] transition-colors"
              >
                Skip pairing for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
