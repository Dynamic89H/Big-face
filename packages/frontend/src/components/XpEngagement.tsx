import { useEffect, useState } from 'react';
import { xpApi } from '../api/client';

interface StreakData {
  streak: number;
  best: number;
  lastDate: string | null;
  nextMilestone: number | null;
}

interface Multiplier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  starts_at: string;
  ends_at: string | null;
}

interface Milestone {
  xp: number;
  hit: boolean;
  claimed: boolean;
  progress: number;
}

interface PeriodLeader {
  id: string;
  username: string;
  displayName: string;
  level: number;
  periodXp: number;
  profileColor: string;
}

type Period = 'daily' | 'weekly' | 'monthly';

/**
 * XpEngagement — the XP operation dashboard.
 * Streaks, multipliers, period leaderboards, milestones.
 * Drop this into RanksPage or anywhere XP matters.
 */
export default function XpEngagement() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [multipliers, setMultipliers] = useState<Multiplier[]>([]);
  const [currentMult, setCurrentMult] = useState(1);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [period, setPeriod] = useState<Period>('weekly');
  const [leaders, setLeaders] = useState<PeriodLeader[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [firstWinClaimed, setFirstWinClaimed] = useState(false);

  useEffect(() => {
    xpApi.streak().then(setStreak).catch(() => {});
    xpApi.multipliers().then((d) => {
      setMultipliers(d.active);
      setCurrentMult(d.currentMultiplier);
    }).catch(() => {});
    xpApi.milestones().then((d) => {
      setMilestones(d.milestones);
      setTotalXp(d.xp);
    }).catch(() => {});
    xpApi.firstWin().then((d) => setFirstWinClaimed(d.claimed)).catch(() => {});
  }, []);

  useEffect(() => {
    xpApi.leaderboard(period).then((d) => {
      setLeaders(d.leaders);
      setMyRank(d.myRank);
    }).catch(() => {});
  }, [period]);

  const periodLabel = { daily: 'Today', weekly: 'This Week', monthly: 'This Month' }[period];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Active multiplier banner */}
      {currentMult > 1 && multipliers.length > 0 && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,215,0,0.1))',
          borderColor: '#ff6b00',
          textAlign: 'center',
          padding: '1rem',
        }}>
          <div style={{ fontSize: '1.5rem' }}>⚡</div>
          <div style={{ fontWeight: 800, color: '#ff6b00' }}>
            {multipliers[0].name} — {currentMult}x XP!
          </div>
          <div className="form-note">{multipliers[0].description}</div>
        </div>
      )}

      {/* Streak + First Win row */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}>
          <div style={{ fontSize: '1.8rem' }}>🔥</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {streak?.streak ?? 0}
          </div>
          <div className="form-note">day XP streak</div>
          {streak?.nextMilestone && (
            <div className="form-note" style={{ color: 'var(--gold)' }}>
              {streak.nextMilestone - (streak?.streak ?? 0)} days to bonus!
            </div>
          )}
          {streak && streak.best > 0 && (
            <div className="form-note">Best: {streak.best} days</div>
          )}
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '0.8rem' }}>
          <div style={{ fontSize: '1.8rem' }}>{firstWinClaimed ? '✅' : '🎯'}</div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
            First Win of Day
          </div>
          <div className="form-note">
            {firstWinClaimed ? 'Claimed! +50 XP' : 'Win a solo roll for +50 XP bonus'}
          </div>
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.8rem' }}>🌟 XP Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {milestones.map((m) => (
              <div key={m.xp} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{m.hit ? '🏆' : '🔒'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {m.xp.toLocaleString()} XP
                  </div>
                  <div style={{
                    height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)',
                    overflow: 'hidden', marginTop: 4,
                  }}>
                    <div style={{
                      width: `${Math.round(m.progress * 100)}%`,
                      height: '100%',
                      background: m.hit ? 'var(--gold)' : 'var(--blue)',
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
                <span className="form-note" style={{ fontSize: '0.75rem', minWidth: 40, textAlign: 'right' }}>
                  {Math.round(m.progress * 100)}%
                </span>
              </div>
            ))}
          </div>
          <div className="form-note" style={{ marginTop: '0.6rem', textAlign: 'center' }}>
            Total: {totalXp.toLocaleString()} XP
          </div>
        </div>
      )}

      {/* Period leaderboard */}
      <div className="card" style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.8rem' }}>🏅 {periodLabel} XP Leaders</h3>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`btn btn-sm ${period === p ? '' : 'btn-ghost'}`}
              style={{ flex: 1, textTransform: 'capitalize' }}
            >
              {p}
            </button>
          ))}
        </div>
        {leaders.length === 0 ? (
          <p className="form-note" style={{ textAlign: 'center' }}>
            No XP earned {periodLabel.toLowerCase()} yet. Be the first! 🔥
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {leaders.slice(0, 10).map((l, i) => (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 0.6rem',
                borderRadius: 8,
                background: i === 0 ? 'rgba(255,215,0,0.1)' : i === 1 ? 'rgba(192,192,192,0.08)' : i === 2 ? 'rgba(205,127,50,0.08)' : 'transparent',
                border: i < 3 ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
              }}>
                <span style={{ fontWeight: 800, minWidth: 28, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: l.profileColor || '#0066FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', color: '#fff',
                  }}
                >
                  {(l.displayName || l.username || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {l.displayName || l.username}
                  </div>
                  <div className="form-note" style={{ fontSize: '0.7rem' }}>Lv {l.level}</div>
                </div>
                <div style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '0.85rem' }}>
                  +{l.periodXp.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
        {myRank && (
          <div className="form-note" style={{ marginTop: '0.6rem', textAlign: 'center', color: 'var(--gold)' }}>
            You're #{myRank} {periodLabel.toLowerCase()}! 🔥
          </div>
        )}
      </div>
    </div>
  );
}
