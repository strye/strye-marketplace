# Managing Coding Standards in Claude Code Plugins

## Overview

Best practices for including coding standards in a Claude Code plugin while avoiding context bloat and maintaining discoverability.

**Important**: This document addresses two contexts:
1. **Development projects** using Claude Code (CLAUDE.md-based)
2. **Claude Code plugins** themselves (plugin-native structures)

The recommended approaches differ significantly based on your context.

---

## Problem Statement

When building a Claude Code plugin for Spec-Driven Development (SDD), you need to enforce coding standards (frontend, backend, testing, etc.) without:
- Overloading the plugin manifest or command files
- Eating up precious chat context when creating documents
- Making standards hard to discover or update
- Including external files that won't ship with the plugin

## Solution Patterns

### FOR DEVELOPMENT PROJECTS

### 1. Steering Documents Pattern (Development - Recommended for non-plugin projects)

Use your existing steering document structure to house coding standards:

```
docs/steering/
  ├── product.md          # Business/product decisions
  ├── tech.md             # Technology stack & architecture
  ├── structure.md        # Directory structure & naming
  └── code-standards.md   # NEW: Coding standards reference
```

**Benefits:**
- Standards live in project files, not chat context
- Commands already read steering docs (see `specid.design.md`)
- Easy to update without touching `CLAUDE.md`
- Can be specific to your tech stack
- Discoverability: embedded in existing workflow

**Example structure for `code-standards.md`:**

```markdown
# Code Standards

## Frontend Standards

### TypeScript Conventions
- Strict mode enabled
- Interface over type for public APIs
- Naming: PascalCase for types, camelCase for functions

### React Best Practices
- Functional components only
- Hooks for state management
- Memoization for expensive renders

### Testing Requirements
- Minimum 80% coverage
- Unit tests in `__tests__` folders
- Integration tests in `e2e/` folder

## Backend Standards

[similar structure...]

## Git & Commit Standards

[standards...]
```

### 2. Template-Based Enforcement

Store standards in `.spec/templates/` and have commands reference them:

```
.spec/templates/
  ├── code-standards/
  │   ├── frontend.md
  │   ├── backend.md
  │   ├── testing.md
  │   └── api-design.md
  └── [existing templates]
```

Commands automatically apply standards by reading these templates when generating code blocks or design recommendations.

**When to use:** When you want granular, technology-specific standards that vary by component type.

### 3. Plugin Skills Pattern (FOR CLAUDE CODE PLUGINS - PRACTICAL RECOMMENDED)

Create a skill that provides code standards guidance. This is the best approach for Claude Code plugins because:
- Skills are part of the plugin package distribution
- Standards are bundled with the plugin
- No external files needed
- Auto-discovered by Claude Code

**Structure:**
```
integrated-design-spec/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── specid.feature.md
│   ├── specid.design.md
│   └── [... other commands]
├── agents/
│   └── [... existing agents]
├── skills/
│   └── code-standards/          # NEW SKILL
│       ├── SKILL.md
│       └── standards/
│           ├── frontend.md
│           ├── backend.md
│           └── testing.md
```

**`skills/code-standards/SKILL.md`:**
```markdown
---
name: Code Standards Reference
description: Provides coding standards guidance for design and implementation tasks. Use when applying project-specific code standards to designs, tasks, or components.
version: 1.0.0
---

# Code Standards Reference

This skill provides access to project-specific coding standards.

## Available Standards

- **Frontend Standards**: React, TypeScript, styling conventions
- **Backend Standards**: API design, database patterns, service layers
- **Testing Standards**: Coverage requirements, test organization

## Standards Files

- `standards/frontend.md` - Frontend development standards
- `standards/backend.md` - Backend development standards
- `standards/testing.md` - Testing requirements and patterns
```

**Usage in Commands:**

Commands reference the skill in their output:

```markdown
### Component: AuthenticationService
**Standards Applied**: Code-standards skill - Backend Standards
  - Follows Backend API design patterns
  - Service layer architecture with TypeScript interfaces
  - 80% minimum test coverage required
```

**Benefits:**
- ✅ Part of plugin package (no external dependencies)
- ✅ Auto-discovered by Claude Code
- ✅ Standards bundled and deployed together
- ✅ Easy to update (one place per standard)
- ✅ Context-efficient (only loaded when skill is used)
- ✅ Proper plugin architecture
- ✅ Scales easily

### 4. MCP-Based Knowledge System (FOR CLAUDE CODE PLUGINS - OPTIMAL if setup available)

