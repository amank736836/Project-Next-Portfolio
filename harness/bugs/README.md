# Bugs

This folder tracks issues found by tests, code review, or in production.

## Layout

```
bugs/
├── README.md           ← (this file)
├── open/               ← unresolved bugs
├── resolved/           ← fixed + verified bugs
└── known-issues.md     ← known issues that may not have a fix yet
```

## Bug ID format

`BUG-NNN` — monotonically increasing.

## Bug template

```text
Bug ID:        BUG-NNN
Title:         <short, descriptive>
Severity:      S0 (blocker) | S1 (critical) | S2 (major) | S3 (minor) | S4 (trivial)
Priority:      P0 | P1 | P2 | P3
Feature:       FEAT-XXX
Environment:   local-offline | local-online | staging | production
Preconditions: list of preconditions

Steps to Reproduce:
  1. ...
  2. ...
  3. ...

Expected:    <what should happen>
Actual:      <what actually happened>
Reproducible: YES | NO | INTERMITTENT
Evidence:    <path to evidence file>

Root Cause:  <analysis>
Fix:         <PR/commit/description>
Regression Test: TC-XXX (added to harness)

Status:      OPEN | IN_PROGRESS | FIXED | VERIFIED | CLOSED
```

## How to record a new bug

1. Create `bugs/open/BUG-NNN-<slug>.md` using the template.
2. Add a `BUG-NNN` row to `reports/coverage.md` → Critical Bugs.
3. If a regression test is needed, add it to `test-cases/<feature>/<type>.md` and link.
