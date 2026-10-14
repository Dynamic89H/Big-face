import { useEffect, useState } from 'react';
import { throneApi, giftsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { Gift, ThroneInfo, User } from '../types';
import { timeAgo, xpForLevel } from '../types';
import { GIFT_EMOJI } from '../components/GiftDialog';
import GiftDialog from '../components/GiftDialog';

// CSS throne class per tier (mirrors the contract's tier names).
function throneClass(tier: string): string {
  const t = tier.toLowerCase();
  if (t.includes('legendary')) return 'throne-legendary';
  if (t.includes('golden')) return 'throne-golden';
  if (t === 'throne') return 'throne-throne';
  if (t.includes('seat')) return 'throne-seat';
  return 'throne-rising';
}

export default function ThroneRoomPage() {
  const { user } = useAuth();
  const [info, setInfo] = useState<ThroneInfo | null>(null);
  const [king, setKing] = useState<User | null>(null);
  const [received, setReceived] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTribute, setShowTribute] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [throne, legendary, { gifts }] = await Promise.all([
        throneApi.me(),
        throneApi.legendary(),
        giftsApi.received(),
      ]);
      setInfo(throne);
      setKing(legendary.king);
      setReceived(gifts.slice(0, 10));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load the throne room.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const progress = (() => {
    if (!info) return 0;
    const floor = xpForLevel(info.level);
    const ceil = xpForLevel(info.level + 1);
    if (ceil <= floor) return 100;
    return Math.min(100, Math.max(0, ((info.xp - floor) / (ceil - floor)) * 100));
  })();

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Throne Room</h1>
        <p className="page-sub">Your seat grows grander with every level. Keep earning XP.</p>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Approaching the throne…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && info && (
        <>
          <div className="card throne-stage">
            <div className={`throne ${throneClass(info.tier)}`}>
              <div className="t-glow" />
              <div className="t-back" />
              <div className="t-seat" />
              <div className="t-base" />
              {info.tier.toLowerCase().includes('golden') || info.tier.toLowerCase().includes('legendary') ? (
                <div className="t-crown">👑</div>
              ) : null}
            </div>
            <span className="badge badge-gold" style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
              👑 {info.tier}
            </span>
            <h2 style={{ margin: '0.8rem 0 0.2rem' }}>
              {user?.displayName} · Level {info.level}
            </h2>
            <p className="form-note" style={{ margin: '0 0 1rem' }}>
              Rank #{info.rank} · {info.xp} XP total
            </p>
            <div style={{ width: '100%', maxWidth: 420 }}>
              <div className="xp-bar">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="form-note" style={{ marginTop: '0.5rem' }}>
                {info.xpForNext > 0
                  ? `${info.xpForNext} XP to Level ${info.level + 1}`
                  : 'Max level — legendary status achieved.'}
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.2rem' }}>
            <div className="card">
              <h3>🙏 Pay tribute</h3>
              <p className="form-note">
                {king
                  ? `Send a gift to this week's Face King, ${king.displayName}, and earn their favor (+2 XP per gift sent).`
                  : 'No Face King crowned this week yet — check back after the red carpet.'}
              </p>
              <button className="btn" disabled={!king} onClick={() => setShowTribute(true)}>
                Send tribute
              </button>
            </div>
            <div className="card">
              <h3>🎁 Recent gifts received</h3>
              {received.length === 0 ? (
                <p className="form-note">No gifts yet. Gifts from admirers show up here — each one is +10 XP.</p>
              ) : (
                received.map((g) => (
                  <div key={g.id} className="tx-row">
                    <span>
                      <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{GIFT_EMOJI[g.giftKey] ?? '🎁'}</span>
                      {g.sender?.displayName ?? 'Someone'}
                      {g.message && <span className="form-note"> — “{g.message}”</span>}
                    </span>
                    <span className="form-note">{timeAgo(g.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {showTribute && king && (
        <GiftDialog
          receiverId={king.id}
          receiverName={king.displayName}
          onClose={() => setShowTribute(false)}
          onSent={() => load()}
        />
      )}
    </div>
  );
}
