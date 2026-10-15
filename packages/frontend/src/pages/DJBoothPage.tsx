import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usersApi, uploadsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

interface ProfileTrack {
  title: string;
  artist: string;
  genre: string;
  url: string;
}

interface WeeklyTrack {
  title: string;
  artist: string;
  genre: string;
  url: string;
  setBy: string | null;
}

function getTrack(user: any): ProfileTrack | null {
  const cfg = (user?.avatarConfig ?? {}) as Record<string, unknown>;
  const t = cfg.profileTrack as ProfileTrack | undefined;
  return t?.url ? t : null;
}

export default function DJBoothPage() {
  usePageTitle('DJ Booth');
  const { user, refreshUser } = useAuth();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('rap');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [weeklyTrack, setWeeklyTrack] = useState<WeeklyTrack | null>(null);
  const [isRoyalty, setIsRoyalty] = useState(false);
  const [settingWeekly, setSettingWeekly] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const track = getTrack(user);

  useEffect(() => {
    (async () => {
      try {
        const [{ track: wt }, legendary] = await Promise.all([
          usersApi.weeklyTrack(),
          usersApi.legendary(),
        ]);
        setWeeklyTrack(wt);
        const me = user?.id;
        setIsRoyalty(!!me && (legendary.king?.id === me || legendary.queen?.id === me));
      } catch {
        /* non-fatal */
      }
    })();
  }, [user?.id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Choose an audio file first.');
      return;
    }
    setUploading(true);
    setError(null);
    setNotice(null);
    try {
      const { url } = await uploadsApi.upload(file);
      const cfg = {
        ...((user?.avatarConfig ?? {}) as Record<string, unknown>),
        profileTrack: { title: title.trim(), artist: artist.trim(), genre, url },
      };
      await usersApi.updateMe({ avatarConfig: cfg });
      await refreshUser();
      setTitle('');
      setArtist('');
      setFile(null);
      setNotice('Your track is live on your profile. 🎶');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const setAsWeeklyTrack = async () => {
    if (!track) return;
    setSettingWeekly(true);
    setError(null);
    try {
      await usersApi.setWeeklyTrack({ title: track.title, artist: track.artist, genre: track.genre, url: track.url });
      setWeeklyTrack({ ...track, setBy: user?.displayName ?? null });
      setNotice('👑 Your track is now the Top Track of the Week for the whole app!');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not set weekly track.');
    } finally {
      setSettingWeekly(false);
    }
  };

  const remove = async () => {
    const cfg = { ...((user?.avatarConfig ?? {}) as Record<string, unknown>) };
    delete cfg.profileTrack;
    await usersApi.updateMe({ avatarConfig: cfg });
    await refreshUser();
    setNotice('Track removed.');
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">🎧 DJ Booth</h1>
        <p className="page-sub">Your profile. Your sound. Upload a rap or R&B track — visitors play it from your page.</p>
      </div>

      {weeklyTrack && (
        <div className="card" style={{ marginBottom: '1.4rem', borderColor: 'var(--gold)', background: 'linear-gradient(135deg, rgba(201,162,39,0.08), transparent)' }}>
          <div className="form-note">👑 TOP TRACK OF THE WEEK{weeklyTrack.setBy ? ` — picked by ${weeklyTrack.setBy}` : ''}</div>
          <h3 style={{ margin: '0.4rem 0' }}>{weeklyTrack.title}</h3>
          <p className="form-note" style={{ margin: '0 0 0.8rem' }}>{weeklyTrack.artist} · {weeklyTrack.genre.toUpperCase()}</p>
          <audio controls src={weeklyTrack.url} style={{ width: '100%' }} />
        </div>
      )}

      {track && (
        <div className="card" style={{ marginBottom: '1.4rem', borderColor: 'var(--gold)' }}>
          <div className="form-note">NOW PLAYING ON YOUR PROFILE</div>
          <h3 style={{ margin: '0.4rem 0' }}>{track.title}</h3>
          <p className="form-note" style={{ margin: '0 0 0.8rem' }}>{track.artist} · {track.genre.toUpperCase()}</p>
          <audio controls src={track.url} style={{ width: '100%' }} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={remove}>
              Remove track
            </button>
            {isRoyalty && (
              <button className="btn btn-sm" onClick={setAsWeeklyTrack} disabled={settingWeekly} style={{ fontWeight: 800 }}>
                {settingWeekly ? 'Setting…' : '👑 Make it Top Track of the Week'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{track ? 'Replace your track' : 'Set your profile track'}</h3>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="dj-title">Track title</label>
            <input id="dj-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={80} placeholder="My hottest verse" />
          </div>
          <div className="field">
            <label htmlFor="dj-artist">Artist</label>
            <input id="dj-artist" className="input" value={artist} onChange={(e) => setArtist(e.target.value)} required maxLength={80} placeholder={user?.displayName ?? 'Artist name'} />
          </div>
          <div className="field">
            <label htmlFor="dj-genre">Genre</label>
            <select id="dj-genre" className="select" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="rap">Rap</option>
              <option value="rnb">R&B</option>
            </select>
          </div>
          <div className="field">
            <label>Audio file</label>
            <input ref={fileRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button type="button" className="btn btn-ghost btn-block" onClick={() => fileRef.current?.click()}>
              {file ? `🎵 ${file.name}` : 'Choose audio file'}
            </button>
          </div>
          {error && <div className="form-error">{error}</div>}
          {notice && <p className="form-note" style={{ color: 'var(--green)' }}>{notice}</p>}
          <button className="btn btn-block" type="submit" disabled={uploading}>
            {uploading ? 'Uploading…' : 'Set profile track'}
          </button>
        </form>
        <p className="form-note" style={{ marginTop: '1rem', marginBottom: 0 }}>
          Only upload music you own or have rights to share.
        </p>
      </div>
    </div>
  );
}