Create an MCP server for standards that commands can query on-demand:

```typescript
// .spec/mcp-servers/code-standards.mcp.ts
export function query_frontend_standards() {
  return readFile('.spec/code-standards/frontend.md')
}

export function query_by_technology(tech: string) {
  return readFile(`.spec/code-standards/${tech}.md`)
}

export function query_standards_for_component(componentType: string) {
  // Return relevant standards based on component type
  return readFile(`.spec/code-standards/${componentType}.md`)
}
```

Then in commands:
```typescript
const standards = await queryCodeStandards('react');
// Use standards in design/task generation without loading into context until needed
```

**Benefits:**
- Zero context cost (queried on demand)
- Centralized updates
- Composable standards
- Automatic updates across all commands

**When to use:** Large plugins with complex standards requirements and MCP infrastructure already in place.

**Benefits over Skills approach:**
- Even more context-efficient (standards queried, not pre-loaded)
- More sophisticated querying (filter by technology, component type, etc.)
- Programmatic access to standards

### 5. Lightweight Reference in CLAUDE.md (Development projects only)

Keep `CLAUDE.md` minimal with just pointers:

```markdown
## Code Standards

Detailed coding standards are maintained separately:

- **Frontend**: See `/docs/steering/code-standards.md#frontend`
- **Backend**: See `/docs/steering/code-standards.md#backend`
- **Testing**: See `/docs/steering/code-standards.md#testing`

Commands automatically apply standards when generating designs and tasks.
```

**The entire section is just 5 lines.** Point to the file, don't embed it.

### 6. Hook-Based Validation (Smart Enforcement)

Use Claude Code hooks to validate generated code against standards:

```bash
#!/bin/bash
# .claude/hooks/post-file-write.sh - Check generated code against standards

if [[ $FILE_PATH == *.tsx ]]; then
  eslint "$FILE_PATH" --config .eslintrc.project.json
  if [ $? -ne 0 ]; then
    echo "⚠️ Code doesn't match project standards. Review the linting errors."
  fi
fi
```

**Benefits:**
- Provides feedback without context overhead
- Runs automatically after file creation
- Enforces standards at the file system level
- No context cost for feedback delivery

### 7. Enhanced Spec Templates

Bake standards into your existing spec templates:

**In `.spec/templates/design-template.md`:**

```markdown
# Design: [FeatureName]

## Code Standards Applied

This design assumes adherence to:
- Frontend: Per `/docs/steering/code-standards.md#frontend`
- Testing: Per `/docs/steering/code-standards.md#testing`

## Components

[components with standards embedded in the typescript interfaces]

## Data Models

[models following naming conventions from code-standards.md]
```

**Benefits:**
- Standards are explicitly called out during design
- Designers and implementers aware of constraints
- Self-documenting

---

## Context Cost Comparison

### For Development Projects (CLAUDE.md-based)

| Approach | Chat Context | Update Cost | Discoverability | Flexibility |
|----------|-------------|------------|-----------------|-------------|
| Embed in CLAUDE.md | 500-2000 tokens | High | Easy | Low |
| Steering document | ~50 tokens (link) | Low | Medium | High |
| Enhanced specs | ~30 tokens | Low | High | High |
| MCP Server (dev) | 0 tokens (queried) | Low | High | Very High |

### For Claude Code Plugins

| Approach | Plugin Size | Update Cost | Discoverability | Flexibility | Setup Effort |
|----------|------------|------------|-----------------|-------------|--------------|
| **Plugin Skills** (RECOMMENDED) | +5-15KB | Low | High | High | 2-3 hours |
| MCP Server (Optimal) | +10-20KB | Medium | Very High | Very High | 6-8 hours |

**Notes:**
- Plugin Skills: Easy to implement, auto-discovered, bundled with plugin
- MCP Server: More sophisticated but requires Node.js/Python infrastructure

---

## Recommended Approaches by Context

### FOR CLAUDE CODE PLUGINS (integrated-design-spec)

**Primary Recommendation: Plugin Skills Approach**

This is the most practical and maintainable approach for plugins because:

1. **Self-contained**: Standards are part of the plugin package
2. **Auto-discovered**: Claude Code loads them automatically
3. **Practical setup**: Only 2-3 hours to implement
4. **Scalable**: Easy to add more standards
5. **Maintainable**: Update one place, all commands use it

**Secondary Option: MCP Server** (if you have Node.js/Python infrastructure)

This is optimal for maximum context efficiency and sophisticated querying, but requires more setup.

---

### FOR DEVELOPMENT PROJECTS (non-plugin)

**Recommendation: Steering Document + CLAUDE.md Reference**

Use a combination of methods:

### Step 1: Create `/docs/steering/code-standards.md`

Structure sections by technology domain:
- Frontend standards (React, TypeScript, styling)
- Backend standards (API design, database patterns)
- Testing standards (coverage targets, test organization)
- Git/commit standards
- Documentation standards

**Example content:**

```markdown
# Code Standards

