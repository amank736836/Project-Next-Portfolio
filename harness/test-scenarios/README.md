# Test Scenarios

This folder catalogs every **category** of test scenario. Each scenario file lists the
scenarios by stable ID (`SCN-xxx`) and links to one or more `TC-xxx` test cases in
`test-cases/<feature>/`.

## Index

| Category          | File                                   | Description                                            |
|-------------------|----------------------------------------|--------------------------------------------------------|
| Smoke             | [smoke.md](./smoke.md)                 | Critical public + auth pages return 200                |
| Functional        | [functional.md](./functional.md)       | Each feature's happy path                              |
| Regression        | [regression.md](./regression.md)       | Existing behaviour that must not break                 |
| Negative          | [negative.md](./negative.md)           | Invalid input, missing input, unauthorized access     |
| Edge              | [edge-cases.md](./edge-cases.md)       | Boundary values, large data, special chars            |
| Integration       | [integration.md](./integration.md)     | Page → API → DB, auth → API, API → DB                 |
| API               | [api.md](./api.md)                     | Every public + admin API route                         |
| Database          | [database.md](./database.md)           | Migrations, RLS, triggers, constraints                |
| UI                | [ui.md](./ui.md)                       | Page-level behaviour (server-side)                    |
| Performance       | [performance.md](./performance.md)     | Response time / throughput budgets                    |
| Security          | [security.md](./security.md)           | CSP, CSRF, RLS, IDOR, open redirect, authz bypass     |

## How to use

1. Pick a category.
2. Find a scenario by ID (e.g. `SCN-API-007`).
3. Open the linked `test-cases/<feature>/<type>.md` to see the test cases.
4. Run any automated cases in `automation/`.
5. Record results in `test-results/latest/`.

## Scenario ID convention

| Prefix       | Meaning                                       |
|--------------|-----------------------------------------------|
| `SCN-SMK-`   | Smoke                                         |
| `SCN-FUN-`   | Functional                                    |
| `SCN-REG-`   | Regression                                    |
| `SCN-NEG-`   | Negative                                      |
| `SCN-EDGE-`  | Edge / boundary                               |
| `SCN-INT-`   | Integration                                   |
| `SCN-API-`   | API-level                                     |
| `SCN-DB-`    | Database                                      |
| `SCN-UI-`    | UI / page-level                               |
| `SCN-PERF-`  | Performance                                   |
| `SCN-SEC-`   | Security / VAPT                               |
