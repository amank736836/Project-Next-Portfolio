import pg from 'pg';

const client = new pg.Client({ 
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false } 
});

await client.connect();

// Add missing created_at to projects
try {
  await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`);
  console.log('Added created_at to projects');
} catch (e) {
  console.log('Error:', e.message);
}

// Verify
const r = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
console.log('Projects columns:', r.rows.map(x => x.column_name));

await client.end();