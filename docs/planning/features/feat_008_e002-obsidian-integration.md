---
id: "008"
type: feature
title: "Obsidian Integration"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - obsidian
  - integration
  - symlinks
  - workflow
---

# Feature: Obsidian Integration

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Seamless integration with Obsidian vaults via symbolic links, allowing authors to maintain notes and story-bible in Obsidian while drafting manuscripts with Gordon in Claude Code. Supports flexible vault structures, bidirectional file access, and Git-compatible workflows.

## User Stories

### Story 1: Use Obsidian for Notes

**As a** fiction author who uses Obsidian for notes
**I want** to access my Obsidian vault from Claude Code
**So that** I can reference my story-bible while drafting with Gordon

**Acceptance Criteria:**
- [x] Can symlink Obsidian vaults into writing workspace
- [x] Gordon can read files from Obsidian vault
- [x] Notes remain in Obsidian for editing
- [x] Drafts can be created in Claude Code
- [x] No file duplication required

### Story 2: Story-Bible Reference

**As a** fiction author with extensive world-building notes
**I want** Gordon to access my Lexicon/story-bible in Obsidian
**So that** drafts maintain consistency with established world details

**Acceptance Criteria:**
- [x] Gordon can read Lexicon files
- [x] Character details are accessible
- [x] World-building notes are referenceable
- [x] Planning documents are available
- [x] Consistency is maintained across sessions

### Story 3: Bidirectional Workflow

**As a** fiction author using both tools
**I want** to edit notes in Obsidian and draft in Claude Code
**So that** I can use the best tool for each task

**Acceptance Criteria:**
- [x] Can edit notes in Obsidian
- [x] Can draft scenes in Claude Code
- [x] Changes are immediately visible
- [x] No synchronization delays
- [x] Workflow feels seamless

## Functional Requirements

- REQ-F-001: System shall support symbolic links to Obsidian vaults
- REQ-F-002: System shall read files from symlinked vaults
- REQ-F-003: System shall respect Obsidian vault structure
- REQ-F-004: System shall allow bidirectional file access
- REQ-F-005: System shall work with various vault organizations
- REQ-F-006: System shall maintain Git compatibility
- REQ-F-007: System shall not duplicate files unnecessarily

## Non-Functional Requirements

- REQ-NF-001: File access through symlinks shall be transparent
- REQ-NF-002: No synchronization delays between Obsidian and Claude Code
- REQ-NF-003: Symlink setup shall be simple (single command)
- REQ-NF-004: Integration shall not conflict with Obsidian features
- REQ-NF-005: Git workflows shall remain functional

## Implementation Details

**Symlink Setup:**

```bash
# In writing-workspace
ln -s ~/Documents/Obsidian/MyNovel ./my-novel

# Now accessible from both:
# - Obsidian: ~/Documents/Obsidian/MyNovel/
# - Claude Code: ~/writing-workspace/my-novel/
```

**Supported Vault Structures:**

**Typical Obsidian Writing Vault:**
```
MyNovel/  (symlinked)
├── 3_content/          # or chapters/
│   └── chapter#/
│       └── ###-scene.md
├── Lexicon/            # Story bible
│   ├── Characters/
│   │   ├── sarah.md
│   │   └── marcus.md
│   ├── World/
│   │   ├── technology.md
│   │   └── locations.md
│   └── Planning/
│       ├── outline.md
│       └── themes.md
└── notes/
    └── research.md
```

**Workflow Integration:**

1. **Note-Taking in Obsidian:**
   - Character profiles
   - World-building details
   - Plot outlines
   - Research notes

2. **Drafting with Gordon:**
   - Scene writing
   - Chapter development
   - Creative collaboration
   - Manuscript compilation

3. **Reference During Writing:**
   ```
   @gordon Read Lexicon/Characters/sarah.md for her background, then draft the confrontation scene.
   ```

## Dependencies

- Symbolic link support (Unix/Mac/Linux)
- File system access
- Obsidian (optional, for note editing)
- Compatible vault structure

## Success Criteria

- [x] Symlinks work transparently
- [x] Gordon accesses vault files correctly
- [x] Notes editable in Obsidian
- [x] Drafts writeable in Claude Code
- [x] No duplication required
- [x] Git workflows function properly
- [x] Integration feels seamless

## Notes

### Setup Instructions

**Step 1: Create Symlink**
```bash
cd ~/writing-workspace
ln -s ~/Documents/Obsidian/MyNovel ./my-novel
```

**Step 2: Verify**
```bash
ls -la my-novel
# Should show -> ~/Documents/Obsidian/MyNovel
```

**Step 3: Use with Gordon**
```bash
/continue my-novel
@gordon Read Lexicon/Characters/sarah.md and remind me of her backstory.
```

### Workflow Examples

**Morning - Obsidian Note Update:**
```
1. Open Obsidian
2. Update Lexicon/Characters/sarah.md with new detail
3. Save (automatically available in Claude Code)
```

**Afternoon - Claude Code Drafting:**
```bash
1. /continue my-novel
2. @gordon Draft the revelation scene where Sarah discovers the truth
3. Gordon reads Lexicon files for consistency
4. Scene drafted with proper character details
```

### Git Integration

**Single Repository:**
```bash
# Obsidian vault is the Git repo
cd ~/Documents/Obsidian/MyNovel
git init
git add .
git commit -m "Chapter 8 complete"

# Writing workspace symlink points to same repo
# No duplication
```

**Benefits:**
- Single source of truth
- No sync conflicts
- Version control for everything
- Backup and collaboration ready

### Obsidian Features That Still Work

The symlink doesn't interfere with:
- Obsidian graph view
- Backlinks and references
- Templates and plugins
- Mobile sync
- Community plugins
- Daily notes
- Tags and search

### Troubleshooting

**Symlink Not Working:**
```bash
# Check symlink exists
ls -la ~/writing-workspace/my-novel

# Recreate if needed
rm ~/writing-workspace/my-novel
ln -s ~/Documents/Obsidian/MyNovel ~/writing-workspace/my-novel
```

**Gordon Can't Read Files:**
```bash
# Verify path
cd ~/writing-workspace/my-novel
ls Lexicon/Characters/

# Check permissions
chmod -R u+r ~/Documents/Obsidian/MyNovel
```

### Alternative: Copy Workflow

If symlinks aren't feasible:
```bash
# Copy vault to workspace
cp -r ~/Documents/Obsidian/MyNovel ~/writing-workspace/my-novel

# Manually sync changes as needed
# (Not recommended - symlinks are better)
```

### Windows Support

Windows symlinks work differently:
```cmd
mklink /D C:\writing-workspace\my-novel C:\Users\Name\Documents\Obsidian\MyNovel
```

Or use WSL for Unix-like symlinks.

## Version History

- **v0.0.11** (Current): Production ready, full Obsidian integration
- **v1.0.0** (2026-01-25): Obsidian symlink support implemented
