# Project Harness — Portfolio Next

This `harness/` folder is the **single source of truth** for understanding, testing, and validating the
**Portfolio Next** application (Next.js 16 App Router · React 19 · Supabase · Scalekit OAuth · Cloudinary).

It is designed so that:

- A **new developer** can read the docs and quickly understand what the project does.
- A **tester** can find every feature, scenario, test case, and evidence artifact in one place.
- An **AI agent** can use the same harness to plan, generate, execute, and report tests.

> ⚠️ **Do not invent information.** Every claim in this harness is grounded in source code,
> configuration, or actual test execution. Where data is unknown, the harness marks it
> `UNKNOWN / REQUIRES VALIDATION`.

---

## What is in this harness?

```
harness/
├── README.md                  ← (this file) navigation + quick start
├── PROJECT_OVERVIEW.md        ← business, users, tech stack, deployment
├── ARCHITECTURE.md            ← modules, layers, data flow, security boundaries
├── TESTING_STRATEGY.md        ← how this project is / should be tested
├── TESTING_STATUS.md          ← current state, last run, gaps
│
├── requirements/              ← functional, non-functional, business rules
├── features/                  ← one folder per feature, with consistent template
├── test-scenarios/            ← smoke, regression, functional, negative, edge, etc.
├── test-cases/                ← detailed test cases per feature
├── test-tools/                ← API, UI, DB, performance, security tooling
├── automation/                ← executable scripts (Node.js, raw HTTP, etc.)
├── test-data/                 ← fixtures and reusable inputs
├── test-results/              ← latest + historical execution reports
├── evidence/                  ← screenshots, captured API responses, DB output
├── bugs/                      ← open/resolved issues, with reproduction info
├── reports/                   ← coverage, traceability, release readiness
└── ai/                        ← instructions for AI testing agents
```

---

## Quick Start (Human or AI)

1. **Read context**
   - `PROJECT_OVERVIEW.md` — what the app is and who uses it
   - `ARCHITECTURE.md` — how it is wired together
   - `TESTING_STRATEGY.md` — how to test it
2. **Identify the feature** you want to verify
   - `features/README.md` lists every documented feature with a stable ID (`FEAT-xxx`)
3. **Pick a scenario**
   - `test-scenarios/<type>.md` (e.g. `smoke.md`, `api.md`, `security.md`)
4. **Use or generate test cases**
   - `test-cases/<feature>/` for the canonical cases
   - `ai/test-generation-rules.md` to author new ones
5. **Run automated tests**
   - `automation/scripts/` contains reusable Node.js test scripts (no extra framework needed)
   - All secrets come from environment variables — see `test-data/README.md`
6. **Capture evidence & results**
   - Save API responses in `evidence/api-responses/`
   - Save logs in `evidence/logs/`
   - Append a run report in `test-results/latest/`
7. **Update traceability & coverage**
   - `reports/traceability.md` and `reports/coverage.md`

---

## ID Conventions

The harness uses a single ID convention so requirements, features, scenarios, test cases,
runs, and bugs are linkable:

| Prefix | Meaning              | Example       |
|--------|----------------------|---------------|
| REQ-   | Requirement          | `REQ-001`     |
| FEAT-  | Feature              | `FEAT-007`    |
| SCN-   | Test scenario        | `SCN-021`     |
| TC-    | Test case            | `TC-104`      |
| BUG-   | Bug / issue          | `BUG-003`     |
| RUN-   | Test execution       | `RUN-2026-01` |

> The traceability matrix in `reports/traceability.md` shows how they connect.

---

## How do I… ?

| I want to…                                | Go to                                              |
|-------------------------------------------|----------------------------------------------------|
| Understand the project                    | `PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`           |
| See all features                          | `features/README.md`                               |
| Add a new feature doc                     | `features/<feature>/README.md` using the template  |
| Add a new test case                       | `test-cases/<feature>/<type>.md`                   |
| Run automated tests                       | `automation/scripts/README.md`                     |
| Use / configure a tool                    | `test-tools/<category>/README.md`                  |
| Record a bug                              | `bugs/README.md`                                   |
| Update coverage                           | `reports/coverage.md`                              |
| Check release readiness                   | `reports/release-readiness.md`                     |
| Use this harness as an AI agent           | `ai/test-agent-instructions.md`                    |
| Find reusable test data                   | `test-data/README.md`                              |
| Inspect evidence of a previous run        | `evidence/` and `test-results/latest/`             |

---

## Golden rules (also see Section 18 of the task)

1. **No inventing information.** Mark unknowns with `UNKNOWN / REQUIRES VALIDATION`.
2. **No duplicating content.** Use links/references between documents.
3. **No secrets in the repo.** Use `.env` and placeholders like `${TEST_USER_EMAIL}`.
4. **No fake test results.** Use `NOT_EXECUTED` until a test really ran.
5. **Reuse existing project tools** (Next.js route handler tests, Supabase CLI, the in-tree
   `scripts/src/commands/*` migration runner, ESLint). Don't add a new framework unless the
   project needs it.
6. **Keep IDs stable.** Never rename an existing `FEAT-001` — only deprecate and link forward.

---

## Test environments

The application supports three execution modes for tests:

1. **Online (production-like)** — real Supabase, real Scalekit, real Cloudinary.
2. **Offline preview** — when `NEXT_PUBLIC_SUPABASE_URL` is unset, `lib/supabase/offline-client.js`
   serves seed data from `lib/supabase/offline-data.js`. This is the recommended mode for
   UI-only tests that do not need database state.
3. **Migration runner** — `npm run db:status` / `db:migrate` / `db:seed` use
   `scripts/src/commands/*` against the configured database.

See `test-tools/README.md` for how to choose the right environment for a given test.

---

## Status snapshot

> Maintained in `TESTING_STATUS.md`. Refresh it whenever a test run completes.

- **Features documented:** 21
- **Requirements documented:** 28
- **Test scenarios catalogued:** 11 categories
- **Test cases drafted:** initial draft only
- **Automated tests shipped with harness:** 1 (offline smoke)
- **Tests executed in this harness:** see `test-results/latest/`

---

## License

This harness is part of the Portfolio Next repository (MIT license).
