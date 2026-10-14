import dotenv from 'dotenv';

// Load .env in development; in production the environment provides these.
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    // Fail fast: booting without these would only produce confusing runtime errors.
    console.error(`FATAL: required environment variable ${name} is not set.`);
    process.exit(1);
  }
  return value;
}

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    console.error(`FATAL: environment variable ${name} must be an integer, got "${raw}".`);
    process.exit(1);
  }
  return parsed;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  port: int('PORT', 4000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  maxUploadMb: int('MAX_UPLOAD_MB', 25),
};
