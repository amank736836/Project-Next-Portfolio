# Admin settings — negative cases

```text
Test Case ID:    TC-ADM-ST-010
Feature:         FEAT-019
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/settings with body { title: 'No Key' }
Expected Result: HTTP 400; { error: 'Missing key or title' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-011
Feature:         FEAT-019
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. DELETE /api/admin/settings
Expected Result: HTTP 400; { error: 'Missing key' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-012
Feature:         FEAT-019
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/settings with body { key: 'enable_x', title: 'X', type: 'BOGUS' }
Expected Result: DB CHECK rejects; route returns 500.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-018
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ST-013
Feature:         FEAT-019
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/settings
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/settings-401.json
Related Requirement: REQ-011
Last Executed:   —
```
