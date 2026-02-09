# Content Creator Plugin - Requirements Overview

## Plugin Metadata

- **Name**: content-creator
- **Version**: 0.1.1
- **Author**: Will Strye
- **Status**: Active Development

## Vision

The Content Creator plugin provides a comprehensive suite of **commands**, **skills**, **agents**, and **hooks** to help professionals develop disciplined workflows for creating high-quality content, market it effectively, and publish seamlessly to key platforms.

## Philosophy

This plugin focuses on **building discipline and workflows** for professional content creation. The goal is not just to produce content, but to develop systematic approaches that consistently yield quality results. It prioritizes:

- Depth over speed
- Substance over optimization tricks
- Long-term skill development over short-term hacks
- Systematic, repeatable processes

## Core Components

### Implemented Components

#### Agents

**Ideation Agent** ([agents/ideation.md](../content-creator/agents/ideation.md))
- Reviews ideas and initial content to identify themes
- Provides feedback for impact and clarity
- Suggests content outlines
- Creates basic drafts when requested
- **Use when**: Developing ideas and structure for new content

**Editor Agent** ([agents/editor.md](../content-creator/agents/editor.md))
- Reviews for style, grammar, and voice
- Makes audience-specific suggestions
- Creates concise reports with line number references
- Never directly edits content (non-destructive review)
- **Use when**: Polishing completed drafts for writing quality

**Technical Reviewer Agent** ([agents/technical-reviewer.md](../content-creator/agents/technical-reviewer.md))
- Reviews technical accuracy, factual correctness, and feasibility
- Verifies claims, statistics, dates, and sources
- Validates citations and references
- Challenges assumptions against best practices
- Creates concise reports with line number references
- Never directly edits content (non-destructive review)
- **Use when**: Validating content for technical and factual accuracy

#### Skills

**Safe File Reader** ([skills/safe-file-reader/](../content-creator/skills/safe-file-reader/))
- Safely reads and processes content files

**Symlink Manager** ([skills/symlink-manager/](../content-creator/skills/symlink-manager/))
- Manages symbolic links for content organization

### Development Priorities

The plugin development follows three priorities:

1. **Priority 1: Quality Content Generation** - Building discipline and workflows for high-quality content
2. **Priority 2: High-Level Marketing Assistance** - Strategic marketing support without technical SEO
3. **Priority 3: Simple Publishing Workflow** - Streamlined publishing to Substack and LinkedIn

## Planned Features

### Commands (Priority 1)
- `/content.outline` - Generate content outlines
- `/content.tone-adjust` - Adjust writing tone for different audiences
- `/content.headlines` - Generate headline variations
- `/content.format-markdown` - Quick markdown formatting (Priority 3)

### Skills

**Priority 1 (Quality Content)**:
- Content Planner - Content calendars and series planning
- Brand Voice Checker - Ensure alignment with brand guidelines
- Readability Scorer - Analyze and improve readability
- Content Templates Library - Templates for various content formats
- Citation Manager - Manage references and sources

**Priority 3 (Publishing)**:
- Substack Publisher - Prepare and publish to Substack
- LinkedIn Publisher - Optimize and publish to LinkedIn
- Publishing Workflow Manager - Coordinate end-to-end publishing

### Agents

**Priority 1 (Quality Content)**:
- Research Agent - Systematic information gathering
- Storytelling Coach Agent - Narrative development guidance
- Accessibility Reviewer Agent - WCAG compliance review

**Priority 2 (Marketing)**:
- Audience Analyzer Agent - Deep audience research
- Content Strategist Agent - Portfolio analysis and strategy
- Competitor Analyzer Agent - Market and competitive intelligence
- Performance Analyzer Agent - Data-driven performance analysis

**Priority 3 (Publishing)**:
- Content Repurposer Agent - Adapt content between formats/platforms

### Hooks

**Priority 1**:
- Grammar Quick Check - Post-write grammar validation

