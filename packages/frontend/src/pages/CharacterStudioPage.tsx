import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaPersonCreator from '../components/MetaPersonCreator';
import ClosetPicker from '../components/ClosetPicker';
import type { ClosetItem } from '../closet/closetData';
import { usePageTitle } from '../hooks/usePageTitle';
import { usersApi } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { celebrate } from '../components/Celebration';

/**
 * CharacterStudio — create your real avatar.
 * Selfie → realistic 3D avatar via Avatar SDK (the pro engine).
 * No procedural logos — only real characters.
 */
export default function CharacterStudioPage() {
  usePageTitle('Character Studio');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [outfit, setOutfit] = useState<Record<string, { item: ClosetItem; color?: number }>>({});

  const handleOutfitPick = (item: ClosetItem, color?: number) => {
    setOutfit((prev) => ({ ...prev, [item.category]: { item, color } }));
  };

  const handleProAvatar = async (url: string, gender: string) => {
    setSaving(true);
    try {
      await usersApi.updateMe({ avatarConfig: { proAvatarUrl: url, gender, outfit } });
      await refreshUser();
      celebrate('🎉 Avatar Created!', true);
      setTimeout(() => navigate('/avatar-studio'), 1500);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h1 style={{ margin: '0 0 0.3rem' }}>🎨 Character Studio</h1>
      <p className="form-note" style={{ marginBottom: '1rem' }}>
        Create your real avatar — upload a selfie and get a 3D character that looks like YOU.
      </p>

      <div className="card">
        <h3 style={{ textAlign: 'center' }}>📸 Pro Avatar Engine</h3>
        <p className="form-note" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Powered by Avatar SDK — the industry standard for realistic 3D avatars.
        </p>
        {saving ? (
          <p style={{ textAlign: 'center' }}>Saving your avatar…</p>
        ) : (
          <MetaPersonCreator onAvatarExported={handleProAvatar} height={600} />
        )}
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <ClosetPicker
          onSelect={handleOutfitPick}
          selectedItems={Object.fromEntries(
            Object.entries(outfit).map(([cat, { item }]) => [cat, item.id])
          )}
        />
      </div>
    </div>
  );
}
