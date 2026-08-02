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
    -- Enable RLS on both tables
    ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

    -- Policies for resumes
    DROP POLICY IF EXISTS "Public can view active resume" ON resumes;
    DROP POLICY IF EXISTS "Admins can manage resumes" ON resumes;
    
    CREATE POLICY "Public can view active resume" ON resumes
        FOR SELECT
        USING (is_active = TRUE);

    CREATE POLICY "Admins can manage resumes" ON resumes
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );

    -- Ensure _migrations policy exists
    DROP POLICY IF EXISTS "Admins can view migrations" ON _migrations;
    CREATE POLICY "Admins can view migrations" ON _migrations
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );
  `;
  
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 70) + '...');
  }
}

run();