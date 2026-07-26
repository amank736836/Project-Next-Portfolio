import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection, executeSql } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SEEDS_DIR = join(PROJECT_ROOT, 'sql', 'seeds');

async function seed(): Promise<void> {
  logger.step('Database Seeding');
  
  const dotenv = await import('dotenv');
  dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
  dotenv.config({ path: join(PROJECT_ROOT, '.env') });
  
  try {
    const connected = await testConnection();
    if (!connected) {
      logger.error('Cannot connect to database');
      process.exit(1);
    }
    
    // Get seed files in order
    const seedFiles = fs.existsSync(SEEDS_DIR)
      ? fs.readdirSync(SEEDS_DIR)
          .filter((f: string) => f.endsWith('.sql'))
          .sort()
      : [];
    
    if (seedFiles.length === 0) {
      logger.warn('No seed files found in sql/seeds/');
      return;
    }
    
    logger.info(`Found ${seedFiles.length} seed file(s)`);
    logger.divider();
    
    for (const file of seedFiles) {
      logger.step(`Seeding: ${file}`);
      
      const sql = fs.readFileSync(join(SEEDS_DIR, file), 'utf8');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const stmt of statements) {
        await executeSql(stmt + ';');
      }
      
      logger.success(`Seeded: ${file}`);
    }
    
    logger.divider();
    logger.success('All seeds applied successfully');
    
  } catch (error) {
    logger.error(`Seeding failed: ${error}`);
    process.exit(1);
  }
}

seed().catch(err => {
  logger.error(`Fatal error: ${err}`);
  process.exit(1);
});