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