import fs from 'fs';
import { createServer, Server as HttpServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { z } from 'zod';
import { config } from './config';
import { HttpError } from './util';
import { initSockets } from './sockets';

import authRouter from './routes/auth';
import usersRouter from './routes/users';
import friendsRouter from './routes/friends';
import lifestyleRouter from './routes/lifestyle';
import battlesRouter from './routes/battles';
import crewsRouter from './routes/crews';
import artistsRouter from './routes/artists';
import gambleRouter from './routes/gamble';
import pushRouter from './routes/push';
import factoryRouter from './routes/factory';
import roomsRouter from './routes/rooms';
import messagesRouter from './routes/messages';
import uploadsRouter from './routes/uploads';
import mediaRouter from './routes/media';
import avatarRouter from './routes/avatar';
import walletRouter from './routes/wallet';
import stripeRouter from './routes/stripe';
import giftsRouter from './routes/gifts';
import earningsRouter from './routes/earnings';
import throneRouter from './routes/throne';
import engagementRouter from './routes/engagement';
import shopRouter from './routes/shop';
import competitionRouter from './routes/competition';
import socialRouter from './routes/social';
import adminRouter from './routes/admin';
import reportsRouter from './routes/reports';
import videoRouter from './routes/video';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(morgan('dev'));

// The Stripe webhook needs the RAW body for signature verification, so it is
// mounted with express.raw and excluded from express.json.
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/stripe/webhook') return next();
  return express.json({ limit: '2mb' })(req, res, next);
});

app.use('/uploads', express.static(config.uploadDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/lifestyle', lifestyleRouter);
app.use('/api/battles', battlesRouter);
app.use('/api/crews', crewsRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/gamble', gambleRouter);
app.use('/api/push', pushRouter);
app.use('/api/factory', factoryRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api', messagesRouter); // /rooms/:id/messages, /messages/:id/...
app.use('/api/uploads', uploadsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/avatar', avatarRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/gifts', giftsRouter);
app.use('/api/earnings', earningsRouter);
app.use('/api/throne', throneRouter);
app.use('/api/engagement', engagementRouter);
app.use('/api/shop', shopRouter);
app.use('/api/competition', competitionRouter);
app.use('/api/social', socialRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportsRouter);
app.use('/api', videoRouter); // /rooms/:id/video/start, /video/sessions/:id/end

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler — always responds { error: message }.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    res.status(400).json({ error: message });
    return;
  }
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err && typeof err === 'object' && (err as { code?: string }).code === '23505') {
    res.status(409).json({ error: 'Already exists' });
    return;
  }
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function boot(): Promise<void> {
  fs.mkdirSync(config.uploadDir, { recursive: true });

  // Migrations are idempotent (tracked in schema_migrations) — always run on boot
  // so deploys never miss a schema change.
  console.log('[boot] running migrations');
  const { runMigrations } = await import('./migrate');
  await runMigrations();

  const server: HttpServer = createServer(app);
  initSockets(server);
  server.listen(config.port, () => {
    console.log(`[boot] Big Face backend listening on :${config.port}`);
  });
}

boot().catch((err) => {
  console.error('[boot] failed to start', err);
  process.exit(1);
});
