# integrated-design-spec: Three-Tier Specification Structure Guide

**Purpose**: Comprehensive guide to the three-tier specification hierarchy for the integrated-design-spec plugin

**Created**: 2025-12-13

---

## Overview: Three Tiers, Three Files Per Tier

The `integrated-design-spec` plugin organizes specifications into a three-tier hierarchy, with each tier containing exactly **three core files** that serve different purposes:

```
Epic (Business Initiative)
├── requirements.md          → Business vision, goals, Feature list
├── design.md               → Technical direction, architectural decisions
└── tasks.md                → Features to develop

    Feature (Specific Capability)
    ├── requirements.md          → Business capabilities, User Stories
    ├── design.md               → Technical architecture, data flows
    └── tasks.md                → User Stories to implement

        User Story (Implementation Task)
        ├── requirements.md          → EARS format, acceptance criteria
        ├── design.md               → Technical details, specific APIs
        └── tasks.md                → Implementation steps, tests
```

---

## Tier 1: Epic Specifications

**Scope**: Strategic business initiatives broken down into Features

**Audience**: Executive stakeholders, product managers, lead architects

**Key Principle**: Answer "WHAT" (business goals) and "DIRECTION TO WHERE" (architectural direction), not "HOW" (implementation details)

### File 1: requirements.md (Epic Level)

**Purpose**: Articulate business vision, strategic goals, and Feature breakdown

**Content**:
- Executive summary of the initiative
- Vision statement
- Strategic goals (3-5 high-level business objectives)
- Success metrics (how we measure success)
- Feature breakdown (list of Features that compose this Epic)
  - Feature name and brief description
  - Business value statement
- Assumptions (what we assume to be true)
- Constraints (what limits our options)
- Risks and mitigations (what can go wrong and how we handle it)
- Relation to prior work (how this builds on existing efforts)

**Example Section**:
```markdown
## Feature Breakdown

### Feature 1: Multi-Tier Specification Framework
- Creates templates for Epic, Feature, and User Story specifications
- Validates specs for completeness and cross-tier consistency

**Business Value**: Teams can organize specifications hierarchically with
clear scope boundaries at each level.

### Feature 2: Specification Authoring Tools
- Provides commands to create specs at each tier
- Auto-fills templates and manages directory structures

**Business Value**: Specifications are created consistently with minimal
boilerplate; guidance prevents common mistakes.
```

**Questions Answered**:
- What is the business vision?
- What are our strategic goals?
- What Features do we need to build?
- How do we measure success?
- What are the risks?

### File 2: design.md (Epic Level)

**Purpose**: Establish directional technical architecture and key decisions

**Content**:
- Architectural vision (high-level principles)
- Technology categories (directional, not specific products)
  - Specification format (e.g., "Markdown, version-controllable")
  - Storage approach (e.g., "Directory-based, Git-native")
  - Validation approach (e.g., "Pattern matching + consistency checks")
  - Agent framework (e.g., "Claude-based agents with domain expertise")
- Data flow patterns (high-level, showing system interactions)
- Architectural questions to answer at Feature/Story levels
- Key architectural decisions and rationale
- Risks and technical mitigations

**Example Section**:
```markdown
## Technology Stack Categories

| Layer | Category | Direction | Rationale |
|-------|----------|-----------|-----------|
| **Format** | Markup | Markdown files | Version-controllable, human-readable |
| **Storage** | Files | Hierarchical directories | Mirrors spec tier structure |
| **Validation** | Rules | Pattern matching | Simple, maintainable |
| **Agents** | Agentic | Claude-based agents | Intelligent, domain-specific |
```

**Questions Answered**:
- What is our overall architecture?
- What technologies will we use (directionally)?
- How do systems interact?
- What key decisions have we made about technical approach?
- What questions need to be answered later?

### File 3: tasks.md (Epic Level)

**Purpose**: List the Features that must be developed

**Content**:
- Feature list with:
  - Feature name and purpose
  - Business value
  - Dependencies (which Features must complete first?)
  - Acceptance criteria (how do we know this Feature is done?)
  - Effort estimate (T-shirt sizing: S/M/L/XL or story points)
  - Priority (P0/P1/P2/P3)
