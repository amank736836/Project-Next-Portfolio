import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase.rpc('exec_sql', { 
  sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'personal_info';" 
});

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('personal_info columns:');
data?.forEach(c => console.log('  ' + c.column_name + ': ' + c.data_type));