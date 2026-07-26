-- Seed: skills
-- Version: 1.0.0

INSERT INTO skills (id, title, percentage) VALUES
  (1, 'Html', 0),
  (2, 'Javascript', 0),
  (3, 'Css', 0),
  (4, 'C++', 0),
  (5, 'Java', 0),
  (6, 'MongoDb', 0),
  (7, 'ExpressJs', 0),
  (8, 'React', 0),
  (9, 'NodeJs', 0),
  (10, 'C', 0)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  percentage = EXCLUDED.percentage;