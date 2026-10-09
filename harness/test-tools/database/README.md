# Database test tools

## Tool: `pg` (Postgres client)

```text
Tool:           pg 8.x (in scripts/package.json)
Purpose:        Connect to the database for assertions and migrations.
Installation:   Already a dev dep of scripts/.
Configuration:  DATABASE_URL or PG* env vars; otherwise scripts use
                scripts/src/lib/supabase.ts to test connection.
How to Run:     import { executeSql, testConnection } from '../lib/supabase.js';
Expected Output: { rows } or throws.
Where Results Are Stored:
                evidence/database-results/.
Known Limitations:
                - Requires a reachable Postgres instance.
```

## Tool: Migration runner (`scripts/src/commands/migrate.ts`)

```text
Tool:           In-house migration runner.
Purpose:        Apply, rollback, and inspect migrations.
Installation:   Project dep.
Configuration:  DATABASE_URL (or NEXT_PUBLIC_SUPABASE_URL + SERVICE_ROLE_KEY).
How to Run:     npm run db:status
                npm run db:migrate
                npm run db:rollback
                npm run db:seed
Expected Output: Human-readable report.
Where Results Are Stored:
                sql/_metadata/file_hashes.json + migration table in DB.
Known Limitations:
                - Rollback scripts must be authored manually for some migrations.
```

## Tool: Supabase CLI

```text
Tool:           supabase CLI
Purpose:        Provision local Postgres + Studio.
Installation:   NOT INSTALLED by default.  Install globally with
                `npm i -g supabase`.
Configuration:  supabase/config.toml (not present in this repo).
How to Run:     supabase start
Expected Output: Local Postgres on :54322, Studio on :54323.
Where Results Are Stored:
                Outside the repo; not in harness.
Known Limitations:
                - Not yet wired in the project.
```
