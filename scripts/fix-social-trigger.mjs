import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

async function run() {
  const sql = `
    CREATE OR REPLACE FUNCTION update_social_links_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS trigger_update_social_links_updated_at ON social_links;
    CREATE TRIGGER trigger_update_social_links_updated_at
        BEFORE UPDATE ON social_links
        FOR EACH ROW
        EXECUTE FUNCTION update_social_links_updated_at();
  `;
  
  const { error } = await supabase.rpc('exec_sql', { sql });
  if (error) console.error('Error:', error.message);
  else console.log('Trigger created successfully');
}
run();