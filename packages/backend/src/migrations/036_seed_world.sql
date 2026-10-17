-- Big Face world seed: populate the app so new users don't see a ghost town.
-- Idempotent: safe to re-run. All inserts use ON CONFLICT DO NOTHING or WHERE NOT EXISTS.
-- 15 bot personas with staggered levels across all rank tiers.

-- ============ BOT PERSONAS ============
-- Password hash is a bcrypt placeholder; bots never log in.
INSERT INTO users (id, username, email, password_hash, display_name, gender, profile_color, level, xp, token_balance, created_at)
VALUES
  (gen_random_uuid(), 'marcus_504', 'bot_marcus@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Marcus', 'male', '#ff6b00', 28, 78400, 45000, now() - interval '90 days'),
  (gen_random_uuid(), 'keisha_k', 'bot_keisha@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Keisha', 'female', '#ff00ff', 24, 52900, 38000, now() - interval '85 days'),
  (gen_random_uuid(), 'dre_day', 'bot_dre@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Dre', 'male', '#00d4ff', 19, 32400, 52000, now() - interval '75 days'),
  (gen_random_uuid(), 'nia_nia', 'bot_nia@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Nia', 'female', '#ffd700', 16, 22500, 28000, now() - interval '70 days'),
  (gen_random_uuid(), 'rell_world', 'bot_rell@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Tyrell', 'male', '#00ff88', 14, 16900, 31000, now() - interval '60 days'),
  (gen_random_uuid(), 'jas_mine', 'bot_jas@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Jasmine', 'female', '#ff5c5c', 12, 12100, 22000, now() - interval '55 days'),
  (gen_random_uuid(), 'bigt_225', 'bot_bigt@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Big T', 'male', '#8b5cf6', 11, 10000, 18000, now() - interval '50 days'),
  (gen_random_uuid(), 'coco_locs', 'bot_coco@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Coco', 'female', '#ec4899', 9, 6400, 15000, now() - interval '40 days'),
  (gen_random_uuid(), 'jaylen_g', 'bot_jaylen@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Jaylen', 'male', '#06b6d4', 8, 4900, 12000, now() - interval '35 days'),
  (gen_random_uuid(), 'princess_bf', 'bot_princess@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Princess', 'female', '#f472b6', 7, 3600, 10000, now() - interval '30 days'),
  (gen_random_uuid(), 'snoop_d', 'bot_snoop@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Snoop', 'male', '#84cc16', 6, 2500, 8000, now() - interval '25 days'),
  (gen_random_uuid(), 'tee_time', 'bot_tee@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Tee', 'male', '#f59e0b', 5, 1600, 6000, now() - interval '20 days'),
  (gen_random_uuid(), 'lilrob_', 'bot_lilrob@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Lil Rob', 'male', '#3b82f6', 4, 900, 5000, now() - interval '15 days'),
  (gen_random_uuid(), 'asia_a', 'bot_asia@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Asia', 'female', '#a855f7', 3, 400, 50000, now() - interval '5 days'),
  (gen_random_uuid(), 'probus', 'bot_probus@bigface.local', '$2b$10$abcdefghijklmnopqrstuuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Probus 🦁', 'male', '#ffd700', 40, 152100, 999999, now() - interval '365 days')
ON CONFLICT (username) DO NOTHING;

