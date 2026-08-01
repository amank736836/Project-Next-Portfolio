import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase.from('resumes').select('*');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Resumes in database:');
data?.forEach(r => console.log('  ' + r.id + ': ' + r.title + ' | active: ' + r.is_active + ' | url: ' + r.file_url));