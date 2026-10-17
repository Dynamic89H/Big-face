import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { giftsApi, lifestyleApi, walletApi, type GiftCatalogItem, type LifestyleAsset } from '../api/client';
import { GIFT_EMOJI } from '../components/GiftDialog';

type Tab = 'gifts' | 'lifestyle' | 'boosts';

/**
 * ShopPage — the Big Face Token Shop.
 * One place to spend tokens: gifts, whips & cribs, profile boosts.
 */
export default function ShopPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('gifts');
  const [gifts, setGifts] = useState<GiftCatalogItem[]>([]);
  const [assets, setAssets] = useState<LifestyleAsset[]>([]);
  const [balance, setBalance] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [giftData, assetData, wallet] = await Promise.all([
          giftsApi.catalog(),
          lifestyleApi.assets(),
          walletApi.get(),
        ]);
        setGifts(giftData.gifts || []);
        setAssets(assetData.assets || []);
        setBalance(wallet.balance || 0);
      } catch {
        /* offline */
      }
    };
    load();
  }, []);

  const buyGift = async (gift: GiftCatalogItem) => {
    setMessage(`Pick someone to send the ${gift.label} to! 💝`);
    setTimeout(() => navigate('/friends'), 1200);
  };

  const buyAsset = async (asset: LifestyleAsset) => {
    if (!confirm(`Buy ${asset.name} for ${asset.tokenPrice.toLocaleString()} tokens?`)) return;
    setBusy(asset.id);
    try {
      await lifestyleApi.buy(asset.id);
      setMessage(`🎉 You bought the ${asset.name}!`);
      const wallet = await walletApi.get();
      setBalance(wallet.balance || 0);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Purchase failed');
    } finally {
      setBusy(null);
    }
  };

  const buyBoost = async (boostId: string, name: string, cost: number) => {
    if (!confirm(`Buy ${name} for ${cost.toLocaleString()} tokens?`)) return;
    setBusy(boostId);
    try {
      const res = await fetch('/api/shop/boost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bigface.token')}`,
        },
        body: JSON.stringify({ boostId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`⚡ ${name} activated!`);
        const wallet = await walletApi.get();
        setBalance(wallet.balance || 0);
      } else {
        setMessage(data.error || 'Purchase failed');
      }
    } catch {
      setMessage('Purchase failed — check connection');
    } finally {
      setBusy(null);
    }
  };

  const BOOSTS = [
    { id: 'xp_2x_1h', name: '2X XP Boost (1 hour)', desc: 'Double XP on everything for 1 hour', cost: 500, icon: '⚡' },
    { id: 'profile_featured', name: 'Featured Profile (24h)', desc: 'Your profile shows at the top of discovery', cost: 1000, icon: '⭐' },
    { id: 'gold_name', name: 'Gold Name (7 days)', desc: 'Your name glows gold everywhere for a week', cost: 2000, icon: '👑' },
  ];

  return (
    <div className="page section-shop">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="shine-text" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem' }}>
          🛍️ Token Shop
        </h1>
        <p className="form-note">Spend your tokens. Flex on everyone.</p>
        <div className="card glow-gold" style={{
          display: 'inline-block', padding: '0.75rem 1.5rem', marginTop: '0.75rem',
        }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>Your balance</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold)' }}>
            🪙 {balance.toLocaleString()}
          </div>
        </div>
      </div>

      {message && (
        <div className="card" style={{
          marginBottom: '1rem', textAlign: 'center',
          borderColor: 'var(--gold)', background: 'rgba(201,162,39,0.1)',
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {(['gifts', 'lifestyle', 'boosts'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'btn' : 'btn btn-ghost'}
            style={{ textTransform: 'capitalize' }}
          >
            {t === 'gifts' ? '🎁 Gifts' : t === 'lifestyle' ? '🚗 Lifestyle' : '⚡ Boosts'}
          </button>
        ))}
      </div>

      {/* Gifts */}
      {tab === 'gifts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
          {gifts.map((g) => (
            <div key={g.key} className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{GIFT_EMOJI[g.key] || '🎁'}</div>
              <div style={{ fontWeight: 700, margin: '0.5rem 0' }}>{g.label}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.75rem' }}>
                🪙 {g.tokenCost.toLocaleString()}
              </div>
              <button className="btn btn-sm btn-block" onClick={() => buyGift(g)}>
                Send 💝
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lifestyle */}
      {tab === 'lifestyle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {assets.map((a) => (
            <div key={a.id} className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{a.kind === 'car' ? '🚗' : '🏠'}</div>
              <div style={{ fontWeight: 700, margin: '0.5rem 0' }}>{a.name}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: '0.75rem' }}>
                🪙 {a.tokenPrice.toLocaleString()}
              </div>
              <button
                className="btn btn-sm btn-block"
                onClick={() => buyAsset(a)}
                disabled={busy === a.id}
              >
                {busy === a.id ? 'Buying…' : 'Buy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Boosts */}
      {tab === 'boosts' && (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 500, margin: '0 auto' }}>
          {BOOSTS.map((b) => (
            <div key={b.id} className="card glow-blue" style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
            }}>
              <div style={{ fontSize: '2.5rem' }}>{b.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{b.name}</div>
                <div className="form-note" style={{ fontSize: '0.85rem' }}>{b.desc}</div>
                <div style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '0.25rem' }}>
                  🪙 {b.cost.toLocaleString()}
                </div>
              </div>
              <button
                className="btn"
                onClick={() => buyBoost(b.id, b.name, b.cost)}
                disabled={busy === b.id}
              >
                {busy === b.id ? '...' : 'Buy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
