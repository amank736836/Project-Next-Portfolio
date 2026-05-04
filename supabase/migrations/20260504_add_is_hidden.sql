-- Migration: Add is_hidden to education and experience tables
-- Date: 2026-05-04

ALTER TABLE education ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
