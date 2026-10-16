import { useEffect, useState } from 'react';

interface SpinStatus {
  canSpin: boolean;
  streak: number;
}

/**
 * SpinWheel — daily spin for tokens. Floating button available on every page.
 * Smooth CSS animation, lightweight, no jank.
 */
export default function SpinWheel() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SpinStatus>({ canSpin: true, streak: 0 });
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ prize: number; streak: number } | null>(null);
  const [rotation, setRotation] = useState(0);

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/engagement/spin/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) setStatus(await res.json());
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const spin = async () => {
    if (spinning || !status.canSpin) return;
    setSpinning(true);
    setResult(null);
    // Animate wheel spin (3 full rotations + random offset)
    const targetRotation = rotation + 1080 + Math.random() * 360;
    setRotation(targetRotation);

    try {
      const res = await fetch('/api/engagement/spin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      // Show result after spin animation
      setTimeout(() => {
        setSpinning(false);
        if (res.ok) {
          setResult(data);
          setStatus({ canSpin: false, streak: data.streak });
        }
      }, 2500);
    } catch {
      setSpinning(false);
    }
  };

  return (
    <>
      {/* Floating spin button — every page, every position */}
      <button
        onClick={() => { setOpen(true); loadStatus(); }}
        style={{
          position: 'fixed', bottom: 70, right: 16, zIndex: 950,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
          border: '2px solid rgba(255,255,255,0.3)',
          fontSize: '1.8rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: status.canSpin ? 'scale(1)' : 'scale(0.85)',
          opacity: status.canSpin ? 1 : 0.6,
          transition: 'transform 0.2s, opacity 0.2s',
        }}
        title={status.canSpin ? 'Daily spin available!' : 'Come back tomorrow'}
      >
        🎡
        {status.canSpin && (
          <span style={{
            position: 'absolute', top: -4, right: -4, width: 16, height: 16,
            background: '#ff4444', borderRadius: '50%',
            animation: 'pulse-ring 1.5s ease-out infinite',
          }} />
        )}
      </button>

      {/* Spin modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card glow-gold"
            style={{ padding: '2rem', textAlign: 'center', maxWidth: 340, width: '90%' }}
          >
            <h2 style={{ margin: '0 0 0.5rem' }}>🎡 Daily Spin</h2>
            {status.streak > 0 && (
              <p style={{ color: 'var(--gold)', fontWeight: 700, margin: '0 0 1rem' }}>
                🔥 {status.streak} day streak! +{Math.min(status.streak * 10, 100)}% bonus
              </p>
            )}

            {/* Wheel with prize labels */}
            <div style={{ position: 'relative', width: 240, height: 240, margin: '0 auto 1.5rem' }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'conic-gradient(#ffd700 0deg 45deg, #ff6b35 45deg 90deg, #00e5ff 90deg 135deg, #8b5cf6 135deg 180deg, #22c55e 180deg 225deg, #ff2d78 225deg 270deg, #ffd700 270deg 315deg, #ff6b35 315deg 360deg)',
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 2.5s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none',
                border: '4px solid rgba(255,215,0,0.5)',
                boxShadow: '0 0 30px rgba(255,215,0,0.3)',
              }}>
                {/* Prize labels on each segment */}
                {['50', '100', '250', '500', '1K', '2.5K', '5K', '10K'].map((label, i) => (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: `rotate(${i * 45 + 22.5}deg) translateY(-85px)`,
                      transformOrigin: '0 0',
                      fontSize: '0.7rem', fontWeight: 800, color: '#000',
                      textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div style={{
                position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                fontSize: '1.5rem',
              }}>
                ▼
              </div>
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 40, height: 40, borderRadius: '50%',
                background: '#1a1a2e', border: '2px solid var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>
                💰
              </div>
            </div>

            {result ? (
              <div>
                <div style={{ fontSize: '2.5rem' }}>🎉</div>
                <h3 style={{ color: 'var(--gold)', margin: '0.5rem 0' }}>
                  +{result.prize.toLocaleString()} tokens!
                </h3>
                <p className="form-note">Streak: {result.streak} days</p>
                <button className="btn" onClick={() => setOpen(false)}>Claim</button>
              </div>
            ) : (
              <button
                className="btn btn-block"
                onClick={spin}
                disabled={spinning || !status.canSpin}
                style={{ fontSize: '1.1rem', padding: '0.8rem' }}
              >
                {spinning ? '🌀 Spinning...' : status.canSpin ? 'SPIN!' : 'Come back tomorrow'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
