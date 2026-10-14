import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { mediaApi, uploadsApi, usersApi, ApiError } from '../api/client';
import type { MediaPost, User } from '../types';
import { timeAgo } from '../types';
import Avatar from '../components/Avatar';

export default function HallOfFamePage() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [spotlight, setSpotlight] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ posts }, { user }] = await Promise.all([
        mediaApi.list(40),
        usersApi.colorOfWeek(),
      ]);
      setPosts(posts);
      setSpotlight(user);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load the Hall of Fame.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleLike = async (post: MediaPost) => {
    // Optimistic toggle.
    setPosts((ps) =>
      ps.map((p) =>
        p.id === post.id
          ? { ...p, likedByMe: !p.likedByMe, likesCount: p.likesCount + (p.likedByMe ? -1 : 1) }
          : p,
      ),
    );
    try {
      if (post.likedByMe) await mediaApi.unlike(post.id);
      else await mediaApi.like(post.id);
    } catch {
      // Roll back on failure.
      setPosts((ps) =>
        ps.map((p) => (p.id === post.id ? post : p)),
      );
    }
  };

  const publish = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || uploading) return;
    setUploading(true);
    setUploadError(null);
    try {
      const up = await uploadsApi.upload(file);
      const kind = up.mime.startsWith('video/') ? 'video' : up.mime.startsWith('audio/') ? 'audio' : 'image';
      const { post } = await mediaApi.create({ url: up.url, kind, caption: caption.trim() || undefined });
      setPosts((ps) => [post, ...ps].sort((a, b) => b.likesCount - a.likesCount));
      setFile(null);
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed. Files must be under 25MB.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Hall of Fame</h1>
        <p className="page-sub">The most-loved posts on Big Face. Posting earns +10 XP.</p>
      </div>

      {spotlight && (
        <div className="card spotlight" style={{ marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar displayName={spotlight.displayName} profileColor={spotlight.profileColor} size="lg" />
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '0.3rem' }}>🎨 Color of the Week</div>
            <Link to={`/u/${spotlight.id}`} style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              {spotlight.displayName}
            </Link>
            <p className="form-note" style={{ margin: '0.2rem 0 0' }}>
              @{spotlight.username} is setting the vibe this week.
            </p>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.4rem' }}>
        <h3>📸 Share a moment</h3>
        <form onSubmit={publish}>
          <div className="field">
            <label htmlFor="hof-file">Photo or video</label>
            <input
              id="hof-file"
              ref={fileRef}
              type="file"
              className="input"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="field">
            <label htmlFor="hof-caption">Caption (optional)</label>
            <input
              id="hof-caption"
              className="input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Say something legendary…"
              maxLength={200}
            />
          </div>
          {uploadError && <div className="form-error">{uploadError}</div>}
          <button className="btn" type="submit" disabled={!file || uploading}>
            {uploading ? 'Publishing…' : 'Publish to Hall of Fame'}
          </button>
        </form>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Loading the greats…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div className="card empty-wrap">
          <div className="big">⭐</div>
          <h3>The hall is empty</h3>
          <p>Be the first legend — publish a post above and watch the likes roll in.</p>
        </div>
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="media-grid">
          {posts.map((p, i) => (
            <div key={p.id} className="card media-card">
              {p.kind === 'video' ? (
                <video src={p.url} controls preload="metadata" />
              ) : (
                <img src={p.url} alt={p.caption ?? 'Hall of fame post'} loading="lazy" />
              )}
              <div className="media-body">
                <div className="media-meta">
                  {i < 3 && <span className="badge badge-gold">{['🥇', '🥈', '🥉'][i]}</span>}
                  <Link to={`/u/${p.user.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Avatar displayName={p.user.displayName} profileColor={p.user.profileColor} size="sm" />
                    <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.user.displayName}</span>
                  </Link>
                </div>
                {p.caption && <p className="caption">{p.caption}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className={`like-btn${p.likedByMe ? ' liked' : ''}`} onClick={() => toggleLike(p)}>
                    {p.likedByMe ? '❤️' : '🤍'} {p.likesCount}
                  </button>
                  <span className="form-note">{timeAgo(p.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
