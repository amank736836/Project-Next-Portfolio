# Negative Scenarios

| ID           | Feature                | Scenario                                                          | Related TC                  |
|--------------|------------------------|-------------------------------------------------------------------|-----------------------------|
| SCN-NEG-001  | FEAT-015 Skills        | POST /api/admin/skills with empty title returns 400                | TC-ADM-SK-010               |
| SCN-NEG-002  | FEAT-015 Skills        | POST /api/admin/skills with extra field strips it                  | TC-ADM-SK-011               |
| SCN-NEG-003  | FEAT-016 Projects      | POST /api/admin/projects without auth returns 401                  | TC-AUTH-005                 |
| SCN-NEG-004  | FEAT-016 Projects      | POST /api/admin/projects with extra field strips it                | TC-ADM-PR-010               |
| SCN-NEG-005  | FEAT-018 Resumes       | POST /api/admin/upload with non-PDF returns 400                    | TC-ADM-RS-010               |
| SCN-NEG-006  | FEAT-018 Resumes       | POST /api/admin/upload with PDF > 5 MB returns 400                 | TC-ADM-RS-011               |
| SCN-NEG-007  | FEAT-017 Hero images   | POST /api/admin/hero-images with non-image returns 400             | TC-ADM-HI-010               |
| SCN-NEG-008  | FEAT-017 Hero images   | POST /api/admin/hero-images with image > 5 MB returns 400          | TC-ADM-HI-011               |
| SCN-NEG-009  | FEAT-019 Settings      | POST /api/admin/settings without key returns 400                   | TC-ADM-ST-010               |
| SCN-NEG-010  | FEAT-019 Settings      | DELETE /api/admin/settings without key returns 400                 | TC-ADM-ST-011               |
| SCN-NEG-011  | FEAT-020 Social links  | PATCH /api/admin/social-links/<missing-id> returns 500            | TC-ADM-SL-010 (UNKNOWN)     |
| SCN-NEG-012  | FEAT-012 Auth          | /api/auth/login?next=https://evil.com redirects to /dashboard     | TC-AUTH-008                 |
| SCN-NEG-013  | FEAT-012 Auth          | /api/auth/login?next=//evil.com/path is rejected                   | TC-AUTH-008                 |
| SCN-NEG-014  | FEAT-012 Auth          | /api/auth/refresh without session returns 401                      | TC-AUTH-009                 |
| SCN-NEG-015  | FEAT-013 Authz         | /admin with non-authorised session redirects to /?error=...        | TC-AUTH-006                 |
| SCN-NEG-016  | FEAT-013 Authz         | /api/admin/* with non-authorised session returns 403              | TC-AUTH-007                 |
| SCN-NEG-017  | FEAT-006 Projects      | /api/projects with no rows returns [] (not 404)                    | TC-API-005                  |
| SCN-NEG-018  | FEAT-006 Projects      | /api/projects when DB errors returns 500                           | TC-API-006                  |
