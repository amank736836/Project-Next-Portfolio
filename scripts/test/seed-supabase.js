const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

const portfolioData = [
  {
    id: 1,
    img: "/assets/frameandphrase.png",
    title: "Blogging Website",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "Blogging Website" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/Blogging-Website" },
      { icon: "FaCode", title: "Language : ", desc: "ReactJs - Appwrite" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://frameandphrase.vercel.app/" }
    ])
  },
  {
    id: 2,
    img: "/assets/ciphergen.png",
    title: "Password Generator",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "Password Generator" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/password-Generator" },
      { icon: "FaCode", title: "Language : ", desc: "React JS" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://ciphergen.vercel.app/" }
    ])
  },
  {
    id: 3,
    img: "/assets/cashcode.png",
    title: "Currency Converter",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "Currency Converter" },
      { icon: "FiUser", title: "Github : ", desc: "https://github.com/amank736836/currency-Convertor" },
      { icon: "FaCode", title: "Language : ", desc: "React JS" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://cashcode.vercel.app/" }
    ])
  },
  {
    id: 4,
    img: "/assets/organizeit.png",
    title: "To Do List",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "To Do List" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/todo-ContextLocal---React" },
      { icon: "FaCode", title: "Language : ", desc: "React JS, Context API" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://organizeit.vercel.app/" }
    ])
  },
  {
    id: 5,
    img: "/assets/selfdevelopmentgoals.png",
    title: "Landing Page",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "Landing Page" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/SDG" },
      { icon: "FaCode", title: "Language : ", desc: "Html - Css - Javascript" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://selfdevelopmentgoals.vercel.app/" }
    ])
  },
  {
    id: 6,
    img: "/assets/ecommerce.png",
    title: "Ecommerce Website",
    is_hidden: false,
    details: JSON.stringify([
      { icon: "FiFileText", title: "Project : ", desc: "Ecommerce Website" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/Products-Server" },
      { icon: "FaCode", title: "Language : ", desc: "MongoDb - ExpressJs - NodeJs" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://products-server-u5b7.onrender.com/" }
    ])
  }
];

const personalInfo = [
  { key: "first_name", title: "First Name : ", description: "Aman" },
  { key: "last_name", title: "Last Name : ", description: "Kumar" },
  { key: "age", title: "Age : ", description: "21 Years" },
  { key: "nationality", title: "Nationality : ", description: "Indian" },
  { key: "freelance", title: "Freelance : ", description: "Available" },
  { key: "address", title: "Address : ", description: "Jaipur,Rajasthan,India" },
  { key: "phone", title: "Phone : ", description: "+91 62847 36836" },
  { key: "email", title: "Email : ", description: "amankarguwal0@gmail.com" },
  { key: "linkedin", title: "LinkedIn : ", description: "amank736836" },
  { key: "languages", title: "Languages : ", description: "English, Hindi, Punjabi" },
  { key: "about_description", title: "About Me : ", description: "I'm a passionate Full Stack Developer with a focus on building scalable web applications and intuitive user interfaces. I love turning complex problems into simple, beautiful, and intuitive designs." }
];

const education = [
  { id: 1, year: "Sep 2021 - May 2025", title: "Bachelor Of Engineering - <span> Chitkara University </span>", description: "Computer Science Engineering – GPA: 9.12 – Solan, Himachal Pradesh" },
  { id: 2, year: "May 2020 - June 2021", title: "Higher Secondary - <span> DAV Centenary Public School </span>", description: "Percentage: 82.5% – Jaipur, Rajasthan" },
  { id: 3, year: "May 2018 - April 2019", title: "Secondary - <span> DAV Public School </span>", description: "Percentage: 74.8% – Mohali, Punjab" }
];

const experience = [
  {
    id: 1,
    year: "Sep 2025 – Present",
    title: "Software Engineer - <span> Techpearl Software </span>",
    description: "Optimized bulk data workflows and backend performance. Reduced bulk import time for 9k records by 66%. Revamped Org Chart queries, cutting response times from 50s to 0.2s using optimized joins."
  },
  {
    id: 2,
    year: "Jan 2025 – Aug 2025",
    title: "Project Management Intern - <span> Wabtec Corporation </span>",
    description: "Collaborated with cross-functional teams to gather requirements and enhance software performance. Tested digital solutions and validated requirements for production-grade projects."
  }
];

const skills = [
  { id: 1, title: "Html" },
  { id: 2, title: "Javascript" },
  { id: 3, title: "Css" },
  { id: 4, title: "C++" },
  { id: 5, title: "Java" },
  { id: 6, title: "MongoDb" },
  { id: 7, title: "ExpressJs" },
  { id: 8, title: "React" },
  { id: 9, title: "NodeJs" },
  { id: 10, title: "C" }
];

async function seed() {
  console.log('Seeding Supabase database...');

  // Clear and Seed Projects
  await supabase.from('projects').delete().neq('id', 0);
  const { error: pError } = await supabase.from('projects').upsert(portfolioData);
  if (pError) console.error('Error seeding projects:', pError);

  // Clear and Seed Info
  await supabase.from('personal_info').delete().neq('key', '');
  const { error: iError } = await supabase.from('personal_info').upsert(personalInfo);
  if (iError) console.error('Error seeding info:', iError);

  // Clear and Seed Skills
  await supabase.from('skills').delete().neq('id', 0);
  const { error: sError } = await supabase.from('skills').upsert(skills);
  if (sError) console.error('Error seeding skills:', sError);

  // Clear and Seed Education
  await supabase.from('education').delete().neq('id', 0);
  const { error: eError } = await supabase.from('education').upsert(education);
  if (eError) console.error('Error seeding education:', eError);

  // Clear and Seed Experience
  await supabase.from('experience').delete().neq('id', 0);
  const { error: expError } = await supabase.from('experience').upsert(experience);
  if (expError) console.error('Error seeding experience:', expError);

  console.log('Seeding process finished!');
}

seed().catch(console.error);
