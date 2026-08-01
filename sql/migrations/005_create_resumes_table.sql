-- Migration: Create resumes table
-- Description: Store resume PDFs with metadata for dynamic resume download

CREATE TABLE IF NOT EXISTS resumes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  is_active BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE resumes IS 'Resume/CV PDF files with metadata for portfolio download';
COMMENT ON COLUMN resumes.title IS 'Display title (e.g., Full Stack Developer Resume)';
COMMENT ON COLUMN resumes.file_url IS 'Cloudinary or external URL to PDF';
COMMENT ON COLUMN resumes.file_name IS 'Original filename';
COMMENT ON COLUMN resumes.file_size IS 'File size in bytes';
COMMENT ON COLUMN resumes.is_active IS 'Currently active resume for download';
COMMENT ON COLUMN resumes.is_favorite IS 'User-favorite resume (shown in admin)';
COMMENT ON COLUMN resumes.uploaded_at IS 'When the resume was uploaded';
COMMENT ON COLUMN resumes.updated_at IS 'Last update timestamp';

CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resumes_is_favorite ON resumes(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_resumes_uploaded_at ON resumes(uploaded_at DESC);

-- Trigger to ensure only one active resume
CREATE OR REPLACE FUNCTION enforce_single_active_resume()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active THEN
    UPDATE resumes SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_active_resume ON resumes;
CREATE TRIGGER trigger_single_active_resume
  BEFORE INSERT OR UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION enforce_single_active_resume();