# FEAT-023 — Admin personal info

```text
Feature:        FEAT-023 — Admin personal info
Purpose:        Manage personal_info rows (bio, social handles, site_mode, etc.).
User:           Admin.
Entry Point:    /api/admin/info (GET/POST/PUT/DELETE)
Dependencies:   personal_info table.
Inputs:         JSON row(s) { key, title, description, is_hidden }.
Outputs:        Row(s) as JSON.
Business Rules: BR-004 (site_mode), BR-014 (is_hidden).
Expected Behavior:
  - GET returns all rows ordered by key.
  - POST upserts a single row (with auto-generated key if missing).
  - PUT upserts an array or single row.
  - DELETE removes by key.
Error Handling: 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/info
Related Database Tables: personal_info
Related UI:     components/Admin/InfoManager.jsx, app/(admin)/admin/identity/page.jsx
Existing Tests: None.
Missing Tests:
  - Upsert semantics
  - site_mode change impact (covered by FEAT-010)
Known Issues:   None.
```
