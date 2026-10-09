/**
 * Security headers check.
 *
 * Usage:
 *   node harness/automation/scripts/headers-check.mjs
 *
 * Asserts that every response carries the expected security headers.
 */

import { ensureDirs, PATHS, baseUrl } from '../utilities/env.mjs';
import fs from 'node:fs';
import path from 'node:path';

ensureDirs();
const BASE = baseUrl();

const PATHS_TO_CHECK = [
  '/',
  '/about',
  '/projects',
  '/api/projects',
  '/api/info',
  '/api/auth/validate',
  '/api/admin/skills', // expected 401, but headers should still be present
];

const REQUIRED = {
  'content-security-policy': null,
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': null,
  'reporting-endpoints': null,
};

const log = [];
let failures = 0;

function record(name, ok, info) {
  const row = { ts: new Date().toISOString(), name, ok, ...info };
  log.push(row);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name.padEnd(40)}  ${JSON.stringify(info)}`);
  if (!ok) failures += 1;
}

async function check(p) {
  const url = BASE + p;
  let res;
  try {
    res = await fetch(url, { redirect: 'manual' });
  } catch (e) {
    record(p, false, { error: e.message });
    return;
  }
  const h = res.headers;
  for (const [k, expected] of Object.entries(REQUIRED)) {
    const v = h.get(k);
    if (v === null) {
      record(`${p} ${k}`, false, { status: res.status, value: null });
      continue;
    }
    if (expected && v !== expected) {
      record(`${p} ${k}`, false, { status: res.status, value: v, expected });
      continue;
    }
    record(`${p} ${k}`, true, { status: res.status, value: v });
  }
  // x-powered-by MUST be absent
  if (h.get('x-powered-by')) {
    record(`${p} x-powered-by-absent`, false, { value: h.get('x-powered-by') });
  } else {
    record(`${p} x-powered-by-absent`, true, {});
  }
}

async function main() {
  console.log(`[headers] BASE_URL = ${BASE}`);
  for (const p of PATHS_TO_CHECK) {
    await check(p);
  }
  const target = path.join(PATHS.results.latest, 'headers-check.json');
  fs.writeFileSync(target, JSON.stringify({ base: BASE, total: log.length, failures, log }, null, 2));
  console.log('');
  console.log(`[headers] Total: ${log.length}, Failures: ${failures}`);
  console.log(`[headers] Log: ${target}`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('[headers] Unhandled error:', e);
  process.exit(2);
});
