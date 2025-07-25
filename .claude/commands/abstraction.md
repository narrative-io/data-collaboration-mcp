# Project-Wide Pattern Analysis and Abstraction

**Project/Workspace to analyze:** `$ARGUMENTS`

## Task: Identify and Abstract Repeated Patterns

Please analyze the entire project/workspace to identify patterns that have been independently implemented across multiple files and components. Focus on finding opportunities for abstraction that would improve code reuse and maintainability.

### Analysis Scope:

#### 1. Pattern Detection:

Look for the following types of repeated patterns:

- **Component Patterns**
  - Similar component structures with minor variations
  - Repeated layout patterns (headers, cards, modals, forms)
  - Common component compositions
  - Similar prop interfaces across unrelated components

- **Hook Patterns**
  - Custom hooks with similar logic implemented separately
  - Repeated state management patterns
  - Common side effect patterns (API calls, subscriptions)
  - Similar form handling or validation logic

- **Utility Functions**
  - Data transformation functions with similar logic
  - Repeated formatting functions (dates, numbers, strings)
  - Similar API request builders or handlers
  - Common validation functions

- **Type Patterns** (if TypeScript)
  - Repeated interface definitions
  - Similar type compositions
  - Common generic patterns
  - Repeated union types or enums

- **Styling Patterns**
  - Repeated CSS/styled-component definitions
  - Common animation patterns
  - Similar responsive breakpoint handling
  - Repeated theme variations

#### 2. Business Logic Patterns:
- Similar data fetching and caching strategies
- Repeated error handling patterns
- Common authentication/authorization checks
- Similar state update patterns
- Repeated business rule implementations

#### 3. Configuration Patterns:
- Similar component configuration objects
- Repeated prop drilling patterns that could use Context
- Common default prop patterns
- Similar environment-based conditionals

### Analysis Output:

For each identified pattern, provide:

#### 1. Pattern Summary:

```
Pattern Name: [Descriptive name]
Type: [Component/Hook/Utility/Type/Style/Logic]
Occurrences: [Number of times found]
Files affected: [List of file paths]
```

#### 2. Current Implementation Examples:
Show 2-3 examples of how the pattern is currently implemented across different files

#### 3. Proposed Abstraction:
```
Suggested location: [Where to place the abstraction]
Abstraction type: [Component/Hook/Utility/HOC/Context/etc.]
```

Provide the abstracted code implementation

#### 4. Migration Example:
Show how one of the current implementations would be refactored to use the new abstraction

#### 5. Impact Assessment:
- **Benefits:**
  - Lines of code reduced
  - Improved maintainability
  - Consistency gains
- **Considerations:**
  - Any edge cases that don't fit the abstraction
  - Performance implications
  - Testing requirements

### Prioritization Criteria:

Rank found patterns by:
1. **Frequency** - How often the pattern appears
2. **Complexity** - How much code could be eliminated
3. **Risk** - How safe the abstraction would be
4. **Value** - Business impact of standardizing this pattern

### Special Considerations:

#### Don't Abstract:
- Patterns that appear only 2 times (unless very complex)
- Patterns with significant variations that would require complex configuration
- Simple patterns where the abstraction would be more complex than the repetition
- Patterns that are likely to diverge in the future

#### Do Abstract:
- Patterns appearing 3+ times with minimal variation
- Complex business logic that should be consistent
- UI components with standard behavior
- Error-prone patterns that benefit from centralization
- Patterns that represent core domain concepts

### Output Format:

1. **Executive Summary**
   - Total patterns found
   - Estimated LOC reduction
   - Top 5 high-impact abstractions

2. **Detailed Pattern Analysis**
   - Organized by pattern type
   - Ordered by priority/impact

3. **Implementation Roadmap**
   - Suggested order of implementation
   - Dependencies between abstractions
   - Testing strategy for each abstraction

4. **Architecture Recommendations**
   - Suggested folder structure for new abstractions
   - Naming conventions
   - Documentation requirements

Please analyze the codebase and provide your findings following this structure.