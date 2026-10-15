import { useRef, useState, type FormEvent } from 'react';
import { usersApi, uploadsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';

interface ProfileTrack {
  title: string;
  artist: string;
  genre: string;
  url: string;
}

function getTrack(user: any): ProfileTrack | null {
  const cfg = (user?.avatarConfig ?? {}) as Record<string, unknown>;
  const t = cfg.profileTrack as ProfileTrack | undefined;
  return t?.url ? t : null;
}

export default function DJBoothPage() {
  const { user, refreshUser } = useAuth();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('rap');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const track = getTrack(user);

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

      {track && (
        <div className="card" style={{ marginBottom: '1.4rem', borderColor: 'var(--gold)' }}>
          <div className="form-note">NOW PLAYING ON YOUR PROFILE</div>
          <h3 style={{ margin: '0.4rem 0' }}>{track.title}</h3>
          <p className="form-note" style={{ margin: '0 0 0.8rem' }}>{track.artist} · {track.genre.toUpperCase()}</p>
          <audio controls src={track.url} style={{ width: '100%' }} />
          <button className="btn btn-ghost btn-sm" style={{ marginTop: '0.8rem' }} onClick={remove}>
            Remove track
          </button>
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
