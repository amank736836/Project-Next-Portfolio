const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const sql = fs.readFileSync(path.join(__dirname, 'update-db.sql'), 'utf8');
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