- Feature sequencing and dependency diagram
- Parallel development opportunities
- Success criteria for Epic completion
- Release criteria

**Example Section**:
```markdown
## Feature Development Tasks

### Feature 1: Multi-Tier Specification Framework (BLOCKER)

**Purpose**: Create templates and validation rules for Epic, Feature,
and User Story specifications.

**Dependencies**: None (this is the blocker for all others)

**Acceptance Criteria**:
- [ ] All three templates created with section guidance
- [ ] Validation rules written and testable
- [ ] Sample specs demonstrate all three tiers
- [ ] All validation checks pass on samples

**Effort**: Large (6-8 user stories)
**Priority**: P0 (Critical - blocks all others)
```

**Questions Answered**:
- What Features are we building?
- In what order?
- What depends on what?
- How much effort is each Feature?
- When are we done?

---

## Tier 2: Feature Specifications

**Scope**: Specific business capabilities that contribute to an Epic

**Audience**: Product managers, architects, tech leads

**Key Principle**: Answer "WHAT SPECIFICALLY" (capabilities and User Stories) and "HOW ARCHITECTURALLY" (technical flows), not "HOW TO CODE" (language/framework specifics)

### File 1: requirements.md (Feature Level)

**Purpose**: Define specific business capabilities and prioritized User Stories

**Content**:
- Feature overview (what this Feature delivers)
- Business capabilities (specific, measurable)
  - What can users do?
  - What problems does it solve?
- Prioritized User Stories (P1/P2/P3)
  - User Story name and description
  - Why this priority?
  - Acceptance criteria summary
- Acceptance scenarios (Given-When-Then format)
- Edge cases (what happens in boundary conditions?)
- Success criteria (Feature-specific metrics)
- Dependencies on other Features

**Example Section**:
```markdown
## Prioritized User Stories

### User Story 1: Create Epic Specification (Priority: P1)

As a product manager, I want to create an Epic specification for a
new business initiative, so that the team understands the strategic
direction and feature breakdown.

**Acceptance Criteria**:
- User can invoke `/specid.epic` command
- Command collects initiative name and description
- Epic spec directory is created with three files
- requirements.md is populated with business vision template
- design.md is populated with architectural direction template
- tasks.md lists Features to be developed
- User can refine Feature list before committing

**Why P1**: This is the entry point for all Epic-level work; enables
downstream Feature and User Story creation.
```

**Questions Answered**:
- What specific capabilities does this Feature enable?
- What User Stories make up this Feature?
- How do we measure success?
- What edge cases do we need to handle?
- What does "done" look like?

### File 2: design.md (Feature Level)

**Purpose**: Refine architectural decisions and define technical flow

**Content**:
- Feature technical architecture
  - System components involved
  - Data models (high-level entity relationships)
  - Integration points (how does this Feature interact with others?)
  - Flow diagrams or sequence descriptions
- Refined technology decisions (answering Epic-level questions)
  - How specifically do we store specs?
  - What tools/libraries do we use?
  - How do components communicate?
