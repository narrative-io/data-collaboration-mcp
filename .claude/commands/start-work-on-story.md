# Start Work on Story Instructions

**Story/Ticket ID:** `$ARGUMENTS`

## Task: Begin Development Work on Story

Follow this workflow to start working on a new story or ticket efficiently and safely.

### 1. Branch Creation & Setup

#### Branch Naming Convention:

Name the ticket after the shortcut ticket being worked on 

```bash
# For new features
git checkout -b feat/sc-xxxx-brief-description

# For bug fixes  
git checkout -b fix/sc-yyyy-brief-description

# For documentation
git checkout -b docs/sc-xxxx-brief-description

# For refactoring/technical work
git checkout -b refactor/sc-xxxx-brief-description
```

#### Initial Setup:
```bash
# Ensure you're on latest main
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b [branch-name]

# Verify clean working directory
git status
```

### 2. Story Analysis & Planning

#### Requirements Review:
- [ ] Read the full story/ticket description
- [ ] Identify all acceptance criteria
- [ ] Note any dependencies or prerequisites
- [ ] Check for related stories or technical debt
- [ ] Understand the user impact and business value

#### Technical Planning:
- [ ] **Identify minimum viable changes** needed for acceptance criteria
- [ ] Map out affected files and components
- [ ] Consider integration points (APIs, services, etc.)
- [ ] Plan testing strategy (unit, integration, manual)
- [ ] Estimate complexity and potential blockers

### 3. Development Environment

#### Pre-Development Checks:
```bash
# Install/update dependencies
bun install

# Run type checking
bun run build

# Start development server
bun run dev
```

#### Project-Specific Setup:
- [ ] Verify MCP server configuration
- [ ] Check environment variables (.env file)
- [ ] Ensure API endpoints are accessible
- [ ] Review relevant TypeScript types in `src/types/`

### 4. Implementation Strategy

#### Start Small & Iterative:
1. **Skeleton First**: Create minimal structure/interfaces
2. **Core Logic**: Implement the essential functionality
3. **Error Handling**: Add proper error states and validation
4. **Polish**: Improve UX, performance, and edge cases

#### Code Quality Standards:
- [ ] Follow existing patterns in the codebase
- [ ] Use TypeScript strictly (no `any` types)
- [ ] Add proper error handling and logging
- [ ] Keep functions focused and testable
- [ ] Update types in `src/types/index.ts` if needed

### 5. Testing & Validation

#### Development Testing:
```bash
# Run type checking
bun run build

# Manual testing with MCP client
# Test all acceptance criteria scenarios
# Test error states and edge cases
```

#### Testing Checklist:
- [ ] **Happy Path**: Primary user flow works as expected
- [ ] **Edge Cases**: Empty states, invalid inputs, network errors
- [ ] **Integration**: Works with existing features
- [ ] **Performance**: No significant slowdowns
- [ ] **Type Safety**: No TypeScript errors

### 6. Documentation & Communication

#### Code Documentation:
- [ ] Add JSDoc comments for new functions/classes
- [ ] Update README if public APIs changed
- [ ] Document any new environment variables
- [ ] Add inline comments for complex logic

#### Progress Communication:
- [ ] Update story status in ticket system
- [ ] Note any blockers or scope changes
- [ ] Document testing steps for reviewers

### 7. Pre-Commit Checklist

#### Final Validation:
```bash
# Clean build
bun run build

# Final manual test of acceptance criteria
# Check for console errors or warnings
```

#### Code Review Prep:
- [ ] All acceptance criteria met
- [ ] No debugging code left behind
- [ ] Meaningful commit messages prepared with Shortcut ticket reference
- [ ] Consider if changes need documentation updates

### MCP-Specific Considerations

#### Server Development:
- [ ] Test tool registration with MCP client
- [ ] Verify resource handlers work correctly
- [ ] Check error handling for malformed requests
- [ ] Validate JSON schemas for new tools

#### API Integration:
- [ ] Handle network failures gracefully
- [ ] Implement proper rate limiting if needed
- [ ] Add logging for debugging external API calls
- [ ] Consider caching strategies for performance

### Quick Reference Commands

```bash
# Development workflow
bun run dev          # Start development server
bun run build        # Type check and build
bun run start        # Run built server

# Git workflow
git status           # Check current changes
git add .            # Stage changes
git commit -m "..."  # Commit with conventional format + [sc-xxxxx] or "refs sc-xxxxx"
git push origin [branch-name]  # Push for review
```

#### Commit Message Examples with Shortcut Integration:
```bash
# Using [sc-xxxxx] format
git commit -m "feat: add dataset search functionality [sc-45538]"
git commit -m "fix: resolve API timeout issue [sc-45539]"
git commit -m "docs: update MCP server documentation [sc-45540]"

# Using "refs sc-xxxxx" format  
git commit -m "feat: implement user authentication - refs sc-45538"
git commit -m "refactor: optimize search performance - refs sc-45539"
```

### Success Criteria

Before marking the story complete:
- [ ] All acceptance criteria demonstrably met
- [ ] Code builds without errors or warnings
- [ ] Manual testing completed successfully
- [ ] Ready for code review and deployment
- [ ] Documentation updated as needed

**Remember**: Start with the minimum viable implementation that meets acceptance criteria. You can always iterate and improve in follow-up stories.
