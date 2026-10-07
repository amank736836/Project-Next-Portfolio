# FEAT-021 — Admin education

```text
Feature:        FEAT-021 — Admin education
Purpose:        CRUD on education entries.
User:           Admin.
Entry Point:    /api/admin/education (GET/POST/PUT/DELETE)
Dependencies:   education table.
Inputs:         JSON { year, title, description, is_hidden }.
Outputs:        Rows as JSON.
Business Rules: BR-014.
Expected Behavior:
  - GET returns all rows.
  - POST creates; PUT updates by id; DELETE removes.
Error Handling: 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/education
Related Database Tables: education
Related UI:     app/(admin)/admin/academy/page.jsx
Existing Tests: None.
Missing Tests:
  - is_hidden soft delete
Known Issues:   None.
```
