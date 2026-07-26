import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getSupabaseClient, executeSql } from '../lib/supabase.js';
import { getAppliedMigrations, recordRollback } from '../lib/migrations.js';
import { readMigrationFile } from '../lib/git.js';
import { logger } from '../lib/logger.js';
import * as fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'sql', 'migrations');

async function rollback(): Promise<void> {
  logger.step('Rollback Migration');
  
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
  dotenv.config({ path: join(PROJECT_ROOT, '.env') });
  
  // Get migration ID from args
  const args = process.argv.slice(2);
  const targetId = args[0];
  
  if (!targetId) {
    logger.error('Usage: npm run db:rollback <migration-id>');
    logger.info('Example: npm run db:rollback 004_add_site_mode');
    process.exit(1);
  }
  
  try {
    const client = getSupabaseClient();
    
    // Test connection
    const { error } = await client.from('_migrations').select('id').limit(1);
    if (error && error.code !== 'PGRST116') throw error;
    
    // Get applied migrations
    const applied = await getAppliedMigrations();
    const appliedMap = new Map(applied.map(a => [a.id, a]));
    
    if (!appliedMap.has(targetId)) {
      logger.error(`Migration ${targetId} is not applied`);
      
      const localFiles = fs.existsSync(MIGRATIONS_DIR)
        ? fs.readdirSync(MIGRATIONS_DIR)
            .filter((f: string) => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
            .sort()
        : [];
      
      logger.info('Available migrations:');
      for (const f of localFiles) {
        const status = appliedMap.has(f.replace('.sql', '')) ? 'applied' : 'pending';
        console.log(`  ${f.replace('.sql', '')} (${status})`);
      }
      process.exit(1);
    }
    
    const record = appliedMap.get(targetId)!;
    if (record.rolled_back_at) {
      logger.warn(`Migration ${targetId} already rolled back`);
      return;
    }
    
    // Check if later migrations applied
    const laterApplied = applied
      .filter(a => !a.rolled_back_at)
      .filter(a => a.id > targetId);
    
    if (laterApplied.length > 0) {
      logger.warn('Later migrations must be rolled back first:');
      for (const a of laterApplied) {
        console.log(`  ${a.id} (applied ${new Date(a.applied_at).toLocaleString()})`);
      }
      process.exit(1);
    }
    
    // Read rollback SQL
    const { rollbackSql } = readMigrationFile(targetId);
    
    if (!rollbackSql) {
      logger.error(`No rollback file found for ${targetId}`);
      logger.info(`Expected: ${MIGRATIONS_DIR}/${targetId}.rollback.sql`);
      process.exit(1);
    }
    
    logger.warn(`Rolling back: ${targetId}`);
    logger.warn('This will execute the rollback SQL. Ensure you have a backup!');
    
    // Confirm
    const confirm = await prompt('Continue? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      logger.info('Aborted');
      return;
    }
    
    // Execute rollback
    const statements = rollbackSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const stmt of statements) {
      await executeSql(stmt + ';');
    }
    
    // Record rollback
    await recordRollback(targetId);
    
    logger.success(`Rolled back: ${targetId}`);
    
  } catch (error) {
    logger.error(`Rollback failed: ${error}`);
    process.exit(1);
  }
}

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    process.stdout.write(question);
    process.stdin.once('data', data => resolve(data.toString().trim()));
  });
}

rollback().catch(err => {
  logger.error(`Fatal error: ${err}`);
  process.exit(1);
});