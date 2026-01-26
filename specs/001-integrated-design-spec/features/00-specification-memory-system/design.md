# Feature Design: Specification Memory System

**Type**: Feature (Foundation Layer)
**Feature ID**: 00
**Feature Name**: Specification Memory System
**Created**: 2025-12-14
**Status**: Draft

---

## Architectural Vision

The Memory System is a **lightweight, non-invasive enhancement** to the three-file specification pattern. Instead of replacing or modifying the authoritative spec files (requirements.md, design.md, tasks.md), the memory system provides a parallel metadata structure in a `_memory/` folder that tracks:

1. **Operational State**: Specification lifecycle tracking (DRAFT → PLANNING → APPROVED → DEVELOPMENT → RELEASED)
2. **Quality Assurance**: Validation history and audit trails for compliance
3. **Decision Rationale**: Why architectural choices were made and what alternatives were considered
4. **Active Issues**: Blockers, open questions, and resolution paths
5. **Team Context**: Session-by-session working notes for async collaboration
6. **Quick Reference**: 2-5 minute executive summary for fast understanding
7. **Agent Optimization**: Compressed context for 95% token reduction in AI validation

---

## Core Design Principles

### Principle 1: Non-Invasive Enhancement
- Memory files in `_memory/` subdirectory (underscore signals operational, not authoritative)
- Three-file spec pattern (requirements.md, design.md, tasks.md) remains untouched and authoritative
- Developers ignore memory system if they choose; it's supporting infrastructure, not core spec

### Principle 2: Consistent Structure Across Tiers
- Same seven-file pattern at Epic, Feature, and User Story tiers
- New team members learn once, apply everywhere
- Templating leverages consistency

### Principle 3: Progressive Adoption
- Phase 1: Manual memory system (no automation burden)
- Phase 2: Agent integration (agents auto-populate memory)
- Phase 3: Workflow integration (dedicated commands)
- Phase 4: Advanced features (agent-to-agent communication)

### Principle 4: Token Efficiency First
- 06-agent-context.md optimized for agents (95% token reduction)
- Agents load compressed context instead of full spec
- Reduces validation latency and API costs dramatically

### Principle 5: Team Collaboration Focused
- Session notes enable async handoffs across time zones
- Blockers tracked for team visibility
- Decisions documented to prevent re-litigating
- Executive summary enables fast team onboarding

---

## Seven-File Memory System

### File 1: 00-state.md (State Machine)

**Purpose**: Track specification lifecycle state and transitions

**Content Structure**:
```markdown
# State Machine
- State diagram (ASCII or Mermaid)
- State definitions (entry criteria, exit criteria, duration)
- State transitions matrix (current state → next state, trigger, owner)
- Current state and date entered
- Next expected state and target date
- Amendment log (state changes with justification)
```

**Example States**:
- DRAFT → PLANNING → APPROVED → FEATURE_PLANNING → FEATURES_DESIGNED → DEVELOPMENT → RELEASED

**Use Cases**:
- "What state is this spec in?" → Read current state section
- "What approvals needed?" → Read state transition matrix
- "When do we move to APPROVED?" → Read target date

**Tier-Specific Customization**:
- Epic: Long timelines (weeks/months); complex transitions
- Feature: Medium timelines (days/weeks); straightforward transitions
- User Story: Short timelines (hours/days); simple 3-4 state sequence

---

### File 2: 01-validation.md (Validation History & Audit Trail)

**Purpose**: Record all validation attempts, findings, and quality assurance

**Content Structure**:
```markdown
# Validation & Audit Trail
- Validation summary table (check name, status, evidence, reviewer)
- Detailed validation records (validator, input, result, findings, timestamp)
- Acceptance criteria status matrix
- Quality metrics (completeness %, consistency score, etc.)
- Known issues section (issue description, status, resolution)
- Reviewer approvals matrix (role, reviewer, approval status, date)
- Feedback integration log (feedback source, change made, status)
```

**Example Validation Checks**:
- Structure completeness (all required sections present?)
- Content quality (no placeholder text remaining?)
- Cross-file consistency (requirements align with design?)
- Acceptance criteria clarity (all criteria testable?)
- Architecture alignment (design follows principles?)

