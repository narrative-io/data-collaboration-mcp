Write tests for `$ARGUMENTS` using the best practices below.

# Pre-Testing Checklist

## 1. Understand the Test Directory Structure

Before writing tests, check if there's an existing test directory structure:

- Look for a `tests/` or `__tests__/` directory at the project root or module level
- Check if tests mirror the source directory structure (e.g., `tests/pages/improve/` mirrors `src/pages/improve/`)
- If tests exist in a separate directory, update import paths accordingly using path aliases (e.g., `@/pages/...`)

## 2. Analyze the Code to Test

Before writing any tests:

- Read the entire file to understand all functionality
- Check related type definition files to understand data structures
- Look for any existing test files that might provide patterns to follow
- Identify all public functions/methods that need testing
- Note any side effects or external dependencies that need mocking

## 3. Handle Import Path Updates

When tests are in a separate directory:

```typescript
// If test is in tests/pages/component.test.ts
// Update imports from relative to absolute using path aliases:
import { myFunction } from "@/pages/component";
// Instead of: import { myFunction } from "./component";
```

## 4. Deal with State Mutations in Tests

When testing reducers or state management with Immer:

- Never directly mutate state objects in tests
- Use reducer actions to set up state instead of direct assignment

```typescript
// ❌ Bad - direct mutation
const state = new StateBuilder().build();
state.filters.columnFilters = { name: "test" }; // This will fail!

// ✅ Good - use actions
const state = new StateBuilder().build();
const stateWithFilter = reducer(state, {
  type: "filters/setColumnFilter",
  payload: { column: "name", value: "test" }
});
```

## 5. Testing Array Sorting

When testing sort operations:

- Check how the actual sort is implemented (with or without comparator)
- Default `.sort()` on objects sorts by string representation, not properties
- Test for presence of items rather than exact order if sort behavior is unclear

## 6. Mock Complex Types Properly

For complex external types (like Dataset, User, etc.):

- Always import the actual types from their packages to ensure type safety
- Create complete mock objects with all required properties
- When dealing with union types or complex type hierarchies, use `as unknown as Type` for safer casting
- Avoid `as any` - prefer `as unknown as Type` when type casting is necessary

```typescript
// ❌ Bad - using any
const mockDataset = { id: "test", name: "Test" } as any;

// ✅ Good - complete mock with proper typing
import type { Dataset } from "@narrative.io/data-collaboration-sdk-ts";

function createMockDataset(overrides: Partial<Dataset> = {}): Dataset {
  return {
    id: "test-dataset",
    name: "Test Dataset", 
    company_id: "test-company",
    created_at: "2024-01-01T00:00:00Z",
    // ... all required properties
    ...overrides,
  } as Dataset;
}
```

## 7. Running Tests and Debugging Failures

After writing tests:

- Run tests immediately to catch issues early
- Use the correct path when running tests: `bun test tests/path/to/file.test.ts` (not `bun test frontend/tests/...`)
- If tests fail with "Cannot find module" errors, check import paths
- For "Attempted to assign to readonly property" errors, you're likely mutating Immer-protected state
- Watch for console output during tests (like error logs) - they often provide debugging clues
- Use `.only` to focus on failing tests during debugging
- Type errors in tests should be fixed the same way as in production code
- Run `bun check` after fixing tests to ensure no type or lint errors remain

## 8. Handling Linting in Tests

Tests should follow the same linting rules as production code:

- Run `bun check` on test files to catch linting errors
- Be aware that linters may reorder object keys alphabetically
- Import statements will be automatically sorted by the linter
- Fix linting errors before committing tests

```typescript
// Object keys may be reordered by linter
const data = {
  name: "test",
  value: 10,
  status: "active"
};
// After linting might become:
const data = {
  name: "test", 
  status: "active",
  value: 10
};
```

## 9. Avoiding Direct State Mutations

When you need to modify state for test setup:

```typescript
// ❌ Bad - direct mutation
const state = new StateBuilder().build();
state.currentPage = 3;
state.sortColumn = "name";

// ✅ Good - create new state object
const state = {
  ...new StateBuilder().build(),
  currentPage: 3,
  sortColumn: "name"
};

// ✅ Also good - use builder pattern
const state = new StateBuilder()
  .withCurrentPage(3)
  .withSortColumn("name")
  .build();
```

## 10. Test File Organization

Structure your test files for maximum clarity:

```typescript
// 1. Imports
import { describe, test, expect } from "bun:test";
import { functionToTest } from "@/module";

// 2. Test data builders
class TestDataBuilder { ... }

// 3. Mock factories
function createMockObject() { ... }

// 4. Test suites organized by functionality
describe("Module Name", () => {
  describe("Feature Group 1", () => {
    test("should handle specific case", () => { ... });
  });
  
  describe("Feature Group 2", () => { ... });
  
  describe("edge cases", () => { ... });
});
```

