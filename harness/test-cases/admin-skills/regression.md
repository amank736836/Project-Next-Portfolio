# Admin skills — regression cases

```text
Test Case ID:    TC-ADM-SK-030
Feature:         FEAT-015
Priority:        P0
Type:            REGRESSION
Preconditions:   Any admin endpoint.
Steps:
  1. Inspect response Cache-Control
Expected Result: `no-store, private, must-revalidate`.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-104
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-031
Feature:         FEAT-015
Priority:        P0
Type:            REGRESSION (security)
Preconditions:   Cross-origin request to POST /api/admin/skills.
Steps:
  1. POST with Origin: https://evil.com
Expected Result: HTTP 403; { error: 'CSRF validation failed' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/csrf-blocked.json
Related Requirement: REQ-013
Last Executed:   —
```
