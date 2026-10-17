import { useEffect, useState } from 'react';

interface WatchParty {
  id: string;
  title: string;
  media_url: string;
  media_type: string;
  status: string;
  host_name: string;
  member_count: number;
}

interface Heist {
  id: string;
  target_name: string;
  target_value: number;
  required_members: number;
  member_count: number;
  status: string;
  progress: number;
}

interface CreatorFund {
  week: { total_pool: number; distributed: boolean };
  topCreators: { display_name: string; profile_color: string; points: number }[];
}

type Tab = 'watch' | 'heist' | 'creators' | 'shoutout';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('bigface.token')}` });

/**
 * SocialPage — watch parties, crew heists, creator fund, shoutouts.
 */
export default function SocialPage() {
  const [tab, setTab] = useState<Tab>('watch');
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [heist, setHeist] = useState<Heist | null>(null);
  const [fund, setFund] = useState<CreatorFund | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [shoutoutMsg, setShoutoutMsg] = useState('');

  const load = async () => {
    try {
      const [p, h, f] = await Promise.all([
        fetch('/api/social/watch-parties', { headers: auth() }).then((x) => x.json()),
        fetch('/api/social/heist/active', { headers: auth() }).then((x) => x.json()),
        fetch('/api/social/creator-fund', { headers: auth() }).then((x) => x.json()),
      ]);
      setParties(p.parties || []);
      setHeist(h.heist);
      setFund(f.week ? f : null);
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createParty = async () => {
    const title = prompt('Party name:');
    if (!title) return;
    const url = prompt('Video/music URL:');
    if (!url) return;
    setBusy(true);
    try {
      const res = await fetch('/api/social/watch-party', {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, mediaUrl: url, mediaType: 'video' }),
      });
      const data = await res.json();
      setMessage(res.ok ? '🎬 Watch party created!' : data.error || 'Failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(false);
    }
  };

  const joinParty = async (id: string) => {
    setBusy(true);
    try {
      await fetch(`/api/social/watch-party/${id}/join`, { method: 'POST', headers: auth() });
      setMessage('🎬 Joined the party!');
      load();
    } catch {
      setMessage('Failed to join');
    } finally {
      setBusy(false);
    }
  };

  const startHeist = async () => {
    try {
      const targets = await fetch('/api/social/heist/targets', { headers: auth() }).then((x) =>
        x.json()
      );
      const t = targets.targets[0];
      setBusy(true);
      const res = await fetch('/api/social/heist/start', {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetName: t.name,
          targetValue: t.value,
          requiredMembers: 5,
        }),
      });
      const data = await res.json();
      setMessage(res.ok ? `💰 Heist started: ${t.name}!` : data.error || 'Failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(false);
    }
  };

  const joinHeist = async () => {
    if (!heist) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/social/heist/${heist.id}/join`, {
        method: 'POST',
        headers: auth(),
      });
      const data = await res.json();
      setMessage(res.ok ? `💰 Joined! ${data.members}/${data.required} members` : data.error);
      if (res.ok) load();
    } catch {
      setMessage('Failed to join');
    } finally {
      setBusy(false);
    }
  };

  const contributeHeist = async () => {
    if (!heist) return;
    try {
      const res = await fetch(`/api/social/heist/${heist.id}/contribute`, {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: 10 }),
      });
      const data = await res.json();
      if (data.complete) {
        setMessage(`🎉 HEIST COMPLETE! You got ${data.share.toLocaleString()} tokens!`);
      } else {
        setMessage(`💪 Progress: ${data.progress}%`);
      }
      load();
    } catch {
      setMessage('Failed');
    }
  };

  const sendShoutout = async () => {
    if (!shoutoutMsg.trim()) {
      setMessage('Write your shoutout first!');
      return;
    }
    if (!confirm('Send shoutout for 250 tokens? (visible to everyone for 1 hour)')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/competition/shoutout', {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: shoutoutMsg }),
      });
      const data = await res.json();
      setMessage(res.ok ? '📢 Shoutout is live!' : data.error || 'Failed');
      if (res.ok) setShoutoutMsg('');
    } catch {
      setMessage('Connection failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page section-social">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="shine-text" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem' }}>
          🎉 Social
        </h1>
        <p className="form-note">Watch together. Heist together. Get paid together.</p>
      </div>

      {message && (
        <div className="card" style={{
          marginBottom: '1rem', textAlign: 'center',
          borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)',
        }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {(['watch', 'heist', 'creators', 'shoutout'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'btn' : 'btn btn-ghost'}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'watch' ? '🎬 Watch' : t === 'heist' ? '💰 Heists' : t === 'creators' ? '💎 Creators' : '📢 Shoutout'}
          </button>
        ))}
      </div>

      {tab === 'watch' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button className="btn btn-block" onClick={createParty} disabled={busy} style={{ marginBottom: '1rem' }}>
            🎬 Start a Watch Party
          </button>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {parties.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p className="form-note">No watch parties. Start one! 🎬</p>
              </div>
            )}
            {parties.map((p) => (
              <div key={p.id} className="card glow-blue" style={{ padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>🎬 {p.title}</h3>
                <p className="form-note">
                  Hosted by {p.host_name} • {p.member_count} watching • {p.status}
                </p>
                <button className="btn" onClick={() => joinParty(p.id)} disabled={busy} style={{ marginTop: '0.75rem' }}>
                  Join Party
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'heist' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {!heist ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem' }}>💰</div>
              <h3>No active heist</h3>
              <p className="form-note">Get your crew together and hit a vault!</p>
              <button className="btn glow-gold" onClick={startHeist} disabled={busy} style={{ marginTop: '1rem' }}>
                💰 Plan a Heist
              </button>
            </div>
          ) : (
            <div className="card glow-gold" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>💰</div>
              <h2 style={{ margin: '0.5rem 0' }}>{heist.target_name}</h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 900 }}>
                🪙 {heist.target_value.toLocaleString()}
              </p>
              <p className="form-note">
                {heist.member_count}/{heist.required_members} crew members • {heist.status}
              </p>
              {/* Progress bar */}
              <div style={{
                height: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 10,
                margin: '1rem 0', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${Math.min(heist.progress, 100)}%`,
                  background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
                  transition: 'width 0.5s',
                }} />
              </div>
              <p style={{ fontWeight: 700 }}>{heist.progress}%</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
                {heist.status === 'planning' && (
                  <button className="btn" onClick={joinHeist} disabled={busy}>
                    Join Heist
                  </button>
                )}
                {heist.status === 'active' && (
                  <button className="btn glow-gold" onClick={contributeHeist}>
                    💪 Contribute (+10)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'creators' && fund && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card glow-gold" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>💎</div>
            <h3 style={{ margin: '0.5rem 0' }}>This Week's Creator Fund</h3>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>
              🪙 {fund.week.total_pool.toLocaleString()}
            </div>
            <p className="form-note">Top creators split the pool every Sunday</p>
          </div>
          <h3 style={{ marginBottom: '0.75rem' }}>Top Creators</h3>
          {fund.topCreators.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <p className="form-note">No creators yet this week. Post something! 💎</p>
            </div>
          )}
          {fund.topCreators.map((c, i) => (
            <div key={i} className="card" style={{
              padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)' }}>#{i + 1}</span>
              <span style={{ fontWeight: 700, color: c.profile_color, flex: 1 }}>{c.display_name}</span>
              <span className="form-note">{c.points} pts</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'shoutout' && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className="card glow-gold" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>📢 Buy a Shoutout</h3>
            <p className="form-note" style={{ marginBottom: '1rem' }}>
              Your message shows to everyone online for 1 hour. 250 tokens.
            </p>
            <textarea
              value={shoutoutMsg}
              onChange={(e) => setShoutoutMsg(e.target.value)}
              placeholder="What do you want everyone to see?"
              maxLength={140}
              rows={3}
              className="input"
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <button className="btn btn-block glow-gold" onClick={sendShoutout} disabled={busy}>
              📢 Send Shoutout (250 🪙)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
