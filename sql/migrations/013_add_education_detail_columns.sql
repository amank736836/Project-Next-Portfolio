-- Migration 014: Add education detail columns
ALTER TABLE education ADD COLUMN IF NOT EXISTS gpa TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS achievements TEXT;