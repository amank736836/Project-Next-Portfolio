import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
dotenv.config({ path: join(PROJECT_ROOT, '.env') });

const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  console.log('Testing anon client with is_hidden filter...');
  const { data, error } = await anonClient
    .from('skills')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });
  console.log('Anon skills (visible):', data?.length, error?.message || '');
  
  if (data) {
    console.log('First skill:', data[0]);
  }
}
run();