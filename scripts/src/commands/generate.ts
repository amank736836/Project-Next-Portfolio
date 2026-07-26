import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from '../lib/logger.js';
import fs from 'fs';
import * as crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..');
const SQL_DIR = join(PROJECT_ROOT, 'sql');
const TABLES_DIR = join(SQL_DIR, 'tables');
const INDEXES_DIR = join(SQL_DIR, 'indexes');
const FUNCTIONS_DIR = join(SQL_DIR, 'functions');
const OUTPUT_PATH = join(SQL_DIR, 'schema.sql');
const METADATA_DIR = join(SQL_DIR, '_metadata');

function updateFileHashes(): void {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }
  
  const hashes: Record<string, string> = {};
  
  for (const dir of [TABLES_DIR, INDEXES_DIR, FUNCTIONS_DIR]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.sql'))) {
      const content = fs.readFileSync(join(dir, file), 'utf8');
      hashes[join(dir, file)] = crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }
  }
  
  fs.writeFileSync(join(METADATA_DIR, 'file_hashes.json'), JSON.stringify(hashes, null, 2));
  logger.debug('Updated file hashes');
}

async function generate(): Promise<void> {
  logger.step('Generating consolidated schema.sql');
  
  const sections: string[] = [];
  
  // Header
  sections.push(`-- Portfolio Database Schema`);
  sections.push(`-- Generated: ${new Date().toISOString()}`);
  sections.push(`-- DO NOT EDIT DIRECTLY - Edit files in sql/tables/, sql/indexes/, sql/functions/`);
  sections.push('');
  
  // Tables
  if (fs.existsSync(TABLES_DIR)) {
    const tableFiles = fs.readdirSync(TABLES_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    for (const file of tableFiles) {
      const content = fs.readFileSync(join(TABLES_DIR, file), 'utf8');
      sections.push(`-- ===================================================================`);
      sections.push(`-- Table: ${file.replace('.sql', '')}`);
      sections.push(`-- ===================================================================`);
      sections.push(content);
      sections.push('');
    }
  }
  
  // Indexes
  if (fs.existsSync(INDEXES_DIR)) {
    const indexFiles = fs.readdirSync(INDEXES_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (indexFiles.length > 0) {
      sections.push(`-- ===================================================================`);
      sections.push(`-- Indexes`);
      sections.push(`-- ===================================================================`);
      for (const file of indexFiles) {
        const content = fs.readFileSync(join(INDEXES_DIR, file), 'utf8');
        sections.push(content);
        sections.push('');
      }
    }
  }
  
  // Functions
  if (fs.existsSync(FUNCTIONS_DIR)) {
    const functionFiles = fs.readdirSync(FUNCTIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    if (functionFiles.length > 0) {
      sections.push(`-- ===================================================================`);
      sections.push(`-- Functions`);
      sections.push(`-- ===================================================================`);
      for (const file of functionFiles) {
        const content = fs.readFileSync(join(FUNCTIONS_DIR, file), 'utf8');
        sections.push(content);
        sections.push('');
      }
    }
  }
  
  const output = sections.join('\n');
  fs.writeFileSync(OUTPUT_PATH, output);
  
  logger.success(`Generated: ${OUTPUT_PATH}`);
  logger.info(`Size: ${output.length} characters`);
  
  updateFileHashes();
}

generate().catch(err => {
  logger.error(`Generate failed: ${err}`);
  process.exit(1);
});