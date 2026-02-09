---
id: "011"
type: feature
title: "SDD Workflow Commands"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_003-integrated-design-spec-plugin
children:
  # Specs to be created if needed
tags:
  - sdd
  - commands
  - workflow
  - requirements
  - design
  - tasks
---

# Feature: SDD Workflow Commands

**Parent Epic:** [Integrated Design Spec Plugin](../epics/epic_003-integrated-design-spec-plugin.md)

## Description

Complete set of commands implementing the SDD workflow: feature requirements creation, system design development, task generation, task execution, status checking, and validation. All commands use the `specid.*` namespace and guide users through the systematic requirements → design → implementation process.

## User Stories

### Story 1: Feature Requirements

**WHEN** defining a new feature
**THE SYSTEM SHALL** guide creation of clear requirements using EARS notation

**Acceptance Criteria:**
- [x] `/specid.feature` command creates/updates requirements
- [x] EARS notation enforced
- [x] What and why documented
- [x] Acceptance criteria captured
- [x] Requirements file generated

### Story 2: System Design

**WHEN** designing feature implementation
**THE SYSTEM SHALL** help create technical design referencing requirements

**Acceptance Criteria:**
- [x] `/specid.design` command creates/updates design
- [x] References requirements explicitly
- [x] Architecture decisions documented
- [x] How specified clearly
- [x] Design file generated

### Story 3: Task Generation

**WHEN** moving from design to implementation
**THE SYSTEM SHALL** break down design into implementable tasks

**Acceptance Criteria:**
- [x] `/specid.tasks` command generates task breakdown
- [x] Tasks derived from design
- [x] Implementation steps clear
- [x] Task tracking structure created
- [x] Tasks file generated

### Story 4: Task Execution

**WHEN** implementing specific tasks
**THE SYSTEM SHALL** provide context from requirements and design

**Acceptance Criteria:**
- [x] `/specid.task` command loads full context
- [x] Requirements accessible
- [x] Design accessible
- [x] Task status tracked
- [x] Implementation guided

### Story 5: Status and Validation

**WHEN** monitoring project progress
**THE SYSTEM SHALL** provide status overview and consistency validation

**Acceptance Criteria:**
- [x] `/specid.status` shows project overview
- [x] `/specid.validate` checks consistency
- [x] `/specid.task-status` monitors task progress
- [x] Issues flagged
- [x] Progress visible

## Functional Requirements

- REQ-F-001: System shall provide `/specid.feature` command for requirements
- REQ-F-002: System shall provide `/specid.design` command for design
- REQ-F-003: System shall provide `/specid.tasks` command for task generation
- REQ-F-004: System shall provide `/specid.task` command for task execution
- REQ-F-005: System shall provide `/specid.status` command for overview
- REQ-F-006: System shall provide `/specid.validate` command for consistency
- REQ-F-007: System shall provide `/specid.task-status` command for task monitoring
- REQ-F-008: System shall provide `/specid.steering` command for strategic updates
- REQ-F-009: System shall enforce EARS notation in requirements
- REQ-F-010: System shall maintain traceability across workflow stages

## Non-Functional Requirements

- REQ-NF-001: Commands shall execute within 5 seconds
- REQ-NF-002: Generated files shall follow consistent templates
- REQ-NF-003: Command feedback shall be clear and actionable
- REQ-NF-004: Workflow shall be systematic and repeatable
- REQ-NF-005: Context loading shall be comprehensive

## Implementation Details

**Commands Implemented:**

1. **`/specid.feature [name, text]`**
   - Create/update feature requirements
   - EARS notation
   - `docs/features/[name]/requirements.md`

2. **`/specid.design [name, text]`**
   - Create/refine design
   - References requirements
   - `docs/features/[name]/design.md`

3. **`/specid.tasks [name]`**
   - Generate implementation tasks
   - Break down design
   - `docs/features/[name]/tasks.md`

4. **`/specid.task [feature, task]`**
   - Work on specific task
   - Load full context
   - Track status

5. **`/specid.status`**
   - Project overview
   - Feature/design/task progress

6. **`/specid.validate`**
   - Consistency checking
   - Traceability verification

7. **`/specid.task-status [feature, task]`**
   - Task progress monitoring

8. **`/specid.steering`**
   - Update strategic direction
   - Modify steering documents

**Workflow:**
```
/specid.init
  ↓
/specid.feature [name]  →  requirements.md
  ↓
/specid.design [name]   →  design.md (refs requirements)
  ↓
/specid.tasks [name]    →  tasks.md (from design)
  ↓
/specid.task [feature] [task]  →  implement with context
  ↓
/specid.validate        →  check consistency
```

## Dependencies

- Claude Code command system
- File system access
- Markdown support
- Feature Requirements Worker skill

## Success Criteria

- [x] All 9 commands implemented
- [x] Workflow is systematic and clear
- [x] EARS notation enforced
- [x] Traceability maintained
- [x] Context provided at each stage
- [x] Status and validation functional
- [x] Commands work reliably

## Notes

### Command Namespace

All commands use `specid.` prefix (spec + integrated design):
- Consistent namespace
- Clear plugin association
- Avoids conflicts

### Typical Workflow

**Day 1: Requirements**
```bash
/specid.feature user-authentication "Users need secure login"
# Creates requirements.md with EARS notation
```

**Day 2: Design**
```bash
/specid.design user-authentication
# Solutions Architect agent reviews
# Creates design.md
```

**Day 3: Tasks**
```bash
/specid.tasks user-authentication
# Generates task breakdown
# Creates tasks.md
```

**Day 4-10: Implementation**
```bash
/specid.task user-authentication setup-database
/specid.task user-authentication implement-auth-api
/specid.task user-authentication add-unit-tests
```

**Day 11: Validation**
```bash
/specid.status
/specid.validate
```

## Version History

- **v0.0.1** (Current): All 9 commands implemented and functional
