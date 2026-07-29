-- Migration: Add category and is_featured to skills table
-- Version: 1.0.0
-- Description: Adds category and is_featured columns to skills table for hero badges selection

-- Add category column (Frontend, Backend, Database, Cloud, Languages, etc.)
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Add is_featured column to mark skills for hero badges
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add icon column for emoji/icon in badges
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '';

-- Add color column for badge color
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6B63FF';

-- Create index for featured skills
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(is_featured) WHERE is_featured = true;

-- Create index for category
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- Update existing skills with categories and icons
UPDATE skills SET 
    category = CASE 
        WHEN title IN ('React', 'React.js', 'TypeScript', 'JavaScript', 'Html', 'Css', 'Tailwind') THEN 'Frontend'
        WHEN title IN ('Node.js', 'NodeJs', 'ExpressJs', 'Java', 'C++', 'C') THEN 'Backend'
        WHEN title IN ('MongoDB', 'MongoDb') THEN 'Database'
        ELSE 'General'
    END,
    icon = CASE 
        WHEN title IN ('React', 'React.js') THEN '⚛'
        WHEN title = 'TypeScript' THEN '🔷'
        WHEN title = 'JavaScript' THEN '🟨'
        WHEN title = 'Html' THEN '🌐'
        WHEN title = 'Css' THEN '💨'
        WHEN title = 'Tailwind' THEN '💨'
        WHEN title IN ('Node.js', 'NodeJs') THEN '🟢'
        WHEN title = 'ExpressJs' THEN '🚂'
        WHEN title = 'Java' THEN '☕'
        WHEN title = 'C++' THEN '⚡'
        WHEN title = 'C' THEN '🔧'
        WHEN title IN ('MongoDB', 'MongoDb') THEN '🍃'
        ELSE '⚙'
    END,
    color = CASE 
        WHEN title IN ('React', 'React.js') THEN '#61DAFB'
        WHEN title = 'TypeScript' THEN '#3178C6'
        WHEN title = 'JavaScript' THEN '#F7DF1E'
        WHEN title = 'Html' THEN '#E34F26'
        WHEN title = 'Css' THEN '#1572B6'
        WHEN title = 'Tailwind' THEN '#06B6D4'
        WHEN title IN ('Node.js', 'NodeJs') THEN '#339933'
        WHEN title = 'ExpressJs' THEN '#000000'
        WHEN title = 'Java' THEN '#ED8B00'
        WHEN title = 'C++' THEN '#00599C'
        WHEN title = 'C' THEN '#A8B9CC'
        WHEN title IN ('MongoDB', 'MongoDb') THEN '#47A248'
        ELSE '#6B63FF'
    END,
    is_featured = CASE 
        WHEN title IN ('React', 'TypeScript', 'Node.js', 'Java', 'MongoDB', 'Tailwind') THEN true
        ELSE false
    END
WHERE id IN (1,2,3,4,5,6,7,8,9,10);