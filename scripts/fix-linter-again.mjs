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
    
    -- Fix csp_reports: restrict INSERT to anonymous (browsers) but no UPDATE/DELETE
    -- The current policy allows INSERT with WITH CHECK true - this is actually needed for CSP reports
    -- But we should add a proper SELECT policy for admins
    DROP POLICY IF EXISTS "Allow CSP report submission" ON csp_reports;
    CREATE POLICY "Allow CSP report submission" ON csp_reports
        FOR INSERT
        WITH CHECK (true);
    -- Admins can view (already exists from migration 018)
    
    -- Fix education: ensure proper policies exist
    DROP POLICY IF EXISTS "Allow all for education" ON education;
    DROP POLICY IF EXISTS "Public can view visible education" ON education;
    DROP POLICY IF EXISTS "Admins can manage education" ON education;
    CREATE POLICY "Public can view visible education" ON education
        FOR SELECT USING (is_hidden = FALSE);
    CREATE POLICY "Admins can manage education" ON education
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );

    -- Fix experience: ensure proper policies exist
    DROP POLICY IF EXISTS "Allow all for experience" ON experience;
    DROP POLICY IF EXISTS "Public can view visible experience" ON experience;
    DROP POLICY IF EXISTS "Admins can manage experience" ON experience;
    CREATE POLICY "Public can view visible experience" ON experience
        FOR SELECT USING (is_hidden = FALSE);
    CREATE POLICY "Admins can manage experience" ON experience
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );

    -- Fix skills: ensure proper policies exist
    DROP POLICY IF EXISTS "Allow all for authenticated users" ON skills;
    DROP POLICY IF EXISTS "Public can view visible skills" ON skills;
    DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
    CREATE POLICY "Public can view visible skills" ON skills
        FOR SELECT USING (is_hidden = FALSE);
    CREATE POLICY "Admins can manage skills" ON skills
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );

    -- Fix exec_sql: restrict to service_role only
    REVOKE EXECUTE ON FUNCTION public.exec_sql(text) FROM anon, authenticated;
  `;
  
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 70) + '...');
  }
  
  console.log('All fixes applied');
}
run();