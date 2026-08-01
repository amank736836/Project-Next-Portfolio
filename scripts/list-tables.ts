import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase.rpc('exec_sql', { 
  sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" 
});

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Tables in database:');
data?.forEach(t => console.log('  ' + t.tablename));