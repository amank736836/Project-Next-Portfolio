import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const sql = readFileSync(join(__dirname, 'update-db.sql'), 'utf8');
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  
  for (const stmt of statements) {
    try {
      await pool.query(stmt.trim());
      console.log('✓ Executed:', stmt.trim().substring(0, 60) + '...');
    } catch (err) {
      console.error('✗ Failed:', stmt.trim().substring(0, 60) + '...');
      console.error('  Error:', err.message);
    }
  }
  
  await pool.end();
  console.log('Migration complete');
}

runMigration().catch(console.error);