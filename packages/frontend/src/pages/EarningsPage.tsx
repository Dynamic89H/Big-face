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

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await earningsApi.summary());
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
        </>
      )}
    </div>
  );
}
