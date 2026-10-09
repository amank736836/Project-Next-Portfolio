/**
 * Public smoke test.
 *
 * Goal: prove that all public pages and public APIs respond successfully in offline
 * mode.  No external services required.
 *
 * Usage:
 *   unset NEXT_PUBLIC_SUPABASE_URL
 *   node harness/automation/scripts/smoke-public.mjs
 *
 * Exit code 0 on success.
 */

import { ensureDirs, PATHS, nowStamp, baseUrl } from '../utilities/env.mjs';
import fs from 'node:fs';
import path from 'node:path';

ensureDirs();

const BASE = baseUrl();
const PAGES = [
  '/',
  '/about',
  '/skills',
  '/education',
  '/experience',
  '/projects',
  '/contact',
  '/resume',
  '/test-ui',
  '/login',
  '/error',
  '/permission-denied',
  '/robots.txt',
  '/sitemap.xml',
];

const APIS = [
  { path: '/api/projects', method: 'GET' },
  { path: '/api/info', method: 'GET' },
  { path: '/api/resume', method: 'GET' },
  { path: '/api/auth/validate', method: 'GET' },
  { path: '/api/csp-report', method: 'POST', body: { 'csp-report': {} } },
];

const NEGATIVE = [
  { path: '/api/admin/skills', method: 'GET', expect: [401, 403] },
  { path: '/api/admin/info', method: 'GET', expect: [401, 403] },
  { path: '/api/admin/projects', method: 'GET', expect: [401, 403] },
  { path: '/api/admin/settings', method: 'GET', expect: [401, 403] },
  { path: '/api/admin/hero-images', method: 'GET', expect: [401, 403] },
  { path: '/api/admin/skills', method: 'POST', body: { title: 'smoke' }, expect: [401, 403] },
];

const log = [];
let failures = 0;

function record(name, ok, info) {
  const row = { ts: new Date().toISOString(), name, ok, ...info };
  log.push(row);
  const status = ok ? 'PASS' : 'FAIL';
  console.log(`${status.padEnd(4)}  ${name.padEnd(48)}  ${JSON.stringify(info)}`);
  if (!ok) failures += 1;
}

async function http(url, init = {}) {
  const res = await fetch(url, {
    redirect: 'manual',
    ...init,
    headers: { 'user-agent': 'harness-smoke/1.0', ...(init.headers || {}) },
  });
  return res;
}

async function runPages() {
  for (const p of PAGES) {
    const url = BASE + p;
    let res;
    try {
      res = await http(url, { method: 'GET' });
    } catch (e) {
      record(`page ${p}`, false, { error: e.message });
      continue;
    }
    // Login redirects to /api/auth/login → accept 200/3xx
    const ok = res.status === 200 || (res.status >= 300 && res.status < 400);
    record(`page ${p}`, ok, { status: res.status });
  }
}

async function runApis() {
  for (const a of APIS) {
    const url = BASE + a.path;
    let res;
    try {
      res = await http(url, {
        method: a.method,
        body: a.body ? JSON.stringify(a.body) : undefined,
        // Send Content-Type whenever there is a body, otherwise the route
        // rejects the request with a 400 before doing any real work.
        headers: a.body ? { 'content-type': 'application/json' } : undefined,
      });
    } catch (e) {
      record(`api ${a.method} ${a.path}`, false, { error: e.message });
      continue;
    }
    // Public APIs should respond 2xx; /api/csp-report is 204.
    const ok = res.status >= 200 && res.status < 400;
    record(`api ${a.method} ${a.path}`, ok, { status: res.status });
  }
}

async function runNegative() {
  for (const a of NEGATIVE) {
    const url = BASE + a.path;
    let res;
    try {
      res = await http(url, {
        method: a.method,
        body: a.body ? JSON.stringify(a.body) : undefined,
        headers: a.body ? { 'content-type': 'application/json' } : undefined,
      });
    } catch (e) {
      record(`negative ${a.method} ${a.path}`, false, { error: e.message });
      continue;
    }
    const ok = a.expect.includes(res.status);
    record(`negative ${a.method} ${a.path}`, ok, { status: res.status, expected: a.expect });
  }
}

async function run() {
  console.log(`[smoke] BASE_URL = ${BASE}`);
  console.log(`[smoke] offline mode (no Supabase) is the default; pass a real BASE_URL too.`);
  await runPages();
  await runApis();
  await runNegative();

  const stamp = nowStamp();
  const target = path.join(PATHS.results.latest, `smoke-${stamp}.json`);
  fs.writeFileSync(target, JSON.stringify({ run: stamp, base: BASE, total: log.length, failures, log }, null, 2));

  console.log('');
  console.log(`[smoke] Total: ${log.length}, Failures: ${failures}`);
  console.log(`[smoke] Log: ${target}`);
  process.exit(failures > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error('[smoke] Unhandled error:', e);
  process.exit(2);
});
