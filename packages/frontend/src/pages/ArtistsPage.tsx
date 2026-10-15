import { useEffect, useRef, useState, type FormEvent } from 'react';
import { artistsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import Avatar from '../components/Avatar';

interface Track {
  id: string; title: string; genre: string; audioUrl: string; coverUrl: string | null;
  plays: number; tipsTokens: number; tipCount: number;
  artist: { id: string; artistName: string; displayName: string; profileColor: string };
}

interface Artist {
  id: string; artistName: string; displayName: string; profileColor: string;
  totalTips: number; trackCount: number;
}

export default function ArtistsPage() {
  usePageTitle('Artists');
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tab, setTab] = useState<'tracks' | 'top'>('tracks');
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState('50');
  const [msg, setMsg] = useState<string | null>(null);
  const [showDrop, setShowDrop] = useState(false);
  const [dropTitle, setDropTitle] = useState('');
  const [dropUrl, setDropUrl] = useState('');
  const [dropGenre, setDropGenre] = useState('hip-hop');
  const [becomeName, setBecomeName] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = async () => {
    try {
      const [{ tracks: t }, { artists: a }] = await Promise.all([
        artistsApi.tracks(),
        artistsApi.top(),
      ]);
      setTracks(t);
      setArtists(a);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const play = async (t: Track) => {
    if (playingId === t.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    try {
      await artistsApi.play(t.id);
    } catch {
      /* ignore */
    }
    if (audioRef.current) {
      audioRef.current.src = t.audioUrl;
      audioRef.current.play().catch(() => undefined);
    }
    setPlayingId(t.id);
  };

  const tip = async (t: Track) => {
    const tokens = parseInt(tipAmount, 10);
    if (!tokens || tokens < 10) {
      setMsg('⚠️ Minimum tip is 10 tokens.');
      return;
    }
    try {
      await artistsApi.tip(t.id, tokens);
      setMsg(`🎉 Tipped ${tokens} tokens to ${t.artist.artistName}!`);
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Tip failed.');
    }
  };

  const becomeArtist = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await artistsApi.become(becomeName.trim());
      setMsg('🎤 You\'re an artist now! Drop your first track.');
      setBecomeName('');
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not become artist.');
    }
  };

  const dropTrack = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await artistsApi.dropTrack({ title: dropTitle.trim(), genre: dropGenre, audioUrl: dropUrl.trim() });
      setMsg('🔥 Track dropped! +40 XP');
      setDropTitle(''); setDropUrl(''); setShowDrop(false);
      load();
    } catch (e) {
      setMsg(e instanceof ApiError ? `⚠️ ${e.message}` : 'Could not drop track.');
    }
  };

  if (loading) return <div className="page"><p>Loading the stage…</p></div>;

  return (
    <div className="page">
      <h1>🎤 Artist Spotlight</h1>
      <p className="form-note">Musicians drop heat. Fans tip tokens. Top-tipped artists run the charts.</p>
      {msg && <p className="form-note" style={{ fontWeight: 700 }}>{msg}</p>}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <button className={`btn ${tab === 'tracks' ? '' : 'btn-ghost'}`} onClick={() => setTab('tracks')}>🎵 Tracks</button>
        <button className={`btn ${tab === 'top' ? '' : 'btn-ghost'}`} onClick={() => setTab('top')}>🏆 Top Artists</button>
      </div>

      {tab === 'top' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {artists.length === 0 && <div className="card empty-wrap"><p>No artists yet. Be the first! 🎤</p></div>}
          {artists.map((a, i) => (
            <div key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderColor: i === 0 ? 'var(--gold)' : undefined }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
              <Avatar displayName={a.artistName} profileColor={a.profileColor} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{a.artistName}</div>
                <div className="form-note">{a.trackCount} tracks · 🪙 {a.totalTips.toLocaleString()} tips</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tracks' && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            {!user ? null : (
              <form onSubmit={becomeArtist} style={{ display: 'flex', gap: '0.5rem', marginBottom: showDrop ? '0.8rem' : 0 }}>
                <input className="input" value={becomeName} onChange={(e) => setBecomeName(e.target.value)} placeholder="Your artist name" maxLength={60} style={{ flex: 1 }} />
                <button className="btn btn-sm" type="submit">🎤 Go Artist</button>
              </form>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setShowDrop(!showDrop)}>
              {showDrop ? 'Cancel' : '＋ Drop a track'}
            </button>
            {showDrop && (
              <form onSubmit={dropTrack} style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input className="input" value={dropTitle} onChange={(e) => setDropTitle(e.target.value)} placeholder="Track title" maxLength={100} required />
                <input className="input" value={dropUrl} onChange={(e) => setDropUrl(e.target.value)} placeholder="Audio URL (mp3 link)" required />
                <select className="select" value={dropGenre} onChange={(e) => setDropGenre(e.target.value)}>
                  <option>hip-hop</option><option>r&b</option><option>pop</option><option>afrobeats</option>
                  <option>trap</option><option>drill</option><option>gospel</option><option>other</option>
                </select>
                <button className="btn" type="submit">🔥 Drop it (+40 XP)</button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {tracks.length === 0 && <div className="card empty-wrap"><p>No tracks yet. Drop the first one! 🔥</p></div>}
            {tracks.map((t) => (
              <div key={t.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <button
                    onClick={() => play(t)}
                    style={{
                      width: 48, height: 48, borderRadius: '50%', border: 'none',
                      background: 'var(--gold)', fontSize: '1.3rem', cursor: 'pointer', flexShrink: 0,
                    }}
                    aria-label={playingId === t.id ? 'Pause' : 'Play'}
                  >
                    {playingId === t.id ? '⏸️' : '▶️'}
                  </button>
                  <Avatar displayName={t.artist.artistName} profileColor={t.artist.profileColor} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>{t.title}</div>
                    <div className="form-note">{t.artist.artistName} · {t.genre} · ▶️ {t.plays} · 🪙 {t.tipsTokens.toLocaleString()} tips</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', alignItems: 'center' }}>
                  <input
                    className="input" type="number" min={10} value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)} style={{ width: 80 }} aria-label="Tip amount"
                  />
                  <button className="btn btn-sm" onClick={() => tip(t)} style={{ flex: 1 }}>
                    🪙 Tip Artist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
