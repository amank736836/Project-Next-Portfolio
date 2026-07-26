-- Seed: experience
-- Version: 1.0.0

INSERT INTO experience (id, year, title, description, is_hidden) VALUES
  (1, 'Sep 2025 – Present', 'Software Engineer - <span> Techpearl Software </span>', 'Optimized bulk data workflows and backend performance. Reduced bulk import time for 9k records by 66%. Revamped Org Chart queries, cutting response times from 50s to 0.2s using optimized joins.', false),
  (2, 'Jan 2025 – Aug 2025', 'Project Management Intern - <span> Wabtec Corporation </span>', 'Collaborated with cross-functional teams to gather requirements and enhance software performance. Tested digital solutions and validated requirements for production-grade projects.', false)
ON CONFLICT (id) DO UPDATE SET
  year = EXCLUDED.year,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_hidden = EXCLUDED.is_hidden;