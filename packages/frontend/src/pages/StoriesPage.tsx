import { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';

interface Story {
  id: string;
  mediaUrl: string;
  mediaType: string;
  caption?: string;
  viewCount: number;
  viewed: boolean;
}

interface StoryGroup {
  userId: string;
  displayName: string;
  profileColor: string;
  avatarUrl?: string;
  stories: Story[];
}

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('bigface.token')}` });

/**
 * StoriesPage — 24-hour disappearing stories, Instagram-style.
 * The engagement engine every social app needs.
 */
export default function StoriesPage() {
  const [groups, setGroups] = useState<StoryGroup[]>([]);
  const [viewer, setViewer] = useState<{ group: StoryGroup; index: number } | null>(null);
  const [showPost, setShowPost] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/stories', { headers: auth() });
      const data = await res.json();
      setGroups(data.groups || []);
    } catch {
      /* offline */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openViewer = async (group: StoryGroup, index: number) => {
    setViewer({ group, index });
    // Mark as viewed
    const story = group.stories[index];
    if (!story.viewed) {
      fetch(`/api/stories/${story.id}/view`, { method: 'POST', headers: auth() }).catch(
        () => undefined
      );
    }
  };

  const postStory = async () => {
    if (!mediaUrl.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { ...auth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl, mediaType: 'image', caption }),
      });
      if (res.ok) {
        setShowPost(false);
        setMediaUrl('');
        setCaption('');
        load();
      }
    } finally {
      setBusy(false);
    }
  };

  const current = viewer ? viewer.group.stories[viewer.index] : null;

  return (
    <div className="page section-stories">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h1 className="shine-text" style={{ fontSize: '2rem', margin: 0 }}>📸 Stories</h1>
        <button className="btn" onClick={() => setShowPost(true)}>+ Post</button>
      </div>

      {/* Story circles */}
      <div style={{
        display: 'flex', gap: '1rem', overflowX: 'auto',
        padding: '0.5rem 0 1.5rem', marginBottom: '1rem',
      }}>
        {groups.length === 0 && (
          <p className="form-note">No stories yet. Be the first to post! 📸</p>
        )}
        {groups.map((g) => {
          const hasUnviewed = g.stories.some((s) => !s.viewed);
          return (
            <div
              key={g.userId}
              onClick={() => openViewer(g, 0)}
              style={{ cursor: 'pointer', textAlign: 'center', flexShrink: 0 }}
            >
              <div style={{
                width: 70, height: 70, borderRadius: '50%', padding: 3,
                background: hasUnviewed
                  ? 'linear-gradient(45deg, #ffd700, #ff6b35, #ff2d78)'
                  : 'rgba(255,255,255,0.15)',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: '#1a1a2e', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  <Avatar displayName={g.displayName} profileColor={g.profileColor} size="lg" />
                </div>
              </div>
              <div style={{
                fontSize: '0.75rem', marginTop: '0.25rem', maxWidth: 70,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {g.displayName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Story viewer modal */}
      {viewer && current && (
        <div
          onClick={() => setViewer(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: 400, width: '90%' }}
          >
            {/* Progress bars */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {viewer.group.stories.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= viewer.index ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '0.5rem', color: 'white',
            }}>
              <Avatar
                displayName={viewer.group.displayName}
                profileColor={viewer.group.profileColor}
                size="sm"
              />
              <span style={{ fontWeight: 700 }}>{viewer.group.displayName}</span>
              <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>👁️ {current.viewCount}</span>
            </div>
            {/* Media */}
            <img
              src={current.mediaUrl}
              alt="Story"
              style={{
                width: '100%', borderRadius: 16, maxHeight: '70vh', objectFit: 'contain',
                background: '#111',
              }}
            />
            {current.caption && (
              <p style={{ color: 'white', textAlign: 'center', marginTop: '0.5rem' }}>
                {current.caption}
              </p>
            )}
            {/* Reply */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input
                type="text"
                placeholder="Reply to story..."
                maxLength={280}
                id="story-reply-input"
                style={{
                  flex: 1, padding: '0.7rem 1rem', borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  fontSize: '0.9rem', outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const msg = input.value.trim();
                    if (msg) {
                      fetch(`/api/stories/${current.id}/reply`, {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('bigface.token')}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message: msg }),
                      });
                      input.value = '';
                      input.placeholder = 'Sent! ✓';
                      setTimeout(() => { input.placeholder = 'Reply to story...'; }, 2000);
                    }
                  }
                }}
              />
            </div>
            {/* Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                className="btn btn-ghost"
                disabled={viewer.index === 0}
                onClick={() => setViewer({ ...viewer, index: viewer.index - 1 })}
              >
                ← Prev
              </button>
              <button className="btn btn-ghost" onClick={() => setViewer(null)}>
                ✕ Close
              </button>
              <button
                className="btn btn-ghost"
                disabled={viewer.index === viewer.group.stories.length - 1}
                onClick={() => {
                  const next = viewer.index + 1;
                  setViewer({ ...viewer, index: next });
                  openViewer(viewer.group, next);
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post story modal */}
      {showPost && (
        <div
          onClick={() => setShowPost(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ padding: '1.5rem', maxWidth: 400, width: '90%' }}
          >
            <h3 style={{ margin: '0 0 1rem' }}>📸 New Story</h3>
            <input
              className="input"
              placeholder="Image URL"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            />
            <input
              className="input"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={200}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <p className="form-note" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              Disappears in 24 hours ⏰
            </p>
            <button className="btn btn-block" onClick={postStory} disabled={busy || !mediaUrl.trim()}>
              {busy ? 'Posting...' : 'Post Story'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
