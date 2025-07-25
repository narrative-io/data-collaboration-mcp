# Instructions for Linting and Fixing Code Issues

## Objective
Run `bun check` to identify linting errors and warnings, then fix ALL issues using idiomatic solutions. Do NOT disable rules, ignore warnings, or suppress errors.

## Step-by-Step Process

### 1. Initial Lint Check
```bash
bun check
```
- Run this command in the project root
- Carefully read and document ALL errors and warnings
- Note the file paths, line numbers, and specific rule violations

### 2. Analyze Each Issue
For each error or warning:
- Understand WHY the linter is flagging this issue
- Research the idiomatic/best practice solution for this specific problem
- Consider the broader codebase context when determining the fix

### 3. Fix Issues Idiomatically

#### Common Fixes and Their Idiomatic Solutions:

**Unused Variables**
- Remove genuinely unused variables
- If needed later, implement the functionality now
- For intentionally unused parameters, use underscore prefix: `_unusedParam`

**Missing Type Annotations**
- Add explicit type annotations
- Use proper TypeScript types, not `any`
- Define interfaces/types for complex objects

**Formatting Issues**
- Apply the project's formatting rules
- Maintain consistent indentation, spacing, and line breaks
- Follow the style guide implied by the linter configuration

**Import/Export Issues**
- Use proper import syntax for the module system
- Remove unused imports
- Organize imports logically (external deps, then internal)

**Async/Await Issues**
- Add `await` for Promise-returning functions
- Mark functions as `async` when using `await`
- Handle Promise rejections properly with try/catch

**Null/Undefined Handling**
- Add proper null checks
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Initialize variables that might be undefined

### 4. Verification Process

After fixing each file:
1. Run `bun check` again to verify the specific file is clean
2. Test that your changes haven't broken functionality
3. Ensure no new warnings were introduced

### 5. Final Validation

Once all issues are addressed:
```bash
bun check
```
- Should return with zero errors and zero warnings
- If any issues remain, repeat the fix process

## Important Guidelines

### DO:
- Fix the root cause of each issue
- Maintain code functionality while fixing style issues
- Follow the project's established patterns
- Add meaningful variable names when renaming
- Properly handle edge cases exposed by linter warnings
- Add error handling where the linter indicates it's missing
- Use type-safe solutions

### DO NOT:
- Add `// eslint-disable` comments
- Add `@ts-ignore` or `@ts-expect-error` comments
- Change linter configuration to hide issues
- Use `any` type to bypass TypeScript errors
- Remove functionality to satisfy the linter
- Ignore warnings thinking they're not important

## Example Fixes

### Bad (Suppressing):
```javascript
// eslint-disable-next-line no-unused-vars
const data = fetchData();
```

### Good (Fixing):
```javascript
const data = fetchData();
processData(data); // Actually use the variable
```

### Bad (Ignoring):
```typescript
// @ts-ignore
const result = someFunction(wrongType);
```

### Good (Fixing):
```typescript
const result = someFunction(correctType as ExpectedType);
// Or better: fix the type at its source
```

## Success Criteria

The task is complete when:
1. `bun check` returns with exit code 0
2. No errors or warnings are reported
3. All fixes follow idiomatic patterns
4. Code functionality is preserved or improved
5. No lint rules have been disabled or ignored

Remember: Every warning and error exists for a reason. Your job is to understand that reason and address it properly, not to silence the linter.