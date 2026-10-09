# Architecture — Portfolio Next

> Source of truth: `proxy.js`, `app/`, `lib/`, `next.config.mjs`, `sql/`, `components/`.
> Last updated: 2026-10-07.

## High-level diagram

```
                    ┌────────────────────────────────────┐
                    │            Browser                  │
                    │  Public visitor   |   Admin owner   │
                    └─────────┬──────────────┬────────────┘
                              │ (public)     │ (admin)
                              ▼              ▼
              ┌──────────────────────────────────────────┐
              │      Next.js 16 (App Router)             │
              │                                          │
              │  proxy.js (Edge)                         │
              │  ├─ rate-limit (in-mem / Upstash Redis)  │
              │  ├─ CSRF (same-origin on mutating admin) │
              │  └─ auth gate for /admin & /api/admin    │
              │                                          │
              │  Route Handlers  app/api/**              │
              │  ├─ /api/auth/* (Scalekit OAuth)         │
              │  ├─ /api/projects, /api/info, ... (pub)  │
              │  └─ /api/admin/* (auth + authorized)     │
              │                                          │
              │  React Server / Client Components        │
              │  ├─ (public) — marketing site            │
              │  └─ (admin)  — content management        │
              └─────┬──────────┬──────────┬──────────────┘
                    │          │          │
                    ▼          ▼          ▼
              ┌─────────┐ ┌──────────┐ ┌──────────────┐
              │ Scalekit│ │ Supabase │ │ Cloudinary   │
              │ (OAuth) │ │ Postgres │ │ (images)     │
              │         │ │ + Storage│ │              │
              └─────────┘ └──────────┘ └──────────────┘
```

## Layers

### 1. Edge / Proxy layer

