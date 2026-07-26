import pg from 'pg';

const client = new pg.Client({ 
  connectionString: "postgresql://postgres:Amankarguwal%402002@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false } 
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected!');
    
    // Create exec_sql function
    try {
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
      console.log('Function created');
    } catch (e) {
      console.log('Function error:', e.message);
    }
    
    // Create _migrations table
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          checksum TEXT NOT NULL,
          applied_at TIMESTAMPTZ DEFAULT NOW(),
          rolled_back_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS idx_migrations_applied_at ON _migrations(applied_at);
        GRANT ALL ON _migrations TO service_role;
      `);
      console.log('Migrations table created');
    } catch (e) {
      console.log('Migrations table error:', e.message);
    }
    
    // Apply initial schema - split into separate queries
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id BIGSERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          img TEXT,
          image TEXT,
          description TEXT,
          is_hidden BOOLEAN DEFAULT FALSE,
          details JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('Projects table created');
    } catch (e) {
      console.log('Projects table error:', e.message);
    }
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS personal_info (
          key TEXT PRIMARY KEY,
          title TEXT,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('Personal info table created');
    } catch (e) {
      console.log('Personal info table error:', e.message);
    }
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id BIGSERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          percentage INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('Skills table created');
    } catch (e) {
      console.log('Skills table error:', e.message);
    }
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS education (
          id BIGSERIAL PRIMARY KEY,
          year TEXT,
          title TEXT NOT NULL,
          description TEXT,
          is_hidden BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('Education table created');
    } catch (e) {
      console.log('Education table error:', e.message);
    }
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS experience (
          id BIGSERIAL PRIMARY KEY,
          year TEXT,
          title TEXT NOT NULL,
          description TEXT,
          is_hidden BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      console.log('Experience table created');
    } catch (e) {
      console.log('Experience table error:', e.message);
    }
    
    // Indexes
    try {
      await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON projects(is_hidden);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_education_is_hidden ON education(is_hidden);`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_experience_is_hidden ON experience(is_hidden);`);
      console.log('Indexes created');
    } catch (e) {
      console.log('Indexes error:', e.message);
    }
    
    // Record initial migration
    try {
      await client.query(`
        INSERT INTO _migrations (id, name, checksum)
        VALUES ('001_initial_schema', 'Initial schema', 'manual_setup')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('Migration recorded');
    } catch (e) {
      console.log('Migration record error:', e.message);
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}
setup();