# Admin hero images — edge cases

```text
Test Case ID:    TC-ADM-HI-020
Feature:         FEAT-017
Priority:        P2
Type:            EDGE
Preconditions:   No hero_images rows.
Steps:
  1. GET /api/admin/hero-images
Expected Result: HTTP 200; body { data: [] }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-HI-021
Feature:         FEAT-017
Priority:        P2
Type:            EDGE
Preconditions:   CLOUDINARY env vars unset.
Steps:
  1. POST /api/admin/hero-images with valid JPEG
Expected Result: HTTP 500 (Cloudinary config missing).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-017
Last Executed:   —
```
