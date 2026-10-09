# Public resume — negative cases

```text
Test Case ID:    TC-PUB-RS-010
Feature:         FEAT-008
Priority:        P1
Type:            NEGATIVE
Preconditions:   No active resume; no local file.
Steps:
  1. GET /api/resume/view
Expected Result: HTTP 404.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-006
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-RS-011
Feature:         FEAT-008
Priority:        P1
Type:            NEGATIVE
Preconditions:   DB unreachable.
Steps:
  1. GET /api/resume
Expected Result: HTTP 500; { error: 'Failed to fetch resume' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-005
Last Executed:   —
```
