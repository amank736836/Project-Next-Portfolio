-- Seed: personal_info
-- Version: 1.0.0

INSERT INTO personal_info (key, title, description) VALUES
  ('first_name', 'First Name : ', 'Aman'),
  ('last_name', 'Last Name : ', 'Kumar'),
  ('age', 'Age : ', '21 Years'),
  ('nationality', 'Nationality : ', 'Indian'),
  ('freelance', 'Freelance : ', 'Available'),
  ('address', 'Address : ', 'Jaipur,Rajasthan,India'),
  ('phone', 'Phone : ', '+91 62847 36836'),
  ('email', 'Email : ', 'amankarguwal0@gmail.com'),
  ('linkedin', 'LinkedIn : ', 'amank736836'),
  ('languages', 'Languages : ', 'English, Hindi, Punjabi'),
  ('about_description', 'About Me : ', 'I''m a passionate Full Stack Developer with a focus on building scalable web applications and intuitive user interfaces. I love turning complex problems into simple, beautiful, and intuitive designs.'),
  ('site_mode', 'Site Mode', 'multi')
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;