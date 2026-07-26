-- Migration: 001_initial_schema
-- Description: Initial database schema for portfolio
-- Created: 2026-01-01

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