# Writing Excellent Unit Tests for TypeScript and React

## Core Principles

### Test One Thing at a Time

Each test should verify a single behavior or outcome:

```typescript
// ❌ Bad - testing multiple behaviors
test("user service works", () => {
  const user = createUser({ name: "John", email: "john@test.com" });
  expect(user.id).toBeDefined();
  expect(user.isActive).toBe(true);
  expect(sendWelcomeEmail(user)).toBe(true);
});

// ✅ Good - focused tests
test("should generate unique ID when creating user", () => {
  const user = createUser({ name: "John", email: "john@test.com" });
  expect(user.id).toBeDefined();
  expect(typeof user.id).toBe("string");
});

test("should set new users as active by default", () => {
  const user = createUser({ name: "John", email: "john@test.com" });
  expect(user.isActive).toBe(true);
});
```

### Write Descriptive Test Names

Test names should clearly describe the scenario and expected outcome:

```typescript
// ❌ Bad
test("error handling", () => {});
test("validates input", () => {});

// ✅ Good
test("should throw ValidationError when email format is invalid", () => {});
test("should return false when password is shorter than 8 characters", () => {});
test("should strip whitespace from username before validation", () => {});
```

### Follow AAA Pattern (Arrange-Act-Assert)

```typescript
test("should calculate compound interest correctly", () => {
  // Arrange
  const principal = 1000;
  const rate = 0.05;
  const time = 2;
  const frequency = 12;
  
  // Act
  const amount = calculateCompoundInterest(principal, rate, time, frequency);
  
  // Assert
  expect(amount).toBeCloseTo(1104.94, 2);
});
```

## Testing Strategies

### Test Edge Cases and Boundaries

```typescript
describe("validateAge", () => {
  test("should accept minimum valid age", () => {
    expect(validateAge(18)).toBe(true);
  });
  
  test("should reject age below minimum", () => {
    expect(validateAge(17)).toBe(false);
  });
  
  test("should handle zero", () => {
    expect(validateAge(0)).toBe(false);
  });
  
  test("should handle negative numbers", () => {
    expect(validateAge(-1)).toBe(false);
  });
  
  test("should handle very large numbers", () => {
    expect(validateAge(150)).toBe(false);
  });
});
```

### Test Error Scenarios

```typescript
test("should throw TypeError when input is not a number", () => {
  expect(() => calculateSquareRoot("abc")).toThrow(TypeError);
  expect(() => calculateSquareRoot("abc")).toThrow("Input must be a number");
});

test("should throw RangeError for negative numbers", () => {
  expect(() => calculateSquareRoot(-4)).toThrow(RangeError);
  expect(() => calculateSquareRoot(-4)).toThrow("Cannot calculate square root of negative number");
});
```

### Use Test Data Builders

```typescript
// Test data builder pattern
class UserBuilder {
  private user = {
    id: "default-id",
    name: "John Doe",
    email: "john@example.com",
    age: 25,
    isActive: true
  };
  
  withName(name: string) {
    this.user.name = name;
    return this;
  }
  
  withAge(age: number) {
    this.user.age = age;
    return this;
  }
  
  inactive() {
    this.user.isActive = false;
    return this;
  }
  
  build() {
    return { ...this.user };
  }
}

// Usage in tests
test("should filter inactive users", () => {
  const users = [
    new UserBuilder().build(),
    new UserBuilder().inactive().build(),
    new UserBuilder().withName("Jane").build()
  ];
  
  const activeUsers = filterActiveUsers(users);
  expect(activeUsers).toHaveLength(2);
});
```

## TypeScript-Specific Patterns

### Type-Safe Test Utilities

```typescript
// Create type-safe mock factories
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-id",
    name: "Test User",
    email: "test@example.com",
    createdAt: new Date(),
    ...overrides
  };
}

test("should update user name", () => {
  const user = createMockUser({ name: "Original Name" });
  const updated = updateUserName(user, "New Name");
  expect(updated.name).toBe("New Name");
});
```

### Testing Generic Functions

```typescript
describe("firstOrDefault", () => {
  test("should return first element for non-empty array", () => {
    expect(firstOrDefault([1, 2, 3], 0)).toBe(1);
    expect(firstOrDefault(["a", "b"], "default")).toBe("a");
  });
  
  test("should return default for empty array", () => {
    expect(firstOrDefault([], 0)).toBe(0);
    expect(firstOrDefault<string>([], "default")).toBe("default");
  });
});
```

### Testing Type Guards

```typescript
test("isValidEmail type guard should narrow type correctly", () => {
  const input: unknown = "test@example.com";
  
  if (isValidEmail(input)) {
    // TypeScript should know input is string here
    expect(input.toLowerCase()).toBe("test@example.com");
  } else {
    throw new Error("Expected valid email");
  }
});
```

