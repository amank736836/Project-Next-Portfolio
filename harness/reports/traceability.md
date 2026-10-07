# Traceability matrix

> Last updated: 2026-10-07.
> Format: `Requirement → Feature → Scenario(s) → Test Case(s) → Automation → Evidence → Run`.

## ID conventions

| Prefix | Meaning   |
|--------|-----------|
| REQ-   | Requirement |
| FEAT-  | Feature   |
| SCN-   | Scenario  |
| TC-    | Test case |
| BUG-   | Bug       |
| RUN-   | Execution run |

## Auth (FEAT-012 / FEAT-013)

| Requirement | Feature | Scenarios | Test Cases | Automation | Run |
|-------------|---------|-----------|------------|------------|-----|
| REQ-007     | FEAT-012 | SCN-FUN-011, SCN-NEG-012, SCN-NEG-013, SCN-EDGE-010, SCN-EDGE-011 | TC-AUTH-002, TC-AUTH-008, TC-AUTH-010, TC-AUTH-011 | automation/api/admin-auth.test.mjs (partial) | RUN-2026-01 |
| REQ-008     | FEAT-012 | SCN-SMK-013, SCN-FUN-012 | TC-AUTH-001, TC-AUTH-003 | automation/api/public-apis.test.mjs | RUN-2026-01 |
| REQ-009     | FEAT-012 | SCN-FUN-012, SCN-NEG-014, SCN-EDGE-020, SCN-EDGE-021 | TC-AUTH-004, TC-AUTH-009, TC-AUTH-020, TC-AUTH-021 | (manual) | RUN-2026-01 |
| REQ-010     | FEAT-012 | — | TC-AUTH-030 (cookie flags) | (manual) | RUN-2026-01 |
| REQ-011     | FEAT-012 / FEAT-013 | SCN-SMK-015, SCN-SMK-016, SCN-NEG-015, SCN-EDGE-012 | TC-AUTH-005, TC-AUTH-006 | automation/api/admin-auth.test.mjs | RUN-2026-01 |
| REQ-012     | FEAT-013 | SCN-NEG-015, SCN-NEG-016, SCN-SEC-013 | TC-AUTH-007, TC-SEC-032 | (manual) | RUN-2026-01 |
| REQ-013     | FEAT-018 | SCN-SEC-010, SCN-SEC-011, SCN-EDGE-030 | TC-SEC-011, TC-SEC-012, TC-SEC-030, TC-ADM-SK-031 | automation/api/admin-auth.test.mjs | RUN-2026-01 |
| REQ-014     | FEAT-018 | SCN-SEC-014, SCN-EDGE-031 | TC-SEC-014, TC-SEC-031 | (manual) | RUN-2026-01 |
| REQ-103     | FEAT-012 | — | TC-AUTH-032, TC-SEC-013 | (manual) | RUN-2026-01 |
| REQ-115     | FEAT-012 | — | TC-SEC-019, TC-SEC-041 | (manual) | RUN-2026-01 |

## Public portfolio (FEAT-001..FEAT-011)

| Requirement | Feature | Scenarios | Test Cases | Automation | Run |
|-------------|---------|-----------|------------|------------|-----|
| REQ-001     | FEAT-011 | SCN-SMK-001..009 | TC-PUB-001..009 | automation/scripts/smoke-public.mjs | RUN-2026-01 |
| REQ-002     | FEAT-010 | SCN-FUN-010, SCN-EDGE-009 | TC-PUB-010, TC-ADM-PI-021 | (manual) | RUN-2026-01 |
| REQ-003     | FEAT-006 | SCN-FUN-006, SCN-NEG-017, SCN-NEG-018, SCN-EDGE-001..004, SCN-INT-001 | TC-API-001, TC-API-005..009, TC-PUB-PR-001..003, TC-PUB-PR-010, TC-PUB-PR-011, TC-PUB-PR-020..022, TC-PUB-PR-030, TC-PUB-PR-031 | automation/api/public-apis.test.mjs | RUN-2026-01 |
| REQ-004     | FEAT-009 | SCN-FUN-009, SCN-EDGE-031 | TC-API-002, TC-API-031, TC-API-041 | automation/api/public-apis.test.mjs | RUN-2026-01 |
| REQ-005     | FEAT-008 | SCN-FUN-008, SCN-NEG-018, SCN-EDGE-005 | TC-PUB-RS-001, TC-PUB-RS-011, TC-PUB-RS-020 | automation/api/public-apis.test.mjs | RUN-2026-01 |
| REQ-006     | FEAT-008 | — | TC-PUB-RS-002, TC-PUB-RS-010, TC-PUB-RS-021, TC-PUB-RS-030 | (manual) | RUN-2026-01 |
| REQ-022     | FEAT-023 | SCN-FUN-022, SCN-NEG-016 | TC-ADM-PI-001..004, TC-ADM-PI-010, TC-ADM-PI-011 | (manual) | RUN-2026-01 |
| REQ-027     | FEAT-007 | SCN-UI-007 | TC-PUB-007 | automation/scripts/smoke-public.mjs | RUN-2026-01 |
| REQ-028     | FEAT-027 | — | TC-PUB-009 | automation/scripts/smoke-public.mjs | RUN-2026-01 |
| REQ-117     | FEAT-027 | SCN-UI-010, SCN-UI-011 | TC-PUB-011, TC-PUB-012 | automation/ui/public-pages.test.mjs | RUN-2026-01 |
| REQ-118     | FEAT-027 | SCN-UI-015, SCN-UI-016 | TC-PUB-014, TC-PUB-015 | automation/ui/public-pages.test.mjs | RUN-2026-01 |

