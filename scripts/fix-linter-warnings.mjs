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
    -- Fix function search_path mutability
    ALTER FUNCTION public.update_user_settings_updated_at() SET search_path = '';
    ALTER FUNCTION public.update_skill_categories_updated_at() SET search_path = '';
    ALTER FUNCTION public.update_hero_images_updated_at() SET search_path = '';
    ALTER FUNCTION public.enforce_single_hero_image() SET search_path = '';
    ALTER FUNCTION public.enforce_single_active_resume() SET search_path = '';
    ALTER FUNCTION public.update_social_links_updated_at() SET search_path = '';

    -- Fix exec_sql: restrict to service_role only
    REVOKE EXECUTE ON FUNCTION public.exec_sql(text) FROM anon, authenticated;

    -- Fix education RLS
    DROP POLICY IF EXISTS "Allow all for education" ON education;
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

    -- Fix experience RLS
    DROP POLICY IF EXISTS "Allow all for experience" ON experience;
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

    -- Fix skills RLS
    DROP POLICY IF EXISTS "Allow all for authenticated users" ON skills;
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
  `;
  
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 60) + '...');
  }
}

run();