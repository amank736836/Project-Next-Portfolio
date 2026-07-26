-- Rollback: 002_add_is_hidden
-- Generated: 2026-07-26

DROP INDEX IF EXISTS idx_experience_is_hidden;
DROP INDEX IF EXISTS idx_education_is_hidden;

ALTER TABLE experience DROP COLUMN IF EXISTS is_hidden;
ALTER TABLE education DROP COLUMN IF EXISTS is_hidden;