# Security / VAPT test tools

> The project has no SAST / DAST tool installed. Security is verified by:
> 1. **Header inspection** (automated via fetch).
> 2. **Manual review** of the security checklist below.
> 3. **Code grep** for secrets (manual).

## Tool: Header inspector (Node fetch)

```text
Tool:           node:test + fetch (in automation/scripts/headers-check.mjs)
Purpose:        Assert that every response carries CSP, XCTO, XFO, Referrer-Policy,
                Permissions-Policy, Reporting-Endpoints.
Installation:   Built-in.
Configuration:  BASE_URL env.
How to Run:     node harness/automation/scripts/headers-check.mjs
Expected Output: PASS/FAIL per header.
Where Results Are Stored:
                evidence/api-responses/headers.txt
Known Limitations:
                - Same-origin / auth-protected routes need a session to test.
```

## Manual security checklist

### Authentication & session
- [ ] Scalekit redirect URI matches the configured value (`lib/config.js`).
- [ ] `state` cookie is `httpOnly`, `secure` (prod), `sameSite=lax`.
- [ ] `scalekit_session` cookie is `httpOnly`, `secure` (prod), `sameSite=lax`.
- [ ] Refresh token rotation is observed in `api_logs`.
- [ ] Token refresh buffer (5 s) is sufficient.
- [ ] No JWT secret in `process.env` (Scalekit signs).

### Authorisation
- [ ] `AUTHORIZED_ADMIN_EMAIL` is set in production.
- [ ] All `/api/admin/*` and `/admin/*` paths return 401/redirect without session.
- [ ] Non-authorised email returns 403/redirect.
- [ ] No code path bypasses `isAuthenticated()`.

### CSRF
- [ ] Cross-origin POST to `/api/admin/*` is rejected by `proxy.js`.
- [ ] Cross-origin POST to `/api/auth/logout`, `/api/auth/refresh` is rejected.
- [ ] GET requests are not CSRF-checked (intentional).

### Rate limiting
- [ ] 61st request within 60 s returns 429.
- [ ] 429 carries `Retry-After`.
- [ ] In production, Upstash Redis is configured (replace in-memory store).

### Security headers
- [ ] `Content-Security-Policy` is present and matches `next.config.mjs`.
- [ ] `X-Frame-Options: SAMEORIGIN` is set.
- [ ] `X-Content-Type-Options: nosniff` is set.
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` is set.
- [ ] `Permissions-Policy` disables camera/mic/geo.
- [ ] `X-Powered-By` is not present.

### File uploads
- [ ] Resume: only `application/pdf` accepted.
- [ ] Hero / image: only `image/jpeg|png|webp` accepted.
- [ ] Size cap 5 MB enforced.

### Input validation
- [ ] Skills / projects admin handlers strip unknown fields (`ALLOWED_*_FIELDS`).
- [ ] `personal_info.key` is treated as a text key (not SQL).

### Logging
- [ ] `api_logs` row exists for every wrapped request.
- [ ] `authorization`, `cookie`, `x-api-key`, `x-forwarded-for` are stripped.
- [ ] `password`, `token`, `secret`, `api_key`, `authorization` body keys are masked.

### CSP reports
- [ ] `/api/csp-report` returns 204.
- [ ] Production reports from a different origin are filtered as noise.
- [ ] Dev environment reports are filtered as noise.

### Build / secrets
- [ ] `.next/` and `public/` are scanned for `SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, `SCALEKIT_CLIENT_SECRET`.
- [ ] Build artifacts in source control: none (covered by `.gitignore`).

## Tool: `npm audit`

```text
Tool:           npm audit
Purpose:        Check for known CVEs in dependencies.
Installation:   Built into npm.
Configuration:  None.
How to Run:     npm audit
Expected Output: List of advisories.
Where Results Are Stored:
                Stdout.
Known Limitations:
                - May not catch application-level flaws.
```