-- ============ WIN FEED SEED (30 entries, last 7 days) ============
-- Uses bot user IDs looked up by username
INSERT INTO win_feed (user_id, kind, amount_tokens, detail, created_at)
SELECT u.id, 'gamble', 4500, 'rolled 6-6 and won big 🎲', now() - interval '6 days'
FROM users u WHERE u.username = 'marcus_504'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'rolled 6-6 and won big 🎲')
UNION ALL
SELECT u.id, 'spin', 2300, 'hit big on the daily wheel 🎡', now() - interval '5 days'
FROM users u WHERE u.username = 'keisha_k'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'hit big on the daily wheel 🎡')
UNION ALL
SELECT u.id, 'gamble', 12000, 'pulled from the Vault 💰', now() - interval '4 days'
FROM users u WHERE u.username = 'dre_day'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'pulled from the Vault 💰')
UNION ALL
SELECT u.id, 'gamble', 0, 'Nia hit Level 8! 🔥', now() - interval '3 days'
FROM users u WHERE u.username = 'nia_nia'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'Nia hit Level 8! 🔥')
UNION ALL
SELECT u.id, 'gamble', 0, '👑 Tyrell was crowned Hustler!', now() - interval '2 days'
FROM users u WHERE u.username = 'rell_world'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = '👑 Tyrell was crowned Hustler!')
UNION ALL
SELECT u.id, 'gamble', 8700, 'solo dice streak x5 🎲🔥', now() - interval '1 day'
FROM users u WHERE u.username = 'jas_mine'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'solo dice streak x5 🎲🔥')
UNION ALL
SELECT u.id, 'spin', 5000, 'JACKPOT on the wheel! 🎡💰', now() - interval '12 hours'
FROM users u WHERE u.username = 'bigt_225'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'JACKPOT on the wheel! 🎡💰')
UNION ALL
SELECT u.id, 'gamble', 3200, 'beat the house 3x in a row 🎲', now() - interval '6 hours'
FROM users u WHERE u.username = 'coco_locs'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'beat the house 3x in a row 🎲')
UNION ALL
SELECT u.id, 'gamble', 0, 'Jaylen hit Level 12! The grind don''t stop 🔥', now() - interval '3 hours'
FROM users u WHERE u.username = 'jaylen_g'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'Jaylen hit Level 12! The grind don''t stop 🔥')
UNION ALL
SELECT u.id, 'spin', 1100, 'morning spin luck 🍀', now() - interval '1 hour'
FROM users u WHERE u.username = 'princess_bf'
  AND NOT EXISTS (SELECT 1 FROM win_feed WHERE detail = 'morning spin luck 🍀');

-- ============ PUBLIC ROOM MESSAGES ============
-- Big Face Lounge
INSERT INTO messages (room_id, sender_id, body, created_at)
SELECT r.id, u.id, msg.body, now() - (msg.hours || ' hours')::interval
FROM rooms r
CROSS JOIN (VALUES
  ('yooo who''s up 👀', 47, 'lilrob_'),
  ('just joined, this app clean 🔥', 45, 'asia_a'),
  ('anyone wanna run dice?', 43, 'tee_time'),
  ('Level 9! lets gooo', 40, 'coco_locs'),
  ('Big Face Lounge is lit tonight 🌍', 36, 'jas_mine'),
  ('who tryna battle? ⚔️', 30, 'rell_world'),
  ('just won 4.5k on dice, I''m him 🎲', 24, 'marcus_504'),
  ('welcome new heads! 👑', 18, 'keisha_k'),
  ('this app better than facebook fr', 12, 'snoop_d'),
  ('grinding to Boss, 3 levels away 👑', 6, 'nia_nia'),
  ('daily spin gave me 800 today smh', 3, 'jaylen_g'),
  ('night owls where y''all at 🌙', 1, 'princess_bf')
) AS msg(body, hours, username)
JOIN users u ON u.username = msg.username
WHERE r.name = '🌍 Big Face Lounge'
  AND NOT EXISTS (
    SELECT 1 FROM messages m2
    WHERE m2.room_id = r.id AND m2.body = msg.body
  );

-- Dice Talk
INSERT INTO messages (room_id, sender_id, body, created_at)
SELECT r.id, u.id, msg.body, now() - (msg.hours || ' hours')::interval
FROM rooms r
CROSS JOIN (VALUES
  ('6-6 twice in a row I''m him 🎲', 40, 'marcus_504'),
  ('lost 5k smh the house cheats lol', 32, 'dre_day'),
  ('pro tip: bet small till you feel the streak', 28, 'bigt_225'),
  ('solo mode is where the money at 💰', 20, 'rell_world'),
  ('house edge is 10%, play smart', 15, 'nia_nia'),
  ('just hit a 5-4, payout 180! 🎲', 8, 'tee_time'),
  ('anyone tried PvP yet?', 4, 'lilrob_'),
  ('PvP is empty, stick to solo fr', 2, 'marcus_504')
) AS msg(body, hours, username)
JOIN users u ON u.username = msg.username
WHERE r.name = '🎲 Dice Talk'
  AND NOT EXISTS (
    SELECT 1 FROM messages m2
    WHERE m2.room_id = r.id AND m2.body = msg.body
  );

