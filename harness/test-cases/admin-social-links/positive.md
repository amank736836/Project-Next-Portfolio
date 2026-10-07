# Admin social links — positive cases

```text
Test Case ID:    TC-ADM-SL-001
Feature:         FEAT-020
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/social-links
Expected Result: HTTP 200; array of social_links rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SL-002
Feature:         FEAT-020
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/social-links with body { platform: 'github', url: 'https://...' }
Expected Result: HTTP 200; row created.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SL-003
Feature:         FEAT-020
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a row exists.
Steps:
  1. PATCH /api/admin/social-links/<id> with body { url: 'https://new' }
Expected Result: HTTP 200; row updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SL-004
Feature:         FEAT-020
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a row exists.
Steps:
  1. DELETE /api/admin/social-links/<id>
Expected Result: HTTP 200; row removed.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```
