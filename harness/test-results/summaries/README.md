# Test result summaries

Aggregated metrics across runs. This folder is empty until enough runs are captured.

Use the `automation/utilities/summarize.mjs` script (planned) to:

1. Read every `test-results/historical/RUN-*.md` file.
2. Parse the metrics block.
3. Append an entry to `summaries/index.md`.

Until then, summary numbers live in `TESTING_STATUS.md`.
