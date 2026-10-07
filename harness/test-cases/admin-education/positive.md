# Admin education — positive cases

```text
Test Case ID:    TC-ADM-ED-001
Feature:         FEAT-021
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/education
Expected Result: HTTP 200; array of education rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-020
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ED-002
Feature:         FEAT-021
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/education with body { year: '2020-2024', title: 'BSc CS' }
Expected Result: HTTP 200; row created.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-020
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ED-003
Feature:         FEAT-021
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. PUT /api/admin/education with body { id, ... }
Expected Result: HTTP 200; row updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-020
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ED-004
Feature:         FEAT-021
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. DELETE /api/admin/education?id=<id>
Expected Result: HTTP 200; { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-020
Last Executed:   —
```
