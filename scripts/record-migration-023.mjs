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
  const sql = fs.readFileSync(join(PROJECT_ROOT, 'sql', 'migrations', '023_create_audit_log.sql'), 'utf8');
  const checksum = crypto.createHash('sha256').update(sql).digest('hex').substring(0, 32);
  
  console.log('Checksum:', checksum);
  
  const { error } = await supabase
    .from('_migrations')
    .upsert([{ 
      id: '023_create_audit_log', 
      name: 'create audit log', 
      checksum, 
      applied_at: new Date().toISOString(), 
      rolled_back_at: null 
    }]);
  
  if (error) console.error('Error:', error.message);
  else console.log('Migration 023 recorded successfully');
}
run();