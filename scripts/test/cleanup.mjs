import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing env vars:', { url: !!url, serviceKey: !!serviceKey });
  process.exit(1);
}

const client = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const cleanup = [
  'DROP POLICY IF EXISTS "Admin update access" ON user_settings;',
  'DROP POLICY IF EXISTS "Admin delete access" ON user_settings;',
  'DROP POLICY IF EXISTS "Admin insert access" ON user_settings;',
  'DROP POLICY IF EXISTS "Admin write access" ON user_settings;',
  'DROP POLICY IF EXISTS "Allow admin write" ON user_settings;',
  'DROP POLICY IF EXISTS "Allow admin insert" ON user_settings;',
  'DROP POLICY IF EXISTS "Allow admin update" ON user_settings;',
  'DROP POLICY IF EXISTS "Allow admin delete" ON user_settings;',
  'DROP POLICY IF EXISTS "Allow admin write" ON api_logs;',
  'DROP POLICY IF EXISTS "Service role write access" ON api_logs;',
  'DROP TABLE IF EXISTS user_settings CASCADE;',
  'DROP TABLE IF EXISTS api_logs CASCADE;',
  "DELETE FROM _migrations WHERE id IN ('005_add_user_settings', '006_add_api_logs');"
];

async function main() {
  for (const sql of cleanup) {
    const { error } = await client.rpc('exec_sql', { sql });
    if (error) console.log('Warning:', error.message);
    else console.log('OK:', sql.substring(0, 50));
  }
  console.log('Cleanup done');
}

main().catch(console.error);