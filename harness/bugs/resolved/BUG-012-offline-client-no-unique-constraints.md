```text
Bug ID:        BUG-012
Title:         Offline data layer does not enforce UNIQUE constraints (duplicate skill categories)
Severity:      S3 (minor)
Priority:      P3
Feature:       FEAT-013 (admin-skills) / offline dev mode
Environment:   local-offline (no NEXT_PUBLIC_SUPABASE_URL)
Preconditions: Running without Supabase env vars (offline mode).

Steps to Reproduce:
  1. POST /api/admin/skill-categories {"name":"Frontend"} (a default category
     that already exists).
  2. Observe the response.

Expected:    409 {"error":"Category already exists"} — the route maps Postgres
             unique-violation code 23505 to 409, and skill_categories.name is
             TEXT NOT NULL UNIQUE (migration 009).
Actual:      200 — the offline client (lib/supabase/offline-client.js) inserts a
             duplicate row. Verified live: a second "Frontend" category was
             created (id 6) and the category list then contains duplicates.
Reproducible: YES (verified live in offline mode)
Evidence:    scratch/admin-crud-probe.mjs: "POST duplicate category -> 409 -> 200"

Root Cause:  OfflineQuery.#execute() insert/upsert paths do not check unique
             columns; the route's 23505 handling never triggers offline.
Fix:         Add unique-key awareness to the offline client for tables with
             unique columns (skill_categories.name, personal_info.key is already
             the upsert key), or document the divergence in offline-data.js.
Regression Test: offline POST of a duplicate category name must return 409.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): lib/supabase/offline-client.js now enforces the
             UNIQUE constraints that exist in the SQL schema (skill_categories.name,
             social_links.platform) on insert, raising a Postgres-style 23505
             error, and #run preserves error.code instead of hardcoding
             'OFFLINE_ERROR' — so routes map duplicates to 409 exactly like they
             do against real Supabase.
Verification: scratch/admin-crud-probe.mjs — duplicate skill-category POST now
             returns 409 (was 200). PASS 60/60.
```
