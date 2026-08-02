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

async function fixEducation() {
  const updates = [
    {
      id: 1,
      description: 'Computer Science Engineering – Solan, Himachal Pradesh',
      achievements: null
    },
    {
      id: 2,
      description: 'Science Stream – Jaipur, Rajasthan',
      achievements: null
    },
    {
      id: 3,
      description: 'Mohali, Punjab',
      achievements: null
    }
  ];

  for (const u of updates) {
    const { data, error } = await supabase
      .from('education')
      .update({ 
        description: u.description,
        achievements: u.achievements
      })
      .eq('id', u.id)
      .select();

    if (error) {
      console.error(`Error updating ID ${u.id}:`, error.message);
    } else {
      console.log(`Updated ID ${u.id}:`, data[0]);
    }
  }
}

fixEducation();