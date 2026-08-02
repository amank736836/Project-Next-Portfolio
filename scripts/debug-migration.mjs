import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'sql', 'migrations');

const files = fs.readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
  .sort();

for (const file of files) {
  const id = file.replace('.sql', '');
  const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
  
  if (id === '021_enable_rls_on_public_tables') {
    console.log('=== File:', file, '===');
    console.log('Length:', sql.length);
    console.log('First 500 chars:', sql.substring(0, 500));
    console.log('---');
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log('Statements found:', statements.length);
    statements.forEach((stmt, i) => {
      console.log(`${i}: ${stmt.substring(0, 100)}...`);
    });
  }
}