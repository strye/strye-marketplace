# Writing Assistant Plugin - Development Context & Handoff

**Date:** 2026-01-03  
**Plugin Name:** `writing-assistant` (formerly `gordon-solomon`)  
**Location:** `strye-marketplace/plugins/writing-assistant/`  
**Development Approach:** Spec-driven development  

---

## Executive Summary

This plugin provides AI-powered creative writing collaboration tools for fiction authors working in Claude Code. The centerpiece is Gordon Solomon, an AI co-writer agent, supported by three automated skills (manuscript export, grammar checking, research) and four productivity commands (new scene, word count, quick grammar, continue session).

The plugin is designed to work with authors who use Obsidian for writing but want to collaborate with AI in Claude Code via symlinked directories.

---

## Project Goals

### Primary Objectives
1. **Create a true co-writer experience** - Gordon Solomon has creative agency and co-credit
2. **Eliminate friction in the writing workflow** - Automate repetitive tasks
3. **Support Obsidian + Claude Code hybrid workflow** - Seamless integration via symlinks
4. **Reusable across multiple projects** - Plugin installs once, works everywhere
5. **Spec-driven and extensible** - Easy to add new agents, skills, and commands

### Design Principles
- **Gordon is a collaborator, not an assistant** - Active participation in creative process
- **Preserve author voice** - Tools suggest, don't dictate
- **Fiction-first** - Optimized for narrative writing (novels, short stories)
- **Multi-genre support** - Currently focused on sci-fi and horror, but expandable
- **Balance planning and discovery** - Support both plotters and pantsers

---

## Architecture Overview

### Directory Structure
```
strye-marketplace/
├── .claude/                    # Marketplace-level Claude Code config
├── plugins/
│   └── writing-assistant/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── agents/
│       │   └── gordon.md      # Gordon Solomon agent
│       ├── skills/
│       │   ├── export-manuscript/
│       │   │   └── SKILL.md
│       │   ├── grammar-check/
│       │   │   └── SKILL.md
│       │   └── research-assistant/
│       │       └── SKILL.md
│       ├── commands/
│       │   ├── new-scene.md
│       │   ├── wordcount.md
│       │   ├── quick-grammar.md
│       │   └── continue.md
│       ├── README.md
│       └── LICENSE
└── [other plugins...]
```

### Plugin Manifest
**File:** `.claude-plugin/plugin.json`
```json
{
  "name": "writing-assistant",
  "version": "1.0.0",
  "description": "AI co-writer and creative writing tools for fiction authors",
  "author": "[Your Name]",
  "keywords": ["writing", "fiction", "creative-writing", "co-writer"]
}
```

---

## Components Breakdown

### 1. Gordon Solomon Agent

**File:** `agents/gordon.md`  
**Purpose:** AI co-writer with creative agency  
**Model:** `claude-sonnet-4-5-20250929`  
**Color:** Purple  

**Key Characteristics:**
- American writer specializing in sci-fi and horror
- Balances planning with organic discovery
- Direct, honest communication style
- Makes bold creative suggestions
- Respects author's final decision

**Capabilities:**
- Brainstorm plot and characters
- Draft complete scenes and chapters
- Provide constructive feedback
- Identify plot holes and pacing issues
- Research and integrate findings

**Invocation:** `@gordon [request]`

### 2. Skills (Auto-Activated)

#### Export Manuscript Skill
**File:** `skills/export-manuscript/SKILL.md`  
**Trigger:** User asks to compile, export, or format manuscript  
**Dependencies:** Pandoc  

**Capabilities:**
- Compile multi-file markdown manuscripts
- Export to DOCX, PDF, EPUB
- Apply industry-standard formatting
- Handle Obsidian syntax cleanup
- Generate title pages and metadata

**Output Formats:**
- DOCX (Word) - submission format
- PDF - sharing/review
- EPUB - e-reader distribution
- Markdown - compiled single file

#### Grammar Check Skill
**File:** `skills/grammar-check/SKILL.md`  
**Trigger:** User asks to proofread, check grammar, or edit  

**Check Types:**
- Spelling errors (with creative spelling awareness)
- Grammar issues (subject-verb, tense, fragments)
- Punctuation (dialogue formatting, comma usage)
- Style suggestions (passive voice, filter words, adverbs)
- Consistency (character names, terminology)

**Levels:**
- Quick: Critical errors only (~30 seconds)
- Standard: Errors + style suggestions (~2-5 minutes)
- Deep: Comprehensive analysis including show vs. tell

**Philosophy:** Preserve author voice, suggest rather than prescribe

