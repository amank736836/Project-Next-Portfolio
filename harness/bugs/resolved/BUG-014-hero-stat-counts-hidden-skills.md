```text
Bug ID:        BUG-014
Title:         Hero "Technologies" stat counts hidden skills
Severity:      S4 (trivial)
Priority:      P3
Feature:       FEAT-001 (public-home)
Environment:   any
Preconditions: At least one skill has is_hidden = true.

Steps to Reproduce:
  1. Hide a skill (PATCH /api/admin/skills?id=<id> {"is_hidden": true}).
  2. GET / and look at the "Technologies" CountUp value.

Expected:    The stat counts only publicly visible skills.
Actual:      app/(public)/page.js runs
               supabase.from('skills').select('id').limit(1000)
             with no .eq('is_hidden', false), so hidden skills are included.
Reproducible: YES (code review)
Evidence:    app/(public)/page.js:17-19.

Root Cause:  Missing is_hidden filter on the stats query.
Fix:         Add .eq('is_hidden', false) to the stats query (matching the
             featured-skills query's intent).
Regression Test: hide N skills, assert the stat decreases by N.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): the hero "Technologies" stat query in
             app/(public)/page.js now filters `.eq('is_hidden', false)` so hidden
             skills are not counted.
Verification: scratch/leak-test.mjs — with one skill hidden the hero stat shows
             the visible count (17) instead of the total (18). PASS.
```
