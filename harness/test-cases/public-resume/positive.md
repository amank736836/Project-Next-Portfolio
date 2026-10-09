# Public resume — positive cases

```text
Test Case ID:    TC-PUB-RS-001
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   resumes table has an active row.
Steps:
  1. GET /api/resume
Expected Result: HTTP 200; JSON metadata.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/resume-metadata.json
Related Requirement: REQ-005
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-RS-002
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Active resume present.
Steps:
  1. GET /api/resume/view
Expected Result: HTTP 200; Content-Type: application/pdf; body is %PDF-.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/resume-view.pdf
Related Requirement: REQ-006
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-RS-003
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Active resume present.
Steps:
  1. GET /api/resume/download
Expected Result: HTTP 200; Content-Disposition: attachment; Content-Type: application/pdf.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/resume-download.pdf
Related Requirement: REQ-006
Last Executed:   —
```
