import { getSupabaseClient } from './supabase.js';
import { logger } from './logger.js';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface MigrationRecord {
  id: string;
  name: string;
  checksum: string;
  applied_at: string;
  rolled_back_at: string | null;
}

export interface MigrationFile {
  id: string;
  name: string;
  path: string;
  sql: string;
  checksum: string;
  rollbackPath?: string;
  rollbackSql?: string;
}

const MIGRATIONS_TABLE = '_migrations';

export async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  const client = getSupabaseClient();
  
  const { data, error } = await client
    .from(MIGRATIONS_TABLE)
    .select('*')
    .order('applied_at', { ascending: true });

  if (error) {
    if (error.code === 'PGRST116') return []; // Table doesn't exist
    throw new Error(`Failed to fetch applied migrations: ${error.message}`);
  }

  return data || [];
}

export async function getPendingMigrations(migrationsDir: string): Promise<MigrationFile[]> {
  const files = getMigrationFiles(migrationsDir);
  const applied = await getAppliedMigrations();
  const appliedIds = new Set(applied.filter(a => !a.rolled_back_at).map(a => a.id));
  
  return files.filter(f => !appliedIds.has(f.id));
}

export function getMigrationFiles(migrationsDir: string): MigrationFile[] {
  
  if (!fs.existsSync(migrationsDir)) return [];
  
  const files = fs.readdirSync(migrationsDir)
    .filter((f: string) => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
    .sort();
  
  const migrations: MigrationFile[] = [];
  
  for (const file of files) {
    const id = file.replace('.sql', '');
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex').substring(0, 32);
    
    const rollbackPath = path.join(migrationsDir, `${id}.rollback.sql`);
    let rollbackSql: string | undefined;
    if (fs.existsSync(rollbackPath)) {
      rollbackSql = fs.readFileSync(rollbackPath, 'utf8');
    }
    
    migrations.push({
      id,
      name: id.split('_').slice(1).join(' '),
      path: path.join(migrationsDir, file),
      sql,
      checksum,
      rollbackPath: fs.existsSync(rollbackPath) ? rollbackPath : undefined,
      rollbackSql,
    });
  }
  
  return migrations;
}

export async function recordMigration(id: string, name: string, checksum: string): Promise<void> {
  const client = getSupabaseClient();
  
  const { error } = await client
    .from(MIGRATIONS_TABLE)
    .upsert([{ id, name, checksum, applied_at: new Date().toISOString(), rolled_back_at: null }]);
  
  if (error) throw new Error(`Failed to record migration: ${error.message}`);
  
  logger.debug(`Recorded migration: ${id}`);
}

export async function recordRollback(id: string): Promise<void> {
  const client = getSupabaseClient();
  
  const { error } = await client
    .from(MIGRATIONS_TABLE)
    .update({ rolled_back_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw new Error(`Failed to record rollback: ${error.message}`);
  
  logger.debug(`Recorded rollback: ${id}`);
}

export async function deleteMigrationRecord(id: string): Promise<void> {
  const client = getSupabaseClient();
  
  const { error } = await client
    .from(MIGRATIONS_TABLE)
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(`Failed to delete migration record: ${error.message}`);
  
  logger.debug(`Deleted migration record: ${id}`);
}

export async function verifyMigrationIntegrity(id: string, sql: string): Promise<boolean> {
  const applied = await getAppliedMigrations();
  const record = applied.find(m => m.id === id);
  
  if (!record) return true; // New migration, no record to verify
  
  const currentChecksum = crypto.createHash('sha256').update(sql).digest('hex').substring(0, 32);
  
  if (record.checksum !== currentChecksum) {
    logger.error(`Checksum mismatch for ${id}!`);
    logger.error(`  Recorded: ${record.checksum}`);
    logger.error(`  Current:  ${currentChecksum}`);
    logger.error('Migration file has been modified after being applied!');
    return false;
  }
  
  return true;
}