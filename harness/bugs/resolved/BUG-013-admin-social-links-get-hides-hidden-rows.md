```text
Bug ID:        BUG-013
Title:         GET /api/admin/social-links filters out hidden rows (inconsistent admin API)
Severity:      S4 (trivial)
Priority:      P3
Feature:       FEAT-016 (admin-social-links)
Environment:   any
Preconditions: A social link exists with is_hidden = true.

Steps to Reproduce:
  1. PATCH /api/admin/social-links/<id> {"is_hidden": true}.
  2. GET /api/admin/social-links.

Expected:    The admin list endpoint returns ALL links (like every other admin
             GET: skills, projects, education, experience, info, settings,
             hero-images, resumes) so the admin can see and un-hide them.
Actual:      The hidden link is missing from the response
             (.eq('is_hidden', false) in app/api/admin/social-links/route.js GET).
Reproducible: YES (verified live in offline mode)
Evidence:    scratch/admin-crud-probe.mjs: "hidden link not listed by admin GET"
             (this assertion documents the current, undesired behavior).

Root Cause:  The GET handler reuses the public-visibility filter instead of
             returning the full admin list.
Fix:         Remove .eq('is_hidden', false) from the admin GET handler.
             (The public layout already filters with its own query, and the
             admin UI reads the table directly via the settings page, so nothing
             depends on this filter.)
Regression Test: after hiding a link, GET /api/admin/social-links still lists it.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): GET /api/admin/social-links no longer filters
             `.eq('is_hidden', false)` — the admin list returns ALL links so
             hidden ones can be managed/un-hidden. Public queries remain filtered.
Verification: scratch/admin-crud-probe.mjs — 'hidden link IS listed by admin GET'
             passes; scratch/leak-test.mjs confirms it live. PASS.
```