#### Research Assistant Skill
**File:** `skills/research-assistant/SKILL.md`  
**Trigger:** User asks to research topics  
**Tools:** web_search, web_fetch  

**Research Categories:**
- Science & Technology (hard SF accuracy)
- Historical & Cultural (period details)
- Professional & Technical (how jobs work)
- Speculative (future tech, plausible extrapolation)

**Output:** Documented findings with sources, story implications, and interesting details

**Storage:** Saves to `Lexicon/World/` or `notes/research.md`

### 3. Slash Commands (Manual Invocation)

#### /new-scene
**File:** `commands/new-scene.md`  
**Syntax:** `/new-scene [project-name] [chapter-number] [scene-name]`  

**Function:**
- Find highest numbered scene in specified chapter
- Create next numbered file (e.g., `004-confrontation.md`)
- Apply scene template with metadata
- Open for editing

**Example:** `/new-scene my-novel 7 confrontation`  
**Creates:** `my-novel/3_content/chapter7/004-confrontation.md`

#### /wordcount
**File:** `commands/wordcount.md`  
**Syntax:** `/wordcount [project-name]`  

**Function:**
- Calculate total manuscript word count
- Breakdown by chapter and optionally by scene
- Check progress vs. target (if specified in project-file.md)
- Provide writing statistics

**Output:**
- Total words
- Per-chapter breakdown
- Progress percentage
- Average chapter/scene length
- Status assessment

#### /quick-grammar
**File:** `commands/quick-grammar.md`  
**Syntax:** `/quick-grammar [project-name] [optional: file-path]`  

**Function:**
- Fast grammar check (~30 seconds)
- Focus on critical issues only
- Defaults to most recently modified file
- Invokes grammar-check skill at "quick" level

**Use Case:** Daily writing sessions, between-scene proofreading

#### /continue
**File:** `commands/continue.md`  
**Syntax:** `/continue [project-name]`  

**Function:**
- Resume writing session with full context
- Read project status files
- Find recent work (last 5 modified files)
- Check recent notes and brainstorming
- Review open questions
- Calculate current progress
- Provide comprehensive session summary

**Output:**
- Project status
- Where you left off
- Recent notes and decisions
- Open questions
- Next steps
- Writing statistics
- Prompt for what to work on

**Use Case:** Start of every writing session

---

## Key Design Decisions

### 1. Obsidian + Claude Code Integration

**Problem:** User writes in Obsidian but wants AI collaboration in Claude Code  
**Solution:** Symlink approach with sibling directories

**Workspace Structure:**
```
writing-workspace/           # Root - where `claude` runs
├── .claude/                # Claude Code config
│   ├── agents/
│   ├── commands/
│   └── skills/
└── my-novel/               # Symlink to ~/Documents/Obsidian/my-novel
    ├── 3_content/
    ├── Lexicon/
    └── notes/
```

**Benefits:**
- `.claude/` config never touches Obsidian vault
- No Obsidian configuration needed
- Multi-project support (multiple symlinks)
- Real-time sync between tools
- Independent version control

**File Path Convention:**
- All references use `[project-name]/` prefix
- Example: `my-novel/3_content/chapter7/001-opening.md`

### 2. Obsidian Vault Structure Support

**User's Preferred Structure:**
```
my-novel/
├── 3_content/              # Manuscript
│   └── chapter#/
│       └── ###-scene-name.md
├── Lexicon/                # Reference materials
│   ├── Characters/
│   ├── Locations/
│   ├── Planning/
│   ├── Structure/
│   └── World/
├── notes/
│   └── brainstorm-YYYY-MM-DD.md
└── project-file.md
```

**Numbering Convention:**
- Chapters: `chapter1/`, `chapter2/`, etc.
- Scenes: `001-opening.md`, `002-discovery.md`, etc.
- Three-digit padding for scenes

**Plugin Adaptation:**
- Gordon and skills reference this structure
- Commands handle multiple patterns (3_content/, chapters/, etc.)
- Auto-detect structure when possible

### 3. Gordon as Co-Writer Philosophy

**Not an Assistant - A Collaborator:**
- Has creative agency and makes pitches
- Entitled to co-credit on published work
- Can disagree and push back on ideas
- Writes complete prose, not outlines
- Brings own creative angles while respecting author's vision

**Communication Style:**
- Direct and unpretentious
- Enthusiastic about good ideas
- Honest about concerns
- Playful with possibilities
- No over-explaining or hedging

**Process:**
- Discuss before drafting major sections
- Offer multiple options when relevant
- Build on established elements
- Flag issues early
- Think about future payoffs

### 4. Multi-Project Support

