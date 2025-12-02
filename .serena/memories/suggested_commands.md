# Suggested Commands

## Package Management
- `bun install` - Install dependencies
- `bun install <package>` - Add a package

## Build Commands
- `bun run build` - Production build for all packages (minified)
- `bun run build:dev` - Development build for all packages
- `bun run tsc` - Type check all packages

## Code Quality
- `bun run format` - Format code with Biome
- `bun run lint` - Lint and auto-fix with Biome

## Testing
- `bun test` - Run all tests
- `bun test --coverage` - Run tests with coverage report
- `bun test <file>` - Run specific test file
- `bun test --watch` - Run tests in watch mode

## Development Workflow
1. Make changes to code
2. Run `bun run tsc` to check types
3. Run `bun test` to ensure tests pass
4. Run `bun run lint` to fix linting issues
5. Run `bun run format` to format code

## Nix Development Environment
- direnv is configured to automatically load the Nix environment
- No need to use `nix develop` or `nix develop --command --` prefixes
- Commands can be run directly (e.g., `bun test --coverage`)

## Git Hooks
- Lefthook is automatically installed via `postinstall` script
- Hooks are defined in `lefthook.yml`

## System Commands (Linux/Zsh)
- `ls` - List files
- `cd` - Change directory
- `pwd` - Print working directory
- `grep` - Search text
- `find` - Find files
- `cat` - Display file contents
- `rm` - Remove files
- `mv` - Move/rename files
- `cp` - Copy files