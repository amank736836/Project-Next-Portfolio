-- Migration 026: Restore the proficiency field required by Matrix CRUD.
ALTER TABLE skills
  ADD COLUMN IF NOT EXISTS percentage INTEGER DEFAULT 85;

UPDATE skills
SET percentage = 85
WHERE percentage IS NULL;

ALTER TABLE skills
  ALTER COLUMN percentage SET DEFAULT 85,
  ALTER COLUMN percentage SET NOT NULL;

ALTER TABLE skills
  DROP CONSTRAINT IF EXISTS skills_percentage_range;

ALTER TABLE skills
  ADD CONSTRAINT skills_percentage_range
  CHECK (percentage BETWEEN 0 AND 100);
