# API — positive cases

```text
Test Case ID:    TC-API-001
Feature:         FEAT-006
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running; offline or DB up.
Steps:
  1. GET /api/projects
Expected Result: HTTP 200; body is JSON array.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/public-projects.json
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-API-002
Feature:         FEAT-009
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/info
Expected Result: HTTP 200; body is JSON array.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/public-info.json
Related Requirement: REQ-004
Last Executed:   —
```

```text
Test Case ID:    TC-API-003
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/resume
Expected Result: HTTP 200; JSON metadata (active row or fallback).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/public-resume.json
Related Requirement: REQ-005
Last Executed:   —
```

```text
Test Case ID:    TC-API-004
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/resume/view
Expected Result: HTTP 200; Content-Type: application/pdf.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-006
Last Executed:   —
```

```text
Test Case ID:    TC-API-005
Feature:         FEAT-006
Priority:        P1
Type:            EDGE
Preconditions:   No projects.
Steps:
  1. GET /api/projects
Expected Result: HTTP 200; body = [].
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-API-006
Feature:         FEAT-006
Priority:        P1
Type:            NEGATIVE
Preconditions:   DB down.
Steps:
  1. GET /api/projects
Expected Result: HTTP 500; { error }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-API-007
Feature:         FEAT-006
Priority:        P1
Type:            EDGE
Preconditions:   Project with title but no img.
Steps:
  1. GET /api/projects
Expected Result: Project not present.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-API-008
Feature:         FEAT-006
Priority:        P1
Type:            EDGE
Preconditions:   Project with img = /assets/default.png.
Steps:
  1. GET /api/projects
Expected Result: Project not present.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-API-009
Feature:         FEAT-006
Priority:        P1
Type:            EDGE
Preconditions:   Project with img containing 'placeholder' or with details missing.
Steps:
  1. GET /api/projects
Expected Result: Project not present.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-API-010
Feature:         FEAT-025
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. POST /api/csp-report with body { "csp-report": { "document-uri": "https://amank.co.in/..." } }
Expected Result: HTTP 204.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-026
Last Executed:   —
```
