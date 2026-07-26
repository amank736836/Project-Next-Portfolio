-- Portfolio Database Schema
-- Generated: 2026-07-26T16:09:25.598Z
-- DO NOT EDIT DIRECTLY - Edit files in sql/tables/, sql/indexes/, sql/functions/

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
    percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE skills IS 'Technical skills with proficiency percentages';
COMMENT ON COLUMN skills.title IS 'Skill name (e.g., React, TypeScript)';
COMMENT ON COLUMN skills.percentage IS 'Proficiency percentage (0-100)';

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
