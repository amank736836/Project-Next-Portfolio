-- Migration 028: Enable RLS on projects and personal_info
--
-- These two tables had no RLS policies at all, while every other public table
-- (skills, education, experience, social_links, hero_images, ...) got
-- public-read policies in migrations 019-021. The public projects page reads
-- `projects` with the anon browser client, so it needs a public SELECT policy
-- limited to visible rows. `personal_info` is only read through the service
-- role (server-side API routes), so it gets NO public read policy — anon
-- access returns nothing.

-- ===================================================================
-- projects
-- ===================================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible projects" ON projects;
CREATE POLICY "Public can view visible projects" ON projects
    FOR SELECT USING (is_hidden = FALSE);

DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

DROP POLICY IF EXISTS "Service role full access on projects" ON projects;
CREATE POLICY "Service role full access on projects" ON projects
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ===================================================================
-- personal_info
-- ===================================================================
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- Intentionally NO public read policy: personal_info (phone, address, ...)
-- is served publicly only through /api/info, which filters is_hidden and
-- runs with the service role.

DROP POLICY IF EXISTS "Admins can manage personal info" ON personal_info;
CREATE POLICY "Admins can manage personal info" ON personal_info
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

DROP POLICY IF EXISTS "Service role full access on personal info" ON personal_info;
CREATE POLICY "Service role full access on personal info" ON personal_info
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
