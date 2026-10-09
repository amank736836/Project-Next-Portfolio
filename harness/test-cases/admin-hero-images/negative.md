# Admin hero images — negative cases

```text
Test Case ID:    TC-ADM-HI-010
Feature:         FEAT-017
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/hero-images with file=application/pdf
Expected Result: HTTP 400; { error: 'Invalid file type. Only JPEG, PNG, WebP allowed' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017, BR-006
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-011
Feature:         FEAT-017
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/hero-images with file=6MB JPEG
Expected Result: HTTP 400; { error: 'File too large. Max 5MB' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017, BR-006
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-012
Feature:         FEAT-017
Priority:        P1
Type:            EDGE
Preconditions:   Two hero rows already exist with is_hero=true.
Steps:
  1. PATCH /api/admin/hero-images/<id2> with body { is_hero: true }
Expected Result: DB trigger un-sets is_hero on id1; only id2 is_hero=true.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017, BR-002
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-013
Feature:         FEAT-017
Priority:        P1
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/hero-images with file=image/svg+xml
Expected Result: HTTP 400 (route only allows JPEG/PNG/WebP).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017, BR-006
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-014
Feature:         FEAT-017
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/hero-images
Expected Result: HTTP 401; { error: 'Unauthorized' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/hero-images-401.json
Related Requirement: REQ-011
Last Executed:   —
```
