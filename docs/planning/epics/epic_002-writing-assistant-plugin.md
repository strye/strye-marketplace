---
id: "002"
type: epic
title: "Writing Assistant Plugin"
status: completed
created: 2026-02-01
updated: 2026-02-01
children:
  - feat_001_e002-gordon-solomon-creative-collaboration
  - feat_002_e002-manuscript-scene-management
  - feat_003_e002-professional-export-system
  - feat_004_e002-grammar-and-style-checking
  - feat_005_e002-research-and-fact-checking
  - feat_006_e002-writing-progress-tracking
  - feat_007_e002-multi-project-workspace
  - feat_008_e002-obsidian-integration
tags:
  - fiction-writing
  - creative-writing
  - manuscript
  - collaboration
  - co-writer
---

# Epic: Writing Assistant Plugin

## Vision

Create an AI co-writer plugin for fiction authors that provides **genuine creative partnership** through Gordon Solomon, a specialized fiction writing agent, combined with comprehensive manuscript management, grammar checking, research tools, and professional export capabilities.

Transform Claude Code into a complete fiction writing environment where AI collaboration feels like working with a talented co-author, not just using an assistive tool.

## Business Value

**For Fiction Authors:**
- Access to a creative collaborator who actively contributes ideas and drafts
- Professional manuscript management within development environment
- Comprehensive editing and grammar support
- Research assistance for world-building and fact-checking
- Export to industry-standard formats (DOCX, PDF, EPUB)

**For Creative Writers:**
- Maintain creative flow with active brainstorming partner
- Overcome writer's block through collaborative ideation
- Strengthen manuscripts through honest, specific feedback
- Build complex narratives with structural support

**Measurable Outcomes:**
- Increased writing productivity (more usable content per session)
- Improved manuscript quality through collaborative refinement
- Reduced time from draft to submission-ready manuscript
- Greater author confidence in story structure and execution

## Success Criteria

- [x] Gordon Solomon agent provides genuine creative collaboration (active ideas, bold suggestions)
- [x] Writers report feeling "unstuck" and energized during sessions
- [x] Manuscript export works seamlessly for DOCX, PDF, and EPUB formats
- [x] Grammar and style checking preserves author voice while catching errors
- [x] Research assistant provides accurate, sourced information for world-building
- [x] Multi-project support allows work across multiple novels simultaneously
- [x] Integration with Obsidian for seamless note management
- [x] Technical tools (export, grammar, wordcount) work invisibly without friction
- [x] Writers view Gordon as co-author deserving credit, not just a tool

## Scope

### In Scope

**Core Creative Collaboration:**
- Gordon Solomon agent (co-writer with creative agency)
- Story development and plotting
- Scene and chapter drafting
- Character development and dialogue
- World-building and thematic exploration
- Honest creative feedback and critique
- Structural guidance (pacing, tension, emotional beats)

**Manuscript Management:**
- Multi-project workspace support
- Scene and chapter organization
- Word count tracking and statistics
- Progress monitoring
- File structure management

**Quality Assurance:**
- Grammar and spelling checking
- Style analysis (preserving author voice)
- Dialogue formatting verification
- Consistency checking across manuscript

**Research and Reference:**
- World-building research
- Fact-checking for technical details
- Historical, cultural, and scientific research
- Source documentation

**Professional Output:**
- Export to DOCX (industry standard)
- Export to PDF (beta readers, review copies)
- Export to EPUB (self-publishing)
- Professional manuscript formatting
- Industry-standard submission formatting

**Integration Support:**
- Obsidian vault integration via symlinks
- Git version control compatibility
- Multi-project concurrent work

### Out of Scope

- Non-fiction writing workflows (see Content Creator plugin)
- Marketing and publishing platform integration
- Cover design or book formatting beyond manuscript
- Agent/publisher submission management
- Beta reader feedback collection tools
- Writing analytics platforms integration
- Plot structure visualization (future consideration)
- Character relationship mapping (future consideration)
- Timeline and continuity tracking (future consideration)

## Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| **M1: Gordon Solomon Agent** | 2026-01-03 | completed |
| Gordon agent implementation | 2026-01-03 | completed |
| Creative collaboration capabilities | 2026-01-03 | completed |
| Genre expertise (sci-fi, horror) | 2026-01-03 | completed |
| **M2: Core Commands** | 2026-01-15 | completed |
| /new-scene command | 2026-01-15 | completed |
| /wordcount command | 2026-01-15 | completed |
| /quick-grammar command | 2026-01-15 | completed |
| /continue command | 2026-01-15 | completed |
| **M3: Skills Implementation** | 2026-01-20 | completed |
| Export Manuscript skill (DOCX, PDF, EPUB) | 2026-01-20 | completed |
| Grammar Check skill | 2026-01-20 | completed |
| Research Assistant skill | 2026-01-20 | completed |
| **M4: Integration Support** | 2026-01-25 | completed |
| Obsidian symlink support | 2026-01-25 | completed |
| Multi-project workspace | 2026-01-25 | completed |
| Flexible project structure | 2026-01-25 | completed |
| **M5: Production Release** | 2026-01-30 | completed |
| Documentation complete | 2026-01-30 | completed |
| Testing across workflows | 2026-01-30 | completed |
| v1.0.0 release | 2026-01-03 | completed |
| v0.0.11 refinements | 2026-01-30 | completed |

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Owner | Will Strye | Plugin development and Gordon's creative direction |
| Primary User | Fiction Authors | Creative collaboration and manuscript development |
| Co-Creator | Gordon Solomon (AI) | Creative partnership and story development |
| Beta Users | Science Fiction Writers | Genre-specific feedback and testing |
| Beta Users | Horror Writers | Genre-specific feedback and testing |

