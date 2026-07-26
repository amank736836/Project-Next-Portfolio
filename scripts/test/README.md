# Test/Setup Scripts

One-time setup and debugging scripts used during initial database configuration.

## Files

| File | Purpose |
|------|---------|
| `setup-db.cjs` / `setup-db.mjs` | Initial database schema creation (tables, indexes, migrations table, exec_sql function) |
| `fix-exec-sql.mjs` | Debugging: Fixed `exec_sql` function to handle DDL statements |
| `update-exec-sql.mjs` | Iterations on `exec_sql` function implementation |
| `fix-projects.mjs` | Added missing `created_at` column to projects table |
| `check-columns.mjs` | Debugging: List table columns to verify schema |
| `test-env.mjs` | Debugging: Verify environment variable loading |

## Usage

These are **not needed for normal operation**. The production migration system uses:
- `npm run db:watch` (auto-runs on `npm run dev`)
- `npm run db:migrate`
- `npm run db:seed`
- etc.

Keep these for reference if you need to:
- Recreate the database from scratch
- Debug `exec_sql` function issues
- Understand the initial setup process