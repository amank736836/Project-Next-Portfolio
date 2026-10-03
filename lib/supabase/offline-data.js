/**
 * Offline seed data.
 *
 * Used ONLY when Supabase credentials are missing (see ./offline-client.js).
 * Mirrors the shape of the SQL seed files in `sql/seeds` so the public site and
 * the admin surface can be previewed/built without a database connection.
 */

const skill = (id, title, percentage, category, icon, color, is_featured = false, description = '') => ({
  id,
  title,
  percentage,
  category,
  icon,
  color,
  is_featured,
  is_hidden: false,
  description,
});

export const OFFLINE_TABLES = {
  personal_info: [
    { key: 'first_name', title: 'First Name : ', description: 'Aman' },
    { key: 'last_name', title: 'Last Name : ', description: 'Kumar' },
    { key: 'age', title: 'Age : ', description: '22 Years' },
    { key: 'nationality', title: 'Nationality : ', description: 'Indian' },
    { key: 'freelance', title: 'Freelance : ', description: 'Available' },
    { key: 'address', title: 'Address : ', description: 'Jaipur, Rajasthan, India' },
    { key: 'phone', title: 'Phone : ', description: '+91 62847 36836' },
    { key: 'email', title: 'Email : ', description: 'amankarguwal0@gmail.com' },
    { key: 'languages', title: 'Languages : ', description: 'English, Hindi, Punjabi' },
    { key: 'website', title: 'Website : ', description: 'https://amank.co.in' },
    {
      key: 'about_description',
      title: 'About Me : ',
      description:
        "I'm a passionate Full Stack Developer who loves turning complex problems into simple, beautiful and intuitive products. I work across the stack — React on the front, Node and Java services behind it — and I care deeply about performance, accessibility and the small details that make an interface feel alive.",
    },
    { key: 'site_mode', title: 'Site Mode', description: 'multi' },
    { key: 'default_theme_color', title: 'Default Theme Color', description: 'hsl(250, 84%, 60%)' },
    { key: 'default_theme_mode', title: 'Default Theme Mode', description: 'dark-theme' },
  ],

  social_links: [
    { id: 1, platform: 'github', url: 'amank736836', display_order: 1, is_hidden: false },
    { id: 2, platform: 'linkedin', url: 'amank736836', display_order: 2, is_hidden: false },
    { id: 3, platform: 'twitter', url: 'amank736836', display_order: 3, is_hidden: false },
    { id: 4, platform: 'codolio', url: 'https://codolio.com/profile/amank736836', display_order: 4, is_hidden: false },
    { id: 5, platform: 'instagram', url: 'amank736836', display_order: 5, is_hidden: false },
    { id: 6, platform: 'telegram', url: 'amank736836', display_order: 6, is_hidden: false },
  ],

  user_settings: [
    { key: 'enable_scroll_reveal', title: 'Scroll Reveal Animations', description: 'true', type: 'boolean' },
    { key: 'enable_typewriter', title: 'Typewriter Effect', description: 'true', type: 'boolean' },
    { key: 'enable_open_to_work', title: 'Open To Work Badge', description: 'true', type: 'boolean' },
    { key: 'enable_ui_motion', title: 'Advanced Motion Layer', description: 'true', type: 'boolean' },
    { key: 'portfolio_layout', title: 'Portfolio Layout', description: 'fixed', type: 'string' },
  ],

  skills: [
    skill(1, 'Html', 92, 'Frontend', '🌐', '#E34F26', true, 'Semantic, accessible markup'),
    skill(2, 'Javascript', 94, 'Frontend', '📜', '#F7DF1E', true, 'ES6+, async patterns, tooling'),
    skill(3, 'Css', 90, 'Frontend', '🎨', '#1572B6', true, 'Grid, Flexbox, motion design'),
    skill(4, 'React', 95, 'Frontend', '⚛', '#61DAFB', true, 'Hooks, Suspense, RSC, Next.js'),
    skill(5, 'Next.js', 90, 'Frontend', '▲', '#38BDF8', true, 'App Router, SSR, streaming'),
    skill(6, 'Tailwind CSS', 91, 'Frontend', '💨', '#06B6D4', false, 'Design systems at utility speed'),
    skill(7, 'TypeScript', 88, 'Frontend', '🔷', '#3178C6', false, 'Strict typing, generics'),
    skill(8, 'NodeJs', 92, 'Backend', '🟢', '#339933', true, 'Express, REST, streaming APIs'),
    skill(9, 'ExpressJs', 90, 'Backend', '🚂', '#94A3B8', false, 'Middleware, routing, validation'),
    skill(10, 'Java', 88, 'Backend', '☕', '#ED8B00', false, 'Spring Boot, JPA, multithreading'),
    skill(11, 'MongoDb', 90, 'Database', '🍃', '#47A248', false, 'Aggregation, indexing, sharding'),
    skill(12, 'PostgreSQL', 86, 'Database', '🐘', '#336791', false, 'Query tuning, JSONB, joins'),
    skill(13, 'Redis', 78, 'Database', '⚡', '#DC382D', false, 'Caching, pub/sub, streams'),
    skill(14, 'Docker', 82, 'Cloud', '🐳', '#2496ED', false, 'Multi-stage builds, compose'),
    skill(15, 'AWS', 76, 'Cloud', '☁', '#FF9900', false, 'EC2, S3, Lambda, RDS'),
    skill(16, 'Git', 93, 'Cloud', '📦', '#F05032', false, 'Trunk based flow, CI/CD'),
    skill(17, 'C++', 85, 'Languages', '⚡', '#00599C', false, 'OOP, STL, performance'),
    skill(18, 'C', 82, 'Languages', '🔧', '#A8B9CC', false, 'Memory, pointers, systems'),
  ],

  skill_categories: [
    { id: 1, name: 'Frontend', display_order: 1, is_default: true },
    { id: 2, name: 'Backend', display_order: 2, is_default: true },
    { id: 3, name: 'Database', display_order: 3, is_default: true },
    { id: 4, name: 'Cloud', display_order: 4, is_default: true },
    { id: 5, name: 'Languages', display_order: 5, is_default: true },
  ],

  education: [
    {
      id: 1,
      year: 'Sep 2021 - May 2025',
      title: 'Bachelor Of Engineering - <span> Chitkara University </span>',
      description: 'Computer Science Engineering — GPA: 9.12 — Solan, Himachal Pradesh',
      gpa: '9.12 / 10',
      subjects: 'Data Structures, Operating Systems, DBMS, Computer Networks',
      achievements: 'Dean’s list, Smart India Hackathon finalist',
      is_hidden: false,
    },
    {
      id: 2,
      year: 'May 2020 - June 2021',
      title: 'Higher Secondary - <span> DAV Centenary Public School </span>',
      description: 'Percentage: 82.5% — Jaipur, Rajasthan',
      gpa: '82.5%',
      subjects: 'Physics, Chemistry, Mathematics, Computer Science',
      achievements: 'School topper in Computer Science',
      is_hidden: false,
    },
    {
      id: 3,
      year: 'May 2018 - April 2019',
      title: 'Secondary - <span> DAV Public School </span>',
      description: 'Percentage: 74.8% — Mohali, Punjab',
      gpa: '74.8%',
      is_hidden: false,
    },
  ],

  experience: [
    {
      id: 1,
      year: 'Sep 2025 – Present',
      title: 'Software Engineer - <span> Techpearl Software </span>',
      description:
        'Optimized bulk data workflows and backend performance. Reduced bulk import time for 9k records by 66%. Revamped Org Chart queries, cutting response times from 50s to 0.2s using optimized joins.',
      is_hidden: false,
    },
    {
      id: 2,
      year: 'Jan 2025 – Aug 2025',
      title: 'Project Management Intern - <span> Wabtec Corporation </span>',
      description:
        'Collaborated with cross-functional teams to gather requirements and enhance software performance. Tested digital solutions and validated requirements for production-grade projects.',
      is_hidden: false,
    },
  ],

  projects: [
    {
      id: 1,
      title: 'Frame & Phrase',
      img: '/assets/frameandphrase.png',
      image: '/assets/frameandphrase.png',
      category: 'Full Stack',
      description: 'A blogging platform with rich-text authoring, auth and image pipelines.',
      techStack: ['React', 'Appwrite', 'Tailwind', 'Vite'],
      liveUrl: 'https://frameandphrase.vercel.app/',
      githubUrl: 'https://github.com/amank736836/Blogging-Website',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'Blogging Website' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/Blogging-Website' },
        { icon: 'FaCode', title: 'Language : ', desc: 'ReactJs - Appwrite' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://frameandphrase.vercel.app/' },
      ],
      is_hidden: false,
    },
    {
      id: 2,
      title: 'CipherGen',
      img: '/assets/ciphergen.png',
      image: '/assets/ciphergen.png',
      category: 'Frontend',
      description: 'Password generator with entropy scoring and one-click copy.',
      techStack: ['React', 'JavaScript', 'CSS'],
      liveUrl: 'https://ciphergen.vercel.app/',
      githubUrl: 'https://github.com/amank736836/password-Generator',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'Password Generator' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/password-Generator' },
        { icon: 'FaCode', title: 'Language : ', desc: 'React JS' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://ciphergen.vercel.app/' },
      ],
      is_hidden: false,
    },
    {
      id: 3,
      title: 'CashCode',
      img: '/assets/cashcode.png',
      image: '/assets/cashcode.png',
      category: 'Frontend',
      description: 'Live currency converter backed by a rate API and cached lookups.',
      techStack: ['React', 'REST API', 'Vite'],
      liveUrl: 'https://cashcode.vercel.app/',
      githubUrl: 'https://github.com/amank736836/currency-Convertor',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'Currency Converter' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/currency-Convertor' },
        { icon: 'FaCode', title: 'Language : ', desc: 'React JS' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://cashcode.vercel.app/' },
      ],
      is_hidden: false,
    },
    {
      id: 4,
      title: 'OrganizeIt',
      img: '/assets/organizeit.png',
      image: '/assets/organizeit.png',
      category: 'Frontend',
      description: 'Context-driven task manager with keyboard-first interactions.',
      techStack: ['React', 'Context API', 'CSS'],
      liveUrl: 'https://organizeit.vercel.app/',
      githubUrl: 'https://github.com/amank736836/todo-ContextLocal---React',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'To Do List' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/todo-ContextLocal---React' },
        { icon: 'FaCode', title: 'Language : ', desc: 'React JS, Context API' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://organizeit.vercel.app/' },
      ],
      is_hidden: false,
    },
    {
      id: 5,
      title: 'Products Server',
      img: '/assets/ecommerce.png',
      image: '/assets/ecommerce.png',
      category: 'Backend',
      description: 'REST API behind an e-commerce catalogue with pagination and search.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      liveUrl: 'https://products-server-u5b7.onrender.com/',
      githubUrl: 'https://github.com/amank736836/Products-Server',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'Ecommerce API' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/Products-Server' },
        { icon: 'FiServer', title: 'Language : ', desc: 'NodeJs - ExpressJs - MongoDb' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://products-server-u5b7.onrender.com/' },
      ],
      is_hidden: false,
    },
    {
      id: 6,
      title: 'Self Development Goals',
      img: '/assets/selfdevelopmentgoals.png',
      image: '/assets/selfdevelopmentgoals.png',
      category: 'Landing',
      description: 'Marketing landing page with scroll-driven storytelling.',
      techStack: ['HTML', 'CSS', 'JavaScript'],
      liveUrl: 'https://selfdevelopmentgoals.vercel.app/',
      githubUrl: 'https://github.com/amank736836/SDG',
      details: [
        { icon: 'FiFileText', title: 'Project : ', desc: 'Landing Page' },
        { icon: 'FiGithub', title: 'Github : ', desc: 'https://github.com/amank736836/SDG' },
        { icon: 'FaCode', title: 'Language : ', desc: 'Html - Css - Javascript' },
        { icon: 'FiExternalLink', title: 'Preview : ', desc: 'https://selfdevelopmentgoals.vercel.app/' },
      ],
      is_hidden: false,
    },
  ],

  hero_images: [
    {
      id: 'offline-hero-1',
      url: '/assets/profile_v4.png',
      alt_text: 'Aman Kumar — Full Stack Developer',
      is_hero: true,
      display_order: 0,
    },
  ],

  resumes: [
    {
      id: 1,
      title: 'Aman Kumar — Resume',
      file_url: 'https://res.cloudinary.com/amank736836/raw/upload/v1/portfolio/portfolio/Aman_Resume.pdf',
      file_name: 'Aman_Resume.pdf',
      file_size: 184320,
      is_active: true,
      is_favorite: true,
      uploaded_at: new Date('2026-01-06T10:00:00Z').toISOString(),
    },
  ],

  api_logs: [],
  csp_reports: [],
};

/** Deep clone so mutations in the offline store never touch the seed constants. */
export function cloneOfflineTables() {
  return JSON.parse(JSON.stringify(OFFLINE_TABLES));
}