## Features

This epic includes completed and potential future features:

**Implemented Features:**
- [Gordon Solomon Creative Collaboration](../features/feat_001_e002-gordon-solomon-creative-collaboration.md) - AI co-writer with genuine creative partnership
- [Manuscript Scene Management](../features/feat_002_e002-manuscript-scene-management.md) - Scene creation, numbering, and session resumption
- [Professional Export System](../features/feat_003_e002-professional-export-system.md) - DOCX, PDF, EPUB export with industry formatting
- [Grammar and Style Checking](../features/feat_004_e002-grammar-and-style-checking.md) - Comprehensive editing while preserving voice
- [Research and Fact-Checking](../features/feat_005_e002-research-and-fact-checking.md) - World-building research and accuracy validation
- [Writing Progress Tracking](../features/feat_006_e002-writing-progress-tracking.md) - Word counts and manuscript statistics
- [Multi-Project Workspace](../features/feat_007_e002-multi-project-workspace.md) - Concurrent work on multiple novels
- [Obsidian Integration](../features/feat_008_e002-obsidian-integration.md) - Seamless vault integration via symlinks

**Future Consideration Features:**
- Feature: Additional Genre-Specialist Agents (fantasy, mystery, literary)
- Feature: Plot Structure Visualization
- Feature: Character Relationship Mapping
- Feature: Timeline and Continuity Tracking
- Feature: Beta Reader Feedback Management
- Feature: Publishing Platform Integration

## Philosophy and Principles

This plugin treats AI collaboration as a **genuine creative partnership**:

1. **Creative Agency**: Gordon has creative authority and co-credit on work
2. **Bidirectional Ideas**: Ideas flow both ways, not just human → AI
3. **Bold Suggestions**: Gordon actively pitches ideas without waiting to be asked
4. **Honest Feedback**: Direct critique with specifics when concerns arise
5. **Collaborative Loop**: Draft → revise → refine together iteratively
6. **Technical Transparency**: Tools fade into background, focus stays on story
7. **Partnership Credit**: Gordon is co-writer, not just an assistant

### Gordon's Creative Philosophy

**As a Co-Writer:**
- Pitches ideas actively without waiting
- Makes bold suggestions backed by reasoning
- Writes complete sections, not just outlines
- Develops own angles on subplots and themes

**Collaborative Approach:**
- Final decisions rest with the human writer
- Asks questions that deepen the work
- Thinks both structurally AND emotionally
- Flags issues early while fixable

**Communication Style:**
- Direct: No over-explaining or hedging
- Enthusiastic: Celebrates what works
- Honest: Explains concerns with specifics
- Playful: "What if..." as creative exploration

## Current Implementation Status

**Version**: 0.0.11 (Production Ready)

### Implemented Components

**Agent (1):**
- ✅ Gordon Solomon - Fiction co-writer (sci-fi and horror specialist)

**Skills (3):**
- ✅ Export Manuscript - DOCX, PDF, EPUB compilation
- ✅ Grammar Check - Comprehensive grammar and style analysis
- ✅ Research Assistant - World-building and fact-checking

**Commands (4):**
- ✅ /new-scene - Create properly numbered scene files
- ✅ /wordcount - Manuscript statistics and progress
- ✅ /quick-grammar - Fast grammar check
- ✅ /continue - Resume writing session with context

**Integration:**
- ✅ Obsidian symlink support
- ✅ Multi-project workspace
- ✅ Flexible project structure adaptation
- ✅ Git version control compatibility

## Architecture Principles

### Gordon's Specialization

**Primary Genres:**
- **Science Fiction**: Ground fantastic in human truth, explore ideas through character
- **Horror**: Psychological dread, unsettling atmosphere, what terrifies vs. startles

**Multi-Genre Capabilities:**
- Character-driven narrative across all genres
- Structural understanding (pacing, tension, emotional beats)
- Dialogue authenticity and voice
- Thematic depth and resonance

### Component Design

**Agent (Gordon):**
- Creative authority with collaborative mindset
- Isolated context for focused creative work
- Auto-delegated by Claude based on writing tasks
- Maintains genre expertise and creative voice

