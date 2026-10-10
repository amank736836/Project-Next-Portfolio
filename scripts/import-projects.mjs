// Import local git projects into showcase as hidden drafts — duplicate-safe.
//
// Usage (from repo root):
//   node scripts/import-projects.mjs --scan "D:/Github"            # dry run, prints SKIP/ADD table
//   node scripts/import-projects.mjs --scan "D:/Github" --apply    # actually inserts missing rows
//   node scripts/import-projects.mjs --file candidates.json --apply
//
// Dedupe rule: a candidate is SKIPPED when its normalized GitHub URL
// (lowercased, no trailing slash, no .git suffix) OR its normalized title
// already exists in the DB. Substring matching is NOT used.

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

// ---------- github url helpers ----------
export function normalizeGithubUrl(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let u = raw.trim();
  if (!u) return '';
  // handle scp-style git@github.com:user/repo.git
  const scp = u.match(/^git@github\.com:(.+?)(\.git)?\/?$/i);
  if (scp) u = `https://github.com/${scp[1]}`;
  u = u.replace(/\/+$/, '');
  if (u.toLowerCase().endsWith('.git')) u = u.slice(0, -4);
  try {
    const parsed = new URL(u);
    if (parsed.hostname.toLowerCase() !== 'github.com') return '';
    const parts = parsed.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    if (parts.length < 2) return '';
    return `https://github.com/${parts[0]}/${parts[1]}`.toLowerCase();
  } catch {
    return '';
  }
}

export function githubFromDetails(details) {
  let arr = details;
  if (typeof arr === 'string') {
    try { arr = JSON.parse(arr); } catch { return ''; }
  }
  if (!Array.isArray(arr)) return '';
  const found = arr.find(
    (d) => d?.title && /github/i.test(d.title) && typeof d.desc === 'string'
  );
  return normalizeGithubUrl(found?.desc || '');
}

