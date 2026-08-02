-- Rollback for Migration 019: Drop social_links table

DROP TRIGGER IF EXISTS trigger_update_social_links_updated_at ON social_links;
DROP FUNCTION IF EXISTS update_social_links_updated_at();
DROP TABLE IF EXISTS social_links;