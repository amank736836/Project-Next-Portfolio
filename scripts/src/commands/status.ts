import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getAppliedMigrations } from '../lib/migrations.js';
import { logger } from '../lib/logger.js';
import fs from 'fs';
import * as crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const MIGRATIONS_DIR = join(PROJECT_ROOT, 'sql', 'migrations');

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

async function status(): Promise<void> {
  logger.step('Migration Status');
  
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
  dotenv.config({ path: join(PROJECT_ROOT, '.env') });
  
  try {
    // Get applied migrations from database
    const applied = await getAppliedMigrations();
    
    // Get all local migration files
    const localFiles = fs.existsSync(MIGRATIONS_DIR)
      ? fs.readdirSync(MIGRATIONS_DIR)
          .filter((f: string) => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
          .sort()
      : [];
    
    logger.divider();
    console.log('');
    
    // Show applied
    console.log(`${colors.green}Applied Migrations (${applied.length})${colors.reset}:`);
    if (applied.length === 0) {
      console.log('  (none)');
    } else {
      for (const m of applied) {
        const status = m.rolled_back_at ? '🔴 ROLLED BACK' : '🟢 APPLIED';
        console.log(`  ${status} ${m.id} - ${m.name}`);
        console.log(`         Applied: ${new Date(m.applied_at).toLocaleString()}`);
        if (m.rolled_back_at) console.log(`         Rolled back: ${new Date(m.rolled_back_at).toLocaleString()}`);
        console.log(`         Checksum: ${m.checksum}`);
      }
    }
    
    console.log('');
    
    // Show pending
    const appliedIds = new Set(applied.filter(a => !a.rolled_back_at).map(a => a.id));
    const pending = localFiles.filter((f: string) => !appliedIds.has(f.replace('.sql', '')));
    
    console.log(`${colors.yellow}Pending Migrations (${pending.length})${colors.reset}:`);
    if (pending.length === 0) {
      console.log('  (none)');
    } else {
      for (const f of pending) {
        console.log(`  ⏳ ${f.replace('.sql', '')}`);
      }
    }
    
    console.log('');
    logger.divider();
    
    // Check for drift
    checkFileDrift();
    
  } catch (error) {
    logger.error(`Failed to get status: ${error}`);
    process.exit(1);
  }
}

function checkFileDrift(): void {
  const hashesPath = join(PROJECT_ROOT, 'sql', '_metadata', 'file_hashes.json');
  
  if (!fs.existsSync(hashesPath)) {
    console.log('  ⚠ No file hashes recorded. Run `npm run db:generate` to create baseline.');
    return;
  }
  
  const stored = JSON.parse(fs.readFileSync(hashesPath, 'utf8'));
  
  let drifted = 0;
  for (const [file, storedHash] of Object.entries(stored)) {
    if (!fs.existsSync(file)) {
      console.log(`  ⚠ Missing file: ${file}`);
      drifted++;
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    const currentHash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    
    if (storedHash !== currentHash) {
      console.log(`  ⚠ Drift detected: ${file}`);
      drifted++;
    }
  }
  
  if (drifted === 0) {
    console.log('  ✓ No file drift detected');
  }
}

status().catch(err => {
  logger.error(`Status check failed: ${err}`);
  process.exit(1);
});