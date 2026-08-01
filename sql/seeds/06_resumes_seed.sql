-- Seed: resumes
-- Version: 1.0.0

INSERT INTO resumes (id, title, file_url, file_name, file_size, is_active, is_favorite) VALUES
(1, 'Full Stack Developer Resume', 'https://res.cloudinary.com/amank736836/image/upload/v1785565571/portfolio/portfolio/Aman_Resume.pdf', 'Aman_Resume.pdf', 102400, true, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  file_url = EXCLUDED.file_url,
  file_name = EXCLUDED.file_name,
  file_size = EXCLUDED.file_size,
  is_active = EXCLUDED.is_active,
  is_favorite = EXCLUDED.is_favorite;