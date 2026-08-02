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

async function checkPersonalInfo() {
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .order('key', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Personal Info records:');
  data.forEach(record => {
    console.log(`Key: ${record.key}, Title: ${record.title}, Description: ${record.description}, Hidden: ${record.is_hidden}`);
  });
}

checkPersonalInfo();