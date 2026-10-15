import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PROFILE_PRESETS } from '../types';
import { PROFILE_BACKGROUNDS, backgroundCss } from '../profileBackgrounds';
import Avatar from '../components/Avatar';
import { usePageTitle } from '../hooks/usePageTitle';

const GENDERS = ['female', 'male', 'nonbinary', 'other'];

export default function ProfileEditPage() {
  usePageTitle('Edit Profile');
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [gender, setGender] = useState(user?.gender ?? 'female');
  const [profileColor, setProfileColor] = useState(user?.profileColor ?? '#0066FF');
  const [profileBackground, setProfileBackground] = useState(user?.profileBackground ?? 'default');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { user: updated } = await usersApi.updateMe({
        displayName: displayName.trim(),
        bio: bio.trim(),
        gender,
        profileColor,
        profileBackground,
      });
      setUser(updated);
      navigate(`/u/${updated.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-head">
        <h1 className="page-title">Edit profile</h1>
        <p className="page-sub">Your color shows up everywhere — chats, leaderboard, your avatar.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
          <Avatar displayName={displayName || user.displayName} profileColor={profileColor} size="lg" />
          <div>
            <div style={{ fontWeight: 800 }}>{displayName || user.displayName}</div>
            <div className="form-note">Live preview</div>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="pe-name">Display name</label>
            <input id="pe-name" className="input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={40} />
          </div>
          <div className="field">
            <label htmlFor="pe-bio">Bio</label>
            <textarea id="pe-bio" className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} placeholder="Tell the world who you are…" />
          </div>
          <div className="field">
            <label htmlFor="pe-gender">Gender</label>
            <select id="pe-gender" className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g[0].toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Profile color</label>
            <div className="swatch-row">
              {PROFILE_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch${profileColor.toLowerCase() === c.toLowerCase() ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setProfileColor(c)}
                  aria-label={`Use color ${c}`}
                  title={c}
                />
              ))}
              <input
                type="color"
                className="color-native"
                value={/^#[0-9a-f]{6}$/i.test(profileColor) ? profileColor : '#0066FF'}
                onChange={(e) => setProfileColor(e.target.value)}
                aria-label="Pick a custom color"
                title="Custom color"
              />
            </div>
          </div>
          <div className="field">
            <label>Profile background</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
              {PROFILE_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setProfileBackground(bg.id)}
                  title={bg.name}
                  aria-label={`Use ${bg.name} background`}
                  style={{
                    height: 64,
                    borderRadius: 10,
                    border: profileBackground === bg.id ? '3px solid var(--gold)' : '1px solid var(--border)',
                    background: bg.id === 'default'
                      ? `linear-gradient(135deg, ${profileColor}, #0e1013)`
                      : bg.css,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute', bottom: 2, left: 0, right: 0,
                      fontSize: '0.6rem', fontWeight: 700, textAlign: 'center',
                      color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {bg.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate(`/u/${user.id}`)}>Cancel</button>
            <button type="submit" className="btn" style={{ flex: 1 }} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
