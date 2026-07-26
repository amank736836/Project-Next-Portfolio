-- Migration: 003_add_project_fields
-- Description: Add description and image columns to projects table
-- Date: 2026-07-20

ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT;