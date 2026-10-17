import { useEffect, useState } from 'react';
import { avatarApi, type Ability } from '../api/client';

/**
 * AbilitiesPanel — shows the ability catalog with unlock status.
 * On own profile: tap to equip/unequip. On others' profiles: view-only.
 */
export default function AbilitiesPanel({ userId, editable = false }: { userId?: string; editable?: boolean }) {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipped, setEquipped] = useState<Ability | null>(null);

  const load = async () => {
    try {
      if (editable) {
        const data = await avatarApi.abilities();
        setAbilities(data.abilities);
        setEquipped(data.abilities.find((a) => a.equipped) ?? null);
      } else if (userId) {
        const data = await avatarApi.equippedAbility(userId);
        setEquipped(data.ability);
      }
    } catch {
      /* abilities are best-effort */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const handleEquip = async (ability: Ability) => {
    if (!ability.unlocked) return;
    try {
      if (ability.equipped) {
        await avatarApi.unequipAbility();
      } else {
        await avatarApi.equipAbility(ability.key);
      }
      await load();
    } catch {
      /* best-effort */
    }
  };

  if (loading) return null;

  // View-only mode (other users' profiles): just show their aura
  if (!editable) {
    if (!equipped) return null;
    return (
      <div className={`ability-aura-badge ${equipped.cssClass}`}>
        <span className="ability-aura-icon">{equipped.icon}</span>
        <span className="ability-aura-name">{equipped.name}</span>
      </div>
    );
  }

  const unlocked = abilities.filter((a) => a.unlocked);
  const locked = abilities.filter((a) => !a.unlocked);

  return (
    <div className="abilities-panel">
      <h3 className="abilities-title">⚡ Abilities</h3>
      {equipped && (
        <p className="abilities-active">
          Active aura: <strong>{equipped.icon} {equipped.name}</strong> — {equipped.effectLabel}
        </p>
      )}
      <div className="abilities-grid">
        {unlocked.map((a) => (
          <button
            key={a.key}
            className={`ability-card ${a.equipped ? 'equipped' : ''} ${a.cssClass}`}
            onClick={() => handleEquip(a)}
            title={a.description}
          >
            <span className="ability-icon">{a.icon}</span>
            <span className="ability-name">{a.name}</span>
            <span className="ability-effect">{a.effectLabel}</span>
            {a.equipped && <span className="ability-equipped-tag">ACTIVE</span>}
          </button>
        ))}
        {locked.map((a) => (
          <div key={a.key} className="ability-card locked" title={a.description}>
            <span className="ability-icon">🔒</span>
            <span className="ability-name">{a.name}</span>
            <span className="ability-effect">Unlocks at Level {a.minLevel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AbilityAura — wraps an avatar with the equipped ability's visual effect.
 * 2D CSS effects only, no 3D.
 */
export function AbilityAura({ ability, children }: { ability: Ability | null; children: React.ReactNode }) {
  if (!ability) return <>{children}</>;
  return (
    <div className={`avatar-aura ${ability.cssClass}`} data-ability={ability.key}>
      {children}
    </div>
  );
}
