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
    DROP POLICY IF EXISTS "Admins can view CSP reports" ON csp_reports;
    
    CREATE POLICY "Admins can view CSP reports" ON csp_reports
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );
  `;
  
  const statements = sql.split(';').filter(s => s.trim());
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 60) + '...');
  }
}

run();