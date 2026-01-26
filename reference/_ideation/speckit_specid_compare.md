# Spec-Kit vs. Epic Specification Comparison

**Date**: 2025-12-14
**Scope**: Analysis of spec-kit functionality (`.claude/commands/` and `.specify/` folders) against the integrated-design-spec Epic specification
**Purpose**: Identify features and functionality present in spec-kit that are NOT documented in the epic spec

---

## Executive Summary

The spec-kit implements a mature spec-driven development workflow that **exceeds** the scope documented in the epic specification. The epic describes a three-tier framework (Epic/Feature/User Story), but spec-kit is already operational with:

- 9 slash commands (not 6 mentioned in epic)
- Advanced specification quality validation ("unit tests for English" concept)
- Detailed planning, clarification, and implementation automation workflows
- Constitution-based governance system
- Task-to-GitHub-issues conversion capability
- Comprehensive bash scripts for project setup and context management

The gap is not missing functionality in spec-kit, but rather **missing documentation in the epic about what spec-kit already does**.

---

## Spec-Kit Tools Inventory

### Slash Commands (9 Total)

| Command | Purpose | Epic Coverage | Status |
|---------|---------|---------------|--------|
| `/speckit.specify` | Create feature specification from natural language | ✓ Partial | **EXCEEDS**: Includes quality checklist generation, clarification questions, validation workflow |
| `/speckit.clarify` | Resolve spec ambiguities interactively (up to 5 questions) | ✗ Missing | **NOT DOCUMENTED** in epic |
| `/speckit.plan` | Generate implementation plan from spec | ✓ Present | **EXCEEDS**: Research phase, data model, API contracts, agent context updates |
| `/speckit.checklist` | Generate custom requirement quality checklists | ✗ Missing | **NOT DOCUMENTED** in epic (different from `/speckit.specify` checklist) |
| `/speckit.tasks` | Generate dependency-ordered tasks from plan | ✓ Present | **EXCEEDS**: Parallelization markers [P], user story phases, MVP scoping |
| `/speckit.analyze` | Cross-artifact consistency validation (spec/plan/tasks) | ✗ Missing | **NOT DOCUMENTED** in epic |
| `/speckit.implement` | Execute task plan with progress tracking | ✓ Present (implied) | **EXCEEDS**: Checklist pre-flight validation, ignore file generation, progress marking |
| `/speckit.constitution` | Create/update project governance constitution | ✗ Missing | **NOT DOCUMENTED** in epic |
| `/speckit.taskstoissues` | Convert tasks to GitHub issues | ✗ Missing | **NOT DOCUMENTED** in epic (GitHub integration) |

### Supporting Infrastructure

#### Template Files (in `.specify/templates/`)
- `spec-template.md` - Feature specification structure
- `plan-template.md` - Implementation plan structure
- `tasks-template.md` - Task list structure
- `checklist-template.md` - Checklist structure
- `agent-file-template.md` - Agent context template

#### Bash Scripts (in `.specify/scripts/bash/`)
- `create-new-feature.sh` - Branch/directory scaffolding
- `setup-plan.sh` - Plan file initialization
- `check-prerequisites.sh` - Environment validation
- `update-agent-context.sh` - Agent-specific context management
- `common.sh` - Shared utilities

#### Governance & Memory Files
- `.specify/memory/constitution.md` - Project governance principles
- Feature-level `_memory/` directories for state tracking

---

## Feature-by-Feature Comparison

### Feature 0: Specification Memory System (Epic)

**Epic Description**: Seven-file operational metadata system for tracking spec lifecycle and team collaboration.

**Spec-Kit Implementation Status**: ✓ **PARTIALLY IMPLEMENTED**

| Capability | Epic Spec | Spec-Kit | Gap |
|------------|-----------|----------|-----|
| State machine tracking | Yes | Mentioned in design.md | Minimal (referenced via `_memory/00-state.md`) |
| Validation history | Yes | Yes | Covered |
| Decision tracking | Yes | Yes | Constitution includes decisions, implemented |
| Blocker tracking | Yes | Yes | `_memory/03-blockers.md` exists |
| Session notes | Yes | Yes | `_memory/04-notes.md` exists |
| Summary generation | Yes | Implied | Implemented (`_memory/05-summary.md`) |
| Agent context compression | Yes | **YES** (95% token reduction claimed) | Fully implemented (`update-agent-context.sh`) |

