# API — edge cases

```text
Test Case ID:    TC-API-030
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   Server running.
Steps:
  1. GET /api/projects (warm cache)
  2. GET /api/projects (immediately again)
Expected Result: First and second both 200; if Next.js ISR is active, both served from cache.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-API-031
Feature:         FEAT-009
Priority:        P2
Type:            EDGE
Preconditions:   Server running.
Steps:
  1. GET /api/info (twice)
Expected Result: Both 200; Cache-Control headers identical.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-004
Last Executed:   —
```
