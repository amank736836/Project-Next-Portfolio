-- Table: experience
-- Description: Stores work experience entries
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS experience (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE experience IS 'Work experience entries';
COMMENT ON COLUMN experience.year IS 'Year range (e.g., Sep 2025 - Present)';
COMMENT ON COLUMN experience.title IS 'Role and company (HTML allowed for styling)';
COMMENT ON COLUMN experience.description IS 'Job description and achievements';
COMMENT ON COLUMN experience.is_hidden IS 'Soft delete flag - hidden from public portfolio';