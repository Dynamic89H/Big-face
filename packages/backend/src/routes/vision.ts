import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db';
import { asyncHandler, HttpError } from '../util';
import { requireAuth } from '../middleware/auth';
import { addTokens } from '../services/tokens';
import { emitToAll, emitToUser } from '../sockets';
import { contributeToVault } from './vault';
import { recordPlatformRevenue } from '../services/platformRevenue';

const router = Router();

// ============ LIVE STREAMS ============

router.get(
  '/streams/live',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT ls.*, u.display_name AS host_name, u.profile_color AS host_color
       FROM live_streams ls JOIN users u ON u.id = ls.host_id
       WHERE ls.status = 'live'
       ORDER BY ls.viewer_count DESC, ls.started_at DESC LIMIT 20`
    );
    res.json({ streams: rows });
  })
);

const streamSchema = z.object({
  title: z.string().min(1).max(100),
  category: z.enum(['just_chatting', 'gambling', 'music', 'gaming']).default('just_chatting'),
});

router.post(
  '/streams/go-live',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, category } = streamSchema.parse(req.body);
    // End any existing live stream by this host
    await pool.query(
      `UPDATE live_streams SET status = 'ended', ended_at = now()
       WHERE host_id = $1 AND status = 'live'`,
      [req.user!.id]
    );
    const { rows } = await pool.query(
      `INSERT INTO live_streams (host_id, title, category) VALUES ($1, $2, $3) RETURNING id`,
      [req.user!.id, title, category]
    );
    emitToAll('vision:stream-live', { streamId: rows[0].id, hostId: req.user!.id, title });
    res.json({ streamId: rows[0].id });
  })
);

router.post(
  '/streams/:id/end',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query(
      `UPDATE live_streams SET status = 'ended', ended_at = now()
       WHERE id = $1 AND host_id = $2`,
      [req.params.id, req.user!.id]
    );
    emitToAll('vision:stream-ended', { streamId: req.params.id });
    res.json({ ok: true });
  })
);

// Tip a streamer with tokens
const tipSchema = z.object({
  amount: z.number().min(10).max(50000),
  message: z.string().max(200).optional(),
});

router.post(
  '/streams/:id/tip',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { amount, message } = tipSchema.parse(req.body);
    const { rows: stream } = await pool.query(
      'SELECT host_id, status FROM live_streams WHERE id = $1',
      [req.params.id]
    );
    if (!stream[0] || stream[0].status !== 'live') throw new HttpError(400, 'Stream not live');
    if (stream[0].host_id === req.user!.id) throw new HttpError(400, "Can't tip yourself");

    const { rows: user } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [
      req.user!.id,
    ]);
    if (Number(user[0].token_balance) < amount) throw new HttpError(400, 'Not enough tokens');

    // 50% to streamer, 40% platform (Dweezy), 10% to Vault
    const streamerCut = Math.floor(amount * 0.5);
    const platformCut = Math.floor(amount * 0.4);
    const vaultCut = amount - streamerCut - platformCut;

    await addTokens(req.user!.id, -amount, 'gift_sent', { reference: `tip:${req.params.id}` });
    await addTokens(stream[0].host_id, streamerCut, 'gift_received', {
      reference: `tip:${req.params.id}`,
    });

    await pool.query(
      `INSERT INTO stream_tips (stream_id, tipper_id, amount, message) VALUES ($1, $2, $3, $4)`,
      [req.params.id, req.user!.id, amount, message || null]
    );
    await pool.query(
      `UPDATE live_streams SET total_tips = total_tips + $1 WHERE id = $2`,
      [amount, req.params.id]
    );

    await contributeToVault(req.user!.id, vaultCut, 'tip').catch(() => undefined);

    // Dweezy's 40% cut on every tip
    await recordPlatformRevenue('tip_margin', platformCut, {
      userId: stream[0].host_id,
      reference: `tip:${req.params.id}`,
      grossCents: amount,
    }).catch(() => undefined);
    emitToUser(stream[0].host_id, 'vision:tip', {
      streamId: req.params.id,
      amount: streamerCut,
      message,
    });
    emitToAll('vision:stream-tip', { streamId: req.params.id, amount });
    res.json({ ok: true, streamerGot: streamerCut });
  })
);

// ============ AUDIO SPACES ============

router.get(
  '/spaces/live',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT asp.*, u.display_name AS host_name,
              (SELECT COUNT(*)::int FROM space_speakers ss WHERE ss.space_id = asp.id) AS speaker_count
       FROM audio_spaces asp JOIN users u ON u.id = asp.host_id
       WHERE asp.status = 'live'
       ORDER BY asp.started_at DESC LIMIT 20`
    );
    res.json({ spaces: rows });
  })
);

const spaceSchema = z.object({
  title: z.string().min(1).max(100),
  topic: z.string().max(200).optional(),
});

