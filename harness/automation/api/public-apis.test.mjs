/**
 * API tests for the public read endpoints.
 *
 * Run:
 *   node --test harness/automation/api/public-apis.test.mjs
 *
 * Requires a running dev server.  Works in offline mode (no Supabase).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { baseUrl } from '../utilities/env.mjs';

const BASE = baseUrl();

test('GET /api/projects returns 200 and an array', async () => {
  const res = await fetch(BASE + '/api/projects');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  const body = await res.json();
  assert.ok(Array.isArray(body), 'body should be an array');
});

test('GET /api/info returns 200 and an array', async () => {
  const res = await fetch(BASE + '/api/info');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  const body = await res.json();
  assert.ok(Array.isArray(body), 'body should be an array');
});

test('GET /api/resume returns 200 and an object', async () => {
  const res = await fetch(BASE + '/api/resume');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  const body = await res.json();
  assert.equal(typeof body, 'object', 'body should be an object');
});

test('GET /api/resume/view returns 200 with application/pdf', async () => {
  const res = await fetch(BASE + '/api/resume/view');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  assert.match(ct, /application\/pdf/);
});

test('GET /api/auth/validate returns 200 with authenticated:false', async () => {
  const res = await fetch(BASE + '/api/auth/validate');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.authenticated, false);
});

test('GET /api/auth/login redirects', async () => {
  const res = await fetch(BASE + '/api/auth/login', { redirect: 'manual' });
  assert.ok(res.status === 302 || res.status === 307 || res.status === 308, `expected redirect, got ${res.status}`);
  const loc = res.headers.get('location') || '';
  assert.ok(loc.length > 0, 'redirect must have a Location header');
});

test('POST /api/csp-report returns 204', async () => {
  const res = await fetch(BASE + '/api/csp-report', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ 'csp-report': { 'document-uri': 'https://example.com/' } }),
  });
  assert.equal(res.status, 204, `expected 204, got ${res.status}`);
});

test('Public /api/projects has cache-control header', async () => {
  const res = await fetch(BASE + '/api/projects');
  const cc = res.headers.get('cache-control') || '';
  assert.match(cc, /s-maxage=60/, `expected s-maxage=60, got "${cc}"`);
});
