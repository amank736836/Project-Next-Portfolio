/**
 * Utility: ensure the evidence/logs and test-results/latest directories exist.
 * Use: `import { ensureDirs, writeEvidence } from './utilities/env.mjs';`
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('../../..', import.meta.url).pathname);
const HARNESS = path.join(ROOT, 'harness');

export const PATHS = {
  root: ROOT,
  harness: HARNESS,
  evidence: {
    api: path.join(HARNESS, 'evidence', 'api-responses'),
    logs: path.join(HARNESS, 'evidence', 'logs'),
    db: path.join(HARNESS, 'evidence', 'database-results'),
  },
  results: {
    latest: path.join(HARNESS, 'test-results', 'latest'),
    historical: path.join(HARNESS, 'test-results', 'historical'),
  },
};

export function ensureDirs() {
  for (const dir of [
    PATHS.evidence.api,
    PATHS.evidence.logs,
    PATHS.evidence.db,
    PATHS.results.latest,
    PATHS.results.historical,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeEvidence(kind, name, body) {
  ensureDirs();
  const target = path.join(PATHS.evidence[kind], name);
  fs.writeFileSync(target, body);
  return target;
}

export function nowStamp() {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function baseUrl() {
  return process.env.BASE_URL || 'http://localhost:3000';
}

export const RUN_ID = `RUN-${todayStamp()}-${Math.floor(Math.random() * 999)
  .toString()
  .padStart(3, '0')}`;
