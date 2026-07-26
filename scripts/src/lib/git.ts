import { execSync } from 'child_process';
import { logger } from './logger.js';
import * as fs from 'fs';
import * as path from 'path';

export function getGitRoot(): string {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch {
    return process.cwd();
  }
}

export function getChangedFiles(since?: string): string[] {
  try {
    const cmd = since 
      ? `git diff --name-only ${since} HEAD`
      : 'git status --porcelain';
    
    const output = execSync(cmd, { encoding: 'utf8', cwd: getGitRoot() });
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch {
    return [];
  }
}

export function getMigrationFiles(migrationsDir: string): string[] {
  
  try {
    return fs.readdirSync(migrationsDir)
      .filter((f: string) => f.endsWith('.sql') && !f.endsWith('.rollback.sql'))
      .sort()
      .map((f: string) => path.join(migrationsDir, f));
  } catch {
    return [];
  }
}

export function getLastAppliedMigrationId(): string | null {
  try {
    const output = execSync('git log --oneline -1 -- sql/_metadata/applied_migrations.json', { 
      encoding: 'utf8', 
      cwd: getGitRoot() 
    }).trim();
    
    if (!output) return null;
    
    // Read the applied_migrations.json from that commit
    try {
      const fileContent = execSync(`git show ${output.split(' ')[0]}:sql/_metadata/applied_migrations.json`, {
        encoding: 'utf8',
        cwd: getGitRoot()
      });
      const applied = JSON.parse(fileContent);
      return applied.length > 0 ? applied[applied.length - 1] : null;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export function hasUncommittedChanges(): boolean {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf8', cwd: getGitRoot() });
    return output.trim().length > 0;
  } catch {
    return false;
  }
}

export function getNewMigrationFiles(migrationsDir: string, lastAppliedId: string | null): string[] {
  const allFiles = getMigrationFiles(migrationsDir);
  
  if (!lastAppliedId) return allFiles;
  
  const lastIndex = allFiles.findIndex(f => f.includes(lastAppliedId));
  if (lastIndex === -1) return allFiles;
  
  return allFiles.slice(lastIndex + 1);
}

export function isMigrationFile(filePath: string): boolean {
  return filePath.includes('/migrations/') && 
         filePath.endsWith('.sql') && 
         !filePath.endsWith('.rollback.sql');
}

export function getSqlFiles(dir: string, pattern: RegExp = /\.sql$/): string[] {
  
  try {
    return fs.readdirSync(dir)
      .filter((f: string) => pattern.test(f))
      .sort()
      .map((f: string) => path.join(dir, f));
  } catch {
    return [];
  }
}

export function readMigrationFile(id: string): { sql: string; rollbackSql?: string } {
  const projectRoot = getGitRoot();
  const migrationsDir = path.join(projectRoot, 'sql', 'migrations');
  
  const forwardPath = path.join(migrationsDir, `${id}.sql`);
  const rollbackPath = path.join(migrationsDir, `${id}.rollback.sql`);
  
  const sql = fs.readFileSync(forwardPath, 'utf8');
  let rollbackSql: string | undefined;
  
  try {
    rollbackSql = fs.readFileSync(rollbackPath, 'utf8');
  } catch {
    // No rollback file
  }
  
  return { sql, rollbackSql };
}