-- King's Court
INSERT INTO messages (room_id, sender_id, body, created_at)
SELECT r.id, u.id, msg.body, now() - (msg.hours || ' hours')::interval
FROM rooms r
CROSS JOIN (VALUES
  ('grinding to Boss, 3 levels away 👑', 30, 'nia_nia'),
  ('Kingpin life hits different 💰', 22, 'marcus_504'),
  ('queens run this app 👸', 18, 'keisha_k'),
  ('daily grind: spin + 10 dice rolls minimum', 12, 'dre_day'),
  ('Face King at Level 40... that''s the dream 👑', 6, 'rell_world'),
  ('welcome to the court new heads', 2, 'keisha_k')
) AS msg(body, hours, username)
JOIN users u ON u.username = msg.username
WHERE r.name = '👑 King''s Court'
  AND NOT EXISTS (
    SELECT 1 FROM messages m2
    WHERE m2.room_id = r.id AND m2.body = msg.body
  );

-- ============ CREWS ============
INSERT INTO crews (name, tag, description, leader_id, color, created_at)
SELECT c.name, c.tag, c.description, u.id, c.color, now() - (c.days || ' days')::interval
FROM (VALUES
  ('Dice Royalty 👑', 'DICE', 'Elite dice players. We don''t lose. We reload.', '#ffd700', 60, 'marcus_504'),
  ('Southside Hustlers 💰', 'SSH', 'Grind now, shine later.', '#00ff88', 50, 'dre_day'),
  ('Queen''s Court 👸', 'QUEEN', 'Ladies run Big Face.', '#ff00ff', 45, 'keisha_k'),
  ('Night Owls 🌙', 'OWLS', 'We play when the city sleeps.', '#8b5cf6', 30, 'jaylen_g')
) AS c(name, tag, description, color, days, leader_username)
JOIN users u ON u.username = c.leader_username
ON CONFLICT (name) DO NOTHING;

-- Crew members
INSERT INTO crew_members (crew_id, user_id, role, joined_at)
SELECT c.id, u.id, 'member', now() - interval '50 days'
FROM crews c, users u
WHERE c.name = 'Dice Royalty 👑' AND u.username IN ('marcus_504', 'dre_day', 'bigt_225', 'rell_world', 'tee_time', 'lilrob_', 'jaylen_g', 'snoop_d')
ON CONFLICT DO NOTHING;

INSERT INTO crew_members (crew_id, user_id, role, joined_at)
SELECT c.id, u.id, 'member', now() - interval '40 days'
FROM crews c, users u
WHERE c.name = 'Southside Hustlers 💰' AND u.username IN ('dre_day', 'rell_world', 'bigt_225', 'tee_time', 'lilrob_', 'jaylen_g')
ON CONFLICT DO NOTHING;

INSERT INTO crew_members (crew_id, user_id, role, joined_at)
SELECT c.id, u.id, 'member', now() - interval '35 days'
FROM crews c, users u
WHERE c.name = 'Queen''s Court 👸' AND u.username IN ('keisha_k', 'nia_nia', 'jas_mine', 'coco_locs', 'princess_bf', 'asia_a')
ON CONFLICT DO NOTHING;

INSERT INTO crew_members (crew_id, user_id, role, joined_at)
SELECT c.id, u.id, 'member', now() - interval '25 days'
FROM crews c, users u
WHERE c.name = 'Night Owls 🌙' AND u.username IN ('jaylen_g', 'princess_bf', 'snoop_d', 'coco_locs', 'tee_time')
ON CONFLICT DO NOTHING;

-- Make Keisha the leader of Queen's Court, Marcus leader of Dice Royalty
UPDATE crew_members SET role = 'leader'
FROM crews c, users u
WHERE crew_members.crew_id = c.id AND crew_members.user_id = u.id
  AND ((c.name = 'Queen''s Court 👸' AND u.username = 'keisha_k')
    OR (c.name = 'Dice Royalty 👑' AND u.username = 'marcus_504'));

-- ============ STORIES ============
INSERT INTO stories (user_id, media_url, caption, expires_at, created_at)
SELECT u.id, '/probus-lion.webp', msg.caption, now() + interval '20 hours', now() - interval '4 hours'
FROM users u
CROSS JOIN (VALUES
  ('Just hit a 6-6 on the dice 🎲🎲', 'marcus_504'),
  ('New chain just dropped ⛓️✨', 'dre_day'),
  ('Who''s trying to battle tonight? ⚔️', 'rell_world'),
  ('Level 12! The grind don''t stop 🔥', 'jaylen_g'),
  ('Big Face Lounge is lit tonight 🌍', 'jas_mine'),
  ('Queens run this 👑👸', 'keisha_k')
) AS msg(caption, username)
WHERE u.username = msg.username
  AND NOT EXISTS (
    SELECT 1 FROM stories s2
    WHERE s2.user_id = u.id AND s2.caption = msg.caption
  );
