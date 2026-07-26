-- Rollback: 001_initial_schema
-- Generated: 2026-07-26

DROP INDEX IF EXISTS idx_experience_is_hidden;
DROP INDEX IF EXISTS idx_education_is_hidden;
DROP INDEX IF EXISTS idx_projects_created_at;
DROP INDEX IF EXISTS idx_projects_is_hidden;

DROP TABLE IF EXISTS experience;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS personal_info;
DROP TABLE IF EXISTS projects;