- Performance and scalability considerations
- Security and privacy considerations
- Implementation constraints and dependencies
- Deferred decisions (what we'll decide at User Story level)

**Example Section**:
```markdown
## Technical Architecture

### Spec Authoring Flow

1. User invokes `/specid.epic` command
2. Claude Code launches spec authoring agent
3. Agent collects user inputs via prompts
4. Agent scaffolds directory structure
5. Agent fills template placeholders
6. User reviews and refines spec
7. Spec is committed to Git

### Directory Structure

specs/NNN-epic-name/
├── requirements.md
├── design.md
├── tasks.md
└── features/
    ├── MM-feature-name/
    │   ├── requirements.md
    │   ├── design.md
    │   ├── tasks.md
    │   └── stories/
    │       └── LL-story-name/
    │           ├── requirements.md
    │           ├── design.md
    │           └── tasks.md
```

**Questions Answered**:
- How does this Feature actually work (architecturally)?
- How do we build it (technology-wise)?
- How do components interact?
- What constraints affect design?
- What open questions remain for User Stories?

### File 3: tasks.md (Feature Level)

**Purpose**: List the User Stories that implement this Feature

**Content**:
- User Story list with:
  - User Story name and description
  - Business value
  - Dependencies (which User Stories must complete first?)
  - Acceptance criteria (how do we know it's done?)
  - Effort estimate
  - Priority
- User Story sequencing and dependency diagram
- Parallel development opportunities
- Success criteria for Feature completion
- Definition of done

**Example Section**:
```markdown
## User Story Development Tasks

### User Story 1: Create Epic Specification (P1)

**Purpose**: User can create an Epic spec with business vision and
Feature breakdown.

**Dependencies**: None (entry point for this Feature)

**Acceptance Criteria**:
- [ ] `/specid.epic` command creates Epic directory structure
- [ ] requirements.md template is auto-filled with placeholders
- [ ] User can input initiative name, vision, goals
- [ ] Feature list is generated from user input
- [ ] Spec passes validation from Feature 3
- [ ] User completes Epic spec in <30 minutes

**Effort**: Large (8-10 implementation tasks)
**Priority**: P1 (High - entry point)
```

**Questions Answered**:
- What User Stories implement this Feature?
- In what order?
- What dependencies exist?
- How much work is each User Story?
- When is the Feature complete?

---

## Tier 3: User Story Specifications

**Scope**: Implementation-ready, tactical requirements for a single user capability

**Audience**: Developers, QA engineers

**Key Principle**: Answer "EXACTLY HOW" (implementation details), including specific code, APIs, libraries, and tests

### File 1: requirements.md (User Story Level)

**Purpose**: Define user functionality in EARS format with detailed acceptance criteria

**Content**:
- User story in EARS (Easy Approach to Requirements Syntax) format:
  - **Actor**: Who is performing the action?
  - **Action**: What is the user doing?
  - **Benefit**: Why is the user doing this? What value does it provide?
- Detailed acceptance criteria (Given-When-Then format):
  - **Given** [initial state/context]
  - **When** [user action]
  - **Then** [expected outcome]
  - (Include 3-5 scenarios covering main flow and variations)
- Edge cases and error scenarios
- Definition of done (what makes this story truly complete?)
- Non-functional requirements (performance, security, accessibility)
- Assumptions and constraints

**Example Section**:
```markdown
## User Story: Create Epic Specification

**EARS Format**:

**Given** a product manager wants to initiate a new business initiative,
**When** the user invokes `/specid.epic` and provides initiative details
(name, vision statement, strategic goals),
**Then** an Epic specification is created with:
- Directory structure: `specs/NNN-epic-name/`
- Three files: requirements.md, design.md, tasks.md
- Placeholders auto-filled from user inputs
- Feature breakdown template ready for refinement

**Detailed Acceptance Criteria**:

1. **Given** user runs `/specid.epic "Platform Modernization"`
   **When** command collects initiative details
   **Then** Epic directory is created with proper naming convention (NNN-platform-modernization)

2. **Given** requirements.md is populated with user inputs
   **When** user reviews the file
   **Then** all placeholder tokens are replaced with actual content

3. **Given** Epic spec is complete
   **When** user runs validation
   **Then** spec passes all completeness checks (no [NEEDS CLARIFICATION] markers, all sections present)

## Definition of Done

- [x] All acceptance criteria are met
- [x] Epic spec passes validation from Feature 3
- [x] Directory structure follows naming convention
- [x] All placeholder tokens are replaced
- [x] Feature breakdown template is ready for Feature specs
- [x] Code committed to Git with clear commit message
```

**Questions Answered**:
- What exactly does the user do (step-by-step)?
- What are the acceptance criteria (testable, unambiguous)?
- What edge cases do we handle?
- How do we know this User Story is done?

### File 2: design.md (User Story Level)

**Purpose**: Specify technical implementation details

**Content**:
- Technical implementation approach
  - What code/components do we modify or create?
  - Which files, functions, classes are involved?
  - What libraries, frameworks, APIs do we use?
- Data structures and models (specific implementation)
  - Exact field names and types
  - Database schema or JSON structure
  - Data validation rules
- Algorithm or business logic (pseudocode or detailed description)
- API contracts or function signatures
- Error handling and validation
- Testing strategy (what do we test?)
- Performance requirements (specific metrics)
- Security requirements (specific controls)
- Deployment or integration notes

**Example Section**:
```markdown
## Technical Implementation

### Components Modified/Created

**New Files**:
- `plugins/integrated-design-spec/commands/specid.epic.md` - Command prompt and logic
- `plugins/integrated-design-spec/agents/epic-creator.md` - Epic creation agent prompt
- `plugins/integrated-design-spec/templates/epic-template.md` - Epic spec template

**Modified Files**:
- `.claude-plugin/marketplace.json` - Add integrated-design-spec plugin entry

### Data Structures

**Epic Spec Object** (in memory during command execution):
```javascript
{
  name: string,              // e.g., "Platform Modernization"
  slug: string,              // e.g., "platform-modernization"
  initiativeName: string,
  vision: string,
  strategicGoals: string[],  // 3-5 goals
  features: Array<{
    name: string,
    description: string,
    businessValue: string,
    priority: "P0" | "P1" | "P2" | "P3"
  }>,
  assumptions: string[],
  constraints: string[],
  risks: Array<{
    description: string,
    mitigation: string
  }>
}
```

### Command Execution Flow

1. `/specid.epic` invoked
2. Claude Code launches `epic-creator` agent
3. Agent prompts user for initiative name
4. Agent prompts for vision statement
5. Agent prompts for 3-5 strategic goals
6. Agent suggests Feature breakdown based on goals
7. User refines Feature list
8. Agent scaffolds directory structure: `specs/NNN-{slug}/`
9. Agent fills `requirements.md`, `design.md`, `tasks.md` templates
10. Agent returns spec paths to user
11. User commits to Git

### Validation Rules Applied

- Epic name must be 2-4 words
- Slug must be kebab-case (lowercase, hyphens)
- Must have 3-5 strategic goals (no fewer, no more)
- Each Feature must have a brief description and business value
- No placeholder tokens remain (all replaced with actual content)
```

**Questions Answered**:
- How do we implement this (exactly)?
- What code do we write?
- What APIs/libraries do we use?
- What data structures?
- What are the technical constraints?

### File 3: tasks.md (User Story Level)

**Purpose**: List the implementation steps/subtasks for execution

**Content**:
- Subtask list (individual coding/testing steps)
  - Task ID and description
  - Acceptance criteria (how to verify completion)
  - Estimated effort or time
  - Dependencies (must complete before next task)
- Test-first guidance:
  - Failing tests to write first (TDD)
  - Test fixtures or sample data
  - Test scenarios to cover
- Code organization (where files go, how to structure)
- Deployment or integration steps (if applicable)
- Verification checklist (how to test/validate)
- Git commit guidelines

**Example Section**:
```markdown
## Implementation Tasks

### Phase 1: Test-First (TDD)

Before writing any code, write these failing tests:

#### Task T001: Test Epic directory creation

**Test File**: `tests/commands/test-speckit-epic.md`

**Test Case 1: Directory structure creation**
```
Given: /specid.epic command is invoked with "Platform Modernization"
When: Command executes
Then:
  - Directory `specs/001-platform-modernization/` exists
  - Files `requirements.md`, `design.md`, `tasks.md` exist
  - All files contain expected section headers
```

**Test Case 2: Template filling**
```
Given: User provides initiative name and vision
When: Agent fills requirements.md template
Then:
  - All user inputs appear in correct sections
  - No placeholder tokens remain
  - All required sections are present
```

### Phase 2: Implementation

#### Task T002: Create epic-creator agent prompt

**File**: `plugins/integrated-design-spec/agents/epic-creator.md`

**Implementation Steps**:
1. Define agent persona and expertise
2. Write prompt for collecting initiative details
3. Write prompt for suggesting Feature breakdown
4. Write prompt for populating spec templates
5. Add error handling for invalid inputs
6. Test with sample inputs

**Definition of Done**:
- [ ] Agent prompt is clear and unambiguous
- [ ] Agent successfully collects all required inputs
- [ ] Agent generates valid spec content
- [ ] Agent handles edge cases (empty inputs, very long inputs, special characters)

#### Task T003: Create specid.epic command

**File**: `plugins/integrated-design-spec/commands/specid.epic.md`

**Implementation Steps**:
1. Create command scaffold
2. Invoke epic-creator agent with user input
3. Parse agent output
4. Create directory structure using file system operations
5. Write spec files (requirements.md, design.md, tasks.md)
6. Return paths to user
7. Test end-to-end

**Definition of Done**:
- [ ] Command is callable via `/specid.epic`
- [ ] All 6 test cases pass
- [ ] Generated specs pass validation checks
- [ ] User can complete flow in <10 minutes

### Phase 3: Verification

#### Task T004: Validate generated specs

**Verification Checklist**:
- [ ] Run Feature 3 validator on generated specs
- [ ] All sections are present (no [NEEDS CLARIFICATION])
- [ ] Naming conventions are followed
- [ ] No placeholder tokens remain
- [ ] Feature breakdown is coherent

#### Task T005: Integration testing

**Test Scenarios**:
- [ ] Create Epic with minimal inputs (only required fields)
- [ ] Create Epic with detailed inputs (all optional fields filled)
- [ ] Create Epic and immediately create Feature under it (integration with Feature command)
- [ ] Verify Epic appears in spec catalog

### Phase 4: Documentation

#### Task T006: Create command documentation

**File**: `plugins/integrated-design-spec/commands/specid.epic.md` (inline documentation)

**Content**:
- [ ] Command description and purpose
- [ ] Syntax and usage examples
- [ ] Example output (what a created Epic looks like)
- [ ] Common use cases and workflows
- [ ] Troubleshooting tips

#### Task T007: Create tutorial/quickstart

**File**: `docs/quickstart-epic.md`

**Content**:
- [ ] Step-by-step walkthrough of creating first Epic
- [ ] Screenshot or terminal recording (if applicable)
- [ ] Links to full specifications and templates

### Acceptance Criteria (Definition of Done)

- [ ] All test cases pass
- [ ] Code is committed with clear commit message
- [ ] Documentation is complete and readable
- [ ] Command is available in Claude Code
- [ ] Product owner approves User Story is complete
```

**Questions Answered**:
- What exact steps do we take to implement this?
- What tests do we write?
- How do we verify correctness?
- What code changes are needed?
- When is implementation truly complete?

---

## The Three-File Pattern in Action

### Example: Epic → Feature → User Story

**Epic: integrated-design-spec Plugin**
```
specs/001-integrated-design-spec/
├── requirements.md        → "Build a spec-driven development framework"
├── design.md             → "Use Markdown, Git, agents, directory hierarchy"
└── tasks.md              → "Feature 1, Feature 2, Feature 3, Feature 4, Feature 5, Feature 6"
```

**Feature: Multi-Tier Specification Framework**
```
specs/001-integrated-design-spec/features/01-multi-tier-framework/
├── requirements.md        → "Create templates for Epic/Feature/Story with validation"
├── design.md             → "Three-file pattern, validation rules, sample specs"
└── tasks.md              → "User Story 1, User Story 2, User Story 3, User Story 4"
```

**User Story: Create Epic Specification**
```
specs/001-integrated-design-spec/features/01-multi-tier-framework/stories/001-create-epic-spec/
├── requirements.md        → "User invokes /specid.epic and creates Epic spec (EARS format)"
├── design.md             → "Agent prompt, directory creation, template filling, validation"
└── tasks.md              → "T001-T007: Write tests, implement command, document"
```

---

## Specification Maintenance & Updates

### Rule: Tri-File Consistency When Adding Features/User Stories

**Core Rule**: When adding a new Feature to an Epic or a new User Story to a Feature, **update all three specification files** to maintain consistency and completeness.

**Why This Matters**:
The three-file pattern (requirements.md, design.md, tasks.md) separates concerns but depends on all three being kept in sync:
- **requirements.md** provides business context and goals
- **design.md** provides technical architecture and constraints
- **tasks.md** provides the work breakdown and execution plan

When you add a new Feature/User Story to only one file, you create:
- **Information loss**: Team members reading other files miss the feature entirely
- **Inconsistency**: One file claims "5 features," another lists "4 features"
- **Context gaps**: Developers see a task but no business context; stakeholders see a goal but no task breakdown

**How to Update All Three Files**:

#### When Adding a Feature to an Epic:

1. **Update requirements.md**:
   - Add feature entry to "Feature Breakdown" section
   - Include brief description and business value statement
   - Example:
   ```markdown
   ### Feature 3: Intelligent Specification Review & Validation
   - Builds validation agents and consistency checkers
   - Provides actionable feedback on specs

   **Business Value**: Teams identify spec issues before development, reducing rework and improving alignment.
   ```

2. **Update design.md**:
   - Add architectural considerations relevant to the feature
   - Document technology choices or design decisions specific to this feature
   - Example: Add section on how validation agents are architected, what data they process, etc.

3. **Update tasks.md**:
   - Add detailed feature task entry
   - Include: purpose, deliverables, dependencies, acceptance criteria, effort, priority
   - Example:
   ```markdown
   ### Feature 3: Intelligent Specification Review & Validation
   **Status**: Ready for Feature Planning
   **Purpose**: Build validation agents and consistency checkers
   **Deliverables**: [list 5-7 key deliverables]
   **Dependencies**: Feature 1
   **Acceptance Criteria**: [list 5-7 criteria]
   ```

#### When Adding a User Story to a Feature:

1. **Update requirements.md**:
   - Add user story to "User Stories" section with business context
   - Include acceptance criteria summary
   - Example:
   ```markdown
   ### US-1: Create Epic Specification Template
   **As a** product manager
   **I want to** have a template for creating Epic specs
   **So that** Epic specs are consistent and complete
   ```

2. **Update design.md**:
   - Add technical design considerations relevant to the story
   - Document APIs, data structures, or technical constraints
   - Example: If the story is about agent validation, describe how agents will be called

3. **Update tasks.md**:
   - Add user story entry with task breakdown
   - Include: purpose, acceptance criteria, effort estimate, task list
   - Example:
   ```markdown
   ### US-1: Create Epic Specification Template
   **Effort**: 1 user story
   **Acceptance Criteria**: [list criteria]
   **Tasks**: [T1.1, T1.2, T1.3 with descriptions]
   ```

### Quality Assurance: Checking Tri-File Consistency

**Validation Checklist**:
- [ ] All Features listed in tasks.md appear in requirements.md with business value statement
- [ ] All Features listed in requirements.md appear in tasks.md with detailed breakdown
- [ ] All Features mentioned in design.md are documented in both requirements.md and tasks.md
- [ ] Same applies recursively: User Stories in Feature specs checked across all three files
- [ ] No Feature/User Story appears in only one file
- [ ] Cross-references between files are consistent (Feature 3 in tasks.md is same Feature 3 in requirements.md)

**Who Checks**:
- Code reviewer: Must verify all three files updated before approving
- Spec validator agent: Should flag missing features across files
- Cross-tier consistency validator: Should enforce tri-file completeness

---

## Key Principles Summary

| Principle | Epic | Feature | User Story |
|-----------|------|---------|-----------|
| **Scope** | Strategic initiative | Specific capability | Implementation task |
| **Audience** | Executives, PMs, architects | PMs, architects, tech leads | Developers, QA |
| **Focus** | Business goals | Business + architecture | Implementation details |
| **Specificity** | Directional | Refined | Explicit |
| **requirements.md** | Vision, goals, Features | Capabilities, User Stories | EARS, acceptance criteria |
| **design.md** | Tech direction, questions | Architecture, flows | Code, APIs, specifics |
| **tasks.md** | Features to build | User Stories to implement | Implementation steps |

---

## Documentation Locations

- **Epic Spec**: `specs/NNN-epic-name/`
- **Feature Spec**: `specs/NNN-epic-name/features/MM-feature-name/`
- **User Story Spec**: `specs/NNN-epic-name/features/MM-feature-name/stories/LL-story-name/`
- **Templates**: `plugins/integrated-design-spec/templates/`
- **Validation Rules**: `plugins/integrated-design-spec/validators/`
- **Commands**: `plugins/integrated-design-spec/commands/`
- **Agents**: `plugins/integrated-design-spec/agents/`

---

**Version**: 1.1.0 | **Last Updated**: 2025-12-14
