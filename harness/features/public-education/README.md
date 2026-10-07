# FEAT-004 — Public education

```text
Feature:        FEAT-004 — Public education
Purpose:        Display the owner's education history.
User:           Public visitor.
Entry Point:    GET /education
Dependencies:   education table.
Inputs:         None.
Outputs:        Timeline of education entries.
Business Rules: BR-014 (is_hidden filter).
Expected Behavior:
  - Hidden rows are not shown.
  - Each row has year, title (HTML allowed), description.
Error Handling: Empty list → empty timeline.
Permissions:    None.
Related APIs:   (none — uses Supabase directly)
Related Database Tables: education
Related UI:     components/Education.jsx
Existing Tests: None.
Missing Tests:
  - Soft-delete behaviour
  - HTML sanitisation in title
Known Issues:   None.
```
