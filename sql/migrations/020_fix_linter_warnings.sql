-- Migration 020: Fix Supabase linter warnings
-- Function search_path, RLS policies, SECURITY DEFINER exposure

-- Fix function search_path mutability
ALTER FUNCTION public.update_user_settings_updated_at() SET search_path = '';
ALTER FUNCTION public.update_skill_categories_updated_at() SET search_path = '';
ALTER FUNCTION public.update_hero_images_updated_at() SET search_path = '';
ALTER FUNCTION public.enforce_single_hero_image() SET search_path = '';
ALTER FUNCTION public.enforce_single_active_resume() SET search_path = '';
ALTER FUNCTION public.update_social_links_updated_at() SET search_path = '';

-- Fix exec_sql: restrict to service_role only (remove anon/authenticated execute)
REVOKE EXECUTE ON FUNCTION public.exec_sql(text) FROM anon, authenticated;
-- Keep for service_role (used by migration runner)

-- Fix overly permissive RLS policies

-- education: restrict to authenticated users for write, public read for visible
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

-- experience: restrict to authenticated users for write, public read for visible
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

-- skills: restrict to authenticated users for write, public read for visible
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