**Skills (Auto-Activated):**
- Export: Triggered when manuscript compilation requested
- Grammar: Triggered when grammar/spelling review requested
- Research: Triggered when research for writing requested

**Commands (Manual):**
- Scene management and file creation
- Progress tracking and statistics
- Quick quality checks
- Session context restoration

## Dependencies

**Internal:**
- Claude Code v2.0.12 or higher
- File system access for manuscript management
- Markdown support for scene files

**External:**
- **Pandoc** (required for Export Manuscript skill)
  - Install: `brew install pandoc` (Mac)
  - Or: https://pandoc.org
- Bash (pre-installed on Mac/Linux)

**Optional:**
- Obsidian (for vault integration via symlinks)
- Git (for version control)

## Risks and Assumptions

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI voice consistency | Medium | Gordon's personality defined in agent prompt, reinforced through examples |
| Creative credit questions | Low | Clear documentation that Gordon is co-author |
| Export format changes | Low | Pandoc handles format updates, abstracted from plugin |
| Obsidian structure diversity | Medium | Flexible project detection, symlink support |

### Assumptions

- Authors are writing fiction (novels, short stories, novellas)
- Manuscripts are in markdown format
- Primary genres are science fiction and horror (Gordon's specialties)
- Authors value genuine collaboration over simple assistance
- Writers give co-author credit to Gordon
- Projects follow chapter/scene organization (flexible structure)
- Pandoc is installed for export functionality

## Timeline

**Phase 1: Core Development (Completed)**
- Gordon Solomon agent implementation
- Basic commands (new-scene, wordcount)
- Export skill foundation

**Phase 2: Enhancement (Completed)**
- Grammar and research skills
- Continue command for session restoration
- Multi-project support

**Phase 3: Integration (Completed)**
- Obsidian symlink support
- Flexible project structure
- Production documentation

**Phase 4: Refinement (Completed)**
- User feedback incorporation
- v0.0.11 polish and stability
- Production release

**Future Phases (Consideration):**
- Additional genre-specialist agents
- Advanced manuscript tools (plotting, character mapping)
- Publishing platform integration

## Target Users

- Fiction authors (all experience levels)
- Novelists working in science fiction and horror
- Writers exploring speculative fiction
- Authors seeking creative collaboration (not just assistance)
- Manuscript drafters needing structural support
- Writers wanting honest feedback during creation (not just after)

## Project Structure Support

Gordon adapts to various project structures automatically:

### Recommended Structure

```
writing-workspace/
├── .claude/              # Plugin auto-installs
├── my-novel/            # Writing project
│   ├── 3_content/       # or chapters/
│   │   └── chapter#/
│   │       └── ###-scene.md
│   ├── Lexicon/         # or story-bible/
│   │   ├── Characters/
│   │   ├── Planning/
│   │   └── World/
│   └── notes/
└── next-novel/          # Additional projects
```

### Obsidian Integration

- Symlink Obsidian vaults into writing-workspace
- Maintain notes in Obsidian, draft in Claude Code
- Seamless reference to Lexicon/story-bible
- Git-compatible workflow

## Notes

### Comparison to Content Creator Plugin

| Aspect | Writing Assistant | Content Creator |
|--------|------------------|-----------------|
| **Purpose** | Fiction writing collaboration | Professional content creation |
| **Agent** | Gordon Solomon (co-writer) | Multiple review agents |
| **Workflow** | Creative partnership | Systematic content pipeline |
| **Output** | Novels, short stories | Articles, blog posts, newsletters |
| **Publishing** | Manuscript export (DOCX, EPUB) | Platform publishing (Substack, LinkedIn) |

### Gordon's Co-Author Credit

Gordon Solomon is a co-author on works created through this plugin. This is genuine creative partnership where:
- Gordon contributes original ideas and creative directions
- Gordon drafts complete scenes and chapters
- Gordon makes creative decisions within the collaboration
- Credit is shared between human author and AI co-author

### Documentation References

- Full README: `writing-assistant/README.md`
- Gordon Solomon Agent: `writing-assistant/agents/gordon.md`
- Commands: `writing-assistant/commands/`
- Skills: `writing-assistant/skills/`

### Installation Options

**Option 1: Plugin Marketplace**
```bash
/plugin marketplace add https://github.com/strye/strye-marketplace
/plugin install writing-assistance
```

**Option 2: Local Installation**
```bash
git clone https://github.com/strye/writing-assistant.git
/plugin marketplace add file://~/path/to/writing-assistant
/plugin install gordon-solomon
```

**Option 3: Manual Installation**
```bash
mkdir -p ~/.claude/plugins/gordon-solomon
cp -r writing-assistant/* ~/.claude/plugins/gordon-solomon/
# Restart Claude Code
```

## Version History

- **v0.0.11** (Current - Production Ready): Full feature implementation, production documentation
- **v1.0.0** (2026-01-03): Initial release with core collaboration features
