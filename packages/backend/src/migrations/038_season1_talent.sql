-- Season 1 launch + talent roster
-- Creates the first competitive season and promotes bot personas to artists

-- ============ SEASON 1 ============
INSERT INTO seasons (name, theme, status, starts_at, ends_at)
VALUES (
  'Season 1: Rise of the Face',
  'gold_rush',
  'active',
  now(),
  now() + interval '90 days'
)
ON CONFLICT DO NOTHING;

-- Season challenges for Season 1
INSERT INTO season_challenges (season_id, title, description, challenge_type, target_count, xp_reward, action)
SELECT s.id, c.title, c.description, c.challenge_type, c.target_count, c.xp_reward, c.action
FROM seasons s
CROSS JOIN (VALUES
  ('Weekly Spinner', 'Spin the daily wheel 7 times', 'weekly', 7, 100, 'spin'),
  ('Dice Grinder', 'Roll solo dice 50 times', 'weekly', 50, 200, 'gamble'),
  ('Social Butterfly', 'Send 100 messages', 'weekly', 100, 150, 'chat'),
  ('Connector', 'Add 10 friends', 'weekly', 10, 100, 'gift'),
  ('Rising Star', 'Share 5 stories', 'weekly', 5, 300, 'story')
) AS c(title, description, challenge_type, target_count, xp_reward, action)
WHERE s.name = 'Season 1: Rise of the Face'
  AND s.status = 'active'
ON CONFLICT DO NOTHING;

-- ============ TALENT ============
-- Promote bot personas to artists
UPDATE users SET is_artist = true
WHERE username IN ('marcus_504', 'keisha_k', 'dre_day', 'princess_bf', 'snoop_d', 'rell_world');

-- Seed artist tracks (placeholder entries — real audio uploaded via DJ Booth)
INSERT INTO artist_tracks (artist_id, title, genre, duration_secs, play_count)
SELECT u.id, t.title, t.genre, t.duration_secs, t.play_count
FROM users u
JOIN (VALUES
  ('marcus_504', '504 Anthem', 'Hip-Hop', 180, 1250),
  ('marcus_504', 'Dice Game', 'Hip-Hop', 210, 890),
  ('keisha_k', 'Queen Energy', 'R&B', 195, 2100),
  ('keisha_k', 'Crown On', 'R&B', 175, 1500),
  ('dre_day', 'High Roller', 'Hip-Hop', 200, 980),
  ('princess_bf', 'Booth Princess', 'R&B', 185, 750),
  ('snoop_d', 'Laugh Track', 'Hip-Hop', 165, 620),
  ('rell_world', 'Rell World', 'Hip-Hop', 190, 1100)
) AS t(username, title, genre, duration_secs, play_count) ON u.username = t.username
ON CONFLICT DO NOTHING;
