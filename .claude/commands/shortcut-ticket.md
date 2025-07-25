Create a shortcut ticket if I dont' give you one (`$ARGUMENTS`) or else look at the existing one and rewrite it to these specifications, including the title, description, and related stories.

# Instructions for Creating Comprehensive Shortcut Tickets

## Overview
When creating a Shortcut ticket, you must provide a complete specification that enables any team member to understand the problem, its context, and implementation requirements. Follow this structured approach to ensure all critical aspects are covered.

## Workflow
Unless you know a ticket is for the Frontend, always use the Default Workflow, Team Backend for all Shortcut tickets you create. 

## Required Sections

### 1. Problem Statement
**Purpose**: Clearly articulate the problem being solved

Include:
- **Current State**: What is happening now that needs to change?
- **Desired State**: What should happen instead?
- **Impact**: Who is affected and how severely?
- **Evidence**: Data, user feedback, or metrics supporting the problem
- **Priority Justification**: Why solve this now vs. later?

Example format:
```
## Problem Statement
Currently, [describe current situation]. This causes [specific problems] for [affected users/systems].
We need to [desired outcome] to achieve [business value/user benefit].

Evidence:
- [Metric/feedback point 1]
- [Metric/feedback point 2]

Priority: [High/Medium/Low] because [justification]
```

### 2. Product Context & Integration
**Purpose**: Explain how this fits within the existing product ecosystem

** ALWAYS LOOK AT EXISTING CODE TO UNDERSTAND THE CONTEXT OF WHAT WE ARE BEING ASKED TO CREATE OR UPDATE **

Include:
- **Related Features**: List existing features this will interact with
- **Dependencies**: What systems/services does this depend on?
- **Integration Points**: APIs, databases, or services to be modified
- **User Journey**: Where does this fit in the user's workflow?
- **Technical Architecture**: How does this align with current architecture?

Example format:
```
## Product Context
This feature relates to:
- **Existing Feature A**: [How it connects/modifies/extends]
- **Service B**: [Integration requirements]
- **Database C**: [Data model impacts]

User Journey:
1. User currently does [X]
2. With this change, user will [Y]
3. This improves [Z] in their workflow
```

### 3. Product Requirements
**Purpose**: Define what needs to be built

Structure as:
```
## Functional Requirements
### Must Have (P0)
- [ ] Requirement 1 with clear acceptance criteria
- [ ] Requirement 2 with measurable outcome

### Should Have (P1)
- [ ] Enhancement that improves core functionality
- [ ] Additional feature that adds significant value

### Nice to Have (P2)
- [ ] Polish items
- [ ] Future considerations

## Non-Functional Requirements
- **Performance**: [Specific metrics, e.g., <200ms response time]
- **Scalability**: [Expected load, growth projections]
- **Security**: [Authentication, authorization, data protection needs]
- **Accessibility**: [WCAG compliance level required]
- **Browser/Device Support**: [Specific requirements]
```

### 4. SOC-2 Compliance Considerations
**Purpose**: Ensure security and compliance requirements are met

Address these areas:

```
- **Type**: [Bug, Feature, Chore, Enhancement, etc.]
- **Responsible Team**: [Team name or squad responsible for implementation]

## SOC-2 Compliance Checklist
### Security
- [ ] Data encryption requirements (at rest/in transit)
- [ ] Authentication/authorization changes needed
- [ ] API security considerations
- [ ] Vulnerability assessment needed?

### Availability
- [ ] SLA impact assessment
- [ ] Redundancy requirements
- [ ] Disaster recovery considerations

### Processing Integrity
- [ ] Data validation rules
- [ ] Error handling requirements
- [ ] Transaction integrity needs

### Confidentiality
- [ ] PII/sensitive data handling
- [ ] Access control requirements
- [ ] Data classification

### Privacy
- [ ] User consent requirements
- [ ] Data retention policies
- [ ] Right to deletion considerations

### Security
- [ ] Data encryption requirements (at rest/in transit)
- [ ] Authentication/authorization changes needed
- [ ] API security considerations
- [ ] Vulnerability assessment needed?

### Availability
- [ ] SLA impact assessment
- [ ] Redundancy requirements
- [ ] Disaster recovery considerations

### Processing Integrity
- [ ] Data validation rules
- [ ] Error handling requirements
- [ ] Transaction integrity needs

### Confidentiality
- [ ] PII/sensitive data handling
- [ ] Access control requirements
- [ ] Data classification

### Privacy
- [ ] User consent requirements
- [ ] Data retention policies
- [ ] Right to deletion considerations
```

