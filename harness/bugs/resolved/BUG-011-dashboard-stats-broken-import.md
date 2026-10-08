```text
Bug ID:        BUG-011
Title:         DashboardStats.jsx imports STAT_THEMES from a non-existent module (and misuses it)
Severity:      S3 (minor — dead code today, build-breaking if ever imported)
Priority:      P2
Feature:       FEAT-005 (admin-dashboard)
Environment:   any
Preconditions: none (file is currently unused; importing it breaks the build)

Steps to Reproduce:
  1. Open components/Admin/Dashboard/DashboardStats.jsx line 4:
       import { STAT_THEMES } from '../data/dashboardThemes';
  2. ls components/Admin/Dashboard/data/ → only dashboardData.js and
     operationLogs.js exist. STAT_THEMES is exported from dashboardData.js
     (components/Admin/Dashboard.jsx imports it from there).
  3. Import DashboardStats anywhere (or add it to the dashboard) → module
     resolution fails and the build breaks.
  4. Additionally, the component uses t.bg / t.text / t.border ... directly as
     CSS color strings, but STAT_THEMES values are { light, dark } objects
     (see the working StatCard.jsx which indexes t.bg[isLight ? 'light':'dark']).
     Even with the import fixed, the card would render "[object Object]" colors.

Expected:    The module resolves and themes render correctly.
Actual:      Unresolvable import; theme shape misused.
Reproducible: YES (static; verified with scratch/check-imports.mjs)
Evidence:    scratch/check-imports.mjs output:
             "components/Admin/Dashboard/DashboardStats.jsx: UNRESOLVED import
              '../data/dashboardThemes'"

Root Cause:  Stale refactor — STAT_THEMES moved to data/dashboardData.js (with
             {light,dark} values) but this leftover component was not updated.
Fix:         Either delete DashboardStats.jsx (StatCard.jsx is the live
             component) or fix the import to '../data/dashboardData' and index
             theme values with [isLight ? 'light' : 'dark'] like StatCard does.
Regression Test: scratch/check-imports.mjs must report no unresolved imports.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): components/Admin/Dashboard/DashboardStats.jsx imports
             STAT_THEMES from the correct './data/dashboardData' module (was
             '../data/dashboardThemes', which does not exist), and every theme
             value is resolved per light/dark mode via
             `[isLight ? 'light' : 'dark']` (values are {light, dark} pairs —
             using them directly produced invalid CSS like "1px solid [object
             Object]").
Verification: scratch/check-imports.mjs — 0 problems; eslint clean.
```
