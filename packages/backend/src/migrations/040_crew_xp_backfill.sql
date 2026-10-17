-- Backfill crew total_xp from current members' XP.
-- The world seed (036) inserted bot users with xp set directly via SQL,
-- bypassing awardXp(), so crews.total_xp stayed 0. This syncs it.
-- Idempotent: recomputes from scratch, safe to re-run.
UPDATE crews c
SET total_xp = COALESCE(sub.total, 0)
FROM (
  SELECT cm.crew_id, COALESCE(SUM(u.xp), 0)::int AS total
  FROM crew_members cm
  JOIN users u ON u.id = cm.user_id
  GROUP BY cm.crew_id
) sub
WHERE c.id = sub.crew_id;
