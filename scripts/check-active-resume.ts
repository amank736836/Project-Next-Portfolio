import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase
  .from('resumes')
  .select('*')
  .eq('is_active', true)
  .single();

if (error) {
  console.error('Error:', error);
} else {
  console.log('Active resume:', data);
}

const { data: all } = await supabase.from('resumes').select('*');
console.log('\nAll resumes:', all);