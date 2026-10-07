# API test tools

## Tool: Node.js `node:test` (built-in)

```text
Tool:           Node.js built-in test runner
Purpose:        Run unit / API / integration tests without a third-party framework.
Installation:   Comes with Node 18+. Project uses Node 22.
Configuration:  None required.  Use the standard `node --test path/` runner.
How to Run:     node --test harness/automation/api/
                node harness/automation/scripts/smoke-public.mjs
Expected Output:TAP-formatted output; non-zero exit on failure.
Where Results Are Stored:
                Stdout by default. Persist runs under test-results/latest/.
Known Limitations:
                - No built-in mocking (use child_process or your own stubs).
                - No coverage report.
```

## Tool: `fetch` (built-in)

```text
Tool:           Node.js fetch (WHATWG)
Purpose:        Make HTTP requests to /api/* during tests.
Installation:   Built into Node 18+.
Configuration:  Set BASE_URL via env (default http://localhost:3000).
How to Run:     Use inside test scripts.
Expected Output: Response object with .status, .headers, .text() / .json().
Where Results Are Stored:
                Caller is responsible; in this harness, scripts dump raw
                responses to evidence/api-responses/.
Known Limitations:
                - Cookies are not persisted across calls; set them manually
                  when needed.
```

## Tool: Next.js dev server

```text
Tool:           next dev
Purpose:        Run the app for end-to-end tests.
Installation:   npm install (project dep).
Configuration:  .env file (Supabase, Scalekit, Cloudinary) or unset for offline mode.
How to Run:     npm run dev   (offline mode possible)
                npm run dev:turbo   (Turbopack)
Expected Output: HTTP server listening on :3000.
Where Results Are Stored:
                Server logs in evidence/logs/.
Known Limitations:
                - Cold start is slow on first request.
                - Webpack vs Turbopack may differ; CI should pin one.
```

## Tool: `next build`

```text
Tool:           next build
Purpose:        Production build, used for verifying the project compiles and
                passes type-check (with ignoreBuildErrors).
Installation:   Project dep.
Configuration:  tsconfig.json + next.config.mjs.
How to Run:     npm run build
Expected Output: Build artifacts in .next/.  Exits 0 on success.
Where Results Are Stored:
                Console output.
Known Limitations:
                - typescript.ignoreBuildErrors is true, so type errors do not fail the build.
```

## Tool: ESLint

```text
Tool:           ESLint 9 + eslint-config-next
Purpose:        Linting.
Installation:   Project dev dep.
Configuration:  eslint.config.mjs.
How to Run:     npm run lint
Expected Output: Lint report; non-zero on warnings/errors (Next preset).
Where Results Are Stored:
                Console output.
Known Limitations:
                - Two react-hooks rules are explicitly disabled for the motion layer.
```

## Tool: Scalekit SDK

```text
Tool:           @scalekit-sdk/node
Purpose:        OAuth library.
Installation:   Project dep.
Configuration:  SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET.
How to Run:     Imported in lib/scalekit.js.
Expected Output: getAuthorizationUrl(), refreshAccessToken(), getLogoutUrl().
Where Results Are Stored:
                In-memory.
Known Limitations:
                - Requires live credentials; not used by harness tests.
```
