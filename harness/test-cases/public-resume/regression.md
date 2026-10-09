# Public resume — regression cases

```text
Test Case ID:    TC-PUB-RS-030
Feature:         FEAT-008
Priority:        P0
Type:            REGRESSION
Preconditions:   Active resume present.
Steps:
  1. GET /api/resume/view
Expected Result: Response sets X-Frame-Options: SAMEORIGIN.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/resume-view.headers
Related Requirement: REQ-101
Last Executed:   —
```
