# Edge Case Scenarios

| ID            | Feature              | Scenario                                                              | Related TC                |
|---------------|----------------------|-----------------------------------------------------------------------|---------------------------|
| SCN-EDGE-001  | FEAT-006 Projects    | Project with title but no `img` is filtered out                       | TC-API-007                |
| SCN-EDGE-002  | FEAT-006 Projects    | Project with `img = /assets/default.png` is filtered out               | TC-API-008                |
| SCN-EDGE-003  | FEAT-006 Projects    | Project with `img` containing "placeholder" is filtered out            | TC-API-009                |
| SCN-EDGE-004  | FEAT-006 Projects    | Project with details missing github/preview/language is filtered out   | TC-API-009                |
| SCN-EDGE-005  | FEAT-008 Resume      | No active resume → /api/resume returns synthetic fallback              | TC-API-003                |
| SCN-EDGE-006  | FEAT-008 Resume      | Active resume URL broken → /api/resume/view falls back to local file   | TC-API-004                |
| SCN-EDGE-007  | FEAT-015 Skills      | Skill percentage = 0 is allowed; = 101 is rejected (DB CHECK)         | TC-ADM-SK-012             |
| SCN-EDGE-008  | FEAT-017 Hero images | Two rows set `is_hero = true` → only the latest is true                | TC-ADM-HI-012             |
| SCN-EDGE-009  | FEAT-010 Site mode   | `site_mode` row missing → defaults to 'multi'                          | TC-PUB-010                |
| SCN-EDGE-010  | FEAT-012 Auth        | state cookie missing on callback → error page                          | TC-AUTH-010               |
| SCN-EDGE-011  | FEAT-012 Auth        | state cookie mismatch on callback → error page                          | TC-AUTH-011               |
| SCN-EDGE-012  | FEAT-014 Dashboard   | Session missing → redirect to /api/auth/login                           | TC-AUTH-006               |
| SCN-EDGE-013  | FEAT-025 CSP reports | Production URL mismatched report filtered as noise                      | TC-SEC-009                |
| SCN-EDGE-014  | FEAT-025 CSP reports | Extension source-file filtered as noise                                 | TC-SEC-010                |
| SCN-EDGE-015  | FEAT-018 Upload      | Boundary file size 5 MB accepted, 5 MB + 1 byte rejected                | TC-ADM-RS-011             |
| SCN-EDGE-016  | FEAT-018 Upload      | SVG image accepted for hero, but not for resume                         | TC-ADM-HI-013             |
| SCN-EDGE-017  | FEAT-019 Settings    | Boolean setting stored as text "true"/"false"                          | TC-ADM-ST-012             |
| SCN-EDGE-018  | FEAT-015 Skills      | PATCH with id of non-existent row returns 500 (Supabase semantics)      | TC-ADM-SK-013             |
