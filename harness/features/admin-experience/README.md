# FEAT-022 — Admin experience

```text
Feature:        FEAT-022 — Admin experience
Purpose:        CRUD on experience entries.
User:           Admin.
Entry Point:    /api/admin/experience (GET/POST/PUT/DELETE)
Dependencies:   experience table.
Inputs:         JSON { year, title, description, is_hidden }.
Outputs:        Rows as JSON.
Business Rules: BR-014.
Expected Behavior:
  - GET returns all rows.
  - POST creates; PUT updates by id; DELETE removes.
Error Handling: 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/experience
Related Database Tables: experience
Related UI:     app/(admin)/admin/matrix/page.jsx (uses MatrixPageClient)
Existing Tests: None.
Missing Tests:
  - is_hidden soft delete
Known Issues:   None.
```
