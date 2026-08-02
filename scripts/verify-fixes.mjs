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
  // Check function search_path
  const { data: funcs } = await supabase.rpc('exec_sql', { 
    sql: `SELECT proname, prosecdef, proconfig FROM pg_proc WHERE proname IN ('update_user_settings_updated_at', 'update_skill_categories_updated_at', 'update_hero_images_updated_at', 'enforce_single_hero_image', 'enforce_single_active_resume', 'update_social_links_updated_at')` 
  });
  console.log('Functions:', funcs);
  
  // Check csp_reports policies
  const { data: cspPolicies } = await supabase.rpc('exec_sql', { 
    sql: `SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'csp_reports'` 
  });
  console.log('CSP Reports Policies:', cspPolicies);
  
  // Check exec_sql permissions
  const { data: execPerms } = await supabase.rpc('exec_sql', { 
    sql: `SELECT grantee, privilege_type FROM information_schema.routine_privileges WHERE routine_name = 'exec_sql'` 
  });
  console.log('exec_sql permissions:', execPerms);
  
  // Check education, experience, skills policies
  for (const table of ['education', 'experience', 'skills']) {
    const { data: policies } = await supabase.rpc('exec_sql', { 
      sql: `SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = '${table}'` 
    });
    console.log(`${table} policies:`, policies);
  }
}
run();