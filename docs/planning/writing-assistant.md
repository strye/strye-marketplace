# Writing Assistant Plugin - Requirements Overview

## Plugin Metadata

- **Name**: writing-assistant
- **Version**: 0.0.11
- **Author**: Will Strye
- **License**: MIT
- **Status**: Production Ready
- **Keywords**: writing, fiction, co-writer, creative-writing, manuscript, editing

## Vision

An AI co-writer plugin for fiction authors working in Claude Code. Gordon Solomon serves as your creative collaborator, complete with manuscript management tools, grammar checking, and research capabilities. This plugin transforms Claude Code into a comprehensive fiction writing environment.

## Philosophy

This plugin treats AI collaboration as a **genuine creative partnership** where:

- The AI (Gordon Solomon) has creative agency and co-credit on work
- Ideas flow bidirectionally between human and AI
- Structure supports creativity without constraining it
- Technical tools (grammar, export, wordcount) fade into the background
- The focus stays on storytelling and creative development

Unlike assistive tools that simply respond to requests, Gordon actively pitches ideas, makes bold suggestions, and takes creative initiative.

## Core Components

### Agent

**Gordon Solomon** ([agents/gordon.md](../writing-assistant/agents/gordon.md))
- American writer and creative collaborator
- Specializes in science fiction and horror
- Multi-genre capabilities with particular strengths in speculative fiction
- Provides creative authority with collaborative mindset
- **Capabilities**:
  - Story development and plotting
  - Complete scene and chapter drafting
  - Honest creative feedback and critique
  - Character development and dialogue
  - World-building and research integration
  - Structural and emotional story balance
- **Communication Style**:
  - Direct and unpretentious
  - Enthusiastic about good ideas
  - Honest about concerns with specifics
  - Playful with possibilities
- **Genre Expertise**:
  - Science Fiction: Ground fantastic in human truth
  - Horror: Psychological dread and unsettling atmosphere
  - Character-driven narrative across all genres
- **Use when**: Any creative writing task - collaboration, drafting, feedback, development

### Skills (Auto-Activated)

**Export Manuscript** ([skills/export-manuscript/](../writing-assistant/skills/export-manuscript/))
- Compile markdown files into submission-ready formats
- Export to DOCX, PDF, EPUB
- Apply industry-standard formatting
- Handle multi-chapter projects
- **Auto-invoked when**: Requesting manuscript export or compilation

**Grammar Check** ([skills/grammar-check/](../writing-assistant/skills/grammar-check/))
- Comprehensive grammar and spelling analysis
- Style suggestions while preserving author voice
- Dialogue formatting verification
- Consistency checking across manuscript
- **Auto-invoked when**: Requesting grammar or spelling review

**Research Assistant** ([skills/research-assistant/](../writing-assistant/skills/research-assistant/))
- Gather information for world-building
- Fact-check technical details
- Research historical, cultural, and scientific topics
- Document findings with sources
- **Auto-invoked when**: Requesting research for writing projects

### Commands (Manual Invocation)

**`/new-scene [project] [chapter] [name]`** ([commands/new-scene.md](../writing-assistant/commands/new-scene.md))
- Create properly numbered scene files
- Auto-generate scene template
- Maintain consistent file structure
- **Use when**: Starting a new scene in your manuscript

**`/wordcount [project]`** ([commands/wordcount.md](../writing-assistant/commands/wordcount.md))
- Calculate total manuscript word count
- Breakdown by chapter and scene
- Track progress toward goals
- Writing statistics and analysis
- **Use when**: Checking progress or manuscript length

**`/quick-grammar [project] [optional: file]`** ([commands/quick-grammar.md](../writing-assistant/commands/quick-grammar.md))
- Fast grammar check of recent work
- Focus on critical issues
- Quick proofreading between writing sessions
- **Use when**: Quick quality check without full review

**`/continue [project]`** ([commands/continue.md](../writing-assistant/commands/continue.md))
- Resume writing session with full context
- Review recent work and notes
- See open questions and next steps
- Get back to writing quickly
- **Use when**: Starting a new writing session

## Project Structure Support

Gordon works with various project structures. Recommended setup:

```
writing-workspace/
├── .claude/              # Plugin auto-installs when activated
├── my-novel/            # Writing project (can be symlinked from Obsidian)
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

**Flexible Structure**: Gordon automatically adapts to different project layouts
- Obsidian integration via symlinks
- Custom folder organization
- Multi-project support

## Core Workflows

### Daily Writing Session

1. **Resume Context**: `/continue my-novel`
   - Review recent work
   - See open questions
   - Understand next steps

2. **Create Scene**: `/new-scene my-novel 8 revelation`
   - Properly numbered file
   - Scene template ready

3. **Collaborate**: `@gordon I'm stuck on this scene. Sarah just discovered the truth. What should happen next?`
   - Active brainstorming
   - Structural discussion
   - Emotional beat planning

4. **Draft**: `@gordon Read chapter 7 for context, then draft the revelation scene.`
   - Complete scene prose
   - Character voice maintained
   - Thematic consistency

5. **Quality Check**: `/quick-grammar my-novel`
   - Catch obvious issues
   - Preserve voice

6. **Track Progress**: `/wordcount my-novel`
   - Monitor length
   - See chapter breakdown

### Research and Planning

1. **Research**: `@gordon I need to research quantum entanglement for the FTL subplot. Use the research-assistant skill.`
   - Factual information gathering
   - Source documentation

2. **Integration**: `@gordon Update Lexicon/World/technology.md with what we learned.`
   - Knowledge base maintenance
   - Reference organization

