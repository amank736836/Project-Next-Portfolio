import pg from 'pg';

const client = new pg.Client({ 
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false } 
});

await client.connect();

const tables = ['projects', 'personal_info', 'skills', 'education', 'experience'];

for (const table of tables) {
  const r = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = $1", [table]);
  console.log(`${table} columns:`, r.rows.map(x => x.column_name));
}

await client.end();