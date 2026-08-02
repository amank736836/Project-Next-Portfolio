-- Migration 022: Clean up old social link rows from personal_info
-- Remove rows that were migrated to social_links table

DELETE FROM personal_info
WHERE key IN ('linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'email', 'website', 'codolio');