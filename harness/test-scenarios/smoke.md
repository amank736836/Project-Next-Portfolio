# Smoke Scenarios

> Goal: prove the system is alive. Run these first. Should be fast (≤ 30 s).
> Automated by: `automation/scripts/smoke-public.mjs` (offline mode)

| ID           | Scenario                                                  | Related TC                       | Status      |
|--------------|-----------------------------------------------------------|----------------------------------|-------------|
| SCN-SMK-001  | Public `/` returns 200                                    | TC-PUB-001                       | Drafted     |
| SCN-SMK-002  | Public `/about` returns 200                               | TC-PUB-002                       | Drafted     |
| SCN-SMK-003  | Public `/skills` returns 200                              | TC-PUB-003                       | Drafted     |
| SCN-SMK-004  | Public `/education` returns 200                          | TC-PUB-004                       | Drafted     |
| SCN-SMK-005  | Public `/experience` returns 200                         | TC-PUB-005                       | Drafted     |
| SCN-SMK-006  | Public `/projects` returns 200                            | TC-PUB-006                       | Drafted     |
| SCN-SMK-007  | Public `/contact` returns 200                             | TC-PUB-007                       | Drafted     |
| SCN-SMK-008  | Public `/resume` returns 200                              | TC-PUB-008                       | Drafted     |
| SCN-SMK-009  | Public `/test-ui` returns 200                             | TC-PUB-009                       | Drafted     |
| SCN-SMK-010  | Public `/api/projects` returns 200 (offline mode)         | TC-API-001                       | Drafted     |
| SCN-SMK-011  | Public `/api/info` returns 200 (offline mode)             | TC-API-002                       | Drafted     |
| SCN-SMK-012  | Public `/api/resume` returns 200 (offline mode)           | TC-API-003                       | Drafted     |
| SCN-SMK-013  | `/api/auth/validate` returns 200 with `authenticated:false` | TC-AUTH-001                    | Drafted     |
| SCN-SMK-014  | `/api/auth/login` redirects to Scalekit                   | TC-AUTH-002                      | Drafted     |
| SCN-SMK-015  | Unauthenticated GET `/api/admin/skills` returns 401       | TC-AUTH-005                      | Drafted     |
| SCN-SMK-016  | Unauthenticated GET `/admin` redirects to login           | TC-AUTH-006                      | Drafted     |

## Automation

```bash
# Run the public smoke script (offline mode)
NEXT_PUBLIC_SUPABASE_URL= node harness/automation/scripts/smoke-public.mjs
```

The script returns 0 when every check passes.
