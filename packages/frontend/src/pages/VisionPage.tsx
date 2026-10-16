import { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';

interface Stream {
  id: string;
  title: string;
  category: string;
  viewer_count: number;
  total_tips: number;
  host_name: string;
  host_color: string;
}

interface Space {
  id: string;
  title: string;
  topic?: string;
  listener_count: number;
  speaker_count: number;
  host_name: string;
}

interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  kind: string;
  image_url?: string;
  seller_name: string;
}

interface BigEvent {
  id: string;
  title: string;
  description?: string;
  starts_at: string;
  kind: string;
  going_count: number;
  rsvpd: boolean;
  creator_name: string;
}

interface Clip {
  id: string;
  title: string;
  media_url: string;
  view_count: number;
  creator_name: string;
  creator_color: string;
}

type Tab = 'live' | 'spaces' | 'market' | 'events' | 'clips';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const json = (b: unknown) => ({ ...auth(), 'Content-Type': 'application/json' });

/**
 * VisionPage — Live streaming, Audio Spaces, Marketplace, Events, Clips.
 * The features that make Big Face like no other app.
 */
export default function VisionPage() {
  const [tab, setTab] = useState<Tab>('live');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [events, setEvents] = useState<BigEvent[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const [s, sp, m, e, c] = await Promise.all([
        fetch('/api/vision/streams/live', { headers: auth() }).then((x) => x.json()),
        fetch('/api/vision/spaces/live', { headers: auth() }).then((x) => x.json()),
        fetch('/api/vision/marketplace', { headers: auth() }).then((x) => x.json()),
        fetch('/api/vision/events/upcoming', { headers: auth() }).then((x) => x.json()),
        fetch('/api/vision/clips', { headers: auth() }).then((x) => x.json()),
      ]);
      setStreams(s.streams || []);
      setSpaces(sp.spaces || []);
      setListings(m.listings || []);
      setEvents(e.events || []);
      setClips(c.clips || []);
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const goLive = async () => {
    const title = prompt('Stream title:');
    if (!title) return;
    setBusy(true);
    try {
      const res = await fetch('/api/vision/streams/go-live', {
        method: 'POST', headers: json({}), body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setMessage(res.ok ? '🔴 You are LIVE!' : data.error || 'Failed');
      if (res.ok) load();
    } finally {
      setBusy(false);
    }
  };

  const tipStream = async (id: string, hostName: string) => {
    const amount = prompt(`Tip ${hostName} how many tokens? (10-50,000)`);
    if (!amount) return;
    const num = parseInt(amount);
    if (isNaN(num) || num < 10) return;
    try {
      const res = await fetch(`/api/vision/streams/${id}/tip`, {
        method: 'POST', headers: json({}),
        body: JSON.stringify({ amount: num }),
      });
      const data = await res.json();
      setMessage(res.ok ? `💰 Tipped ${num} tokens!` : data.error || 'Tip failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    }
  };

  const startSpace = async () => {
    const title = prompt('Space title:');
    if (!title) return;
    setBusy(true);
    try {
      const res = await fetch('/api/vision/spaces/start', {
        method: 'POST', headers: json({}), body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setMessage(res.ok ? '📡 Space is live!' : data.error || 'Failed');
      if (res.ok) load();
    } finally {
      setBusy(false);
    }
  };

  const buyListing = async (id: string, title: string, price: number) => {
    if (!confirm(`Buy "${title}" for ${price.toLocaleString()} tokens?`)) return;
    try {
      const res = await fetch(`/api/vision/marketplace/${id}/buy`, {
        method: 'POST', headers: auth(),
      });
      const data = await res.json();
      setMessage(res.ok ? `🛍️ You bought "${title}"!` : data.error || 'Purchase failed');
      if (res.ok) load();
    } catch {
      setMessage('Connection failed');
    }
  };

  const createEvent = async () => {
    const title = prompt('Event title:');
    if (!title) return;
    const date = prompt('Date/time (YYYY-MM-DD HH:MM):');
    if (!date) return;
    setBusy(true);
    try {
      const res = await fetch('/api/vision/events/create', {
        method: 'POST', headers: json({}),
        body: JSON.stringify({ title, startsAt: new Date(date).toISOString() }),
      });
      const data = await res.json();
      setMessage(res.ok ? '📅 Event created!' : data.error || 'Failed');
      if (res.ok) load();
    } finally {
      setBusy(false);
    }
  };

  const rsvp = async (id: string) => {
    try {
      await fetch(`/api/vision/events/${id}/rsvp`, { method: 'POST', headers: auth() });
      setMessage('✅ You\'re going!');
      load();
    } catch {
      setMessage('Failed');
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'live', label: '🔴 Live' },
    { key: 'spaces', label: '📡 Spaces' },
    { key: 'market', label: '🏪 Market' },
    { key: 'events', label: '📅 Events' },
    { key: 'clips', label: '🎬 Clips' },
  ];

  return (
    <div className="page section-vision">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="shine-text" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem' }}>
          🌟 Big Face Live
        </h1>
        <p className="form-note">Stream. Talk. Trade. Belong. Like no other app.</p>
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
        {TABS.map((t) => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={tab === t.key ? 'btn' : 'btn btn-ghost'}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'live' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button className="btn btn-block glow-gold" onClick={goLive} disabled={busy} style={{ marginBottom: '1rem' }}>
            🔴 Go Live
          </button>
          {streams.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">Nobody's live. Be the first! 🔴</p>
            </div>
          )}
          {streams.map((s) => (
            <div key={s.id} className="card glow-blue" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{
                  background: '#ff0000', color: 'white', fontSize: '0.7rem',
                  fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 4,
                }}>
                  🔴 LIVE
                </span>
                <span style={{ fontWeight: 800 }}>{s.title}</span>
              </div>
              <p className="form-note">
                <span style={{ color: s.host_color }}>{s.host_name}</span>
                {' • '}👁️ {s.viewer_count} watching
                {' • '}💰 {s.total_tips.toLocaleString()} tipped
              </p>
              <button className="btn" onClick={() => tipStream(s.id, s.host_name)} style={{ marginTop: '0.75rem' }}>
                💰 Tip Tokens
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'spaces' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button className="btn btn-block" onClick={startSpace} disabled={busy} style={{ marginBottom: '1rem' }}>
            📡 Start a Space
          </button>
          {spaces.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No live spaces. Start a conversation! 📡</p>
            </div>
          )}
          {spaces.map((sp) => (
            <div key={sp.id} className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>📡 {sp.title}</h3>
              {sp.topic && <p className="form-note">{sp.topic}</p>}
              <p className="form-note">
                Hosted by {sp.host_name} • {sp.speaker_count} speaking • {sp.listener_count} listening
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'market' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {listings.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', gridColumn: '1/-1' }}>
                <p className="form-note">Marketplace is empty. List something! 🏪</p>
              </div>
            )}
            {listings.map((l) => (
              <div key={l.id} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>
                  {l.kind === 'avatar_gear' ? '👑' : l.kind === 'design' ? '🎨' : l.kind === 'shoutout_slot' ? '📢' : '📦'}
                </div>
                <div style={{ fontWeight: 700, margin: '0.5rem 0' }}>{l.title}</div>
                <div className="form-note" style={{ fontSize: '0.8rem' }}>by {l.seller_name}</div>
                <div style={{ color: 'var(--gold)', fontWeight: 700, margin: '0.5rem 0' }}>
                  🪙 {l.price.toLocaleString()}
                </div>
                <button className="btn btn-sm btn-block" onClick={() => buyListing(l.id, l.title, l.price)}>
                  Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <button className="btn btn-block" onClick={createEvent} disabled={busy} style={{ marginBottom: '1rem' }}>
            📅 Create Event
          </button>
          {events.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No upcoming events. Create one! 📅</p>
            </div>
          )}
          {events.map((e) => (
            <div key={e.id} className="card glow-gold" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>📅 {e.title}</h3>
              {e.description && <p className="form-note">{e.description}</p>}
              <p className="form-note">
                🕐 {new Date(e.starts_at).toLocaleString()}
                {' • '}👥 {e.going_count} going
                {' • '}by {e.creator_name}
              </p>
              {!e.rsvpd && (
                <button className="btn" onClick={() => rsvp(e.id)} style={{ marginTop: '0.75rem' }}>
                  ✅ RSVP
                </button>
              )}
              {e.rsvpd && (
                <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '0.75rem' }}>
                  ✅ You're going!
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'clips' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {clips.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="form-note">No clips yet. Share a highlight! 🎬</p>
            </div>
          )}
          {clips.map((c) => (
            <div key={c.id} className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>🎬 {c.title}</h3>
              <p className="form-note">
                <span style={{ color: c.creator_color }}>{c.creator_name}</span>
                {' • '}👁️ {c.view_count} views
              </p>
              {c.media_url && (
                <div style={{ marginTop: '0.75rem' }}>
                  <a href={c.media_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                    ▶️ Watch
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
