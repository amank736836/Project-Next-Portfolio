-- Migration: Add hero_images table
-- Version: 1.0.0

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    alt_text TEXT DEFAULT 'Hero background',
    is_hero BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE hero_images IS 'Hero section images with gallery support';
COMMENT ON COLUMN hero_images.url IS 'Cloudinary URL of the image';
COMMENT ON COLUMN hero_images.alt_text IS 'Alt text for accessibility';
COMMENT ON COLUMN hero_images.is_hero IS 'Whether this image is the active hero image';
COMMENT ON COLUMN hero_images.display_order IS 'Order for gallery display';

-- Enable RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read access" ON hero_images
    FOR SELECT USING (true);

-- Allow admin write
CREATE POLICY "Admin write access" ON hero_images
    FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin update access" ON hero_images
    FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admin delete access" ON hero_images
    FOR DELETE USING (auth.role() = 'service_role');

-- Create index
CREATE INDEX IF NOT EXISTS idx_hero_images_is_hero ON hero_images(is_hero DESC);
CREATE INDEX IF NOT EXISTS idx_hero_images_display_order ON hero_images(display_order);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_hero_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_hero_images_updated_at ON hero_images;
CREATE TRIGGER trigger_update_hero_images_updated_at
    BEFORE UPDATE ON hero_images
    FOR EACH ROW EXECUTE FUNCTION update_hero_images_updated_at();

-- Ensure only one hero image at a time
CREATE OR REPLACE FUNCTION enforce_single_hero_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_hero THEN
        UPDATE hero_images SET is_hero = FALSE WHERE is_hero = TRUE AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_single_hero_image ON hero_images;
CREATE TRIGGER trigger_enforce_single_hero_image
    BEFORE INSERT OR UPDATE ON hero_images
    FOR EACH ROW EXECUTE FUNCTION enforce_single_hero_image();

-- Insert default hero image if none exists
INSERT INTO hero_images (url, alt_text, is_hero, display_order)
SELECT '/assets/profile_v4.png', 'Profile', TRUE, 0
WHERE NOT EXISTS (SELECT 1 FROM hero_images WHERE is_hero = TRUE);