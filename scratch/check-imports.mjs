/**
 * Scratch: verify that every `@/...` / relative import in app/, components/,
 * lib/, hooks/, proxy.js resolves to a real file, and that named imports
 * exist as exports in the target module.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const SRC_DIRS = ['app', 'components', 'lib', 'hooks'];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(full);
  }
}
for (const d of SRC_DIRS) walk(path.join(ROOT, d));
files.push(path.join(ROOT, 'proxy.js'));

const EXTENSIONS = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];

function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec);
  else return null; // node_modules
  for (const ext of EXTENSIONS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return undefined; // unresolved
}

function getExports(file) {
  const src = fs.readFileSync(file, 'utf8');
  const names = new Set();
  // export const/let/var/function/class NAME
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g)) {
    names.add(m[1]);
  }
  // export { a, b as c }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const p = part.trim();
      if (!p) continue;
      const asMatch = p.match(/\bas\s+([A-Za-z0-9_$]+)/);
      names.add(asMatch ? asMatch[1] : p.split(/\s+/)[0]);
    }
  }
  if (/export\s+default/.test(src)) names.add('default');
  return names;
}

const importRe = /import\s+(?:([A-Za-z0-9_$]+)\s*,\s*)?(?:\{([^}]*)\})?\s*(?:\*\s*as\s*[A-Za-z0-9_$]+)?\s*(?:([A-Za-z0-9_$]+)\s*)?from\s*['"]([^'"]+)['"]/g;

const problems = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(importRe)) {
    const [, defaultImport, namedRaw, , spec] = m;
    const target = resolveImport(file, spec);
    if (target === undefined) {
      problems.push(`${path.relative(ROOT, file)}: UNRESOLVED import '${spec}'`);
      continue;
    }
    if (target === null) continue;
    const named = (namedRaw || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const asMatch = s.match(/^([A-Za-z0-9_$]+)\s+as\s+/);
        return asMatch ? asMatch[1] : s;
      });
    if (!named.length && !defaultImport) continue;
    const exports = getExports(target);
    for (const name of named) {
      if (!exports.has(name)) {
        problems.push(`${path.relative(ROOT, file)}: '${name}' is not exported by ${path.relative(ROOT, target)} (import '${spec}')`);
      }
    }
    if (defaultImport && !exports.has('default')) {
      problems.push(`${path.relative(ROOT, file)}: no default export in ${path.relative(ROOT, target)} (import '${spec}')`);
    }
  }
}

if (problems.length === 0) {
  console.log('No import/export problems found.');
} else {
  console.log(`Found ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(' - ' + p);
  process.exitCode = 1;
}
