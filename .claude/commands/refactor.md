# React Code File Improvement Instructions

**File to improve:** `$ARGUMENTS`

## Task: Improve React Code File

Please analyze and improve the provided React code file according to these guidelines:

### Core Principles:
1. **Maintainability First** - Code should be easy to understand, modify, and extend
2. **Performance** - Optimize for efficiency without sacrificing readability
3. **Idiomatic React** - Follow current React best practices and patterns

### Specific Requirements:

#### File Organization:
- Keep files under 300 lines of code (LOC)
- If the file exceeds 300 LOC, split it into smaller, focused modules:
 - Separate components into their own files
 - Extract custom hooks into a `hooks/` directory
 - Move utility functions to a `lib/` directory
 - Group related components in feature-based folders

#### React Best Practices:
- Use functional components with hooks (no class components unless absolutely necessary)
- Implement proper component composition over inheritance
- Keep components pure and side-effect free where possible
- Use React.memo() for expensive components that receive stable props
- Implement error boundaries for robust error handling
- Follow the Rules of Hooks

#### Code Quality:
- Extract complex logic into custom hooks (prefix with `use`)
- Avoid inline function definitions in render methods
- Use descriptive variable and function names
- Add PropTypes or TypeScript interfaces for type safety
- Remove unnecessary re-renders (check dependency arrays)
- Eliminate console.logs and commented-out code

#### Performance Optimizations:
- Use useMemo() for expensive computations
- Use useCallback() for stable function references passed to child components
- Implement lazy loading with React.lazy() for code splitting
- Avoid unnecessary state updates
- Use key props correctly in lists

#### State Management:
- Keep state as local as possible
- Lift state only when necessary
- Consider useImmerReducer for complex state logic
- Avoid prop drilling - use Context API or composition

#### Styling:
- Prefer CSS Modules, styled-components, or Tailwind over inline styles
- Keep styling logic separate from business logic
- Use consistent naming conventions for CSS classes

### Output Format:
1. If the file is under 300 LOC, provide the improved version
2. If the file needs splitting, provide:
  - A file structure showing how to organize the code
  - The refactored main file
  - At least one example of an extracted component/hook/utility

### Additional Considerations:
- Preserve all existing functionality
- Add brief comments for complex logic
- Ensure accessibility (ARIA labels, semantic HTML)
- Handle loading and error states appropriately
- Make components reusable where sensible
- Always run `bun check` afterwards and FIX any linting errors.

Please analyze the code and provide your improvements with explanations for significant changes.