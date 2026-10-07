# Admin projects — negative cases

```text
Test Case ID:    TC-ADM-PR-010
Feature:         FEAT-016
Priority:        P0
Type:            NEGATIVE (security)
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/projects with body { "title": "X", "is_admin": true }
Expected Result: HTTP 200; is_admin is stripped.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016, BR-011
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-011
Feature:         FEAT-016
Priority:        P1
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. DELETE /api/admin/projects?id=999999
Expected Result: HTTP 200; { success: true } (no rows deleted, but no error from Supabase).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-012
Feature:         FEAT-016
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. POST /api/admin/projects
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/admin-projects-401.json
Related Requirement: REQ-011
Last Executed:   —
```
