-- Table: personal_info
-- Description: Key-value store for personal information and site settings
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS personal_info (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE personal_info IS 'Key-value store for personal information, social links, and site settings';
COMMENT ON COLUMN personal_info.key IS 'Unique identifier for the info item';
COMMENT ON COLUMN personal_info.title IS 'Human-readable label';
COMMENT ON COLUMN personal_info.description IS 'Value/content of the info item';
-- Enable RLS
-- NOTE: there is intentionally NO public read policy. personal_info holds
-- personal data (phone, address, ...) and is served publicly only through
-- /api/info, which runs with the service role and filters is_hidden.
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

-- Admins can manage all info rows
CREATE POLICY "Admins can manage personal info" ON personal_info
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

-- Service role full access (used by the server-side API routes)
CREATE POLICY "Service role full access on personal info" ON personal_info
    FOR ALL USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
