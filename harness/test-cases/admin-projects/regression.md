# Admin projects — regression cases

```text
Test Case ID:    TC-ADM-PR-030
Feature:         FEAT-016
Priority:        P0
Type:            REGRESSION
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/projects
Expected Result: Cache-Control: no-store, private, must-revalidate.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-104
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-031
Feature:         FEAT-016
Priority:        P0
Type:            REGRESSION
Preconditions:   Public site.
Steps:
  1. GET /api/projects
Expected Result: Cache-Control: s-maxage=60, stale-while-revalidate=120.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/public-projects-headers.headers
Related Requirement: REQ-003
Last Executed:   —
```
