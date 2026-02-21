"use client";

import { CheckCircle, Check, Lock, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { finalizeOnboarding } from "@/lib/actions/onboarding";
import { useState } from "react";

export default function SetupCompletePage() {
  const [isFinishing, setIsFinishing] = useState(false);

  const confirmations = [
    'Profile saved',
    'Contacts added',
    'Risk assessment completed',
    'Permissions granted'
  ];

  const handleFinish = async () => {
    setIsFinishing(true);
    await finalizeOnboarding();
  };

  return (
    <div className="min-h-screen flex text-[#0F172A]">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1719448683409-c3b2cb97e57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBoZWFsdGh5JTIwbmF0dXJhbCUyMGxpZ2h0JTIwd2luZG93JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Person in natural light"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Lighter overlay for hopeful feel */}
        <div className="absolute inset-0 bg-[#0EA5E9] opacity-15" />
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Progress bar - 100% */}
          <div className="mb-12">
            <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#0EA5E9] w-full transition-all duration-300" />
            </div>
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 7 OF 7
            </p>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-14 h-14 text-[#10B981]" />
          </div>

          {/* Heading */}
          <h1 className="text-[32px] font-bold text-center mb-4">
            You are all set
          </h1>

          {/* Subtext */}
          <p className="text-[#64748B] text-[15px] text-center mb-10">
            Your Stroke Awareness Score is ready. StrokeGuard is watching out for you.
          </p>

          {/* Confirmation List */}
          <div className="space-y-3 mb-10">
            {confirmations.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#10B981]" />
                </div>
                <span className="text-[#374151] text-[13px]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors mb-4 flex items-center justify-center disabled:opacity-70"
          >
            {isFinishing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Go to my Dashboard"
            )}
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-[11px]">
            <Lock className="w-3 h-3" />
            <p>
              Your data is processed on-device and never sold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
