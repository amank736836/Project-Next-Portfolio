import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase.from('projects').select('id, title, img, image');

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Projects in database:');
data?.forEach(p => {
  console.log(`  ${p.id}: ${p.title}`);
  console.log(`    img: ${p.img}`);
  console.log(`    image: ${p.image}`);
  console.log('');
});