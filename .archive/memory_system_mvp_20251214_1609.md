# Spec Memory System MVP - Feature Documentation

**Type**: Feature Specification (Enhancement to Epic)
**Created**: 2025-12-14
**Status**: Draft
**Author**: Will Strye

---

## Overview

The Spec Memory System is an operational folder structure within each specification (Epic, Feature, User Story) that tracks lifecycle state, validation history, design decisions, blockers, collaborative notes, executive summaries, and optimized agent context. This system enhances the three-file specification pattern (requirements.md, design.md, tasks.md) with additional metadata and collaboration capabilities.

**Problem It Solves**:
- Specifications lack persistent state tracking across sessions
- Teams can't easily track why decisions were made (rationale gets lost)
- Validation history scattered across notes and comments
- Agents receive full 5000+ line specs when they only need key context (token inefficiency)
- Async collaboration difficult (team member leaves off, next member unsure of context)
- Onboarding new team members requires reading entire spec (inefficient)

**Value Proposition**:
- Complete audit trail for compliance and governance
- Team collaboration enabled across sessions (handoff documentation)
- 95% token reduction for agents (use compressed context instead of full spec)
- Knowledge preservation (decisions rationale, blocker resolution paths)
- Fast onboarding (read memory files instead of 80-page specs)

---

## Seven-File Memory System Structure

The Spec Memory System consists of seven files in an `_memory/` subdirectory (underscore prefix indicates operational/derived, not authoritative source):

### File 1: 00-state.md (State Machine)
**Purpose**: Track specification lifecycle and state transitions
**Content**:
- State diagram showing all possible states and transitions
- State definitions with entry/exit criteria
- Conditions for state transitions
- Current state and date entered
- Next expected state and target date
- Amendment log for state changes

**Example States**: DRAFT → PLANNING → APPROVED → FEATURE_PLANNING → FEATURES_DESIGNED → DEVELOPMENT → RELEASED

**Use Cases**:
- Quick status check ("What state is this spec in?")
- Governance ("What approvals are needed for state transition?")
- Planning ("When do we move to APPROVED?")

### File 2: 01-validation.md (Validation History & Audit Trail)
**Purpose**: Complete record of all validations and quality assurance
**Content**:
- Validation summary table (checks + status + evidence)
- Detailed validation records (who, what, when, findings)
- Acceptance criteria status tracking
- Quality metrics (completeness, consistency, etc.)
- Known issues and resolution status
- Reviewer approvals matrix
- Feedback integration log

**Use Cases**:
- Compliance audits ("Show me the validation history")
- Quality assurance ("Which checks have passed?")
- Issue tracking ("What issues were found and how were they resolved?")
- Sign-off ("Who has approved this spec?")

### File 3: 02-decisions.md (Design Decision Log)
**Purpose**: Preserve rationale for all architectural decisions
**Content**:
- Each decision documented with: problem statement, options considered, chosen option, rationale, implementation notes, related decisions
- Active decisions (currently applicable)
- Superseded decisions (historical record)
- Deferred decisions (to be made in future phases)
- Decision impact analysis
- Dependencies between decisions

**Use Cases**:
- Prevents re-litigating decisions ("This was already decided for X, Y, Z reasons")
- Onboarding ("Why did we choose this approach?")
- Impact analysis ("If we change this decision, what breaks?")
- Audit trail ("Document shows decision made Dec 14 by Will Strye")

### File 4: 03-blockers.md (Open Questions & Blockers)
**Purpose**: Track unresolved questions, blockers, and dependencies
**Content**:
- Active blockers (with severity and resolution path)
- Open architectural questions (with context, options, resolution timeline)
- Previously resolved issues (with resolution approach)
- Dependency map (which questions affect which Features?)
- Resolution timeline (when each question needs answer)
- Owner assignments

**Use Cases**:
- Prevents team from getting stuck ("Here's what we don't know and how to resolve it")
- Planning ("What questions need answering before we can proceed?")
- Risk management ("Are there any critical blockers?")
- Coordination ("Feature X depends on answer to question Y")

### File 5: 04-notes.md (Session Working Notes)
**Purpose**: Session-by-session collaborative context and handoff documentation
**Content**:
- Per-session: date, participants, objectives, work completed, decisions made, open items, next steps
- Links to related decision records, validation findings, state transitions
- Metadata: effort, duration, blockers encountered, resources needed

**Use Cases**:
- Async collaboration ("Team member A worked on this, here's what they did")
- Handoff documentation ("I'm leaving off here; next person start with...")
- Knowledge preservation ("What happened in each session?")
- Progress tracking ("How much effort have we invested?")

