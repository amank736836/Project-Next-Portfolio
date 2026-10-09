# RUN TEMPLATE

Copy this template to `test-results/latest/RUN-yyyy-nn.md` (or `historical/...`).

```text
Execution ID: RUN-yyyy-nn

Date:         yyyy-mm-dd
Environment:  local-offline | local-online | staging | production
Commit:       <git sha>
Tester/Agent: <name or "ai">
Test Suite:   smoke-public | api | ui | db | security | regression

Total:        <int>
Passed:       <int>
Failed:       <int>
Blocked:      <int>
Not Run:      <int>

Pass Rate:    <%>

Critical Failures:
  - <list>

Known Issues Encountered:
  - <list>

Evidence:
  - evidence/api-responses/<file>
  - evidence/logs/<file>
  - evidence/database-results/<file>

Notes:
  - <free-form>
```
