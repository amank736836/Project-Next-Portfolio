const { Client } = require('pg');

const client = new Client({ 
  connectionString: "postgresql://postgres:postgres@db.ptjssukfxkxtlbehxdqk.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false } 
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected!');
    
    // Create exec_sql function
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
    
    // Create _migrations table
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
    
    // Apply initial schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        img TEXT,
        image TEXT,
        description TEXT,
        is_hidden BOOLEAN DEFAULT FALSE,
        details JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS personal_info (
        key TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS skills (
        id BIGSERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        percentage INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS education (
        id BIGSERIAL PRIMARY KEY,
        year TEXT,
        title TEXT NOT NULL,
        description TEXT,
        is_hidden BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS experience (
        id BIGSERIAL PRIMARY KEY,
        year TEXT,
        title TEXT NOT NULL,
        description TEXT,
        is_hidden BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_projects_is_hidden ON projects(is_hidden);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_education_is_hidden ON education(is_hidden);
      CREATE INDEX IF NOT EXISTS idx_experience_is_hidden ON experience(is_hidden);
    `);
    console.log('Schema applied');
    
    // Record initial migration
    await client.query(`
      INSERT INTO _migrations (id, name, checksum)
      VALUES ('001_initial_schema', 'Initial schema', 'manual_setup')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Migration recorded');
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}
setup();