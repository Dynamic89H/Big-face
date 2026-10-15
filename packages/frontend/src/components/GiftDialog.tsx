import { useEffect, useState } from 'react';
import { giftsApi, walletApi, ApiError, type Gift } from '../api/client';
import type { GiftCatalogItem } from '../types';
import { playGiftSound } from '../utils/chime';

// Display emoji per gift catalog key (catalog keys come from the contract).
export const GIFT_EMOJI: Record<string, string> = {
  rose: '🌹',
  crown: '👑',
  throne: '🪑',
  starshower: '🌠',
  legend: '🐉',
};

interface Props {
  receiverId: string;
  receiverName: string;
  onClose: () => void;
  onSent?: (gift: Gift) => void;
}

export default function GiftDialog({ receiverId, receiverName, onClose, onSent }: Props) {
  const [catalog, setCatalog] = useState<GiftCatalogItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ gifts }, wallet] = await Promise.all([giftsApi.catalog(), walletApi.get()]);
        setCatalog(gifts);
        setBalance(wallet.balance);
        if (gifts.length > 0) setSelected(gifts[0].key);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Could not load gifts.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const send = async () => {
    if (!selected) return;
    setSending(true);
    setError(null);
    try {
      const { gift } = await giftsApi.send({
        receiverId,
        giftKey: selected,
        message: message.trim() || undefined,
      });
      setDone(true);
      playGiftSound();
      onSent?.(gift);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send the gift. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const chosen = catalog.find((g) => g.key === selected);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Send a gift">
        {done ? (
          <>
            <h3>🎁 Gift sent!</h3>
            <p className="form-note">
              {chosen ? `${GIFT_EMOJI[chosen.key] ?? '🎁'} ${chosen.label}` : 'Your gift'} is on its way to {receiverName}.
              They earn +10 XP for receiving it.
            </p>
            <button className="btn btn-block" onClick={onClose}>Done</button>
          </>
        ) : (
          <>
            <h3>🎁 Send a gift to {receiverName}</h3>
            {balance !== null && (
              <p className="form-note" style={{ marginTop: 0 }}>
                Your balance: <strong style={{ color: 'var(--gold)' }}>{balance} tokens</strong>
              </p>
            )}
            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : error && catalog.length === 0 ? (
              <div className="form-error">{error}</div>
            ) : (
              <>
                <div className="gift-grid" style={{ marginBottom: '0.9rem' }}>
                  {catalog.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      className={`card gift-card${selected === g.key ? ' selected' : ''}`}
                      onClick={() => setSelected(g.key)}
                    >
                      <div className="g-emoji">{GIFT_EMOJI[g.key] ?? '🎁'}</div>
                      <div className="g-label">{g.label}</div>
                      <div className="g-cost">{g.tokenCost} tokens</div>
                    </button>
                  ))}
                </div>
                <div className="field">
                  <label htmlFor="gift-msg">Add a note (optional)</label>
                  <input
                    id="gift-msg"
                    className="input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="You earned this 👑"
                    maxLength={140}
                  />
                </div>
              </>
            )}
            {error && catalog.length > 0 && <div className="form-error">{error}</div>}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={send}
                disabled={sending || loading || !selected}
              >
                {sending ? 'Sending…' : chosen ? `Send for ${chosen.tokenCost} tokens` : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
