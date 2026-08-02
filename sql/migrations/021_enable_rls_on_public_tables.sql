-- Migration 021: Enable RLS on _migrations and resumes tables

-- _migrations table
ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

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

-- resumes table (check if RLS is enabled, if not enable it)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Public can view active resume
DROP POLICY IF EXISTS "Public can view active resume" ON resumes;
CREATE POLICY "Public can view active resume" ON resumes
    FOR SELECT
    USING (is_active = TRUE);

-- Admins can manage all resumes
DROP POLICY IF EXISTS "Admins can manage resumes" ON resumes;
CREATE POLICY "Admins can manage resumes" ON resumes
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );