import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

dotenv.config({ path: join(PROJECT_ROOT, '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function run() {
  // Read the migration file to get its checksum
  const sql = fs.readFileSync(join(PROJECT_ROOT, 'sql', 'migrations', '021_enable_rls_on_public_tables.sql'), 'utf8');
  const checksum = crypto.createHash('sha256').update(sql).digest('hex').substring(0, 32);
  
  console.log('Checksum:', checksum);
  
  // Record the migration as applied
  const { error } = await supabase
    .from('_migrations')
    .upsert([{ 
      id: '021_enable_rls_on_public_tables', 
      name: 'enable rls on public tables', 
      checksum, 
      applied_at: new Date().toISOString(), 
      rolled_back_at: null 
    }]);
  
  if (error) console.error('Error:', error.message);
  else console.log('Migration recorded successfully');
}
run();