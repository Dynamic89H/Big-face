import { useAuth } from '../auth/AuthContext';

// Celebration modal shown after login when a comeback package was granted
// (7+ days absent => 2,000 tokens + 100 XP + 24h 2x XP boost).
export default function ComebackBanner() {
  const { comeback, clearComeback } = useAuth();
  if (!comeback) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome back"
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '1rem',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      }}
      onClick={clearComeback}
    >
      <div
        className="card"
        style={{
          maxWidth: 340, textAlign: 'center', padding: '2rem 1.5rem',
          borderColor: 'var(--gold)',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.15), var(--card))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '3rem' }}>🎉</div>
        <h2 style={{ margin: '0.5rem 0' }}>Welcome Back!</h2>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>
          +{comeback.tokens.toLocaleString()} tokens · +{comeback.xp} XP
        </p>
        <p className="form-note">
          ⚡ <strong>2x XP boost</strong> active for the next 24 hours!
        </p>
        <button className="btn btn-block" onClick={clearComeback} style={{ marginTop: '1rem' }}>
          Let's Go 🚀
        </button>
      </div>
    </div>
  );
}
