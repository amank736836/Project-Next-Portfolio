const sql = `CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'toggle' CHECK (type IN ('toggle', 'text', 'number', 'select', 'json')),
    options JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_settings IS 'User-configurable site settings and feature toggles';
COMMENT ON COLUMN user_settings.key IS 'Unique identifier for the setting';
`;

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    if (inBlockComment) {
      current += char;
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        current += nextChar;
        i++;
      }
      continue;
    }
    
    if (inLineComment) {
      current += char;
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }
    
    if (inSingleQuote) {
      current += char;
      if (char === "'" && sql[i - 1] !== '\\') {
        inSingleQuote = false;
      }
      continue;
    }
    
    if (inDoubleQuote) {
      current += char;
      if (char === '"' && sql[i - 1] !== '\\') {
        inDoubleQuote = false;
      }
      continue;
    }
    
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
    
    if (char === '$' && nextChar === '$') {
      if (!inDollarQuote) {
        inDollarQuote = true;
        dollarTag = '$$';
        current += char + nextChar;
        i++;
        continue;
      } else if (dollarTag === '$$') {
        inDollarQuote = false;
        dollarTag = '';
        current += char + nextChar;
        i++;
        continue;
      }
    }
    
    if (!inDollarQuote) {
      if (char === "'" && sql[i - 1] !== '\\') {
        inSingleQuote = true;
      } else if (char === '"' && sql[i - 1] !== '\\') {
        inDoubleQuote = true;
      }
    }
    
    current += char;
    
    if (char === ';' && !inDollarQuote && !inSingleQuote && !inDoubleQuote && !inLineComment && !inBlockComment) {
      const trimmed = current.trim();
      if (trimmed.length > 0 && !trimmed.startsWith('--')) {
        console.log('Statement:', trimmed.substring(0, 80) + '...');
      }
      current = '';
    }
  }
  
  const trimmed = current.trim();
  if (trimmed.length > 0 && !trimmed.startsWith('--')) {
    console.log('Statement:', trimmed.substring(0, 80) + '...');
  }
}

splitSqlStatements(sql);