# Requirements Templates Reference
**Version:** 1.0.0
**Date:** 2026-02-01

This document contains all templates for creating requirements artifacts. Copy and customize these templates when creating new epics, features, and specs.

---

## Table of Contents

1. [Epic Template](#epic-template)
2. [Feature Template (Simple)](#feature-template-simple)
3. [Feature Template (Complex)](#feature-template-complex)
4. [Spec Template (index.md - Requirements)](#spec-template-indexmd---requirements)
5. [Spec Template (design.md)](#spec-template-designmd)
6. [Spec Template (tasks.md)](#spec-template-tasksmd)
7. [EARS Notation Guide](#ears-notation-guide)

---

## Epic Template

**Filename:** `epic_{ID}-{title}.md`

**Example:** `epic_001-spec-driven-development.md`

```markdown
---
id: "001"
type: epic
title: "Epic Title Here"
status: planning
created: YYYY-MM-DD
updated: YYYY-MM-DD
children:
  - feat_xxx_e001-feature-name
tags:
  - tag1
  - tag2
---

# Epic: [Epic Title Here]

## Vision

[Describe the high-level business objective or strategic goal this epic addresses. What problem are we solving? What opportunity are we pursuing?]

## Business Value

[Explain the value this epic delivers to users, the business, or stakeholders. Include metrics or KPIs if applicable.]

## Success Criteria

[Define what success looks like. How will we know when this epic is complete and successful?]

- [ ] Success criterion 1
- [ ] Success criterion 2
- [ ] Success criterion 3

## Scope

### In Scope

[What is included in this epic?]

- Item 1
- Item 2

### Out of Scope

[What is explicitly excluded?]

- Item 1
- Item 2

## Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Milestone 1 | YYYY-MM-DD | pending |
| Milestone 2 | YYYY-MM-DD | pending |

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Owner | [Name] | Overall accountability |
| Contributor | [Name] | [Specific role] |

## Features

This epic includes the following features:

- [Feature Name 1](../features/feature_xxx-feature-name/index.md) - Brief description
- [Feature Name 2](../features/feature_xxx-feature-name/index.md) - Brief description

## Dependencies

[List any external dependencies, integrations, or prerequisites]

- Dependency 1
- Dependency 2

## Risks and Assumptions

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High/Medium/Low | Mitigation strategy |

### Assumptions

- Assumption 1
- Assumption 2

## Timeline

[High-level timeline or phases]

**Phase 1:** [Description] - Target: YYYY-MM-DD
**Phase 2:** [Description] - Target: YYYY-MM-DD

## Notes

[Additional context, references, or considerations]
```

---

## Feature Template (Simple)

**Filename:** `feat_{ID}_e{EPIC-ID}-{title}.md`

**Example:** `feat_003_e001-simple-workflow.md`

**Use when:** Feature has 3 or fewer user stories and doesn't need separate AC documentation

```markdown
---
id: "003"
type: feature
title: "Feature Title Here"
status: planning
created: YYYY-MM-DD
updated: YYYY-MM-DD
parent: epic_xxx-epic-name
children:
  - spec_xxx_f003-spec-name
tags:
  - tag1
  - tag2
---

# Feature: [Feature Title Here]

**Parent Epic:** [Epic Name](../epics/epic_xxx-epic-name.md)

## Description

[Describe what this feature does and why it's valuable. What capability does it provide?]

## User Stories

### Story 1: [Story Title]

**As a** [user role]
**I want** [goal/desire]
**So that** [benefit/value]

**Acceptance Criteria:**
- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

### Story 2: [Story Title]

**As a** [user role]
**I want** [goal/desire]
**So that** [benefit/value]

**Acceptance Criteria:**
- [ ] AC 1
- [ ] AC 2

## Functional Requirements

- REQ-F-001: [Requirement description]
- REQ-F-002: [Requirement description]

## Non-Functional Requirements

- REQ-NF-001: [Performance, security, usability, etc.]
- REQ-NF-002: [Requirement description]

## Specifications

This feature is implemented through the following specs:

- [Spec Name 1](../specs/spec_xxx-spec-name/index.md) - Brief description
- [Spec Name 2](../specs/spec_xxx-spec-name/index.md) - Brief description

## Dependencies

[Any dependencies on other features, systems, or external factors]

- Dependency 1
- Dependency 2

## Notes

[Additional context, references, or considerations]
```

---

## Feature Template (Complex)

**Folder:** `feat_{ID}_e{EPIC-ID}-{title}/`

**Example:** `feat_001_e001-architecture-review/`

### index.md

**Use when:** Feature has 4+ user stories or needs detailed AC documentation

```markdown
---
id: "001"
type: feature
title: "Feature Title Here"
status: planning
created: YYYY-MM-DD
updated: YYYY-MM-DD
parent: epic_xxx-epic-name
children:
  - spec_xxx_f001-spec-name
tags:
  - tag1
  - tag2
---

# Feature: [Feature Title Here]

**Parent Epic:** [Epic Name](../epics/epic_xxx-epic-name.md)

**Related Documents:**
- [User Stories](./user-stories.md)
- [Acceptance Criteria](./acceptance-criteria.md)

## Description

[Describe what this feature does and why it's valuable. What capability does it provide?]

## Overview

[High-level overview of the feature's functionality and scope]

## User Stories

See [User Stories](./user-stories.md) for detailed user stories.

**Summary:**
- Story 1: [Brief description]
- Story 2: [Brief description]
- Story 3: [Brief description]

## Acceptance Criteria

See [Acceptance Criteria](./acceptance-criteria.md) for detailed acceptance criteria.

## Functional Requirements

- REQ-F-001: [Requirement description]
- REQ-F-002: [Requirement description]

## Non-Functional Requirements

- REQ-NF-001: [Performance, security, usability, etc.]
- REQ-NF-002: [Requirement description]

## Specifications

This feature is implemented through the following specs:

- [Spec Name 1](../specs/spec_xxx-spec-name/index.md) - Brief description
- [Spec Name 2](../specs/spec_xxx-spec-name/index.md) - Brief description

## Dependencies

[Any dependencies on other features, systems, or external factors]

- Dependency 1
- Dependency 2

## Notes

[Additional context, references, or considerations]
```

### user-stories.md

```markdown
# User Stories: [Feature Title]

**Feature:** [Feature Title Here](./index.md)

---

## Story 1: [Story Title]

**Priority:** High | Medium | Low

**As a** [user role]
**I want** [goal/desire]
**So that** [benefit/value]

### Context

[Additional context about this user story, why it's important, how it fits into the feature]

### Acceptance Criteria

- [ ] AC 1
- [ ] AC 2
- [ ] AC 3

### Notes

[Any additional notes, edge cases, or considerations]

---

## Story 2: [Story Title]

**Priority:** High | Medium | Low

**As a** [user role]
**I want** [goal/desire]
**So that** [benefit/value]

### Context

[Additional context]

### Acceptance Criteria

- [ ] AC 1
- [ ] AC 2

### Notes

[Additional notes]

---

## Story 3: [Story Title]

[Repeat pattern for additional stories]
```

### acceptance-criteria.md

```markdown
# Acceptance Criteria: [Feature Title]

**Feature:** [Feature Title Here](./index.md)

---

## Story 1: [Story Title]

### Functional AC

- [ ] **AC-F-1.1:** [Functional acceptance criterion]
- [ ] **AC-F-1.2:** [Functional acceptance criterion]
- [ ] **AC-F-1.3:** [Functional acceptance criterion]

### Non-Functional AC

- [ ] **AC-NF-1.1:** [Performance criterion]
- [ ] **AC-NF-1.2:** [Security criterion]
- [ ] **AC-NF-1.3:** [Usability criterion]

### Edge Cases

- [ ] **AC-E-1.1:** [Edge case criterion]
- [ ] **AC-E-1.2:** [Edge case criterion]

---

## Story 2: [Story Title]

### Functional AC

- [ ] **AC-F-2.1:** [Functional acceptance criterion]
- [ ] **AC-F-2.2:** [Functional acceptance criterion]

### Non-Functional AC

- [ ] **AC-NF-2.1:** [Performance criterion]

---

## Cross-Story AC

### Integration

- [ ] **AC-I-1:** [Integration criterion across multiple stories]
- [ ] **AC-I-2:** [Integration criterion]

### System-Wide

- [ ] **AC-S-1:** [System-wide criterion]
- [ ] **AC-S-2:** [System-wide criterion]
```

---

## Spec Template (index.md - Requirements)

**Folder:** `spec_{ID}_f{FEAT-ID}-{title}/`

**File:** `index.md`

**Example:** `spec_001_f001-solutions-architect-agent/index.md`

```markdown
---
id: "001"
type: spec
title: "Spec Title Here"
status: planning
created: YYYY-MM-DD
updated: YYYY-MM-DD
parent: feature_xxx-feature-name
tags:
  - tag1
  - tag2
---

# Spec: [Spec Title Here]

**Parent Feature:** [Feature Name](../features/feat_xxx_e001-feature-name/index.md)

**Related Documents:**
- [Design](./design.md)
- [Tasks](./tasks.md)

## Overview

[Brief description of what this spec implements and why]

## User Stories

### Story 1: [Story Title]

**EARS Notation:**

**WHEN** [trigger/precondition]
**THE SYSTEM SHALL** [system response]

**Examples:**
- Example 1: [Concrete example]
- Example 2: [Concrete example]

### Story 2: [Story Title]

**EARS Notation:**

**WHERE** [feature applies]
**THE SYSTEM SHALL** [system capability]

**Examples:**
- Example 1: [Concrete example]

## Functional Requirements

### Core Functionality

- **REQ-F-001:** [Requirement description with clear, testable criteria]
- **REQ-F-002:** [Requirement description]

### Input/Output

- **REQ-IO-001:** [Input requirement]
- **REQ-IO-002:** [Output requirement]

### Validation

- **REQ-V-001:** [Validation requirement]
- **REQ-V-002:** [Error handling requirement]

## Non-Functional Requirements

### Performance

- **REQ-P-001:** [Performance requirement with specific metrics]
- **REQ-P-002:** [Response time, throughput, etc.]

### Security

- **REQ-S-001:** [Security requirement]
- **REQ-S-002:** [Authentication, authorization, etc.]

### Usability

- **REQ-U-001:** [Usability requirement]
- **REQ-U-002:** [User experience requirement]

### Reliability

- **REQ-R-001:** [Reliability requirement]
- **REQ-R-002:** [Error recovery, failover, etc.]

## Constraints

[Technical, business, or environmental constraints]

- Constraint 1
- Constraint 2

## Assumptions

[Assumptions made during requirements gathering]

- Assumption 1
- Assumption 2

## Dependencies

[Dependencies on other specs, systems, libraries, or external factors]

- Dependency 1: [Description]
- Dependency 2: [Description]

## Success Criteria

[How we'll know this spec is successfully implemented]

- [ ] Success criterion 1
- [ ] Success criterion 2
- [ ] Success criterion 3

## Out of Scope

[Explicitly state what this spec does NOT include]

- Out of scope item 1
- Out of scope item 2

## Notes

[Additional context, references, research, or considerations]
```

---

## Spec Template (design.md)

**File:** `design.md`

```markdown
# Design: [Spec Title Here]

**Spec:** [Spec Title Here](./index.md)

---

## Architecture Overview

[High-level architecture diagram and description]

```
[ASCII diagram or link to external diagram]
```

### Components

| Component | Responsibility | Technology |
|-----------|----------------|------------|
| Component 1 | [Description] | [Tech stack] |
| Component 2 | [Description] | [Tech stack] |

## Detailed Design

### Component 1: [Name]

**Purpose:** [What this component does]

**Responsibilities:**
- Responsibility 1
- Responsibility 2

**Interface:**

```typescript
// Example interface definition
interface ComponentInterface {
  method1(param: Type): ReturnType;
  method2(param: Type): ReturnType;
}
```

**Implementation Notes:**
- Note 1
- Note 2

### Component 2: [Name]

[Repeat pattern for each component]

## Data Models

### Model 1: [Name]

```typescript
// Example data model
interface ModelName {
  field1: Type;
  field2: Type;
  field3: Type;
}
```

**Description:** [What this model represents]

**Relationships:**
- Relationship to Model 2: [Description]

### Model 2: [Name]

[Repeat pattern for each model]

## API Design

### Endpoint 1: [Name]

**Method:** GET | POST | PUT | DELETE
**Path:** `/api/v1/resource`

**Request:**

```json
{
  "field1": "value",
  "field2": "value"
}
```

**Response:**

```json
{
  "field1": "value",
  "field2": "value"
}
```

**Error Codes:**
- 400: [Description]
- 404: [Description]
- 500: [Description]

### Endpoint 2: [Name]

[Repeat pattern for each endpoint]

## Database Design

### Tables

**Table 1: [Name]**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | [Description] |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Index 1: `idx_name` on `name`

**Relationships:**
- Foreign key to Table 2

## State Management

[How state is managed in the system]

### State Flow

```
[State diagram or flow description]
```

### State Transitions

| From State | Event | To State | Validation |
|------------|-------|----------|------------|
| State A | Event 1 | State B | [Validation rules] |

## Error Handling

### Error Categories

| Category | Handling Strategy | Recovery |
|----------|-------------------|----------|
| User Error | Validate input, return 400 | User corrects input |
| System Error | Log, return 500 | Retry or fallback |

### Error Codes

- **ERR-001:** [Description and handling]
- **ERR-002:** [Description and handling]

## Security Design

### Authentication

[How users/systems are authenticated]

### Authorization

[How permissions are enforced]

### Data Protection

[How sensitive data is protected]

## Performance Considerations

### Optimization Strategies

- Strategy 1: [Description]
- Strategy 2: [Description]

### Caching

| Layer | Strategy | TTL |
|-------|----------|-----|
| Layer 1 | [Strategy] | [Time] |

### Scalability

[How the system scales]

## Technical Decisions

### Decision 1: [Title]

**Context:** [Why this decision was needed]

**Options Considered:**
1. Option A: [Pros/Cons]
2. Option B: [Pros/Cons]

**Decision:** [Chosen option]

**Rationale:** [Why this option was chosen]

**Consequences:** [Impact of this decision]

### Decision 2: [Title]

[Repeat pattern for each decision]

## Dependencies

### External Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Library 1 | v1.2.3 | [Purpose] |

### Internal Dependencies

- Dependency 1: [Description]
- Dependency 2: [Description]

## Testing Strategy

### Unit Tests

[What will be unit tested and how]

### Integration Tests

[What will be integration tested and how]

### E2E Tests

[What will be E2E tested and how]

## Deployment

### Environment Configuration

| Environment | Config |
|-------------|--------|
| Development | [Config details] |
| Staging | [Config details] |
| Production | [Config details] |

### Migration Strategy

[How this will be deployed/migrated]

## Monitoring and Observability

### Metrics

- Metric 1: [What to monitor]
- Metric 2: [What to monitor]

### Logging

[What to log and at what levels]

### Alerting

[What conditions trigger alerts]

## Future Considerations

[Potential future enhancements or refactorings]

- Consideration 1
- Consideration 2

## References

[Links to external documentation, research, or related materials]

- Reference 1
- Reference 2
```

---

## Spec Template (tasks.md)

**File:** `tasks.md`

```markdown
# Tasks: [Spec Title Here]

**Spec:** [Spec Title Here](./index.md)

---

## Implementation Checklist

### Phase 1: Setup and Foundation

- [ ] **TASK-001:** Set up project structure
  - [ ] Create directory structure
  - [ ] Initialize configuration files
  - [ ] Set up build tooling

- [ ] **TASK-002:** Set up development environment
  - [ ] Configure linting and formatting
  - [ ] Set up pre-commit hooks
  - [ ] Configure test framework

- [ ] **TASK-003:** Create data models
  - [ ] Define interfaces/types
  - [ ] Create database schemas
  - [ ] Set up migrations

### Phase 2: Core Implementation

- [ ] **TASK-004:** Implement Component 1
  - [ ] Create base implementation
  - [ ] Add validation logic
  - [ ] Handle error cases

- [ ] **TASK-005:** Implement Component 2
  - [ ] Create base implementation
  - [ ] Integrate with Component 1
  - [ ] Add logging

- [ ] **TASK-006:** Implement API endpoints
  - [ ] Create route handlers
  - [ ] Add request validation
  - [ ] Add response formatting

### Phase 3: Integration

- [ ] **TASK-007:** Integrate with external systems
  - [ ] Set up API clients
  - [ ] Implement retry logic
  - [ ] Add circuit breakers

- [ ] **TASK-008:** Implement state management
  - [ ] Create state store
  - [ ] Add state transitions
  - [ ] Implement persistence

### Phase 4: Testing

- [ ] **TASK-009:** Write unit tests
  - [ ] Component 1 tests (target: 80% coverage)
  - [ ] Component 2 tests (target: 80% coverage)
  - [ ] Utility function tests

- [ ] **TASK-010:** Write integration tests
  - [ ] API endpoint tests
  - [ ] Database integration tests
  - [ ] External service integration tests

- [ ] **TASK-011:** Write E2E tests
  - [ ] Happy path scenarios
  - [ ] Error scenarios
  - [ ] Edge cases

### Phase 5: Documentation

- [ ] **TASK-012:** Write code documentation
  - [ ] Add JSDoc/docstrings to all public APIs
  - [ ] Document complex algorithms
  - [ ] Add inline comments for non-obvious logic

- [ ] **TASK-013:** Write user documentation
  - [ ] API documentation
  - [ ] Usage examples
  - [ ] Configuration guide

- [ ] **TASK-014:** Write operational documentation
  - [ ] Deployment guide
  - [ ] Monitoring guide
  - [ ] Troubleshooting guide

### Phase 6: Deployment

- [ ] **TASK-015:** Set up CI/CD
  - [ ] Configure build pipeline
  - [ ] Configure test pipeline
  - [ ] Configure deployment pipeline

- [ ] **TASK-016:** Deploy to staging
  - [ ] Deploy application
  - [ ] Run smoke tests
  - [ ] Verify monitoring

- [ ] **TASK-017:** Deploy to production
  - [ ] Deploy application
  - [ ] Run smoke tests
  - [ ] Monitor for issues

### Phase 7: Post-Deployment

- [ ] **TASK-018:** Monitor and optimize
  - [ ] Review performance metrics
  - [ ] Optimize slow queries
  - [ ] Address memory leaks

- [ ] **TASK-019:** Gather feedback
  - [ ] Collect user feedback
  - [ ] Review error logs
  - [ ] Identify improvements

## Dependencies

| Task | Depends On | Notes |
|------|------------|-------|
| TASK-004 | TASK-003 | Needs data models |
| TASK-005 | TASK-004 | Needs Component 1 |
| TASK-009 | TASK-004, TASK-005 | Needs implementations |

## Estimates

| Phase | Estimated Effort | Actual Effort |
|-------|-----------------|---------------|
| Phase 1: Setup | [X days] | |
| Phase 2: Core | [X days] | |
| Phase 3: Integration | [X days] | |
| Phase 4: Testing | [X days] | |
| Phase 5: Documentation | [X days] | |
| Phase 6: Deployment | [X days] | |
| Phase 7: Post-Deployment | [X days] | |
| **Total** | **[X days]** | |

## Risks and Blockers

| Risk/Blocker | Impact | Mitigation | Status |
|-------------|--------|------------|--------|
| Risk 1 | High/Medium/Low | [Mitigation strategy] | Open/Resolved |
| Blocker 1 | High/Medium/Low | [Resolution plan] | Open/Resolved |

## Notes

[Additional task-related notes, considerations, or updates]

---

## Task Status Legend

- [ ] Not started
- [x] Completed
- [~] In progress (use comments to track)
- [!] Blocked (document blocker in notes)
```

---

## EARS Notation Guide

**EARS** = **E**asy **A**pproach to **R**equirements **S**yntax

Use EARS notation to write clear, unambiguous user stories and requirements.

### EARS Templates

#### 1. Ubiquitous (Always Active)

```
THE SYSTEM SHALL [system response]
```

**Example:**
```
THE SYSTEM SHALL log all user authentication attempts
```

---

#### 2. Event-Driven (Triggered)

```
WHEN [trigger/event]
THE SYSTEM SHALL [system response]
```

**Example:**
```
WHEN a user clicks the "Submit" button
THE SYSTEM SHALL validate all form fields
```

---

#### 3. State-Driven (Conditional)

```
WHILE [in specific state]
THE SYSTEM SHALL [system response]
```

**Example:**
```
WHILE the user is authenticated
THE SYSTEM SHALL display the user's dashboard
```

---

#### 4. Unwanted Behavior (Error Handling)

```
IF [unwanted condition]
THEN THE SYSTEM SHALL [system response]
```

**Example:**
```
IF the API request fails
THEN THE SYSTEM SHALL retry up to 3 times with exponential backoff
```

---

#### 5. Optional (Feature-Specific)

```
WHERE [feature applies]
THE SYSTEM SHALL [system capability]
```

**Example:**
```
WHERE the user has admin privileges
THE SYSTEM SHALL allow access to the admin panel
```

---

### EARS Best Practices

1. **Be Specific:** Avoid vague terms like "quickly", "user-friendly", "robust"
2. **Be Measurable:** Include quantifiable criteria where possible
3. **Be Testable:** Each requirement should be verifiable
4. **Be Atomic:** One requirement per statement
5. **Be Consistent:** Use the same terminology throughout

### Bad vs. Good Examples

**Bad:**
```
The system should be fast and responsive
```

**Good:**
```
WHEN a user submits a search query
THE SYSTEM SHALL return results within 200ms for 95% of requests
```

---

**Bad:**
```
The system should handle errors gracefully
```

**Good:**
```
IF a database connection fails
THEN THE SYSTEM SHALL log the error, display a user-friendly message, and retry the connection after 5 seconds
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-01 | Initial templates for epic, feature, spec |

---

## Quick Reference

### When to Use Each Template

| Artifact | Use When | File Structure |
|----------|----------|----------------|
| **Epic** | Defining major business initiative | Single file |
| **Feature (Simple)** | 3 or fewer user stories | Single file |
| **Feature (Complex)** | 4+ user stories, needs detailed AC | Folder with index.md, user-stories.md, acceptance-criteria.md |
| **Spec** | Implementing specific functionality | Folder with index.md, design.md, tasks.md |

### File Naming Quick Reference

```
epic_{ID}-{title}.md
feat_{ID}_e{EPIC-ID}-{title}.md  OR  feat_{ID}_e{EPIC-ID}-{title}/index.md
spec_{ID}_f{FEAT-ID}-{title}/index.md (always a folder)
```
