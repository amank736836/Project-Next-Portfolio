```text
Bug ID:        BUG-005
Title:         Hidden personal_info rows are exposed on all public surfaces (is_hidden never applied)
Severity:      S1 (critical)
Priority:      P1
Feature:       FEAT-008 (public-about) / FEAT-024 (admin-personal-info)
Environment:   local-offline (reproduced live), production (same code path)
Preconditions: Admin hides an identity node via PATCH /api/admin/info?key=<key> {"is_hidden": true}

Steps to Reproduce:
  1. PATCH /api/admin/info?key=phone with body {"is_hidden": true} (admin session).
  2. GET /about  → the hidden phone number is still rendered in "Personal Infos".
  3. GET /api/info → the hidden row is returned ({"key":"phone",...,"is_hidden":true}).
  4. Switch site_mode to 'single' (PUT /api/admin/info) and GET / → the hidden
     phone still renders in the single-page About section.

Expected:    Rows with is_hidden = true are excluded from /about, /api/info and
             the single-page layout. The admin "hide node" toggle actually hides.
Actual:      Hidden rows render publicly everywhere. The toggle is a no-op on
             the public site.
Reproducible: YES (verified live against the dev server in offline mode)
Evidence:    scratch/admin-crud-probe.mjs; live run on 2026-10-08:
             /about contained the hidden phone digits; /api/info returned the
             hidden row with is_hidden:true.

Root Cause:  Public reads of personal_info never filter is_hidden:
               - app/(public)/about/page.jsx:  supabase.from('personal_info').select('*')
               - app/api/info/route.js:       .from('personal_info').select('*')
               - components/SinglePageLayout.jsx: .from('personal_info').select('*')
             Every other public table read (skills, projects, education,
             experience, social_links) applies .eq('is_hidden', false), but
             personal_info reads do not, even though migration 015 added the
             is_hidden column and the admin Identity UI exposes a hide toggle.
Fix:         Add .eq('is_hidden', false) to the three public reads above (or
             filter in the /api/info route response). Keep admin reads unfiltered.
Regression Test: hide phone via admin API, then assert GET /api/info and the
             /about HTML no longer contain the phone value.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): Added `.eq('is_hidden', false)` to every public
             personal_info read — app/(public)/about/page.jsx, app/api/info/route.js,
             components/SinglePageLayout.jsx, the phone/address query in
             app/(public)/layout.jsx, and the address handling in app/(public)/page.js
             (site_mode row intentionally left unfiltered — it drives layout logic).
             Offline seed rows now carry is_hidden:false so the offline query
             builder filters identically to Postgres.
Verification: scratch/leak-test.mjs — after PATCH /api/admin/info?key=phone
             {"is_hidden": true}, GET /, /about, /skills and /api/info no longer
             contain the phone number. PASS (10/10 checks).
```
