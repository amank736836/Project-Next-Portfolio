-- Migration: Create skill_categories table
-- Version: 1.0.0
-- Description: Creates skill_categories table for managing skill categories

-- Table: skill_categories
CREATE TABLE IF NOT EXISTS skill_categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE skill_categories IS 'Categories for organizing skills';
COMMENT ON COLUMN skill_categories.name IS 'Category name (e.g., Frontend, Backend)';
COMMENT ON COLUMN skill_categories.display_order IS 'Display order for sorting';
COMMENT ON COLUMN skill_categories.is_default IS 'Whether this is a built-in default category';

-- Enable RLS
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON skill_categories
    FOR SELECT USING (true);

-- Service role write access
CREATE POLICY "Service role write access" ON skill_categories
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role update access" ON skill_categories
    FOR UPDATE USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role delete access" ON skill_categories
    FOR DELETE USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_skill_categories_default ON skill_categories(is_default) WHERE is_default = true;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_skill_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_skill_categories_updated_at ON skill_categories;
CREATE TRIGGER trigger_update_skill_categories_updated_at
    BEFORE UPDATE ON skill_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_categories_updated_at();

-- Insert default categories
INSERT INTO skill_categories (name, display_order, is_default) VALUES
    ('Frontend', 1, true),
    ('Backend', 2, true),
    ('Database', 3, true),
    ('Cloud', 4, true),
    ('Languages', 5, true),
    ('General', 99, true)
ON CONFLICT (name) DO UPDATE SET
    display_order = EXCLUDED.display_order,
    is_default = EXCLUDED.is_default;