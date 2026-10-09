-- Portfolio Database Schema
-- Generated: 2026-07-28T01:55:09.864Z
-- DO NOT EDIT DIRECTLY - Edit files in sql/tables/, sql/indexes/, sql/functions/

-- ===================================================================
-- Table: api_logs
-- ===================================================================
-- Table: api_logs
-- Description: Stores API call history for debugging and monitoring
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS api_logs (
    id BIGSERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    request_body JSONB,
    request_headers JSONB,
    response_body JSONB,
    error_message TEXT,
    error_stack TEXT,
    duration_ms INTEGER,
    user_id UUID,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE api_logs IS 'API call history for debugging and monitoring';
COMMENT ON COLUMN api_logs.endpoint IS 'API endpoint path';
COMMENT ON COLUMN api_logs.method IS 'HTTP method';
COMMENT ON COLUMN api_logs.status_code IS 'HTTP response status code';
COMMENT ON COLUMN api_logs.request_body IS 'Request payload (sanitized)';
COMMENT ON COLUMN api_logs.request_headers IS 'Request headers (sanitized)';
COMMENT ON COLUMN api_logs.response_body IS 'Response payload (sanitized)';
COMMENT ON COLUMN api_logs.error_message IS 'Error message if request failed';
COMMENT ON COLUMN api_logs.error_stack IS 'Error stack trace if applicable';
COMMENT ON COLUMN api_logs.duration_ms IS 'Request duration in milliseconds';
COMMENT ON COLUMN api_logs.user_id IS 'Authenticated user ID if available';
COMMENT ON COLUMN api_logs.user_agent IS 'Client user agent';
COMMENT ON COLUMN api_logs.ip_address IS 'Client IP address';

-- Enable RLS
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Service role read access only (for the admin dashboard API route).
-- The anon key is public, so api_logs must never be world-readable: it
-- contains IPs, user agents, error stacks and request/response bodies.
CREATE POLICY "Service role read access" ON api_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Service role write access (for API logging)
CREATE POLICY "Service role write access" ON api_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_api_logs_error ON api_logs(error_message) WHERE error_message IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_api_logs_duration ON api_logs(duration_ms DESC);

-- ===================================================================
-- Table: education
-- ===================================================================
-- Table: education
-- Description: Stores education history entries
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE education IS 'Education history entries';
COMMENT ON COLUMN education.year IS 'Year range (e.g., Sep 2021 - May 2025)';
COMMENT ON COLUMN education.title IS 'Degree and institution (HTML allowed for styling)';
COMMENT ON COLUMN education.description IS 'Additional details about the education';
COMMENT ON COLUMN education.is_hidden IS 'Soft delete flag - hidden from public portfolio';

-- ===================================================================
-- Table: experience
-- ===================================================================
-- Table: experience
-- Description: Stores work experience entries
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE experience IS 'Work experience entries';
COMMENT ON COLUMN experience.year IS 'Year range (e.g., Sep 2025 - Present)';
COMMENT ON COLUMN experience.title IS 'Role and company (HTML allowed for styling)';
COMMENT ON COLUMN experience.description IS 'Job description and achievements';
COMMENT ON COLUMN experience.is_hidden IS 'Soft delete flag - hidden from public portfolio';

-- ===================================================================
-- Table: personal_info
-- ===================================================================
-- Table: personal_info
-- Description: Key-value store for personal information and site settings
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS personal_info (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE personal_info IS 'Key-value store for personal information, social links, and site settings';
COMMENT ON COLUMN personal_info.key IS 'Unique identifier for the info item';
COMMENT ON COLUMN personal_info.title IS 'Human-readable label';
COMMENT ON COLUMN personal_info.description IS 'Value/content of the info item';

-- Enable RLS (no public read policy: personal data is served via the
-- service-role /api/info route, which filters is_hidden)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage personal info" ON personal_info
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

CREATE POLICY "Service role full access on personal info" ON personal_info
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ===================================================================
-- Table: projects
-- ===================================================================
-- Table: projects
-- Description: Stores portfolio projects with details, images, and metadata
-- Version: 1.0.0
-- Dependencies: none

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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible projects" ON projects
    FOR SELECT USING (is_hidden = FALSE);

CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

CREATE POLICY "Service role full access on projects" ON projects
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- ===================================================================
-- Table: skills
-- ===================================================================
-- Table: skills
-- Description: Stores skill names and proficiency percentages
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    percentage INTEGER NOT NULL DEFAULT 85 CHECK (percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE skills IS 'Technical skills with proficiency percentages';
COMMENT ON COLUMN skills.title IS 'Skill name (e.g., React, TypeScript)';
COMMENT ON COLUMN skills.percentage IS 'Proficiency percentage (0-100)';

-- ===================================================================
-- Table: user_settings
-- ===================================================================
-- Table: user_settings
-- Description: User-configurable site settings and feature toggles
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    type TEXT DEFAULT 'boolean' CHECK (type IN ('boolean', 'string', 'number', 'json')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_settings IS 'User-configurable site settings and feature toggles';
COMMENT ON COLUMN user_settings.key IS 'Unique identifier for the setting';
COMMENT ON COLUMN user_settings.title IS 'Human-readable label for admin UI';
COMMENT ON COLUMN user_settings.description IS 'Value of the setting (stored as text)';
COMMENT ON COLUMN user_settings.type IS 'Data type for validation: boolean, string, number, json';

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON user_settings FOR SELECT USING (true);

-- Allow admin write (separate policies for each operation)
CREATE POLICY "Allow admin insert" ON user_settings FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow admin update" ON user_settings FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Allow admin delete" ON user_settings FOR DELETE USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Default settings
INSERT INTO user_settings (key, title, description, type) VALUES
    ('enable_scroll_reveal', 'Enable Scroll Reveal Animations', 'true', 'boolean'),
    ('enable_typewriter', 'Enable Typewriter Effect', 'true', 'boolean')
ON CONFLICT (key) DO NOTHING;

-- ===================================================================
-- Indexes
-- ===================================================================
-- Indexes: personal_info
-- Version: 1.0.0

-- Primary key on 'key' is automatic, no additional indexes needed

-- Indexes: projects
-- Version: 1.0.0

CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON projects(is_hidden);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
