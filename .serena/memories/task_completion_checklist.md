# Task Completion Checklist

When completing a task, ensure the following steps are performed:

## 1. Code Quality Checks
- [ ] Run `bun run tsc` to verify no TypeScript errors
- [ ] Run `bun run lint` to fix linting issues
- [ ] Run `bun run format` to format code consistently

## 2. Testing
- [ ] Run `bun test` to ensure all tests pass
- [ ] Run `bun test --coverage` to verify coverage if applicable
- [ ] Add or update tests for new functionality
- [ ] Ensure test coverage is comprehensive (aim for 100%)

## 3. Code Review
- [ ] Follow project code style and conventions
- [ ] Use proper naming conventions (camelCase, PascalCase, etc.)
- [ ] Add comments in English for complex logic
- [ ] Ensure immutability and type safety
- [ ] Check for proper error handling

## 4. Documentation
- [ ] Update relevant README files if needed
- [ ] Add JSDoc comments for public APIs
- [ ] Update CLAUDE.md files if architectural changes were made

## 5. Git
- [ ] Ensure files are properly saved
- [ ] Lefthook will run pre-commit hooks automatically
- [ ] Review changes before committing

## Testing Workflow (for test code generation)
1. Identify code sections requiring tests
2. Propose test items to developer
3. Wait for approval/feedback
4. Generate test code
5. Run `nix develop --command -- bun test --coverage`
6. Fix any failing tests
7. Report results to developer