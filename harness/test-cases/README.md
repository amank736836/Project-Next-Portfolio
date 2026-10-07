# Test Cases

Test cases are organized by feature. Each feature folder contains up to four files:

- `positive.md` — happy paths
- `negative.md` — invalid input, missing auth, missing fields
- `edge-cases.md` — boundary values
- `regression.md` — behaviours that must not regress

## How to use this template

Each test case is a self-contained block:

```text
Test Case ID:    TC-FEAT-NNN
Feature:         FEAT-XXX
Priority:        P0 | P1 | P2 | P3
Type:            FUNCTIONAL | NEGATIVE | EDGE | REGRESSION | SECURITY
Preconditions:   - list conditions

Steps:
  1. step
  2. step
  3. step

Test Data:       - inputs

Expected Result: what should happen

Actual Result:   (leave empty until executed)

Status:          NOT_RUN | PASS | FAIL | BLOCKED
Automation:      MANUAL | AUTOMATED | PARTIAL

Evidence:        path to evidence file

Related Requirement: REQ-XXX
Related Bug:     BUG-XXX (if any)
Last Executed:   yyyy-mm-dd
```

> Until a test is actually run, the status is `NOT_RUN`. Do not write `PASS` speculatively.

## Coverage

| Feature      | positive | negative | edge | regression | folder            |
|--------------|----------|----------|------|------------|-------------------|
| public-portfolio | ✅    | ✅      | ✅   | ✅         | `public-portfolio/` |
| admin-skills  | ✅       | ✅       | ✅   | ✅         | `admin-skills/`    |
| admin-projects| ✅       | ✅       | ✅   | ✅         | `admin-projects/`  |
| admin-resumes | ✅       | ✅       | ✅   | ✅         | `admin-resumes/`   |
| admin-hero-images | ✅   | ✅       | ✅   | ✅         | `admin-hero-images/` |
| admin-settings| ✅       | ✅       | ✅   | ✅         | `admin-settings/`  |
| admin-social-links | ✅  | ✅       | ✅   | ✅         | `admin-social-links/` |
| admin-education | ✅     | ✅       | ✅   | ✅         | `admin-education/` |
| admin-experience | ✅    | ✅       | ✅   | ✅         | `admin-experience/` |
| admin-personal-info | ✅ | ✅      | ✅   | ✅         | `admin-personal-info/` |
| public-projects | ✅     | ✅       | ✅   | ✅         | `public-projects/` |
| public-resume | ✅       | ✅       | ✅   | ✅         | `public-resume/`   |
| auth          | ✅       | ✅       | ✅   | ✅         | `auth/`            |
| api           | ✅       | ✅       | ✅   | ✅         | `api/`             |
| security      | ✅       | ✅       | ✅   | ✅         | (mostly in `api/` + `security.md`) |
