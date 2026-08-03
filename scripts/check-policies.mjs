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
  const { data } = await supabase.rpc('exec_sql', { 
    sql: `SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'skills'` 
  });
  console.log('Skills policies:', data);
  
  const { data: catData } = await supabase.rpc('exec_sql', { 
    sql: `SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'skill_categories'` 
  });
  console.log('Categories policies:', catData);
}
run();