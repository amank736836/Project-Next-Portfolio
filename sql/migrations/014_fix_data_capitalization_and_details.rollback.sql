-- Rollback for 013_fix_data_capitalization_and_details
-- Skills rollback
UPDATE skills SET title = 'Html' WHERE title = 'HTML';
UPDATE skills SET title = 'Css' WHERE title = 'CSS';
UPDATE skills SET title = 'Javascript' WHERE title = 'JavaScript';
UPDATE skills SET title = 'ExpressJs' WHERE title = 'Express.js';
UPDATE skills SET title = 'MongoDb' WHERE title = 'MongoDB';
UPDATE skills SET title = 'NodeJs' WHERE title = 'Node.js';

-- Location rollback
UPDATE personal_info SET description = 'Jaipur,Rajasthan,India' WHERE title = 'Address : ';

-- Project repo URL rollback
UPDATE projects SET details = jsonb_set(details, '{1,desc}', '"https://github.com/amank736836/currency-Convertor"') 
WHERE title = 'Currency Converter' AND details->1->>'title' = 'Github : ';

-- Education rollback
UPDATE education SET gpa = NULL, subjects = NULL, achievements = NULL WHERE id IN (1, 2, 3);

-- Project tech stack rollback
UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"ReactJs - Appwrite"') 
WHERE title = 'Blogging Website' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React JS"') 
WHERE title = 'Password Generator' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React JS"') 
WHERE title = 'Currency Converter' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"React JS, Context API"') 
WHERE title = 'To Do List' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"Html - Css - Javascript"') 
WHERE title = 'Landing Page' AND details->2->>'title' = 'Language : ';

UPDATE projects SET details = jsonb_set(details, '{2,desc}', '"MongoDb - ExpressJs - NodeJs"') 
WHERE title = 'Ecommerce Website' AND details->2->>'title' = 'Language : ';