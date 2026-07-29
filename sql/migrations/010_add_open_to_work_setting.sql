-- Migration: Add enable_open_to_work setting
-- Version: 1.0.0

-- Insert default setting for Open to Work badge
INSERT INTO user_settings (key, title, description, type) VALUES
    ('enable_open_to_work', 'Show Open to Opportunities Badge', 'true', 'toggle')
ON CONFLICT (key) DO NOTHING;