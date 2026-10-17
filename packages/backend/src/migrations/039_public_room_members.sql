-- Add bot personas as members of public rooms so member counts aren't zero.
-- Idempotent: ON CONFLICT DO NOTHING on (room_id, user_id).

-- Big Face Lounge: all 15 bots
INSERT INTO room_members (room_id, user_id, joined_at)
SELECT r.id, u.id, now() - (floor(random() * 48) || ' hours')::interval
FROM rooms r
CROSS JOIN users u
WHERE r.name = '🌍 Big Face Lounge'
  AND u.username IN ('marcus_504','keisha_k','dre_day','nia_nia','rell_world','jas_mine','bigt_225','coco_locs','jaylen_g','princess_bf','snoop_d','tee_time','lilrob_','asia_a','probus')
ON CONFLICT (room_id, user_id) DO NOTHING;

-- Dice Talk: dice-focused bots
INSERT INTO room_members (room_id, user_id, joined_at)
SELECT r.id, u.id, now() - (floor(random() * 40) || ' hours')::interval
FROM rooms r
CROSS JOIN users u
WHERE r.name = '🎲 Dice Talk'
  AND u.username IN ('marcus_504','dre_day','bigt_225','rell_world','tee_time','lilrob_','nia_nia','jaylen_g')
ON CONFLICT (room_id, user_id) DO NOTHING;

-- King's Court: grinder bots
INSERT INTO room_members (room_id, user_id, joined_at)
SELECT r.id, u.id, now() - (floor(random() * 30) || ' hours')::interval
FROM rooms r
CROSS JOIN users u
WHERE r.name = '👑 King''s Court'
  AND u.username IN ('keisha_k','nia_nia','marcus_504','dre_day','rell_world','jas_mine','coco_locs')
ON CONFLICT (room_id, user_id) DO NOTHING;
