import { Pool } from 'pg';
import { config } from './config';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  // Sensible default for a single Node process; tune via env if needed.
  max: 20,
});

pool.on('error', (err) => {
  // A pool-level error (e.g. idle client failure) shouldn't silently vanish.
  console.error('[db] unexpected pool error', err);
});
