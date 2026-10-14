import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { config } from './config';

/**
 * Applies every src/migrations/*.sql in filename order.
 * Idempotent: applied filenames are tracked in `schema_migrations`,
 * and each migration runs inside its own transaction.
 */
export async function runMigrations(): Promise<void> {
  const pool = new Pool({ connectionString: config.databaseUrl });
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    const dir = join(__dirname, 'migrations');
    const files = readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
    const { rows } = await client.query('SELECT filename FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.filename as string));

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`[migrate] skip ${file} (already applied)`);
        continue;
      }
      const sql = readFileSync(join(dir, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`[migrate] applied ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[migrate] FAILED ${file}`);
        throw err;
      }
    }
    console.log('[migrate] done');
  } finally {
    client.release();
    await pool.end();
  }
}

// `npm run migrate` (tsx src/migrate.ts) or `node dist/migrate.js`.
const invokedDirectly = !!process.argv[1] && /migrate\.(ts|js)$/.test(process.argv[1]);
if (invokedDirectly) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