router.post(
  '/spaces/start',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, topic } = spaceSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO audio_spaces (host_id, title, topic) VALUES ($1, $2, $3) RETURNING id`,
      [req.user!.id, title, topic || null]
    );
    await pool.query('INSERT INTO space_speakers (space_id, user_id) VALUES ($1, $2)', [
      rows[0].id,
      req.user!.id,
    ]);
    emitToAll('vision:space-live', { spaceId: rows[0].id, title });
    res.json({ spaceId: rows[0].id });
  })
);

// ============ MARKETPLACE ============

router.get(
  '/marketplace',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT ml.*, u.display_name AS seller_name
       FROM marketplace_listings ml JOIN users u ON u.id = ml.seller_id
       WHERE ml.status = 'active'
       ORDER BY ml.created_at DESC LIMIT 50`
    );
    res.json({ listings: rows });
  })
);

const listingSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(10).max(1000000),
  kind: z.enum(['avatar_gear', 'design', 'shoutout_slot', 'other']),
  imageUrl: z.string().optional(),
});

router.post(
  '/marketplace/list',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, description, price, kind, imageUrl } = listingSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO marketplace_listings (seller_id, title, description, price, kind, image_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [req.user!.id, title, description || null, price, kind, imageUrl || null]
    );
    res.json({ listingId: rows[0].id });
  })
);

router.post(
  '/marketplace/:id/buy',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows: listing } = await pool.query(
      'SELECT * FROM marketplace_listings WHERE id = $1 AND status = $2',
      [req.params.id, 'active']
    );
    if (!listing[0]) throw new HttpError(404, 'Listing not available');
    if (listing[0].seller_id === req.user!.id) throw new HttpError(400, "Can't buy your own listing");

    const { rows: buyer } = await pool.query('SELECT token_balance FROM users WHERE id = $1', [
      req.user!.id,
    ]);
    if (Number(buyer[0].token_balance) < listing[0].price) {
      throw new HttpError(400, 'Not enough tokens');
    }

    // 90% seller, 10% platform
    const sellerCut = Math.floor(listing[0].price * 0.9);
    const platformCut = listing[0].price - sellerCut;

    await addTokens(req.user!.id, -listing[0].price, 'gift_sent', {
      reference: `market:${req.params.id}`,
    });
    await addTokens(listing[0].seller_id, sellerCut, 'gift_received', {
      reference: `market:${req.params.id}`,
    });
    await pool.query(`UPDATE marketplace_listings SET status = 'sold' WHERE id = $1`, [
      req.params.id,
    ]);
    await pool.query(
      `INSERT INTO marketplace_sales (listing_id, buyer_id, seller_id, price, platform_cut)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.params.id, req.user!.id, listing[0].seller_id, listing[0].price, platformCut]
    );

    await contributeToVault(req.user!.id, listing[0].price, 'marketplace').catch(() => undefined);
    emitToUser(listing[0].seller_id, 'vision:sale', { listingId: req.params.id, amount: sellerCut });
    res.json({ ok: true });
  })
);

// ============ EVENTS ============

router.get(
  '/events/upcoming',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT e.*, u.display_name AS creator_name,
              (SELECT COUNT(*)::int FROM event_rsvps er WHERE er.event_id = e.id AND er.status = 'going') AS going_count,
              EXISTS(SELECT 1 FROM event_rsvps er WHERE er.event_id = e.id AND er.user_id = $1) AS rsvpd
       FROM events e JOIN users u ON u.id = e.creator_id
       WHERE e.starts_at > now()
       ORDER BY e.starts_at ASC LIMIT 20`,
      [req.user!.id]
    );
    res.json({ events: rows });
  })
);

const eventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startsAt: z.string(),
  kind: z.enum(['general', 'tournament', 'vault_party', 'stream']).default('general'),
});

router.post(
  '/events/create',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, description, startsAt, kind } = eventSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO events (creator_id, title, description, starts_at, kind)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.user!.id, title, description || null, startsAt, kind]
    );
    // Auto-RSVP creator
    await pool.query(`INSERT INTO event_rsvps (event_id, user_id) VALUES ($1, $2)`, [
      rows[0].id,
      req.user!.id,
    ]);
    emitToAll('vision:event', { eventId: rows[0].id, title });
    res.json({ eventId: rows[0].id });
  })
);

router.post(
  '/events/:id/rsvp',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query(
      `INSERT INTO event_rsvps (event_id, user_id) VALUES ($1, $2)
       ON CONFLICT (event_id, user_id) DO UPDATE SET status = 'going'`,
      [req.params.id, req.user!.id]
    );
    res.json({ ok: true });
  })
);

// ============ CLIPS ============

router.get(
  '/clips',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
      `SELECT c.*, u.display_name AS creator_name, u.profile_color AS creator_color
       FROM clips c JOIN users u ON u.id = c.creator_id
       ORDER BY c.created_at DESC LIMIT 30`
    );
    res.json({ clips: rows });
  })
);

const clipSchema = z.object({
  title: z.string().min(1).max(100),
  mediaUrl: z.string().min(1),
  sourceType: z.string().optional(),
  sourceId: z.string().optional(),
});

router.post(
  '/clips',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, mediaUrl, sourceType, sourceId } = clipSchema.parse(req.body);
    const { rows } = await pool.query(
      `INSERT INTO clips (creator_id, title, media_url, source_type, source_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.user!.id, title, mediaUrl, sourceType || null, sourceId || null]
    );
    res.json({ clipId: rows[0].id });
  })
);

router.post(
  '/clips/:id/view',
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query('UPDATE clips SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  })
);

export default router;
