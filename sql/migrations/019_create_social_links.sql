-- Migration 019: Create social_links table and migrate from personal_info
-- Run: npx tsx scripts/run-migration.mjs 019_create_social_links.sql

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL DEFAULT '',
    label TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_hidden ON social_links(is_hidden);

-- RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible social links" ON social_links;
CREATE POLICY "Public can view visible social links" ON social_links
    FOR SELECT
    USING (is_hidden = FALSE);

DROP POLICY IF EXISTS "Admins can manage social links" ON social_links;
CREATE POLICY "Admins can manage social links" ON social_links
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

-- Migrate existing data from personal_info
INSERT INTO social_links (platform, url, label, icon, display_order, is_hidden)
SELECT 
    key as platform,
    description as url,
    CASE 
        WHEN key = 'email' THEN 'Email'
        WHEN key = 'website' THEN 'Website'
        WHEN key = 'linkedin' THEN 'LinkedIn'
        WHEN key = 'github' THEN 'GitHub'
        WHEN key = 'twitter' THEN 'X (Twitter)'
        WHEN key = 'facebook' THEN 'Facebook'
        WHEN key = 'instagram' THEN 'Instagram'
        WHEN key = 'threads' THEN 'Threads'
        WHEN key = 'snapchat' THEN 'Snapchat'
        WHEN key = 'telegram' THEN 'Telegram'
        WHEN key = 'codolio' THEN 'Codolio'
        ELSE initcap(key)
    END as label,
    key as icon,
    CASE key
        WHEN 'linkedin' THEN 1
        WHEN 'github' THEN 2
        WHEN 'twitter' THEN 3
        WHEN 'facebook' THEN 4
        WHEN 'instagram' THEN 5
        WHEN 'threads' THEN 6
        WHEN 'snapchat' THEN 7
        WHEN 'telegram' THEN 8
        WHEN 'email' THEN 9
        WHEN 'website' THEN 10
        WHEN 'codolio' THEN 11
        ELSE 99
    END as display_order,
    COALESCE(is_hidden, FALSE) as is_hidden
FROM personal_info
WHERE key IN ('linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'email', 'website', 'codolio')
ON CONFLICT (platform) DO UPDATE SET
    url = EXCLUDED.url,
    label = EXCLUDED.label,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order,
    is_hidden = EXCLUDED.is_hidden,
    updated_at = NOW();

-- Trigger to auto-update updated_at (already created separately)
-- CREATE OR REPLACE FUNCTION update_social_links_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- DROP TRIGGER IF EXISTS trigger_update_social_links_updated_at ON social_links;
-- CREATE TRIGGER trigger_update_social_links_updated_at
--     BEFORE UPDATE ON social_links
--     FOR EACH ROW
--     EXECUTE FUNCTION update_social_links_updated_at();