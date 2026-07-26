-- Table: education
-- Description: Stores education history entries
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS education (
    id BIGSERIAL PRIMARY KEY,
    year TEXT,
    title TEXT NOT NULL,
    description TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE education IS 'Education history entries';
COMMENT ON COLUMN education.year IS 'Year range (e.g., Sep 2021 - May 2025)';
COMMENT ON COLUMN education.title IS 'Degree and institution (HTML allowed for styling)';
COMMENT ON COLUMN education.description IS 'Additional details about the education';
COMMENT ON COLUMN education.is_hidden IS 'Soft delete flag - hidden from public portfolio';