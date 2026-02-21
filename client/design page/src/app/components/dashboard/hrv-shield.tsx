interface HRVShieldProps {
  state: 'healthy' | 'borderline' | 'at-risk';
}

export function HRVShield({ state }: HRVShieldProps) {
  // Color configurations for each state
  const config = {
    healthy: {
      outerShell: '#059669',
      innerGradient: 'url(#gradient-healthy)',
      crossColor: 'rgba(255,255,255,0.85)',
      glowColor: 'rgba(16,185,129,0.50)',
      glowColorDiffuse: 'rgba(16,185,129,0.25)',
      ring1: 'rgba(16,185,129,0.15)',
      ring2: 'rgba(16,185,129,0.08)',
      innerBorder: 'rgba(255,255,255,0.20)',
      bottomDark: '#065F46',
    },
    borderline: {
      outerShell: '#B45309',
      innerGradient: 'url(#gradient-borderline)',
      crossColor: 'rgba(255,255,255,0.65)',
      glowColor: 'rgba(245,158,11,0.45)',
      glowColorDiffuse: 'rgba(245,158,11,0.20)',
      ring1: 'rgba(245,158,11,0.15)',
      ring2: 'rgba(245,158,11,0.08)',
      innerBorder: 'rgba(255,255,255,0.15)',
      bottomDark: '#D97706',
    },
    'at-risk': {
      outerShell: '#991B1B',
      innerGradient: 'url(#gradient-at-risk)',
      crossColor: 'rgba(255,255,255,0.25)',
      glowColor: 'rgba(239,68,68,0.60)',
      glowColorDiffuse: 'rgba(239,68,68,0.30)',
      ring1: 'rgba(239,68,68,0.20)',
      ring2: 'rgba(239,68,68,0.10)',
      innerBorder: 'rgba(255,255,255,0.10)',
      bottomDark: '#DC2626',
    },
  };

  const colors = config[state];

  return (
    <div className="relative flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{
          filter: `drop-shadow(0 0 12px ${colors.glowColor}) drop-shadow(0 0 ${state === 'at-risk' ? '32px' : '28px'} ${colors.glowColorDiffuse})`,
        }}
      >
        <defs>
          {/* Gradients for each state */}
          <radialGradient id="gradient-healthy" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="55%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
          <radialGradient id="gradient-borderline" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
          <radialGradient id="gradient-at-risk" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="55%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </radialGradient>

          {/* Highlight ellipse filter */}
          <filter id="highlight-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Outer pulse rings */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={colors.ring1}
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="60"
          r="60"
          fill="none"
          stroke={colors.ring2}
          strokeWidth="1"
        />

        {/* Shield group - centered */}
        <g transform="translate(60, 60)">
          {/* Shield outer shell */}
          <path
            d={
              state === 'at-risk'
                ? // Broken shield with missing pieces
                  'M -30,-36 L -20,-36 L -10,-32 L 0,-32 L 10,-32 L 20,-36 L 28,-30 L 30,-20 L 30,0 L 28,20 L 20,32 L 10,38 L 0,44 L -10,38 L -18,32 L -25,22 L -28,10 L -30,0 L -30,-20 Z'
                : // Intact shield
                  'M -30,-36 L -20,-36 L -10,-32 L 0,-32 L 10,-32 L 20,-36 L 30,-36 L 30,-20 L 30,0 L 28,20 L 20,32 L 10,38 L 0,44 L -10,38 L -20,32 L -28,20 L -30,0 L -30,-20 Z'
            }
            fill={colors.outerShell}
          />

          {/* Shield inner face */}
          <path
            d="M -26,-32 L -18,-32 L -8,-28 L 0,-28 L 8,-28 L 18,-32 L 26,-32 L 26,-18 L 26,0 L 24,18 L 18,28 L 10,34 L 0,40 L -10,34 L -18,28 L -24,18 L -26,0 L -26,-18 Z"
            fill={colors.innerGradient}
            stroke={colors.innerBorder}
            strokeWidth="1"
          />

          {/* Top-left highlight ellipse */}
          <ellipse
            cx="-8"
            cy="-12"
            rx="12"
            ry="8"
            fill="rgba(255,255,255,0.30)"
            filter="url(#highlight-blur)"
          />

          {/* Bottom shadow area */}
          <path
            d="M -8,32 L 0,40 L 8,32 L 0,36 Z"
            fill={colors.bottomDark}
            opacity="0.4"
          />

          {/* Cross emblem */}
          <g transform={state === 'borderline' ? 'translate(1, 2)' : 'translate(0, 0)'}>
            {/* Vertical bar */}
            <rect
              x="-2"
              y="-10"
              width="4"
              height="20"
              rx="2"
              fill={colors.crossColor}
            />
            {/* Horizontal bar */}
            <rect
              x="-10"
              y="-2"
              width="20"
              height="4"
              rx="2"
              fill={colors.crossColor}
            />
            
            {/* Crack through cross for at-risk state */}
            {state === 'at-risk' && (
              <line
                x1="-6"
                y1="-6"
                x2="6"
                y2="6"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1"
              />
            )}
          </g>

          {/* CRACKS - Borderline State */}
          {state === 'borderline' && (
            <g>
              {/* Crack 1 - diagonal from upper right */}
              <path
                d="M 18,-20 L 12,-12 L 8,-6 L 6,-2 M 8,-6 L 10,-4"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 18,-20 L 12,-12 L 8,-6 L 6,-2 M 8,-6 L 10,-4"
                stroke="rgba(255,255,255,0.40)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
                transform="translate(0.5, 0.5)"
              />

              {/* Crack 2 - from top center */}
              <path
                d="M 2,-28 L 0,-18 L -2,-12"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 2,-28 L 0,-18 L -2,-12"
                stroke="rgba(255,255,255,0.40)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
                transform="translate(0.5, 0.5)"
              />

              {/* Small debris fragments */}
              <polygon
                points="6,-2 8,-3 7,0"
                fill="rgba(245,158,11,0.40)"
              />
              <polygon
                points="10,-4 12,-5 11,-2"
                fill="rgba(245,158,11,0.40)"
              />
            </g>
          )}

          {/* CRACKS - At Risk State (more extensive) */}
          {state === 'at-risk' && (
            <g>
              {/* Major crack 1 - diagonal bisecting */}
              <path
                d="M 22,-24 L 10,-8 L 0,0 L -8,12 L -16,24"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 22,-24 L 10,-8 L 0,0 L -8,12 L -16,24"
                stroke="rgba(255,255,255,0.40)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                transform="translate(0.8, 0.8)"
              />

              {/* Crack 2 - perpendicular */}
              <path
                d="M 0,-28 L 2,-12 L 6,0 L 12,12 L 16,20"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0,-28 L 2,-12 L 6,0 L 12,12 L 16,20"
                stroke="rgba(255,255,255,0.40)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                transform="translate(0.8, 0.8)"
              />

              {/* Crack 3 - branch from center */}
              <path
                d="M 0,0 L -6,8 L -10,16"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0,0 L -6,8 L -10,16"
                stroke="rgba(255,255,255,0.40)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                transform="translate(0.8, 0.8)"
              />
            </g>
          )}
        </g>

        {/* Scattered fragments for at-risk state */}
        {state === 'at-risk' && (
          <g>
            <polygon
              points="85,35 90,38 88,42"
              fill="rgba(239,68,68,0.30)"
              stroke="rgba(239,68,68,0.60)"
              strokeWidth="0.5"
              transform="rotate(15 87 38)"
            />
            <polygon
              points="32,30 36,32 35,36 31,34"
              fill="rgba(239,68,68,0.30)"
              stroke="rgba(239,68,68,0.60)"
              strokeWidth="0.5"
              transform="rotate(-20 33 33)"
            />
            <polygon
              points="78,70 84,72 82,78"
              fill="rgba(239,68,68,0.30)"
              stroke="rgba(239,68,68,0.60)"
              strokeWidth="0.5"
              transform="rotate(45 80 73)"
            />
            <polygon
              points="38,75 42,77 40,81"
              fill="rgba(239,68,68,0.30)"
              stroke="rgba(239,68,68,0.60)"
              strokeWidth="0.5"
              transform="rotate(-35 40 78)"
            />
            <polygon
              points="88,55 94,58 91,63 87,60"
              fill="rgba(239,68,68,0.30)"
              stroke="rgba(239,68,68,0.60)"
              strokeWidth="0.5"
              transform="rotate(25 90 58)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
