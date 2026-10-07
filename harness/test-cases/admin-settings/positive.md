# Admin settings — positive cases

```text
Test Case ID:    TC-ADM-ST-001
Feature:         FEAT-019
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/settings
Expected Result: HTTP 200; array of user_settings rows (including seeded enable_* rows).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-002
Feature:         FEAT-019
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/settings with body { key: 'enable_x', title: 'X', description: 'true' }
Expected Result: HTTP 200; row created.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-003
Feature:         FEAT-019
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. PUT /api/admin/settings with body { key: 'enable_x', description: 'false' }
Expected Result: HTTP 200; { success: true }; description updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-004
Feature:         FEAT-019
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. DELETE /api/admin/settings?key=enable_x
Expected Result: HTTP 200; { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```
