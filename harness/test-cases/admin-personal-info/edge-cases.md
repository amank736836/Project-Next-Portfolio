# Admin personal info — edge cases

```text
Test Case ID:    TC-ADM-PI-020
Feature:         FEAT-023
Priority:        P1
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/info with body {} (no key)
Expected Result: HTTP 200; key = 'custom_<timestamp>'.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-022
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PI-021
Feature:         FEAT-010
Priority:        P0
Type:            REGRESSION
Preconditions:   Admin authenticated.
Steps:
  1. PUT /api/admin/info with body [{ key: 'site_mode', title: 'Site Mode', description: 'single' }]
  2. Wait revalidate window, GET /
Expected Result: / returns null in single mode.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-002
Last Executed:   —
```
