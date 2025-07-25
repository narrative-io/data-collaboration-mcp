# Tests

This directory contains all test files for the Narrative MCP Server project.

## Structure

- `environment-validation.test.ts` - Tests for environment variable validation logic
- `server-environment.test.ts` - Tests for MCP server environment configuration integration

## Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run specific test file
bun test tests/environment-validation.test.ts
```

## Test Organization

Tests are organized by functionality rather than by file structure. This follows Node.js/TypeScript best practices for 2024:

1. **Separate test directory** - Tests are isolated from source code
2. **Descriptive naming** - Test files clearly indicate what they test
3. **Import path aliases** - Tests use relative imports from `../src/`
4. **Bun test runner** - Uses Bun's fast, Jest-compatible test runner

## Adding New Tests

When adding new tests:

1. Create descriptive test file names ending in `.test.ts`
2. Use relative imports to source files: `import { function } from "../src/module.js"`
3. Follow the AAA pattern (Arrange, Act, Assert)
4. Group related tests with `describe` blocks
5. Use descriptive test names that explain the scenario and expected outcome

## Test Coverage

Current test coverage includes:
- ✅ Environment variable validation
- ✅ Server startup configuration
- ✅ Error handling scenarios
- ✅ Edge cases and boundary conditions