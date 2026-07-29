-- Migration: Add icon and color columns to skills table
-- Version: 1.0.0
-- Description: Adds icon and color columns to skills table for hero section badges
-- Dependencies: 001_initial_schema

-- Add icon and color columns
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '⭐',
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6B7280';

COMMENT ON COLUMN skills.icon IS 'Emoji or icon character for the skill';
COMMENT ON COLUMN skills.color IS 'Hex color code for the skill badge';

-- Update existing skills with default icons/colors based on skillConfig mapping
UPDATE skills SET icon = '⚛', color = '#61DAFB' WHERE title ILIKE '%react%';
UPDATE skills SET icon = '🟢', color = '#339933' WHERE title ILIKE '%node%';
UPDATE skills SET icon = '☕', color = '#ED8B00' WHERE title ILIKE '%java%';
UPDATE skills SET icon = '🍃', color = '#47A248' WHERE title ILIKE '%mongo%';
UPDATE skills SET icon = '💨', color = '#06B6D4' WHERE title ILIKE '%tailwind%';
UPDATE skills SET icon = '🔷', color = '#3178C6' WHERE title ILIKE '%typescript%';
UPDATE skills SET icon = '📜', color = '#F7DF1E' WHERE title ILIKE '%javascript%';
UPDATE skills SET icon = '🌐', color = '#E34F26' WHERE title ILIKE '%html%';
UPDATE skills SET icon = '🎨', color = '#1572B6' WHERE title ILIKE '%css%';
UPDATE skills SET icon = '▲', color = '#000000' WHERE title ILIKE '%next%';
UPDATE skills SET icon = '🔄', color = '#764ABC' WHERE title ILIKE '%redux%';
UPDATE skills SET icon = '📡', color = '#FF4154' WHERE title ILIKE '%react query%';
UPDATE skills SET icon = '🚂', color = '#000000' WHERE title ILIKE '%express%';
UPDATE skills SET icon = '🌱', color = '#6DB33F' WHERE title ILIKE '%spring%';
UPDATE skills SET icon = '🐍', color = '#3776AB' WHERE title ILIKE '%python%';
UPDATE skills SET icon = '🐹', color = '#00ADD8' WHERE title ILIKE '%go%';
UPDATE skills SET icon = '🐘', color = '#336791' WHERE title ILIKE '%postgres%';
UPDATE skills SET icon = '🐬', color = '#4479A1' WHERE title ILIKE '%mysql%';
UPDATE skills SET icon = '⚡', color = '#DC382D' WHERE title ILIKE '%redis%';
UPDATE skills SET icon = '🔮', color = '#2D3748' WHERE title ILIKE '%prisma%';
UPDATE skills SET icon = '☁', color = '#FF9900' WHERE title ILIKE '%aws%';
UPDATE skills SET icon = '🐳', color = '#2496ED' WHERE title ILIKE '%docker%';
UPDATE skills SET icon = '☸', color = '#326CE5' WHERE title ILIKE '%kubernetes%';
UPDATE skills SET icon = '📦', color = '#F05032' WHERE title ILIKE '%git%';
UPDATE skills SET icon = '⚙', color = '#2088FF' WHERE title ILIKE '%ci/cd%';
UPDATE skills SET icon = '▲', color = '#000000' WHERE title ILIKE '%vercel%';
UPDATE skills SET icon = '🔧', color = '#A8B9CC' WHERE title = 'C';
UPDATE skills SET icon = '⚡', color = '#00599C' WHERE title ILIKE '%c++%';
UPDATE skills SET icon = '🦀', color = '#DEA584' WHERE title ILIKE '%rust%';