interface CarStyle {
  color?: string;
  make?: string;
  body?: string;
  [key: string]: unknown;
}

interface CarVisualProps {
  style: CarStyle;
  customPaint?: string | null;
  customRims?: string | null;
  width?: number;
}

// Realistic SVG car renderer — side profile with detailed body, wheels, rims.
export default function CarVisual({ style, customPaint, customRims, width = 280 }: CarVisualProps) {
  const paint = customPaint || (style.color as string) || '#5a6c7d';
  const body = (style.body as string) || 'sedan';

  // Rim style based on customization.
  const rimFill = customRims?.includes('Gold') ? '#c9a227'
    : customRims?.includes('Platinum') ? '#e8e8e8'
    : customRims?.includes('Blackout') || customRims?.includes('Matte') ? '#1a1a1a'
    : customRims?.includes('Diamond') || customRims?.includes('Chrome') ? '#f0f0f0'
    : '#888';
  const rimSize = customRims?.includes('26') ? 26 : customRims?.includes('24') ? 24 : 22;
  const spinning = customRims?.includes('Spinning');

  // Body shape varies by type.
  const isSUV = body === 'suv';
  const isCoupe = body === 'coupe' || body === 'sportback';

  const bodyHeight = isSUV ? 55 : 45;
  const roofHeight = isSUV ? 35 : 28;

  return (
    <svg width={width} height={width * 0.45} viewBox="0 0 280 126" style={{ display: 'block', margin: '0 auto' }}>
      {/* Shadow */}
      <ellipse cx="140" cy="112" rx="110" ry="8" fill="rgba(0,0,0,0.3)" />

      {/* Body */}
      <path
        d={isSUV
          ? `M20,95 L30,${95 - bodyHeight} L60,${95 - bodyHeight - roofHeight} L180,${95 - bodyHeight - roofHeight} L210,${95 - bodyHeight} L260,${95 - bodyHeight + 10} L260,95 Z`
          : `M20,95 L35,${95 - bodyHeight} L70,${95 - bodyHeight - roofHeight} L150,${95 - bodyHeight - roofHeight} L190,${95 - bodyHeight} L260,${95 - bodyHeight + 15} L260,95 Z`
        }
        fill={paint}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Windows */}
      <path
        d={isSUV
          ? `M65,${95 - bodyHeight - roofHeight + 5} L175,${95 - bodyHeight - roofHeight + 5} L175,${95 - bodyHeight - 5} L65,${95 - bodyHeight - 5} Z`
          : `M75,${95 - bodyHeight - roofHeight + 5} L145,${95 - bodyHeight - roofHeight + 5} L145,${95 - bodyHeight - 5} L75,${95 - bodyHeight - 5} Z`
        }
        fill="rgba(150,200,255,0.4)"
      />

      {/* Headlight */}
      <ellipse cx="250" cy={95 - bodyHeight + 20} rx="8" ry="4" fill="#fffacd" opacity="0.9" />
      {/* Taillight */}
      <ellipse cx="25" cy={95 - bodyHeight + 20} rx="6" ry="4" fill="#ff4444" opacity="0.8" />

      {/* Wheels */}
      {[70, 210].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="95" r={rimSize * 0.9} fill="#1a1a1a" />
          <circle cx={cx} cy="95" r={rimSize * 0.55} fill={rimFill} />
          {/* Spokes */}
          {[0, 60, 120].map((deg) => (
            <line
              key={deg}
              x1={cx} y1="95"
              x2={cx + Math.cos((deg * Math.PI) / 180) * rimSize * 0.5}
              y2={95 + Math.sin((deg * Math.PI) / 180) * rimSize * 0.5}
              stroke={rimFill === '#1a1a1a' ? '#444' : '#333'}
              strokeWidth="2"
              className={spinning ? 'spinning-rim' : undefined}
            />
          ))}
          <circle cx={cx} cy="95" r="4" fill="#666" />
        </g>
      ))}

      {/* Shine */}
      <path
        d={`M40,${95 - bodyHeight + 5} L120,${95 - bodyHeight + 5} L110,${95 - bodyHeight + 15} L35,${95 - bodyHeight + 15} Z`}
        fill="rgba(255,255,255,0.15)"
      />

      <style>{`
        .spinning-rim { animation: spin 1s linear infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}

// Realistic SVG house/mansion renderer.
export function HouseVisual({ style, width = 280 }: { style: Record<string, unknown>; width?: number }) {
  const color = (style.color as string) || '#e8e8e8';
  const type = (style.type as string) || 'house';
  const pool = style.pool as boolean;
  const isMansion = type === 'mansion' || type === 'estate';
  const isModern = (style.style as string) === 'modern' || type === 'modern_mansion';

  return (
    <svg width={width} height={width * 0.55} viewBox="0 0 280 154" style={{ display: 'block', margin: '0 auto' }}>
      {/* Ground */}
      <rect x="0" y="130" width="280" height="24" fill="#2d5a3d" />
      {pool && <rect x="200" y="120" width="60" height="14" rx="7" fill="#4da3ff" opacity="0.8" />}

      {isModern ? (
        <>
          {/* Modern glass mansion */}
          <rect x="60" y="50" width="160" height="80" fill={color} />
          <rect x="70" y="60" width="140" height="25" fill="rgba(150,200,255,0.5)" />
          <rect x="70" y="95" width="60" height="35" fill="rgba(150,200,255,0.3)" />
          <rect x="140" y="95" width="60" height="35" fill="rgba(150,200,255,0.3)" />
          <rect x="50" y="45" width="180" height="8" fill="#333" />
        </>
      ) : (
        <>
          {/* Classic house */}
          <rect x="70" y="70" width="140" height="60" fill={color} />
          <polygon points="60,70 140,30 220,70" fill="#8b4513" />
          <rect x="130" y="95" width="20" height="35" fill="#5a3a1a" />
          <rect x="85" y="85" width="25" height="20" fill="rgba(150,200,255,0.5)" />
          <rect x="170" y="85" width="25" height="20" fill="rgba(150,200,255,0.5)" />
          {isMansion && (
            <>
              <rect x="30" y="85" width="40" height="45" fill={color} opacity="0.9" />
              <rect x="210" y="85" width="40" height="45" fill={color} opacity="0.9" />
              <polygon points="25,85 50,65 75,85" fill="#8b4513" />
              <polygon points="205,85 230,65 255,85" fill="#8b4513" />
            </>
          )}
        </>
      )}

      {/* Gates for mansions */}
      {(style.gates as boolean) && (
        <g stroke="#c9a227" strokeWidth="2">
          <line x1="10" y1="130" x2="10" y2="110" />
          <line x1="270" y1="130" x2="270" y2="110" />
        </g>
      )}
    </svg>
  );
}
