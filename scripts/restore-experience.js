const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

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

async function restore() {
  console.log('Restoring Experience data (Wabtec)...');
  
  // Clear and Seed Experience
  await supabase.from('experience').delete().neq('id', 0);
  const { error: expError } = await supabase.from('experience').insert(experience);
  
  if (expError) {
    console.error('Error restoring experience:', expError);
  } else {
    console.log('Experience data restored successfully!');
  }
}

restore().catch(console.error);
