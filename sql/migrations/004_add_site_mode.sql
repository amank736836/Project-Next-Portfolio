-- Migration: 004_add_site_mode
-- Description: Add site_mode setting to personal_info table
-- Date: 2026-07-26

INSERT INTO personal_info (key, title, description)
VALUES ('site_mode', 'Site Mode', 'multi')
ON CONFLICT (key) DO NOTHING;