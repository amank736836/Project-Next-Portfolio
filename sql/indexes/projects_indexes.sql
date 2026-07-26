-- Indexes: projects
-- Version: 1.0.0

CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON projects(is_hidden);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);