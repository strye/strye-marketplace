<!--
===============================================================================
SYNC IMPACT REPORT
===============================================================================

Version: 0.1.0 → 1.0.0 (MINOR bump - initial constitution creation)

Modified Principles: (5 principles created)
- I. Plugin Modularity
- II. Markdown-First Design
- III. Namespace Convention
- IV. Decentralized Registry
- V. Documentation Imperative

Added Sections: Plugin Architecture Standards, Testing Standards, Governance

Removed Sections: None (initial creation)

Templates Updated:
✅ plan-template.md - Constitutional reference already present
✅ spec-template.md - Constitutional reference already present
✅ tasks-template.md - Constitutional reference already present
✅ checklist-template.md - Will reference constitution version

Follow-up TODOs: None - all fields defined

===============================================================================
-->

# Strye Marketplace Constitution

This document establishes the non-negotiable principles governing development, plugin management, and architectural decisions in the Strye Marketplace—a collection of Claude Code plugins distributed via the `.claude-plugin/marketplace.json` registry.

## Core Principles

### I. Plugin Modularity

Every plugin MUST be self-contained and independently functional. A plugin includes its own `.claude-plugin/plugin.json` metadata, commands, skills, and agents without shared implementation files across plugins.

**Why**: Self-contained plugins enable easy distribution, version independence, and user choice about which plugins to load. Modularity prevents hidden dependencies and reduces risk of cascading failures when one plugin updates.

### II. Markdown-First Design

Plugin definitions—commands, agents, and skills—MUST be expressed as executable markdown files (`.md`), not code generation or templated systems. The markdown files themselves are the source of truth for prompts and agent instructions.

**Why**: Markdown is version-control friendly, human-readable, and enables direct editing without build steps. It aligns with Claude Code's scripting model where slash commands and agent prompts are markdown-based.

### III. Namespace Convention

Plugin commands MUST use dot notation: `<plugin-namespace>.<command-name>` (e.g., `spec.init`, `content.export`). Skill names MUST follow the same pattern when exposed. This prevents naming collisions across plugins and clarifies plugin ownership at a glance.

**Why**: Explicit namespacing eliminates ambiguity, prevents accidental overrides, and makes the plugin origin immediately recognizable to users.

### IV. Decentralized Registry with Central Catalog

Each plugin owns its `.claude-plugin/plugin.json` metadata. The central `.claude-plugin/marketplace.json` serves as the single source of truth for plugin discovery, maintaining name, source path, and description for all plugins.

**Why**: Decentralized metadata keeps plugins autonomous; the central registry enables discoverability and prevents orphaned or hidden plugins.

### V. Documentation Imperative

Every plugin, command, skill, and agent MUST include clear, actionable documentation. Commands have inline prompt guidance; skills have `SKILL.md` files describing purpose and usage; agents have clear responsibilities and capabilities. No undocumented or "obvious" components.

**Why**: Documentation enables self-service adoption, reduces onboarding friction, and preserves institutional knowledge as plugins evolve.

## Plugin Architecture Standards

All plugins MUST follow this directory structure:

```
plugin-name/
├── .claude-plugin/plugin.json    # Metadata: name, version, author, description
├── commands/                      # Slash commands: <namespace>.<name>.md
├── skills/                        # Reusable skills: SKILL.md + implementation
├── agents/                        # Agent definitions: *.md files
└── hooks/                         # (Optional) Event-driven behavior
```

**Enforced by**: Plugin authors MUST validate structure before submitting to marketplace.

## Testing Standards

Plugins intended for production MUST include:

1. **Explicit test instructions** in plugin documentation or a tests/ directory
2. **Manual acceptance criteria** for commands and agents (e.g., "Invoke /spec.init and verify plan.md is created")
3. **Example usage** showing typical workflows with expected outputs

Why: Plugins live in markdown and prompts—automated unit testing is not applicable. Manual validation ensures reliability.

## Governance

### Amendment Procedure

Changes to this constitution require:

1. **Proposal**: Document the amendment rationale and specific principle/section changes
2. **Review**: Assess impact on existing plugins and dependent templates
3. **Validation**: Verify no plugins become non-compliant; identify migration steps if needed
4. **Ratification**: Update version number (MAJOR/MINOR/PATCH), set `LAST_AMENDED_DATE`

### Versioning Policy

Constitution follows semantic versioning:
- **MAJOR**: Principle removal, redefinition, or backward-incompatible governance changes
- **MINOR**: New principle, new section, or materially expanded guidance
- **PATCH**: Clarifications, wording refinements, typo fixes

### Compliance Validation

All plugins MUST comply with Principles I–V. Marketplace.json serves as the canonical compliance audit trail. When amending the constitution:

1. Check `.specify/templates/plan-template.md` for Constitution Check gates → update if principles change
2. Check `.specify/templates/spec-template.md` for mandatory sections → update if governance changes
3. Check `.specify/templates/tasks-template.md` for task categorization → update if testing standards change
4. Review existing plugin documentation → identify any required updates

### Runtime Development Guidance

Refer to `CLAUDE.md` for tactical implementation guidance (directory structure, command naming, testing) and this constitution for strategic principles. When tactical guidance conflicts with the constitution, the constitution takes precedence.

---

**Version**: 1.0.0 | **Ratified**: 2025-12-13 | **Last Amended**: 2025-12-13
