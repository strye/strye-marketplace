# Requirements Quick Reference
**Version:** 1.0.0
**Date:** 2026-02-01

Fast reference guide for creating and managing requirements artifacts.

---

## File Naming Pattern

**Epics:**
```
epic_{ID}-{title-in-kebab-case}
```

**Features:**
```
feat_{ID}_e{epic-ID}-{title-in-kebab-case}
```

**Specs:**
```
spec_{ID}_f{feat-ID}-{title-in-kebab-case}
```

**Examples:**
- `epic_001-spec-driven-development.md`
- `feat_012_e001-user-authentication/`
- `spec_045_f012-login-api-endpoint/`

---

## Quick Commands

### Get Next ID

```bash
# Epic
ls requirements/epics/ | grep -o 'epic_[0-9]*' | sort -t_ -k2 -n | tail -1

# Feature
ls requirements/features/ | grep -o 'feat_[0-9]*' | sort -t_ -k2 -n | tail -1

# Spec
ls requirements/specs/ | grep -o 'spec_[0-9]*' | sort -t_ -k2 -n | tail -1
```

### Create Epic

```bash
touch requirements/epics/epic_XXX-title-here.md
```

### Create Feature (Simple)

```bash
# Replace XXX with feature ID, YYY with epic ID
touch requirements/features/feat_XXX_eYYY-title-here.md
```

### Create Feature (Complex)

```bash
# Replace XXX with feature ID, YYY with epic ID
mkdir requirements/features/feat_XXX_eYYY-title-here
touch requirements/features/feat_XXX_eYYY-title-here/index.md
touch requirements/features/feat_XXX_eYYY-title-here/user-stories.md
touch requirements/features/feat_XXX_eYYY-title-here/acceptance-criteria.md
```

### Create Spec

```bash
# Replace XXX with spec ID, YYY with feature ID
mkdir requirements/specs/spec_XXX_fYYY-title-here
touch requirements/specs/spec_XXX_fYYY-title-here/index.md
touch requirements/specs/spec_XXX_fYYY-title-here/design.md
touch requirements/specs/spec_XXX_fYYY-title-here/tasks.md
```

### Promote Single File to Folder

```bash
# Example: feat_003_e001-simple-feature.md -> feat_003_e001-simple-feature/
mkdir requirements/features/feat_003_e001-simple-feature
mv requirements/features/feat_003_e001-simple-feature.md \
   requirements/features/feat_003_e001-simple-feature/index.md
```

---

## Standard Frontmatter

### Epic

```yaml
---
id: "001"
type: epic
title: "Epic Title"
status: planning
created: 2026-02-01
updated: 2026-02-01
children:
  - feature_xxx-feature-name
tags:
  - tag1
---
```

### Feature

```yaml
---
id: "001"
type: feature
title: "Feature Title"
status: planning
created: 2026-02-01
updated: 2026-02-01
parent: epic_xxx-epic-name
children:
  - spec_xxx-spec-name
tags:
  - tag1
---
```

### Spec

```yaml
---
id: "001"
type: spec
title: "Spec Title"
status: planning
created: 2026-02-01
updated: 2026-02-01
parent: feature_xxx-feature-name
tags:
  - tag1
---
```

---

## Status Values

| Status | When to Use |
|--------|-------------|
| `planning` | Requirements gathering, design in progress |
| `ready` | Ready for implementation |
| `active` | Currently being implemented |
| `completed` | Implementation finished |
| `deprecated` | No longer active, kept for history |

---

## Linking Patterns

### Link to Parent (Upward)

```markdown
**Parent Epic:** [Epic Name](../epics/epic_001-epic-name.md)
**Parent Feature:** [Feature Name](../features/feature_001-feature-name/index.md)
```

### Link to Children (Downward)

```markdown
**Child Features:**
- [Feature Name](../features/feature_001-feature-name/index.md)

**Child Specs:**
- [Spec Name](../specs/spec_001-spec-name/index.md)
```

### Link to Sibling Documents

```markdown
**Related Documents:**
- [Design](./design.md)
- [Tasks](./tasks.md)
- [User Stories](./user-stories.md)
```

---

## EARS Notation Quick Reference

### 1. Ubiquitous (Always)
```
THE SYSTEM SHALL [response]
```

### 2. Event-Driven (Triggered)
```
WHEN [trigger]
THE SYSTEM SHALL [response]
```

### 3. State-Driven (Conditional)
```
WHILE [state]
THE SYSTEM SHALL [response]
```

### 4. Unwanted Behavior (Error)
```
IF [unwanted condition]
THEN THE SYSTEM SHALL [response]
```

### 5. Optional (Feature-Specific)
```
WHERE [feature applies]
THE SYSTEM SHALL [capability]
```

---

## File Structure at a Glance

### Epic (Single File)
```
epic_001-title.md
```

### Feature (Simple)
```
feature_001-title.md
```

