import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usersApi, mediaApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { MediaPost, User, UserStats } from '../types';
import { timeAgo } from '../types';
import Avatar from '../components/Avatar';
import GiftDialog from '../components/GiftDialog';
import ReportDialog from '../components/ReportDialog';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGift, setShowGift] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isMe = id === me?.id;

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [{ user, stats }, { posts }] = await Promise.all([
        usersApi.get(id),
        mediaApi.list(60),
      ]);
      setProfile(user);
      setStats(stats);
      setLikeCount(stats.followersLikes);
      setPosts(posts.filter((p) => p.user.id === id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load this profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleLike = async () => {
    if (!id) return;
    setActionError(null);
    try {
      if (liked) {
        await usersApi.unlike(id);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await usersApi.like(id);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not like this profile.');
    }
  };

  const toggleBlock = async () => {
    if (!id) return;
    setActionError(null);
    try {
      if (blocked) {
        await usersApi.unblock(id);
        setBlocked(false);
      } else {
        await usersApi.block(id);
        setBlocked(true);
      }
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not update block status.');
    }
  };

  const togglePostLike = async (post: MediaPost) => {
    try {
      if (post.likedByMe) {
        await mediaApi.unlike(post.id);
        setPosts((ps) => ps.map((p) => (p.id === post.id ? { ...p, likedByMe: false, likesCount: p.likesCount - 1 } : p)));
      } else {
        await mediaApi.like(post.id);
        setPosts((ps) => ps.map((p) => (p.id === post.id ? { ...p, likedByMe: true, likesCount: p.likesCount + 1 } : p)));
      }
    } catch {
      /* leave the count as-is */
    }
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /><p>Loading profile…</p></div>;
  if (error || !profile) {
    return (
      <div className="error-wrap">
        <p>😕 {error ?? 'This profile could not be found.'}</p>
        <Link className="btn" to="/leaderboard">Back to leaderboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="profile-cover" style={{ background: `linear-gradient(135deg, ${profile.profileColor}, #0e1013)` }} />
        <div className="profile-head">
          <Avatar displayName={profile.displayName} profileColor={profile.profileColor} size="xl" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.7rem' }}>
            <div>
              <h1 className="page-title">{profile.displayName}</h1>
              <p className="page-sub">@{profile.username} · {profile.gender}</p>
            </div>
            <span className="badge badge-gold">👑 Level {profile.level}</span>
          </div>
          {profile.bio && <p style={{ marginTop: '0.7rem', lineHeight: 1.5 }}>{profile.bio}</p>}

          <div className="stat-row">
            <div className="stat"><div className="num">{profile.xp}</div><div className="lbl">XP</div></div>
            <div className="stat"><div className="num">{likeCount}</div><div className="lbl">Likes</div></div>
            <div className="stat"><div className="num">{stats?.mediaCount ?? 0}</div><div className="lbl">Posts</div></div>
            {stats?.rank !== null && stats?.rank !== undefined && (
              <div className="stat"><div className="num">#{stats.rank}</div><div className="lbl">Rank</div></div>
            )}
          </div>

          {!isMe && (
            <div className="profile-actions">
              <button className={`like-btn${liked ? ' liked' : ''}`} onClick={toggleLike} style={{ fontSize: '0.95rem', padding: '0.55rem 1.1rem' }}>
                {liked ? '❤️ Liked' : '🤍 Like'}
              </button>
              <button className="btn btn-sm" onClick={() => setShowGift(true)}>🎁 Send gift</button>
              <button className="btn btn-ghost btn-sm" onClick={toggleBlock}>
                {blocked ? 'Unblock' : '⛔ Block'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowReport(true)}>🚩 Report</button>
            </div>
          )}
          {isMe && (
            <div className="profile-actions">
              <Link className="btn btn-sm" to="/profile/edit">✏️ Edit profile</Link>
            </div>
          )}
          {actionError && <div className="form-error" style={{ marginTop: '0.8rem' }}>{actionError}</div>}

          {(() => {
            const cfg = (profile.avatarConfig ?? {}) as Record<string, unknown>;
            const t = cfg.profileTrack as { title?: string; artist?: string; genre?: string; url?: string } | undefined;
            if (!t?.url) return null;
            return (
              <div className="card" style={{ marginTop: '1rem', borderColor: 'var(--gold)' }}>
                <div className="form-note">🎧 PROFILE TRACK</div>
                <div style={{ fontWeight: 800, margin: '0.3rem 0' }}>{t.title}</div>
                <div className="form-note" style={{ marginBottom: '0.6rem' }}>{t.artist} · {(t.genre ?? '').toUpperCase()}</div>
                <audio controls src={t.url} style={{ width: '100%' }} />
              </div>
            );
          })()}
        </div>
      </div>

      <h2 style={{ margin: '1.6rem 0 0.9rem' }}>Posts</h2>
      {posts.length === 0 ? (
        <div className="card empty-wrap">
          <div className="big">📸</div>
          <p>{isMe ? 'You haven\'t posted anything yet. Share your first moment in the Hall of Fame!' : `${profile.displayName} hasn't posted anything yet.`}</p>
          {isMe && <Link className="btn" to="/hall-of-fame">Post something</Link>}
        </div>
      ) : (
        <div className="media-grid">
          {posts.map((p) => (
            <div key={p.id} className="card media-card">
              {p.kind === 'video' ? (
                <video src={p.url} controls preload="metadata" />
              ) : (
                <img src={p.url} alt={p.caption ?? 'Post'} loading="lazy" />
              )}
              <div className="media-body">
                {p.caption && <p className="caption">{p.caption}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button className={`like-btn${p.likedByMe ? ' liked' : ''}`} onClick={() => togglePostLike(p)}>
                    {p.likedByMe ? '❤️' : '🤍'} {p.likesCount}
                  </button>
                  <span className="form-note">{timeAgo(p.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showGift && (
        <GiftDialog receiverId={profile.id} receiverName={profile.displayName} onClose={() => setShowGift(false)} />
      )}
      {showReport && (
        <ReportDialog targetType="user" targetId={profile.id} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}
