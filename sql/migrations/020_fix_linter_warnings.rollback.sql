-- Rollback for Migration 020: Revert linter fixes

-- Revert function search_path
ALTER FUNCTION public.update_user_settings_updated_at() RESET search_path;
ALTER FUNCTION public.update_skill_categories_updated_at() RESET search_path;
ALTER FUNCTION public.update_hero_images_updated_at() RESET search_path;
ALTER FUNCTION public.enforce_single_hero_image() RESET search_path;
ALTER FUNCTION public.enforce_single_active_resume() RESET search_path;
ALTER FUNCTION public.update_social_links_updated_at() RESET search_path;

-- Revert exec_sql permissions
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO anon, authenticated;

-- Revert RLS policies
DROP POLICY IF EXISTS "Public can view visible education" ON education;
DROP POLICY IF EXISTS "Admins can manage education" ON education;
CREATE POLICY "Allow all for education" ON education FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view visible experience" ON experience;
DROP POLICY IF EXISTS "Admins can manage experience" ON experience;
CREATE POLICY "Allow all for experience" ON experience FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view visible skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
CREATE POLICY "Allow all for authenticated users" ON skills FOR ALL USING (true) WITH CHECK (true);