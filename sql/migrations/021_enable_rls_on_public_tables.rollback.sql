-- Rollback for Migration 021: Disable RLS on _migrations and resumes tables

ALTER TABLE _migrations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view migrations" ON _migrations;

ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active resume" ON resumes;
DROP POLICY IF EXISTS "Admins can manage resumes" ON resumes;