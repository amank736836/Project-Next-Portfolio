```text
Bug ID:        BUG-004
Title:         No automated RLS coverage
Severity:      S1 (critical for security claims)
Priority:      P1
Feature:       FEAT-024 / FEAT-026
Environment:   any

(moved from known-issues.md — this bug pre-dated the 2026-10-08 bug hunt)

Fix applied (2026-10-08): New harness/automation/database/rls.test.mjs tests
RLS through PostgREST with the PUBLIC ANON KEY (the key that ships in the
browser bundle): anon cannot read api_logs (migration 027), cannot read
personal_info (migration 028 — no public policy), can read only visible
projects, cannot see hidden project rows, cannot write projects; plus a
service-role sanity check. Tests skip gracefully when Supabase env vars are
unset so the suite runs offline.
Verification: node --test harness/automation/database/rls.test.mjs — 6 tests,
0 failures (skipped offline without env vars; run with NEXT_PUBLIC_SUPABASE_URL
+ NEXT_PUBLIC_SUPABASE_ANON_KEY against a migrated database to execute).

Status:      VERIFIED (fixed 2026-10-08)
```
