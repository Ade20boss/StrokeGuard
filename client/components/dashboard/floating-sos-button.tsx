interface FloatingSOSButtonProps {
  onClick?: () => void;
}

export function FloatingSOSButton({ onClick }: FloatingSOSButtonProps) {
  return (
    <button
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 z-50"
      style={{
        backgroundColor: '#EF4444',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.40)',
      }}
      onClick={onClick}
    >
      <span
        className="text-[13px] font-bold text-white"
        style={{ fontFamily: 'Space Mono, monospace' }}
      >
        SOS
      </span>
    </button>
  );
}