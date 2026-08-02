-- Rollback for 014_add_education_detail_columns
ALTER TABLE education DROP COLUMN IF EXISTS gpa;
ALTER TABLE education DROP COLUMN IF EXISTS subjects;
ALTER TABLE education DROP COLUMN IF EXISTS achievements;