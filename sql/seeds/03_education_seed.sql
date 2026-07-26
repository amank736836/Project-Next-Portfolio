-- Seed: education
-- Version: 1.0.0

INSERT INTO education (id, year, title, description, is_hidden) VALUES
  (1, 'Sep 2021 - May 2025', 'Bachelor Of Engineering - <span> Chitkara University </span>', 'Computer Science Engineering – GPA: 9.12 – Solan, Himachal Pradesh', false),
  (2, 'May 2020 - June 2021', 'Higher Secondary - <span> DAV Centenary Public School </span>', 'Percentage: 82.5% – Jaipur, Rajasthan', false),
  (3, 'May 2018 - April 2019', 'Secondary - <span> DAV Public School </span>', 'Percentage: 74.8% – Mohali, Punjab', false)
ON CONFLICT (id) DO UPDATE SET
  year = EXCLUDED.year,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_hidden = EXCLUDED.is_hidden;