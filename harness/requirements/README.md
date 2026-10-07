# Requirements

This folder contains the canonical, traceable requirements for the project. Each
requirement has a stable ID (`REQ-xxx`) and is mapped to features, scenarios, and tests
in `reports/traceability.md`.

> ⚠️ Requirements are **derived from the source code** (not from a product spec the team
> received). They reflect what the system **does today**. Unknown / unverified items are
> marked `UNKNOWN / REQUIRES VALIDATION`.

## Index

| ID range  | Document                                              |
|-----------|-------------------------------------------------------|
| REQ-001…  | [functional-requirements.md](./functional-requirements.md) |
| REQ-100…  | [non-functional-requirements.md](./non-functional-requirements.md) |
| REQ-200…  | [business-rules.md](./business-rules.md)              |

## How to add a new requirement

1. Pick the next free ID in the right range.
2. Add it to the right document using the template.
3. Link it from `reports/traceability.md` to the relevant `FEAT-` / `SCN-` / `TC-` rows.
4. Update `reports/coverage.md`.

## Requirement template

```text
REQ-XXX  Title
Status:   ACCEPTED | PROPOSED | DEPRECATED
Source:   <file path or spec>
Owner:    UNKNOWN / REQUIRES VALIDATION
Priority: P0 | P1 | P2

Description:
  One-paragraph description of what the system must do.

Acceptance criteria:
  - [ ] AC1
  - [ ] AC2

Related features: FEAT-XXX, FEAT-YYY
```
