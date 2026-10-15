import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { avatarApi, walletApi, usersApi, uploadsApi, ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { AvatarItem } from '../types';
import { RARITY_COLORS } from '../types';
import CharacterAvatar from '../components/CharacterAvatar';
import ItemVisual from '../components/ItemVisual';
import RealisticAvatar3D from '../components/RealisticAvatar3D';
import LivingCharacter from '../components/LivingCharacter';
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
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, AvatarItem[]>();
    for (const item of items) {
      const list = map.get(item.slot) ?? [];
      list.push(item);
      map.set(item.slot, list);
    }
    return [...map.entries()];
  }, [items]);

  const acquire = async (item: AvatarItem) => {
    setBusyId(item.id);
    setActionError(null);
    try {
      await avatarApi.acquire(item.id);
      setOwnedIds((s) => new Set(s).add(item.id));
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
            {grouped.length === 0 && (
              <div className="card empty-wrap">
                <div className="big">🎨</div>
                <p>No avatar items are available right now. Check back soon.</p>
              </div>
            )}
            {grouped.map(([slot, slotItems]) => (
              <div key={slot} style={{ marginBottom: '1.4rem' }}>
                <h3 style={{ textTransform: 'capitalize', margin: '0 0 0.7rem' }}>{slot}</h3>
                <div className="grid-3">
                  {slotItems.map((item) => {
                    const owned = ownedIds.has(item.id);
                    const isEquipped = equipped[item.slot]?.id === item.id;
                    const locked = (user?.level ?? 1) < item.minLevel;
                    const rarity = RARITY_COLORS[item.rarity] ?? '#9aa3b2';
                    return (
                      <div key={item.id} className="card item-card" style={{ borderColor: isEquipped ? rarity : undefined }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="rarity-tag" style={{ color: rarity }}>{item.rarity}</span>
                          {isEquipped && <span className="badge badge-blue">Equipped</span>}
                        </div>
                        <ItemVisual slot={item.slot} style={item.style as Record<string, unknown>} name={item.name} size={90} />
                        <div className="item-name">{item.name}</div>
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
                              disabled={locked || busyId === item.id}
                              onClick={() => acquire(item)}
                              title={locked ? `Reach level ${item.minLevel} to unlock` : undefined}
                            >
                              {busyId === item.id ? '…' : locked ? `🔒 Lv ${item.minLevel}` : item.tokenPrice > 0 ? `Acquire · ${item.tokenPrice} 🪙` : 'Acquire'}
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
                equipped={equipped}
                showBody={false}
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
              👆 Move your finger over them — they're real 3D models
            </p>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
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
                  }}
                >
                  <ModelCharacter img={c.img} name={c.name} width={170} height={220} />
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
                Nothing equipped yet.<br />Grab gear below and watch your character come alive.
              </p>
            ) : (
              <p className="form-note" style={{ textAlign: 'center' }}>
                {equippedList.length} item{equippedList.length === 1 ? '' : 's'} equipped
              </p>
            )}
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
    </div>
  );
}
