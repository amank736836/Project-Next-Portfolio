import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

console.log('Loading env from:', PROJECT_ROOT);

const result1 = dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
const result2 = dotenv.config({ path: join(PROJECT_ROOT, '.env') });

console.log('env.local loaded:', !result1.error, result1.error);
console.log('env loaded:', !result2.error, result2.error);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SERVICE_ROLE_KEY:', process.env.SERVICE_ROLE_KEY ? 'SET' : 'MISSING');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function updateFacebook() {
  const { data, error } = await supabase
    .from('personal_info')
    .update({ description: 'https://facebook.com/amank736836' })
    .eq('key', 'facebook')
    .select();

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Updated:', data);
}

updateFacebook();