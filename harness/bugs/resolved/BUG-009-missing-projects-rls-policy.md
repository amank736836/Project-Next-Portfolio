```text
Bug ID:        BUG-009
Title:         No RLS policy / grant for public read of `projects` (and `personal_info`)
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-010 (public-projects)
Environment:   production (real Supabase database)
Preconditions: Migrations applied from sql/migrations.

Steps to Reproduce:
  1. Review every migration and sql/schema.sql + sql/tables/ for CREATE POLICY
     / GRANT on `projects` and `personal_info`.
  2. None exist. skills, education, experience, social_links, hero_images,
     skill_categories, user_settings, resumes, csp_reports, api_logs and
     audit_log all have policies; projects and personal_info have none and
     RLS is not even enabled on them.
  3. The public projects page (app/(public)/projects/ProjectsPageClient.jsx)
     reads `projects` with the ANON browser client
     (createClient from lib/supabase/client.js).

Expected:    A "Public can view visible projects" SELECT policy (is_hidden = false)
             exists, like the skills/education/experience policies in migration 020.
Actual:      With a stock Supabase project the anon client gets no rows (or a
             permission error, swallowed → "No projects found in this sector").
             If the live database instead has blanket grants, then hidden rows
             and the raw table are exposed to the anon key. Either way the
             declared schema does not match what the public client needs.
Reproducible: YES (code review; no policy exists in any migration)
Evidence:    `grep -rn "CREATE POLICY" sql/` → no policy for projects or
             personal_info; app/(public)/projects/ProjectsPageClient.jsx:17-23
             uses the anon client on `projects`.

Root Cause:  Migrations 020/021 hardened RLS for skills/education/experience/
             resumes but never added the public-read policy for `projects`
             (nor enabled RLS + policy on `personal_info`, which is read
             publicly only through the service-role API route).
Fix:         Add a migration:
               ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
               CREATE POLICY "Public can view visible projects" ON projects
                 FOR SELECT USING (is_hidden = FALSE);
             and an admin manage policy mirroring migration 020. Same for
             personal_info if any anon client read is intended.
Regression Test: with the anon key, SELECT visible projects succeeds and hidden
             projects are excluded (harness rls.test.mjs, see BUG-004).
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): Migration 028 (+ rollback) enables RLS on
             projects and personal_info. projects gets a public SELECT policy
             limited to `is_hidden = FALSE` (the public projects page reads with
             the anon browser client) plus admin/service-role manage policies.
             personal_info gets NO public read policy — it is served through the
             service-role /api/info route which filters is_hidden. Canonical
             definitions updated in sql/tables/projects.sql,
             sql/tables/personal_info.sql and sql/schema.sql.
Verification: harness/automation/database/rls.test.mjs (live DB; skips
             offline). Public projects page verified live — visible projects
             render, hidden ones do not.
```
