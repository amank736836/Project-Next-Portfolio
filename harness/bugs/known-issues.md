# Known issues

This file lists **known issues** observed during the harness build. Each is
also recorded as a `BUG-xxx` in the bugs system. All four issues below were
fixed and verified on 2026-10-08; the authoritative records (with fix and
verification notes) now live in `bugs/resolved/`.

## BUG-001 — `audit_log` table is not written to by application code

```text
Bug ID:        BUG-001
Title:         audit_log table exists but is not populated
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-026
Environment:   any
Preconditions: DB migrations applied.
Steps to Reproduce:
  1. POST /api/admin/skills (admin authenticated)
  2. SELECT * FROM audit_log
Expected:    A row is inserted with action='create', resource_type='skills',
             resource_id=<new-id>, actor_email=admin, ...
Actual:      0 rows.
Reproducible: YES
Evidence:    UNKNOWN — not executed in this harness
Root Cause:  No application code calls `supabase.from('audit_log').insert(...)`
             or invokes an RPC. Migrations 023 created the table; the writer
             was never implemented.
Fix:         Add a helper `lib/audit.js` and call it from every admin POST/PUT/DELETE
             handler, or define a Postgres trigger.
Regression Test: TC-ADM-SK-014 (drafted below).
Status:      CLOSED 2026-10-08 — lib/audit.js created (logAudit) and wired into every admin write handler; see bugs/resolved/BUG-001-audit-log-never-written.md

Proposed regression test:
  - ADMIN-AUDIT-001: After POST /api/admin/skills, a row exists in audit_log
    with action='create' and resource_id equal to the new skill's id.
```

## BUG-002 — Rate limiter is in-memory only

```text
Bug ID:        BUG-002
Title:         Rate limiter is per-process; not horizontally scalable
Severity:      S3 (minor)
Priority:      P2
Feature:       FEAT-018 (rate limit)
Environment:   production
Preconditions: Multiple server instances (e.g. Vercel concurrency).
Steps to Reproduce:
  1. Send 30 requests from each of 2 instances (total 60 within 60s).
  2. Inspect the rate-limit store of each instance.
Expected:    Total requests above 60 trigger 429.
Actual:      Each instance allows 60 → up to 120 may pass.
Reproducible: UNKNOWN — depends on deployment topology
Evidence:    UNKNOWN
Root Cause:  proxy.js uses an in-memory Map().
Fix:         Use Upstash Redis when env vars are set; this is already wired but
             not enabled by default.
Regression Test: TC-SEC-031.
Status:      CLOSED 2026-10-08 — proxy.js now uses Upstash Redis when configured (in-memory fallback); see bugs/resolved/BUG-002-rate-limiter-in-memory-only.md (fixed together with BUG-007)
```

## BUG-003 — `lib/api-logger.js` imports a non-existent NextAuth module

```text
Bug ID:        BUG-003
Title:         `withApiLogging` attempts to import `next-auth` which is not installed
Severity:      S3 (minor) — currently swallowed by try/catch
Priority:      P3
Feature:       FEAT-024
Environment:   any
Preconditions: `next-auth` is not in package.json
Steps to Reproduce:
  1. Read lib/api-logger.js
  2. Note `await import('next-auth')` inside try/catch
Expected:    Either next-auth is a real dep, or the import is removed.
Actual:      It is removed by silent failure, so userId is always null.
Reproducible: YES (code review)
Evidence:    lib/api-logger.js
Root Cause:  The logger assumes NextAuth, but the project uses Scalekit for sessions.
Fix:         Replace with `await getCurrentUser()` from `lib/auth.js`.
Regression Test: TC-ADM-AL-002 (drafted).
Status:      CLOSED 2026-10-08 — lib/api-logger.js uses getCurrentUser() from lib/auth.js instead of the non-existent next-auth import; see bugs/resolved/BUG-003-api-logger-imports-next-auth.md
```

## BUG-004 — `audit_log` insert is missing; no RLS test exists

```text
Bug ID:        BUG-004
Title:         No automated RLS coverage
Severity:      S1 (critical for security claims)
Priority:      P1
Feature:       FEAT-024 / FEAT-026
Environment:   any
Preconditions: DB available
Steps to Reproduce:
  1. With the anon key, attempt to insert into api_logs.
Expected:    Insert fails (RLS only allows service_role).
Actual:      UNKNOWN (no test)
Reproducible: UNKNOWN
Evidence:    UNKNOWN
Root Cause:  No RLS tests in the harness.
Fix:         Add `automation/database/rls.test.mjs` that uses anon + service role.
Regression Test: TC-DB-019.
Status:      CLOSED 2026-10-08 — harness/automation/database/rls.test.mjs added (anon-key RLS tests; skip gracefully offline); see bugs/resolved/BUG-004-no-automated-rls-coverage.md
```