### Feature (Complex)
```
feature_001-title/
├── index.md
├── user-stories.md
└── acceptance-criteria.md
```

### Spec (Default)
```
spec_001-title/
├── index.md      (requirements - main entry)
├── design.md
└── tasks.md
```

---

## Workflow Checklist

### Creating an Epic

- [ ] Get next ID
- [ ] Create file: `epic_XXX-title.md`
- [ ] Copy epic template from templates-reference.md
- [ ] Fill in frontmatter (id, title, status, created, tags)
- [ ] Write vision, success criteria, scope
- [ ] Save and commit

### Creating a Feature

- [ ] Get next ID
- [ ] Decide: simple (single file) or complex (folder)?
- [ ] Create file/folder structure
- [ ] Copy feature template from templates-reference.md
- [ ] Fill in frontmatter
- [ ] Link to parent epic: `parent: epic_xxx-epic-name`
- [ ] Update parent epic's `children` list
- [ ] Write description and user stories
- [ ] Save and commit

### Creating a Spec

- [ ] Get next ID
- [ ] Create folder: `spec_XXX-title/`
- [ ] Create three files: index.md, design.md, tasks.md
- [ ] Copy spec templates from templates-reference.md
- [ ] Fill in frontmatter in index.md
- [ ] Link to parent feature: `parent: feature_xxx-feature-name`
- [ ] Update parent feature's `children` list
- [ ] Write requirements in index.md (use EARS notation)
- [ ] Write design in design.md
- [ ] Write tasks in tasks.md
- [ ] Save and commit

---

## Common Patterns

### Update Status

1. Open artifact's main file (index.md or single .md)
2. Update `status` field in frontmatter
3. Update `updated` date
4. Save and commit

### Add Child to Parent

1. Open parent's main file
2. Add child ID to `children` array in frontmatter
3. Add child link in body under appropriate section
4. Update `updated` date
5. Save and commit

### Add Additional File to Spec

1. Create new file in spec folder: `spec_XXX-title/new-file.md`
2. Update index.md to link to new file in "Related Documents"
3. Save and commit

---

## Validation Checklist

### Before Committing

- [ ] All IDs are unique and sequential
- [ ] All parent links point to existing artifacts
- [ ] All child references in parent match actual children
- [ ] All frontmatter is valid YAML
- [ ] All status values are valid
- [ ] All dates are in YYYY-MM-DD format
- [ ] All internal links use correct relative paths
- [ ] All multi-file artifacts have index.md as entry point

---

## Future Commands (Planned)

Once validated, these workflows will become commands:

| Command | Purpose |
|---------|---------|
| `/specid.epic` | Create new epic |
| `/specid.feature` | Create new feature |
| `/specid.spec` | Create new spec |
| `/specid.link` | Link parent to child |
| `/specid.status` | Update artifact status |
| `/specid.promote` | Promote single file to folder |
| `/specid.validate` | Validate all links and structure |
| `/specid.tree` | Show hierarchy tree |

---

## Tips

1. **Always use index.md as entry point** for multi-file artifacts
2. **IDs are permanent** - never reuse an ID
3. **Link early, link often** - keep parent/child relationships updated
4. **Use EARS notation** for clear, testable requirements
5. **Start simple** - single files can be promoted to folders later
6. **Keep titles short** - they're in filenames and links
7. **Update status regularly** - reflects current state
8. **Tag generously** - helps with search and organization

---

## Need More Detail?

- **Full Structure Guide:** [requirements-structure-guide.md](./requirements-structure-guide.md)
- **Complete Templates:** [templates-reference.md](./templates-reference.md)
- **Original Plugin Docs:** [integrated-design-spec.md](./integrated-design-spec.md)

---

## Examples

### Example Epic Filename
```
epic_001-spec-driven-development.md
```

### Example Feature Filename (Simple)
```
feat_003_e001-content-ideation.md
```

### Example Feature Folder (Complex)
```
feat_001_e001-architecture-review/
```

### Example Spec Folder
```
spec_001_f001-solutions-architect-agent/
```

### Example Link (Parent)
```markdown
**Parent Epic:** [Spec-Driven Development](../epics/epic_001-spec-driven-development.md)
**Parent Feature:** [Architecture Review](../features/feat_001_e001-architecture-review/index.md)
```

### Example Link (Child)
```markdown
**Child Features:**
- [Architecture Review](../features/feat_001_e001-architecture-review/index.md)
- [Spec Validation](../features/feat_002_e001-spec-validation/index.md)

**Child Specs:**
- [Solutions Architect Agent](../specs/spec_001_f001-solutions-architect-agent/index.md)
- [Enterprise Architect Agent](../specs/spec_002_f001-enterprise-architect-agent/index.md)
```

### Example EARS Requirement
```markdown
WHEN a user submits an epic for review
THE SYSTEM SHALL invoke the Enterprise Architect agent within 2 seconds
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-01 | Initial quick reference |
