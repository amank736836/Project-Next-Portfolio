const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkDb() {
  console.log('Checking Supabase for projects...');
  const { data, error } = await supabase.from('projects').select('*');

  if (error) {
    console.error('Error fetching projects:', error.message);
    return;
  }

  console.log(`Found ${data.length} projects.`);
  if (data.length > 0) {
    console.log('Sample project:', data[0].title);
  } else {
    console.log('The projects table is empty.');
  }

  // Also check other tables while we are at it
  const tables = ['skills', 'education', 'experience'];
  for (const table of tables) {
    const { data: tableData, error: tableError } = await supabase.from(table).select('*');
    if (tableError) {
      console.error(`Error fetching ${table}:`, tableError.message);
    } else {
      console.log(`Table ${table}: ${tableData.length} entries.`);
    }
  }
}

checkDb();
