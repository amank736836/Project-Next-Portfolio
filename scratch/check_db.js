import { createClient } from './lib/supabase/server';

async function checkColumns() {
  const supabase = await createClient();
  
  console.log('Checking projects...');
  const { data: p, error: pe } = await supabase.from('projects').select('id, is_hidden').limit(1);
  console.log('Projects is_hidden:', pe ? 'Missing' : 'Exists');

  console.log('Checking education...');
  const { data: ed, error: ede } = await supabase.from('education').select('id, is_hidden').limit(1);
  console.log('Education is_hidden:', ede ? 'Missing' : 'Exists');

  console.log('Checking experience...');
  const { data: ex, error: exe } = await supabase.from('experience').select('id, is_hidden').limit(1);
  console.log('Experience is_hidden:', exe ? 'Missing' : 'Exists');
}

checkColumns();
