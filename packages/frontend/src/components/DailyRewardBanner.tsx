import { useAuth } from '../auth/AuthContext';

// Celebration banner shown after login when a daily reward was earned.
export default function DailyRewardBanner() {
  const { dailyReward, clearDailyReward } = useAuth();
  if (!dailyReward) return null;

  const { streak, xp } = dailyReward;
  const isWeekly = streak % 7 === 0;

  return (
    <div
      role="dialog"
      aria-label="Daily reward"
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '1rem',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      }}
      onClick={clearDailyReward}
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
        <div style={{ fontSize: '3rem' }}>🔥</div>
        <h2 style={{ margin: '0.5rem 0' }}>Day {streak}!</h2>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)' }}>
          +{xp} XP earned
        </p>
        <p className="form-note">
          {isWeekly
            ? '🎉 Weekly streak bonus: +100 tokens!'
            : streak === 1
              ? 'Come back tomorrow to grow your streak.'
              : `${7 - (streak % 7)} days until your weekly token bonus!`}
        </p>
        <button className="btn btn-block" onClick={clearDailyReward} style={{ marginTop: '1rem' }}>
          Claim 🎁
        </button>
      </div>
    </div>
  );
}
