import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout } from '../../components/auth-layout';
import { Camera, Mic, MapPin, Bell, Check } from 'lucide-react';

interface Permission {
  id: string;
  icon: typeof Camera;
  title: string;
  description: string;
  status: 'required' | 'recommended';
  granted: boolean;
}

export default function Permissions() {
  const navigate = useNavigate();
  
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      icon: Camera,
      title: 'Camera',
      description: 'For face symmetry test. Video never leaves your device.',
      status: 'required',
      granted: false
    },
    {
      id: 'microphone',
      icon: Mic,
      title: 'Microphone',
      description: 'To time your speech response.',
      status: 'required',
      granted: false
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location',
      description: 'Shared with contacts during SOS only.',
      status: 'required',
      granted: false
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notifications',
      description: 'For reminders and incoming alerts.',
      status: 'recommended',
      granted: false
    }
  ]);

  const handleGrantPermissions = async () => {
    // Simulate permission granting
    setPermissions(permissions.map(p => ({ ...p, granted: true })));
    
    // Wait a moment to show the granted state
    setTimeout(() => {
      navigate('/auth/device');
    }, 500);
  };

  return (
    <AuthLayout currentStep={4} totalSteps={6} showProgress>
      <div className="max-w-md mx-auto">
        <h1 
          className="text-[26px] font-bold text-[#0F172A] mb-2"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Enable permissions.
        </h1>
        
        <p 
          className="text-[13px] text-[#64748B] mb-8"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Required for the health checks and emergency alerts to work.
        </p>
        
        <div className="space-y-0 mb-8">
          {permissions.map((permission, index) => {
            const Icon = permission.icon;
            
            return (
              <div key={permission.id}>
                <div className="flex items-center gap-4 py-4">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-[18px] h-[18px] text-[#0EA5E9]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-[14px] font-semibold text-[#0F172A]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {permission.title}
                    </p>
                    <p 
                      className="text-[12px] text-[#64748B] mt-0.5"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {permission.description}
                    </p>
                  </div>
                  
                  {permission.granted ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ECFDF5] rounded">
                      <Check className="w-[11px] h-[11px] text-[#10B981]" />
                      <span 
                        className="text-[11px] font-semibold text-[#10B981]"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        Granted
                      </span>
                    </div>
                  ) : (
                    <div 
                      className={`px-2.5 py-1 rounded ${
                        permission.status === 'required' 
                          ? 'bg-[#FEF2F2] text-[#EF4444]' 
                          : 'bg-[#FFFBEB] text-[#F59E0B]'
                      }`}
                    >
                      <span 
                        className="text-[11px] font-semibold capitalize"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {permission.status}
                      </span>
                    </div>
                  )}
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
          className="w-full h-[52px] bg-[#0EA5E9] text-white rounded-lg font-semibold text-[16px] hover:bg-[#0284C7] transition-colors"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Grant Permissions
        </button>

        <p 
          className="text-[11px] text-[#94A3B8] text-center mt-4"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Adjust anytime in Settings
        </p>
      </div>
    </AuthLayout>
  );
}