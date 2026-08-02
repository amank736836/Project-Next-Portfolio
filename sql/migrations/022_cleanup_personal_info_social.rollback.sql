-- Rollback for Migration 022: Re-add social link rows to personal_info
-- Note: This requires the data to be restored from backup or social_links table

-- This rollback is not fully reversible without backup data
-- If needed, re-insert from social_links:
-- INSERT INTO personal_info (key, title, description)
-- SELECT platform, label, url FROM social_links;