# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Claude plugin marketplace containing a collection of plugins for extending Claude Code functionality. The marketplace is managed by a central `marketplace.json` configuration file, with each plugin organized as an independent directory.

## Marketplace Structure

The repository contains four plugins:

- **content-creator**: A set of tools to help make better professional content
- **forecast-research**: A comprehensive research plugin for domain-specific internet exploration, content aggregation, and daily forecasting summaries
- **integrated-design-spec**: A comprehensive spec-driven development (SDD) plugin with three-tier specification hierarchy (Epic, Feature, User Story) and intelligent agents for architecture review and validation
- **writing-assistant**: Provides writing assistance for writing workflows including a special co-author agent for fiction, manuscript management, grammar checking, and research tools

### Plugin Architecture

Each plugin follows a standardized directory structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata (name, description, version, author)
├── commands/                # Slash commands (*.md files)
├── skills/                  # Skill modules with SKILL.md definitions
├── agents/                  # Specialized agents (*.md files)
└── hooks/                   # Event hooks (optional, used by content-creator)
```

### Key Files

- `.claude-plugin/marketplace.json`: Central registry of all plugins and their locations. Each plugin entry maps a name to its source directory and description.
- `.claude-plugin/plugin.json` (per plugin): Contains plugin metadata including name, description, version, and author information.

## Plugin Components

### Commands
Slash commands are defined as markdown files in the `commands/` directory. Each file is a prompt that executes when the slash command is invoked.

Example: `/hello` command would be defined in `commands/hello.md`.

Naming convention: `<plugin-namespace>.<command-name>.md` (e.g., `spec.init.md`, `spec.design.md`)

### Skills
Skills are reusable tool modules defined in the `skills/` directory. Each skill has:
- A `SKILL.md` file describing what the skill does
- Optional implementation files (JavaScript, CLI tools, etc.)

Example structures:
- Simple skill: `skills/SKILL.md`
- Complex skill with implementation: `skills/symlink-manager/SKILL.md` + CLI tools

### Agents
Specialized agents are defined as markdown files in the `agents/` directory. Agents are autonomous task handlers with specific capabilities.

Example: `agents/solutions-architect.md`, `agents/enterprise-architect.md` (in spec-claude plugin)

### Hooks (Optional)
Event-driven scripts that execute in response to Claude Code events. Currently used by content-creator plugin.

## Development Workflow

### Creating a New Command
1. Create a markdown file in the plugin's `commands/` directory
2. Use naming convention: `<plugin-namespace>.<command-name>.md`
3. Write the command prompt/instructions in the markdown file
4. The command becomes available as `/<plugin-namespace>.<command-name>` in Claude Code

### Creating a New Skill
1. Create a directory or file in the plugin's `skills/` directory
2. Write a `SKILL.md` file describing the skill's purpose and usage
3. Optionally add implementation files (JavaScript, CLI tools, etc.)
4. Skills are exposed through the Skill tool in Claude Code

### Adding a New Plugin to the Marketplace
1. Create a new plugin directory under `plugins/`
2. Initialize the plugin structure with `.claude-plugin/plugin.json`
3. Add the plugin entry to `.claude-plugin/marketplace.json` with name, source path, and description
4. Develop commands, skills, and agents within the plugin directory

## Development Tools & Commands

There are no build/lint/test commands in this marketplace. Plugin development is primarily about:
- Creating markdown files for commands and agents
- Defining SKILL.md files for skills
- Testing plugins locally through Claude Code's plugin system

To test a plugin locally:
1. Load the marketplace in Claude Code using the plugin configuration
2. Access commands using slash syntax (e.g., `/spec.init`)
3. Use skills through the Skill tool interface

## Key Architecture Decisions

- **Decentralized Plugin Registry**: Each plugin is self-contained with its own `plugin.json`, but the marketplace provides a central registry via `marketplace.json`
- **Markdown-based Definitions**: Commands, agents, and skills are defined in markdown files for easy versioning and editing
- **Namespace Convention**: Plugin commands use a dot notation for namespacing (e.g., `spec.init`) to avoid conflicts between plugins
- **Skill Modularity**: Skills can be simple (single SKILL.md) or complex (with implementations and CLI tools)

## Important Notes for Plugin Development

1. **Plugin Metadata**: Always keep `.claude-plugin/plugin.json` updated with accurate version numbers and descriptions
2. **Marketplace Registry**: Update `.claude-plugin/marketplace.json` when adding or removing plugins
3. **Command Naming**: Use consistent naming patterns with plugin namespace prefixes to prevent command conflicts
4. **Skill Documentation**: SKILL.md files should clearly describe what each skill does and how to use it
5. **Agent Organization**: Agents in spec-claude follow a methodology-driven approach and should reflect that in their prompts
