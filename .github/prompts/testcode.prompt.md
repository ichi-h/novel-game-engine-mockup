---
agent: agent
model: Claude Sonnet 4.5
tools: ['edit', 'runNotebooks', 'search', 'new', 'runCommands', 'runTasks', 'Copilot Container Tools/*', 'serena/*', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'openSimpleBrowser', 'fetch', 'githubRepo', 'extensions', 'todos', 'runSubagent']
description: "Generate test code"
---

## Purpose

Using the mcp server's serena, propose and create test code that achieve 100% coverage for the specified code.

## Task

1. Interview the developer to clarify which code sections require test code.
2. Based on the interview, identify test items and propose them to the developer.
   - At this stage, you only need to propose test items; there is no need to generate test code yet.
   - Address any feedback from the developer regarding fixes, etc., and repeat this process until approval is obtained.
   - When identifying test cases, there is a possibility that the implementation itself is incorrect. If this possibility exists, confirm with the developer during test case design.
3. Once the test items are finalized, generate the test code.
4. Run `bun test --coverage` in the project's root directory and verify that all tests pass.
   - If tests fail, modify the code based on the error messages and repeat until all tests pass.
5. Report the test code to the developer and address any requested modifications as needed.

## Notes

- When communicating with developers, use the language they speak.
  - For example, if the developer speaks Japanese, respond in Japanese.
- When writing comments, documentation, or similar items in the code, write them all in English.
- For test items and writing style, refer to packages/engine/src/ui/**test**/manager.test.ts.
- Write tests separately for each method, creating test items for normal cases and, if applicable, abnormal cases within each.
- When creating test cases, assume that modules dependent on the target code are functioning correctly.
