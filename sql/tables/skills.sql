-- Table: skills
-- Description: Stores skill names and proficiency percentages
-- Version: 1.0.0
-- Dependencies: none

CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    percentage INTEGER NOT NULL DEFAULT 85 CHECK (percentage BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE skills IS 'Technical skills with proficiency percentages';
COMMENT ON COLUMN skills.title IS 'Skill name (e.g., React, TypeScript)';
COMMENT ON COLUMN skills.percentage IS 'Proficiency percentage (0-100)';
