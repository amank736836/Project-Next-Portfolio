# Admin personal info — negative cases

```text
Test Case ID:    TC-ADM-PI-010
Feature:         FEAT-023
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/info
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/info-401.json
Related Requirement: REQ-011
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PI-011
Feature:         FEAT-023
Priority:        P1
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. DELETE /api/admin/info (no key)
Expected Result: HTTP 400; { error: 'Missing key' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```
