import pg from 'pg';

const client = new pg.Client({ 
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false } 
});

await client.connect();

try {
  // Fix exec_sql function to return proper jsonb
  await client.query(`
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS SETOF jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      RETURN QUERY EXECUTE sql;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'SQL Error: %', SQLERRM;
    END;
    $$;
    
    GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
  `);
  console.log('Function fixed');
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await client.end();
}