# Admin experience — positive cases

```text
Test Case ID:    TC-ADM-EX-001
Feature:         FEAT-022
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/experience
Expected Result: HTTP 200; array of experience rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-EX-002
Feature:         FEAT-022
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/experience with body { year: '2024-Present', title: 'SWE' }
Expected Result: HTTP 200; row created.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-EX-003
Feature:         FEAT-022
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. PUT /api/admin/experience with body { id, ... }
Expected Result: HTTP 200; row updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-EX-004
Feature:         FEAT-022
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. DELETE /api/admin/experience?id=<id>
Expected Result: HTTP 200; { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```
