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

-- Public can view visible (non-hidden) projects
CREATE POLICY "Public can view visible projects" ON projects
    FOR SELECT USING (is_hidden = FALSE);

-- Admins can manage all projects
CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

-- Service role full access (used by the admin API routes)
CREATE POLICY "Service role full access on projects" ON projects
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