### 5. Technical Specification
**Purpose**: Provide implementation guidance

Include:
- **Proposed Solution**: High-level technical approach
- **API Changes**: New endpoints or modifications
- **Data Model Changes**: Schema updates, migrations
- **Performance Considerations**: Caching, optimization needs
- **Testing Strategy**: Unit, integration, E2E test requirements

### 6. Success Metrics & Monitoring
**Purpose**: Define how we'll measure success

```
## Success Metrics
- **Primary Metric**: [What proves this solved the problem]
- **Secondary Metrics**: [Supporting indicators]
- **Monitoring Requirements**: [Dashboards, alerts needed]
- **A/B Test Plan**: [If applicable]
```

### 7. Risks & Mitigation
**Purpose**: Identify potential issues proactively

```
## Risk Assessment
| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|-------------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Specific action] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Specific action] |
```

### 8. Implementation Plan
**Purpose**: Provide clear execution path

```
## Implementation Phases
### Phase 1: Foundation (Est: X days)
- [ ] Task 1
- [ ] Task 2

### Phase 2: Core Features (Est: Y days)
- [ ] Task 3
- [ ] Task 4

### Phase 3: Polish & Launch (Est: Z days)
- [ ] Testing
- [ ] Documentation
- [ ] Rollout plan
```

### 9. Additional Considerations

Include as relevant:
- **Documentation Needs**: User docs, API docs, runbooks
- **Training Requirements**: Team or customer training needed
- **Migration Strategy**: For existing data/users
- **Rollback Plan**: How to revert if issues arise
- **Communication Plan**: Stakeholder updates, user notifications
- **Legal/Compliance**: Beyond SOC-2 (GDPR, CCPA, etc.)

## Template Checklist

Before submitting, ensure you've addressed:
- [ ] Clear problem definition with evidence
- [ ] Product integration context
- [ ] Prioritized requirements with acceptance criteria
- [ ] SOC-2 compliance review
- [ ] Technical approach
- [ ] Success metrics defined
- [ ] Risks identified with mitigation
- [ ] Phased implementation plan
- [ ] All relevant additional considerations

## Tips for LLMs

1. **Be Specific**: Avoid vague language. Use concrete examples and metrics.
2. **Link Everything**: Reference ticket numbers, documentation links, and related PRs.
3. **Think Edge Cases**: Consider error states, empty states, and unusual user paths.
4. **Consider Scale**: Think beyond MVP - how will this work with 10x users?
5. **Security First**: Always consider security implications, even for seemingly simple features.
6. **User Voice**: Include actual user quotes or feedback when available.
7. **Visual Aids**: Add mockups, diagrams, or flowcharts when they clarify complex concepts.

## Example Ticket Structure

```markdown
# [Feature Name]: [Concise Description]

## Problem Statement
[Clear problem description with evidence]

## Product Context
[How this fits in our product]

## Requirements
### Functional Requirements
[Prioritized list]

### Non-Functional Requirements
[Performance, security, etc.]

## SOC-2 Compliance
[Completed checklist]

## Technical Specification
[Implementation approach]

## Success Metrics
[How we measure success]

## Risks
[Table of risks and mitigations]

## Implementation Plan
[Phased approach]

## Additional Notes
[Any other relevant information]
```

** TICKET DESCRIPTIONS ARE LIMITED to 10,000 CHARACTERS ** 

## Shortcut API Requirements for Creating Stories

When using the Shortcut MCP integration to create stories, you must:

1. **Use workflow ID, not team name**: The `team` parameter often fails. Instead, use the `workflow` parameter with a valid workflow ID from the organization.

2. **Get workflow IDs**: Use `mcp__shortcut__list-workflows` or `mcp__shortcut__list-teams` to find valid workflow IDs. Common workflow IDs:
   - `500000005` - Default workflow (most common)
   - `500002608` - Attribute Mapping workflow
   - `500000024` - Product Idea Workflow

3. **Required parameters for story creation**:
   - `name` (required) - Story title
   - `description` (optional but recommended) - Story details
   - `type` (optional, defaults to "feature") - Can be "feature", "bug", or "chore"
   - `epic` (optional) - Epic ID number to associate the story with
   - `workflow` (required if team fails) - Workflow ID number

4. **Epic association**: If you want to add the story to an epic, use the epic's public ID number (e.g., `45538`)

5. **Example successful creation**:
```javascript
mcp__shortcut__create-story({
  name: "Story title",
  description: "Detailed description with acceptance criteria",
  type: "chore",
  epic: 45538,
  workflow: 500000005
})
```

After creating the ticket, fetch it to make sure the changes have been applied.
