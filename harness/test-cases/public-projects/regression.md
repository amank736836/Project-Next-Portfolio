# Public projects — regression cases

```text
Test Case ID:    TC-PUB-PR-030
Feature:         FEAT-006
Priority:        P0
Type:            REGRESSION
Preconditions:   Server running.
Steps:
  1. GET /api/projects
Expected Result: Cache-Control: s-maxage=60, stale-while-revalidate=120.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/public-projects-headers.headers
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-031
Feature:         FEAT-006
Priority:        P0
Type:            REGRESSION
Preconditions:   No projects.
Steps:
  1. GET /api/projects
Expected Result: HTTP 200; body = [].
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```
