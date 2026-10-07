# Test Tools

This folder lists the tools the project ships with (or can be reused) for testing.

> We **prefer existing project tools** and avoid installing a new framework unless required.

## Index

| Tool                | Purpose                                | Folder                        |
|---------------------|----------------------------------------|-------------------------------|
| Node.js `node:test` | Built-in test runner (Node 22)         | `api/`, `ui/`, `database/`    |
| `fetch`             | Built-in HTTP client (Node 18+)        | `api/`, `ui/`                 |
| `pg`                | Postgres client (already in scripts/)  | `database/`                   |
| `next`              | Next.js dev/build commands             | `api/`, `ui/`                 |
| ESLint              | Linting                                | (root `npm run lint`)         |
| Custom HTTP probe   | `automation/scripts/smoke-public.mjs`  | (under `automation/scripts/`) |

> Subfolders contain one README per tool, listing: Purpose, Installation, Configuration,
> How to Run, Expected Output, Where Results Are Stored, Known Limitations.

## How to choose a tool

- **Unit / API / integration** → Node.js `node:test` (`automation/api/`, `automation/scripts/`).
- **Database** → `pg` from `scripts/package.json` (`automation/database/`).
- **UI** → `fetch` probes + HTML grep (`automation/ui/`).
- **Performance** → `node:test` + `performance.now()` (`automation/scripts/perf-*.mjs`).
- **Security** → manual + a small header inspector (`test-tools/security/`).

## Three execution environments

| Environment    | Description                                                                                       | Used by                          |
|----------------|---------------------------------------------------------------------------------------------------|----------------------------------|
| `local-offline`| `NEXT_PUBLIC_SUPABASE_URL` unset → offline client in `lib/supabase/offline-client.js`             | `automation/scripts/smoke-public.mjs` |
| `local-online` | Real env vars (Supabase, Scalekit, Cloudinary)                                                    | `automation/api/`, `automation/database/` |
| `staging`      | Vercel preview                                                                                    | (manual)                         |
| `production`   | Live                                                                                              | (manual)                         |