`proxy.js` (Next.js 16's name for the edge middleware) is the **first guard** every request hits.
It does *not* depend on database I/O, only cookies and headers.

Responsibilities:

- **Routing decisions** — match everything except `_next`, favicon, and common static files.
- **Rate limiting** — 60 req/min/IP/path/method. In-memory by default; skipped if Upstash
  Redis is configured.
- **CSRF** — every mutating request to `/api/admin/*`, `/api/auth/logout`, `/api/auth/refresh`
  must come from the same origin (verified by `Origin` or `Referer` header).
- **Auth gate** — pages under `/admin*` or `/dashboard` and APIs under `/api/admin/*` require
  a non-null session.
- **Authorization gate** — `session.user.email === AUTHORIZED_ADMIN_EMAIL`.

Note: the proxy does **not** check token expiry (it can't refresh from the edge). It just
checks presence. The Node runtime then refreshes the token if needed
(`lib/auth.js#isAuthenticated`).

### 2. Route handler / API layer

Next.js route handlers under `app/api/`. Pattern observed:

- **Public GETs** fetch with `createAdminClient()` (service role) and rely on
  row-level security to enforce access (`api/projects`, `api/info`, `api/resume*`).
- **Auth endpoints** manipulate the session cookie directly
  (`setSession`, `clearSession`, `setOAuthState`).
- **Admin endpoints** call `await isAuthenticated()` from `lib/auth.js` first; if it
  returns false, they respond `401` (the proxy already filtered obvious cases, but the
  route is the real authority because it also refreshes tokens).
- **Logging** — admin POSTs and many other handlers are wrapped in `withApiLogging`,
  which sanitizes headers/body (redacting `authorization`, `cookie`, `password`, etc.) and
  writes to `api_logs`.

### 3. Server components / data layer

Public pages (`app/(public)/`) are server components that call `createAdminClient()` and
query Supabase directly. They use `revalidate = 60` for ISR.

The admin shell is a **client component** (`app/(admin)/admin/layout.jsx`) with providers
for `Toast`, `Loading`, `Confirm`, plus a sidebar that tracks active tab from the URL.

### 4. UI / Motion layer

CSS modules per section (`Home.css`, `About.css`, etc.) and a global `motion.css` containing
all keyframes, tokens, and utility classes. Motion is disabled by `prefers-reduced-motion`
and by `<html class="no-motion">`.

A library of small interactive primitives in `components/ui/` (TiltCard, SplitText,
Magnetic, Marquee, etc.) compose into sections.

### 5. Data layer — Supabase + offline fallback

`lib/supabase/server.js` returns:

- `createClient()` (cookie-bound, anon key) for SSR fetches
- `createAdminClient()` (service role) for server-side reads/writes that bypass RLS

When `NEXT_PUBLIC_SUPABASE_URL` is unset, `isOfflineMode()` is true and an
`OfflineSupabaseClient` (a chainable query-builder stand-in) is returned. The stand-in is
backed by `lib/supabase/offline-data.js`, which mirrors the SQL seed shape.

### 6. Database

See `PROJECT_OVERVIEW.md` §7 for tables. Migrations are managed by
`scripts/src/commands/migrate.ts`, which:

- Loads `.env.local` and `.env`
- Tests connection via `pg`
- Compares on-disk migrations to `_metadata/file_hashes.json` (drift detection)
- Applies pending migrations inside a transaction
- Generates an automatic rollback script
- Records the migration in the bookkeeping table

## Data flow — admin write path (typical)

```
1. Admin clicks "Save project" in the browser
2. components/api/useApiCall fires a fetch to /api/admin/projects (POST)
3. Request hits proxy.js:
   - method is POST → applies rate-limit
   - Origin matches → CSRF passes
   - session present + email matches → auth passes
4. Route handler runs:
   - await isAuthenticated() re-validates (and may refresh)
   - sanitises body against ALLOWED_PROJECT_FIELDS
   - calls supabase.from('projects').insert([...])
   - response is wrapped by withApiLogging → api_logs row written
5. Browser receives JSON, updates UI via useApiCall's setState
```

## Data flow — public read path (typical)

```
1. Visitor opens /projects
2. Browser requests /api/projects (also ISR-cached for 60s)
3. proxy.js: path not protected → passes through
4. Route handler:
   - createAdminClient() (service role)
   - select('*').eq('is_hidden', false).order('id')
   - applies business filter: must have title, image, and details with
     GitHub/Preview/Language entries
   - responds with verified projects + cache-control headers
5. Browser renders PortfolioItem cards
```

## Data flow — OAuth login

```
1. /api/auth/login (GET):
   - generates 32-byte state (CSRF)
   - stores state in oauth_state cookie (10 min)
   - stores ?next= in auth_next cookie (10 min, same-origin only)
   - returns Scalekit authorize URL via NextResponse.redirect
2. Scalekit → /api/auth/callback?code=...&state=...:
   - compares state against cookie
   - exchanges code via scalekit.authenticateWithCode
   - decodes ID token to extract user
   - calls setSession(...) → scalekit_session cookie
   - redirects to /admin (or to auth_next)
3. Subsequent admin requests:
   - proxy.js: session present, email matches → pass
   - lib/auth.js#isAuthenticated: also refreshes if near expiry
```

## Security boundary summary

| Boundary               | Mechanism                                                                                  |
|------------------------|--------------------------------------------------------------------------------------------|
| Public vs admin        | `proxy.js` + `isAuthenticated()`                                                          |
| Authorised email       | `AUTHORIZED_ADMIN_EMAIL` env (default `amankarguwal0@gmail.com`)                          |
| CSRF on admin writes   | Same-origin `Origin`/`Referer` check in `proxy.js`                                         |
| Rate limiting          | In-memory map keyed by IP+path+method; Upstash Redis when configured                       |
| CSP                    | Set in `next.config.mjs`; reports sent to `/api/csp-report`                                |
| X-Frame-Options        | `SAMEORIGIN`                                                                              |
| Referrer-Policy        | `strict-origin-when-cross-origin`                                                         |
| Permissions-Policy     | Camera/mic/geo disabled                                                                    |
| Cookies                | `httpOnly`, `sameSite=lax`, `secure` in prod                                               |
| Secrets                | All sensitive env (`SERVICE_ROLE_KEY`, Cloudinary API secret, Scalekit secret) are server-only |
| Open redirect          | `?next=` in login restricted to same-origin relative paths                                 |
| Header sanitisation    | `api-logger` strips `authorization`, `cookie`, `x-api-key`, `x-forwarded-for`              |
| Body sanitisation      | `api-logger` masks keys containing `password`, `token`, `secret`, `api_key`, `authorization` |
| Input sanitisation     | `ALLOWED_*_FIELDS` allow-list in admin POST/PUT handlers                                   |
| RLS                    | Public-read or service-role-write on most tables                                          |
| File upload            | Type allow-list + 5 MB size cap; PDF only for resumes, JPEG/PNG/WebP for images             |

## Deployable units

There is **one** deployable unit: the Next.js application. It is stateless except for the
in-memory rate-limit map and the session cookie store. The database is managed by Supabase;
images and PDFs are stored in Cloudinary / Supabase Storage respectively.

## Open architectural questions

- **Redis rate-limiter** is wired but not deployed (`UPSTASH_REDIS_REST_URL` is unset).
- **Refresh race condition** in the proxy: only the Node handler refreshes; the proxy just
  passes the request with an expired token. This is intentional but worth testing.
- **CSP `unsafe-inline` / `unsafe-eval`** in `script-src` — necessary today for the motion
  layer + Next.js dev, but should be reviewed.
