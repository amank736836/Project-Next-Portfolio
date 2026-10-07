/**
 * Security headers tests.
 *
 * Run:
 *   node --test harness/automation/api/headers.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { baseUrl } from '../utilities/env.mjs';

const BASE = baseUrl();

const CHECKS = [
  '/',
  '/about',
  '/projects',
  '/api/projects',
  '/api/auth/validate',
];

for (const p of CHECKS) {
  test(`${p} has Content-Security-Policy`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp && csp.length > 0, `CSP missing for ${p}`);
  });

  test(`${p} has X-Content-Type-Options: nosniff`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });

  test(`${p} has X-Frame-Options: SAMEORIGIN`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
  });

  test(`${p} has Referrer-Policy`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    const rp = res.headers.get('referrer-policy');
    assert.ok(rp && rp.length > 0);
  });

  test(`${p} has Permissions-Policy`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    const pp = res.headers.get('permissions-policy');
    assert.ok(pp && pp.length > 0);
  });
}

test('/ does not have X-Powered-By', async () => {
  const res = await fetch(BASE + '/');
  assert.equal(res.headers.get('x-powered-by'), null);
});

test('/ has Reporting-Endpoints', async () => {
  const res = await fetch(BASE + '/');
  const re = res.headers.get('reporting-endpoints');
  assert.match(re || '', /csp-endpoint=/);
});
