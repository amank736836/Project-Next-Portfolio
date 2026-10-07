# API — regression cases

```text
Test Case ID:    TC-API-040
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
Test Case ID:    TC-API-041
Feature:         FEAT-009
Priority:        P0
Type:            REGRESSION
Preconditions:   Server running.
Steps:
  1. GET /api/info
Expected Result: Cache-Control: s-maxage=60, stale-while-revalidate=120.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/public-info-headers.headers
Related Requirement: REQ-004
Last Executed:   —
```

```text
Test Case ID:    TC-API-042
Feature:         FEAT-025
Priority:        P0
Type:            REGRESSION
Preconditions:   Server running.
Steps:
  1. POST /api/csp-report
Expected Result: Cache-Control: no-store, max-age=0.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/csp-report-headers.headers
Related Requirement: REQ-103
Last Executed:   —
```
