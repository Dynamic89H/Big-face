import { useId } from 'react';
import type { AvatarItem } from '../types';

interface Props {
  equipped: Record<string, AvatarItem>;
  facePhotoUrl?: string | null;
  displayName?: string;
  profileColor?: string;
  size?: number;
}

function styleOf(item?: AvatarItem): Record<string, any> {
  if (!item?.style) return {};
  try {
    return typeof item.style === 'string' ? JSON.parse(item.style) : item.style;
  } catch {
    return {};
  }
}

const METALS: Record<string, string> = {
  gold: '#d4af37',
  platinum: '#e5e4e2',
  silver: '#c0c0c0',
  steel: '#8a8f98',
};

function metalColor(metal?: string): string {
  return METALS[(metal ?? 'steel').toLowerCase()] ?? '#8a8f98';
}

/** Full-body SVG character that renders equipped avatar items visually. */
export default function CharacterAvatar({ equipped, facePhotoUrl, displayName, profileColor, size = 280 }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clipId = `bf-face-clip-${uid}`;
  const hair = styleOf(equipped['hair']);
  const top = styleOf(equipped['top']);
  const bottom = styleOf(equipped['bottom']);
  const shoes = styleOf(equipped['shoes']);
  const chain = styleOf(equipped['chain']);
  const ring = styleOf(equipped['ring']);
  const earring = styleOf(equipped['earring']);
  const grill = styleOf(equipped['grill']);

  const topColor = top.color ?? '#2a2d34';
  const bottomColor = bottom.color ?? '#23262e';
  const shoeColor = shoes.color ?? '#f5f5f5';
  const hairColor = hair.color ?? '#1a1a1a';
  const chainMetal = metalColor(chain.metal);
  const shimmer = chain.shimmer || top.shimmer || shoes.shimmer;

  const initials = (displayName ?? '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <svg
      viewBox="0 0 200 400"
      width={size}
      height={size * 2}
      role="img"
      aria-label={`${displayName ?? 'User'}'s character`}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <linearGradient id="bf-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6e27a" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa8a2e" />
        </linearGradient>
        <linearGradient id="bf-iced" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cfe8ff" />
          <stop offset="100%" stopColor="#8fb8dd" />
        </linearGradient>
        {shimmer && (
          <filter id="bf-shimmer" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* ===== LEGS / BOTTOMS ===== */}
      <rect x="72" y="225" width="24" height="105" rx="8" fill={bottomColor} />
      <rect x="104" y="225" width="24" height="105" rx="8" fill={bottomColor} />

      {/* ===== SHOES ===== */}
      <g filter={shoes.shimmer ? 'url(#bf-shimmer)' : undefined}>
        <ellipse cx="82" cy="348" rx="20" ry="12" fill={shoeColor} stroke="#00000033" strokeWidth="1" />
        <ellipse cx="118" cy="348" rx="20" ry="12" fill={shoeColor} stroke="#00000033" strokeWidth="1" />
        {/* sole */}
        <ellipse cx="82" cy="356" rx="20" ry="5" fill="#1a1a1a" opacity="0.85" />
        <ellipse cx="118" cy="356" rx="20" ry="5" fill="#1a1a1a" opacity="0.85" />
        {/* brand swoosh hint for nike/jordan */}
        {(shoes.brand === 'nike' || shoes.brand === 'jordan') && (
          <g fill="#111" opacity="0.8">
            <path d="M70 344 L92 350 L70 352 Z" />
            <path d="M106 344 L128 350 L106 352 Z" />
          </g>
        )}
        {shoes.iced && (
          <g fill="url(#bf-iced)">
            <circle cx="76" cy="342" r="2.4" />
            <circle cx="88" cy="344" r="2.4" />
            <circle cx="112" cy="342" r="2.4" />
            <circle cx="124" cy="344" r="2.4" />
          </g>
        )}
      </g>

      {/* ===== TORSO / TOP ===== */}
      <g filter={top.shimmer ? 'url(#bf-shimmer)' : undefined}>
        <rect x="62" y="138" width="76" height="95" rx="18" fill={topColor} />
        {/* sleeves */}
        <rect x="44" y="145" width="24" height="60" rx="10" fill={topColor} />
        <rect x="132" y="145" width="24" height="60" rx="10" fill={topColor} />
        {/* arms */}
        <rect x="48" y="200" width="14" height="42" rx="7" fill="#8d5a3b" />
        <rect x="138" y="200" width="14" height="42" rx="7" fill="#8d5a3b" />
        {/* hands */}
        <circle cx="55" cy="248" r="9" fill="#8d5a3b" />
        <circle cx="145" cy="248" r="9" fill="#8d5a3b" />
        {/* ring on left hand */}
        {equipped['ring'] && (
          <circle cx="55" cy="248" r="4.5" fill="none" stroke={metalColor(ring.metal)} strokeWidth="2.5" />
        )}
        {ring.stone === 'diamond' && <circle cx="55" cy="243.5" r="2" fill="url(#bf-iced)" />}
        {ring.stone === 'ruby' && <circle cx="55" cy="243.5" r="2" fill="#c1121f" />}
      </g>

      {/* ===== NECK ===== */}
      <rect x="90" y="118" width="20" height="26" rx="6" fill="#8d5a3b" />

      {/* ===== CHAIN ===== */}
      {equipped['chain'] && (
        <g filter={chain.shimmer ? 'url(#bf-shimmer)' : undefined}>
          <path
            d="M78 138 Q100 172 122 138"
            fill="none"
            stroke={chain.iced ? 'url(#bf-iced)' : chainMetal}
            strokeWidth={chain.metal === 'gold' ? 7 : 5}
            strokeLinecap="round"
          />
          {/* chain links */}
          <g fill={chain.iced ? '#ffffff' : chainMetal} opacity="0.9">
            {[84, 92, 100, 108, 116].map((x, i) => (
              <circle key={i} cx={x} cy={138 + Math.sin((i / 4) * Math.PI) * 26} r="2.6" />
            ))}
          </g>
          {/* medallion */}
          {chain.medallion && (
            <g>
              <circle cx="100" cy="170" r="11" fill="url(#bf-gold)" stroke="#8a6d1f" strokeWidth="1.5" />
              <circle cx="100" cy="170" r="7" fill="none" stroke="#fff8" strokeWidth="1" />
              <text x="100" y="174" textAnchor="middle" fontSize="9" fill="#5c4a12">✦</text>
            </g>
          )}
        </g>
      )}

      {/* ===== HEAD ===== */}
      <circle cx="100" cy="82" r="38" fill="#8d5a3b" />
      {/* ears */}
      <circle cx="63" cy="84" r="7" fill="#8d5a3b" />
      <circle cx="137" cy="84" r="7" fill="#8d5a3b" />
      {/* earring */}
      {equipped['earring'] && (
        <g>
          <circle cx="63" cy="92" r="3.4" fill={earring.stone === 'diamond' ? 'url(#bf-iced)' : metalColor(earring.metal)} />
          {earring.stone === 'diamond' && <circle cx="63" cy="92" r="1.4" fill="#fff" />}
        </g>
      )}

      {/* ===== FACE ===== */}
      {facePhotoUrl ? (
        <clipPath id={clipId}>
          <circle cx="100" cy="82" r="30" />
        </clipPath>
      ) : null}
      {facePhotoUrl ? (
        <image href={facePhotoUrl} x="70" y="52" width="60" height="60" clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <g>
          {/* stylized face */}
          <ellipse cx="88" cy="76" rx="4.5" ry="6" fill="#1a1a1a" />
          <ellipse cx="112" cy="76" rx="4.5" ry="6" fill="#1a1a1a" />
          <ellipse cx="89" cy="75" rx="1.5" ry="2" fill="#fff" />
          <ellipse cx="113" cy="75" rx="1.5" ry="2" fill="#fff" />
          {/* brows */}
          <rect x="80" y="64" width="16" height="3.5" rx="1.75" fill="#1a1a1a" />
          <rect x="104" y="64" width="16" height="3.5" rx="1.75" fill="#1a1a1a" />
          {/* nose */}
          <path d="M100 82 L97 94 L103 94 Z" fill="#7a4c30" />
          {/* mouth / grill */}
          {equipped['grill'] ? (
            <g filter="url(#bf-shimmer)">
              <rect x="86" y="100" width="28" height="10" rx="4" fill={grill.metal === 'platinum' ? '#e5e4e2' : 'url(#bf-gold)'} />
              {[90, 96, 102, 108].map((x) => (
                <line key={x} x1={x} y1="100" x2={x} y2="110" stroke="#00000055" strokeWidth="1" />
              ))}
            </g>
          ) : (
            <path d="M88 102 Q100 110 112 102" fill="none" stroke="#5c3a24" strokeWidth="2.5" strokeLinecap="round" />
          )}
        </g>
      )}
      {/* grill over photo */}
      {facePhotoUrl && equipped['grill'] && (
        <g filter="url(#bf-shimmer)">
          <rect x="86" y="100" width="28" height="10" rx="4" fill={grill.metal === 'platinum' ? '#e5e4e2' : 'url(#bf-gold)'} />
        </g>
      )}

      {/* ===== HAIR ===== */}
      {equipped['hair'] && (
        <g fill={hairColor}>
          {hair.length === 'long' && (
            <g>
              {/* dreads / locs hanging */}
              {[58, 66, 74, 126, 134, 142].map((x, i) => (
                <rect key={i} x={x} y="60" width="7" height={hair.length === 'long' ? 52 : 30} rx="3.5" />
              ))}
              <ellipse cx="100" cy="52" rx="40" ry="20" />
            </g>
          )}
          {hair.length === 'medium' && (
            <g>
              <ellipse cx="100" cy="52" rx="40" ry="22" />
              {[70, 82, 118, 130].map((x, i) => (
                <circle key={i} cx={x} cy="66" r="8" />
              ))}
            </g>
          )}
          {hair.length === 'short' && <ellipse cx="100" cy="50" rx="38" ry="16" />}
          {hair.shimmer && (
            <ellipse cx="100" cy="48" rx="30" ry="8" fill="url(#bf-iced)" opacity="0.5" />
          )}
        </g>
      )}

      <text x="100" y="395" textAnchor="middle" fontSize="11" fill="#9aa3b2">
        {initials}
      </text>
    </svg>
  );
}
