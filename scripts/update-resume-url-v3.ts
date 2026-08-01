import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const newUrl = 'https://res.cloudinary.com/amank736836/raw/upload/v1785592498/portfolio/portfolio/Aman_Resume_v3.pdf';

const { data, error } = await supabase
  .from('resumes')
  .update({ file_url: newUrl, file_name: 'Aman_Resume_v3.pdf' })
  .eq('is_active', true)
  .select();

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Updated resume URL:', data);