## Frontend Standards

### TypeScript
- Enable strict mode in tsconfig.json
- Use `interface` for public APIs, `type` for unions/tuples
- Naming: PascalCase for types/components, camelCase for functions/variables
- No `any` types without explicit `// @ts-ignore` comment with justification

### React Components
- Use functional components only
- Extract custom hooks for shared logic
- Apply React.memo() for expensive renders (>1ms)
- File structure: component, hooks, types, tests in single folder

### Styling
- Use CSS Modules for component styles
- Follow BEM naming: `.Component__element--modifier`
- Mobile-first responsive design
- No inline styles except for dynamic values

### Testing
- Unit: 80% minimum coverage
- Unit tests in `__tests__/` adjacent to source
- Integration tests in `e2e/` folder
- Use React Testing Library, not Enzyme

## Backend Standards

[similar structure...]
```

### Step 2: Update `/CLAUDE.md`

Add minimal reference (just 5 lines):

```markdown
## Code Standards

Detailed coding standards are maintained in:
- [`/docs/steering/code-standards.md`](./docs/steering/code-standards.md)

Commands automatically apply these standards when generating designs and tasks.
```

### Step 3: Update Commands to Read Standards

Modify `specid.design.md` Step 5 to include code standards:

```typescript
// Step 5: Read Steering Documents

console.log('Reading steering documents...');

let codeStandards = '';

if (fileExists('docs/steering/code-standards.md')) {
  codeStandards = readFile('docs/steering/code-standards.md');
  console.log('✓ Loaded code standards');
} else {
  console.warn('⚠️ code-standards.md not found');
}

if (fileExists('docs/steering/tech.md')) {
  techSteering = readFile('docs/steering/tech.md');
  console.log('✓ Loaded tech.md (technical constraints)');
}

