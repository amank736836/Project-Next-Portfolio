# Automation

This folder holds the **executable tests** that the harness ships with. They use
Node's built-in `node:test` runner and `fetch` so that no new framework is introduced.

## Layout

```
automation/
├── scripts/                # Standalone smoke / performance / utility scripts
├── api/                    # node:test files covering API endpoints
├── ui/                     # node:test files for HTTP-level UI checks
├── database/               # node:test files for DB assertions (require live DB)
└── utilities/              # Helpers (env loading, evidence dir management, etc.)
```

## How to run

```bash
# Smoke (offline mode)
unset NEXT_PUBLIC_SUPABASE_URL
node harness/automation/scripts/smoke-public.mjs

# API tests (require a running dev server; offline mode acceptable for public)
node --test harness/automation/api/

# DB tests (require DATABASE_URL)
DATABASE_URL=... node --test harness/automation/database/

# UI tests
node --test harness/automation/ui/

# Utility helpers
node harness/automation/utilities/headers-check.mjs
```

## Conventions

- Each script prints a `RUN-YYYY-NN` header to `evidence/logs/<date>.log`.
- Test scripts never hardcode secrets.  Use environment variables.
- A script that fails writes a JSON to `test-results/latest/<run-id>-failed.json`.

## What is *not* in here (yet)

- No Playwright.  The project does not have it; the harness does not add it.
- No k6 / load testing.  See `test-tools/performance/README.md` for guidance.
- No mutation testing.
