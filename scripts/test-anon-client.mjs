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
  // Test anon client
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  console.log('Testing anon client...');
  const { data: anonSkills, error: anonError } = await anonClient
    .from('skills')
    .select('*')
    .order('id', { ascending: true });
  console.log('Anon skills:', anonSkills?.length, anonError?.message || '');
  
  const { data: anonSkillsVisible, error: anonVisibleError } = await anonClient
    .from('skills')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });
  console.log('Anon skills (visible):', anonSkillsVisible?.length, anonVisibleError?.message || '');
  
  // Test with service role
  const { data: adminSkills, error: adminError } = await supabase
    .from('skills')
    .select('*')
    .order('id', { ascending: true });
  console.log('Admin skills:', adminSkills?.length, adminError?.message || '');
  
  // Test skill_categories
  const { data: anonCategories, error: anonCatError } = await anonClient
    .from('skill_categories')
    .select('*')
    .order('display_order', { ascending: true });
  console.log('Anon categories:', anonCategories?.length, anonCatError?.message || '');
}
run();