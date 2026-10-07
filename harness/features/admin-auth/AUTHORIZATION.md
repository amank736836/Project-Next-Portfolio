# FEAT-013 — Admin authorization (email gate)

```text
Feature:        FEAT-013 — Admin authorization
Purpose:        Restrict /admin/* and /api/admin/* to a single authorised email.
User:           Admin (the portfolio owner).
Entry Point:    proxy.js, every admin route handler.
Dependencies:   process.env.AUTHORIZED_ADMIN_EMAIL (default
                'amankarguwal0@gmail.com').
Inputs:         Session cookie.
Outputs:        Allow / 401 / 403 / redirect.
Business Rules:
  - BR-009 (single authorised email)
Expected Behavior:
  - Missing session → 401 (admin API) or redirect to /api/auth/login (admin page).
  - Email mismatch on admin API → 403 { error: 'Forbidden: Unauthorized Email' }.
  - Email mismatch on admin page → redirect to '/?error=unauthorized_email'.
Error Handling: Authorised email missing → defaults to a hard-coded value.
Permissions:    Single user.
Related APIs:   All /api/admin/* (see individual features)
Related Database Tables: (none)
Related UI:     app/(admin)/admin/*
Existing Tests: None.
Missing Tests:
  - Different email is rejected
  - Default email is used when env unset
Known Issues:   None.
```
