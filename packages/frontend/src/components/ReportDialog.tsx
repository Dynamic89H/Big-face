import { useState } from 'react';
import { reportsApi, ApiError, type ReportTargetType } from '../api/client';

const REASONS = [
  'Spam or scams',
  'Harassment or bullying',
  'Hate speech',
  'Explicit or sexual content',
  'Impersonation',
  'Something else',
];

interface Props {
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
}

export default function ReportDialog({ targetType, targetId, onClose }: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      await reportsApi.report({ targetType, targetId, reason });
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send the report. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Report">
        {done ? (
          <>
            <h3>Report sent</h3>
            <p className="form-note">
              Thanks — our moderators will take a look. We keep reports private.
            </p>
            <button className="btn btn-block" onClick={onClose}>Done</button>
          </>
        ) : (
          <>
            <h3>🚩 Report this {targetType}</h3>
            <div className="field">
              <label htmlFor="report-reason">What's wrong?</label>
              <select
                id="report-reason"
                className="select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-coral" style={{ flex: 1 }} onClick={submit} disabled={sending}>
                {sending ? 'Sending…' : 'Send report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
