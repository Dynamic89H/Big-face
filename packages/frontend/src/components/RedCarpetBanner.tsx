import { useEffect, useMemo, useState } from 'react';
import { getSocket, type RedCarpetPayload } from '../api/socket';
import { playRoyalChime } from '../utils/chime';

const APPLAUSE = ['👏', '🎉', '👑', '✨', '🌟', '🎊'];

// Full-screen cinematic overlay shown when the weekly red-carpet event fires.
export default function RedCarpetBanner() {
  const [event, setEvent] = useState<RedCarpetPayload | null>(null);

  useEffect(() => {
    const s = getSocket();
    const onCarpet = (p: RedCarpetPayload) => {
      setEvent(p);
      playRoyalChime();
    };
    s.on('red:carpet', onCarpet);
    return () => {
      s.off('red:carpet', onCarpet);
    };
  }, []);

  // A burst of applause emoji rising across the screen.
  const burst = useMemo(() => {
    if (!event) return [];
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      emoji: APPLAUSE[i % APPLAUSE.length],
      left: Math.random() * 100,
      delay: Math.random() * 2.2,
      duration: 3 + Math.random() * 2.5,
      size: 1.4 + Math.random() * 1.6,
    }));
  }, [event]);

  if (!event) return null;

  const { king, queen } = event;

  return (
    <div className="red-carpet-overlay" role="dialog" aria-label="Red carpet announcement">
      {burst.map((b) => (
        <span
          key={b.id}
          className="applause"
          style={{
            left: `${b.left}%`,
            bottom: '-4rem',
            fontSize: `${b.size}rem`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          {b.emoji}
        </span>
      ))}
      <div className="red-carpet-inner">
        <span className="rc-crown">👑</span>
        <h1>
          <span className="starlight">RED CARPET WEEK</span>
        </h1>
        <p className="page-sub" style={{ color: '#d7dce5' }}>
          All hail this week's royalty
        </p>
        <div className="rc-names" style={{ marginTop: '1rem' }}>
          {king && <div>🤴 Face King — <span className="starlight">{king.displayName}</span></div>}
          {queen && (
            <div style={{ marginTop: '0.5rem' }}>
              👸 Face Queen — <span className="starlight">{queen.displayName}</span>
            </div>
          )}
          {!king && !queen && <div>No royalty crowned this week — the throne awaits.</div>}
        </div>
        <button className="btn rc-dismiss" onClick={() => setEvent(null)}>
          Take your seat 👏
        </button>
      </div>
    </div>
  );
}
