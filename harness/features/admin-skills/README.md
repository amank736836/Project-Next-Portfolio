# FEAT-015 — Admin skills (CRUD + categories)

```text
Feature:        FEAT-015 — Admin skills
Purpose:        Manage the skill list (create/edit/delete, category, featured toggle,
                icon + color).
User:           Admin.
Entry Point:
  - GET /api/admin/skills, POST /api/admin/skills, PUT, PATCH, DELETE
  - GET /api/admin/skill-categories, POST, PUT, DELETE
Dependencies:   skills, skill_categories tables.
Inputs:         JSON body (title, percentage, category, icon, color, is_featured,
                is_hidden).
Outputs:        Skills / categories as JSON.
Business Rules:
  - BR-003 (featured cap = 5)
  - BR-011 (allow-list of fields)
  - BR-014 (is_hidden)
Expected Behavior:
  - GET returns all skills ordered by id.
  - POST validates `title` non-empty, otherwise 400.
  - Unknown fields are stripped before insert/update.
  - PATCH toggles `is_featured` (used by the UI for featured cap).
Error Handling: 500 on Supabase error; 400 on missing title.
Permissions:    Admin only.
Related APIs:   /api/admin/skills, /api/admin/skill-categories
Related Database Tables: skills, skill_categories
Related UI:     components/Admin/SkillsManager.jsx, SkillEditModal.jsx
Existing Tests: None in the project.
Missing Tests:
  - Allow-list strips unknown fields
  - is_featured toggles correctly
  - Featured cap enforcement at the API layer (currently only UI)
Known Issues:   None.
```
