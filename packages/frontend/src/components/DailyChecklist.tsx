import { useEffect, useState } from 'react';
import { engagementApi, type DailyStatus } from '../api/client';

/**
 * DailyChecklist — "Today on Big Face".
 * Shows the daily engagement loop: login bonus, spin, and today's challenge.
 * Lives at the top of the Home page.
 */
export default function DailyChecklist() {
  const [data, setData] = useState<DailyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const d = await engagementApi.daily();
      setData(d);
    } catch {
      setError('Could not load today\u2019s checklist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Refresh when the feed updates (spin completed elsewhere, etc.)
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const claim = async () => {
    setClaiming(true);
    try {
      const r = await engagementApi.claimChallenge();
      if (r.ok) await load();
    } catch {
      setError('Could not claim. Try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p className="form-note">Loading today\u2019s checklist…</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p className="form-note">{error || 'Checklist unavailable.'}</p>
        <button className="btn btn-sm btn-ghost" onClick={load}>Retry</button>
      </div>
    );
  }

  const c = data.challenge;
  const pct = Math.min(100, Math.round((c.progress / Math.max(1, c.target)) * 100));
  const doneCount = [data.login.claimed, !data.spin.canSpin, c.claimed].filter(Boolean).length;

  return (
    <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--gold)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0 }}>📋 Today on Big Face</h3>
        <span className="form-note">{doneCount}/3 done</span>
      </div>

      {/* Login bonus */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '1.3rem' }}>{data.login.claimed ? '✅' : '🔥'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Daily login</div>
          <div className="form-note">
            {data.login.claimed
              ? `Claimed — ${data.login.streak} day streak!`
              : 'Log in tomorrow to grow your streak'}
          </div>
        </div>
        {data.login.streak > 1 && (
          <span style={{ fontWeight: 800, color: 'var(--gold)' }}>{data.login.streak}🔥</span>
        )}
      </div>

      {/* Spin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '1.3rem' }}>{data.spin.canSpin ? '🎡' : '✅'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Daily spin</div>
          <div className="form-note">
            {data.spin.canSpin ? 'Your wheel is ready!' : 'Spun today — come back tomorrow'}
          </div>
        </div>
        {data.spin.canSpin && (
          <button
            className="btn btn-sm"
            onClick={() => window.dispatchEvent(new CustomEvent('bigface:open-spin'))}
          >
            Spin
          </button>
        )}
      </div>

      {/* Daily challenge */}
      <div style={{ padding: '0.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{c.claimed ? '✅' : c.completed ? '🎉' : '🎯'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{c.title}</div>
            <div className="form-note">{c.description} ({c.progress}/{c.target})</div>
          </div>
          {!c.claimed && c.completed && (
            <button className="btn btn-sm" onClick={claim} disabled={claiming}>
              {claiming ? 'Claiming…' : `Claim ${c.tokenReward} 🪙`}
            </button>
          )}
        </div>
        {!c.claimed && (
          <div style={{ marginTop: '0.4rem', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${pct}%`, height: '100%', borderRadius: 3,
                background: c.completed ? 'var(--gold)' : 'var(--blue)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        )}
        {c.claimed && (
          <div className="form-note" style={{ marginTop: '0.3rem' }}>
            Completed! +{c.tokenReward} tokens, +{c.xpReward} XP. New challenge tomorrow.
          </div>
        )}
      </div>
    </div>
  );
}
