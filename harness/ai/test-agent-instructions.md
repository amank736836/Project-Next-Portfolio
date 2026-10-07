# Test Agent Instructions

> An AI agent (any model) should read this file **end-to-end** before testing
> the Portfolio Next project.  Following this procedure ensures consistent,
> evidence-backed results.

## 1. Understand the project

Start by reading these files **in this order**:

1. `harness/README.md` — overall layout and quick start.
2. `harness/PROJECT_OVERVIEW.md` — what the project is and who uses it.
3. `harness/ARCHITECTURE.md` — how it's wired (proxy, route handlers, DB).
4. `harness/TESTING_STRATEGY.md` — how tests are organised.
5. `harness/requirements/` — the requirements you are testing against.

> If the agent has read-only access to source files (`app/`, `lib/`, `sql/`, `proxy.js`),
> cross-check facts against code.  Never trust the harness over the source.

## 2. Where feature documentation lives

For every feature, open `harness/features/<feature>/README.md`.  Each has the
same template (Purpose, Entry Point, Inputs, Outputs, Business Rules, …).

If a feature is missing, **add it**:

1. Pick the next free `FEAT-NNN`.
2. Add a row to `harness/features/README.md`.
3. Create the folder + README using the template.

## 3. Where test scenarios live

Open `harness/test-scenarios/<category>.md`.  Each scenario has a stable ID
(`SCN-xxx`) and a reference to one or more test cases.

When the agent decides to add a new scenario, append it to the right category
and pick the next free scenario ID in that prefix (`SCN-SMK-`, `SCN-FUN-`, …).

## 4. How to run tests

1. Make sure dependencies are installed: `npm install`.
2. Start the dev server:
   - For **offline mode**: `unset NEXT_PUBLIC_SUPABASE_URL && npm run dev`.
   - For **online mode**: configure `.env` first.
3. Run the smoke script: `node harness/automation/scripts/smoke-public.mjs`.
4. Run the header check: `node harness/automation/scripts/headers-check.mjs`.
5. Run the API tests: `node --test harness/automation/api/`.
6. Run the UI tests: `node --test harness/automation/ui/`.
7. (Optional) Run DB tests: `DATABASE_URL=... node --test harness/automation/database/`.

## 5. How to generate new test cases

1. Find the feature in `harness/features/`.
2. Open `harness/test-cases/<feature>/positive.md` (or the right `<type>.md`).
3. Pick the next free TC ID for that feature.
4. Use the template at the top of the file.
5. Make the test **specific** (no "check login").
6. Link the requirement (`REQ-xxx`) and feature (`FEAT-xxx`).
7. Mark the new test as `NOT_RUN` and link to automation when present.

## 6. How to execute tests

For each test case:

1. Read the **Preconditions** and ensure they hold.
2. Execute the **Steps** in order.
3. Capture evidence:
   - HTTP probes → `evidence/api-responses/<test-id>.json` (or `.headers` / `.body`).
   - Console / server logs → `evidence/logs/<test-id>.log`.
   - DB output → `evidence/database-results/<test-id>.txt`.
4. Compare **Actual** with **Expected**.
5. Mark the status: `PASS` / `FAIL` / `BLOCKED`.

## 7. How to record results

After every run, create or update `test-results/latest/RUN-yyyy-nn.md` using
`test-results/RUN-TEMPLATE.md`.  Include:

- Total / Passed / Failed / Blocked / Not Run counts.
- Critical failures.
- Evidence file paths.

Update `TESTING_STATUS.md` and `reports/coverage.md` to reflect the new totals.

## 8. How to collect evidence

Use the helpers in `automation/utilities/env.mjs`:

```js
import { writeEvidence, PATHS } from '../utilities/env.mjs';
writeEvidence('api', 'TC-PUB-001-root.html', body);
```

The helper writes to `harness/evidence/<kind>/<name>`.

## 9. How to identify bugs

A bug is a deviation between **Expected** (the test case) and **Actual** (what happened).
When that happens:

1. Capture the evidence.
2. Create `bugs/open/BUG-NNN-<slug>.md` using the template in `bugs/README.md`.
3. Add a row to `bugs/open/README.md` and `bugs/known-issues.md` (if broadly relevant).
4. Update `reports/coverage.md` → Critical Bugs and `reports/release-readiness.md`.

If the bug is a security issue, escalate immediately.  If it breaks a release,
flag `READY` → `NOT READY` in `reports/release-readiness.md`.

## 10. How to update documentation

- **Found a missing feature?** Add a feature README.
- **Found a missing test case?** Add it to the right `test-cases/<feature>/<type>.md`.
- **Found a missing requirement?** Add it to `requirements/functional-requirements.md`
  with the next free `REQ-xxx`.
- **Found a missing rule?** Add it to `requirements/business-rules.md` with the
  next free `BR-xxx`.
- **Updated test cases?** Reflect in `reports/traceability.md`.

## 11. How to avoid modifying production code

**Do not modify production code** unless it is required to enable or run a test.
If a change is needed:

1. Document the rationale in the test case.
2. Create a separate "scaffolding" branch.
3. Ask the user before merging.

If a test depends on a fix, file a bug first (BUG-NNN) and link it to the
regression test.

## The golden loop

```text
Analyze → Plan → Test → Record → Verify → Report
```

Always end with a `RUN-` entry.  Never claim `PASS` without evidence.
