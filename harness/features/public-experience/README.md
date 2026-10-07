# FEAT-005 — Public experience

```text
Feature:        FEAT-005 — Public experience
Purpose:        Display the owner's work experience.
User:           Public visitor.
Entry Point:    GET /experience
Dependencies:   experience table.
Inputs:         None.
Outputs:        Timeline of experience entries.
Business Rules: BR-014 (is_hidden filter).
Expected Behavior:
  - Hidden rows are not shown.
  - Each row has year, title (HTML allowed), description.
Error Handling: Empty list → empty timeline.
Permissions:    None.
Related APIs:   (none — uses Supabase directly)
Related Database Tables: experience
Related UI:     components/sections/ExperienceSection.jsx
Existing Tests: None.
Missing Tests:
  - Soft-delete behaviour
  - HTML sanitisation in title
Known Issues:   None.
```
