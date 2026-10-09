# Security — edge cases

```text
Test Case ID:    TC-SEC-030
Feature:         FEAT-018 (CSRF + session)
Priority:        P0
Type:            EDGE
Preconditions:   No session, cross-origin POST.
Steps:
  1. POST /api/admin/skills with Origin: https://evil.com, no session
Expected Result: HTTP 401 (auth check runs first or proxy CSRF returns 403 — order: CSRF happens BEFORE auth in proxy).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-013, REQ-014
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-031
Feature:         FEAT-018 (rate limit)
Priority:        P1
Type:            EDGE
Preconditions:   UPSTASH_REDIS_REST_URL set.
Steps:
  1. POST /api/admin/skills 70 times
Expected Result: In-memory store is bypassed; no 429s from local store.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-014
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-032
Feature:         FEAT-014 (authz edge)
Priority:        P0
Type:            EDGE
Preconditions:   Session with non-authorised email.
Steps:
  1. GET /api/admin/skills
Expected Result: HTTP 403.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-012
Last Executed:   —
```
