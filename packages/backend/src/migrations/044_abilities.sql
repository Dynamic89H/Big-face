-- Avatar abilities system
-- Characters unlock powers as they level up. Abilities have visual effects + small gameplay bonuses.

CREATE TABLE IF NOT EXISTS abilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  min_level INTEGER NOT NULL DEFAULT 1,
  effect_type TEXT NOT NULL DEFAULT 'cosmetic',
  effect_value NUMERIC NOT NULL DEFAULT 0,
  effect_label TEXT NOT NULL DEFAULT '',
  css_class TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_abilities (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ability_id UUID NOT NULL REFERENCES abilities(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  equipped BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, ability_id)
);
CREATE INDEX IF NOT EXISTS idx_user_abilities_user ON user_abilities (user_id);

-- Seed the ability catalog
INSERT INTO abilities (key, name, icon, description, min_level, effect_type, effect_value, effect_label, css_class, sort_order)
VALUES
  ('fire_aura', 'Fire Aura', '🔥', 'A ring of fire burns around you. Intimidating.', 5, 'xp_boost', 5, '+5% XP on wins', 'ability-fire', 1),
  ('shield_wall', 'Shield Wall', '🛡️', 'A golden shield protects your grind.', 8, 'streak_protect', 1, 'Protects 1 streak miss', 'ability-shield', 2),
  ('lightning_strike', 'Lightning Strike', '⚡', 'Electric energy crackles off your avatar.', 10, 'xp_boost', 10, '+10% XP on dice wins', 'ability-lightning', 3),
  ('star_power', 'Star Power', '💫', 'Stars orbit you. You shine different.', 12, 'spin_boost', 5, '+5% spin rewards', 'ability-stars', 4),
  ('royal_presence', 'Royal Presence', '👑', 'A kingly glow. Everyone notices.', 15, 'tip_boost', 25, '+25% tip earnings', 'ability-royal', 5),
  ('wave_rider', 'Wave Rider', '🌊', 'Ocean energy flows through you.', 20, 'xp_boost', 15, '+15% XP on wins', 'ability-wave', 6),
  ('lions_roar', 'Lion''s Roar', '🦁', 'The lion''s spirit. Pure Big Face energy.', 25, 'xp_boost', 20, '+20% XP on all actions', 'ability-lion', 7),
  ('diamond_skin', 'Diamond Skin', '💎', 'You shine like a diamond. Untouchable.', 30, 'token_boost', 10, '+10% token rewards', 'ability-diamond', 8)
ON CONFLICT (key) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  min_level = EXCLUDED.min_level,
  effect_type = EXCLUDED.effect_type,
  effect_value = EXCLUDED.effect_value,
  effect_label = EXCLUDED.effect_label,
  css_class = EXCLUDED.css_class,
  sort_order = EXCLUDED.sort_order;

-- Backfill: unlock abilities for users who already meet the level requirement
INSERT INTO user_abilities (user_id, ability_id)
SELECT u.id, a.id
FROM users u
CROSS JOIN abilities a
WHERE u.level >= a.min_level
  AND NOT EXISTS (
    SELECT 1 FROM user_abilities ua
    WHERE ua.user_id = u.id AND ua.ability_id = a.id
  );
