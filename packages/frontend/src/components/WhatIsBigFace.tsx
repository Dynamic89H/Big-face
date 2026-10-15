import { useState } from 'react';

const SLIDES = [
  {
    emoji: '👑',
    title: 'Welcome to Big Face',
    body: 'The social app where YOU get paid. Chat, go live, climb the ranks — and earn real money doing it.',
  },
  {
    emoji: '⚡',
    title: 'Earn XP, Rank Up',
    body: 'Every post, gift, battle, and win earns XP. Level up to unlock bigger rewards and real cash payouts.',
  },
  {
    emoji: '🎲',
    title: 'Gamble Face',
    body: 'Roll dice against real players. Bet tokens, win pots up to $250. Winner takes all.',
  },
  {
    emoji: '🎤',
    title: 'Artist Spotlight',
    body: 'Drop your music, build fans, and get tipped. Your talent pays here.',
  },
  {
    emoji: '🏠',
    title: 'Live the Lifestyle',
    body: 'Buy mansions, exotic whips, and pimp your ride in the custom shop. Flex on your profile.',
  },
  {
    emoji: '💰',
    title: 'Cash Out Real Money',
    body: 'Tokens convert to dollars. Connect your payout account and withdraw your earnings anytime.',
  },
];

export default function WhatIsBigFace({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div className="card" style={{
        maxWidth: 420, width: '100%', textAlign: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '2px solid var(--gold)', padding: '2rem',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{slide.emoji}</div>
        <h2 style={{ margin: '0.5rem 0' }}>{slide.title}</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text)' }}>{slide.body}</p>

        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '1.2rem 0' }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
          {idx > 0 && (
            <button className="btn btn-ghost" onClick={() => setIdx(idx - 1)}>← Back</button>
          )}
          {!isLast ? (
            <button className="btn" onClick={() => setIdx(idx + 1)}>Next →</button>
          ) : (
            <button className="btn" onClick={onClose} style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}>
              👑 Let's Go!
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', marginTop: '1rem', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
