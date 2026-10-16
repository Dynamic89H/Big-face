import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Settings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  inAppSounds: boolean;
  profilePublic: boolean;
  allowDMs: boolean;
  showOnline: boolean;
  language: string;
  reduceMotion: boolean;
  dataSaver: boolean;
}

const DEFAULTS: Settings = {
  pushNotifications: true,
  emailNotifications: true,
  inAppSounds: true,
  profilePublic: true,
  allowDMs: true,
  showOnline: true,
  language: 'en',
  reduceMotion: false,
  dataSaver: false,
};

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'sw', label: '🇰🇪 Kiswahili' },
];

/**
 * SettingsPage — everything a user needs to configure Big Face.
 * Notifications, privacy, display, account.
 */
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [showPw, setShowPw] = useState([false, false, false]);

  const PwField = ({ index, placeholder, value, onChange, autoComplete }: {
    index: number; placeholder: string; value: string;
    onChange: (v: string) => void; autoComplete: string;
  }) => (
    <div style={{ position: 'relative' }}>
      <input
        type={showPw[index] ? 'text' : 'password'}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{ paddingRight: '2.75rem' }}
      />
      <button
        type="button"
        onClick={() => setShowPw((s) => s.map((v, i) => (i === index ? !v : v)))}
        style={{
          position: 'absolute', right: '0.5rem', top: '50%',
          transform: 'translateY(-50%)', background: 'none',
          border: 'none', fontSize: '1.2rem', cursor: 'pointer',
          padding: '0.25rem',
        }}
        aria-label={showPw[index] ? 'Hide password' : 'Show password'}
      >
        {showPw[index] ? '🙈' : '👁️'}
      </button>
    </div>
  );

  const changePassword = async () => {
    setPwMsg(null);
    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwMsg({ ok: false, text: 'Fill in all three fields.' });
      return;
    }
    if (pwNew.length < 6) {
      setPwMsg({ ok: false, text: 'New password must be at least 6 characters.' });
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwMsg({ ok: false, text: "New passwords don't match." });
      return;
    }
    setPwBusy(true);
    try {
      const { authApi } = await import('../api/client');
      await authApi.changePassword(pwCurrent, pwNew);
      setPwMsg({ ok: true, text: '✅ Password changed!' });
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    } catch (e: any) {
      setPwMsg({ ok: false, text: e.message });
    } finally {
      setPwBusy(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bigface.settings');
      if (stored) setSettings({ ...DEFAULTS, ...JSON.parse(stored) });
    } catch {
      /* use defaults */
    }
  }, []);

  const update = (key: keyof Settings, value: boolean | string) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem('bigface.settings', JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ label, desc, value, onChange }: {
    label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
  }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div className="form-note" style={{ fontSize: '0.85rem' }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
          background: value ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 3, left: value ? 25 : 3,
          transition: 'left 0.2s',
        }} />
      </button>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 className="shine-text" style={{ fontSize: '2rem', margin: '0 0 1.5rem', textAlign: 'center' }}>
        ⚙️ Settings
      </h1>

      {saved && (
        <div className="card" style={{
          textAlign: 'center', marginBottom: '1rem',
          borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)',
        }}>
          ✅ Saved
        </div>
      )}

      {/* Notifications */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>🔔 Notifications</h3>
        <Toggle
          label="Push notifications"
          desc="Get notified about wins, messages & events"
          value={settings.pushNotifications}
          onChange={(v) => update('pushNotifications', v)}
        />
        <Toggle
          label="Email notifications"
          desc="Daily summary and important updates"
          value={settings.emailNotifications}
          onChange={(v) => update('emailNotifications', v)}
        />
        <Toggle
          label="In-app sounds"
          desc="Sound effects for wins, messages & actions"
          value={settings.inAppSounds}
          onChange={(v) => update('inAppSounds', v)}
        />
      </div>

      {/* Privacy */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>🔒 Privacy</h3>
        <Toggle
          label="Public profile"
          desc="Anyone can see your profile"
          value={settings.profilePublic}
          onChange={(v) => update('profilePublic', v)}
        />
        <Toggle
          label="Allow DMs"
          desc="Let anyone send you direct messages"
          value={settings.allowDMs}
          onChange={(v) => update('allowDMs', v)}
        />
        <Toggle
          label="Show online status"
          desc="Let others see when you're online"
          value={settings.showOnline}
          onChange={(v) => update('showOnline', v)}
        />
      </div>

      {/* Performance */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>⚡ Performance</h3>
        <p className="form-note" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Speed up Big Face on slower phones or connections
        </p>
        <Toggle
          label="Reduce motion"
          desc="Disables 3D background and animations"
          value={settings.reduceMotion}
          onChange={(v) => update('reduceMotion', v)}
        />
        <Toggle
          label="Data saver"
          desc="Loads fewer images, reduces background updates"
          value={settings.dataSaver}
          onChange={(v) => update('dataSaver', v)}
        />
      </div>

      {/* Language */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem' }}>🌍 Language</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => update('language', l.code)}
              className={settings.language === l.code ? 'btn' : 'btn btn-ghost'}
              style={{ textAlign: 'left' }}
            >
              {l.label}
              {settings.language === l.code && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem' }}>👤 Account</h3>
        <p className="form-note" style={{ marginBottom: '1rem' }}>
          Logged in as <strong>{user?.displayName || user?.username}</strong>
        </p>

        {/* Change password */}
        <h4 style={{ margin: '0 0 0.75rem' }}>🔑 Change Password</h4>
        {pwMsg && (
          <div className="card" style={{
            marginBottom: '0.75rem', padding: '0.75rem', textAlign: 'center',
            borderColor: pwMsg.ok ? 'var(--gold)' : '#cc0000',
            background: pwMsg.ok ? 'rgba(201,162,39,0.1)' : 'rgba(204,0,0,0.1)',
          }}>
            {pwMsg.text}
          </div>
        )}
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
          <PwField index={0} placeholder="Current password" value={pwCurrent}
            onChange={setPwCurrent} autoComplete="current-password" />
          <PwField index={1} placeholder="New password (min 6 characters)" value={pwNew}
            onChange={setPwNew} autoComplete="new-password" />
          <PwField index={2} placeholder="Confirm new password" value={pwConfirm}
            onChange={setPwConfirm} autoComplete="new-password" />
          <button className="btn btn-block" onClick={changePassword} disabled={pwBusy}>
            {pwBusy ? 'Changing...' : 'Change Password'}
          </button>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-block" onClick={() => navigate('/profile/edit')}>
            ✏️ Edit Profile
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => navigate('/privacy')}>
            📄 Privacy Policy
          </button>
          <button
            className="btn btn-block"
            style={{ background: '#cc0000', borderColor: '#cc0000' }}
            onClick={() => {
              if (confirm('Log out of Big Face?')) logout();
            }}
          >
            🚪 Log Out
          </button>
        </div>
      </div>

      <p className="form-note" style={{ textAlign: 'center', fontSize: '0.8rem' }}>
        Big Face v1.0 • Made with 💛
      </p>
    </div>
  );
}
