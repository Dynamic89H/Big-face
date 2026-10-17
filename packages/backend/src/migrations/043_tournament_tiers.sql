-- Tournament tiers + weekend schedule
-- Tiers: Rookie -> Pros -> Legend -> Boss -> Masters

ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'Rookie';
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS schedule TEXT NOT NULL DEFAULT 'weekly'; -- 'weekly' | 'weekend'

-- Track each user's current tournament tier (winners move up)
ALTER TABLE users ADD COLUMN IF NOT EXISTS tournament_tier TEXT NOT NULL DEFAULT 'Rookie';

CREATE INDEX IF NOT EXISTS idx_tournaments_schedule ON tournaments(schedule, status, ends_at);

-- Seed the first weekly + weekend tournaments if none exist
INSERT INTO tournaments (name, kind, tier, schedule, entry_fee, max_players, status, starts_at, ends_at)
SELECT 'Weekly Showdown 🎲', 'dice', 'Rookie', 'weekly', 500, 32, 'open', now(), now() + interval '7 days'
WHERE NOT EXISTS (SELECT 1 FROM tournaments WHERE schedule = 'weekly' AND status IN ('open', 'running'));

INSERT INTO tournaments (name, kind, tier, schedule, entry_fee, max_players, status, starts_at, ends_at)
SELECT 'Weekend Clash ⚡', 'dice', 'Rookie', 'weekend', 250, 32, 'open', now(), now() + interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM tournaments WHERE schedule = 'weekend' AND status IN ('open', 'running'));
