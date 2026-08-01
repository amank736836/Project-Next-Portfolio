-- Migration: Create Supabase Storage bucket for resumes
-- Description: Create portfolio-resumes bucket

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-resumes', 'portfolio-resumes', true, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note: RLS policies for storage.objects must be created via Supabase Dashboard
-- or Supabase CLI. Go to Storage > portfolio-resumes > Policies and add:
-- 1. Public read: bucket_id = 'portfolio-resumes' (SELECT)
-- 2. Authenticated write: bucket_id = 'portfolio-resumes' AND auth.role() = 'authenticated' (INSERT)
-- 3. Service role full access: bucket_id = 'portfolio-resumes' AND auth.role() = 'service_role' (ALL)