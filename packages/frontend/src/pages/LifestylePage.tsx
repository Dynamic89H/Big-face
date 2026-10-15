import { useEffect, useState } from 'react';
import { lifestyleApi, ApiError, type LifestyleAsset } from '../api/client';
import { usePageTitle } from '../hooks/usePageTitle';

const KIND_EMOJI: Record<string, string> = { house: '🏠', car: '🚗' };
const RARITY_COLORS: Record<string, string> = {
  common: 'var(--text-dim)',
  rare: '#4da3ff',
  epic: '#b366ff',
  legendary: 'var(--gold)',
};

function AssetVisual({ asset }: { asset: LifestyleAsset }) {
  const style = asset.style as Record<string, string | boolean>;
  const color = (style.color as string) ?? '#888';
  if (asset.kind === 'house') {
    return (
      <div style={{ fontSize: '3.5rem', textAlign: 'center', padding: '0.5rem' }}>
        {asset.rarity === 'legendary' ? '🏝️' : style.pool ? '🏡' : '🏠'}
        <div style={{ fontSize: '0.7rem', color: RARITY_COLORS[asset.rarity] }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: color, marginRight: 4 }} />
          {asset.name}
        </div>
      </div>
    );
  }
  return (
    <div style={{ fontSize: '3.5rem', textAlign: 'center', padding: '0.5rem' }}>
      {asset.rarity === 'legendary' ? '🏎️' : '🚗'}
      <div style={{ fontSize: '0.7rem', color: RARITY_COLORS[asset.rarity] }}>
        <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: color, marginRight: 4 }} />
        {asset.name}
      </div>
    </div>
  );
}

export default function LifestylePage() {
  usePageTitle('Lifestyle');
  const [assets, setAssets] = useState<LifestyleAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<'house' | 'car'>('house');

  const load = async () => {
    setLoading(true);
    try {
      const { assets: a } = await lifestyleApi.assets();
      setAssets(a);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load lifestyle shop.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const buy = async (asset: LifestyleAsset) => {
    if (!confirm(`Buy ${asset.name} for ${asset.tokenPrice.toLocaleString()} tokens?`)) return;
    setBusyId(asset.id);
    try {
      await lifestyleApi.buy(asset.id);
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? { ...a, owned: true } : a)));
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Purchase failed.');
    } finally {
      setBusyId(null);
    }
  };

  const shown = assets.filter((a) => a.kind === tab);

  return (
    <div className="page">
      <h1>💎 Lifestyle</h1>
      <p className="form-note">Make it to the top, live like it. Houses and whips — flex on your profile.</p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <button className={`btn ${tab === 'house' ? '' : 'btn-ghost'}`} onClick={() => setTab('house')}>
          🏠 Houses
        </button>
        <button className={`btn ${tab === 'car' ? '' : 'btn-ghost'}`} onClick={() => setTab('car')}>
          🚗 Cars
        </button>
      </div>

      {loading && <p>Loading the good life…</p>}
      {error && <div className="form-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem' }}>
        {shown.map((asset) => (
          <div
            key={asset.id}
            className="card"
            style={{ borderColor: asset.owned ? 'var(--gold)' : RARITY_COLORS[asset.rarity], padding: '0.8rem' }}
          >
            <AssetVisual asset={asset} />
            <div style={{ fontWeight: 800, fontSize: '0.9rem', margin: '0.4rem 0' }}>{asset.name}</div>
            <div className="form-note" style={{ textTransform: 'capitalize' }}>
              {asset.rarity} · Lv {asset.minLevel}+
            </div>
            {asset.owned ? (
              <div style={{ color: 'var(--gold)', fontWeight: 800, marginTop: '0.4rem' }}>✓ Owned</div>
            ) : (
              <button
                className="btn btn-sm btn-block"
                style={{ marginTop: '0.4rem' }}
                disabled={busyId === asset.id}
                onClick={() => buy(asset)}
              >
                {busyId === asset.id ? 'Buying…' : `🪙 ${asset.tokenPrice.toLocaleString()}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