### File 6: 05-summary.md (Executive Summary)
**Purpose**: 2-5 minute overview for quick understanding
**Content**:
- One-paragraph spec summary
- Core concept/architecture
- Key problems solved
- Major features/components
- Design decisions made
- Success criteria
- What happens next (timeline)
- Role-specific summaries (Product, Architecture, Engineering, QA)
- Quick stats

**Use Cases**:
- New team member onboarding ("Read this first for quick understanding")
- Stakeholder updates ("Here's what this spec is about in 3 minutes")
- Decision making ("Do we approve this direction?")
- Cross-team communication ("What should other teams know?")

### File 7: 06-agent-context.md (Compressed Agent Context)
**Purpose**: Optimized context for AI agents (95% token reduction)
**Content**:
- Spec identification (type, name, version, status, author)
- One-paragraph summary
- Core architecture/concept
- Key features or components
- Design decisions
- Acceptance criteria status
- Current state and timeline
- Open items (with impact)
- Tech stack
- Success criteria
- Agent usage instructions

**Optimization**: ~200 lines / 800 tokens vs. 5000+ lines / 16,000 tokens in full spec
**Impact**: Agents can process context in 1-2 seconds instead of 10-15 seconds, reducing API latency and costs by 95%

**Use Cases**:
- Validation agents ("Load this context before reviewing spec")
- Task generation ("Here's the compressed context for dependency inference")
- Custom agents ("Domain-specific agents start with this context")

---

## Why _memory/ Folder?

The underscore prefix (`_memory/`) signals:
- **Operational, not authoritative**: These files derive from and support the authoritative three-file pattern (requirements.md, design.md, tasks.md)
- **Auto-updatable**: Memory files can be regenerated/updated by automation (agents, scripts)
- **Supporting, not primary**: Developers read requirements.md/design.md/tasks.md for actual spec; memory files provide metadata
- **Convention**: Underscore prefix commonly means "internal" or "operational" in software (e.g., `_build/`, `__pycache__/`)
- **Directory grouping**: All memory files grouped together for easy identification and management

---

## Implemented at Each Tier

The Spec Memory System is implemented consistently at all three tiers:

```
specs/001-epic-name/
├── requirements.md        (Authoritative: business focus)
├── design.md             (Authoritative: technical focus)
├── tasks.md              (Authoritative: execution focus)
└── _memory/
    ├── 00-state.md       (State machine: current phase, transitions)
    ├── 01-validation.md  (Audit trail: quality checks, approvals)
    ├── 02-decisions.md   (Decision log: rationale for choices)
    ├── 03-blockers.md    (Open items: questions, blockers)
    ├── 04-notes.md       (Session notes: who, what, when, why)
    ├── 05-summary.md     (Executive summary: 3-5 min overview)
    └── 06-agent-context.md (Compressed context: agent processing)

specs/001-epic-name/features/01-feature-name/
├── requirements.md        (Authoritative: Feature business focus)
├── design.md             (Authoritative: Feature technical focus)
├── tasks.md              (Authoritative: User Story list)
└── _memory/
    ├── 00-state.md       (Feature state machine)
    ├── 01-validation.md  (Feature validation history)
    ├── 02-decisions.md   (Feature decisions)
    ├── 03-blockers.md    (Feature open items)
    ├── 04-notes.md       (Feature session notes)
    ├── 05-summary.md     (Feature summary)
    └── 06-agent-context.md (Feature agent context)

specs/001-epic-name/features/01-feature-name/stories/001-user-story/
├── requirements.md        (Authoritative: User Story EARS format)
├── design.md             (Authoritative: Story technical details)
├── tasks.md              (Authoritative: Implementation tasks)
└── _memory/
    ├── 00-state.md       (Story state machine)
    ├── 01-validation.md  (Story validation history)
    ├── 02-decisions.md   (Story decisions)
    ├── 03-blockers.md    (Story open items)
    ├── 04-notes.md       (Story session notes)
    ├── 05-summary.md     (Story summary)
    └── 06-agent-context.md (Story agent context)
```

---

## File Format Standards

### Common Header (All Files)
```markdown
# [File Type]: [Spec Name]

**Spec**: [Type]: [Name]
**Status**: [DRAFT | REVIEW | ACTIVE | ARCHIVED]
**Last Updated**: YYYY-MM-DD
**Version**: 1.0.0 | **Type**: [Type] | **Status**: [Status]
```

