---
id: "002"
type: feature
title: "Manuscript Scene Management"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - manuscript
  - commands
  - file-management
  - workflow
---

# Feature: Manuscript Scene Management

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Provides commands and tools for managing fiction manuscript structure through scene files. Includes automatic scene numbering, template generation, and flexible project structure support. Authors can create properly numbered scenes, resume writing sessions with context, and work across multiple novels simultaneously.

## User Stories

### Story 1: Create New Scene

**As a** fiction author
**I want** to quickly create properly numbered scene files with templates
**So that** I can maintain consistent manuscript structure without manual file management

**Acceptance Criteria:**
- [x] Command creates scene files with automatic numbering (###-scene-name.md)
- [x] Scene template is auto-generated
- [x] File structure is maintained consistently
- [x] Scenes are organized within chapter folders
- [x] Scene numbering adapts to existing scenes

### Story 2: Resume Writing Session

**As a** fiction author
**I want** to resume my writing session with full context
**So that** I can quickly get back into the story without re-reading everything

**Acceptance Criteria:**
- [x] Command reviews recent work automatically
- [x] Open questions and next steps are surfaced
- [x] Context is restored for continuing the narrative
- [x] Command works across different projects
- [x] Session restoration is fast and focused

### Story 3: Multi-Project Support

**As a** fiction author working on multiple novels
**I want** to manage scenes across different projects
**So that** I can work on multiple stories without confusion

**Acceptance Criteria:**
- [x] Commands accept project name parameter
- [x] Each project maintains separate scene structure
- [x] Context remains separate per project
- [x] Flexible project folder structures are supported
- [x] Can switch between projects seamlessly

## Functional Requirements

- REQ-F-001: System shall create numbered scene files with format ###-scene-name.md
- REQ-F-002: System shall auto-generate scene templates when creating new scenes
- REQ-F-003: System shall maintain chapter/scene folder organization
- REQ-F-004: System shall support multiple concurrent projects
- REQ-F-005: System shall restore writing context when resuming sessions
- REQ-F-006: System shall adapt to flexible project structures (chapters/, 3_content/, etc.)
- REQ-F-007: System shall accept project name as command parameter

## Non-Functional Requirements

- REQ-NF-001: Scene creation shall complete within 2 seconds
- REQ-NF-002: Session resumption shall surface relevant context efficiently
- REQ-NF-003: Commands shall provide clear feedback on success/failure
- REQ-NF-004: File naming shall follow consistent conventions
- REQ-NF-005: Project structure detection shall be automatic

## Implementation Details

**Commands Implemented:**

1. **`/new-scene [project] [chapter] [name]`**
   - Location: `writing-assistant/commands/new-scene.md`
   - Creates properly numbered scene file
   - Generates scene template
   - Maintains file structure

2. **`/continue [project]`**
   - Location: `writing-assistant/commands/continue.md`
   - Resumes writing session with context
   - Reviews recent work and notes
   - Surfaces open questions and next steps

**Project Structure Support:**

Flexible detection of common structures:
```
my-novel/
├── 3_content/       # Numbered content folder
│   └── chapter#/
│       └── ###-scene.md
├── chapters/        # Simple chapters folder
│   └── chapter#/
│       └── ###-scene.md
├── Lexicon/         # Story bible
└── notes/           # General notes
```

**Integration:**
- Obsidian vault symlink support
- Git version control compatibility
- Multi-project workspace handling

## Dependencies

- Bash (for command execution)
- File system access
- Markdown support
- Claude Code command system

## Success Criteria

- [x] Authors can create scenes quickly without manual file management
- [x] Scene numbering is automatic and consistent
- [x] Session resumption provides useful context
- [x] Multi-project workflows function smoothly
- [x] Flexible project structures are supported
- [x] Commands work reliably across different environments

## Notes

### Supported Project Structures

The feature adapts to various organizational patterns:

**Obsidian-Style:**
```
my-novel/
├── 3_content/
│   └── chapter8/
│       └── 001-opening.md
├── Lexicon/
│   ├── Characters/
│   ├── Planning/
│   └── World/
└── notes/
```

**Simple Structure:**
```
my-novel/
├── chapters/
│   └── chapter8/
│       └── 001-opening.md
└── notes/
```

**Custom:**
```
my-novel/
├── manuscript/
│   └── ch8/
│       └── 001-opening.md
└── story-bible/
```

### Command Examples

**Create New Scene:**
```bash
/new-scene my-novel 8 revelation
# Creates: my-novel/chapters/chapter8/003-revelation.md
# (Automatically numbers based on existing scenes)
```

**Resume Session:**
```bash
/continue my-novel
# Reviews recent scenes, surfaces open questions, restores context
```

### Obsidian Integration

Authors can symlink Obsidian vaults into the writing workspace:

```bash
ln -s ~/Obsidian/MyNovel ~/writing-workspace/my-novel
```

This allows:
- Note-taking in Obsidian
- Drafting in Claude Code
- Seamless reference to Lexicon/story-bible
- Git-friendly workflow

## Version History

- **v0.0.11** (Current): Production ready, full multi-project support
- **v1.0.0** (2026-01-15): Commands implemented (/new-scene, /continue)
