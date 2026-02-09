---
id: "007"
type: feature
title: "Multi-Project Workspace"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - workspace
  - multi-project
  - organization
  - context
---

# Feature: Multi-Project Workspace

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Support for managing multiple fiction writing projects simultaneously within a single workspace. Authors can work on multiple novels concurrently with separate contexts, independent tracking, and seamless project switching. All commands and skills work across projects with proper context isolation.

## User Stories

### Story 1: Concurrent Project Work

**As a** fiction author working on multiple novels
**I want** to manage all projects in one workspace
**So that** I can easily switch between stories without confusion

**Acceptance Criteria:**
- [x] Multiple projects coexist in workspace
- [x] Each project maintains separate file structure
- [x] Commands accept project name parameter
- [x] Context remains separate per project
- [x] Can switch projects seamlessly

### Story 2: Independent Project Tracking

**As a** fiction author with multiple novels
**I want** each project tracked independently
**So that** progress and statistics don't mix between stories

**Acceptance Criteria:**
- [x] Word counts tracked per project
- [x] Scenes and chapters organized per project
- [x] Context restoration per project
- [x] Export works per project
- [x] No cross-project contamination

### Story 3: Flexible Project Organization

**As a** fiction author with varying workflows
**I want** flexible project structure support
**So that** I can organize each novel the way that works best

**Acceptance Criteria:**
- [x] Supports various folder structures
- [x] Adapts to project conventions automatically
- [x] Works with Obsidian symlinks
- [x] Compatible with Git workflows
- [x] Doesn't enforce rigid structure

## Functional Requirements

- REQ-F-001: System shall support multiple concurrent projects in workspace
- REQ-F-002: System shall maintain separate context per project
- REQ-F-003: System shall allow seamless project switching
- REQ-F-004: System shall track projects independently
- REQ-F-005: System shall adapt to flexible project structures
- REQ-F-006: System shall support Obsidian symlink integration
- REQ-F-007: System shall work with Git version control

## Non-Functional Requirements

- REQ-NF-001: Project switching shall be instantaneous
- REQ-NF-002: Context isolation shall be maintained reliably
- REQ-NF-003: No limit on number of concurrent projects
- REQ-NF-004: Commands shall work consistently across projects
- REQ-NF-005: File operations shall respect project boundaries

## Implementation Details

**Workspace Structure:**

```
writing-workspace/
├── .claude/                    # Plugin auto-installs
├── my-novel/                   # Project 1
│   ├── chapters/
│   │   └── chapter#/
│   │       └── ###-scene.md
│   ├── Lexicon/
│   └── notes/
├── next-novel/                 # Project 2
│   ├── 3_content/
│   │   └── chapter#/
│   │       └── ###-scene.md
│   ├── story-bible/
│   └── planning/
└── short-stories/              # Project 3 (symlink to Obsidian)
    ├── story1.md
    ├── story2.md
    └── notes/
```

**Command Support:**

All commands accept project parameter:
- `/new-scene [project] [chapter] [name]`
- `/wordcount [project]`
- `/quick-grammar [project] [optional: file]`
- `/continue [project]`

**Skills Support:**

Skills work within project context:
- Export: Compiles specified project
- Grammar: Checks specified project files
- Research: Saves to project story-bible

**Context Isolation:**

Gordon maintains separate context per project:
- Character names and relationships
- Plot threads and story arcs
- World-building details
- Tone and genre conventions
- Story-specific terminology

## Dependencies

- Claude Code plugin system
- File system organization
- Command parameter support
- Context management

## Success Criteria

- [x] Authors can work on multiple projects simultaneously
- [x] Projects remain organizationally separate
- [x] Context doesn't bleed between projects
- [x] Commands work reliably per project
- [x] Skills respect project boundaries
- [x] Project switching is seamless
- [x] Flexible structures are supported

## Notes

### Workspace Setup

**Initial Setup:**
```bash
mkdir writing-workspace
cd writing-workspace
# Projects can be created or symlinked
```

**Adding Projects:**
```bash
# Create new project
mkdir my-novel
mkdir my-novel/chapters

# Or symlink Obsidian vault
ln -s ~/Obsidian/MyNovel ~/writing-workspace/my-novel
```

### Project Structure Flexibility

**Supported Structures:**

**Obsidian-Style:**
```
my-novel/
├── 3_content/          # Numbered content
├── Lexicon/            # Story bible
└── notes/
```

**Simple:**
```
my-novel/
├── chapters/
└── notes/
```

**Custom:**
```
my-novel/
├── manuscript/
├── story-bible/
├── research/
└── planning/
```

### Obsidian Integration

Authors can maintain notes in Obsidian while drafting in Claude Code:

**Setup:**
```bash
# In writing-workspace
ln -s ~/Obsidian/MyNovel ./my-novel

# Now both work:
# - Edit notes in Obsidian
# - Draft scenes with Gordon in Claude Code
# - Seamless reference to Lexicon
```

**Benefits:**
- Notes stay in Obsidian
- Drafting in Claude Code with Gordon
- No duplication
- Git-friendly workflow
- Best of both tools

### Context Switching

**Typical Workflow:**

Morning - Work on Science Fiction Novel:
```bash
/continue star-cipher
@gordon Let's work on the revelation scene in chapter 8.
# ... writing session ...
/wordcount star-cipher
```

Afternoon - Work on Horror Novel:
```bash
/continue shadow-house
@gordon I need help with the haunted atmosphere in chapter 3.
# ... writing session ...
/wordcount shadow-house
```

Gordon maintains separate context:
- Star Cipher: Hard sci-fi, quantum physics, space stations
- Shadow House: Psychological horror, haunted mansion, atmosphere

### Git Workflow

Projects can be versioned independently:

```bash
# Each project is a Git repo
cd my-novel
git init
git add .
git commit -m "Chapter 8 complete"

cd ../next-novel
git init
git add .
git commit -m "Initial outline"
```

Or workspace as single repo:
```bash
# Workspace-level repo
cd writing-workspace
git init
git add .
git commit -m "Progress on both novels"
```

## Version History

- **v0.0.11** (Current): Production ready, full multi-project support
- **v1.0.0** (2026-01-25): Multi-project workspace implemented
