-- Rollback: 004_add_site_mode
-- Generated: 2026-07-26

DELETE FROM personal_info WHERE key = 'site_mode';