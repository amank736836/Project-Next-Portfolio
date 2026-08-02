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

async function run() {
  const sql = `
    CREATE TABLE IF NOT EXISTS audit_log (
        id BIGSERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        old_data JSONB,
        new_data JSONB,
        actor_email TEXT,
        ip_address INET,
        user_agent TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_email);

    ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_log;
    CREATE POLICY "Admins can view audit logs" ON audit_log
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM auth.users
                WHERE auth.users.id = auth.uid()
                AND auth.users.email = 'amankarguwal0@gmail.com'
            )
        );
  `;
  
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const stmt of statements) {
    if (!stmt.trim()) continue;
    const { error } = await supabase.rpc('exec_sql', { sql: stmt.trim() + ';' });
    if (error) console.error('Error:', error.message);
    else console.log('OK:', stmt.trim().slice(0, 60) + '...');
  }
  
  // Verify
  const { data, error } = await supabase.from('audit_log').select('*').limit(5);
  if (error) console.error('Verify error:', error.message);
  else console.log('audit_log table exists, sample:', data);
}
run();