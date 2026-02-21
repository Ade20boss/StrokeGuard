interface ProgressDotsProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressDots({ currentStep, totalSteps = 7 }: ProgressDotsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`size-2 rounded-full transition-all duration-300 ${
              index + 1 === currentStep
                ? 'bg-[#0EA5E9] scale-125'
                : index + 1 < currentStep
                ? 'bg-[#0EA5E9]/50'
                : 'bg-[#1E2D45] border border-[#1E2D45]'
            }`}
          />
        ))}
      </div>
      <p className="text-[11px] tracking-wide text-[#64748B]" style={{ fontFamily: 'var(--font-mono)' }}>
        STEP {currentStep} OF {totalSteps}
      </p>
    </div>
  );
}
