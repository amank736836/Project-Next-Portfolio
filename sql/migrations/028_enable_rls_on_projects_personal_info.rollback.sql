-- Rollback for Migration 028: Disable RLS on projects and personal_info

DROP POLICY IF EXISTS "Public can view visible projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Service role full access on projects" ON projects;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage personal info" ON personal_info;
DROP POLICY IF EXISTS "Service role full access on personal info" ON personal_info;
ALTER TABLE personal_info DISABLE ROW LEVEL SECURITY;
