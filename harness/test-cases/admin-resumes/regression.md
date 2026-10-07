# Admin resumes — regression cases

```text
Test Case ID:    TC-ADM-RS-030
Feature:         FEAT-018
Priority:        P0
Type:            REGRESSION
Preconditions:   resumes table populated.
Steps:
  1. SQL: SELECT count(*) FROM resumes WHERE is_active = true
Expected Result: 0 or 1.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/resumes-is_active-count.txt
Related Requirement: REQ-023, BR-005
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-031
Feature:         FEAT-008 (public)
Priority:        P0
Type:            REGRESSION
Preconditions:   No active resume in DB.
Steps:
  1. GET /api/resume
  2. GET /api/resume/view
Expected Result: First returns synthetic fallback JSON; second streams public/resume.pdf.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/resume-fallback.json
Related Requirement: REQ-005, REQ-006, BR-016
Last Executed:   —
```
