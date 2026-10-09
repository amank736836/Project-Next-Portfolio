# Admin personal info — positive cases

```text
Test Case ID:    TC-ADM-PI-001
Feature:         FEAT-023
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/info
Expected Result: HTTP 200; array of personal_info rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PI-002
Feature:         FEAT-023
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/info with body { key: 'github', title: 'GitHub', description: 'https://...' }
Expected Result: HTTP 200; row created.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PI-003
Feature:         FEAT-023
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. PUT /api/admin/info with body [{ key, ...}, { key, ... }]
Expected Result: HTTP 200; rows upserted.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PI-004
Feature:         FEAT-023
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; row exists.
Steps:
  1. DELETE /api/admin/info?key=github
Expected Result: HTTP 200; { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```
