import { useEffect, useState, type FormEvent } from 'react';
import { earningsApi, ApiError } from '../api/client';
import type { EarningsSummary } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';

// 100 tokens = $1.00, minimum payout $10.
const TOKENS_PER_DOLLAR = 100;
const MIN_PAYOUT_USD = 10;

export default function EarningsPage() {
  usePageTitle('Earnings');
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [usd, setUsd] = useState('');
  const [payoutBusy, setPayoutBusy] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutDone, setPayoutDone] = useState(false);

  const [payouts, setPayouts] = useState<Array<{ id: string; amountCents: number; status: string; createdAt: string }>>([]);
  const [autoEnabled, setAutoEnabled] = useState(false);
  const [autoThreshold, setAutoThreshold] = useState('50');
  const [autoBusy, setAutoBusy] = useState(false);
  const [autoMsg, setAutoMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p, a] = await Promise.all([
        earningsApi.summary(),
        earningsApi.payouts().catch(() => ({ payouts: [] })),
        earningsApi.autoPayout().catch(() => ({ autoPayoutEnabled: false, autoPayoutThresholdCents: 5000 })),
      ]);
      setSummary(s);
      setPayouts(p.payouts);
      setAutoEnabled(a.autoPayoutEnabled);
      setAutoThreshold(String(a.autoPayoutThresholdCents / 100));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your earnings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const connect = async () => {
    setConnecting(true);
    setConnectError(null);
    try {
      const { onboardingUrl } = await earningsApi.connect();
      window.open(onboardingUrl, '_blank', 'noopener');
    } catch (e) {
      setConnectError(e instanceof ApiError ? e.message : 'Could not start onboarding. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const usdNum = parseFloat(usd);
  const validUsd = !Number.isNaN(usdNum) && usdNum >= MIN_PAYOUT_USD;
  const tokensNeeded = validUsd ? Math.round(usdNum * TOKENS_PER_DOLLAR) : 0;
  const affordable = summary !== null && tokensNeeded <= summary.tokenBalance;

  const requestPayout = async (e: FormEvent) => {
    e.preventDefault();
    if (!validUsd || !affordable || payoutBusy) return;
    setPayoutBusy(true);
    setPayoutError(null);
    setPayoutDone(false);
    try {
      await earningsApi.payout(Math.round(usdNum * 100));
      setPayoutDone(true);
      setUsd('');
      await load();
    } catch (err) {
      setPayoutError(err instanceof ApiError ? err.message : 'Payout request failed. Please try again.');
    } finally {
      setPayoutBusy(false);
    }
  };

  const toggleAutoPayout = async () => {
    setAutoBusy(true);
    setAutoMsg(null);
    try {
      const thresholdCents = Math.round(parseFloat(autoThreshold || '50') * 100);
      const r = await earningsApi.setAutoPayout(!autoEnabled, thresholdCents);
      setAutoEnabled(r.autoPayoutEnabled);
      setAutoMsg(r.autoPayoutEnabled
        ? `✅ Auto-payout ON — money hits your account automatically every time you reach $${(r.autoPayoutThresholdCents / 100).toFixed(0)}.`
        : 'Auto-payout turned off.');
    } catch (err) {
      setAutoMsg(err instanceof ApiError ? `⚠️ ${err.message}` : 'Could not update auto-payout.');
    } finally {
      setAutoBusy(false);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; label: string }> = {
      paid: { bg: 'var(--green)', label: '✅ Paid' },
      pending: { bg: 'var(--gold)', label: '⏳ Processing' },
      failed: { bg: 'var(--coral)', label: '❌ Failed — tokens refunded' },
    };
    const s = styles[status] ?? { bg: 'var(--text-dim)', label: status };
    return (
      <span style={{
        background: s.bg, color: '#fff', fontWeight: 700, fontSize: '0.75rem',
        padding: '0.2rem 0.6rem', borderRadius: 20, whiteSpace: 'nowrap',
      }}>
        {s.label}
      </span>
    );
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Earnings</h1>
        <p className="page-sub">Turn your tokens into real money. 100 tokens = $1.00.</p>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Counting your coins…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="grid-4" style={{ marginBottom: '1.4rem' }}>
            <div className="card">
              <div className="form-note">Token balance</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>🪙 {summary.tokenBalance}</div>
            </div>
            <div className="card">
              <div className="form-note">Tokens earned</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>✨ {summary.earnedTokens}</div>
            </div>
            <div className="card">
              <div className="form-note">Gifts received</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>🎁 {summary.giftsReceived}</div>
            </div>
            <div className="card">
              <div className="form-note">Total paid out</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900 }}>
                ${(summary.payoutsTotal / 100).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3>💳 Get paid</h3>
              <p className="form-note">
                Connect a payout account to receive your earnings. You'll be guided through
                a secure onboarding with our payment provider.
              </p>
              {connectError && <div className="form-error">{connectError}</div>}
              <button className="btn" onClick={connect} disabled={connecting}>
                {connecting ? 'Opening…' : 'Connect payout account'}
              </button>
            </div>

            <div className="card">
              <h3>💵 Request a payout</h3>
              <form onSubmit={requestPayout}>
                <div className="field">
                  <label htmlFor="payout-usd">Amount (USD, min ${MIN_PAYOUT_USD})</label>
                  <input
                    id="payout-usd"
                    className="input"
                    type="number"
                    min={MIN_PAYOUT_USD}
                    step="0.01"
                    value={usd}
                    onChange={(e) => setUsd(e.target.value)}
                    placeholder="25.00"
                  />
                </div>
                {validUsd && (
                  <p className="form-note">
                    ≈ <strong>{tokensNeeded} tokens</strong> will be converted at 100 tokens = $1.00.
                    You'll receive <strong>${(usdNum * 0.7).toFixed(2)}</strong> after the 30% platform fee.
                    {!affordable && <span style={{ color: 'var(--coral)' }}> You only have {summary.tokenBalance} tokens.</span>}
                  </p>
                )}
                {payoutError && <div className="form-error">{payoutError}</div>}
                {payoutDone && (
                  <div className="card" style={{ borderColor: 'var(--green)', marginBottom: '0.9rem', padding: '0.7rem' }}>
                    ✅ Payout requested! It will arrive once processed.
                  </div>
                )}
                <button className="btn btn-block" type="submit" disabled={!validUsd || !affordable || payoutBusy}>
                  {payoutBusy ? 'Requesting…' : 'Request payout'}
                </button>
              </form>
              <p className="form-note" style={{ marginTop: '0.8rem', marginBottom: 0 }}>
                Payout history and status are available in your connected payout dashboard.
                Big Face takes a 30% platform fee — you receive 70% of your payout amount.
              </p>
            </div>
          </div>

          {/* Auto-payout — money hits the account automatically */}
          <div className="card" style={{ marginTop: '1.2rem', borderColor: autoEnabled ? 'var(--green)' : undefined }}>
            <h3>⚡ Auto-payout</h3>
            <p className="form-note">
              Turn this on and your earnings hit your account <strong>automatically</strong> every
              time you reach your threshold. No requests, no waiting, no excuses.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.6rem' }}>
              <label htmlFor="auto-threshold" className="form-note">Cash out at $</label>
              <input
                id="auto-threshold"
                className="input"
                type="number"
                min={10}
                step="5"
                value={autoThreshold}
                onChange={(e) => setAutoThreshold(e.target.value)}
                disabled={autoEnabled}
                style={{ width: 90 }}
              />
              <button className="btn" onClick={toggleAutoPayout} disabled={autoBusy}>
                {autoBusy ? 'Saving…' : autoEnabled ? 'Turn OFF auto-payout' : 'Turn ON auto-payout'}
              </button>
            </div>
            {autoMsg && <p className="form-note" style={{ marginTop: '0.6rem' }}>{autoMsg}</p>}
          </div>

          {/* Payout history — full transparency */}
          <div className="card" style={{ marginTop: '1.2rem' }}>
            <h3>📜 Payout history</h3>
            {payouts.length === 0 ? (
              <p className="form-note">No payouts yet. Your history will appear here with live status.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.6rem 0.8rem', background: 'var(--surface)',
                      borderRadius: 8, gap: '0.6rem', flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>${(p.amountCents / 100).toFixed(2)}</div>
                      <div className="form-note" style={{ fontSize: '0.75rem' }}>
                        {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                ))}
              </div>
            )}
            <p className="form-note" style={{ marginTop: '0.8rem', marginBottom: 0 }}>
              💚 Every payout is tracked. If one ever fails, your tokens are refunded automatically —
              you never lose money silently.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
