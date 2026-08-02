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