### Timestamps
- All records include timestamps in ISO 8601 format (YYYY-MM-DD HH:MM UTC)
- Track date created, last updated, and key milestone dates

### Tables
- Validation summary: Check, Status, Evidence, Reviewer
- State transitions: From State, To State, Trigger, Owner
- Decisions: Decision ID, Date, Status, Impact Level
- Open items: Question, Category, Status, Owner, Target Resolution Date

### Structured Linking
- Cross-references between memory files (e.g., "See Decision 1 in 02-decisions.md")
- Links to authoritative files (e.g., "See requirements.md § 3.2")
- Links to related Features/User Stories (e.g., "Blocked by Feature 2")

---

## Integration with Agent Workflows

### Pre-Validation Agent Setup
```
1. Agent receives validation request
2. Load 06-agent-context.md (compressed context, 800 tokens)
3. Load specific file to validate (requirements.md, design.md, or tasks.md)
4. Run validation using both files as context
5. Record findings in 01-validation.md
6. Update state in 00-state.md if validation triggers state change
```

**Token Efficiency**:
- Traditional: Full spec (16K tokens) + requirements.md → 17K tokens
- Memory System: Agent context (0.8K) + requirements.md → 2K tokens
- **Savings**: 88% reduction in agent context tokens

### Multi-Agent Coordination
```
1. Enterprise Architect agent runs validation
   - Loads 06-agent-context.md
   - Reviews design.md for architecture alignment
   - Adds findings to 01-validation.md

2. Solutions Architect agent runs validation
   - Loads 06-agent-context.md
   - Reviews design.md for technical design quality
   - Adds findings to 01-validation.md

3. QA Specialist agent runs validation
   - Loads 06-agent-context.md
   - Reviews requirements.md for testability
   - Adds findings to 01-validation.md

4. Summary agent generates/updates 05-summary.md
   - Compresses findings from 01-validation.md
   - Updates key metrics and status indicators
```

---

## Team Collaboration Patterns

### Async Handoff Pattern
```
Team Member A (Session 1):
- Updates requirements.md with new feature details
- Adds decision rationale to 02-decisions.md
- Logs session work in 04-notes.md
- Updates 00-state.md (PLANNING state)

Team Member B (Session 2):
- Reads 04-notes.md to understand context
- Reads 02-decisions.md to understand why decisions were made
- Reads 03-blockers.md to see open questions
- Checks 00-state.md to see current phase
- Continues work with full context
- Logs their session in 04-notes.md

Result: No context loss; team member B productive immediately
```

### Fast Onboarding Pattern
```
New team member needs to understand Epic spec:
- Read 05-summary.md (3-5 minutes) → understand overall vision
- Read 03-blockers.md (2-3 minutes) → understand open questions
- Read 02-decisions.md (3-5 minutes) → understand why choices were made
- Read 04-notes.md (2-3 minutes) → understand recent session context
- Total: 10-15 minutes for complete understanding

vs. Reading full 80-page spec: 2-3 hours
```

### Compliance Audit Pattern
```
Auditor needs spec change history:
- Review 00-state.md for state transitions (who approved? when?)
- Review 01-validation.md for validation records (what checks? results?)
- Review 02-decisions.md for decision rationale (why this approach?)
- Review 04-notes.md for session records (who worked on it? when?)

Result: Complete audit trail for regulatory compliance
```

---

## Maintenance & Governance

### Auto-Update Triggers
**Validation Summary (01-validation.md)**:
- After each validation agent run, update validation record
- Auto-update acceptance criteria status
- Trigger: `/specid.validate` command runs

**Executive Summary (05-summary.md)**:
- After requirements.md or design.md changes, regenerate summary
- Keep key metrics current
- Trigger: Requirements/design file modified

**Agent Context (06-agent-context.md)**:
- Regenerate when any authoritative file changes significantly
- Keep compression ratio 95%+
- Trigger: Any of requirements.md, design.md, tasks.md modified

### Manual Updates Required
**Session Notes (04-notes.md)**:
- Team member documents work after each session
- Format: session date, participants, objectives, work completed, decisions made, open items
- Frequency: After each significant work session

**Decisions (02-decisions.md)**:
- Add new decision entries when major architectural choices made
- Update related decisions when dependencies discovered
- Frequency: As decisions made (not scheduled)

**Blockers (03-blockers.md)**:
- Update status as questions answered
- Add new blockers as they emerge
- Add resolution notes when issues resolved
- Frequency: As blockers encountered/resolved

