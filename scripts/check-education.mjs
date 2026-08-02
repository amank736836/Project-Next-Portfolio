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

async function checkEducation() {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Education records:');
  data.forEach(record => {
    console.log(`ID: ${record.id}, Year: ${record.year}, Title: ${record.title}`);
    console.log(`  GPA: ${record.gpa}`);
    console.log(`  Subjects: ${record.subjects}`);
    console.log(`  Achievements: ${record.achievements}`);
    console.log('---');
  });
}

checkEducation();