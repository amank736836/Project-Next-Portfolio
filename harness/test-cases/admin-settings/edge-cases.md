# Admin settings — edge cases

```text
Test Case ID:    TC-ADM-ST-020
Feature:         FEAT-019
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/settings with description = JSON
Expected Result: HTTP 200; row stored with type=json (cast).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-021
Feature:         FEAT-019
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/settings with key length > 1000
Expected Result: HTTP 500 (likely text column overflow).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```