**Analysis**: Spec-kit actually implements Feature 0 more thoroughly than documented. Agent context management via `update-agent-context.sh` provides automated compression.

---

### Feature 1: Multi-Tier Specification Framework (Epic)

**Epic Description**: Epic, Feature, and User Story templates with tier-specific validation and cross-tier consistency.

**Spec-Kit Implementation Status**: ✓ **PARTIALLY IMPLEMENTED**

**Missing from spec-kit**:
- Epic-tier templates (only Feature-level spec-template.md exists)
- User Story-tier templates (EARS format mentioned but not in templates/)
- Explicit three-file pattern (requirements.md, design.md, tasks.md) not enforced at all tiers
- Tier-specific validation rules

**Implemented in spec-kit**:
- Feature-level spec, plan, tasks templates
- Cross-artifact consistency validation (`/speckit.analyze`)
- Constitution-based validation checks

---

### Feature 2: Specification Authoring Tools (Epic)

**Epic Description**: Commands for creating Epic, Feature, and User Story specs with templated guidance.

**Spec-Kit Implementation Status**: ✓ **IMPLEMENTED (Single Tier)**

| Capability | Epic | Spec-Kit | Status |
|-----------|------|----------|--------|
| Auto-branch creation | Yes | Yes (`create-new-feature.sh`) | ✓ Implemented |
| Template scaffolding | Yes | Yes (placeholder filling) | ✓ Implemented |
| Directory structure | Yes | Yes (feature-specific) | Partial (feature-only) |
| Specification quality checklist generation | ✓ Epic implies this | **YES** (`/speckit.checklist`) | **EXCEEDS** |
| Interactive clarification | ✓ Epic implies this | **YES** (`/speckit.clarify`) | **EXCEEDS** |
| Automated prerequisites checking | Not mentioned | **YES** (`check-prerequisites.sh`) | **NOT DOCUMENTED** |

---

### Feature 3: Intelligent Specification Review & Validation (Epic)

**Epic Description**: Consistency validators, requirements checkers, and custom agents (Enterprise Architect, Solutions Architect, QA Specialist).

**Spec-Kit Implementation Status**: ✓ **CUSTOM AGENTS DEFINED (Not Fully Integrated)**

| Capability | Epic | Spec-Kit | Status |
|-----------|------|----------|--------|
| Completeness validation | Yes | Yes (spec checklist) | ✓ Implemented |
| Consistency validation | Yes | Yes (`/speckit.analyze`) | ✓ Implemented |
| Enterprise Architect agent | Yes | Yes (defined in agents/) | Defined (not yet command-integrated) |
| Solutions Architect agent | Yes | Yes (defined in agents/) | Defined (not yet command-integrated) |
| QA Specialist agent | Yes | Yes (defined in agents/) | Defined (not yet command-integrated) |
| Automated pre-planning validation | Implied | Yes (`/speckit.clarify` runs before plan) | **EXCEEDS** |
| Constitution alignment checking | Not mentioned | **YES** (`/speckit.analyze` validates against constitution) | **NOT DOCUMENTED** |

---

### Feature 4: Specification-to-Tasks Automation (Epic)

**Epic Description**: Task generation from User Stories, dependency inference, test generation, parallel opportunity detection.

**Spec-Kit Implementation Status**: ✓ **IMPLEMENTED**

| Capability | Epic | Spec-Kit | Status |
|-----------|------|----------|--------|
| Task generation from specs | Yes | Yes (`/speckit.tasks`) | ✓ Implemented |
| Dependency inference | Yes | Yes (task ordering) | ✓ Implemented |
| Parallel opportunity detection | Yes | Yes ([P] markers) | ✓ Implemented |
| Test-first guidance | Yes | Mentioned in implement.md | ✓ Implemented |
| MVP scoping | Implied | **YES** (suggested MVP scope in tasks report) | **EXCEEDS** |
| Task-to-GitHub-issues conversion | Not mentioned | **YES** (`/speckit.taskstoissues`) | **NOT DOCUMENTED** |

