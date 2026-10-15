import { useState, type FormEvent } from 'react';
import { reportsApi, ApiError } from '../api/client';
import { usePageTitle } from '../hooks/usePageTitle';

const REASONS = [
  { key: 'bullying', label: 'Bullying or harassment' },
  { key: 'sexual', label: 'Sexual content' },
  { key: 'violence', label: 'Violence or threats' },
  { key: 'spam', label: 'Spam or scam' },
  { key: 'other', label: 'Other' },
];

export default function SafetyPage() {
  usePageTitle('Safety Center');
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('bullying');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await reportsApi.safety({ subject, reason, details });
      setDone(true);
      setSubject('');
      setDetails('');
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the report.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">🛡️ Safety Center</h1>
        <p className="page-sub">Protect the vibe. Big Face is for everyone — here's how we keep it that way.</p>
      </div>

      <div className="card" style={{ marginBottom: '1.4rem' }}>
        <h3 style={{ marginTop: 0 }}>The rules</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 2 }}>
          <li><strong>Never</strong> share your address, school, or private details.</li>
          <li><strong>Never</strong> meet someone from the app alone — bring a friend.</li>
          <li><strong>Never</strong> send money or gift cards to someone you met here.</li>
          <li>Younger users: keep a trusted adult in the loop about who you talk to.</li>
          <li>Bullying, sexual content, threats, and scams get accounts removed.</li>
        </ul>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Report a concern</h3>
        <p className="form-note">See something wrong? Tell us. Reports are reviewed by the Big Face team.</p>
        {done && <p className="form-note" style={{ color: 'var(--green)' }}>Report received. Thank you for keeping Big Face safe.</p>}
        {!open ? (
          <button className="btn" onClick={() => { setOpen(true); setDone(false); }}>
            Report a concern
          </button>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="safety-subject">Who or what is this about?</label>
              <input id="safety-subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={120} placeholder="Username or description" />
            </div>
            <div className="field">
              <label htmlFor="safety-reason">Reason</label>
              <select id="safety-reason" className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="safety-details">Details</label>
              <textarea id="safety-details" className="textarea" value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} placeholder="What happened?" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="btn" style={{ flex: 1 }} disabled={sending}>
                {sending ? 'Sending…' : 'Submit report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
