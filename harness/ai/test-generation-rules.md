# Test generation rules

> These rules apply whenever an AI agent (or a human) generates a new test case for
> the Portfolio Next project.  Following them keeps the harness consistent.

## 1. Format

Every test case follows the canonical template.  See `harness/test-cases/README.md`.

```text
Test Case ID:    TC-<feature-prefix>-NNN
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

## 2. IDs

- Use the next free ID for the feature prefix.
- TC prefixes: `TC-PUB-`, `TC-AUTH-`, `TC-API-`, `TC-ADM-`, `TC-SEC-`,
  `TC-DB-`, `TC-PERF-`.
- Never reuse an existing ID.
- If a test is removed, mark it `DEPRECATED` in the file, do not delete it.

## 3. Specificity

Bad: "Check login."
Good: "Verify that a valid user who authenticates with valid credentials is
       redirected to the admin dashboard."

Every step must be **actionable**: a precise HTTP request, a SQL query, or a UI
interaction.

## 4. Preconditions

List the conditions that must hold before the test starts.  Examples:

- Server running on `localhost:3000`.
- Offline mode (no Supabase).
- Admin authenticated.
- A specific row exists in the DB.
- A cookie is set.

## 5. Steps

- Numbered list.
- Each step is a single, observable action.
- Avoid "click around" — be precise.

## 6. Test data

- Use placeholders.  Reference fixtures in `harness/test-data/`.
- Do not embed real PII or secrets.

## 7. Expected result

- Concrete, observable, verifiable.
- Include the HTTP status code, the body shape, or the side effect.
- If multiple outcomes are acceptable, list them.

## 8. Status rules

| Status      | When                                                              |
|-------------|-------------------------------------------------------------------|
| `NOT_RUN`   | The test has never been executed.  Default.                       |
| `PASS`      | Actual matches Expected.  Evidence file present.                  |
| `FAIL`      | Actual differs from Expected.  Evidence + bug filed.              |
| `BLOCKED`   | Cannot run due to a pre-existing failure.                         |

> An agent must NEVER set `PASS` without an evidence file.

## 9. Automation

- `MANUAL` — only humans can run it (browser interactions, visual review).
- `AUTOMATED` — there is a script in `automation/` that runs it.
- `PARTIAL` — part of the flow is automated.

## 10. Evidence

Every test case must reference at least one evidence file.  The path is relative
to the project root:

- `evidence/api-responses/<file>`
- `evidence/logs/<file>`
- `evidence/database-results/<file>`
- `evidence/screenshots/<file>`

If a test is `NOT_RUN`, the evidence is `-` (not applicable).

## 11. Traceability

Always set `Related Requirement`.  When a bug is filed, add `Related Bug`.

## 12. Language

- Use present tense for steps.
- Use a single sentence for the expected result.
- Avoid jargon not present in the project's README.

## 13. No invented behaviour

If the test depends on a feature or rule that is not in the codebase, mark the
relevant section as `UNKNOWN / REQUIRES VALIDATION` and stop.  Do not invent.
