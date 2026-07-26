-- Migration: 002_add_is_hidden
-- Description: Add is_hidden column to education and experience tables
-- Date: 2026-05-04

ALTER TABLE education ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

-- Add indexes for filtering
CREATE INDEX IF NOT EXISTS idx_education_is_hidden ON education(is_hidden);
CREATE INDEX IF NOT EXISTS idx_experience_is_hidden ON experience(is_hidden);