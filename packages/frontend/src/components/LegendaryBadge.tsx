import type { CSSProperties } from 'react';

// Legendary Winner badge — shown next to Face King / Face Queen names.
export default function LegendaryBadge({
  role,
  size = 'md',
}: {
  role: 'king' | 'queen';
  size?: 'sm' | 'md' | 'lg';
}) {
  const label = role === 'king' ? 'Face King' : 'Face Queen';
  const emoji = role === 'king' ? '🤴' : '👸';
  const fontSize = size === 'sm' ? '0.65rem' : size === 'lg' ? '1rem' : '0.8rem';
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize,
    fontWeight: 800,
    padding: '0.15rem 0.5rem',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #c9a227, #f5d76e, #c9a227)',
    color: '#1a1207',
    border: '1px solid #f5d76e',
    boxShadow: '0 0 12px rgba(201,162,39,0.6)',
    whiteSpace: 'nowrap',
  };
  return (
    <span className="legendary-badge" title={`${label} of Big Face`} style={style}>
      {emoji} {label}
    </span>
  );
}
