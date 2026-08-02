import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

dotenv.config({ path: join(PROJECT_ROOT, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    // Fix function search_path mutability
    await client.query(`ALTER FUNCTION public.update_user_settings_updated_at() SET search_path = '';`);
    console.log('Fixed update_user_settings_updated_at search_path');
    
    // Fix exec_sql: restrict to service_role only
    await client.query(`REVOKE EXECUTE ON FUNCTION public.exec_sql(text) FROM PUBLIC, anon, authenticated;`);
    console.log('Revoked exec_sql from PUBLIC, anon, authenticated');
    
    // Fix education: drop old "Allow all" policy
    await client.query(`DROP POLICY IF EXISTS "Allow all for education" ON education;`);
    console.log('Dropped Allow all for education policy');
    
    // Fix experience: drop old "Allow all" policy
    await client.query(`DROP POLICY IF EXISTS "Allow all for experience" ON experience;`);
    console.log('Dropped Allow all for experience policy');
    
    // Fix skills: drop old "Allow all" policy
    await client.query(`DROP POLICY IF EXISTS "Allow all for authenticated users" ON skills;`);
    console.log('Dropped Allow all for authenticated users policy');
    
    console.log('All fixes applied via direct PG connection');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}
run();