**Use Cases**:
- "Has this spec been validated?" → Read validation summary
- "What quality score?" → Read quality metrics
- "Who approved this?" → Read approvals matrix
- "What issues exist?" → Read known issues section
- "Show me the audit trail for compliance" → Read all records

**Tier-Specific Customization**:
- Epic: Focus on architecture alignment, cross-feature consistency
- Feature: Focus on completeness, integration points
- User Story: Focus on testability, acceptance criteria clarity

---

### File 3: 02-decisions.md (Design Decision Log)

**Purpose**: Preserve rationale for all architectural decisions

**Content Structure**:
```markdown
# Design Decision Log
Per decision:
- Decision ID and title
- Date made
- Status (ACTIVE, SUPERSEDED, DEFERRED)
- Impact level (EPIC, FEATURE, USER_STORY)
- Problem statement (what problem does this solve?)
- Options considered (each with pros/cons)
- Chosen option and rationale
- Implementation notes
- Related decisions (dependencies)

Also:
- Future decisions section (to be decided in Feature planning)
- Decision impact analysis (if we change this, what breaks?)
```

**Example Decisions**:
- Three-file pattern per tier (requirements + design + tasks)
- Command prefix selection (specid.)
- Memory system folder structure (_memory/)
- Agent context compression approach

**Use Cases**:
- "Why did we choose this approach?" → Read decision rationale
- "Can we change this decision?" → Read impact analysis
- "What alternatives were considered?" → Read options section
- "Prevent re-litigating decisions" → Reference decision history

**Tier-Specific Customization**:
- Epic: Strategic decisions (architecture, technology stack)
- Feature: Design decisions (API design, data model)
- User Story: Implementation decisions (algorithms, libraries)

---

### File 4: 03-blockers.md (Open Questions & Blockers)

**Purpose**: Track unresolved questions, blockers, and dependencies

**Content Structure**:
```markdown
# Blockers & Open Questions
Per architectural question:
- Question ID and title
- Category (architecture, design, governance, compliance)
- Status (OPEN, IN_PROGRESS, RESOLVED, DEFERRED)
- Impact (HIGH, MEDIUM, LOW)
- Owner and target resolution date
- Context and background
- Options under consideration
- Resolution path (how to resolve)
- Linked blockers

Also:
- Critical issues section (if any)
- Previously resolved issues (with resolution approach)
- Dependency map (which questions affect which Features?)
```

**Example Questions**:
- Spec storage strategy (monorepo vs. polyrepo)
- Template customization policy
- Agent extensibility framework
- Versioning and rollback strategy
- Multi-team coordination model

**Use Cases**:
- "What are we blocked on?" → Read critical issues
- "How do we unblock this?" → Read resolution path
- "When will this be resolved?" → Read target resolution date
- "How does this affect Feature 3?" → Read dependency map

**Tier-Specific Customization**:
- Epic: Architectural questions affecting multiple teams
- Feature: Design questions affecting implementation
- User Story: Technical questions blocking development

---

### File 5: 04-notes.md (Session Working Notes)

**Purpose**: Document work and context for each session

**Content Structure**:
```markdown
# Session Working Notes
Per session:
- Session date, time, duration
- Participants (who worked on it)
- Objectives (what we planned to accomplish)
- Work completed (what actually got done)
- Decisions made (design decisions finalized)
- Open items (questions that came up but weren't resolved)
- Next steps (what should happen next)
- Metadata (effort, blockers encountered, resources needed)
- Links (references to decisions, validation records, state transitions)
```

**Example Session Entry**:
```
## Session 1: Epic Creation (Dec 13, 2025)
- Date: 2025-12-13 (14:00 - 18:30 UTC)
- Duration: 4.5 hours
- Participants: Will Strye
- Objectives: Create comprehensive epic spec...
- Work Completed: requirements.md, design.md, tasks.md created...
- Decisions Made: Three-file pattern (Decision 1)...
- Next Steps: Review command naming options...
```

**Use Cases**:
- "What happened in the last session?" → Read session notes
- "Who worked on this and when?" → Read session metadata
- "What were we blocked on?" → Read open items
- "Enable async handoff" → Team B reads session notes before picking up work
- "Onboard new team member" → New person reads session notes for context

**Tier-Specific Customization**:
- Epic: High-level strategic work; longer sessions
- Feature: Medium-level design work; medium sessions
- User Story: Implementation-focused work; shorter sessions

