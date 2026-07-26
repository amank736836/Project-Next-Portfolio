import { logger } from './logger.js';

interface ParsedStatement {
  type: 'add_column' | 'drop_column' | 'create_table' | 'drop_table' | 
        'create_index' | 'drop_index' | 'alter_column_type' | 'add_constraint' | 
        'drop_constraint' | 'insert' | 'update' | 'delete' | 'unknown';
  table?: string;
  column?: string;
  columnType?: string;
  indexName?: string;
  constraintName?: string;
  originalSql: string;
}

function parseSql(sql: string): ParsedStatement[] {
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  return statements.map(stmt => parseStatement(stmt));
}

function parseStatement(sql: string): ParsedStatement {
  const upper = sql.toUpperCase();
  
  // ALTER TABLE ... ADD COLUMN
  const addColumnMatch = sql.match(/ALTER\s+TABLE\s+(\w+)\s+ADD\s+COLUMN\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+(.+?)(?:\s+(?:DEFAULT|CONSTRAINT)|$)/i);
  if (addColumnMatch) {
    return {
      type: 'add_column',
      table: addColumnMatch[1],
      column: addColumnMatch[2],
      columnType: addColumnMatch[3].trim(),
      originalSql: sql,
    };
  }
  
  // ALTER TABLE ... DROP COLUMN
  const dropColumnMatch = sql.match(/ALTER\s+TABLE\s+(\w+)\s+DROP\s+COLUMN\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
  if (dropColumnMatch) {
    return {
      type: 'drop_column',
      table: dropColumnMatch[1],
      column: dropColumnMatch[2],
      originalSql: sql,
    };
  }
  
  // CREATE TABLE
  const createTableMatch = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
  if (createTableMatch) {
    return {
      type: 'create_table',
      table: createTableMatch[1],
      originalSql: sql,
    };
  }
  
  // DROP TABLE
  const dropTableMatch = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
  if (dropTableMatch) {
    return {
      type: 'drop_table',
      table: dropTableMatch[1],
      originalSql: sql,
    };
  }
  
  // CREATE INDEX
  const createIndexMatch = sql.match(/CREATE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+ON\s+(\w+)/i);
  if (createIndexMatch) {
    return {
      type: 'create_index',
      indexName: createIndexMatch[1],
      table: createIndexMatch[2],
      originalSql: sql,
    };
  }
  
  // DROP INDEX
  const dropIndexMatch = sql.match(/DROP\s+INDEX\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
  if (dropIndexMatch) {
    return {
      type: 'drop_index',
      indexName: dropIndexMatch[1],
      originalSql: sql,
    };
  }
  
  // ALTER TABLE ... ALTER COLUMN ... TYPE
  const alterTypeMatch = sql.match(/ALTER\s+TABLE\s+(\w+)\s+ALTER\s+COLUMN\s+(\w+)\s+TYPE\s+(.+?)(?:\s+USING|$)/i);
  if (alterTypeMatch) {
    return {
      type: 'alter_column_type',
      table: alterTypeMatch[1],
      column: alterTypeMatch[2],
      columnType: alterTypeMatch[3].trim(),
      originalSql: sql,
    };
  }
  
  // ADD CONSTRAINT
  const addConstraintMatch = sql.match(/ALTER\s+TABLE\s+(\w+)\s+ADD\s+CONSTRAINT\s+(\w+)/i);
  if (addConstraintMatch) {
    return {
      type: 'add_constraint',
      table: addConstraintMatch[1],
      constraintName: addConstraintMatch[2],
      originalSql: sql,
    };
  }
  
  // DROP CONSTRAINT
  const dropConstraintMatch = sql.match(/ALTER\s+TABLE\s+(\w+)\s+DROP\s+CONSTRAINT\s+(\w+)/i);
  if (dropConstraintMatch) {
    return {
      type: 'drop_constraint',
      table: dropConstraintMatch[1],
      constraintName: dropConstraintMatch[2],
      originalSql: sql,
    };
  }
  
  // INSERT
  if (upper.startsWith('INSERT')) {
    const tableMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
    return {
      type: 'insert',
      table: tableMatch?.[1],
      originalSql: sql,
    };
  }
  
  // UPDATE
  if (upper.startsWith('UPDATE')) {
    const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
    return {
      type: 'update',
      table: tableMatch?.[1],
      originalSql: sql,
    };
  }
  
  // DELETE
  if (upper.startsWith('DELETE')) {
    const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
    return {
      type: 'delete',
      table: tableMatch?.[1],
      originalSql: sql,
    };
  }
  
  return {
    type: 'unknown',
    originalSql: sql,
  };
}

function generateRollbackForStatement(stmt: ParsedStatement): string | null {
  switch (stmt.type) {
    case 'add_column':
      if (!stmt.table || !stmt.column) return null;
      return `ALTER TABLE ${stmt.table} DROP COLUMN IF EXISTS ${stmt.column};`;
    
    case 'drop_column':
      logger.warn(`Cannot auto-generate rollback for DROP COLUMN (data loss): ${stmt.originalSql}`);
      return `-- WARNING: Cannot auto-rollback DROP COLUMN (data loss)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    case 'create_table':
      if (!stmt.table) return null;
      return `DROP TABLE IF EXISTS ${stmt.table};`;
    
    case 'drop_table':
      logger.warn(`Cannot auto-generate rollback for DROP TABLE (data loss): ${stmt.originalSql}`);
      return `-- WARNING: Cannot auto-rollback DROP TABLE (data loss)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    case 'create_index':
      if (!stmt.indexName) return null;
      return `DROP INDEX IF EXISTS ${stmt.indexName};`;
    
    case 'drop_index':
      logger.warn(`Cannot auto-generate rollback for DROP INDEX (definition lost): ${stmt.originalSql}`);
      return `-- WARNING: Cannot auto-rollback DROP INDEX (definition lost)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    case 'alter_column_type':
      logger.warn(`Cannot auto-generate rollback for ALTER COLUMN TYPE (original type lost): ${stmt.originalSql}`);
      return `-- WARNING: Cannot auto-rollback ALTER COLUMN TYPE (original type lost)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    case 'add_constraint':
      if (!stmt.table || !stmt.constraintName) return null;
      return `ALTER TABLE ${stmt.table} DROP CONSTRAINT IF EXISTS ${stmt.constraintName};`;
    
    case 'drop_constraint':
      logger.warn(`Cannot auto-generate rollback for DROP CONSTRAINT (definition lost): ${stmt.originalSql}`);
      return `-- WARNING: Cannot auto-rollback DROP CONSTRAINT (definition lost)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    case 'insert':
      if (!stmt.table) return null;
      return `-- WARNING: Cannot auto-rollback INSERT (requires knowing inserted data)\n-- Manual: DELETE FROM ${stmt.table} WHERE ...;`;
    
    case 'update':
    case 'delete':
      return `-- WARNING: Cannot auto-rollback ${stmt.type.toUpperCase()} (requires original data)\n-- Manual intervention required for: ${stmt.originalSql}`;
    
    default:
      logger.warn(`Unknown statement type, cannot generate rollback: ${stmt.originalSql}`);
      return `-- WARNING: Unknown statement type, manual rollback needed\n-- ${stmt.originalSql}`;
  }
}

export function generateRollback(forwardSql: string): string {
  const statements = parseSql(forwardSql);
  const rollbackStatements: string[] = [];
  
  // Process in reverse order for proper rollback
  for (const stmt of statements.reverse()) {
    const rollback = generateRollbackForStatement(stmt);
    if (rollback) {
      rollbackStatements.push(rollback);
    }
  }
  
  if (rollbackStatements.length === 0) {
    return `-- No auto-generated rollback available\n-- Forward migration:\n${forwardSql.split('\n').map(l => `-- ${l}`).join('\n')}`;
  }
  
  return rollbackStatements.join('\n');
}

export function generateRollbackFile(forwardPath: string, rollbackPath: string): boolean {
  try {
    const forwardSql = readFileSync(forwardPath, 'utf8');
    const rollbackSql = generateRollback(forwardSql);
    
    const header = `-- Rollback: ${basename(forwardPath, '.sql')}\n-- Generated: ${new Date().toISOString()}\n\n`;
    writeFileSync(rollbackPath, header + rollbackSql + '\n');
    
    logger.success(`Generated rollback: ${basename(rollbackPath)}`);
    return true;
  } catch (error) {
    logger.error(`Failed to generate rollback: ${error}`);
    return false;
  }
}

function readFileSync(path: string, encoding: string): string {
  const fs = require('fs');
  return fs.readFileSync(path, encoding);
}

function writeFileSync(path: string, content: string): void {
  const fs = require('fs');
  fs.writeFileSync(path, content);
}

function basename(path: string, ext?: string): string {
  const p = require('path');
  return p.basename(path, ext);
}