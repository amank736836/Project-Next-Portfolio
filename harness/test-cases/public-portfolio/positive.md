# Public portfolio — positive cases

```text
Test Case ID:    TC-PUB-001
Feature:         FEAT-001 / FEAT-011
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Dev server running; offline mode OK (NEXT_PUBLIC_SUPABASE_URL unset).
Steps:
  1. GET /
Expected Result: HTTP 200, HTML containing "Aman" (or hero) and CTA buttons.
Status:          NOT_RUN
Automation:      AUTOMATED  (automation/scripts/smoke-public.mjs)
Evidence:        evidence/api-responses/root.html
Related Requirement: REQ-001, REQ-002
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-002
Feature:         FEAT-002
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /about
Expected Result: HTTP 200, HTML containing "About" and a list of personal info.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/about.html
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-003
Feature:         FEAT-003
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /skills
Expected Result: HTTP 200, HTML containing "Skills".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/skills.html
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-004
Feature:         FEAT-004
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /education
Expected Result: HTTP 200, HTML containing "Education".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/education.html
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-005
Feature:         FEAT-005
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /experience
Expected Result: HTTP 200, HTML containing "Experience".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/experience.html
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-006
Feature:         FEAT-006
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /projects
Expected Result: HTTP 200, HTML containing "Projects".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/projects.html
Related Requirement: REQ-001, REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-007
Feature:         FEAT-007
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /contact
Expected Result: HTTP 200, HTML containing "Contact" and Formspree form.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/contact.html
Related Requirement: REQ-027
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-008
Feature:         FEAT-008
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /resume
Expected Result: HTTP 200, HTML containing "Resume".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/resume.html
Related Requirement: REQ-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-009
Feature:         FEAT-027
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /test-ui
Expected Result: HTTP 200, no 5xx; HTML body non-empty.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/test-ui.html
Related Requirement: REQ-028
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-010
Feature:         FEAT-010
Priority:        P2
Type:            EDGE
Preconditions:   Offline mode; no `site_mode` row.
Steps:
  1. GET /
Expected Result: HTTP 200 (multi-mode default).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        —
Related Requirement: REQ-002
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-011
Feature:         FEAT-027 (error)
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /error
Expected Result: HTTP 200.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-117
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-012
Feature:         FEAT-027 (perm denied)
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /permission-denied
Expected Result: HTTP 200.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-117
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-013
Feature:         FEAT-012
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /login
Expected Result: HTTP 200 (then redirect to /api/auth/login).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/login.html
Related Requirement: REQ-007
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-014
Feature:         FEAT-027
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /robots.txt
Expected Result: HTTP 200, body includes "User-agent: *".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/robots.txt
Related Requirement: REQ-118
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-015
Feature:         FEAT-027
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running.
Steps:
  1. GET /sitemap.xml
Expected Result: HTTP 200, body starts with "<urlset".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/sitemap.xml
Related Requirement: REQ-118
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-016
Feature:         FEAT-027
Priority:        P3
Type:            FUNCTIONAL
Preconditions:   Dev server running; public/assets/ has any file.
Steps:
  1. GET /assets/<filename>
Expected Result: HTTP 200, Cache-Control contains "immutable".
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-102
Last Executed:   —
```
