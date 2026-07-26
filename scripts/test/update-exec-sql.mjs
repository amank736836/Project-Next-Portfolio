import pg from 'pg';

const client = new pg.Client({ 
  connectionString: 'postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false } 
});

await client.connect();

// Use a different approach - use DO block to create function with proper exception handling
const sql = `
DROP FUNCTION IF EXISTS exec_sql(text);

CREATE FUNCTION exec_sql(sql text)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec record;
BEGIN
  -- Use EXECUTE with RETURN QUERY for SELECT statements
  -- For DDL, we'll execute and return a status object
  
  -- Try to execute as a query
  BEGIN
    FOR rec IN EXECUTE sql LOOP
      RETURN NEXT to_jsonb(rec);
    END LOOP;
  EXCEPTION WHEN OTHERS THEN
    -- If it's a DDL statement (doesn't return rows), execute it directly
    EXECUTE sql;
    RETURN NEXT jsonb_build_object('status', 'ok');
  END;
  
  RETURN;
END;
$$;

GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
`;

await client.query(sql);
console.log('Function updated');
await client.end();