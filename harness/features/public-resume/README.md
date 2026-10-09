# FEAT-008 — Public resume

```text
Feature:        FEAT-008 — Public resume (metadata + view + download)
Purpose:        Surface the owner's resume for download / inline view.
User:           Public visitor.
Entry Point:
  - GET /api/resume           → metadata (JSON)
  - GET /api/resume/view      → inline PDF
  - GET /api/resume/download  → forced download
Dependencies:   resumes table, Supabase Storage bucket `portfolio-resumes`,
                public/resume.pdf (fallback).
Inputs:         None.
Outputs:        JSON (metadata) or PDF bytes.
Business Rules:
  - BR-005 (active resume)
  - BR-016 (public resume fallback)
Expected Behavior:
  - /api/resume returns the active row (or a synthetic fallback).
  - /api/resume/view streams the PDF with `Content-Type: application/pdf`.
  - /api/resume/download returns the same PDF with
    `Content-Disposition: attachment`.
Error Handling: 404 when no resume available; 500 on internal failure.
Permissions:    None (public).
Related APIs:   GET /api/resume, /api/resume/view, /api/resume/download
Related Database Tables: resumes
Related UI:     components/sections/ResumeViewerModal.jsx (modal viewer)
Existing Tests: None.
Missing Tests:
  - Storage-signed-URL fallback when public read fails
  - Local fallback when DB has no active row
Known Issues:   None.
```
