import { useEffect, useState, type FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { giftsApi, usersApi, walletApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { GiftCatalogItem, Transaction, User } from '../types';
import { TOKEN_PACKS, timeAgo, type TokenPack } from '../types';
import Avatar from '../components/Avatar';
import GiftDialog, { GIFT_EMOJI } from '../components/GiftDialog';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

function CheckoutForm({ pack, onDone, onClose }: { pack: TokenPack; onDone: () => void; onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const pay = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setError(null);
    try {
      // 1. Create a PaymentIntent on the backend.
      const { clientSecret } = await walletApi.purchase(pack.id);
      // 2. Confirm the card payment with Stripe.
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card form not ready.');
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });
      if (result.error) throw new Error(result.error.message ?? 'Payment failed.');
      if (result.paymentIntent?.status !== 'succeeded') {
        throw new Error(`Payment status: ${result.paymentIntent?.status ?? 'unknown'}.`);
      }
      // 3. Tell the backend to credit the tokens.
      await walletApi.confirm(result.paymentIntent.id);
      setSuccess(true);
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <>
            <h3>🎉 {pack.tokens} tokens added!</h3>
            <p className="form-note">Your wallet balance has been updated. Spend them wisely, future royalty.</p>
            <button className="btn btn-block" onClick={onClose}>Done</button>
          </>
        ) : (
          <>
            <h3>Buy {pack.label}</h3>
            <p className="form-note">{pack.tokens} tokens · {pack.price}</p>
            <form onSubmit={pay}>
              <div className="field">
                <label>Card details</label>
                <div className="input" style={{ padding: '0.8rem' }}>
                  <CardElement
                    options={{
                      style: {
                        base: { color: '#f2f4f8', fontSize: '15px', '::placeholder': { color: '#9aa3b2' } },
                        invalid: { color: '#FF5C5C' },
                      },
                    }}
                  />
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                <button type="submit" className="btn" style={{ flex: 1 }} disabled={!stripe || processing}>
                  {processing ? 'Processing…' : `Pay ${pack.price}`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [catalog, setCatalog] = useState<GiftCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<TokenPack | null>(null);

  // Gift send flow: search a recipient, then open the gift dialog.
  const [giftQuery, setGiftQuery] = useState('');
  const [giftCandidates, setGiftCandidates] = useState<User[]>([]);
  const [giftTo, setGiftTo] = useState<User | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ balance, transactions }, { gifts }] = await Promise.all([
        walletApi.get(),
        giftsApi.catalog(),
      ]);
      setBalance(balance);
      setTransactions(transactions);
      setCatalog(gifts);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your wallet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const q = giftQuery.trim().toLowerCase();
    if (q.length < 2) {
      setGiftCandidates([]);
      return;
    }
    const t = window.setTimeout(async () => {
      try {
        const { entries } = await usersApi.leaderboard(50);
        setGiftCandidates(
          entries
            .map((e) => e.user)
            .filter((u) => u.id !== user?.id && (u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)))
            .slice(0, 6),
        );
      } catch {
        setGiftCandidates([]);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [giftQuery, user?.id]);

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Wallet</h1>
        <p className="page-sub">Tokens buy gifts, avatar gear, and royal favor.</p>
      </div>

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Opening your wallet…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="card" style={{ marginBottom: '1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="form-note">Token balance</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>💰 {balance ?? 0}</div>
            </div>
            <div className="form-note" style={{ textAlign: 'right' }}>
              100 tokens = $1.00<br />in creator payouts
            </div>
          </div>

          <h2 style={{ margin: '0 0 0.9rem' }}>Buy tokens</h2>
          {!stripePromise ? (
            <div className="card" style={{ marginBottom: '1.4rem', borderColor: 'var(--gold)' }}>
              <h3 style={{ marginTop: 0 }}>💳 Payments are not configured</h3>
              <p className="form-note">
                Token purchases are currently unavailable — the payment provider hasn't been set up yet.
                Please check back soon. No charges were made.
              </p>
            </div>
          ) : (
            <div className="grid-3" style={{ marginBottom: '1.4rem' }}>
              {TOKEN_PACKS.map((p) => (
                <div key={p.id} className="card pack-card">
                  {p.tag && <span className="pack-tag">{p.tag}</span>}
                  <div style={{ fontWeight: 800 }}>{p.label}</div>
                  <div className="tokens">🪙 {p.tokens}</div>
                  <div className="price">{p.price}</div>
                  <button className="btn btn-sm" onClick={() => setBuying(p)}>Buy</button>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ margin: '0 0 0.9rem' }}>Send a gift</h2>
          <div className="card" style={{ marginBottom: '1.4rem' }}>
            <div className="field" style={{ marginBottom: '0.6rem' }}>
              <label htmlFor="gift-search">Who deserves a gift?</label>
              <input
                id="gift-search"
                className="input"
                value={giftQuery}
                onChange={(e) => setGiftQuery(e.target.value)}
                placeholder="Search by username…"
              />
            </div>
            {giftCandidates.map((c) => (
              <div key={c.id} className="room-item" onClick={() => { setGiftTo(c); setGiftQuery(''); setGiftCandidates([]); }} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setGiftTo(c)}>
                <Avatar displayName={c.displayName} profileColor={c.profileColor} size="sm" />
                <div className="info">
                  <div className="name">{c.displayName}</div>
                  <div className="preview">@{c.username} · Level {c.level}</div>
                </div>
              </div>
            ))}
            <div className="gift-grid" style={{ marginTop: '0.8rem' }}>
              {catalog.map((g) => (
                <div key={g.key} className="card gift-card" style={{ cursor: 'default' }}>
                  <div className="g-emoji">{GIFT_EMOJI[g.key] ?? '🎁'}</div>
                  <div className="g-label">{g.label}</div>
                  <div className="g-cost">{g.tokenCost} tokens</div>
                </div>
              ))}
            </div>
            {catalog.length === 0 && <p className="form-note">No gifts in the catalog right now.</p>}
          </div>

          <h2 style={{ margin: '0 0 0.9rem' }}>Transaction history</h2>
          <div className="card">
            {transactions.length === 0 ? (
              <p className="form-note" style={{ margin: 0 }}>No transactions yet. Buy tokens or send gifts to get started.</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="tx-row">
                  <div>
                    <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{t.kind.replace(/_/g, ' ')}</div>
                    <div className="form-note">{t.note ?? timeAgo(t.createdAt)}</div>
                  </div>
                  <div className={`tx-amt${t.amount >= 0 ? ' pos' : ' neg'}`}>
                    {t.amount >= 0 ? '+' : ''}{t.amount} 🪙
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {buying && stripePromise && (
        <Elements stripe={stripePromise}>
          <CheckoutForm pack={buying} onClose={() => setBuying(null)} onDone={load} />
        </Elements>
      )}
      {giftTo && (
        <GiftDialog receiverId={giftTo.id} receiverName={giftTo.displayName} onClose={() => setGiftTo(null)} onSent={load} />
      )}
    </div>
  );
}