**Design:**
- Plugin installs once at marketplace level
- Works across all projects in workspace
- Commands require `[project-name]` argument
- Skills adapt to each project's structure

**Example Workspace:**
```
writing-workspace/
├── .claude/          # Shared Gordon & tools
├── my-novel/        # Sci-fi project
├── next-novel/      # Horror project
└── short-stories/   # Story collection
```

**Invocation:**
```bash
> /continue my-novel
> /wordcount next-novel
> @gordon Read short-stories/the-last-engineer.md and give feedback
```

---

## Technical Implementation Details

### Agent Definition (gordon.md)

**Frontmatter Fields:**
- `name: gordon` - Agent identifier
- `description:` - When to invoke (must be clear for auto-selection)
- `allowed-tools:` - Read, Write, Grep, Glob, Edit, Bash
- `color: purple` - UI identifier
- `model:` - claude-sonnet-4-5-20250929

**Content Structure:**
1. Role definition (co-writer, not assistant)
2. Background and style
3. Creative authority and responsibilities
4. Communication style
5. Genre expertise (sci-fi, horror)
6. Working principles
7. Writing process guidelines
8. Project structure understanding

### Skill Definition Pattern

**Frontmatter:**
- `name:` - Skill identifier (kebab-case)
- `description:` - Trigger conditions (critical for auto-activation)

**Content Structure:**
1. Purpose statement
2. When to use (trigger patterns)
3. Step-by-step process
4. Tools and commands to use
5. Output format
6. Error handling
7. Integration with other skills
8. Examples and workflows

**Key Pattern:** Progressive disclosure - skills load additional context as needed

### Slash Command Pattern

**Frontmatter:**
- `description:` - What the command does (shown in `/help`)
- `argument-hint:` - Parameter guide (e.g., `[project] [chapter] [scene]`)
- `allowed-tools:` - Tools the command can use

**Content Structure:**
1. Purpose statement
2. Process with bash commands
3. Output format
4. Examples
5. Error handling
6. Integration with other commands

**Argument Access:** `$1`, `$2`, `$3` for positional args; `$ARGUMENTS` for all

---

## Development Workflow

### Current State
- Plugin structure created in `strye-marketplace/plugins/writing-assistant/`
- Base components defined (agent, skills, commands)
- Ready for spec-driven development

### Spec-Driven Development Approach

**Process:**
1. Define specifications for new features
2. Claude Code implements to spec
3. Test with actual writing projects
4. Iterate based on feedback
5. Update documentation

**Testing:**
- Use real writing projects as test cases
- Verify commands work with various project structures
- Ensure skills activate appropriately
- Check Gordon's creative output quality

### Next Development Steps

**Immediate (v1.0):**
1. ✅ Create plugin structure
2. ✅ Implement Gordon agent
3. ✅ Implement 3 core skills
4. ✅ Implement 4 core commands
5. ⏳ Test with actual writing project
6. ⏳ Refine based on real-world use
7. ⏳ Complete documentation

**Near-term (v1.1):**
- Add character development skill
- Add plot structure skill
- Add dialogue polish command
- Add scene analyzer skill
- Enhance error handling

**Future Considerations:**
- Additional agents (editor, beta reader, etc.)
- Revision tracking
- Collaboration features (multiple co-writers)
- Integration with writing tools (Scrivener export, etc.)
- Custom templates for different genres

---

## Integration Points

### File Reading Patterns
```bash
# Find manuscript files
find [project]/3_content -name "*.md" -type f | sort

# Find most recent file
find [project]/3_content -name "*.md" -type f -printf '%T@ %p\n' | sort -n | tail -1

# Read project metadata
Read [project]/project-file.md
Read [project]/README.md
```

### Cross-Referencing
```
Lexicon/Characters/ → Character consistency
Lexicon/World/ → Terminology, world-building
Lexicon/Planning/ → Plot threads, open questions
```

### External Tools
- **Pandoc:** Required for export-manuscript skill
- **Bash:** For command execution
- **Web Search:** For research-assistant skill

---

## Known Constraints & Considerations

### Claude Code Limitations
1. **Context window:** ~200k tokens (~150k words)
   - Mitigation: Modular files, read only what's needed
2. **Tool rate limits:** Web fetch limited to 100/hour per key
   - Mitigation: Cache research findings
3. **No persistent storage:** Each session starts fresh
   - Mitigation: Save research/decisions to files

### Obsidian Integration
1. **Symlink behavior:** Files appear in both locations
   - Handled: Changes sync automatically
2. **File locking:** Potential conflicts if editing same file
   - Recommendation: Use Obsidian for writing, Claude Code for collaboration

