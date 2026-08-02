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
  const { data, error } = await supabase.from('personal_info').select('key, description').in('key', ['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'email', 'website', 'codolio']);
  if (error) console.error(error);
  else console.log('Social links in personal_info:', data?.length || 0, data);
  
  const { data: all } = await supabase.from('personal_info').select('key, description');
  console.log('All personal_info keys:', all?.map(r => r.key));
}
run();