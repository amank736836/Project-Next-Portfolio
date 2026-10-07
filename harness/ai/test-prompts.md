# Test prompts

> Copy/paste these prompts when asking another AI agent to perform a specific task.
> Each prompt is self-contained and references the relevant harness files.

## Prompt 1 — Understand the project

```text
You are testing the Portfolio Next project.  Read the following files in this
order and produce a one-paragraph summary of the project, its users, and the
primary business workflows:

  1. harness/README.md
  2. harness/PROJECT_OVERVIEW.md
  3. harness/ARCHITECTURE.md
  4. harness/TESTING_STRATEGY.md

Do not modify any files.  Do not invent information.
```

## Prompt 2 — Run the smoke suite

```text
Execute the public smoke test for the Portfolio Next project.  Steps:

  1. cd to the project root.
  2. `unset NEXT_PUBLIC_SUPABASE_URL` to enable offline mode.
  3. `npm install` (if not already).
  4. `npm run dev` in a background process.
  5. Wait until http://localhost:3000/ returns 200.
  6. Run: `node harness/automation/scripts/smoke-public.mjs`
  7. Save the JSON output to `harness/test-results/latest/smoke-<date>.json`.
  8. Run: `node harness/automation/scripts/headers-check.mjs`
  9. Save the JSON output to `harness/test-results/latest/headers-<date>.json`.
 10. Update `harness/TESTING_STATUS.md` and `harness/reports/coverage.md`.
 11. Create or update `harness/test-results/latest/RUN-yyyy-nn.md` with the
     summary.

Do not claim PASS unless the script exited 0.  Capture the full command output.
```

## Prompt 3 — Generate a new test case

```text
Generate a new test case for the Portfolio Next project.  Follow
`harness/ai/test-generation-rules.md`.

Topic: <describe the behaviour to test>
Feature: <FEAT-xxx name>
Test type: positive | negative | edge | regression

Add the test to the right file in `harness/test-cases/<feature>/<type>.md`.
Use the next free TC ID for that feature.  Link the requirement
(REQ-xxx) and feature (FEAT-xxx).  Status starts as NOT_RUN.
```

## Prompt 4 — File a new bug

```text
File a new bug in the Portfolio Next project.  Steps:

  1. Use the template in `harness/bugs/README.md`.
  2. Save the file as `harness/bugs/open/BUG-NNN-<slug>.md` (next free ID).
  3. Add a row to `harness/bugs/open/README.md`.
  4. If the bug is broadly relevant, add an entry to `harness/bugs/known-issues.md`.
  5. Update `harness/reports/coverage.md` → Critical Bugs.
  6. Update `harness/reports/release-readiness.md` if the bug affects release.

Do not modify production code.  Do not claim the bug is fixed unless you can
demonstrate it.
```

## Prompt 5 — Add a new feature

```text
Add a new feature to the Portfolio Next project harness.  Steps:

  1. Pick the next free FEAT-NNN.
  2. Add a row to `harness/features/README.md`.
  3. Create `harness/features/<feature>/README.md` using the template.
  4. Create at least one test-case file under `harness/test-cases/<feature>/`.
  5. Link the new feature in `harness/reports/traceability.md`.

Do not invent behaviour.  If information is unknown, mark it
`UNKNOWN / REQUIRES VALIDATION`.
```

## Prompt 6 — Add a new requirement

```text
Add a new requirement to the Portfolio Next project harness.  Steps:

  1. Pick the next free REQ-NNN in the right range:
     - REQ-001..099 functional
     - REQ-100..199 non-functional
     - REQ-200..299 business rules (use BR-xxx in `business-rules.md` instead)
  2. Add the requirement to the right file under `harness/requirements/`.
  3. Link the new requirement in `harness/reports/traceability.md`.
  4. Update `harness/reports/coverage.md`.

Mark anything you cannot verify with `UNKNOWN / REQUIRES VALIDATION`.
```

## Prompt 7 — Security header audit

```text
Run a security header audit for the Portfolio Next project.  Steps:

  1. `npm run dev` (offline mode OK).
  2. For each path in `harness/automation/api/headers.test.mjs`:
       - GET the path.
       - Assert: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
         Permissions-Policy, Reporting-Endpoints.
       - Assert: X-Powered-By is absent.
  3. Save the result to `harness/test-results/latest/headers-<date>.json`.
  4. Update `harness/TESTING_STATUS.md`.

Use `node --test harness/automation/api/headers.test.mjs`.
```

## Prompt 8 — Plan a release

```text
Plan a release of the Portfolio Next project.  Steps:

  1. Read `harness/reports/release-readiness.md`.
  2. Read every `RUN-*.md` in `harness/test-results/historical/`.
  3. List the open critical bugs (`harness/bugs/open/`).
  4. Decide: READY | READY WITH RISKS | NOT READY.
  5. Update `harness/reports/release-readiness.md` with the new recommendation.
  6. Justify each blocker in the "Deployment risks" section.
```
