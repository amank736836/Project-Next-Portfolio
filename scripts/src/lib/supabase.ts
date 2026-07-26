import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SERVICE_ROLE_KEY in .env.local'
    );
  }

  supabaseClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  logger.debug('Supabase client initialized');
  return supabaseClient;
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    // exec_sql returns SETOF jsonb, so we need a query that returns jsonb
    const { error } = await client.rpc('exec_sql', { sql: "SELECT '1'::jsonb" });
    if (!error) {
      logger.success('Database connection verified via exec_sql');
      return true;
    }
    logger.debug(`exec_sql test failed: ${error.message}`);
    return false;
  } catch (error) {
    logger.error(`Database connection failed: ${error}`);
    return false;
  }
}

export async function executeSql(sql: string): Promise<void> {
  const client = getSupabaseClient();
  logger.debug(`Executing SQL: ${sql.substring(0, 100)}...`);
  
  const { error } = await client.rpc('exec_sql', { sql });
  if (error) throw new Error(`SQL execution failed: ${error.message}`);
}

export async function runMigration(id: string, sql: string): Promise<void> {
  await executeSql(sql);
  logger.success(`Executed migration: ${id}`);
}

export async function ensureMigrationsTable(): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      rolled_back_at TIMESTAMPTZ
    );
    
    CREATE INDEX IF NOT EXISTS idx_migrations_applied_at ON _migrations(applied_at);
  `;
  
  await executeSql(sql);
  logger.debug('Migrations table verified');
}