import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection, executeSql } from '../lib/supabase.js';
import { getPendingMigrations, recordMigration, verifyMigrationIntegrity, getAppliedMigrations, getMigrationFiles } from '../lib/migrations.js';
import { logger } from '../lib/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'sql', 'migrations');

// Check for --yes/--force flag
const FORCE = process.argv.includes('--yes') || process.argv.includes('--force');

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
  
  // Confirm (skip if --yes/--force)
  if (!FORCE) {
    const confirm = await prompt('Apply all pending migrations? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      logger.info('Aborted');
      return;
    }
  } else {
    logger.info('Auto-confirming (--yes flag detected)');
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
  
  // Pre-migration cleanup: drop any existing objects that might have been created by a previous failed run
  await cleanupBeforeMigration(migration.id);
  
  // Execute - split by semicolon but respect dollar-quoted strings ($$...$$)
  const statements = splitSqlStatements(migration.sql);
  
  logger.debug(`Parsed ${statements.length} statements for ${migration.id}`);
  for (let i = 0; i < statements.length; i++) {
    const preview = statements[i].substring(0, 60).replace(/\n/g, ' ') + '...';
    logger.debug(`  Statement ${i + 1}: ${preview}`);
  }
  
  // Debug: show raw SQL start
  console.log(`Raw SQL start: ${migration.sql.substring(0, 300)}`);
  
  // Extra debug: trace first statement finding
  const firstSemi = migration.sql.indexOf(';');
  console.log(`First semicolon at index: ${firstSemi}`);
  console.log(`Content around first semicolon: ${migration.sql.substring(Math.max(0, firstSemi - 50), firstSemi + 50)}`);
  
  for (const stmt of statements) {
    await executeSql(stmt + ';');
  }
  
  await recordMigration(migration.id, migration.name, migration.checksum);
  logger.success(`Applied: ${migration.id}`);
}

async function cleanupBeforeMigration(migrationId: string): Promise<void> {
  logger.info(`Cleaning up before migration: ${migrationId}`);
  
  if (migrationId === '005_add_user_settings') {
    // Drop policies if they exist (ignore errors if table doesn't exist)
    await executeSql(`DROP POLICY IF EXISTS "Allow admin insert" ON user_settings;`).catch(() => {});
    await executeSql(`DROP POLICY IF EXISTS "Allow admin update" ON user_settings;`).catch(() => {});
    await executeSql(`DROP POLICY IF EXISTS "Allow admin delete" ON user_settings;`).catch(() => {});
    // Drop table if it exists (in case partial creation)
    await executeSql(`DROP TABLE IF EXISTS user_settings CASCADE;`);
  }
  
  if (migrationId === '006_add_api_logs') {
    await executeSql(`DROP POLICY IF EXISTS "Service role write access" ON api_logs;`).catch(() => {});
    await executeSql(`DROP POLICY IF EXISTS "Public read access" ON api_logs;`).catch(() => {});
    await executeSql(`DROP TABLE IF EXISTS api_logs CASCADE;`);
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  
  console.log(`[splitter] Starting parse, sql length: ${sql.length}`);
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    // Handle block comments
    if (inBlockComment) {
      current += char;
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        current += nextChar;
        i++;
      }
      continue;
    }
    
    // Handle line comments
    if (inLineComment) {
      current += char;
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }
    
    // Handle single quotes
    if (inSingleQuote) {
      current += char;
      if (char === "'" && sql[i - 1] !== '\\') {
        inSingleQuote = false;
      }
      continue;
    }
    
    // Handle double quotes
    if (inDoubleQuote) {
      current += char;
      if (char === '"' && sql[i - 1] !== '\\') {
        inDoubleQuote = false;
      }
      continue;
    }
    
    // Check for comment starts
    if (char === '-' && nextChar === '-') {
      inLineComment = true;
      current += char + nextChar;
      i++;
      continue;
    }
    
    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      current += char + nextChar;
      i++;
      continue;
    }
    
    // Check for dollar quote start/end
    if (char === '$' && nextChar === '$') {
      if (!inDollarQuote) {
        inDollarQuote = true;
        dollarTag = '$$';
        current += char + nextChar;
        i++;
        console.log(`[splitter] Dollar quote START at ${i}`);
        continue;
      } else if (dollarTag === '$$') {
        inDollarQuote = false;
        dollarTag = '';
        current += char + nextChar;
        i++;
        console.log(`[splitter] Dollar quote END at ${i}`);
        continue;
      }
    }
    
    // Handle single/double quotes outside dollar quotes
    if (!inDollarQuote) {
      if (char === "'" && sql[i - 1] !== '\\') {
        inSingleQuote = true;
      } else if (char === '"' && sql[i - 1] !== '\\') {
        inDoubleQuote = true;
      }
    }
    
    current += char;
    
    // Split on semicolon only when not in quotes/comments/dollar-quotes
    if (char === ';' && !inDollarQuote && !inSingleQuote && !inDoubleQuote && !inLineComment && !inBlockComment) {
      const trimmed = current.trim();
      
      // Strip leading comment lines before checking if it's a comment-only statement
      const withoutLeadingComments = trimmed.replace(/^(--.*\n)*/, '').trim();
      
      if (withoutLeadingComments.length > 0) {
        console.log(`[splitter] Found statement at ${i}: ${trimmed.substring(0, 60)}...`);
        statements.push(trimmed);
      } else {
        console.log(`[splitter] Skipping statement (comment-only): "${trimmed.substring(0, 50)}"`);
      }
      current = '';
    }
  }
  
  // Add remaining
  const trimmed = current.trim();
  const withoutLeadingComments = trimmed.replace(/^(--.*\n)*/, '').trim();
  if (withoutLeadingComments.length > 0) {
    console.log(`[splitter] Final statement: ${trimmed.substring(0, 60)}...`);
    statements.push(trimmed);
  }
  
  return statements;
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