import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { avatarApi, walletApi, usersApi, uploadsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { AvatarItem } from '../types';
import { RARITY_COLORS } from '../types';
import ItemVisual from '../components/ItemVisual';
import RealisticAvatar3D from '../components/RealisticAvatar3D';
import ModelCharacter from '../components/ModelCharacter';
import { usePageTitle } from '../hooks/usePageTitle';

// Character lineup — realistic 3D game-style base characters users pick from.
const CHARACTERS = [
  { id: 'male-street', name: 'Street King', img: '/avatar-realistic-default.webp' },
  { id: 'female-street', name: 'Street Queen', img: '/avatar-female-street.webp' },
  { id: 'female-natural', name: 'Natural Beauty', img: '/avatar-female-natural.webp' },
  { id: 'female-bob', name: 'Boss Bob', img: '/avatar-female-bob.webp' },
  { id: 'female-locs', name: 'Goddess Locs', img: '/avatar-female-locs.webp' },
  { id: 'female-pixie', name: 'Pixie Fresh', img: '/avatar-female-pixie.webp' },
  { id: 'male-fresh', name: 'Sharp Suit', img: '/avatar-male-fresh.webp' },
  { id: 'female-glam', name: 'Red Carpet', img: '/avatar-female-glam.webp' },
  { id: 'male-sporty', name: 'Ball Player', img: '/avatar-male-sporty.webp' },
];

// Human-friendly labels for gear slots.
const SLOT_LABELS: Record<string, string> = {
  chain: '⛓️ Chains',
  grill: '😁 Grills',
  earring: '💎 Earrings',
  hair: '💇 Hair',
  top: '👕 Tops',
  bottom: '👖 Bottoms',
  shoes: '👟 Shoes',
  hat: '🧢 Hats',
  watch: '⌚ Watches',
  glasses: '🕶️ Glasses',
  ring: '💍 Rings',
};

const slotLabel = (slot: string) =>
  SLOT_LABELS[slot] ?? slot.charAt(0).toUpperCase() + slot.slice(1);

export default function AvatarStudioPage() {
  usePageTitle('Avatar Studio');
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const onboarding = searchParams.get('onboarding') === '1';
  const [items, setItems] = useState<AvatarItem[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [equipped, setEquipped] = useState<Record<string, AvatarItem>>({});
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [view3D, setView3D] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [facePhotoUrl, setFacePhotoUrl] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string>('male-street');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // --- Big-operation studio features ---
  const [previewItem, setPreviewItem] = useState<AvatarItem | null>(null);
  const [search, setSearch] = useState('');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'owned' | 'unowned'>('all');
  const [rarityFilter, setRarityFilter] = useState<'all' | AvatarItem['rarity']>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [detailItem, setDetailItem] = useState<AvatarItem | null>(null);
  const [fits, setFits] = useState<Array<{ name: string; items: Record<string, string> }>>([]);
  const [fitName, setFitName] = useState('');
  const [stripping, setStripping] = useState(false);

  const character = CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];

  const selectCharacter = async (id: string) => {
    setCharacterId(id);
    setActionError(null);
    try {
      const cfg = { ...((user?.avatarConfig ?? {}) as Record<string, unknown>), characterId: id };
      await usersApi.updateMe({ avatarConfig: cfg });
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not save your character.');
    }
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ items }, { owned, equipped }, { balance }] = await Promise.all([
        avatarApi.items(),
        avatarApi.mine(),
        walletApi.get(),
      ]);
      setItems(items);
      setOwnedIds(new Set(owned.map((o) => o.item.id)));
      setEquipped(equipped);
      setBalance(balance);
      // Restore saved face photo and 3D avatar from avatar config.
      const cfg = (user?.avatarConfig ?? {}) as Record<string, unknown>;
      if (typeof cfg.facePhotoUrl === 'string') setFacePhotoUrl(cfg.facePhotoUrl);
      if (typeof cfg.characterId === 'string' && CHARACTERS.some((c) => c.id === cfg.characterId)) {
        setCharacterId(cfg.characterId);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load the studio.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFacePhoto = async (file: File) => {
    setUploadingPhoto(true);
    setActionError(null);
    try {
      const { url } = await uploadsApi.upload(file);
      const cfg = { ...((user?.avatarConfig ?? {}) as Record<string, unknown>), facePhotoUrl: url };
      await usersApi.updateMe({ avatarConfig: cfg });
      setFacePhotoUrl(url);
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  useEffect(() => {
    load();
    try {
      const raw = localStorage.getItem('bigface.fits.v1');
      if (raw) setFits(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !item.slot.toLowerCase().includes(q)) return false;
      if (ownershipFilter === 'owned' && !ownedIds.has(item.id)) return false;
      if (ownershipFilter === 'unowned' && ownedIds.has(item.id)) return false;
      if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
      return true;
    });
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.tokenPrice - b.tokenPrice);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.tokenPrice - a.tokenPrice);
    else if (sortBy === 'newest') list = [...list].reverse();
    return list;
  }, [items, search, ownershipFilter, rarityFilter, sortBy, ownedIds]);

  const grouped = useMemo(() => {
    const map = new Map<string, AvatarItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.slot) ?? [];
      list.push(item);
      map.set(item.slot, list);
    }
    return [...map.entries()];
  }, [filteredItems]);

  // The 3D stage shows the try-before-buy preview layered over the real equipped set.
  const stageEquipped = useMemo(
    () => (previewItem ? { ...equipped, [previewItem.slot]: previewItem } : equipped),
    [equipped, previewItem]
  );

  // Deterministic fake "owned by N players" count for the detail modal.
  const fakeOwnerCount = (id: string) => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 9973;
    return 48 + (h % 2350);
  };

  const itemBlurb = (item: AvatarItem) =>
    `A ${item.rarity} ${item.slot} piece for the collection.${item.minLevel > 1 ? ` Unlocks at level ${item.minLevel}.` : ''}`;

  const acquire = async (item: AvatarItem) => {
    setBusyId(item.id);
    setActionError(null);
    try {
      await avatarApi.acquire(item.id);
      setOwnedIds((s) => new Set(s).add(item.id));
      setPreviewItem((p) => (p?.id === item.id ? null : p));
      const { balance } = await walletApi.get();
      setBalance(balance);
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : `Could not acquire ${item.name}.`);
    } finally {
      setBusyId(null);
    }
  };

  const equip = async (item: AvatarItem) => {
    setBusyId(item.id);
    setActionError(null);
    try {
      await avatarApi.equip(item.id);
      setEquipped((e) => ({ ...e, [item.slot]: item }));
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : `Could not equip ${item.name}.`);
    } finally {
      setBusyId(null);
    }
  };

  const unequip = async (slot: string) => {
    setBusyId(`unequip-${slot}`);
    setActionError(null);
    try {
      await avatarApi.unequip(slot);
      setEquipped((e) => {
        const next = { ...e };
        delete next[slot];
        return next;
      });
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not unequip that item.');
    } finally {
      setBusyId(null);
    }
  };

  // Unequip everything at once.
  const stripAll = async () => {
    const slots = Object.keys(equipped);
    if (slots.length === 0) return;
    setStripping(true);
    setActionError(null);
    try {
      await Promise.all(slots.map((slot) => avatarApi.unequip(slot)));
      setEquipped({});
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not strip your look.');
    } finally {
      setStripping(false);
    }
  };

  // --- My Fits (saved outfits, localStorage) ---
  const persistFits = (next: Array<{ name: string; items: Record<string, string> }>) => {
    setFits(next);
    try { localStorage.setItem('bigface.fits.v1', JSON.stringify(next)); } catch { /* ignore */ }
  };

  const saveFit = () => {
    if (fits.length >= 3) { setActionError('You have 3 fit slots. Delete one to save a new look.'); return; }
    const saved: Record<string, string> = {};
    for (const [slot, item] of Object.entries(equipped)) saved[slot] = item.id;
    if (Object.keys(saved).length === 0) { setActionError('Equip some gear first, then save the fit.'); return; }
    const name = fitName.trim() || `Fit ${fits.length + 1}`;
    persistFits([...fits, { name, items: saved }]);
    setFitName('');
  };

  const loadFit = async (fit: { name: string; items: Record<string, string> }) => {
    setBusyId('fit-load');
    setActionError(null);
    try {
      const ids = Object.values(fit.items).filter((id) => ownedIds.has(id));
      await Promise.all(ids.map((id) => avatarApi.equip(id).catch(() => ({ ok: false }))));
      const { equipped: fresh } = await avatarApi.mine();
      setEquipped(fresh);
      refreshUser().catch(() => undefined);
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : `Could not load "${fit.name}".`);
    } finally {
      setBusyId(null);
    }
  };

  const deleteFit = (idx: number) => {
    persistFits(fits.filter((_, i) => i !== idx));
  };

  const equippedList = Object.values(equipped);

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h1 className="page-title">{onboarding ? '🎭 Create your character' : 'Avatar Studio'}</h1>
          <p className="page-sub">{onboarding ? 'This is your Big Face. Gear up, then enter the arena.' : 'Collect gear, flex your rarity. Some pieces need level or tokens.'}</p>
        </div>
        {balance !== null && <span className="badge badge-gold" style={{ fontSize: '0.9rem' }}>💰 {balance} tokens</span>}
      </div>

      {actionError && <div className="form-error">{actionError}</div>}

      {loading && <div className="loading-wrap"><div className="spinner" /><p>Opening the studio…</p></div>}
      {error && !loading && (
        <div className="error-wrap">
          <p>😕 {error}</p>
          <button className="btn" onClick={load}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="studio-layout">
          <div>
            {/* Search / filter / sort toolbar */}
            <div className="card" style={{ padding: '0.9rem', marginBottom: '1.2rem' }}>
              <input
                className="input"
                placeholder="🔍 Search gear…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: '0.7rem' }}
              />
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                {(['all', 'owned', 'unowned'] as const).map((f) => (
                  <button
                    key={f}
                    className={`btn btn-sm ${ownershipFilter === f ? '' : 'btn-ghost'}`}
                    onClick={() => setOwnershipFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'owned' ? '✓ Owned' : 'Not owned'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                {(['all', 'common', 'rare', 'epic', 'legendary'] as const).map((r) => (
                  <button
                    key={r}
                    className={`btn btn-sm ${rarityFilter === r ? '' : 'btn-ghost'}`}
                    onClick={() => setRarityFilter(r)}
                    style={rarityFilter === r && r !== 'all' ? { borderColor: RARITY_COLORS[r] } : undefined}
                  >
                    {r === 'all' ? 'All rarities' : r[0].toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="form-note" style={{ margin: 0, whiteSpace: 'nowrap' }}>Sort:</span>
                <select
                  className="select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  style={{ flex: 1 }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low → high</option>
                  <option value="price-desc">Price: high → low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              {(search || ownershipFilter !== 'all' || rarityFilter !== 'all') && (
                <p className="form-note" style={{ margin: '0.6rem 0 0' }}>
                  {filteredItems.length} result{filteredItems.length === 1 ? '' : 's'}{' '}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginLeft: '0.4rem' }}
                    onClick={() => { setSearch(''); setOwnershipFilter('all'); setRarityFilter('all'); }}
                  >
                    Clear
                  </button>
                </p>
              )}
            </div>
            {grouped.length === 0 && (
              <div className="card empty-wrap">
                <div className="big">🎨</div>
                <p>{items.length === 0 ? 'No avatar items are available right now. Check back soon.' : 'No gear matches your search. Try clearing the filters.'}</p>
              </div>
            )}
            {grouped.map(([slot, slotItems]) => (
              <div key={slot} style={{ marginBottom: '1.4rem' }}>
                <h3 style={{ margin: '0 0 0.7rem' }}>{slotLabel(slot)}</h3>
                <div className="grid-3">
                  {slotItems.map((item) => {
                    const owned = ownedIds.has(item.id);
                    const isEquipped = equipped[item.slot]?.id === item.id;
                    const locked = (user?.level ?? 1) < item.minLevel;
                    const rarity = RARITY_COLORS[item.rarity] ?? '#9aa3b2';
                    return (
                      <div key={item.id} className="card item-card" style={{ borderColor: previewItem?.id === item.id ? 'var(--gold)' : isEquipped ? rarity : undefined }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="rarity-tag" style={{ color: rarity }}>{item.rarity}</span>
                          {isEquipped && <span className="badge badge-blue">Equipped</span>}
                          {previewItem?.id === item.id && <span className="badge badge-gold">Previewing</span>}
                        </div>
                        <div onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }} title="View details">
                          <ItemVisual slot={item.slot} style={item.style as Record<string, unknown>} name={item.name} size={90} interactive={isEquipped} />
                          <div className="item-name">{item.name} <span style={{ opacity: 0.45, fontSize: '0.8em' }}>ⓘ</span></div>
                        </div>
                        <div className="item-meta">
                          {item.minLevel > 1 && <div>🔒 Level {item.minLevel}+ required</div>}
                          {item.tokenPrice > 0 && <div>💰 {item.tokenPrice} tokens</div>}
                          {item.tokenPrice === 0 && item.minLevel <= 1 && <div>Free</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                          {!owned ? (
                            <button
                              className="btn btn-sm"
                              style={{ flex: 1 }}
                              disabled={locked || previewItem?.id === item.id}
                              onClick={() => setPreviewItem(item)}
                              title={locked ? `Reach level ${item.minLevel} to unlock` : 'Try it on your character first'}
                            >
                              {locked ? `🔒 Lv ${item.minLevel}` : previewItem?.id === item.id ? '👁️ On stage…' : '👁️ Try it on'}
                            </button>
                          ) : isEquipped ? (
                            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} disabled={busyId === `unequip-${slot}`} onClick={() => unequip(slot)}>
                              Unequip
                            </button>
                          ) : (
                            <button className="btn btn-sm" style={{ flex: 1 }} disabled={busyId === item.id} onClick={() => equip(item)}>
                              {busyId === item.id ? '…' : 'Equip'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="card preview-stage">
            <h3 style={{ margin: 0 }}>Your character</h3>
            {previewItem && (
              <div className="card" style={{ borderColor: 'var(--gold)', background: 'rgba(212,175,55,0.08)', margin: '0.7rem 0 0', padding: '0.8rem', textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>👁️ Previewing: {previewItem.name}</div>
                <p className="form-note" style={{ margin: '0.3rem 0 0.7rem' }}>Liking the look? Make it yours.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-sm"
                    style={{ flex: 1 }}
                    disabled={busyId === previewItem.id || (user?.level ?? 1) < previewItem.minLevel}
                    onClick={() => acquire(previewItem)}
                  >
                    {busyId === previewItem.id ? '…' : (user?.level ?? 1) < previewItem.minLevel ? `🔒 Lv ${previewItem.minLevel}` : previewItem.tokenPrice > 0 ? `Buy · ${previewItem.tokenPrice} 🪙` : 'Claim free'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setPreviewItem(null)}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.6rem 0' }}>
              <button
                className={`btn btn-sm ${view3D ? '' : 'btn-ghost'}`}
                onClick={() => setView3D(true)}
              >
                ✨ 3D Stage
              </button>
              <button
                className={`btn btn-sm ${!view3D ? '' : 'btn-ghost'}`}
                onClick={() => setView3D(false)}
              >
                🖼️ Classic
              </button>
            </div>
            {view3D ? (
              <RealisticAvatar3D
                width={260}
                height={420}
                characterImg={character.img}
                characterName={character.name}
                equipped={stageEquipped}
                facePhotoUrl={facePhotoUrl || undefined}
              />
            ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
              <ModelCharacter img={character.img} name={character.name} width={260} height={340} />
            </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.6rem' }}>
              <button
                className="btn"
                onClick={() => {
                  // Flex celebration on the living character
                  const event = new CustomEvent('bigface:celebrate', { detail: { text: `💎 ${character.name} FLEXING!`, big: false } });
                  window.dispatchEvent(event);
                }}
                style={{ fontWeight: 800 }}
              >
                💎 Flex
              </button>
            </div>
            <p className="form-note" style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
              {character.name}
            </p>
            {/* All 9 character models — browse and select */}
            <h4 style={{ textAlign: 'center', margin: '1rem 0 0.6rem' }}>Your Character Models</h4>
            <p className="form-note" style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
              👆 Move your finger over them — watch them come alive
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem', marginBottom: '1rem',
            }}>
              {CHARACTERS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectCharacter(c.id)}
                  style={{
                    cursor: 'pointer',
                    opacity: c.id === characterId ? 1 : 0.7,
                    filter: c.id === characterId ? 'none' : 'saturate(0.8)',
                    transition: 'opacity 0.2s',
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <ModelCharacter img={c.img} name={c.name} width="100%" height="auto" />
                  <div style={{
                    position: 'absolute', top: '0.4rem', left: '0.4rem',
                    background: 'var(--green)', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 800,
                    padding: '0.15rem 0.5rem', borderRadius: 8,
                    letterSpacing: '0.05em',
                  }}>
                    FREE
                  </div>
                  {c.id === characterId && (
                    <div style={{
                      textAlign: 'center', marginTop: '0.4rem', fontWeight: 800,
                      color: 'var(--gold)', fontSize: '0.85rem',
                    }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFacePhoto(f);
                e.target.value = '';
              }}
            />
            <button
              className="btn btn-block"
              style={{ marginTop: '0.5rem' }}
              disabled={uploadingPhoto}
              onClick={() => fileRef.current?.click()}
            >
              {uploadingPhoto ? 'Uploading…' : facePhotoUrl ? '📸 Change face photo' : '📸 Upload your face photo'}
            </button>
            {equippedList.length === 0 ? (
              <p className="form-note" style={{ textAlign: 'center' }}>
                Nothing equipped yet.<br />Grab gear below to dress up your character.
              </p>
            ) : (
              <p className="form-note" style={{ textAlign: 'center' }}>
                {equippedList.length} item{equippedList.length === 1 ? '' : 's'} equipped
              </p>
            )}
            {equippedList.length > 0 && (
              <button
                className="btn btn-ghost btn-sm btn-block"
                disabled={stripping}
                onClick={stripAll}
                style={{ marginTop: '0.4rem' }}
              >
                {stripping ? 'Stripping…' : '🧹 Reset look (unequip all)'}
              </button>
            )}

            {/* My Fits — saved outfits */}
            <div style={{ marginTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 0.6rem' }}>👔 My Fits</h4>
              {fits.length === 0 ? (
                <p className="form-note" style={{ textAlign: 'center' }}>
                  No saved fits yet. Dial in a look, name it, save it.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  {fits.map((fit, i) => (
                    <div key={i} className="card" style={{ padding: '0.6rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ flex: 1, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fit.name}</span>
                      <span className="form-note" style={{ margin: 0, whiteSpace: 'nowrap' }}>{Object.keys(fit.items).length} pcs</span>
                      <button className="btn btn-sm" disabled={busyId === 'fit-load'} onClick={() => loadFit(fit)}>
                        {busyId === 'fit-load' ? '…' : 'Wear'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => deleteFit(i)} aria-label={`Delete ${fit.name}`}>
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fits.length < 3 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="input"
                    placeholder="Name this fit…"
                    value={fitName}
                    onChange={(e) => setFitName(e.target.value)}
                    maxLength={24}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-sm" onClick={saveFit} style={{ whiteSpace: 'nowrap' }}>
                    💾 Save fit
                  </button>
                </div>
              )}
            </div>
            {onboarding && (
              <button
                className="btn btn-block"
                style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #d4af37, #aa8a2e)', fontSize: '1.05rem', padding: '0.9rem' }}
                onClick={() => navigate('/chats', { replace: true })}
              >
                Done — Enter Big Face →
              </button>
            )}
          </div>
        </div>
      )}
      {/* Item detail modal */}
      {detailItem && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={() => setDetailItem(null)}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 380, width: '100%', textAlign: 'center', position: 'relative' }}
          >
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setDetailItem(null)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              aria-label="Close"
            >
              ✕
            </button>
            <ItemVisual
              slot={detailItem.slot}
              style={detailItem.style as Record<string, unknown>}
              name={detailItem.name}
              size={140}
            />
            <h3 style={{ margin: '0.5rem 0 0.2rem' }}>{detailItem.name}</h3>
            <div
              className="rarity-tag"
              style={{
                color: RARITY_COLORS[detailItem.rarity], fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}
            >
              {detailItem.rarity}
            </div>
            <p className="form-note" style={{ margin: '0.6rem 0' }}>{itemBlurb(detailItem)}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
              {detailItem.minLevel > 1 && <span>🔒 Level {detailItem.minLevel}+</span>}
              {detailItem.tokenPrice > 0 ? <span>💰 {detailItem.tokenPrice} tokens</span> : <span>🆓 Free</span>}
              <span>👥 Owned by {fakeOwnerCount(detailItem.id).toLocaleString()} players</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(() => {
                const owned = ownedIds.has(detailItem.id);
                const isEq = equipped[detailItem.slot]?.id === detailItem.id;
                const locked = (user?.level ?? 1) < detailItem.minLevel;
                const item = detailItem;
                if (owned && isEq) {
                  return (
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { unequip(item.slot); setDetailItem(null); }}>
                      Unequip
                    </button>
                  );
                }
                if (owned) {
                  return (
                    <button className="btn" style={{ flex: 1 }} disabled={busyId === item.id} onClick={() => { equip(item); setDetailItem(null); }}>
                      {busyId === item.id ? '…' : 'Equip'}
                    </button>
                  );
                }
                return (
                  <>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1 }}
                      disabled={locked}
                      onClick={() => { setPreviewItem(item); setDetailItem(null); }}
                      title={locked ? `Reach level ${item.minLevel} to unlock` : undefined}
                    >
                      👁️ Try it on
                    </button>
                    <button
                      className="btn"
                      style={{ flex: 1 }}
                      disabled={locked || busyId === item.id}
                      onClick={async () => { await acquire(item); setDetailItem(null); }}
                    >
                      {busyId === item.id ? '…' : locked ? `🔒 Lv ${item.minLevel}` : item.tokenPrice > 0 ? `Buy · ${item.tokenPrice} 🪙` : 'Claim free'}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
