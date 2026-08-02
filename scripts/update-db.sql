-- Skills capitalization
UPDATE skills SET title = 'HTML' WHERE title = 'Html';
UPDATE skills SET title = 'CSS' WHERE title = 'Css';
UPDATE skills SET title = 'JavaScript' WHERE title = 'Javascript';
UPDATE skills SET title = 'Express.js' WHERE title = 'ExpressJs';
UPDATE skills SET title = 'MongoDB' WHERE title = 'MongoDb';
UPDATE skills SET title = 'Node.js' WHERE title = 'NodeJs';

-- Location formatting
UPDATE personal_info SET description = 'Jaipur, Rajasthan, India' WHERE title = 'Address : ';

-- Project repo URL fix
UPDATE projects SET details = jsonb_set(details, '{1,desc}', '"https://github.com/amank736836/currency-Converter"') 
WHERE title = 'Currency Converter' AND details->1->>'title' = 'Github : ';

-- Education rich details
UPDATE education SET 
  gpa = '9.12 / 10.0',
  subjects = 'Data Structures, Algorithms, Operating Systems, Database Systems, Computer Networks, Machine Learning',
  achievements = 'Dean''s List (4 semesters), Best Final Year Project Award, Hackathon Winner (3x)'
WHERE id = 1;

UPDATE education SET 
  gpa = '82.5%',
  subjects = 'Physics, Chemistry, Mathematics, Computer Science, English',
  achievements = 'School Topper in Computer Science, Science Exhibition Winner'
WHERE id = 2;

UPDATE education SET 
  gpa = '74.8%',
  subjects = 'Mathematics, Science, Social Science, English, Hindi',
  achievements = 'Merit Certificate in Mathematics, Sports Captain'
WHERE id = 3;

-- Project tech stack capitalization (details array)
UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React - Appwrite"') 
WHERE title = 'Blogging Website' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React"') 
WHERE title = 'Password Generator' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React"') 
WHERE title = 'Currency Converter' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React, Context API"') 
WHERE title = 'To Do List' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"HTML - CSS - JavaScript"') 
WHERE title = 'Landing Page' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"MongoDB - Express.js - Node.js"') 
WHERE title = 'Ecommerce Website' AND details->2->>'title' = 'Language : ';

-- Social links table migration
CREATE TABLE IF NOT EXISTS social_links (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL DEFAULT '',
    label TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_hidden ON social_links(is_hidden);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view visible social links" ON social_links;
CREATE POLICY "Public can view visible social links" ON social_links
    FOR SELECT
    USING (is_hidden = FALSE);

DROP POLICY IF EXISTS "Admins can manage social links" ON social_links;
CREATE POLICY "Admins can manage social links" ON social_links
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email = 'amankarguwal0@gmail.com'
        )
    );

INSERT INTO social_links (platform, url, label, icon, display_order, is_hidden)
SELECT 
    key as platform,
    description as url,
    CASE 
        WHEN key = 'email' THEN 'Email'
        WHEN key = 'website' THEN 'Website'
        WHEN key = 'linkedin' THEN 'LinkedIn'
        WHEN key = 'github' THEN 'GitHub'
        WHEN key = 'twitter' THEN 'X (Twitter)'
        WHEN key = 'facebook' THEN 'Facebook'
        WHEN key = 'instagram' THEN 'Instagram'
        WHEN key = 'threads' THEN 'Threads'
        WHEN key = 'snapchat' THEN 'Snapchat'
        WHEN key = 'telegram' THEN 'Telegram'
        WHEN key = 'codolio' THEN 'Codolio'
        ELSE initcap(key)
    END as label,
    key as icon,
    CASE key
        WHEN 'linkedin' THEN 1
        WHEN 'github' THEN 2
        WHEN 'twitter' THEN 3
        WHEN 'facebook' THEN 4
        WHEN 'instagram' THEN 5
        WHEN 'threads' THEN 6
        WHEN 'snapchat' THEN 7
        WHEN 'telegram' THEN 8
        WHEN 'email' THEN 9
        WHEN 'website' THEN 10
        WHEN 'codolio' THEN 11
        ELSE 99
    END as display_order,
    COALESCE(is_hidden, FALSE) as is_hidden
FROM personal_info
WHERE key IN ('linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'email', 'website', 'codolio')
ON CONFLICT (platform) DO UPDATE SET
    url = EXCLUDED.url,
    label = EXCLUDED.label,
    icon = EXCLUDED.icon,
    display_order = EXCLUDED.display_order,
    is_hidden = EXCLUDED.is_hidden,
    updated_at = NOW();

CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_social_links_updated_at ON social_links;
CREATE TRIGGER trigger_update_social_links_updated_at
    BEFORE UPDATE ON social_links
    FOR EACH ROW
    EXECUTE FUNCTION update_social_links_updated_at();