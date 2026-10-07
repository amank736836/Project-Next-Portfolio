# Admin hero images — positive cases

```text
Test Case ID:    TC-ADM-HI-001
Feature:         FEAT-017
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/hero-images
Expected Result: HTTP 200; body { data: [ ... ] } (may be empty).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-002
Feature:         FEAT-017
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; Cloudinary env present.
Steps:
  1. POST /api/admin/hero-images as multipart with file=<jpeg>, altText=Hero, isHero=true
Expected Result: HTTP 200; row inserted with is_hero=true.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-003
Feature:         FEAT-017
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a row exists.
Steps:
  1. PATCH /api/admin/hero-images/<id> with body { altText: "New" }
Expected Result: HTTP 200; row updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-004
Feature:         FEAT-017
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a row exists.
Steps:
  1. DELETE /api/admin/hero-images/<id>
Expected Result: HTTP 200; row removed.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```
