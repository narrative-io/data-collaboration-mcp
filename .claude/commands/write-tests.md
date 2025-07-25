# Unit Test Generation Instructions

You are tasked with creating comprehensive unit tests for the following file(s): `$ARGUMENTS`

## Project Context

- This is a React project within a monorepo structure
- Files may be TypeScript (.ts) or TypeScript React (.tsx)
- Tests use Bun test runner (`bun test`)
- Tests should be placed in the appropriate workspace's `tests` folder

## Pre-Test Analysis

1. **Analyze the target file(s)** to understand:
   - The purpose and responsibility of each function/component
   - Expected behavior based on function/component names
   - Any comments or JSDoc that indicate intended behavior
   - Input/output types and constraints
   - Side effects and dependencies
   - Error handling requirements

2. **Check existing test coverage** (if applicable):

   ```bash
   bun test --coverage
   ```

   Document the current coverage percentage for the file(s).

## Test Creation Guidelines

### 1. File Structure

- Place tests in: `[workspace]/tests/[relative-path-to-source]/[filename].test.ts(x)`
- Mirror the source file structure within the tests folder
- Use `.test.ts` for `.ts` files and `.test.tsx` for `.tsx` files

### 2. Test Organization

```typescript
import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
// Import the module/component to test
import { /* items to test */ } from "../path/to/source/file";

describe("[ModuleName/ComponentName]", () => {
  // Setup and teardown if needed
  beforeEach(() => {
    // Reset mocks, initialize test data
  });

  afterEach(() => {
    // Cleanup
  });

  describe("[FunctionName/MethodName]", () => {
    test("should [expected behavior] when [condition]", () => {
      // Arrange
      // Act
      // Assert
    });

    test("should handle [edge case]", () => {
      // Test edge cases
    });

    test("should throw error when [invalid condition]", () => {
      // Test error scenarios
    });
  });
});
```

### 3. Testing Best Practices

#### For All Files

- **Test behavior, not implementation**: Focus on what the code should do, not how it does it
- **Use descriptive test names**: "should return user data when valid ID is provided"
- **Follow AAA pattern**: Arrange, Act, Assert
- **Test edge cases**: Empty inputs, null/undefined, boundary values
- **Test error scenarios**: Invalid inputs, exceptions, error handling
- **Mock external dependencies**: APIs, databases, file systems
- **Test async behavior**: Promises, callbacks, async/await

#### For React Components (.tsx)

- Test component rendering with different props
- Test user interactions (clicks, input changes)
- Test conditional rendering
- Test accessibility attributes
- Mock child components when appropriate
- Test hooks behavior and state changes

#### For Utility Functions (.ts)

- Test all code paths
- Test with various input types
- Verify return values and types
- Test for immutability where expected
- Performance considerations for heavy computations

### 4. Coverage Requirements

- Aim for minimum 80% code coverage
- Focus on:
  - Statement coverage
  - Branch coverage
  - Function coverage
  - Line coverage

### 5. Mock Guidelines

```typescript
// Mock external modules
mock.module("../api/client", () => ({
  fetchData: mock(() => Promise.resolve({ data: "mocked" }))
}));

// Mock timers if needed
import { useFakeTimers } from "bun:test";
```

### 6. Common Test Scenarios

#### Data Validation

- Valid inputs produce expected outputs
- Invalid inputs are handled gracefully
- Boundary conditions are tested
- Type coercion is handled correctly

#### State Management

- Initial state is correct
- State updates work as expected
- State persistence (if applicable)
- Race conditions are handled

#### Error Handling

- Errors are caught and handled appropriately
- Error messages are meaningful
- Fallback behavior works correctly
- Recovery mechanisms function properly

## Test Implementation Process

1. **Create the test file** in the appropriate location
2. **Write tests** following the guidelines above
3. **Run tests** to ensure they pass:

   ```bash
   bun test [test-file-path]
   ```

4. **Check coverage** after implementation:

   ```bash
   bun test --coverage
   ```

5. **Document coverage improvement** and any uncovered lines

## Output Requirements

Provide:

1. The complete test file(s) with all tests
2. Pre-test coverage report (if available)
3. Post-test coverage report
4. Explanation of:
   - Key test scenarios covered
   - Any assumptions made about intended behavior
   - Suggestions for additional tests if coverage is below 80%
   - Any code issues discovered during test writing

## Example Test Structure

```typescript
// tests/components/UserProfile.test.tsx
import { describe, test, expect, mock } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserProfile } from "../../src/components/UserProfile";
import { userService } from "../../src/services/userService";

// Mock the service
mock.module("../../src/services/userService", () => ({
  userService: {
    getUser: mock(),
    updateUser: mock()
  }
}));

describe("UserProfile", () => {
  const mockUser = {
    id: "123",
    name: "John Doe",
    email: "john@example.com"
  };

  beforeEach(() => {
    mock.restore();
  });

  describe("rendering", () => {
    test("should display user information when data is loaded", async () => {
      userService.getUser.mockResolvedValue(mockUser);
      
      render(<UserProfile userId="123" />);
      
      expect(await screen.findByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("should show loading state initially", () => {
      userService.getUser.mockResolvedValue(mockUser);
      
      render(<UserProfile userId="123" />);
      
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("should display error message when user fetch fails", async () => {
      userService.getUser.mockRejectedValue(new Error("Network error"));
      
      render(<UserProfile userId="123" />);
      
      expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    test("should call updateUser when save button is clicked", async () => {
      userService.getUser.mockResolvedValue(mockUser);
      userService.updateUser.mockResolvedValue({ ...mockUser, name: "Jane Doe" });
      
      render(<UserProfile userId="123" />);
      
      const input = await screen.findByLabelText("Name");
      fireEvent.change(input, { target: { value: "Jane Doe" } });
      
      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      
      expect(userService.updateUser).toHaveBeenCalledWith("123", {
        name: "Jane Doe"
      });
    });
  });
});
```

Remember to think critically about what the code SHOULD do, not just what it currently does. Consider the function/component names, parameters, return types, and any documentation to infer the intended behavior.
