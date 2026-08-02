-- Rollback for 016_add_is_hidden_to_skills
DROP INDEX IF EXISTS idx_skills_is_hidden;
ALTER TABLE skills DROP COLUMN IF EXISTS is_hidden;