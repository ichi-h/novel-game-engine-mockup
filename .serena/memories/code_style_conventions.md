# Code Style and Conventions

## TypeScript Configuration

- Strict mode enabled with strictest preset
- Target: ESNext
- Module: Preserve (bundler mode)
- JSX: react-jsx
- No emit (bundler handles compilation)
- `noUncheckedIndexedAccess: true` for safer array/object access

## Formatting (Biome)

- **Indent**: 2 spaces
- **Line width**: 80 characters
- **Quote style**: Single quotes for JavaScript/TypeScript
- **Organize imports**: Enabled on save

## Naming Conventions

- **Types/Interfaces**: PascalCase (e.g., `NovelModel`, `SequenceMessage`)
- **Functions/Variables**: camelCase (e.g., `handleSequence`, `generateInitModel`)
- **Constants**: camelCase (no SCREAMING_SNAKE_CASE)
- **Files**: kebab-case for handlers (e.g., `add-channel.ts`, `add-text.ts`)
- **Test files**: `*.test.ts` in `__test__` directories

## Code Organization

- Export types and interfaces before implementations
- Use `type` for type aliases, `interface` for object shapes
- Prefer readonly and immutable patterns
- Use generics for reusable components (e.g., `WidgetManager<T>`)

## Testing Style

- Framework: Bun test
- Structure: AAA pattern (Arrange, Act, Assert)
- Organization: Nested `describe` blocks for clarity
  - Top level: Class/function name
  - Second level: Method/feature name
  - Third level: "normal cases" and "error cases"
- Comments: Use inline comments for each section (// Arrange, // Act, // Assert)
- Test names: Descriptive sentences in present tense
- Example pattern from `manager.test.ts`:
  ```typescript
  describe("WidgetManager", () => {
    describe("methodName", () => {
      describe("normal cases", () => {
        test("does something specific", () => {
          // Arrange
          // Act
          // Assert
        });
      });
      describe("error cases", () => {
        test("throws error when condition", () => {
          // Arrange
          // Act & Assert
        });
      });
    });
  });
  ```

## Comments and Documentation

- All code comments and documentation should be in English
- Use JSDoc for public APIs
- Inline comments for complex logic
- Test descriptions should be clear and self-documenting
