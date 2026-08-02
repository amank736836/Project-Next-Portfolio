-- Rollback for 015_add_is_hidden_to_personal_info
DROP INDEX IF EXISTS idx_personal_info_is_hidden;
ALTER TABLE personal_info DROP COLUMN IF EXISTS is_hidden;