/**
 * Database helpers.
 *
 * These are intentionally tiny: the harness uses `pg` (already in
 * `scripts/package.json`) to verify migrations, RLS, and triggers.
 *
 * The DB tests live under harness/automation/database/.
 */

import pg from 'pg';
const { Pool } = pg;

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required for DB tests');
  }
  return new Pool({ connectionString: url, ssl: process.env.PGSSL === '1' ? { rejectUnauthorized: false } : undefined });
}

export async function withConn(fn) {
  const pool = getPool();
  const conn = await pool.connect();
  try {
    return await fn(conn);
  } finally {
    conn.release();
    await pool.end();
  }
}
