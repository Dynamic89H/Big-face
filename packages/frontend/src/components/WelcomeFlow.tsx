import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sfx, haptic } from '../utils/sfx';

const STEPS = [
  {
    icon: '🎭',
    title: 'Welcome to Big Face',
    text: 'You just joined the only social app where everything you do earns real tokens.',
  },
  {
    icon: '🪙',
    title: '1,000 Free Tokens',
    text: 'Here\'s 1,000 tokens to start. That\'s $10. Use them to play, tip, shop — it\'s real money.',
  },
  {
    icon: '🎡',
    title: 'Spin Every Day',
    text: 'Hit the 🎡 button for your free daily spin. Win up to 10,000 tokens. Streaks multiply your winnings.',
  },
  {
    icon: '💰',
    title: 'The Vault',
    text: 'Every action feeds the Vault jackpot. Every spin has a 1% chance to win it ALL. Someone wins big every week.',
  },
  {
    icon: '🎖️',
    title: 'Climb the Ranks',
    text: 'Rookie → Grinder → Hustler → Boss → Kingpin → Legend. Higher ranks unlock bigger perks and bigger money.',
  },
];

/**
 * WelcomeFlow — the first 60 seconds that beat every other app.
 * Shows new users the money, the ranks, and gets them hooked.
 */
export default function WelcomeFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const navigate = useNavigate();
  const s = STEPS[step];

  const claimTokens = async () => {
    try {
      const res = await fetch('/api/engagement/welcome-bonus', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('bigface.token')}` },
      });
      if (res.ok) {
        setClaimed(true);
        sfx.coins();
        haptic([30, 30, 60]);
      }
    } catch {
      setClaimed(true); // Don't block onboarding on failure
    }
  };

  const next = () => {
    sfx.click();
    if (step === 1 && !claimed) claimTokens();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      sfx.levelUp();
      onDone();
    }
  };

  const skip = () => {
    onDone();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div className="pattern-glass pattern-elev-3 fx-jackpot-burst" style={{
        maxWidth: 380, width: '100%', padding: '2.5rem 2rem', textAlign: 'center',
        borderRadius: 20,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{s.icon}</div>
        <h2 className="pattern-royal" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
          {s.title}
        </h2>
        <p style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {s.text}
        </p>

        {step === 1 && !claimed && (
          <button
            className="btn btn-block glow-gold"
            onClick={claimTokens}
            style={{ marginBottom: '1rem', fontSize: '1.1rem', padding: '0.9rem' }}
          >
            🪙 Claim 1,000 Tokens
          </button>
        )}
        {step === 1 && claimed && (
          <div className="pattern-gold" style={{ padding: '1rem', marginBottom: '1rem', borderRadius: 12 }}>
            ✅ 1,000 tokens added!
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === step ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        <button className="btn btn-block" onClick={next} style={{ marginBottom: '0.75rem' }}>
          {step === STEPS.length - 1 ? "Let's Go! 🚀" : step === 1 && !claimed ? 'Claim & Continue →' : 'Next →'}
        </button>
        <button className="btn btn-ghost btn-block btn-sm" onClick={skip}>
          Skip
        </button>
      </div>
    </div>
  );
}
