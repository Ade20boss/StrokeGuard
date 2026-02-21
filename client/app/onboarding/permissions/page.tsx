"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Mic, MapPin, Bell, Check } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface Permission {
  id: string;
  icon: any;
  title: string;
  description: string;
  status: 'required' | 'recommended' | 'granted';
}

export default function PermissionsPage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      icon: Camera,
      title: 'Camera',
      description: 'For face symmetry detection. Video stays on your device.',
      status: 'required'
    },
    {
      id: 'microphone',
      icon: Mic,
      title: 'Microphone',
      description: 'To time your speech test.',
      status: 'required'
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location',
      description: 'Shared with contacts during SOS.',
      status: 'required'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'For reminders and incoming alerts.',
      status: 'recommended'
    }
  ]);

  const handleGrantPermissions = async () => {
    try {
      // 1. Request Camera and Microphone
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissions(prev => 
        prev.map(p => (p.id === 'camera' || p.id === 'microphone') ? { ...p, status: 'granted' } : p)
      );

      // 2. Request Location
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setPermissions(prev => 
        prev.map(p => p.id === 'location' ? { ...p, status: 'granted' } : p)
      );

      // 3. Request Notifications
      if ('Notification' in window) {
        const notificationPermission = await Notification.requestPermission();
        if (notificationPermission === 'granted') {
          setPermissions(prev => 
            prev.map(p => p.id === 'notifications' ? { ...p, status: 'granted' } : p)
          );
        }
      }

      // Navigate after all permissions are handled
      setTimeout(() => {
        router.push('/onboarding/setup-complete');
      }, 1000);

    } catch (error) {
      console.error('Error requesting permissions:', error);
      // Optional: Handle denied permissions or just proceed anyway for onboarding
      // We will proceed for now after a short delay even if some are denied
      setTimeout(() => {
        router.push('/onboarding/setup-complete');
      }, 1000);
    }
  };

  const getStatusBadge = (status: Permission['status']) => {
    if (status === 'granted') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-medium">
          <Check className="w-3 h-3" />
          <span>Granted</span>
        </div>
      );
    }
    if (status === 'required') {
      return (
        <div className="px-2 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-xs font-medium">
          Required
        </div>
      );
    }
    return (
      <div className="px-2 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-xs font-medium">
        Recommended
      </div>
    );
  };

  return (
    <div className="min-h-screen flex text-[#0F172A]">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1683348758702-5163a4ec3e81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwaGFuZCUyMGNsaW5pY2FsJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzE2MzI5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Smartphone in hand"
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
              <div className="h-full bg-[#0EA5E9] w-[85%] transition-all duration-300" />
            </div>
            <p className="text-[#64748B] text-[11px] tracking-wider font-mono">
              STEP 6 OF 7
            </p>
          </div>

          <h1 className="text-[26px] font-bold mb-2">
            Enable permissions
          </h1>

          <p className="text-[#64748B] text-[13px] mb-8">
            StrokeGuard needs these to run the FAST Check and send alerts.
          </p>

          {/* Permission Rows */}
          <div className="space-y-0 mb-8">
            {permissions.map((permission, index) => {
              const Icon = permission.icon;
              return (
                <div key={permission.id}>
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#0EA5E9]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold mb-1">
                        {permission.title}
                      </h3>
                      <p className="text-[#64748B] text-[13px]">
                        {permission.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {getStatusBadge(permission.status)}
                    </div>
                  </div>
                  {index < permissions.length - 1 && (
                    <div className="border-b border-[#F1F5F9]" />
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleGrantPermissions}
            className="w-full h-12 bg-[#0EA5E9] text-white rounded-full text-[15px] font-medium hover:bg-[#0EA5E9]/90 transition-colors"
          >
            Grant Permissions
          </button>

          <p className="text-center text-[#9CA3AF] text-[11px] mt-4">
            Adjust anytime in Settings
          </p>
        </div>
      </div>
    </div>
  );
}
