import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const sql = `INSERT INTO resumes (title, file_url, file_name, file_size, is_active, is_favorite) VALUES 
('Full Stack Developer Resume', 'https://res.cloudinary.com/amank736836/image/upload/v1785565571/portfolio/portfolio/Aman_Resume.pdf', 'Aman_Resume.pdf', 102400, true, true)
ON CONFLICT DO NOTHING;`;

const { error } = await supabase.rpc('exec_sql', { sql });

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Resume inserted successfully');