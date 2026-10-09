# FEAT-002 — Public about

```text
Feature:        FEAT-002 — Public about
Purpose:        Show biographical information about the owner.
User:           Public visitor.
Entry Point:    GET /about
Dependencies:   personal_info (rows other than site_mode and default_theme_*),
                skills (overview), education (links to /education),
                experience (links to /experience)
Inputs:         None (server component).
Outputs:        Server-rendered HTML with bio, key/value info, "Download CV" CTA.
Business Rules: BR-014 (soft delete via is_hidden), BR-004 (site mode).
Expected Behavior:
  - Lists personal_info rows in a fixed desired order.
  - Shows Skills + Education + Experience summaries.
Error Handling: Falls back to seed data via offline client.
Permissions:    None.
Related APIs:   GET /api/info
Related Database Tables: personal_info, skills, education, experience
Related UI:     components/Info.jsx, components/Skills.jsx, components/Education.jsx
Existing Tests: None.
Missing Tests:
  - Reordering of personal_info rows
  - Handling of absent rows (no first_name, etc.)
Known Issues:   None.
```
