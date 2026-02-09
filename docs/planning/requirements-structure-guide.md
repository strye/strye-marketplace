# Requirements Structure Guide
**Version:** 1.0.0
**Date:** 2026-02-01
**Status:** Draft - Iteration Phase

This document defines the structure and workflow for managing requirements in the Integrated Design Spec plugin. Once validated, these patterns will be implemented as commands and templates in the plugin.

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Naming Conventions](#naming-conventions)
4. [Artifact Types](#artifact-types)
5. [Metadata Standards](#metadata-standards)
6. [Workflow Instructions](#workflow-instructions)
7. [Future Commands](#future-commands)

---

## Overview

### Three-Tier Hierarchy

```
Epic (Business Objective)
  └─> Feature (Capability)
       └─> Spec (Implementation)
            └─> User Stories (embedded in spec)
```

### Design Principles

1. **Flat Structure**: No nested folders beyond artifact type
2. **Stable IDs**: Numeric identifiers prevent link breakage
3. **Descriptive Names**: Human-readable titles in filenames
4. **Flexible Growth**: Single files can become folders without breaking links
5. **Predictable Entry Points**: Always use `index.md` for multi-file artifacts

---

## Folder Structure

```
requirements/
├── readme.md                                    # Original overview (unchanged)
├── requirements-structure-guide.md              # This document
├── templates/                                   # Template files (to be created)
│   ├── epic-template.md
│   ├── feature-template.md
│   ├── spec-requirements-template.md
│   ├── spec-design-template.md
│   └── spec-tasks-template.md
├── epics/
│   ├── epic_001-spec-driven-development.md
│   └── epic_002-content-workflow-enhancement.md
├── features/
│   ├── feat_001_e001-architecture-review/
│   │   ├── index.md                            # Main entry point
│   │   ├── user-stories.md
│   │   └── acceptance-criteria.md
│   ├── feat_002_e001-spec-validation/
│   │   └── index.md
│   └── feat_003_e002-simple-feature.md         # Single file OK
└── specs/
    ├── spec_001_f001-solutions-architect-agent/
    │   ├── index.md                            # Requirements (entry point)
    │   ├── design.md                           # Technical design
    │   └── tasks.md                            # Implementation tasks
    ├── spec_002_f001-epic-command/
    │   ├── index.md
    │   ├── design.md
    │   ├── tasks.md
    │   └── api-contract.md                     # Optional additional files
    └── spec_003_f002-simple-spec.md            # Single file OK
```

---

## Naming Conventions

### Pattern

**Epics:**
```
epic_{id}-{title-in-kebab-case}
```

**Features:**
```
feat_{id}_e{epic-id}-{title-in-kebab-case}
```

**Specs:**
```
spec_{id}_f{feat-id}-{title-in-kebab-case}
```

### Components

| Component | Description | Format | Example |
|-----------|-------------|--------|---------|
| **type** | Artifact type | `epic`, `feat`, `spec` | `feat` |
| **id** | Unique identifier | 3-digit zero-padded | `001` |
| **epic-id** | Parent epic ID (features only) | 3-digit zero-padded | `e002` |
| **feat-id** | Parent feature ID (specs only) | 3-digit zero-padded | `f005` |
| **title** | Descriptive name | kebab-case | `user-authentication` |

### Complete Examples

```
epic_001-spec-driven-development.md
feat_001_e002-gordon-solomon-creative-collaboration.md
spec_001_f001-agent-personality-system/
```

### Benefits

- **Epic context visible**: Know which epic a feature belongs to at a glance
- **Feature context visible**: Know which feature a spec belongs to at a glance
- **Grep-friendly**: Search by epic `grep "e002"` or feature `grep "f001"`
- **Stable references**: IDs don't change even if relationships change
- **Hierarchical clarity**: Naming shows the hierarchy structure

### Rules

1. **IDs are sequential** within each type (epics: 001+, features: 001+, specs: 001+)
2. **IDs are permanent** - never reused, even if artifact is deprecated
3. **Titles are descriptive** - should clearly indicate purpose
4. **Titles use kebab-case** - lowercase, hyphens only, no underscores/spaces
5. **Type prefix required** - always include `epic_`, `feature_`, or `spec_`

---

## Artifact Types

### Epic

**Purpose:** High-level business objective or major initiative

**Format:** Typically single file

**File:** `epic_{id}-{title}.md`

**Contains:**
- Vision and business objectives
- Success criteria and KPIs
- Timeline and milestones
- Links to child features
- Stakeholders and owners

**Example:** `epic_001-spec-driven-development.md`

---

### Feature

**Purpose:** Specific capability or functional area within an epic

**Format:** Single file for simple features, folder for complex features

**Simple:** `feature_{id}-{title}.md`

**Complex:** `feature_{id}-{title}/`
- `index.md` - Overview and links (main entry point)
- `user-stories.md` - Detailed user stories
- `acceptance-criteria.md` - AC definitions
- Additional files as needed

**Contains:**
- Feature description
- User stories
- Acceptance criteria
- Link to parent epic
- Links to child specs

**Example:** `feature_001-architecture-review/`

---

### Spec

**Purpose:** Detailed implementation specification

**Format:** Folder with multiple documents (default)

**Structure:** `spec_{id}-{title}/`
- `index.md` - **Requirements** (main entry point)
- `design.md` - Technical design
- `tasks.md` - Implementation tasks
- Additional files as needed (api-contract.md, data-model.md, etc.)

**index.md (Requirements) Contains:**
- User stories (EARS notation recommended)
- Functional requirements
- Non-functional requirements
- Constraints and assumptions
- Link to parent feature

**design.md Contains:**
- Architecture and component design
- Data models
- API contracts
- Technical decisions
- Dependencies

**tasks.md Contains:**
- Implementation checklist
- Development tasks
- Testing tasks
- Documentation tasks

**Example:** `spec_001-solutions-architect-agent/`

---

## Metadata Standards

### Standard Frontmatter (YAML)

All artifacts include metadata at the top of their main file:

```yaml
---
id: "001"
type: epic | feature | spec
title: "Human Readable Title"
status: planning | ready | active | completed | deprecated
created: YYYY-MM-DD
updated: YYYY-MM-DD
parent: parent-artifact-id (for features and specs)
children:
  - child-artifact-id-1
  - child-artifact-id-2
tags:
  - relevant-tag
  - another-tag
---
```

### Epic Frontmatter Example

```yaml
---
id: "001"
type: epic
title: "Spec-Driven Development Framework"
status: active
created: 2026-02-01
updated: 2026-02-01
children:
  - feature_001-architecture-review
  - feature_002-spec-validation
tags:
  - sdd
  - architecture
---
```

### Feature Frontmatter Example

```yaml
---
id: "001"
type: feature
title: "Architecture Review System"
status: active
created: 2026-02-01
updated: 2026-02-01
parent: epic_001-spec-driven-development
children:
  - spec_001-solutions-architect-agent
  - spec_002-enterprise-architect-agent
tags:
  - architecture
  - review
---
```

### Spec Frontmatter Example

```yaml
---
id: "001"
type: spec
title: "Solutions Architect Agent"
status: planning
created: 2026-02-01
updated: 2026-02-01
parent: feature_001-architecture-review
tags:
  - agent
  - architecture
---
```

### Status Values

| Status | Description |
|--------|-------------|
| `planning` | Requirements gathering, design in progress |
| `ready` | Ready for implementation |
| `active` | Currently being implemented |
| `completed` | Implementation finished |
| `deprecated` | No longer active, kept for history |

---

## Workflow Instructions

### Instruction 1: Create a New Epic

**Steps:**

1. Determine next available ID:
   ```bash
   ls requirements/epics/ | grep -o 'epic_[0-9]*' | sort -t_ -k2 -n | tail -1
   ```

2. Create epic file:
   ```bash
   # Format: epic_{ID}-{title}.md
   touch requirements/epics/epic_002-content-workflow-enhancement.md
   ```

3. Use epic template (see templates/ folder)

4. Fill in frontmatter and content

5. Save and commit

**Output:** New epic file ready for features

---

### Instruction 2: Create a New Feature

**Steps:**

1. Determine next available ID:
   ```bash
   ls requirements/features/ | grep -o 'feature_[0-9]*' | sort -t_ -k2 -n | tail -1
   ```

2. Decide format:
   - **Simple feature** (3 or fewer user stories): Single file
   - **Complex feature** (4+ user stories, needs AC docs): Folder

3a. Create simple feature:
   ```bash
   touch requirements/features/feature_005-simple-workflow.md
   ```

3b. Create complex feature:
   ```bash
   mkdir requirements/features/feature_006-complex-workflow
   touch requirements/features/feature_006-complex-workflow/index.md
   touch requirements/features/feature_006-complex-workflow/user-stories.md
   touch requirements/features/feature_006-complex-workflow/acceptance-criteria.md
   ```

4. Use feature template (see templates/ folder)

5. Link to parent epic:
   ```markdown
   **Parent Epic:** [Spec-Driven Development](../epics/epic_001-spec-driven-development.md)
   ```

6. Update parent epic's `children` list in frontmatter

7. Save and commit

**Output:** New feature linked to epic

---

### Instruction 3: Create a New Spec

**Steps:**

1. Determine next available ID:
   ```bash
   ls requirements/specs/ | grep -o 'spec_[0-9]*' | sort -t_ -k2 -n | tail -1
   ```

2. Create spec folder and files:
   ```bash
   mkdir requirements/specs/spec_007-new-component
   touch requirements/specs/spec_007-new-component/index.md
   touch requirements/specs/spec_007-new-component/design.md
   touch requirements/specs/spec_007-new-component/tasks.md
   ```

3. Use spec templates (see templates/ folder)

4. Fill in `index.md` (requirements):
   - Add frontmatter
   - Add user stories (EARS notation recommended)
   - Add requirements
   - Link to parent feature

5. Fill in `design.md`:
   - Architecture overview
   - Component design
   - Data models
   - Technical decisions

6. Fill in `tasks.md`:
   - Implementation checklist
   - Testing tasks
   - Documentation tasks

7. Link to parent feature:
   ```markdown
   **Parent Feature:** [Architecture Review](../features/feature_001-architecture-review/index.md)
   ```

8. Update parent feature's `children` list in frontmatter

9. Add sibling document links in index.md:
   ```markdown
   **Related Documents:**
   - [Design](./design.md)
   - [Tasks](./tasks.md)
   ```

10. Save and commit

**Output:** New spec with requirements, design, and tasks

---

### Instruction 4: Promote Single File to Folder

When a simple artifact needs additional files:

**Steps:**

1. Create folder with same name:
   ```bash
   mkdir requirements/features/feature_003-simple-feature
   ```

2. Move file to `index.md`:
   ```bash
   mv requirements/features/feature_003-simple-feature.md \
      requirements/features/feature_003-simple-feature/index.md
   ```

3. Add additional files:
   ```bash
   touch requirements/features/feature_003-simple-feature/user-stories.md
   touch requirements/features/feature_003-simple-feature/acceptance-criteria.md
   ```

4. Update cross-references if needed (usually not required)

5. Save and commit

**Output:** Promoted artifact with no broken links

---

### Instruction 5: Link Parent to Child

**Steps:**

1. Open parent artifact main file

2. Add child ID to frontmatter `children` array:
   ```yaml
   children:
     - feature_001-architecture-review
     - feature_002-spec-validation  # new
   ```

3. Add child link in body:
   ```markdown
   **Child Features:**
   - [Architecture Review](../features/feature_001-architecture-review/index.md)
   - [Spec Validation](../features/feature_002-spec-validation/index.md)  <!-- new -->
   ```

4. Save and commit

**Output:** Parent now references child

---

### Instruction 6: Update Artifact Status

**Steps:**

1. Open artifact main file

2. Update `status` field in frontmatter:
   ```yaml
   status: active  # was: planning
   ```

3. Update `updated` field:
   ```yaml
   updated: 2026-02-01
   ```

4. Save and commit

**Output:** Status updated with timestamp

---

## Future Commands

Once this structure is validated, these commands will be implemented in the `integrated-design-spec` plugin:

### Command Namespace: `specid.*`

| Command | Purpose |
|---------|---------|
| `/specid.epic` | Create new epic |
| `/specid.feature` | Create new feature |
| `/specid.spec` | Create new spec |
| `/specid.link` | Link parent to child |
| `/specid.status` | Update artifact status |
| `/specid.promote` | Promote single file to folder |
| `/specid.validate` | Validate all links and references |
| `/specid.tree` | Show hierarchy tree |

### Command Parameters

**Example: Create Epic**
```
/specid.epic
  title: "Spec-Driven Development Framework"
  tags: sdd, architecture
```

**Example: Create Feature**
```
/specid.feature
  title: "Architecture Review System"
  parent: epic_001-spec-driven-development
  complex: true  # creates folder structure
```

**Example: Create Spec**
```
/specid.spec
  title: "Solutions Architect Agent"
  parent: feature_001-architecture-review
```

---

## Next Steps

1. **Validation Phase:**
   - Manually create 2-3 epics, features, and specs using these instructions
   - Test folder promotion workflow
   - Test link integrity
   - Gather feedback on structure

2. **Template Creation:**
   - Create template files in `requirements/templates/`
   - Include standard frontmatter
   - Include section placeholders
   - Include example content

3. **Command Implementation:**
   - Implement commands in `integrated-design-spec/commands/`
   - Create command helpers for ID generation
   - Create link validation utilities
   - Add status reporting

4. **Agent Integration:**
   - Update Solutions Architect agent to reference this structure
   - Update Enterprise Architect agent to reference this structure
   - Create validation agent for link checking

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-01 | Initial draft with three-tier hierarchy and naming conventions |

---

## References

- [Original Integrated Design Spec Requirements](./integrated-design-spec.md)
- [EARS Notation Guide](https://www.iaria.org/conferences2014/filesICCGI14/Tutorial%20ICCGI%202014%20EARS.pdf)
- [Claude Code Plugin Documentation](https://github.com/anthropics/claude-code)
