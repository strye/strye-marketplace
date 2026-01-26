# Writing Assistance Plugin for Claude Code

An AI co-writer plugin for fiction authors working in Claude Code. Gordon Solomon is your creative collaborator, complete with manuscript management tools, grammar checking, and research capabilities.

## Features

### 🤖 Gordon Solomon Agent
An AI co-writer who:
- Collaborates on story development and plotting
- Drafts complete scenes and chapters
- Provides honest creative feedback
- Specializes in science fiction and horror
- Respects your creative vision while offering bold suggestions

### 🛠️ Skills (Auto-Activated)

**Export Manuscript**
- Compile markdown files into submission-ready formats
- Export to DOCX, PDF, EPUB
- Apply industry-standard formatting
- Handle multi-chapter projects

**Grammar Check**
- Comprehensive grammar and spelling analysis
- Style suggestions while preserving author voice
- Dialogue formatting verification
- Consistency checking across the manuscript

**Research Assistant**
- Gather information for world-building
- Fact-check technical details
- Research historical, cultural, and scientific topics
- Document findings with sources

### ⚡ Slash Commands (Manual)

**`/new-scene [project] [chapter] [name]`**
- Create properly numbered scene files
- Auto-generate scene template
- Maintain consistent file structure

**`/wordcount [project]`**
- Calculate total manuscript word count
- Breakdown by chapter and scene
- Track progress toward goals
- Writing statistics and analysis

**`/quick-grammar [project] [optional: file]`**
- Fast grammar check of recent work
- Focus on critical issues
- Quick proofreading between writing sessions

**`/continue [project]`**
- Resume writing session with full context
- Review recent work and notes
- See open questions and next steps
- Get back to writing quickly

## Installation

### Option 1: Via Plugin Marketplace (Recommended)

```bash
# In Claude Code:
/plugin marketplace add https://github.com/strye/strye-marketplace
/plugin install writing-assistance
```

### Option 2: Local Installation

```bash
# Clone the repository
git clone https://github.com/strye/writing-assistant.git

# In Claude Code:
/plugin marketplace add file://~/path/to/writing-assistant
/plugin install gordon-solomon
```

### Option 3: Manual Installation

```bash
# Copy plugin to Claude's plugins directory
mkdir -p ~/.claude/plugins/gordon-solomon
cp -r writing-assistant/* ~/.claude/plugins/gordon-solomon/

# Restart Claude Code
```

## Project Structure Setup

Gordon works with various project structures. Here's a recommended setup:

```
writing-workspace/
├── .claude/              # Plugin auto-installs here when activated
├── my-novel/            # Your writing project (can be symlinked from Obsidian)
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

## Quick Start

1. **Install the plugin** (see above)

2. **Start Claude Code** in your writing workspace:
   ```bash
   cd ~/writing-workspace
   claude
   ```

3. **Invoke Gordon**:
   ```bash
   > @gordon Let's work on my novel. Read my-novel/project-file.md to get started.
   ```

4. **Use the tools**:
   ```bash
   > /continue my-novel
   > /new-scene my-novel 7 confrontation
   > @gordon Draft this scene
   > /quick-grammar my-novel
   > /wordcount my-novel
   ```

## Usage Examples

### Daily Writing Session

```bash
# Resume your session
> /continue my-novel

# Create a new scene
> /new-scene my-novel 8 revelation

# Collaborate with Gordon
> @gordon I'm stuck on this scene. Sarah just discovered the truth. 
  What should happen next?

# Draft the scene together
> @gordon Read chapter 7 for context, then draft the revelation scene.

# Quick proofread
> /quick-grammar my-novel

# Check progress
> /wordcount my-novel
```

### Research and Planning

```bash
> @gordon I need to research quantum entanglement for the FTL subplot.
  Use the research-assistant skill.

> @gordon Update Lexicon/World/technology.md with what we learned.

> @gordon Let's brainstorm how this affects the plot.
```

### Revision and Polish

```bash
> @gordon Do a full grammar check on chapters 1-3.

> @gordon These chapters feel weak. Read them and suggest 
  revisions to strengthen the hook.

> @gordon Rewrite chapter 1, scene 1 with your suggestions.
```

### Manuscript Export

```bash
> @gordon Export the full manuscript to DOCX for submission.

> @gordon Compile chapters 1-10 as a PDF for my beta reader.
```

## Customization

### Adapting to Your Project Structure

Gordon automatically adapts to different project layouts. For best results:

1. Create a `project-file.md` or `README.md` with:
   - Project title
   - Current status
   - Word count goals
   - Next steps

2. Organize reference materials:
   - Characters
   - World-building
   - Plot/structure notes

3. Tell Gordon about your structure:
   ```bash
   > @gordon My chapters are in /manuscript/chapters/ 
     and my notes are in /project-notes/
   ```

### Adjusting Gordon's Personality

Gordon's persona is defined in `agents/gordon.md`. You can:
- Fork this plugin and modify the agent definition
- Create your own custom agent based on Gordon
- Adjust the tone, expertise, or collaboration style

## Working with Multiple Projects

Gordon can work across multiple writing projects:

```
writing-workspace/
├── .claude/          # Shared Gordon & tools
├── novel-one/       # Project 1
├── novel-two/       # Project 2
└── short-stories/   # Project 3
```

Specify which project when using commands:
```bash
> /continue novel-one
> /wordcount novel-two
> @gordon Read short-stories/cyberpunk-heist/draft.md
```

## Requirements

- **Claude Code**: v2.0.12 or higher
- **Pandoc**: Required for manuscript export skill
  - Install: `brew install pandoc` (Mac) or visit https://pandoc.org
- **Bash**: For slash commands (pre-installed on Mac/Linux)

## Tips for Best Results

1. **Be specific with Gordon**: "Draft the scene where Sarah confronts Marcus" vs. "Write something"

2. **Provide context**: Let Gordon read relevant files before asking for creative input

3. **Use the continue command**: Start each session with `/continue [project]` for full context

4. **Leverage skills automatically**: Just ask Gordon to research, check grammar, or export - the skills activate automatically

5. **Iterate together**: Gordon drafts, you revise, Gordon refines - it's collaborative

## Troubleshooting

**Gordon isn't responding to @mentions**
- Verify plugin is installed: `/plugin list`
- Restart Claude Code

**Skills aren't activating**
- Check that skill descriptions match your requests
- Try being more explicit: "Use the grammar-check skill on this file"

**Commands not found**
- Verify with `/help` that commands are loaded
- Check that plugin installed correctly

**File paths not working**
- Use tab completion to verify paths
- Check that symlinks are working (if using Obsidian)

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Ideas for contributions:
- Additional skills (plotting, character development, etc.)
- More slash commands
- Enhanced export formats
- Integration with writing tools

## License

MIT License - See LICENSE file for details

## Credits

Created by [Your Name]

Gordon Solomon persona developed for AI-assisted creative writing.

Inspired by the collaborative potential of AI in fiction writing.

## Support

- **Issues**: https://github.com/strye/writing-assistant/issues
- **Discussions**: https://github.com/strye/writing-assistant/discussions
- **Documentation**: https://github.com/strye/writing-assistant/wiki

## Version History

**v1.0.0** (2026-01-03)
- Initial release
- Gordon Solomon agent
- 3 skills: Export, Grammar Check, Research
- 4 commands: New Scene, Word Count, Quick Grammar, Continue