---

### Feature 5: Specification Governance & Evolution (Epic)

**Epic Description**: Amendment tracking, decision logs, traceability mapping, rollback procedures.

**Spec-Kit Implementation Status**: ✓ **PARTIALLY IMPLEMENTED**

| Capability | Epic | Spec-Kit | Status |
|-----------|------|----------|--------|
| Constitution creation/updates | Yes | **YES** (`/speckit.constitution`) | ✓ Implemented |
| Amendment tracking | Implied | Yes (Git-based, memory files) | ✓ Implemented |
| Decision logging | Yes | Yes (constitution.md, memory/01-decisions.md) | ✓ Implemented |
| Traceability mapping | Yes | Analyzed in `/speckit.analyze` | ✓ Implemented |
| Rollback procedures | Yes | Git-based (not explicit automation) | Partial |
| Constitutional principles enforcement | Not mentioned | **YES** (`/speckit.analyze` validates MUST principles) | **NOT DOCUMENTED** |

---

### Feature 6: Specification Insights & Metrics (Epic)

**Epic Description**: Quality dashboards, burndown tracking, team insights, recommendations.

**Spec-Kit Implementation Status**: ✗ **NOT IMPLEMENTED**

| Capability | Epic | Spec-Kit | Status |
|-----------|------|----------|--------|
| Quality dashboards | Yes | ✗ Not found | Missing |
| Burndown tracking | Yes | ✗ Not found | Missing |
| Team insights | Yes | ✗ Not found | Missing |
| Recommendations | Yes | ✓ Partially (in analyze/checklist) | Partial |
| Metrics collection | Yes | ✗ Not found | Missing |
| Historical trend analysis | Yes | ✗ Not found | Missing |

---

## Advanced Functionality NOT in Epic Specification

### 1. Specification Quality Checklists (`/speckit.checklist`)

**What it does**: Generates custom "unit tests for requirements" instead of implementation tests.

**Epic Coverage**: Not mentioned (epic focuses on validation agents, not checklist generation)

**Capability Highlights**:
- Domain-focused checklists (UX, API, Security, Performance)
- Dynamic question generation based on feature context
- Requirement quality validation (completeness, clarity, consistency, measurability)
- Traceability requirement enforcement (≥80% items must have references)
- Scope-aware depth calibration

**Why It's Advanced**: This is a sophisticated concept—validating the quality of requirements writing itself, not just checking if specs are complete.

---

### 2. Interactive Clarification (`/speckit.clarify`)

**What it does**: Asks up to 5 targeted clarification questions to resolve ambiguities BEFORE planning.

**Epic Coverage**: Not mentioned (epic assumes specs are clear before planning begins)

**Capability Highlights**:
- Taxonomy-based ambiguity detection (scope, data model, UX, NFR, integration, edge cases, constraints, terminology)
- Incremental spec updates (writes clarifications after each answer, not batched)
- Prevents rework during planning
- Sequential questioning with recommended answers
- Optional coverage summary report

**Why It's Advanced**: Closes the gap between "spec exists" and "spec is clear enough to plan from"—saves rework downstream.

---

### 3. Cross-Artifact Consistency Analysis (`/speckit.analyze`)

**What it does**: Non-destructive, read-only analysis of spec.md, plan.md, tasks.md for inconsistencies, gaps, and constitution violations.

