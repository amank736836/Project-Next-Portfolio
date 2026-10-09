# FEAT-012 — Admin authentication (OAuth + session)

```text
Feature:        FEAT-012 — Admin authentication
Purpose:        Authenticate the admin via Scalekit OAuth 2.0 with CSRF state and
                refresh tokens. Persist session in a cookie; refresh before expiry.
User:           Admin (the portfolio owner).
Entry Point:
  - GET /api/auth/login
  - GET /api/auth/callback
  - GET /api/auth/validate
  - POST /api/auth/refresh
  - GET /api/auth/logout
  - GET /api/auth/retry
Dependencies:   Scalekit tenant, NEXT_PUBLIC_APP_URL, AUTHORIZED_ADMIN_EMAIL.
Inputs:         OAuth code (callback), refresh_token (refresh).
Outputs:        scalekit_session cookie; redirect or JSON.
Business Rules:
  - BR-008 (open-redirect protection)
  - BR-009 (single authorised email)
  - BR-010 (refresh buffer 5 s)
  - BR-015 (cookie hardening)
Expected Behavior:
  - Login generates a 32-byte state, stores it in `oauth_state` cookie (10 min).
  - Callback verifies state, exchanges code, persists session JSON in
    `scalekit_session` (30 days).
  - Validate returns `{ authenticated, user, sessionStartedAt }` and no-store.
  - Refresh uses Scalekit's token endpoint, updates the session, clears only on
    explicit invalid_grant.
  - Logout clears the local session and calls Scalekit RP-initiated logout.
  - Retry clears the session and forces a new login.
Error Handling:
  - State mismatch → cyber-luxe error page.
  - Scalekit unreachable → falls back to local login URL.
  - Concurrent refreshes for the same session → second returns 429.
Permissions:    None on the endpoints themselves; downstream requires authentication.
Related APIs:   (above)
Related Database Tables: (none)
Related UI:     app/(public)/login/page.jsx
Existing Tests: None in the project.  See harness automation/ for stubs.
Missing Tests:
  - Full E2E (requires Scalekit creds)
  - Refresh race condition
  - Open-redirect attempts
Known Issues:   None.
```
