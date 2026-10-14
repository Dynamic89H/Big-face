# Big Face — production codebase

Real-time social chat + video platform. Monorepo:

- `packages/backend` — Node 20 + TypeScript + Express + Socket.io + PostgreSQL + Stripe
- `packages/frontend` — React 18 + TypeScript + Vite SPA (dark charcoal theme)

Full API + realtime event reference: [`API_CONTRACT.md`](API_CONTRACT.md).

## Quick start (Docker — recommended)

```bash
cp .env.example .env
# Edit .env: set JWT_SECRET (openssl rand -hex 32).
# Stripe keys are optional for boot; payments show "not configured" without them.
docker compose up --build
```

- App: http://localhost:8080
- API: http://localhost:4000/api/health
- Migrations run automatically on backend boot (`AUTO_MIGRATE=true`), including the avatar catalog seed.

## Local dev (without Docker)

Needs PostgreSQL 16 running locally.

```bash
# backend
cd packages/backend
cp ../../.env.example .env   # then set DATABASE_URL to localhost + JWT_SECRET
npm install
npm run migrate
npm run dev                  # :4000

# frontend (second terminal)
cd packages/frontend
npm install
npm run dev                  # :5173, proxies /api + /socket.io to :4000
```

## Stripe setup (TODO for production)

1. Create an account at https://dashboard.stripe.com and get **test** keys first.
2. Put them in `.env`: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and `VITE_STRIPE_PUBLISHABLE_KEY` (rebuild frontend after changing).
3. Products: token packs are created ad-hoc as PaymentIntents (no dashboard products needed).
4. Webhook: point `POST /api/stripe/webhook` at your backend URL; paste the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Payouts: creators connect via Stripe Connect Express (`/api/earnings/connect`). Payouts require the platform to have a Connect setup and sufficient balance — test in Stripe test mode first.
6. Webhook signature verification is enforced; unsigned requests are rejected.

## Deploying

### Railway / Render (easiest)
- Create a PostgreSQL addon; set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (your public URL), Stripe keys.
- Deploy `packages/backend` as a Node service (`npm ci && npm run build && node dist/index.js`).
- Deploy `packages/frontend` as a static site (`npm ci && npm run build`, publish `dist/`). Point its API at the backend URL (set `VITE_API_URL` at build time, or keep the nginx proxy setup).
- Run migrations once: `npm run migrate` against the production `DATABASE_URL`.

### VPS (Docker)
- Copy the repo, set `.env`, `docker compose up -d --build`. Put a reverse proxy (Caddy/Nginx) with TLS in front of port 8080.

## Weekly crowning

Face King / Face Queen / Color of the Week are computed by `POST /api/admin/crown-week` (admin JWT required). Run it weekly via cron against your backend, e.g.:

```bash
curl -X POST https://your-backend/api/admin/crown-week \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"weekStart":"2026-10-19"}'
```

This writes the `legendary_weeks` row and fires the `red:carpet` realtime event to all connected clients.

## Scaling notes

- Single-instance Socket.io is fine to start. For multiple backend replicas, add the `@socket.io/redis-adapter` and a Redis service.
- Uploads live on a Docker volume (`/data/uploads`). For multi-node or CDN, swap `src/routes/uploads.ts` to S3-compatible storage.
- Never commit `.env`. Rotate `JWT_SECRET` if it leaks (all sessions invalidate).