### Project Structure Variance
1. **Not all users use Obsidian structure**
   - Solution: Auto-detect patterns, ask when unclear
2. **Multiple valid organizational approaches**
   - Solution: Flexible path handling in commands

---

## Testing Checklist

### Agent Testing
- [ ] @gordon responds appropriately to creative requests
- [ ] Gordon can read and reference project files
- [ ] Gordon provides constructive feedback
- [ ] Gordon drafts complete scenes (not outlines)
- [ ] Gordon adapts to project structure

### Skill Testing
- [ ] export-manuscript compiles chapters correctly
- [ ] export-manuscript handles Obsidian syntax
- [ ] export-manuscript generates valid DOCX/PDF
- [ ] grammar-check identifies actual errors
- [ ] grammar-check preserves author voice
- [ ] grammar-check cross-references Lexicon
- [ ] research-assistant finds relevant information
- [ ] research-assistant documents sources
- [ ] research-assistant saves findings appropriately

### Command Testing
- [ ] /new-scene creates properly numbered files
- [ ] /new-scene applies template correctly
- [ ] /wordcount calculates accurate totals
- [ ] /wordcount provides chapter breakdown
- [ ] /quick-grammar finds critical issues
- [ ] /quick-grammar defaults to recent file
- [ ] /continue loads full project context
- [ ] /continue identifies recent work

### Integration Testing
- [ ] Commands work with symlinked directories
- [ ] Skills activate automatically when appropriate
- [ ] Gordon can invoke skills as needed
- [ ] Multiple projects work in same workspace
- [ ] File paths resolve correctly with project prefix

---

## Documentation Status

### Completed
- ✅ Plugin architecture design
- ✅ Component specifications
- ✅ File structure definitions
- ✅ Development handoff document (this file)

### In Progress
- ⏳ README.md (user-facing)
- ⏳ Individual component documentation
- ⏳ Examples and tutorials

### Todo
- ⏳ API documentation for extending the plugin
- ⏳ Contributing guidelines
- ⏳ Changelog
- ⏳ Wiki with detailed examples

---

## Prompt for Claude Code Continuation

**Copy this into Claude Code to continue development:**

```
I'm developing a Claude Code plugin called "writing-assistant" for creative fiction authors. The plugin is located at strye-marketplace/plugins/writing-assistant/.

Context:
- Plugin provides AI co-writer (Gordon Solomon) + manuscript tools
- Designed for authors who write in Obsidian but collaborate in Claude Code
- Uses symlinked directories (workspace/.claude/ + workspace/project-name/)
- Includes 1 agent, 3 skills, 4 slash commands

Current State:
- Base structure created
- Components defined (see attached specs)
- Ready for implementation and testing

I'm using spec-driven development. I have a complete handoff document that details:
- Architecture and design decisions
- All component specifications
- File structures and naming conventions
- Integration patterns
- Testing requirements

Please read the handoff document I'll provide next, then we can continue development.

[Paste the handoff document]

After reading, let's:
1. Review the current implementation
2. Identify any gaps or issues
3. Test with a real writing project
4. Iterate and refine based on results

What should we work on first?
```

---

## Quick Reference

### Project Paths
- Plugin root: `strye-marketplace/plugins/writing-assistant/`
- Marketplace config: `strye-marketplace/.claude/`
- User projects: `writing-workspace/[project-name]/`

### Key Files
- Agent: `agents/gordon.md`
- Skills: `skills/[skill-name]/SKILL.md`
- Commands: `commands/[command-name].md`
- Manifest: `.claude-plugin/plugin.json`

### Invocation Examples
```bash
# Agent
> @gordon Draft the confrontation scene

# Skills (auto-activate)
> Export the manuscript to DOCX
> Check chapter 3 for grammar issues
> Research quantum entanglement for the plot

# Commands
> /continue my-novel
> /new-scene my-novel 7 revelation
> /wordcount my-novel
> /quick-grammar my-novel
```

### File Path Convention
Always prefix with project name:
- `my-novel/3_content/chapter7/001-opening.md`
- `my-novel/Lexicon/Characters/sarah.md`
- `my-novel/project-file.md`

---

## Contact & Collaboration

**Original Discussion:** Claude.ai chat (2026-01-03)  
**Development Environment:** Claude Code (spec-driven)  
**Marketplace:** strye-marketplace (local)  

For questions or clarifications about design decisions, refer back to this handoff document or the original conversation artifacts.

---

**End of Handoff Document**

*This document provides complete context for continuing development in Claude Code. All architectural decisions, component specifications, and design rationale are documented above.*
