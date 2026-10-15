import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';

const GENDERS = ['female', 'male', 'nonbinary', 'other'];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    gender: 'female',
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
        gender: form.gender,
      });
      navigate('/avatar-studio?onboarding=1', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Signup failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <span className="wordmark">BIG FACE</span>
        <p className="auth-tag">Claim your face. Rule the feed.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="su-display">Display name</label>
            <input id="su-display" className="input" value={form.displayName} onChange={set('displayName')} required maxLength={40} />
          </div>
          <div className="field">
            <label htmlFor="su-username">Username</label>
            <input id="su-username" className="input" value={form.username} onChange={set('username')} required maxLength={24} autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="su-email">Email</label>
            <input id="su-email" type="email" className="input" value={form.email} onChange={set('email')} required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="su-password">Password</label>
            <input id="su-password" type="password" className="input" value={form.password} onChange={set('password')} required minLength={6} autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="su-gender">Gender</label>
            <select id="su-gender" className="select" value={form.gender} onChange={set('gender')}>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g[0].toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-block" type="submit" disabled={busy}>
            {busy ? 'Creating your face…' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have a face? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
