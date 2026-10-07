# FEAT-009 — Public personal info

```text
Feature:        FEAT-009 — Public personal info (key/value)
Purpose:        Expose the personal_info rows for the public site (consumed by the
                client / server components for the about page and the contact section).
User:           Public visitor.
Entry Point:    GET /api/info
Dependencies:   personal_info table.
Inputs:         None.
Outputs:        Array of { key, title, description, is_hidden? }.
Business Rules: BR-014 (is_hidden), BR-001 (excludes site_mode, default_theme_*).
Expected Behavior:
  - Returns 200 with rows ordered by key ascending.
  - Cache-Control: s-maxage=60, stale-while-revalidate=120.
Error Handling: 500 on Supabase error.
Permissions:    None (public).
Related APIs:   GET /api/info
Related Database Tables: personal_info
Related UI:     components/Info.jsx, components/SinglePageLayout.jsx
Existing Tests: None.
Missing Tests:
  - Cache header values
  - Stable ordering
Known Issues:   None.
```