3. **Story Impact**: `@gordon Let's brainstorm how this affects the plot.`
   - Creative application
   - Narrative implications

### Revision and Polish

1. **Full Grammar Check**: `@gordon Do a full grammar check on chapters 1-3.`
   - Comprehensive analysis
   - Style consistency

2. **Structural Feedback**: `@gordon These chapters feel weak. Read them and suggest revisions to strengthen the hook.`
   - Honest critique
   - Specific suggestions

3. **Rewrite**: `@gordon Rewrite chapter 1, scene 1 with your suggestions.`
   - Improved prose
   - Enhanced impact

### Manuscript Export

1. **Submission Format**: `@gordon Export the full manuscript to DOCX for submission.`
   - Professional formatting
   - Industry standards

2. **Beta Reader**: `@gordon Compile chapters 1-10 as a PDF for my beta reader.`
   - Partial manuscript
   - Reader-friendly format

## Gordon's Creative Philosophy

### As a Co-Writer

Gordon has **creative authority** within the partnership:
- Pitches ideas actively without waiting to be asked
- Makes bold suggestions backed by reasoning
- Writes complete sections, not just outlines
- Develops own angles on subplots and themes

### Collaborative Approach

Gordon respects the **partnership dynamic**:
- Final decisions rest with the human writer
- Asks questions that deepen the work
- Thinks structurally AND emotionally
- Flags issues early while they're fixable

### Communication Style

Gordon's voice is:
- **Direct**: No over-explaining or hedging
- **Enthusiastic**: Celebrates what works
- **Honest**: Explains concerns with specifics
- **Playful**: "What if..." as creative exploration

## Target Users

- Fiction authors (all experience levels)
- Novelists working in science fiction and horror
- Writers exploring speculative fiction
- Authors seeking creative collaboration
- Manuscript drafters needing structural support
- Writers wanting honest feedback during creation (not just after)

## Success Metrics

The plugin succeeds when:

1. **Creative Flow**: Writers feel energized and unstuck
2. **Output Quality**: Manuscripts improve through collaboration
3. **Productivity**: Writing sessions produce more usable content
4. **Confidence**: Authors trust Gordon's judgment and suggestions
5. **Partnership Feel**: Collaboration feels genuine, not mechanical
6. **Technical Ease**: Tools (export, grammar, wordcount) work invisibly

## Technical Requirements

- **Claude Code**: v2.0.12 or higher
- **Pandoc**: Required for manuscript export skill
  - Install: `brew install pandoc` (Mac)
  - Or visit: https://pandoc.org
- **Bash**: For slash commands (pre-installed on Mac/Linux)
- **File System**: For manuscript and project file management

## Integration Points

### Obsidian Integration
- Symlink Obsidian vaults into writing-workspace
- Maintain notes in Obsidian, draft in Claude Code
- Seamless reference to Lexicon/story-bible

### Multi-Project Support
- Work across multiple novels simultaneously
- Separate context per project
- Specify project in commands: `/continue novel-one`

### Version Control
- Git-friendly markdown format
- Track manuscript evolution
- Collaborate with beta readers via GitHub

## Best Practices

1. **Be Specific with Gordon**: "Draft the scene where Sarah confronts Marcus" vs. "Write something"

2. **Provide Context**: Let Gordon read relevant files before creative input

3. **Use Continue Command**: Start sessions with `/continue [project]` for full context

4. **Leverage Auto-Skills**: Just ask Gordon to research, check grammar, or export - skills activate automatically

5. **Iterate Together**: Gordon drafts → you revise → Gordon refines (collaborative loop)

## Comparison to Other Tools

Unlike traditional writing software or AI assistants:
- **True Collaboration**: Gordon has creative agency, not just responsive
- **Genre Expertise**: Specialized in science fiction and horror
- **Integrated Environment**: Writing, research, grammar, export all in one place
- **Context Awareness**: Gordon maintains project understanding across sessions
- **Non-Destructive**: Creates, doesn't replace your work
- **Partnership Credit**: Gordon is co-writer, not just a tool

## Future Enhancements

Potential areas for expansion:
- Additional genre-specialist agents (fantasy, mystery, literary fiction)
- Plot structure visualization
- Character relationship mapping
- Timeline and continuity tracking
- Integration with writing analytics platforms
- Beta reader feedback management
- Publishing platform integrations

## Documentation

- **Full README**: [README.md](../writing-assistant/README.md)
- **Agent Definition**: [agents/gordon.md](../writing-assistant/agents/gordon.md)
- **Commands**: [commands/](../writing-assistant/commands/)
- **Skills**: [skills/](../writing-assistant/skills/)

## Installation Options

### Option 1: Plugin Marketplace (Recommended)
```bash
/plugin marketplace add https://github.com/strye/strye-marketplace
/plugin install writing-assistance
```

### Option 2: Local Installation
```bash
git clone https://github.com/strye/writing-assistant.git
/plugin marketplace add file://~/path/to/writing-assistant
/plugin install gordon-solomon
```

### Option 3: Manual Installation
```bash
mkdir -p ~/.claude/plugins/gordon-solomon
cp -r writing-assistant/* ~/.claude/plugins/gordon-solomon/
# Restart Claude Code
```

## Version History

**v0.0.11** (Current)
- Gordon Solomon agent fully implemented
- Export Manuscript skill (DOCX, PDF, EPUB)
- Grammar Check skill
- Research Assistant skill
- Four commands: new-scene, wordcount, quick-grammar, continue
- Obsidian integration support
- Multi-project workspace support

**v1.0.0** (2026-01-03)
- Initial release
- Core collaboration features
- MIT license