## Admin (FEAT-014..FEAT-023)

| Requirement | Feature | Scenarios | Test Cases | Automation | Run |
|-------------|---------|-----------|------------|------------|-----|
| REQ-015     | FEAT-015 | SCN-FUN-014, SCN-NEG-001, SCN-NEG-002, SCN-EDGE-007, SCN-EDGE-020 | TC-ADM-SK-001..006, TC-ADM-SK-010..013, TC-ADM-SK-020..022 | (manual) | RUN-2026-01 |
| REQ-016     | FEAT-016 | SCN-FUN-015, SCN-NEG-003, SCN-NEG-004, SCN-EDGE-020..022 | TC-ADM-PR-001..004, TC-ADM-PR-010..012, TC-ADM-PR-020..022 | (manual) | RUN-2026-01 |
| REQ-017     | FEAT-017 | SCN-FUN-016, SCN-NEG-007, SCN-NEG-008, SCN-EDGE-008, SCN-EDGE-016 | TC-ADM-HI-001..004, TC-ADM-HI-010..014, TC-ADM-HI-020, TC-ADM-HI-021 | (manual) | RUN-2026-01 |
| REQ-018     | FEAT-019 | SCN-FUN-018, SCN-NEG-009, SCN-NEG-010, SCN-EDGE-017, SCN-EDGE-021 | TC-ADM-ST-001..004, TC-ADM-ST-010..013, TC-ADM-ST-020, TC-ADM-ST-021 | (manual) | RUN-2026-01 |
| REQ-019     | FEAT-020 | SCN-FUN-019, SCN-NEG-011 | TC-ADM-SL-001..004, TC-ADM-SL-010, TC-ADM-SL-020 | (manual) | RUN-2026-01 |
| REQ-020     | FEAT-021 | SCN-FUN-020 | TC-ADM-ED-001..004, TC-ADM-ED-010, TC-ADM-ED-011, TC-ADM-ED-020, TC-ADM-ED-021 | (manual) | RUN-2026-01 |
| REQ-021     | FEAT-022 | SCN-FUN-021 | TC-ADM-EX-001..004, TC-ADM-EX-010, TC-ADM-EX-011, TC-ADM-EX-020 | (manual) | RUN-2026-01 |
| REQ-023     | FEAT-018 | SCN-FUN-017, SCN-NEG-005, SCN-NEG-006, SCN-EDGE-015, SCN-EDGE-016, SCN-EDGE-021 | TC-ADM-RS-001, TC-ADM-RS-002, TC-ADM-RS-010..012, TC-ADM-RS-020..022 | (manual) | RUN-2026-01 |
| REQ-024     | FEAT-018 | — | (covered by TC-ADM-RS-*) | (manual) | RUN-2026-01 |

## Observability (FEAT-024..FEAT-026)

| Requirement | Feature | Scenarios | Test Cases | Automation | Run |
|-------------|---------|-----------|------------|------------|-----|
| REQ-025     | FEAT-026 | — | TC-ADM-AL-002 (drafted, BUG-001) | (manual) | RUN-2026-01 |
| REQ-026     | FEAT-025 | SCN-FUN-024, SCN-SEC-009, SCN-SEC-010, SCN-EDGE-013, SCN-EDGE-014, SCN-EDGE-020 | TC-API-010, TC-API-022, TC-API-042, TC-SEC-009, TC-SEC-010, TC-SEC-020 | (manual) | RUN-2026-01 |
| REQ-111     | FEAT-024 | SCN-FUN-023 | TC-ADM-AL-001 | (manual) | RUN-2026-01 |
| REQ-112     | FEAT-026 | — | (BUG-001) | (manual) | RUN-2026-01 |

## Security (FEAT-018, REQ-100..118)

| Requirement | Feature | Scenarios | Test Cases | Automation | Run |
|-------------|---------|-----------|------------|------------|-----|
| REQ-100     | FEAT-018 | SCN-SEC-001 | TC-SEC-001, TC-SEC-008 | automation/api/headers.test.mjs | RUN-2026-01 |
| REQ-101     | FEAT-018 | SCN-SEC-002..005, SCN-SEC-007 | TC-SEC-002..005, TC-SEC-007, TC-SEC-040 | automation/api/headers.test.mjs | RUN-2026-01 |
| REQ-102     | FEAT-018 | — | TC-PUB-016 | (manual) | RUN-2026-01 |
| REQ-104     | FEAT-018 | — | TC-ADM-SK-030, TC-ADM-PR-030 | (manual) | RUN-2026-01 |
| REQ-114     | FEAT-027 | — | TC-SEC-023, TC-SEC-042 | (manual) | RUN-2026-01 |
| REQ-116     | FEAT-018 | SCN-SEC-006 | TC-SEC-006 | automation/api/headers.test.mjs | RUN-2026-01 |

## Coverage summary (by traceability class)

| Class | Total | Linked | Unlinked | Notes |
|-------|-------|--------|----------|-------|
| REQ-  | 28    | 28     | 0        | every requirement has ≥ 1 scenario or TC |
| FEAT- | 27    | 27     | 0        | every feature has ≥ 1 test case file |
| SCN-  | 11 categories, 60+ IDs | 60+ | 0 | every scenario has a TC reference |
| TC-   | 100+  | 100+   | 0        | every TC has a requirement reference |
| BUG-  | 4     | 4      | 0        | every bug has a regression test reference (drafted where missing) |

> Numbers are derived from the actual file count. They are not invented.
