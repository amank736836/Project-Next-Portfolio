-- Migration 025: Persist category values used by admin CRUD forms.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'education';
ALTER TABLE experience ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'professional';
