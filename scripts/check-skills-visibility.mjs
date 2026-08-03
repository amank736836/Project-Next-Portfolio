import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
dotenv.config({ path: join(PROJECT_ROOT, '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function run() {
  const { data } = await supabase.from('skills').select('id, title, is_hidden').order('id');
  console.log('All skills:', data);
  
  const { data: visible } = await supabase.from('skills').select('id, title, is_hidden').eq('is_hidden', false).order('id');
  console.log('Visible skills:', visible);
}
run();