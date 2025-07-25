Create a PR for the current branch if one doesn't exist.  If one does exist, update it.  Use the guide below for best practices.

# Pull Request Best Practices Guide

## Overview
This guide outlines best practices for writing pull request (PR) titles and descriptions. Following these guidelines ensures your PRs are clear, reviewable, and maintain a consistent standard across our codebase.

## PR Title Guidelines

### Format
Use a consistent format that clearly communicates the change type and scope:

```
[Type] Brief description of change
```

### Types
- `[Feature]` - New functionality or capability
- `[Fix]` - Bug fixes or corrections
- `[Refactor]` - Code restructuring without changing functionality
- `[Perf]` - Performance improvements
- `[Docs]` - Documentation updates
- `[Test]` - Test additions or modifications
- `[Chore]` - Maintenance tasks, dependency updates
- `[Style]` - Code formatting, naming conventions

### Title Best Practices
1. **Be concise but descriptive** (50-72 characters ideal)
   - ✅ `[Feature] Add user authentication via OAuth2`
   - ❌ `[Feature] Added auth`

2. **Use imperative mood** (as if giving a command)
   - ✅ `[Fix] Resolve memory leak in data processor`
   - ❌ `[Fix] Fixed memory leak in data processor`

3. **Include ticket/issue reference when applicable**
   - ✅ `[Feature] Add payment gateway integration (PROJ-1234)`
   - ✅ `[Fix] Prevent duplicate submissions in checkout flow #5678`

4. **Be specific about what changed**
   - ✅ `[Refactor] Extract validation logic into separate service`
   - ❌ `[Refactor] Code cleanup`

## PR Description Template

Use this template for all PRs:

```markdown
## Summary
Brief overview of what this PR accomplishes and why it's needed.

## Changes Made
- Bullet point list of specific changes
- Group related changes together
- Be specific about what was modified

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Refactoring (no functional changes)
- [ ] Documentation update
- [ ] Performance improvement

## Testing
Describe the testing performed:
- Unit tests added/modified
- Integration tests
- Manual testing steps
- Test coverage impact

## Screenshots/Recordings (if applicable)
Include visual evidence for UI changes

## Related Issues
Closes #(issue number)
Related to #(issue number)

## Deployment Notes
Any special deployment considerations, migrations, or configuration changes

## Checklist
- [ ] Code follows team style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console.log or debug code left
- [ ] Breaking changes documented
- [ ] If this PR completes a Shortcut Ticket, move the Ticket into Review (in Workflow: Default)
```

## Writing Effective Descriptions

### Summary Section
The summary should answer three questions:
1. **What** does this PR do?
2. **Why** is this change necessary?
3. **How** does it solve the problem?

Example:
```markdown
## Summary
This PR implements rate limiting for our public API endpoints to prevent abuse and ensure service stability. Previously, there were no limits on API calls, which led to service degradation during high-traffic periods. This solution uses Redis to track and limit requests per IP address to 100 requests per minute.
```

### Changes Made Section
Be specific and organize changes logically:

```markdown
## Changes Made
Authentication Changes:
- Added JWT token validation middleware
- Implemented refresh token rotation
- Added token expiration handling

Database Changes:
- Created user_sessions table
- Added indexes for performance optimization
- Updated user table with last_login timestamp

API Changes:
- New endpoint: POST /api/auth/refresh
- Modified: GET /api/user/profile (now requires authentication)
- Deprecated: GET /api/user/public-profile
```

### Testing Section
Provide enough detail for reviewers to verify your testing:

```markdown
## Testing
Unit Tests:
- Added 15 new tests for AuthService
- Modified existing UserController tests for new auth flow
- Test coverage increased from 78% to 85%

Manual Testing:
1. Login with valid credentials - Success
2. Login with invalid credentials - Returns 401
3. Access protected endpoint with valid token - Success
4. Access protected endpoint with expired token - Returns 401, prompts refresh
5. Refresh token flow - Successfully generates new token pair

Load Testing:
- Tested with 1000 concurrent users
- Average response time: 45ms
- No memory leaks detected
```

## Best Practices by PR Type

### Feature PRs
- Clearly explain the business value
- Include user-facing changes
- Document any new APIs or interfaces
- Provide usage examples if applicable

### Bug Fix PRs
- Describe the bug and its impact
- Explain root cause if known
- Include steps to reproduce
- Verify fix doesn't introduce regressions

### Refactoring PRs
- Justify why refactoring is needed
- Confirm no functional changes
- Highlight performance improvements if any
- Include before/after metrics when relevant

### Performance PRs
- Include benchmark results
- Show before/after comparisons
- Explain optimization techniques used
- Document any trade-offs

## Common Pitfalls to Avoid

1. **Vague descriptions**
   - ❌ "Fixed stuff"
   - ✅ "Fixed null pointer exception in user profile loader when email is missing"

2. **Missing context**
   - ❌ "Updated API"
   - ✅ "Updated API to support pagination for large result sets (>1000 items)"

3. **Combining unrelated changes**
   - Keep PRs focused on a single concern
   - Create separate PRs for unrelated fixes

4. **Insufficient testing information**
   - Always describe how changes were tested
   - Include edge cases considered

5. **Forgetting deployment considerations**
   - Note any database migrations
   - Mention configuration changes
   - Flag breaking changes prominently

## Review-Friendly Practices

1. **Keep PRs small and focused**
   - Aim for <400 lines of changes
   - Split large features into smaller PRs

2. **Provide context for reviewers**
   - Link to design docs or discussions
   - Explain complex algorithms or business logic

3. **Use draft PRs for work in progress**
   - Mark PR as draft if not ready for review
   - Update description when ready

4. **Respond to feedback constructively**
   - Address all comments before requesting re-review
   - Explain if you disagree with suggestions

## Examples of Excellent PR Descriptions

### Feature Example
```markdown
## Summary
Implements real-time notifications for order status updates. Customers previously had to refresh the page to see order updates, leading to poor user experience and increased server load. This PR adds WebSocket support to push updates instantly when order status changes.

## Changes Made
Backend:
- Added WebSocket server using Socket.io
- Created NotificationService for managing connections
- Integrated with existing OrderService for status updates

Frontend:
- Added WebSocket client connection handling
- Created notification toast component
- Updated order tracking page with real-time updates

Infrastructure:
- Added Redis for managing WebSocket sessions across servers
- Updated nginx configuration for WebSocket support

[... continues with full template ...]
```

### Bug Fix Example
```markdown
## Summary
Fixes critical bug where users could place duplicate orders by rapidly clicking the submit button. This resulted in multiple charges and inventory discrepancies. The fix implements request debouncing and adds server-side duplicate detection.

## Changes Made
- Added 2-second debounce to order submit button
- Implemented idempotency key for order creation endpoint
- Added database constraint to prevent duplicate orders within 5-minute window
- Updated error handling to show user-friendly messages

[... continues with full template ...]
```

Remember: A well-written PR description saves review time, prevents misunderstandings, and serves as valuable documentation for future reference. Take the time to write clear, comprehensive PR descriptions—your teammates and future self will thank you!