function normTitle(t) {
  return (t || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

// ---------- local scan ----------
function gitRemote(dir) {
  try {
    const out = execFileSync('git', ['-C', dir, 'remote', 'get-url', 'origin'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return normalizeGithubUrl(out);
  } catch {
    return '';
  }
}

function detectStack(dir) {
  const pj = join(dir, 'package.json');
  if (existsSync(pj)) {
    try {
      const p = JSON.parse(readFileSync(pj, 'utf8'));
      const deps = { ...(p.dependencies || {}), ...(p.devDependencies || {}) };
      const stack = [];
      if (deps.next) stack.push('Next.js');
      else if (deps.react) stack.push('React');
      if (deps.typescript || existsSync(join(dir, 'tsconfig.json'))) stack.push('TypeScript');
      if (deps.vite) stack.push('Vite');
      if (deps.express) stack.push('Express');
      if (deps.supabase || deps['@supabase/supabase-js']) stack.push('Supabase');
      if (stack.length) return stack.join(', ');
      return 'JavaScript';
    } catch { /* fall through */ }
  }
  return 'JavaScript';
}

function guessCategory(name) {
  const n = name.toLowerCase();
  if (/game|snake|gaming|chess|puzzle/.test(n)) return 'Game';
  if (/chat|gpt|agent|ai-|-ai|rag|llm|bot/.test(n)) return 'AI App';
  if (/blog/.test(n)) return 'Blog';
  if (/ecom|shop|store|cart/.test(n)) return 'Ecommerce';
  if (/portfolio/.test(n)) return 'Portfolio';
  if (/fit|health|gym/.test(n)) return 'Health';
  if (/bank|state|finance|budget|expense/.test(n)) return 'FinTech';
  if (/study|learn|course|school|quiz/.test(n)) return 'Education';
  if (/extension|addon/.test(n)) return 'Extension';
  if (/git|vercel|deploy|cli|tool|hub/.test(n)) return 'DevTool';
  if (/todo|task|note/.test(n)) return 'Productivity';
  if (/movie|music|video|stream/.test(n)) return 'Entertainment';
  return 'Web App';
}

function humanize(dirName) {
  return dirName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (w) => (/^(ai|cli|api|ui|ux|3d|ar|vr)$/i.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)));
}

function walkDirs(base, maxDepth, skip = new Set(['node_modules', '.next', '.git', '.turbo', 'dist', 'build'])) {
  const found = [];
  const visit = (dir, depth) => {
    let entries = [];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch { return; }
    for (const e of entries) {
      if (!e.isDirectory() || skip.has(e.name)) continue;
      const full = join(dir, e.name);
      found.push(full);
      if (depth < maxDepth) visit(full, depth + 1);
    }
  };
  visit(base, 1);
  return found;
}

export function scanLocalRepos(baseDir) {
  const own = normalizeGithubUrl('https://github.com/amank736836/portfolio-next_Project');
  const out = [];
  for (const dir of walkDirs(baseDir, 2)) {
    if (!existsSync(join(dir, '.git'))) continue;
    const remote = gitRemote(dir);
    if (!remote) continue;
    if (remote === own) continue; // this portfolio repo itself
    const name = dir.split(/[\\/]/).pop();
    if (/^amank736836$/i.test(name)) continue; // profile README repo
    out.push({
      title: humanize(name),
      github: remote,
      language: detectStack(dir),
      category: guessCategory(name),
      description: `${humanize(name)} — imported from local checkout.`,
      dir,
    });
  }
  return out;
}

// ---------- db ----------
async function loadExisting() {
  const { data, error } = await supabase.from('projects').select('id, title, details');
  if (error) throw error;
  const urls = new Set();
  const titles = new Set();
  for (const row of data || []) {
    const g = githubFromDetails(row.details);
    if (g) urls.add(g);
    if (row.title) titles.add(normTitle(row.title));
  }
  const maxId = Math.max(0, ...(data || []).map((r) => r.id || 0));
  return { urls, titles, maxId, count: (data || []).length };
}

function toRow(c) {
  return {
    title: c.title,
    img: '',
    image: '',
    description: c.description || '',
    category: c.category || 'Web App',
    is_hidden: true,
    details: [
      { icon: 'FiFileText', title: 'Project : ', desc: c.title },
      { icon: 'FiGithub', title: 'Github : ', desc: c.github },
      { icon: 'FaCode', title: 'Language : ', desc: c.language || 'JavaScript' },
      { icon: 'FiExternalLink', title: 'Preview : ', desc: c.preview || '' },
    ],
  };
}

// ---------- cli ----------
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const scanIdx = args.indexOf('--scan');
const fileIdx = args.indexOf('--file');

let candidates = [];
if (scanIdx >= 0 && args[scanIdx + 1]) {
  candidates = scanLocalRepos(args[scanIdx + 1]);
} else if (fileIdx >= 0 && args[fileIdx + 1]) {
  candidates = JSON.parse(readFileSync(args[fileIdx + 1], 'utf8'));
} else {
  console.error('Provide --scan <dir> or --file <candidates.json>  (add --apply to write)');
  process.exit(1);
}

const existing = await loadExisting();
console.log(`DB rows: ${existing.count} | candidates: ${candidates.length} | mode: ${apply ? 'APPLY' : 'DRY-RUN'}`);

let nextId = existing.maxId + 1;
let added = 0;
for (const c of candidates) {
  const g = normalizeGithubUrl(c.github);
  const dupUrl = g && existing.urls.has(g);
  const dupTitle = normTitle(c.title) && existing.titles.has(normTitle(c.title));
  if (dupUrl || dupTitle) {
    console.log(`SKIP (already in db${dupUrl ? ' by url' : ''}${dupTitle ? ' by title' : ''}): ${c.title} ${g}`);
    continue;
  }
  if (!apply) {
    console.log(`ADD: ${c.title} | ${g} | ${c.language} | ${c.category}`);
    continue;
  }
  const { error } = await supabase.from('projects').insert([{ ...toRow(c), id: nextId }]);
  if (error) {
    console.log(`FAIL: ${c.title}: ${error.message}`);
  } else {
    console.log(`ADDED #${nextId}: ${c.title}`);
    existing.urls.add(g);
    existing.titles.add(normTitle(c.title));
    nextId += 1;
    added += 1;
  }
}
console.log(apply ? `Done. inserted=${added}` : 'Dry run — nothing written. Re-run with --apply to insert.');