**Priority 3**:
- Auto-Format Markdown - Automatic markdown formatting
- Validate Content Metadata - Pre-publish metadata validation
- Protect Published Content - Prevent accidental overwrites
- Auto-Add Timestamps - Track creation and modification

## Architecture Principles

### Component Selection Criteria

| Characteristic | Command | Skill | Agent | Hook |
|----------------|---------|-------|-------|------|
| **Complexity** | Simple | Medium | Complex | N/A |
| **Invocation** | Manual | Auto or manual | Auto-delegated | Event-triggered |
| **Context** | Adds to main | Adds to main | Isolated | N/A |
| **Configuration** | None | Yes | Limited | Yes |
| **Supporting files** | No | Yes | No | No |

### Key Principles

1. **Right Tool for the Job**: Choose component type based on complexity and use case
2. **Non-Destructive Review**: Review agents create reports with line references, not direct edits
3. **Clear Separation of Concerns**: Each component has a distinct focus area
4. **Workflow-Oriented**: Components support systematic, repeatable processes
5. **Quality Over Speed**: Prioritize thoroughness over quick hacks
6. **Skill Development**: Help users develop better content creation discipline
7. **Isolation When Needed**: Use agents for tasks that would clutter main context

## File Structure

```
content-creator/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata
├── agents/                      # Specialized AI assistants
│   ├── ideation.md             # ✅ Implemented
│   ├── editor.md               # ✅ Implemented
│   ├── technical-reviewer.md   # ✅ Implemented
│   └── [planned agents].md
├── commands/                    # Simple slash commands
│   ├── hello.md                # Example command
│   └── [planned commands].md
├── skills/                      # Medium-complexity features
│   ├── safe-file-reader/       # ✅ Implemented
│   ├── symlink-manager/        # ✅ Implemented
│   └── [planned skills]/
├── hooks/                       # Event-driven automation
│   └── hooks.json
└── ROADMAP.md                   # Detailed roadmap
```

## Use Cases

### Primary Workflows

1. **Content Ideation and Planning**
   - Use Ideation Agent to develop and refine ideas
   - Generate outlines with planned `/content.outline` command
   - Plan content series with Content Planner skill (planned)

2. **Content Creation and Drafting**
   - Write content with systematic approach
   - Use Content Templates for structure (planned)
   - Apply storytelling frameworks via Storytelling Coach (planned)

3. **Content Review and Polish**
   - Editor Agent for style and voice
   - Technical Reviewer Agent for accuracy
   - Grammar checks via hook or command
   - Readability Scorer for audience appropriateness (planned)

4. **Publishing and Distribution**
   - Format for different platforms (Substack, LinkedIn)
   - Manage publishing workflow
   - Repurpose content across platforms

## Target Users

- Professional content creators
- Technical writers
- Marketing professionals
- Bloggers and newsletter authors
- Subject matter experts creating educational content

## Success Metrics

The plugin is successful when:

1. **Quality Improves**: Content consistently meets high standards
2. **Discipline Develops**: Users adopt systematic workflows
3. **Efficiency Increases**: Less time on mechanics, more on substance
4. **Confidence Grows**: Users feel confident before publishing
5. **Publishing Smooths**: Platform publishing becomes frictionless

## Technical Requirements

- Claude Code v2.0.12 or higher
- Markdown support for content files
- File system access for content management
- Optional: Substack/LinkedIn API access for publishing features (planned)

## Future Considerations

Lower priority items deferred for later consideration:

- SEO optimization features
- Legal/compliance review
- Advanced workflow coordination
- Additional social media platforms (Twitter/X, Medium)

## Documentation

- **Detailed Roadmap**: [ROADMAP.md](../content-creator/ROADMAP.md)
- **Agent Definitions**: [agents/](../content-creator/agents/)
- **Skill Documentation**: [skills/](../content-creator/skills/)

## Version History

**v0.1.1** (Current)
- Three implemented agents: Ideation, Editor, Technical Reviewer
- Two implemented skills: Safe File Reader, Symlink Manager
- Comprehensive roadmap established
- Development priorities defined