// ... rest of existing code
```

Then pass `codeStandards` to component generation:

```typescript
const components = generateComponents(
  requirementsContent,
  userStories,
  requirementIds,
  techConstraints,
  designGuidance,
  codeStandards  // NEW: Pass standards
);
```

### Step 4: Enhance Component Generation

Update helper function to reference standards:

```typescript
function generateComponents(
  requirementsContent: string,
  userStories: UserStory[],
  requirementIds: string[],
  techConstraints: TechConstraints,
  designGuidance: string,
  codeStandards: string  // NEW parameter
): Component[] {
  const components: Component[] = [];

  // ... existing logic ...

  // When generating component interface
  if (needsUI) {
    components.push({
      name: 'UIComponent',
      type: 'presentation',
      purpose: 'User interface for feature interactions',
      responsibilities: [...],
      interfaces: generateComponentInterface('UIComponent', techConstraints),
      standards: 'Per code-standards.md#frontend',  // NEW
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  return components;
}
```

### Step 5: Include in Design Output

When rendering the design document, add standards reference:

```typescript
let componentsSection = '';
for (const component of data.components) {
  componentsSection += `\n### Component: ${component.name}\n\n`;
  componentsSection += `**Purpose**: ${component.purpose}\n\n`;

  if (component.standards) {
    componentsSection += `**Code Standards**: ${component.standards}\n\n`;
  }

  // ... rest of component rendering
}
```

---

## Implementation for Plugin Skills Approach

### Step 1: Create Skill Directory Structure

```bash
mkdir -p skills/code-standards/standards
```

### Step 2: Create SKILL.md

Create `skills/code-standards/SKILL.md` with skill metadata and guidance.

### Step 3: Create Standard Files

- `skills/code-standards/standards/frontend.md` - Frontend development standards
- `skills/code-standards/standards/backend.md` - Backend development standards
- `skills/code-standards/standards/testing.md` - Testing requirements and patterns

### Step 4: Update Commands to Reference Skill

Modify commands like `specid.design.md` to include:

```markdown
**Code Standards Applied**: See code-standards skill

Designs should follow:
- Frontend standards (if UI components)
- Backend standards (if services/APIs)
- Testing standards (for all components)
```

### Step 5: Test Skill Discovery

Verify that Claude Code auto-discovers the skill and it's available during command execution.

### Implementation Checklist

- [ ] Create `skills/code-standards/` directory
- [ ] Create `skills/code-standards/SKILL.md` with skill metadata
- [ ] Create `skills/code-standards/standards/frontend.md`
- [ ] Create `skills/code-standards/standards/backend.md`
- [ ] Create `skills/code-standards/standards/testing.md`
- [ ] Update `specid.design.md` to reference code-standards skill
- [ ] Update `specid.tasks.md` to reference code-standards skill
- [ ] Test skill auto-discovery in Claude Code
- [ ] Optional: Create MCP server for more sophisticated querying

---

## Implementation for Development Projects

### Step 1: Create `/docs/steering/code-standards.md`

Structure sections by technology domain:
- Frontend standards (React, TypeScript, styling)
- Backend standards (API design, database patterns)
- Testing standards (coverage targets, test organization)
- Git/commit standards
- Documentation standards

### Step 2: Update `/CLAUDE.md`

Add minimal reference (just 5 lines):

```markdown
## Code Standards

Detailed coding standards are maintained in:
- [`/docs/steering/code-standards.md`](./docs/steering/code-standards.md)

Commands automatically apply these standards when generating designs and tasks.
```

### Step 3: Update Commands to Read Standards

Modify `specid.design.md` Step 5 to read code-standards.md

### Implementation Checklist (Development)

- [ ] Create `/docs/steering/code-standards.md` with your specific standards
- [ ] Add 5-line reference to `CLAUDE.md` pointing to code-standards.md
- [ ] Update `specid.design.md` to read code-standards.md (Step 5)
- [ ] Update component generation to include standards references
- [ ] Test that standards are included in generated designs
- [ ] Optional: Add post-file-write hook for linting validation
- [ ] Optional: Create MCP server for advanced standards queries

---

## Maintenance Strategy

### For Plugin Skills Approach

**When standards change:**
1. Update `skills/code-standards/standards/[domain].md`
2. No changes to plugin.json, commands, or agents
3. All future uses of the skill automatically use updated standards
4. Plugin is re-deployed with updated standards

**When adding new standards:**
1. Add new `.md` file to `skills/code-standards/standards/`
2. Update `skills/code-standards/SKILL.md` to reference new standards
3. Update commands that should reference new standards
4. No code changes needed, just documentation updates

### For Development Projects

**When standards change:**
1. Update `/docs/steering/code-standards.md`
2. No changes needed to `CLAUDE.md` or commands
3. All future designs automatically use updated standards
4. Previous designs remain unchanged (versioned in git)

**When adding new technology/component type:**
1. Add new section to `code-standards.md`
2. No changes to commands
3. Next design generation will reference new standards

---

## Context Efficiency

### Plugin Skills Approach

- **Plugin size increase**: 5-15KB (minimal)
- **Standards bundled**: Yes (shipped with plugin)
- **Context cost when skill used**: 0-100 tokens (only relevant sections)
- **Discoverability**: Automatic via skill auto-discovery

### Development Projects with Steering Documents

- **CLAUDE.md**: 5 additional lines (minimal context cost)
- **Commands**: 3-5 additional lines per command that uses standards
- **Chat context per design generation**: ~50 tokens (just the reference, not full standards)
- **Total context savings**: 400-1500 tokens per document generation

The standards file is ~1000-2000 tokens but is read **only when needed** and **only by commands that specifically reference them**, not loaded into every chat context.

---

## Advanced: Multi-Technology Plugins

For plugins with multiple tech stacks (frontend + backend + mobile):

```
skills/code-standards/
  ├── SKILL.md
  └── standards/
      ├── index.md           # Overview and quick links
      ├── frontend.md        # React, TypeScript, etc.
      ├── backend.md         # Node.js, database, API design
      ├── mobile.md          # React Native, Flutter, etc.
      └── cross-cutting.md   # Git, testing, docs for all
```

The skill description can guide when to use which standard, and commands can reference specific sections.

---

## Related Resources

**For Claude Code Plugins:**
- `.claude-plugin/plugin.json` - Plugin manifest
- `commands/` - Slash commands that reference standards skill
- `agents/` - Subagents that apply standards guidance
- `skills/code-standards/` - The standards skill (NEW)

**For Development Projects:**
- `CLAUDE.md` - Project philosophy and guidance
- `docs/steering/tech.md` - Technology stack and architecture
- `docs/steering/product.md` - Product vision and decisions
- `docs/steering/structure.md` - Directory organization
- `docs/steering/code-standards.md` - Coding standards

