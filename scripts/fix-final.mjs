import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

dotenv.config({ path: join(PROJECT_ROOT, '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function run() {
  const sql = `
    -- Fix function search_path mutability (update_user_settings_updated_at was missed)
    ALTER FUNCTION public.update_user_settings_updated_at() SET search_path = '';
    
    -- Fix exec_sql: restrict to service_role only (revoke from PUBLIC, anon, authenticated)
    REVOKE EXECUTE ON FUNCTION public.exec_sql(text) FROM PUBLIC, anon, authenticated;
    
    -- Fix education: drop old "Allow all" policy
    DROP POLICY IF EXISTS "Allow all for education" ON education;
    
    -- Fix experience: drop old "Allow all" policy
    DROP POLICY IF EXISTS "Allow all for experience" ON experience;
    
    -- Fix skills: drop old "Allow all" policy
    DROP POLICY IF EXISTS "Allow all for authenticated users" ON skills;
  `;
  
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 70) + '...');
  }
  
  console.log('All remaining fixes applied');
}
run();