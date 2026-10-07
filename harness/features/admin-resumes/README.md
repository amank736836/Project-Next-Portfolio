# FEAT-018 — Admin resumes

```text
Feature:        FEAT-018 — Admin resumes
Purpose:        Upload PDF resumes to Supabase Storage and manage them (active,
                favorite).
User:           Admin.
Entry Point:
  - GET /api/admin/resumes
  - POST /api/admin/upload (multipart, is_resume=true)
  - GET /api/admin/resumes
Dependencies:   resumes table, Supabase Storage bucket `portfolio-resumes`.
Inputs:         Multipart: file (PDF), title.
Outputs:        Resume row(s) as JSON.
Business Rules:
  - BR-005 (active resume)
  - BR-007 (resume upload allow-list)
Expected Behavior:
  - PDF only, ≤ 5 MB.
  - Stored in `portfolio-resumes` bucket.
  - Newly uploaded row has `is_active = true`; trigger deactivates others.
  - List returns all resumes for the admin to manage.
Error Handling: 400 on type/size; 500 on storage failure.
Permissions:    Admin only.
Related APIs:   /api/admin/resumes, /api/admin/upload
Related Database Tables: resumes
Related UI:     components/Admin/ResumeManager.jsx, ResumesTab.jsx
Existing Tests: None.
Missing Tests:
  - Active toggle via trigger
  - Storage failure rollback
  - Non-PDF rejection
Known Issues:   None.
```
