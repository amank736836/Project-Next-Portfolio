-- ============================================================================
-- SETUP SCRIPT FOR SUPABASE
-- Run this in Supabase Dashboard > SQL Editor to enable migration runner
-- ============================================================================

-- 1. Create exec_sql function (allows running raw SQL via RPC)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Try to execute and return results
  BEGIN
    RETURN QUERY EXECUTE sql;
  EXCEPTION WHEN feature_not_supported THEN
    -- For statements that don't return rows (DDL like ALTER, CREATE, etc.)
    EXECUTE sql;
    RETURN QUERY SELECT jsonb_build_object('status', 'ok');
  END;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

-- Grant execute to service_role (used by our migration scripts)
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- 2. Create _migrations tracking table
CREATE TABLE IF NOT EXISTS _migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    checksum TEXT NOT NULL,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    rolled_back_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_migrations_applied_at ON _migrations(applied_at);

-- Grant permissions
GRANT ALL ON _migrations TO service_role;

-- 3. Apply initial schema (if tables don't exist)
-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    img TEXT,
    image TEXT,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE projects IS 'Portfolio projects with images, descriptions, and metadata';
COMMENT ON COLUMN projects.img IS 'Legacy image path column (kept for backward compatibility)';
COMMENT ON COLUMN projects.image IS 'Primary image URL (Cloudinary or local path)';
COMMENT ON COLUMN projects.description IS 'Strategic overview / detailed description of the project';
COMMENT ON COLUMN projects.details IS 'JSONB array of project detail objects (tech stack, links, etc.)';
COMMENT ON COLUMN projects.is_hidden IS 'Soft delete flag - hidden from public portfolio';

-- Personal Info Table
CREATE TABLE IF NOT EXISTS personal_info (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON projects(is_hidden);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_education_is_hidden ON education(is_hidden);
CREATE INDEX IF NOT EXISTS idx_experience_is_hidden ON experience(is_hidden);

-- 4. Record initial migration as applied
INSERT INTO _migrations (id, name, checksum)
VALUES ('001_initial_schema', 'Initial schema', 'manual_setup')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'Setup complete!' as status;
SELECT * FROM _migrations;