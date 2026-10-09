# Public portfolio — negative cases

```text
Test Case ID:    TC-PUB-020
Feature:         FEAT-001
Priority:        P2
Type:            NEGATIVE
Preconditions:   Server stopped.
Steps:
  1. GET /
Expected Result: Connection refused (not a 5xx from a running server).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-021
Feature:         FEAT-006
Priority:        P2
Type:            NEGATIVE
Preconditions:   /api/projects endpoint up but DB unreachable.
Steps:
  1. GET /api/projects
Expected Result: HTTP 500 with JSON { error: '...' }.
Status:          NOT_RUN
Automation:      AUTOMATED (requires DB stop)
Evidence:        evidence/api-responses/projects-500.json
Related Requirement: REQ-003
Last Executed:   —
```
