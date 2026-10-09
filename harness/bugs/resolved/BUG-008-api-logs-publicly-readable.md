```text
Bug ID:        BUG-008
Title:         api_logs table is publicly readable via the anon key (RLS USING (true))
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-024 (api-logs)
Environment:   production
Preconditions: NEXT_PUBLIC_SUPABASE_ANON_KEY is public (it ships in the browser bundle).

Steps to Reproduce:
  1. Take the public anon key from the deployed site.
  2. SELECT * FROM api_logs (REST or supabase-js with the anon key).
  3. Observe full log rows: IP addresses, user agents, error stacks,
     request/response bodies (sanitized, but still operational data).

Expected:    api_logs is readable only by the admin (service role / authorized
             operator), like csp_reports ("Admins can view CSP reports").
Actual:      Migration 006 and sql/tables/api_logs.sql define:
               CREATE POLICY "Public read access" ON api_logs FOR SELECT USING (true);
             so any visitor with the public anon key can dump every log row.
Reproducible: YES (code review of migrations + schema; RLS policy is unconditional)
Evidence:    sql/tables/api_logs.sql:41, sql/migrations/006_add_api_logs.sql:41,
             sql/schema.sql:48.

Root Cause:  The "public read" policy was presumably added for the admin
             dashboard, but the dashboard is served to an authenticated
             operator — the policy should be scoped to the service role or the
             authorized admin, not `true`.
Fix:         Drop the public SELECT policy and replace it with a service-role /
             admin-scoped policy (matching csp_reports). Also add an in-route
             isAuthenticated() check to POST /api/admin/api-logs and GET
             /api/admin/csp-reports, which currently rely solely on proxy.js
             for protection (defense in depth — see BUG-009 note).
Regression Test: with the anon key, SELECT from api_logs must return 0 rows /
             a permission error; with the service role it must succeed.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): Replaced the `FOR SELECT USING (true)` public-read
             policy on api_logs with a service-role-only read policy in
             sql/tables/api_logs.sql, sql/schema.sql and sql/migrations/006; added
             migration 027 (+ rollback) for existing databases. Defense in depth:
             POST /api/admin/api-logs and GET /api/admin/csp-reports now check
             isAuthenticated() in-route as well.
Verification: harness/automation/database/rls.test.mjs asserts the anon key
             cannot read api_logs (runs against a live DB; skips offline).
             admin-auth suite confirms 401 without a session for both routes.
```
