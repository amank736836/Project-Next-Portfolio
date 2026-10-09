# Test data

This folder holds reusable test data definitions. **Never put real secrets here.**
Use placeholders and environment variables.

## Layout

```
test-data/
├── README.md           ← (this file)
├── fixtures/           ← JSON/YAML fixtures used by automated tests
├── valid/              ← valid input examples
├── invalid/            ← invalid input examples
├── edge-cases/         ← boundary value examples
└── sample-data/        ← additional samples (e.g. for bulk seeds)
```

## Placeholders

Always use placeholders. Example:

```json
{
  "email": "${TEST_USER_EMAIL}",
  "adminEmail": "${AUTHORIZED_ADMIN_EMAIL}"
}
```

## Sources of truth

- **Project seeds** — `sql/seeds/01_personal_info_seed.sql` etc. mirror the production
  data shape.
- **Offline seed** — `lib/supabase/offline-data.js` is a JS stand-in used when Supabase
  env vars are unset. Use it as a reference for shape.

## Categories of test data

| Category    | Where          | Examples                                                    |
|-------------|----------------|-------------------------------------------------------------|
| valid       | `valid/`       | a complete project (with GitHub/preview/language in details) |
| invalid     | `invalid/`     | project with `img = /assets/default.png`; empty skill title  |
| edge-cases  | `edge-cases/`  | 5 MB file; 5 MB + 1 byte; unicode/emoji in title; NULL rows  |
| fixtures    | `fixtures/`    | session JSON, hero image rows, resume row                    |
| large-data  | `edge-cases/`  | 1000-row project list (for perf)                             |
| auth        | `valid/`       | authorised email env value                                  |
| perf        | `edge-cases/`  | bulk fixtures used by perf scripts                            |

## Secrets

NEVER store in this folder:

- Real passwords
- API keys (real Cloudinary, Scalekit, Supabase)
- Access tokens
- Production data
- Personal sensitive data

Use environment variables. The harness reads from `process.env` only.
