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
  const { error } = await supabase.rpc('exec_sql', { sql: 'ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;' });
  if (error) console.error('Error:', error.message);
  else console.log('RLS enabled on _migrations');
  
  const { data: rlsStatus } = await supabase.rpc('exec_sql', { 
    sql: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('_migrations', 'resumes')" 
  });
  console.log('RLS Status:', rlsStatus);
}
run();