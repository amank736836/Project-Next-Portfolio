import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection, executeSql } from '../lib/supabase.js';
import { getPendingMigrations, recordMigration, verifyMigrationIntegrity } from '../lib/migrations.js';
import { logger } from '../lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'sql', 'migrations');

async function watch(): Promise<void> {
  logger.step('SQL Migration Watcher');
  
  // Load environment
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
  dotenv.config({ path: join(PROJECT_ROOT, '.env') });
  
  // Test connection with retries
  const connected = await testConnection();
  if (!connected) {
    logger.warn('Database not available, skipping migration check');
    logger.info('Run `npm run db:migrate` manually when database is ready');
    return;
  }
  
  // Get pending migrations
  const pending = await getPendingMigrations(MIGRATIONS_DIR);
  
  if (pending.length === 0) {
    logger.success('No pending migrations');
    return;
  }
  
  logger.step(`Found ${pending.length} pending migration(s)`);
  
  // Apply each pending migration
  for (const migration of pending) {
    await runMigration(migration);
  }
  
  logger.success('All migrations applied successfully');
}

async function runMigration(migration: { id: string; name: string; sql: string; checksum: string }): Promise<void> {
  logger.step(`Applying: ${migration.id}`);
  
  // Verify integrity
  const verified = await verifyMigrationIntegrity(migration.id, migration.sql);
  if (!verified) {
    throw new Error(`Migration ${migration.id} failed integrity check`);
  }
  
  // Execute migration
  const statements = migration.sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const stmt of statements) {
    await executeSql(stmt + ';');
  }
  
  // Record migration
  await recordMigration(migration.id, migration.name, migration.checksum);
  logger.success(`Applied: ${migration.id}`);
}

watch().catch(err => {
  logger.error(`Migration watcher failed: ${err}`);
  process.exit(1);
});