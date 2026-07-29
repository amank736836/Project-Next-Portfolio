-- Table: user_settings
-- Description: User-configurable site settings and feature toggles
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    type TEXT DEFAULT 'boolean' CHECK (type IN ('boolean', 'string', 'number', 'json')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_settings IS 'User-configurable site settings and feature toggles';
COMMENT ON COLUMN user_settings.key IS 'Unique identifier for the setting';
COMMENT ON COLUMN user_settings.title IS 'Human-readable label for admin UI';
COMMENT ON COLUMN user_settings.description IS 'Value of the setting (stored as text)';
COMMENT ON COLUMN user_settings.type IS 'Data type for validation: boolean, string, number, json';

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON user_settings FOR SELECT USING (true);

-- Allow admin write (separate policies for each operation)
CREATE POLICY "Allow admin insert" ON user_settings FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow admin update" ON user_settings FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Allow admin delete" ON user_settings FOR DELETE USING (auth.role() = 'service_role');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Default settings
INSERT INTO user_settings (key, title, description, type) VALUES
    ('enable_scroll_reveal', 'Enable Scroll Reveal Animations', 'true', 'boolean'),
    ('enable_typewriter', 'Enable Typewriter Effect', 'true', 'boolean')
ON CONFLICT (key) DO NOTHING;