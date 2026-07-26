-- Rollback: 003_add_project_fields
-- Generated: 2026-07-26

ALTER TABLE projects DROP COLUMN IF EXISTS description;
ALTER TABLE projects DROP COLUMN IF EXISTS image;