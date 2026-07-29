-- Migration: Add user_settings table
-- Version: 1.0.0

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'toggle' CHECK (type IN ('toggle', 'text', 'number', 'select', 'json')),
    options JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_settings IS 'User-configurable site settings and feature toggles';
COMMENT ON COLUMN user_settings.key IS 'Unique identifier for the setting';
COMMENT ON COLUMN user_settings.title IS 'Human-readable label for admin UI';
COMMENT ON COLUMN user_settings.description IS 'Value of the setting (stored as text)';
COMMENT ON COLUMN user_settings.type IS 'Data type for validation: toggle, text, number, select, json';
COMMENT ON COLUMN user_settings.options IS 'JSON options for select type (e.g. ["option1", "option2"])';

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read access" ON user_settings
    FOR SELECT USING (true);

-- Allow admin write
CREATE POLICY "Admin write access" ON user_settings
    FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin update access" ON user_settings
    FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admin delete access" ON user_settings
    FOR DELETE USING (auth.role() = 'service_role');

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_settings_updated_at ON user_settings(updated_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_settings_updated_at ON user_settings;
CREATE TRIGGER trigger_update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_user_settings_updated_at();

-- Insert default settings
INSERT INTO user_settings (key, title, description, type) VALUES
    ('enable_scroll_reveal', 'Enable Scroll Reveal Animations', 'true', 'toggle'),
    ('enable_typewriter', 'Enable Typewriter Effect', 'true', 'toggle')
ON CONFLICT (key) DO NOTHING;