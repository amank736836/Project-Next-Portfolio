import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function run() {
  // Check RLS status and policies
  const { data: rlsStatus } = await supabase.rpc('exec_sql', { 
    sql: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('_migrations', 'resumes')` 
  });
  console.log('RLS Status:', rlsStatus);
  
  const { data: policies } = await supabase.rpc('exec_sql', { 
    sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename IN ('_migrations', 'resumes')` 
  });
  console.log('Policies:', policies);
}
run();