**Epic Coverage**: Not mentioned (epic doesn't explicitly discuss consistency validation)

**Capability Highlights**:
- Constitution authority (violations are CRITICAL)
- Duplication detection (near-duplicate requirements)
- Ambiguity detection (vague terms, placeholders)
- Underspecification detection (missing object/outcome)
- Coverage gap detection (requirements with zero tasks)
- Terminology drift detection
- Severity assignment (CRITICAL/HIGH/MEDIUM/LOW)
- Token-efficient (max 50 findings, aggregates overflow)
- Remediation recommendations (not auto-applied)

**Why It's Advanced**: Prevents implementation from proceeding on flawed specs; constitution violations are automatically escalated.

---

### 4. Constitution-Based Governance (`/speckit.constitution`)

**What it does**: Creates/updates project governance principles that become validation rules for all specs.

**Epic Coverage**: Not mentioned in requirements/design (governance is vague in epic)

**Capability Highlights**:
- Placeholder-based template (fill once, applies to all specs)
- Version management (MAJOR/MINOR/PATCH for governance changes)
- Sync impact reporting (which templates need updates when constitution changes)
- Principle enforcement in analysis (MUST/SHOULD rules)
- Amendment tracking

**Why It's Advanced**: Ties all specs to a single source of truth for project principles; prevents principle drift.

---

### 5. Plan Phase Workflow (`/speckit.plan`)

**What it does**: Multi-phase planning (Phase 0: Research, Phase 1: Design & Contracts).

**Epic Coverage**: Partially mentioned (epic describes plan output but not detailed workflow)

**Capability Highlights**:
- Phase 0: Research Task Generation
  - Extracts NEEDS CLARIFICATION items
  - Generates research agents for each unknown
  - Consolidates findings into research.md
- Phase 1: Design & Contracts
  - Data model extraction
  - API contract generation (OpenAPI/GraphQL)
  - Quickstart scenario generation
  - Agent context updates (Claude-specific)

**Why It's Advanced**: The research phase is proactive—instead of assuming clarity, plan automatically dispatches research agents for unresolved questions.

---

### 6. Implementation Execution & Checklist Pre-Flight (`/speckit.implement`)

**What it does**: Executes task plan with integrated checklist validation, setup verification, and progress tracking.

**Epic Coverage**: Implementation is mentioned but not these details

**Capability Highlights**:
- Checklist status pre-flight (blocks if incomplete checklists exist)
- Ignore file generation (technology-aware patterns for Docker, ESLint, Prettier, Terraform, Kubernetes, etc.)
- Git repo validation
- Phase-by-phase execution with dependency respect
- Task completion marking ([X] checkbox updates)
- Progress tracking and error handling

**Why It's Advanced**: Ensures implementation context is clean before starting; prevents common setup errors.

---

### 7. Task-to-GitHub-Issues (`/speckit.taskstoissues`)

**What it does**: Converts tasks.md entries into GitHub issues with dependency-ordered linking.

**Epic Coverage**: Not mentioned (epic doesn't discuss GitHub integration)

**Capability Highlights**:
- GitHub MCP server integration
- Dependency-ordered issue creation
- Remote URL validation (prevents issues in wrong repos)
- Task-to-issue traceability

**Why It's Advanced**: Bridges from spec-driven development to GitHub-based team workflows; enables collaborative task tracking.

---

## Missing from Spec-Kit (Per Epic Requirements)

### 1. Epic-Tier Specifications
- No templates for Epic-level requirements.md, design.md, tasks.md
- No commands for creating Epic specifications
- No Epic-specific validation

**Impact**: Epic spec framework describes 3-tier hierarchy, but spec-kit only implements Feature tier.

### 2. User Story-Tier Specifications
- No EARS-formatted User Story templates
- No User Story-specific validation or authoring commands

**Impact**: Epic describes User Stories as implementation-ready, but spec-kit treats "User Stories" as implicit in feature requirements.

### 3. Insights & Metrics (Feature 6)
- No quality dashboards
- No burndown tracking
- No team insights or metrics collection
- No historical trend analysis

**Impact**: Epic Feature 6 is completely unimplemented.

### 4. Template Extensibility Guidance
- No guidance on custom template creation
- No module system for optional sections
- No approval process for core section removal

**Impact**: Epic mentions "modular templates" but spec-kit doesn't expose this capability.

### 5. Custom Agent Creation Framework
- Agents (Enterprise Architect, Solutions Architect, QA Specialist) are defined but not exposed as extensible
- No documented process for creating custom agents
- No agent prompt standards

**Impact**: Epic mentions teams can create custom agents, but spec-kit doesn't provide the framework.

---

## Summary Matrix

| Aspect | Epic Scope | Spec-Kit Status | Gap Analysis |
|--------|-----------|-----------------|--------------|
| **Commands** | 6 implied | 9 implemented | Spec-kit has 3 additional commands not in epic |
| **Authoring** | Feature tier | Feature tier | ✓ Aligned (but missing Epic/Story tiers) |
| **Validation** | Agents + consistency | Agents + consistency + analysis | Spec-kit exceeds with `/speckit.analyze` |
| **Task Generation** | Yes | Yes + GitHub integration | Spec-kit exceeds with `/speckit.taskstoissues` |
| **Governance** | Amendment tracking | Constitution-based (comprehensive) | Spec-kit exceeds with `/speckit.constitution` |
| **Planning** | Single phase | Multi-phase (research included) | Spec-kit exceeds with detailed research |
| **Implementation** | Task execution | Task execution + setup validation | Spec-kit exceeds with ignore files, preflight checks |
| **Metrics** | Dashboards, burndown | ✗ Not implemented | Missing (both Epic and Spec-Kit) |
| **Three-Tier Support** | Epic/Feature/Story | Feature only | Missing (Epic and Story tiers) |

---

## Recommendations for Epic Specification Updates

### Update 1: Expand Command Inventory
Update epic requirements to document all 9 commands:
1. `/speckit.specify` (with quality checklist generation)
2. `/speckit.clarify` (new—not in epic)
3. `/speckit.plan` (with research phase)
4. `/speckit.checklist` (new—not in epic)
5. `/speckit.tasks` (with [P] markers and MVP scoping)
6. `/speckit.analyze` (new—not in epic)
7. `/speckit.implement` (with pre-flight validation)
8. `/speckit.constitution` (new—not in epic)
9. `/speckit.taskstoissues` (new—not in epic, GitHub integration)

### Update 2: Add Feature 0 Details
Spec-kit implements Feature 0 (Memory System) comprehensively:
- Document `.specify/memory/constitution.md` structure
- Document feature-level `_memory/` directory contents
- Highlight agent context compression via `update-agent-context.sh`

### Update 3: Define Epic & User Story Tiers
Epic specification assumes three-tier hierarchy, but spec-kit only implements Feature tier. Add:
- Epic-tier templates (requirements.md, design.md, tasks.md for Epic)
- User Story-tier templates (EARS format, implementation details)
- Tier-specific validation rules
- Tier-specific commands (`/specid.epic`, `/specid.story`)

### Update 4: Formalize Spec-Kit's Advanced Concepts
Document these as official capabilities:
- **Specification Quality Checklists**: "Unit tests for requirements" (validate spec writing, not implementation)
- **Interactive Clarification**: Pre-planning ambiguity resolution
- **Constitution-Based Governance**: Single source of truth for project principles
- **Cross-Artifact Analysis**: Read-only consistency validation with constitution authority

### Update 5: Plan Metrics Feature
Feature 6 (Insights & Metrics) is completely unimplemented. Consider:
- Prioritizing it for v1 or explicitly deferring to v2
- Designing the data collection strategy (sourcing from memory files, Git history, analyze results)
- Defining dashboard views and key metrics (spec quality, coverage, amendment frequency)

### Update 6: Design Extension Framework
Epic mentions custom agents and template extensibility but spec-kit doesn't expose these:
- Define agent prompt standards and creation process
- Document template modularity and removal approval process
- Provide examples of custom agent and template creation

---

## Conclusion

**The gap is not that spec-kit is missing functionality, but that the epic specification is incomplete.** Spec-kit implements several advanced features not documented in the epic:

- Interactive clarification and ambient spec quality improvement
- Constitution-based governance with principle enforcement
- Cross-artifact consistency analysis with automatic critical issue escalation
- Custom checklist generation for requirement quality validation
- GitHub integration for task-to-issue conversion
- Comprehensive implementation setup validation

The spec should be updated to reflect these capabilities and provide guidance on implementing the missing tiers (Epic and User Story) and Feature 6 (Metrics).

---

**Version**: 1.0.0 | **Analysis Date**: 2025-12-14 | **Scope**: Spec-Kit vs. Epic Specification
