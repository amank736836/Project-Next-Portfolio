# Public resume — edge cases

```text
Test Case ID:    TC-PUB-RS-020
Feature:         FEAT-008
Priority:        P1
Type:            EDGE
Preconditions:   No active resume; public/resume.pdf exists.
Steps:
  1. GET /api/resume
  2. GET /api/resume/view
Expected Result: 1st returns synthetic fallback; 2nd returns the local file.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-005, REQ-006, BR-016
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-RS-021
Feature:         FEAT-008
Priority:        P2
Type:            EDGE
Preconditions:   Active resume URL broken.
Steps:
  1. GET /api/resume/view
Expected Result: Falls back to local file.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-006, BR-016
Last Executed:   —
```
