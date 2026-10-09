# UI test tools

> The project has **no Playwright / Cypress / WebdriverIO** installed. The harness
> provides **HTTP-only** UI checks and a stub for future browser tests.

## Tool: HTTP + HTML grep

```text
Tool:           node:test + fetch + manual HTML inspection
Purpose:        Confirm pages return 200 and contain expected markers.
Installation:   None.
Configuration:  BASE_URL env (default http://localhost:3000).
How to Run:     node harness/automation/scripts/smoke-public.mjs
Expected Output: PASS/FAIL per page.
Where Results Are Stored:
                test-results/latest/ and evidence/api-responses/.
Known Limitations:
                - No pixel-level verification.
                - No JS execution.
```

## Tool: Visual regression

```text
Tool:           None configured.
Purpose:        Compare screenshots between releases.
Installation:   NOT INSTALLED (intentionally — keep the project lean).
Known Limitations:
                - Would require Playwright/Puppeteer + image diff.
                - Future: harness/ai/test-prompts.md describes how an AI agent
                  could do this via the in-house /test-ui page.
```

## Tool: Accessibility smoke

```text
Tool:           Manual review.
Purpose:        Spot-check that motion respects prefers-reduced-motion.
How to Run:     Open /test-ui in a browser, enable reduced motion, observe.
Expected Output: All animations are disabled.
Where Results Are Stored:
                evidence/screenshots/ (optional).
Known Limitations:
                - Not automated in the harness.
```
