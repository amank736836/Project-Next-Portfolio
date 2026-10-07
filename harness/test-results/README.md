# Test results

This folder holds the **output of every test run**.

## Layout

```
test-results/
├── README.md                ← (this file)
├── latest/                  ← most recent run
├── historical/              ← every previous run, archived
└── summaries/               ← aggregated metrics (computed by hand or script)
```

## How to record a run

1. Create `test-results/latest/RUN-yyyy-nn.md` using the template in this folder
   (`RUN-TEMPLATE.md`).
2. Copy any JSON outputs from your scripts into `latest/`.
3. Update `TESTING_STATUS.md` and `reports/coverage.md`.
4. Move the previous `latest/` contents to `historical/`.
