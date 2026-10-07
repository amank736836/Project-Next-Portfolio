# Evidence

This folder holds **proof** of test execution. Every recorded test case should
link to at least one evidence file here.

## Layout

```
evidence/
├── README.md             ← (this file)
├── api-responses/        ← raw response bodies / headers from API calls
├── logs/                 ← console logs, server logs, npm output
├── database-results/     ← psql output, query result files
└── screenshots/          ← UI captures (placeholders until a browser tool is wired)
```

## Conventions

- File names follow the convention `<test-id>-<short-desc>.<ext>`.
  Example: `TC-PUB-001-root.html`, `smoke-2026-10-07T15-04-12Z.json`.
- Evidence files are **never committed** unless part of a deliberate run snapshot.
  They are git-ignored by the project's `.gitignore` (the `harness/` folder is **not**
  ignored; only the bulky outputs are).
- Do not invent evidence. If a test was not executed, the relevant file is absent.

## Recording evidence from a script

```js
import { writeEvidence, PATHS } from '../utilities/env.mjs';
writeEvidence('api', 'TC-PUB-001-root.html', body);
```

## Screenshots

> No browser tool is installed. Until then, the `screenshots/` folder is intentionally
> empty.  An AI agent can capture screenshots with the system browser tool.
