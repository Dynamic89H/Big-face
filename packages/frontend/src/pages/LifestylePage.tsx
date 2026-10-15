import { useEffect, useState } from 'react';
import { lifestyleApi, ApiError, type LifestyleAsset } from '../api/client';
import { usePageTitle } from '../hooks/usePageTitle';
import CarVisual, { HouseVisual } from '../components/VehicleVisual';

const KIND_EMOJI: Record<string, string> = { house: '🏠', car: '🚗' };
const RARITY_COLORS: Record<string, string> = {
  common: 'var(--text-dim)',
  rare: '#4da3ff',
  epic: '#b366ff',
  legendary: 'var(--gold)',
};

function AssetVisual({ asset }: { asset: LifestyleAsset }) {
  const style = asset.style as Record<string, unknown>;
  if (asset.kind === 'house') {
    return <HouseVisual style={style} width={200} />;
  }
  return <CarVisual style={style as any} width={200} />;
}

export default function LifestylePage() {
  usePageTitle('Lifestyle');
  const [assets, setAssets] = useState<LifestyleAsset[]>([]);
  const [myCars, setMyCars] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<'house' | 'car' | 'shop' | 'garage'>('house');
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState('rims');

  const load = async () => {
    setLoading(true);
    try {
      const [{ assets: a }, { assets: mine }, { items }] = await Promise.all([
        lifestyleApi.assets(),
        lifestyleApi.mineDetailed().catch(() => ({ assets: [] })),
        lifestyleApi.shop().catch(() => ({ items: [] })),
      ]);
      setAssets(a);
      setMyCars(mine.filter((m: any) => m.kind === 'car'));
      setShopItems(items);
      if (mine.length && !selectedCar) {
        const firstCar = mine.find((m: any) => m.kind === 'car');
        if (firstCar) setSelectedCar(firstCar.id);
      }
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
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Purchase failed.');
    } finally {
      setBusyId(null);
    }
  };

  const customize = async (item: any) => {
    if (!selectedCar) return;
    if (!confirm(`Apply ${item.name} for ${item.tokenPrice.toLocaleString()} tokens?`)) return;
    setBusyId(item.id);
    try {
      await lifestyleApi.customize(selectedCar, item.category, item.id);
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Customization failed.');
    } finally {
      setBusyId(null);
    }
  };

  const shown = assets.filter((a) => a.kind === tab);
  const selectedCarData = myCars.find((c) => c.id === selectedCar);
  const shopFiltered = shopItems.filter((i) => i.category === shopCategory);

  return (
    <div className="page">
      <h1>💎 Lifestyle</h1>
      <p className="form-note">Make it to the top, live like it. Houses, whips, and a full custom shop.</p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        <button className={`btn ${tab === 'house' ? '' : 'btn-ghost'}`} onClick={() => setTab('house')}>
          🏠 Houses
        </button>
        <button className={`btn ${tab === 'car' ? '' : 'btn-ghost'}`} onClick={() => setTab('car')}>
          🚗 Cars
        </button>
        <button className={`btn ${tab === 'garage' ? '' : 'btn-ghost'}`} onClick={() => setTab('garage')}>
          🔧 My Garage
        </button>
        <button className={`btn ${tab === 'shop' ? '' : 'btn-ghost'}`} onClick={() => setTab('shop')}>
          🛠️ Custom Shop
        </button>
      </div>

      {loading && <p>Loading the good life…</p>}
      {error && <div className="form-error">{error}</div>}

      {/* GARAGE: my customized cars with live preview */}
      {tab === 'garage' && (
        <div>
          {myCars.length === 0 && <div className="card empty-wrap"><p>No whips yet. Buy one first! 🚗</p></div>}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {myCars.map((c) => (
              <button
                key={c.id}
                className={`btn btn-sm ${selectedCar === c.id ? '' : 'btn-ghost'}`}
                onClick={() => setSelectedCar(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          {selectedCarData && (
            <div className="card" style={{ borderColor: 'var(--gold)', textAlign: 'center' }}>
              <h3 style={{ margin: '0.5rem 0' }}>{selectedCarData.name}</h3>
              <CarVisual
                style={selectedCarData.style}
                customPaint={selectedCarData.customPaint}
                customRims={selectedCarData.customRims}
                width={320}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className="form-note">🎨 {selectedCarData.customPaint || 'Factory paint'}</span>
                <span className="form-note">🛞 {selectedCarData.customRims || 'Stock rims'}</span>
                <span className="form-note">💺 {selectedCarData.customInterior || 'Stock interior'}</span>
              </div>
              <button className="btn" style={{ marginTop: '0.8rem' }} onClick={() => setTab('shop')}>
                🛠️ Customize this whip
              </button>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM SHOP */}
      {tab === 'shop' && (
        <div>
          {!selectedCar && <div className="card empty-wrap"><p>Buy a car first, then pimp it out here! 🚗</p></div>}
          {selectedCar && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['rims', 'paint', 'interior', 'extra'].map((c) => (
                  <button
                    key={c}
                    className={`btn btn-sm ${shopCategory === c ? '' : 'btn-ghost'}`}
                    onClick={() => setShopCategory(c)}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {c === 'rims' ? '🛞' : c === 'paint' ? '🎨' : c === 'interior' ? '💺' : '✨'} {c}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem' }}>
                {shopFiltered.map((item) => (
                  <div key={item.id} className="card" style={{ padding: '0.8rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.name}</div>
                    <div className="form-note">Lv {item.minLevel}+</div>
                    <button
                      className="btn btn-sm btn-block"
                      style={{ marginTop: '0.4rem' }}
                      disabled={busyId === item.id}
                      onClick={() => customize(item)}
                    >
                      {busyId === item.id ? 'Applying…' : `🪙 ${item.tokenPrice.toLocaleString()}`}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {(tab === 'house' || tab === 'car') && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.8rem' }}>
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
      )}
    </div>
  );
}
