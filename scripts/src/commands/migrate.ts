import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection, executeSql } from '../lib/supabase.js';
import { getPendingMigrations, recordMigration, verifyMigrationIntegrity, getAppliedMigrations, getMigrationFiles } from '../lib/migrations.js';
import { logger } from '../lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'sql', 'migrations');

async function migrate(): Promise<void> {
  logger.step('Manual Migration Runner');
  
  // Load environment
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
  dotenv.config({ path: join(PROJECT_ROOT, '.env') });
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    logger.error('Cannot connect to database');
    process.exit(1);
  }
  
  // Get applied and pending
  const applied = await getAppliedMigrations();
  const pending = await getPendingMigrations(MIGRATIONS_DIR);
  const allFiles = getMigrationFiles(MIGRATIONS_DIR);
  
  logger.info(`Applied migrations: ${applied.length}`);
  logger.info(`Pending migrations: ${pending.length}`);
  
  if (pending.length === 0) {
    logger.success('No pending migrations');
    printStatus(allFiles, applied);
    return;
  }
  
  // Show pending
  for (const m of pending) {
    logger.info(`  - ${m.id}: ${m.name}`);
  }
  
  // Confirm
  const confirm = await prompt('Apply all pending migrations? (y/N): ');
  if (confirm.toLowerCase() !== 'y') {
    logger.info('Aborted');
    return;
  }
  
  // Apply
  for (const migration of pending) {
    await runMigration(migration);
  }
  
  logger.success('All migrations applied successfully');
  printStatus(allFiles, await getAppliedMigrations());
}

async function runMigration(migration: { id: string; name: string; sql: string; checksum: string }): Promise<void> {
  logger.step(`Applying: ${migration.id}`);
  
  // Verify integrity
  const verified = await verifyMigrationIntegrity(migration.id, migration.sql);
  if (!verified) {
    throw new Error(`Migration ${migration.id} failed integrity check`);
  }
  
  // Execute
  const statements = migration.sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const stmt of statements) {
    await executeSql(stmt + ';');
  }
  
  await recordMigration(migration.id, migration.name, migration.checksum);
  logger.success(`Applied: ${migration.id}`);
}

function printStatus(allFiles: { id: string; name: string }[], applied: { id: string; applied_at: string }[]) {
  const appliedMap = new Map(applied.map(a => [a.id, a.applied_at]));
  
  console.log('\nMigration Status:');
  console.log('─'.repeat(60));
  
  for (const file of allFiles) {
    const status = appliedMap.has(file.id) ? '✓ Applied' : '○ Pending';
    const date = appliedMap.get(file.id) ? new Date(appliedMap.get(file.id)!).toLocaleString() : '';
    console.log(`  ${file.id.padEnd(30)} ${status} ${date}`);
  }
}

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    process.stdout.write(question);
    process.stdin.once('data', data => resolve(data.toString().trim()));
  });
}

migrate().catch(err => {
  logger.error(`Migration failed: ${err}`);
  process.exit(1);
});