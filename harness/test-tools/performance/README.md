# Performance test tools

> No dedicated performance tool is installed. The harness uses `node --test` +
> `performance.now()` and writes results to `evidence/logs/`.

## Tool: `node --test` + timers

```text
Tool:           Node.js performance.now()
Purpose:        Measure response time of /api/* endpoints.
Installation:   Built-in.
Configuration:  Run npm run dev (offline mode possible).
How to Run:     node harness/automation/scripts/perf-public.mjs (when added)
Expected Output: JSON { endpoint, runs, p50, p95, maxMs }.
Where Results Are Stored:
                evidence/logs/perf-<date>.json
Known Limitations:
                - Local network latency dominates; production budgets are
                  advisory only.
                - No load generation; harness does not have a "users" tool.
```

## Tool: Apache Bench / `wrk` / k6

```text
Tool:           None installed.
Purpose:        Generate concurrent load.
Installation:   Optional.  k6 is suggested (`brew install k6`).
Configuration:  Write a k6 script in harness/automation/scripts/perf/.
How to Run:     k6 run harness/automation/scripts/perf/api.js
Expected Output: Throughput / p95 summary.
Where Results Are Stored:
                Stdout; copy to evidence/logs/.
Known Limitations:
                - Not wired into the harness yet.
```
