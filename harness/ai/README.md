# AI testing harness

This folder contains everything an AI agent needs to **plan, generate, execute, and
record tests** for the Portfolio Next project.

## Files

| File                          | Purpose                                              |
|-------------------------------|------------------------------------------------------|
| `test-agent-instructions.md`  | The 11-step procedure an agent should follow         |
| `test-prompts.md`             | Copy-paste prompts for common agent tasks            |
| `test-generation-rules.md`    | Rules for producing test cases (style, format, IDs)  |

## How an agent should use this folder

1. Read `test-agent-instructions.md` end-to-end before doing anything.
2. Use `test-prompts.md` to bootstrap individual test generation tasks.
3. When producing a new test case, follow `test-generation-rules.md`.
4. Always record results; never claim a test passed without execution.
