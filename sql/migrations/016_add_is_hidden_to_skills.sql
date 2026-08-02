-- Migration 016: Add is_hidden to skills
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_skills_is_hidden ON skills(is_hidden);