---

### File 6: 05-summary.md (Executive Summary)

**Purpose**: 2-5 minute quick reference for fast understanding

**Content Structure**:
```markdown
# Executive Summary (3-5 min read)
- One-paragraph summary
- Core concept/architecture
- Key problems solved
- Major features/components
- Design decisions made
- Success criteria
- What happens next (timeline)
- Role-specific summaries (Product, Architecture, Engineering, QA)
- Quick stats table (key metrics)
- For different roles section
```

**Use Cases**:
- "What is this spec about?" → Read one-paragraph summary
- "Do we approve this direction?" → Read for stakeholder decision-making
- "New team member, catch them up fast" → Read summary first (15 min total with memory files)
- "Cross-team communication" → Use summary to communicate with other teams
- "Auto-generated executive summary" → Phase 2: agents generate this from other files

**Tier-Specific Customization**:
- Epic: Strategic summary for executives
- Feature: Product summary for stakeholders
- User Story: Implementation summary for developers

---

### File 7: 06-agent-context.md (Compressed Agent Context)

**Purpose**: Optimized context for AI agent processing (95% token reduction)

**Content Structure**:
```markdown
# Compressed Agent Context (~200 lines, 800 tokens)
- Spec identification (type, name, version, status, author)
- One-paragraph summary
- Core architecture/concept
- Key features or components (bullet list)
- Design decisions (decision ID, choice, impact)
- Acceptance criteria status (AC#, description, status)
- Current state and timeline
- Open items (question, impact, owner)
- Tech stack (if applicable)
- Success criteria (key metrics)
- Agent usage instructions
- Links to full spec files for detailed review
```

**Token Efficiency Comparison**:
```
Traditional approach:
- Full epic spec: 5000+ lines → 16,000 tokens
- Agent context: 200 lines → 800 tokens
- Savings: 88% token reduction

Impact**:
- Validation latency: 10-15 seconds → 1-2 seconds
- Agent API cost: 16K tokens × $0.003 = $0.048 per validation
- With context: 800 tokens × $0.003 = $0.0024 per validation
- Savings: 95% cost reduction per validation
```

**Use Cases**:
- "Validate this epic with Enterprise Architect agent" → Load this file + requirements.md
- "Generate tasks with compressed context" → Load this file + design.md
- "Multi-agent coordination" → All three agents use same context file
- "Token efficiency optimization" → Replace full spec with context file

**Tier-Specific Customization**:
- Epic: 200 lines of strategic context
- Feature: 200 lines of product context
- User Story: 200 lines of implementation context

---

## Implementation Guidelines

### File Creation Process

1. **Create `_memory/` folder** in spec directory (parallel to requirements.md, design.md, tasks.md)

2. **Create initial files** using templates:
   - 00-state.md: Current state (usually DRAFT or PLANNING)
   - 01-validation.md: Empty or initial validation records
   - 02-decisions.md: Decisions made so far
   - 03-blockers.md: Known blockers/questions
   - 04-notes.md: Session work from today
   - 05-summary.md: Auto-generated or manually written
   - 06-agent-context.md: Auto-generated from authoritative files

3. **Update regularly**:
   - After each work session: Update 04-notes.md
   - When decision made: Add to 02-decisions.md
   - When blocker found: Add to 03-blockers.md
   - When validation run: Update 01-validation.md and 00-state.md

### Maintenance & Update Triggers

**Manual Updates** (Team responsibility):
- 04-notes.md: After each work session (2-5 min effort)
- 02-decisions.md: When major decisions made (5-10 min effort)
- 03-blockers.md: When blockers encountered/resolved (5 min effort)
- 00-state.md: When state transition occurs (2 min effort)

**Auto-Update Candidates** (Phase 2 automation):
- 05-summary.md: Regenerate when requirements.md or design.md changes significantly
- 06-agent-context.md: Regenerate when any authoritative file modified
- 01-validation.md: Append records when `/specid.validate` command runs

---

## Integration Points with Other Features

### Feature 1: Multi-Tier Specification Framework
- Feature 1 creates templates that include memory file templates
- Feature 1 validation rules reference memory system file format standards
- Feature 1 sample specs include populated memory systems at all tiers