**State Machine (00-state.md)**:
- Update current state when state transition occurs
- Log transition in amendment section
- Frequency: As state transitions occur

---

## Implementation Roadmap

### Phase 1: Manual Memory System (Weeks 1-2, Effort: 1-2 stories)
- Create _memory/ folder structure for existing epic
- Populate all 7 files with initial content
- Document file format standards
- Create examples and templates
- **Status**: ✅ COMPLETE (MVP implemented for epic)

### Phase 2: Agent Integration (Weeks 3-4, Effort: 2-3 stories)
- Integrate with validation agents
- Agents load 06-agent-context.md before validation
- Agents auto-append findings to 01-validation.md
- Agents auto-trigger 05-summary.md regeneration
- **Status**: ⏳ PENDING (Feature 3: Validation Agents)

### Phase 3: Workflow Integration (Weeks 5-6, Effort: 1-2 stories)
- Add `/specid.memory` command to view/update memory files
- Create memory templates for quick field population
- Add memory diff viewer (show what changed between sessions)
- **Status**: ⏳ PENDING (Feature 2: Authoring Tools enhancement)

### Phase 4: Advanced Features (Weeks 7+, Optional, Effort: 2-3 stories)
- Memory-based agent-to-agent communication (agents leave notes for each other)
- Cross-spec memory aggregation (Epic memory feeds Feature memory)
- Predictive blocker detection (ML-based)
- Memory analytics (decision velocity, blocker resolution time, etc.)
- **Status**: ⏳ PENDING (v1.1 enhancement)

---

## Acceptance Criteria

### Core AC (MVP - Must Have)
- [ ] 7-file memory system structure documented with clear purpose for each file
- [ ] Format standards defined for all memory files (headers, timestamps, tables, links)
- [ ] Examples provided for each file type showing how to populate
- [ ] Integration points with agent workflows documented
- [ ] Team collaboration patterns documented (async handoff, onboarding, compliance audit)
- [ ] Maintenance guidelines documented (auto-update triggers, manual update frequency)
- [ ] MVP implemented for epic specification (all 7 files created and populated)
- [ ] Memory system validated as reducing agent token usage by 90%+

### Extended AC (Phase 2+)
- [ ] Agent integration complete (agents load context, auto-update validation)
- [ ] `/specid.memory` command available for viewing/updating memory
- [ ] Memory templates created for quick field population
- [ ] Memory diff viewer shows changes between sessions

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Agent Token Reduction** | 90%+ | Compare tokens for full spec vs. 06-agent-context.md |
| **Onboarding Time** | < 20 min | Time for new team member to understand spec via memory files |
| **Async Handoff Success** | 100% | Next session member productive without sync meeting |
| **Compliance Audit Coverage** | 100% | All audit questions answerable from memory files |
| **Memory Maintenance Overhead** | < 10% of session time | Session notes add minimal overhead to overall work |
| **Decision Preservation** | 100% | All major decisions documented with rationale |
| **Blocker Resolution Rate** | 80%+ | Questions/blockers resolved within target date |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **Memory Files Fall Out of Sync** | Clear update triggers; auto-regeneration where possible; validation checks sync |
| **Overhead Burden** | Keep 04-notes.md to bullet points (not full prose); auto-generate 05-summary.md and 06-agent-context.md |
| **Complexity Discourages Adoption** | Provide templates; clear format standards; examples for each file type |
| **Memory Files Replace Authoritative Specs** | Underscore prefix signals operational; documentation emphasizes three files are authoritative |
| **Too Many Files** | Group in _memory/ folder; provide curated links in summary file; agents know which files to load |

---

## Related Features

This feature enhances and integrates with:
- **Feature 1: Multi-Tier Specification Framework** (provides templates for memory files)
- **Feature 3: Validation Agents** (loads 06-agent-context.md for efficiency)
- **Feature 4: Task Generation** (uses compressed context for dependency inference)
- **Feature 5: Governance** (tracks amendments in 02-decisions.md and 00-state.md)

---

## Deliverables

1. **memory_system_spec.md** - Complete feature specification (this document becomes feature spec)
2. **memory_templates/** folder with templates for each of 7 file types
3. **memory_examples/** folder with working examples (Epic, Feature, User Story)
4. **documentation** - Integration guides for agents and team workflows
5. **MVP validation** - Epic specification memory system created and validated

---

**Version**: 1.0.0 | **Type**: Feature Documentation | **Status**: Draft | **Last Updated**: 2025-12-14
