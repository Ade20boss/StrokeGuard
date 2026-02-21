export function SOSButton() {
  return (
    <button
      className="fixed left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#EF4444] flex items-center justify-center z-50"
      style={{ 
        bottom: '80px',
        boxShadow: '0 4px 16px rgba(239,68,68,0.35)'
      }}
      aria-label="Emergency SOS"
    >
      <span 
        className="text-white font-bold text-[13px]"
        style={{ fontFamily: 'Space Mono, monospace' }}
      >
        SOS
      </span>
    </button>
  );
}
