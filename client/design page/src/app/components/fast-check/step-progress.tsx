import { Check, X } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  onCancel?: () => void;
}

export function StepProgress({ currentStep, onCancel }: StepProgressProps) {
  const steps = [
    { id: 1, label: 'Face' },
    { id: 2, label: 'Arm' },
    { id: 3, label: 'Speech' },
    { id: 4, label: 'Results' },
  ];

  return (
    <div
      className="w-full flex items-center justify-between"
      style={{
        backgroundColor: '#FFFFFF',
        padding: '20px 32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Step Nodes Container */}
      <div className="flex-1 flex items-center justify-center max-w-[600px] mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Node */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center relative"
                  style={{
                    backgroundColor: isCompleted
                      ? '#10B981'
                      : isActive
                      ? '#0EA5E9'
                      : '#E2E8F0',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(14, 165, 233, 0.25)'
                      : 'none',
                  }}
                >
                  {isCompleted ? (
                    <Check size={18} style={{ color: '#FFFFFF' }} />
                  ) : (
                    <span
                      className="text-base"
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#FFFFFF' : '#94A3B8',
                      }}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <span
                  className="text-xs mt-2"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 500,
                    color: isCompleted
                      ? '#10B981'
                      : isActive
                      ? '#0F172A'
                      : '#94A3B8',
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className="h-0.5 w-24 mx-4"
                  style={{
                    backgroundColor: isCompleted ? '#10B981' : '#E2E8F0',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cancel Button */}
      {currentStep > 0 && onCancel && (
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
        >
          <X size={14} style={{ color: '#94A3B8' }} />
          <span
            className="text-sm"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              color: '#94A3B8',
            }}
          >
            Cancel Check
          </span>
        </button>
      )}
    </div>
  );
}
