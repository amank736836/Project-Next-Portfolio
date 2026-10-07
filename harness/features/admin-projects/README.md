# FEAT-016 — Admin projects

```text
Feature:        FEAT-016 — Admin projects
Purpose:        CRUD on portfolio projects.
User:           Admin.
Entry Point:    /api/admin/projects (GET/POST/PUT/DELETE)
Dependencies:   projects table.
Inputs:         JSON body (title, description, image, img, category, is_hidden,
                details).
Outputs:        Projects as JSON.
Business Rules:
  - BR-001 (public visibility filter)
  - BR-011 (allow-list of fields)
  - BR-014 (is_hidden)
Expected Behavior:
  - GET returns all projects (including hidden).
  - POST defaults `is_hidden = true` when not provided.
  - PUT updates by id, stripping unknown fields.
  - DELETE deletes by id.
Error Handling: 500 on Supabase error.
Permissions:    Admin only.
Related APIs:   /api/admin/projects
Related Database Tables: projects
Related UI:     components/Admin/ProjectManager.jsx, EditProjectForm/*
Existing Tests: None.
Missing Tests:
  - Hidden-by-default behaviour on POST
  - Allow-list enforcement
  - Public visibility filter (BR-001) — projects in DB hidden from /api/projects
Known Issues:   None.
```
