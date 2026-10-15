interface ItemVisualProps {
  slot: string;
  style: Record<string, unknown>;
  name: string;
  size?: number;
}

// Renders a visual preview for avatar studio items.
export default function ItemVisual({ slot, style, name, size = 80 }: ItemVisualProps) {
  const color = (style.color as string) || '#888';
  const metal = (style.metal as string) || '';
  const shimmer = style.shimmer as boolean;
  const iced = style.iced as boolean;

  const metalColor = metal === 'gold' ? '#c9a227' : metal === 'silver' ? '#c0c0c0'
    : metal === 'rosegold' ? '#e8b4a0' : metal === 'steel' ? '#8a8a8a' : color;

  const glow = shimmer ? { filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' } : {};

  const render = () => {
    switch (slot) {
      case 'hair': {
        const length = (style.length as string) || 'medium';
        const h = length === 'long' ? 50 : length === 'medium' ? 35 : 22;
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <circle cx="40" cy="28" r="18" fill="#d4a574" />
            <path d={`M22,28 Q22,${28 - h} 40,${28 - h} Q58,${28 - h} 58,28 L58,${28 + h * 0.6} Q50,${28 + h * 0.3} 46,${28 + h * 0.7} Q42,${28 + h * 0.3} 38,${28 + h * 0.7} Q34,${28 + h * 0.3} 30,${28 + h * 0.6} Q26,${28 + h * 0.3} 22,${28 + h * 0.5} Z`} fill={color} />
            {iced && <circle cx="40" cy="15" r="3" fill="#fff" opacity="0.9" />}
          </svg>
        );
      }
      case 'top': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M25,20 L35,12 L45,12 L55,20 L65,30 L60,45 L55,42 L55,68 L25,68 L25,42 L20,45 L15,30 Z" fill={color} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M35,12 L40,25 L45,12" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            {shimmer && <path d="M30,25 L45,25 L42,35 L28,35 Z" fill="rgba(255,255,255,0.2)" />}
          </svg>
        );
      }
      case 'bottom': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M28,15 L52,15 L55,70 L44,70 L40,35 L36,70 L25,70 Z" fill={color} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <rect x="28" y="15" width="24" height="6" fill="rgba(0,0,0,0.3)" />
          </svg>
        );
      }
      case 'shoes': {
        const brand = (style.brand as string) || '';
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M15,50 Q15,40 25,38 L40,35 Q50,33 55,40 L65,48 Q68,52 65,55 L20,55 Q15,55 15,50 Z" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            <path d="M15,52 L65,52 L63,58 L17,58 Z" fill={brand === 'jordan' ? '#c1121f' : '#333'} opacity="0.6" />
            {brand && <text x="40" y="48" textAnchor="middle" fontSize="8" fill={color === '#ffffff' ? '#333' : '#fff'} fontWeight="bold">{brand === 'jordan' ? 'J' : '✓'}</text>}
            {shimmer && <ellipse cx="40" cy="45" rx="20" ry="4" fill="rgba(255,255,255,0.3)" />}
          </svg>
        );
      }
      case 'chain': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M25,10 Q40,35 55,10" fill="none" stroke={metalColor} strokeWidth="4" />
            {[...Array(8)].map((_, i) => (
              <circle key={i} cx={25 + i * 4.3} cy={10 + Math.sin((i / 7) * Math.PI) * 18} r="2.5" fill={metalColor} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
            ))}
            {(style.medallion || iced) && (
              <g>
                <circle cx="40" cy="32" r="10" fill={metalColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                {iced && [...Array(6)].map((_, i) => (
                  <circle key={i} cx={40 + Math.cos((i / 6) * Math.PI * 2) * 7} cy={32 + Math.sin((i / 6) * Math.PI * 2) * 7} r="1.5" fill="#fff" />
                ))}
              </g>
            )}
          </svg>
        );
      }
      case 'ring': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <circle cx="40" cy="45" r="16" fill="none" stroke={metalColor} strokeWidth="6" />
            <polygon points="40,18 46,28 40,36 34,28" fill={iced ? '#e0f7ff' : metalColor} stroke="#fff" strokeWidth="1" />
            {iced && <polygon points="40,18 43,24 40,28 37,24" fill="#fff" />}
          </svg>
        );
      }
      case 'earring': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <circle cx="40" cy="20" r="4" fill="none" stroke={metalColor} strokeWidth="2" />
            <line x1="40" y1="24" x2="40" y2="40" stroke={metalColor} strokeWidth="2" />
            <circle cx="40" cy="48" r="8" fill={iced ? '#e0f7ff' : metalColor} stroke="#fff" strokeWidth="1" />
            {iced && <circle cx="40" cy="48" r="3" fill="#fff" />}
          </svg>
        );
      }
      case 'grill': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M20,30 Q40,45 60,30 L60,50 Q40,65 20,50 Z" fill={metalColor} opacity="0.9" />
            {[28, 36, 44, 52].map((x) => (
              <line key={x} x1={x} y1="35" x2={x} y2="55" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            ))}
            {iced && [...Array(4)].map((_, i) => (
              <circle key={i} cx={28 + i * 8} cy="42" r="2" fill="#fff" />
            ))}
          </svg>
        );
      }
      case 'hat': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <path d="M25,40 Q25,20 40,20 Q55,20 55,40 L65,40 Q70,40 68,45 L12,45 Q10,40 15,40 Z" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            <rect x="25" y="35" width="30" height="6" fill="rgba(0,0,0,0.3)" />
          </svg>
        );
      }
      case 'watch': {
        return (
          <svg width={size} height={size} viewBox="0 0 80 80" style={glow}>
            <rect x="32" y="10" width="16" height="12" fill="#333" />
            <rect x="32" y="58" width="16" height="12" fill="#333" />
            <circle cx="40" cy="40" r="18" fill={metalColor} stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            <circle cx="40" cy="40" r="13" fill="#111" />
            <line x1="40" y1="40" x2="40" y2="30" stroke="#fff" strokeWidth="2" />
            <line x1="40" y1="40" x2="48" y2="44" stroke="#fff" strokeWidth="2" />
            {iced && [...Array(8)].map((_, i) => (
              <circle key={i} cx={40 + Math.cos((i / 8) * Math.PI * 2) * 15} cy={40 + Math.sin((i / 8) * Math.PI * 2) * 15} r="1.5" fill="#fff" />
            ))}
          </svg>
        );
      }
      default:
        return (
          <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            ✨
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }} title={name}>
      {render()}
    </div>
  );
}