## React Testing Patterns

### Test User Behavior, Not Implementation

```typescript
// ❌ Bad - testing implementation details
test("should set state when button clicked", () => {
  const { result } = renderHook(() => useState(false));
  act(() => result.current[1](true));
  expect(result.current[0]).toBe(true);
});

// ✅ Good - testing user behavior
test("should show success message when form is submitted", async () => {
  render(<ContactForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
  await userEvent.type(screen.getByLabelText(/message/i), "Hello");
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  
  expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
});
```

### Query Elements by Accessible Roles

```typescript
// ❌ Bad - using test IDs or implementation details
const button = screen.getByTestId("submit-button");
const input = container.querySelector(".email-input");

// ✅ Good - using accessible queries
const button = screen.getByRole("button", { name: /submit/i });
const input = screen.getByLabelText(/email address/i);
const heading = screen.getByRole("heading", { level: 1 });
```

### Test Async Behavior Properly

```typescript
test("should display search results after typing", async () => {
  render(<SearchComponent />);
  const searchInput = screen.getByRole("searchbox");
  
  await userEvent.type(searchInput, "react");
  
  // Wait for debounced search
  expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  
  // Wait for results
  expect(await screen.findByText(/react basics/i)).toBeInTheDocument();
  expect(screen.getByText(/advanced react/i)).toBeInTheDocument();
});
```

### Test Accessibility

```typescript
test("should be keyboard navigable", async () => {
  render(<Modal isOpen={true} />);
  
  // Focus should be trapped in modal
  const closeButton = screen.getByRole("button", { name: /close/i });
  const firstInput = screen.getByLabelText(/name/i);
  
  firstInput.focus();
  await userEvent.tab();
  
  expect(closeButton).toHaveFocus();
  
  await userEvent.tab();
  expect(firstInput).toHaveFocus(); // Focus wrapped around
});

test("should announce form errors to screen readers", async () => {
  render(<LoginForm />);
  
  await userEvent.click(screen.getByRole("button", { name: /submit/i }));
  
  const errorMessage = await screen.findByRole("alert");
  expect(errorMessage).toHaveTextContent(/email is required/i);
});
```

## Advanced Patterns

### Parameterized Tests

```typescript
describe("formatCurrency", () => {
  test.each([
    [0, "$0.00"],
    [1, "$1.00"],
    [99.99, "$99.99"],
    [1000, "$1,000.00"],
    [1000000, "$1,000,000.00"],
    [-50, "-$50.00"]
  ])("should format %d as %s", (input, expected) => {
    expect(formatCurrency(input)).toBe(expected);
  });
});
```

### Testing Time-Dependent Code

```typescript
import { afterEach, beforeEach, test, expect, setSystemTime } from "bun:test";

describe("isExpired", () => {
  beforeEach(() => {
    // Set system time to a known date
    setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });
  
  afterEach(() => {
    // Reset to real time
    setSystemTime();
  });
  
  test("should return true for past dates", () => {
    const pastDate = new Date("2023-12-31T23:59:59Z");
    expect(isExpired(pastDate)).toBe(true);
  });
  
  test("should return false for future dates", () => {
    const futureDate = new Date("2024-01-02T00:00:00Z");
    expect(isExpired(futureDate)).toBe(false);
  });
});
```

### Testing Error Boundaries

```typescript
test("should display fallback UI when child component throws", () => {
  const ThrowError = () => {
    throw new Error("Test error");
  };
  
  render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Key Principles Summary

1. **Test behavior, not implementation** - Focus on what the code does, not how
2. **Keep tests independent** - Each test should run in isolation
3. **Make tests deterministic** - Same input should always produce same output
4. **Use meaningful assertions** - Be specific about what you're testing
5. **Maintain test readability** - Tests serve as documentation
6. **Test the contract** - Verify the public API, not private methods
7. **Avoid testing framework code** - Don't test React, only your logic
8. **Keep tests DRY, but prioritize clarity** - Some duplication is acceptable for readability
9. **Run `bun check` and lint tests like you would any other file** - Linting tests is important for readability and maintainability

## Common Pitfalls to Avoid

1. **Don't use `any` types** - Even in tests, maintain type safety with proper mocks
2. **Don't mutate state directly** - Always create new objects when modifying state
3. **Don't ignore linting errors** - Tests should be as clean as production code
4. **Don't hardcode expected values that might change** - Be aware of sorting and key ordering
5. **Don't skip running `bun check`** - Always verify both tests pass AND types/linting are clean
6. **Don't use relative imports in test files** - Use path aliases like `@/` for consistency
7. **Don't create incomplete mocks** - Mock all required properties for external types
