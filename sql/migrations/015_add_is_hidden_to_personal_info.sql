-- Migration 015: Add is_hidden to personal_info
ALTER TABLE personal_info ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_personal_info_is_hidden ON personal_info(is_hidden);