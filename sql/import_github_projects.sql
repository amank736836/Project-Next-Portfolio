-- Import local D:/Github repos missing from showcase (2026-10-08).
-- All rows are inserted as HIDDEN drafts (is_hidden = true): no image yet
-- (card falls back to live screenshot once you add a Preview URL),
-- Github + Language filled from local scan, Preview left empty for you.
-- Safe to re-run: each INSERT skips when the repo URL already exists.
-- Run in: Supabase Dashboard > SQL Editor > paste > Run.

-- 1. LinkedIn Extension Suite
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'LinkedIn Extension Suite', '', '',
  'Browser extensions for LinkedIn automation: auto-apply, AI assistant and content tools.',
  'Extension', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"LinkedIn Extension Suite"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/linkedin_extension"},{"icon":"FaCode","title":"Language : ","desc":"JavaScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%linkedin_extension%');

-- 2. GamingSole
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'GamingSole', '', '',
  'Retro gaming hub built with Next.js and TypeScript.',
  'Game', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"GamingSole"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/GamingSole"},{"icon":"FaCode","title":"Language : ","desc":"Next.js, TypeScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%GamingSole%');

-- 3. Snake Game (Next.js)
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Snake Game (Next.js)', '', '',
  'Classic snake game rebuilt with Next.js and TypeScript.',
  'Game', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Snake Game Next.js"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/snake-game-nextjs"},{"icon":"FaCode","title":"Language : ","desc":"Next.js, TypeScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%snake-game-nextjs%');

-- 4. Agent CLI (Lovable)
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Agent CLI (Lovable)', '', '',
  'AI agent CLI project scaffolded with Lovable: React, TypeScript and Vite.',
  'AI App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Agent CLI Lovable"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/Agent-CLI_Lovable"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%Agent-CLI_Lovable%');

-- 5. AK Studio
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'AK Studio', '', '',
  'Studio web app built with React, TypeScript and Vite.',
  'Web App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"AK Studio"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/akstudio"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%/akstudio%');

-- 6. Bank Statement Buddy
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Bank Statement Buddy', '', '',
  'FinTech helper that parses and explains bank statements.',
  'FinTech', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Bank Statement Buddy"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/bank-statement-buddy"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%bank-statement-buddy%');

-- 7. Bid Wisely
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Bid Wisely', '', '',
  'Bidding helper web app built with React, TypeScript and Vite.',
  'Web App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Bid Wisely"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/bid-wisely"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%bid-wisely%');

-- 8. Chat With Context
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Chat With Context', '', '',
  'Context-aware AI chat app built with React, TypeScript and Vite.',
  'AI App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Chat With Context"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/chat-with-context"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%chat-with-context%');

-- 9. ChatChamp
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'ChatChamp', '', '',
  'AI chat product (Lovable project) built with React, TypeScript and Vite.',
  'AI App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"ChatChamp"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/chatchamp_LovableProject"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%chatchamp_LovableProject%');

-- 10. ChatWeave Knowledge
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'ChatWeave Knowledge', '', '',
  'Knowledge-base chat app built with React, TypeScript and Vite.',
  'AI App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"ChatWeave Knowledge"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/chatweave-knowledge"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%chatweave-knowledge%');

-- 11. Game Time Club
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Game Time Club', '', '',
  'Gaming community app built with React, TypeScript and Vite.',
  'Game', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Game Time Club"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/game-time-club"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%game-time-club%');

-- 12. My Fitness Journey
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'My Fitness Journey', '', '',
  'Fitness tracking app built with React, TypeScript and Vite.',
  'Health', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"My Fitness Journey"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/my-fitness-journey"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%my-fitness-journey%');

-- 13. Portfolio Viewer X
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Portfolio Viewer X', '', '',
  'Portfolio viewer app built with React, TypeScript and Vite.',
  'Portfolio', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Portfolio Viewer X"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/portfolio-viewer-x"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%portfolio-viewer-x%');

-- 14. Statement Settler
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Statement Settler', '', '',
  'FinTech app that settles and reconciles statements.',
  'FinTech', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Statement Settler"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/statement-settler"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%statement-settler%');

-- 15. Study Spark
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Study Spark', '', '',
  'Study companion app built with React, TypeScript and Vite.',
  'Education', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Study Spark"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/study-spark"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%study-spark%');

-- 16. GitVergo
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'GitVergo', '', '',
  'Unified automation for GitHub, Vercel, GoDaddy DNS and Supabase sync.',
  'DevTool', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"GitVergo"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/gitvergo"},{"icon":"FaCode","title":"Language : ","desc":"TypeScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%/gitvergo%');

-- 17. Gitverse
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Gitverse', '', '',
  'Global automation hub syncing projects between GitHub and Vercel via GitHub Actions.',
  'DevTool', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Gitverse"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/Gitverse"},{"icon":"FaCode","title":"Language : ","desc":"GitHub Actions, Vercel"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%/Gitverse%');

-- 18. Perfect Portfolio Clone
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Perfect Portfolio Clone', '', '',
  'Portfolio template clone built with React, TypeScript and Vite.',
  'Portfolio', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Perfect Portfolio Clone"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/perfect-portfolio-clone"},{"icon":"FaCode","title":"Language : ","desc":"React, TypeScript, Vite"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%perfect-portfolio-clone%');

-- 19. Ecom Next
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Ecom Next', '', '',
  'E-commerce storefront built with Next.js and TypeScript.',
  'Ecommerce', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Ecom Next"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/next-ecommerce"},{"icon":"FaCode","title":"Language : ","desc":"Next.js, TypeScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%next-ecommerce"%');

-- 20. Ecom Next Neon
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Ecom Next Neon', '', '',
  'E-commerce storefront (Neon variant) built with Next.js and TypeScript.',
  'Ecommerce', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Ecom Next Neon"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/ecom-next-neon"},{"icon":"FaCode","title":"Language : ","desc":"Next.js, TypeScript"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%ecom-next-neon%');

-- 21. Chat Next Supabase
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Chat Next Supabase', '', '',
  'Realtime chat app built with Next.js, TypeScript and Supabase.',
  'Chat App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Chat Next Supabase"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/chat-next-supabase"},{"icon":"FaCode","title":"Language : ","desc":"Next.js, TypeScript, Supabase"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%chat-next-supabase%');

-- 22. Smart Web Agent
INSERT INTO projects (title, img, image, description, category, is_hidden, details)
SELECT 'Smart Web Agent', '', '',
  'An autonomous AI agent that automates web tasks using natural language goals.',
  'AI App', true,
  '[{"icon":"FiFileText","title":"Project : ","desc":"Smart Web Agent"},{"icon":"FiGithub","title":"Github : ","desc":"https://github.com/amank736836/smart-web-agent"},{"icon":"FaCode","title":"Language : ","desc":"Node.js, OpenAI, Playwright"},{"icon":"FiExternalLink","title":"Preview : ","desc":""}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE details::text ILIKE '%smart-web-agent%');
