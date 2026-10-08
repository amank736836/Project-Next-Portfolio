```text
Bug ID:        BUG-006
Title:         Hidden skills leak into the site in single-page mode
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-020 (site-mode) / FEAT-011 (public-skills)
Environment:   local-offline (reproduced live), production (same code path)
Preconditions: site_mode = 'single'; at least one skill has is_hidden = true.

Steps to Reproduce:
  1. PUT /api/admin/info [{key:'site_mode', title:'Site Mode', description:'single'}]
  2. PATCH /api/admin/skills?id=<id> with {"is_hidden": true} for skill "Redis".
  3. GET / (home) and inspect the HTML.

Expected:    The hidden skill does not appear in the Skills section.
Actual:      The home page HTML contains the hidden skill ("Redis"). Verified
             live: home rendered 13 single-page sections and included both the
             visible control skill ("MongoDb") and the hidden "Redis".
Reproducible: YES (verified live against the dev server in offline mode)
Evidence:    Live run on 2026-10-08 with site_mode=single and Redis hidden:
             `LEAK hidden skill Redis in home: true`.

Root Cause:  components/SinglePageLayout.jsx queries
               supabase.from('skills').select('*').order('id', { ascending: true })
             without .eq('is_hidden', false). Every other public skills read
             filters hidden rows:
               - app/(public)/skills/SkillsPageClient.jsx (.eq('is_hidden', false))
               - app/(public)/layout.jsx featured query (no is_hidden filter, but
                 it also does not filter — see note)
               - app/(public)/page.js featured query (same)
             The Skills component (components/Skills.jsx) does not filter
             is_hidden client-side either, so the unfiltered query leaks.
Fix:         Add .eq('is_hidden', false) to the skills query in
             components/SinglePageLayout.jsx (and to the featured-skills queries
             in app/(public)/layout.jsx and app/(public)/page.js for consistency).
Regression Test: hide a skill, switch site_mode to 'single', assert the skill
             title is absent from the home page HTML.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): components/SinglePageLayout.jsx skills query now
             filters `.eq('is_hidden', false)`; featured-skill queries in
             app/(public)/layout.jsx and app/(public)/page.js also filter
             is_hidden for consistency.
Verification: scratch/leak-test.mjs — after PATCH /api/admin/skills?id=13
             {"is_hidden": true} ("Redis"), GET /, /about and /skills no longer
             contain "Redis". PASS.
```
