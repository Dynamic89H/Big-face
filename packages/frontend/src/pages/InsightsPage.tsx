import { useEffect, useState } from 'react';
import { usersApi, walletApi } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar, { facePhotoOf } from '../components/Avatar';

interface InsightsData {
  rank: number | null;
  totalUsers: number;
  tokensEarned: number;
  level: number;
  xp: number;
  xpForNext: number;
}

/**
 * Insights — your Big Face analytics dashboard.
 * Track your rank, earnings, activity, and growth.
 */
export default function InsightsPage() {
  usePageTitle('Insights');
  const { user } = useAuth();
  const [data, setData] = useState<InsightsData | null>(null);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const lb = await usersApi.leaderboard(10);
        const entries = lb.entries || [];
        const myRank = entries.findIndex((e: any) => e.user?.id === user?.id) + 1;

        // Fetch real wallet balance for earnings
        let earned = 0;
        try {
          const wallet = await walletApi.get();
          earned = Number(wallet.balance || 0);
        } catch {
          /* wallet offline */
        }

        setLeaders(entries.slice(0, 5));
        setData({
          rank: myRank > 0 ? myRank : null,
          totalUsers: entries.length,
          tokensEarned: earned,
          level: Number(user?.level || 1),
          xp: Number(user?.xp || 0),
          xpForNext: 100 * Number(user?.level || 1),
        });
      } catch {
        /* offline */
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (loading) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem' }}><p>Loading insights…</p></div>;
  }

  const xpPct = data ? Math.min(100, (data.xp / data.xpForNext) * 100) : 0;

  const StatCard = ({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) => (
    <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
      {sub && <div className="form-note" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  );

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 0.3rem' }}>📊 Big Face Insights</h1>
      <p className="form-note" style={{ marginBottom: '1.5rem' }}>
        Your stats, your rank, your money. All in one place.
      </p>

      {/* Key stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem', marginBottom: '1.5rem',
      }}>
        <StatCard icon="🏆" label="Your Rank" value={data?.rank ? `#${data.rank}` : '—'} sub={data?.rank ? 'on the leaderboard' : 'play to rank up'} />
        <StatCard icon="⭐" label="Level" value={String(data?.level || 1)} sub={`${Math.round(xpPct)}% to next`} />
        <StatCard icon="🪙" label="Tokens" value={String(data?.tokensEarned || 0)} sub={`$${((data?.tokensEarned || 0) / 100).toFixed(2)} value`} />
        <StatCard icon="👥" label="Community" value={String(data?.totalUsers || 0)} sub="ranked players" />
      </div>

      {/* XP Progress */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong>⚡ Level Progress</strong>
          <span className="form-note">{data?.xp || 0} / {data?.xpForNext || 100} XP</span>
        </div>
        <div style={{
          height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
        }}>
          <div style={{
            width: `${xpPct}%`, height: '100%',
            background: 'linear-gradient(90deg, #ffd700, #ffaa00)',
            borderRadius: 6, transition: 'width 0.5s ease',
          }} />
        </div>
        <p className="form-note" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
          Level {data?.level} → {Number(data?.level || 1) + 1} pays {(Number(data?.level || 1) + 1) * 50} tokens on level-up
        </p>
      </div>

      {/* Top players */}
      <h3 style={{ marginBottom: '0.8rem' }}>👑 Top Players</h3>
      <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {leaders.map((entry: any, i: number) => {
          const u = entry.user;
          if (!u) return null;
          const isMe = u.id === user?.id;
          return (
            <div
              key={u.id}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.8rem 1rem',
                border: isMe ? '2px solid var(--gold)' : undefined,
                background: isMe ? 'rgba(201,162,39,0.08)' : undefined,
              }}
            >
              <div style={{
                fontSize: '1.3rem', fontWeight: 800, minWidth: 36, textAlign: 'center',
                color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--text-muted)',
              }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </div>
              <Avatar
                displayName={u.displayName || u.username}
                profileColor={u.profileColor || '#0066FF'}
                photoUrl={facePhotoOf(u)}
                size="sm"
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>
                  {u.displayName || u.username}
                  {isMe && <span style={{ color: 'var(--gold)', marginLeft: '0.4rem' }}>← you</span>}
                </div>
                <div className="form-note" style={{ fontSize: '0.78rem' }}>
                  Level {u.level || 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to earn */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>💰 How You Earn</h3>
        <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>📈 Level up</span><strong style={{ color: 'var(--gold)' }}>Level × 50 tokens</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>⚔️ Win a battle</span><strong style={{ color: 'var(--gold)' }}>Pot share</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🎰 Gamble Face win</span><strong style={{ color: 'var(--gold)' }}>Pot minus 10%</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🎁 Receive gifts</span><strong style={{ color: 'var(--gold)' }}>Full amount</strong>
          </div>
          <div className="form-note" style={{ fontSize: '0.78rem', marginTop: '0.4rem' }}>
            100 tokens = $1.00 • 30% platform fee on cashouts
          </div>
        </div>
      </div>
    </div>
  );
}