### Feature 2: Specification Authoring Tools
- `/specid.epic`, `/specid.feature`, `/specid.story` commands auto-create `_memory/` folder
- Commands auto-generate initial files (00-state.md, 06-agent-context.md)
- Phase 2: `/specid.memory` command for viewing/updating memory

### Feature 3: Validation Agents
- Agents load 06-agent-context.md before validation (95% token reduction)
- Agents append findings to 01-validation.md
- Phase 2: Agents auto-trigger 05-summary.md regeneration

### Feature 4: Task Generation
- Task generation uses 06-agent-context.md for dependency inference
- Phase 2: Task generation auto-updates 00-state.md when tasks created

### Feature 5: Governance & Evolution
- Amendment log stored in 02-decisions.md
- State transitions logged in 00-state.md
- Spec versioning tracked via memory system metadata

### Feature 6: Metrics & Insights
- Quality metrics sourced from 01-validation.md
- Burndown tracked via 00-state.md transitions
- Team velocity calculated from 04-notes.md session metadata

---

## Technical Specifications

### File Format Standards

**Common Header** (all files):
```markdown
# [File Type]: [Spec Name]

**Spec**: [Type]: [Name]
**Status**: [DRAFT | REVIEW | ACTIVE | ARCHIVED]
**Last Updated**: YYYY-MM-DD
**Version**: X.Y.Z | **Type**: [Type] | **Status**: [Status]
```

**Timestamp Format**:
- ISO 8601 with UTC timezone: 2025-12-14 14:30 UTC

**Table Format**:
- Markdown tables with pipe delimiters
- Headers clearly marked with dashes
- Example: `| Check | Status | Evidence | Reviewer |`

**Structured Linking**:
- Internal: `Decision 1 in 02-decisions.md`
- Cross-file: `See requirements.md § 3.2 for business goals`
- External: `[GitHub Issue #42](https://github.com/...)`

### Folder Structure

```
specs/001-epic-name/
├── requirements.md           # Authoritative: business focus
├── design.md                # Authoritative: technical focus
├── tasks.md                 # Authoritative: execution focus
└── _memory/                 # Operational metadata (underscore prefix)
    ├── 00-state.md          # State machine & lifecycle
    ├── 01-validation.md     # Validation history & audit trail
    ├── 02-decisions.md      # Design decision log
    ├── 03-blockers.md       # Open questions & blockers
    ├── 04-notes.md          # Session working notes
    ├── 05-summary.md        # Executive summary
    └── 06-agent-context.md  # Compressed agent context
```

---

## Success Criteria

### Design Must Deliver:
- ✅ Seven-file structure that supports all use cases (state, validation, decisions, blockers, notes, summary, agent context)
- ✅ Clear purpose and content guidelines for each file
- ✅ Consistent structure across all three tiers (Epic, Feature, User Story)
- ✅ Non-invasive (doesn't change authoritative spec files)
- ✅ Progressive adoption (manual → automated → workflow integrated)
- ✅ Token efficiency (95% reduction target achievable)
- ✅ Team collaboration enabled (async handoff, onboarding, compliance)

### Design Quality:
- ✅ All files have clear templates with examples
- ✅ Format standards documented and consistent
- ✅ Integration points with other Features clearly defined
- ✅ Phase 1-4 roadmap includes clear automation opportunities
- ✅ Risks and mitigations identified

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Memory files fall out of sync** | Auto-regeneration where possible; validation checks; clear update triggers |
| **Adoption friction** | Simple templates; real examples; demonstrated value (token savings, time savings) |
| **Complexity burden** | Start simple (Epic level); progressive automation in Phases 2-3 |
| **Unclear when to update** | Document update triggers clearly; automation handles most updates in Phase 2+ |

---

## Open Questions for Feature 0 Planning

1. **Tier-Specific Variations**: How much should Epic-level memory system differ from Feature/User Story level? (Recommend: Same structure, different content/detail level)

2. **Auto-Generation Timing**: When should 05-summary.md and 06-agent-context.md be regenerated? (Recommend: After requirements/design changes in Phase 2)

3. **Template Customization**: Can teams customize memory file templates? (Recommend: Core structure mandatory; optional sections flexible)

4. **Retention Policy**: How long should memory files be retained? (Recommend: Same as code; Git history preserves all versions)

---

**Version**: 1.0.0 | **Type**: Feature Design | **Status**: Draft | **Last Updated**: 2025-12-14
