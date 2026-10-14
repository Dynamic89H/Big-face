import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';

const router = Router();

const createReportSchema = z.object({
  targetType: z.enum(['user', 'message', 'media']),
  targetId: z.string().uuid(),
  reason: z.string().min(1).max(1000),
});

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createReportSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO reports (reporter_id, target_type, target_id, reason)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user!.id, body.targetType, body.targetId, body.reason]
    );
    const r = rows[0];
    res.status(201).json({
      report: {
        id: String(r.id),
        reporterId: String(r.reporter_id),
        targetType: r.target_type,
        targetId: String(r.target_id),
        reason: r.reason,
        status: r.status,
        createdAt: new Date(r.created_at).toISOString(),
      },
    });
  })
);

export default router;
