import { useNavigate } from 'react-router';
import { AlertTriangle, X } from 'lucide-react';

export default function SOSScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Large SOS Icon */}
        <div
          className="w-48 h-48 rounded-full mx-auto mb-8 flex items-center justify-center animate-pulse"
          style={{
            backgroundColor: '#FEF2F2',
            border: '8px solid #EF4444',
          }}
        >
          <div className="flex flex-col items-center">
            <AlertTriangle size={64} style={{ color: '#EF4444' }} />
            <span
              className="text-6xl font-bold mt-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#EF4444',
                letterSpacing: '4px',
              }}
            >
              SOS
            </span>
          </div>
        </div>

        {/* Status Message */}
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#0F172A',
          }}
        >
          Emergency Alert Active
        </h1>

        <p
          className="text-lg mb-8"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#64748B',
          }}
        >
          Alerting your emergency contacts...
        </p>

        {/* Status Indicators */}
        <div className="space-y-3 mb-8">
          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#64748B',
              }}
            >
              Dr. Sarah Johnson
            </span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
              }}
            >
              Notified
            </span>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#64748B',
              }}
            >
              Michael Adeyemi
            </span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: '#ECFDF5',
                color: '#10B981',
              }}
            >
              Notified
            </span>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-lg"
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#64748B',
              }}
            >
              Emergency Services
            </span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: '#FFFBEB',
                color: '#F59E0B',
              }}
            >
              Pending
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full h-14 rounded-lg flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#F1F5F9',
            border: '2px solid #E2E8F0',
          }}
        >
          <X size={20} style={{ color: '#64748B' }} />
          <span
            className="text-base font-semibold"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#64748B',
            }}
          >
            Cancel Alert
          </span>
        </button>

        <p
          className="text-xs mt-4"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            color: '#94A3B8',
          }}
        >
          Your location and health data have been shared with emergency contacts
        </p>
      </div>
    </div>
  );
}
