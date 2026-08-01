-- Seed: projects
-- Version: 1.0.0

INSERT INTO projects (id, title, img, image, description, is_hidden, details) VALUES
(1, 'Blogging Website', 'https://res.cloudinary.com/amank736836/image/upload/v1785565563/portfolio/portfolio/frameandphrase.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565563/portfolio/portfolio/frameandphrase.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "Blogging Website"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/Blogging-Website"}, {"icon": "FaCode", "title": "Language : ", "desc": "ReactJs - Appwrite"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://frameandphrase.vercel.app/"}]'::jsonb),
(2, 'Password Generator', 'https://res.cloudinary.com/amank736836/image/upload/v1785565556/portfolio/portfolio/ciphergen.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565556/portfolio/portfolio/ciphergen.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "Password Generator"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/password-Generator"}, {"icon": "FaCode", "title": "Language : ", "desc": "React JS"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://ciphergen.vercel.app/"}]'::jsonb),
(3, 'Currency Converter', 'https://res.cloudinary.com/amank736836/image/upload/v1785565552/portfolio/portfolio/cashcode.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565552/portfolio/portfolio/cashcode.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "Currency Converter"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/currency-Convertor"}, {"icon": "FaCode", "title": "Language : ", "desc": "React JS"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://cashcode.vercel.app/"}]'::jsonb),
(4, 'To Do List', 'https://res.cloudinary.com/amank736836/image/upload/v1785565564/portfolio/portfolio/organizeit.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565564/portfolio/portfolio/organizeit.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "To Do List"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/todo-ContextLocal---React"}, {"icon": "FaCode", "title": "Language : ", "desc": "React JS, Context API"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://organizeit.vercel.app/"}]'::jsonb),
(5, 'Landing Page', 'https://res.cloudinary.com/amank736836/image/upload/v1785565569/portfolio/portfolio/selfdevelopmentgoals.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565569/portfolio/portfolio/selfdevelopmentgoals.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "Landing Page"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/SDG"}, {"icon": "FaCode", "title": "Language : ", "desc": "Html - Css - Javascript"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://selfdevelopmentgoals.vercel.app/"}]'::jsonb),
(6, 'Ecommerce Website', 'https://res.cloudinary.com/amank736836/image/upload/v1785565561/portfolio/portfolio/ecommerce.png', 'https://res.cloudinary.com/amank736836/image/upload/v1785565561/portfolio/portfolio/ecommerce.png', '', false,
'[{"icon": "FiFileText", "title": "Project : ", "desc": "Ecommerce Website"}, {"icon": "FiGithub", "title": "Github : ", "desc": "https://github.com/amank736836/Products-Server"}, {"icon": "FaCode", "title": "Language : ", "desc": "MongoDb - ExpressJs - NodeJs"}, {"icon": "FiExternalLink", "title": "Preview : ", "desc": "https://products-server-u5b7.onrender.com/"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  img = EXCLUDED.img,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  is_hidden = EXCLUDED.is_hidden,
  details = EXCLUDED.details;