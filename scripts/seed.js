const admin = require('firebase-admin');
require('dotenv').config({ path: '.env' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const portfolioData = [
  {
    id: 1,
    img: "/assets/frameandphrase.png",
    title: "Blogging Website",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "Blogging Website" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/Blogging-Website" },
      { icon: "FaCode", title: "Language : ", desc: "ReactJs - Appwrite" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://frameandphrase.vercel.app/" }
    ]
  },
  {
    id: 2,
    img: "/assets/ciphergen.png",
    title: "Password Generator",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "Password Generator" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/password-Generator" },
      { icon: "FaCode", title: "Language : ", desc: "React JS" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://ciphergen.vercel.app/" }
    ]
  },
  {
    id: 3,
    img: "/assets/cashcode.png",
    title: "Currency Converter",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "Currency Converter" },
      { icon: "FiUser", title: "Github : ", desc: "https://github.com/amank736836/currency-Convertor" },
      { icon: "FaCode", title: "Language : ", desc: "React JS" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://cashcode.vercel.app/" }
    ]
  },
  {
    id: 4,
    img: "/assets/organizeit.png",
    title: "To Do List",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "To Do List" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/todo-ContextLocal---React" },
      { icon: "FaCode", title: "Language : ", desc: "React JS, Context API" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://organizeit.vercel.app/" }
    ]
  },
  {
    id: 5,
    img: "/assets/selfdevelopmentgoals.png",
    title: "Landing Page",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "Landing Page" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/SDG" },
      { icon: "FaCode", title: "Language : ", desc: "Html - Css - Javascript" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://selfdevelopmentgoals.vercel.app/" }
    ]
  },
  {
    id: 6,
    img: "/assets/ecommerce.png",
    title: "Ecommerce Website",
    isHidden: false,
    details: [
      { icon: "FiFileText", title: "Project : ", desc: "Ecommerce Website" },
      { icon: "FiGithub", title: "Github : ", desc: "https://github.com/amank736836/Products-Server" },
      { icon: "FaCode", title: "Language : ", desc: "MongoDb - ExpressJs - NodeJs" },
      { icon: "FiExternalLink", title: "Preview : ", desc: "https://products-server-u5b7.onrender.com/" }
    ]
  }
];

const personalInfo = [
  { key: "first_name", title: "First Name : ", description: "Aman" },
  { key: "last_name", title: "Last Name : ", description: "Kumar" },
  { key: "age", title: "Age : ", description: "20 Years" },
  { key: "nationality", title: "Nationality : ", description: "Indian" },
  { key: "freelance", title: "Freelance : ", description: "Available" },
  { key: "address", title: "Address : ", description: "Jaipur,Rajasthan,India" },
  { key: "phone", title: "Phone : ", description: "+91 62847 36836" },
  { key: "email", title: "Email : ", description: "amankarguwal0@gmail.com" },
  { key: "linkedin", title: "LinkedIn : ", description: "amank736836" },
  { key: "languages", title: "Languages : ", description: "English, Hindi, Punjabi" }
];

async function seed() {
  console.log('Seeding database...');
  
  // Seed Projects
  for (const project of portfolioData) {
    await db.collection('projects').doc(project.id.toString()).set(project);
  }
  
  // Seed Personal Info
  for (const info of personalInfo) {
    await db.collection('info').doc(info.key).set(info);
  }
  
  console.log('Seeding complete!');
}

seed().catch(console.error);
