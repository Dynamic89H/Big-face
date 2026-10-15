import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler } from '../util';
import { requireAuth } from '../middleware/auth';
import { getVapidPublicKey, pushToUser } from '../services/push';

const router = Router();

// Get VAPID public key for subscription.
router.get('/vapid-key', (_req, res) => {
  res.json({ publicKey: getVapidPublicKey() });
});

// Subscribe a device for push notifications.
router.post(
  '/subscribe',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { endpoint, p256dh, auth, lang } = z.object({
      endpoint: z.string().url(),
      p256dh: z.string(),
      auth: z.string(),
      lang: z.string().optional(),
    }).parse(req.body);

    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) DO UPDATE SET user_id = $1, p256dh = $3, auth = $4`,
      [req.user!.id, endpoint, p256dh, auth]
    );

    // Save user's language for localized notifications.
    if (lang) {
      await pool.query('UPDATE users SET preferred_lang = $1 WHERE id = $2', [lang, req.user!.id]);
    }

    res.json({ ok: true });
  })
);

// Unsubscribe a device.
router.post(
  '/unsubscribe',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { endpoint } = z.object({ endpoint: z.string() }).parse(req.body);
    await pool.query(
      'DELETE FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2',
      [req.user!.id, endpoint]
    );
    res.json({ ok: true });
  })
);

// Test notification (for the user to verify it works).
router.post(
  '/test',
  requireAuth,
  asyncHandler(async (req, res) => {
    const sent = await pushToUser(req.user!.id, {
      title: '👑 Big Face',
      body: 'Notifications are on! You\'ll hear from us every day.',
      url: '/',
    });
    res.json({ ok: true, sent });
  })
);

export default router;
