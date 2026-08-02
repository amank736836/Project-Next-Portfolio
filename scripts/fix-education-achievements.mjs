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
  // First check current values
  const { data: before } = await supabase.from('education').select('id, achievements').order('id');
  console.log('Before:', before);
  
  // Set achievements to null for all education records
  const { error } = await supabase
    .from('education')
    .update({ achievements: null })
    .neq('id', 0); // Update all records
  
  if (error) console.error('Error:', error.message);
  else console.log('Updated achievements to null');
  
  // Verify
  const { data: after } = await supabase.from('education').select('id, achievements').order('id');
  console.log('After:', after);
}
run();