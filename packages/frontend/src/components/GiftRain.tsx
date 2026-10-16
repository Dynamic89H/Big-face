import { useEffect, useState } from 'react';
import { getSocket } from '../api/socket';
import { GIFT_EMOJI } from './GiftDialog';
import { sfx } from '../utils/sfx';

interface RainEvent {
  id: number;
  giftKey: string;
  giftLabel: string;
  senderName: string;
  receiverName: string;
}

let rainId = 0;

/**
 * GiftRain — when someone sends a whale gift (1000+ tokens),
 * it RAINS that gift across everyone's screen. Changes the world.
 */
export default function GiftRain() {
  const [rain, setRain] = useState<RainEvent | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handler = (data: Omit<RainEvent, 'id'>) => {
      setRain({ ...data, id: ++rainId });
      sfx.bigWin();
      // Rain lasts 4 seconds
      setTimeout(() => setRain(null), 4000);
    };
    socket.on('gift:rain', handler);
    return () => {
      socket.off('gift:rain', handler);
    };
  }, []);

  if (!rain) return null;

  const emoji = GIFT_EMOJI[rain.giftKey] || '🎁';
  // Generate 20 falling gift emojis at random positions
  const drops = Array.from({ length: 20 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 1.5 + Math.random() * 1.5,
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000, pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Falling gifts */}
      {drops.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: '-60px',
            fontSize: `${d.size}rem`,
            animation: `gift-fall ${d.duration}s linear ${d.delay}s forwards`,
          }}
        >
          {emoji}
        </div>
      ))}
      {/* Announcement banner */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        border: '2px solid var(--gold)', borderRadius: 16,
        padding: '1.5rem 2.5rem', textAlign: 'center',
        animation: 'jackpot-burst 0.6s ease-out',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: '3rem' }}>{emoji}</div>
        <div className="pattern-gold-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          {rain.senderName} sent {rain.giftLabel}!
        </div>
        <div style={{ color: 'var(--text)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          to {rain.receiverName} 🎉
        </div>
      </div>
      <style>{`
        @keyframes gift-fall {
          to { transform: translateY(110vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
