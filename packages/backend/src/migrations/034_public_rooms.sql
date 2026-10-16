-- Public chat rooms: anyone can discover and join
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_rooms_public ON rooms(is_public) WHERE is_public = TRUE;

-- Seed a few public rooms so new users have somewhere to go
INSERT INTO rooms (name, description, is_public)
SELECT '🌍 Big Face Lounge', 'The main hangout. Meet people, talk about anything.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = '🌍 Big Face Lounge' AND is_public = TRUE);

INSERT INTO rooms (name, description, is_public)
SELECT '🎲 Dice Talk', 'Gamble Face strategy, big wins, war stories.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = '🎲 Dice Talk' AND is_public = TRUE);

INSERT INTO rooms (name, description, is_public)
SELECT '👑 King''s Court', 'For grinders climbing to the top. Ranks, tips, motivation.', TRUE
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE name = '👑 King''s Court' AND is_public = TRUE);
