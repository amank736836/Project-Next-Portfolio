-- Migration: Add description and image columns to projects
-- Date: 2026-07-20
-- The admin CMS (EditProjectForm) saves a "Strategic Overview" (description)
-- and an "image" URL (in addition to the existing "img" column). These columns
-- were missing from the original schema, causing project create/update to fail.

ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT;
