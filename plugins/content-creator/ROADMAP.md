# Content Creator Plugin Roadmap

## Vision

The Content Creator plugin provides a comprehensive suite of **commands**, **skills**, **agents**, and **hooks** to help professionals develop disciplined workflows for creating high-quality content, market it effectively, and publish seamlessly to key platforms.

## Philosophy

This plugin focuses on **building discipline and workflows** for professional content creation. The goal is not just to produce content, but to develop systematic approaches that consistently yield quality results. We prioritize depth over speed, substance over optimization tricks, and long-term skill development over short-term hacks.

## Plugin Architecture

This plugin leverages all Claude Code plugin component types:

- **Commands** (`/command-name`) - Quick, simple actions triggered by users
- **Skills** - Medium-complexity features with configuration and supporting files
- **Agents** - Specialized AI assistants for complex, high-volume, or isolated tasks
- **Hooks** - Automated actions triggered by events (formatting, validation, protection)

## Current Status

### Completed Components ✓

#### Agents

**Ideation Agent** (`agents/ideation.md`)
- Reviews ideas and initial content to identify themes
- Provides feedback for impact and clarity
- Suggests content outlines
- Creates basic drafts when requested
- **Use when**: Developing ideas and structure for new content

**Editor Agent** (`agents/editor.md`)
- Reviews for style, grammar, and voice
- Makes audience-specific suggestions
- Creates concise reports with line number references
- Never directly edits content
- **Use when**: Polishing completed drafts for writing quality

**Technical Reviewer Agent** (`agents/technical-reviewer.md`)
- Reviews technical accuracy, factual correctness, and feasibility
- Verifies claims, statistics, dates, and sources
- Validates citations and references
- Challenges assumptions against best practices
- Creates concise reports with line number references
- Never directly edits content
- **Use when**: Validating content for technical and factual accuracy

#### Skills

**Safe File Reader** (`skills/safe-file-reader/`)
- Safely reads and processes content files

**Symlink Manager** (`skills/symlink-manager/`)
- Manages symbolic links for content organization

## Development Priorities

Our development follows three priorities:

1. **Priority 1: Quality Content Generation** - Building discipline and workflows for high-quality content
2. **Priority 2: High-Level Marketing Assistance** - Strategic marketing support without technical SEO
3. **Priority 3: Simple Publishing Workflow** - Streamlined publishing to Substack and LinkedIn

### Planned Components by Type

---

## Commands

Simple, quick actions triggered manually by users with `/command-name` syntax.

### `/content.outline` - Generate Content Outline
**Priority**: 1 (Quality Content Generation)

**Purpose**: Quickly generate a structured outline for content based on topic or brief description.

**Capabilities**:
- Creates structured content outlines
- Identifies key sections and talking points
- Suggests logical flow and progression
- Provides quick starting point for writing

**Status**: Planned

---

### `/content.tone-adjust` - Adjust Writing Tone
**Priority**: 1 (Quality Content Generation)

**Purpose**: Quickly adjust the tone of content for different audiences or contexts.

**Capabilities**:
- Shifts tone (formal/casual, technical/accessible, etc.)
- Maintains core message while adjusting style
- Provides tone variations for review
- Supports different audience types

**Status**: Planned

---

### `/content.headlines` - Generate Headline Variations
**Priority**: 1 (Quality Content Generation)

**Purpose**: Rapidly generate multiple headline options for content.

**Capabilities**:
- Creates 5-10 headline variations
- Tests different angles and approaches
- Optimizes for clarity and engagement
- Considers platform context

**Status**: Planned

---

### `/content.format-markdown` - Quick Markdown Formatting
**Priority**: 3 (Publishing Workflow)

**Purpose**: Quickly format and clean up markdown content.

**Capabilities**:
- Fixes markdown syntax issues
- Standardizes formatting
- Validates structure (headings, lists, etc.)
- Ensures consistency

**Status**: Planned

---

## Skills

Medium-complexity features with configuration, supporting files, and templates.

### Content Planner
**Priority**: 1 (Quality Content Generation)

**Purpose**: Plan content series, themes, and publishing schedules with templates and frameworks.

**Capabilities**:
- Creates content calendars
- Plans content series and campaigns
- Identifies themes and pillars
- Provides planning templates
- Tracks content portfolio

**Supporting Files**:
- Calendar templates
- Content planning frameworks
- Series structure templates

**Status**: Planned

---

### Brand Voice Checker
**Priority**: 1 (Quality Content Generation)

**Purpose**: Ensure content aligns with brand guidelines and voice standards.

**Capabilities**:
- Checks alignment with brand guidelines
- Validates tone and voice consistency
- Identifies deviations from brand standards
- Provides brand-aligned alternatives
- Supports multiple brand profiles

**Supporting Files**:
- Brand guideline templates
- Voice/tone configuration
- Example library

**Requirements**: Brand guidelines document

**Status**: Planned

---

### Readability Scorer
**Priority**: 1 (Quality Content Generation)

**Purpose**: Analyze content readability with metrics and actionable suggestions.

**Capabilities**:
- Calculates readability metrics (Flesch-Kincaid, etc.)
- Provides grade level assessment
- Analyzes sentence complexity
- Suggests improvements for target reading level
- Tracks readability trends

**Supporting Files**:
- Scoring algorithms
- Target audience profiles
- Improvement templates

**Status**: Planned

---

### Content Templates Library
**Priority**: 1 (Quality Content Generation)

**Purpose**: Provide templates and frameworks for common content types.

**Capabilities**:
- Offers templates for various content formats
- Includes storytelling frameworks (AIDA, PAS, hero's journey, etc.)
- Provides structure for specific formats (blog, case study, how-to, etc.)
- Customizable templates
- Template management

**Supporting Files**:
- Content type templates
- Framework guides
- Example library

**Status**: Planned

---

### Citation Manager
**Priority**: 1 (Quality Content Generation)

**Purpose**: Manage references, sources, and citations with proper formatting.

**Capabilities**:
- Tracks sources and references
- Formats citations in various styles (APA, MLA, Chicago, etc.)
- Generates bibliographies
- Validates citation completeness
- Manages source library

**Supporting Files**:
- Citation format templates
- Style guide configurations
- Source database

**Status**: Planned

---

### Substack Publisher
**Priority**: 3 (Publishing Workflow)

**Purpose**: Prepare and publish content to Substack with proper formatting.

**Capabilities**:
- Formats content for Substack
- Manages metadata (title, subtitle, description)
- Handles images and media
- Creates drafts or publishes directly
- Manages newsletter settings
- Validates Substack-specific requirements

**Supporting Files**:
- Substack formatting templates
- Metadata templates
- Publishing checklists

**Implementation Notes**: Requires Substack API integration or email-based publishing workflow

**Status**: Planned

---

### LinkedIn Publisher
**Priority**: 3 (Publishing Workflow)

**Purpose**: Optimize and publish content specifically for LinkedIn.

**Capabilities**:
- Formats content for LinkedIn articles
- Optimizes for LinkedIn best practices
- Manages metadata and tags
- Creates engaging LinkedIn-specific hooks
- Handles image formatting and placement
- Validates character limits and formatting

**Supporting Files**:
- LinkedIn formatting templates
- Best practices guide
- Publishing checklists

**Implementation Notes**: May require LinkedIn API or assisted copy-paste workflow

**Status**: Planned

---

### Publishing Workflow Manager
**Priority**: 3 (Publishing Workflow)

**Purpose**: Coordinate end-to-end publishing process across platforms.

**Capabilities**:
- Manages content through review stages
- Tracks publishing status per platform
- Coordinates platform-specific formatting
- Provides publishing checklists
- Handles version management
- Status dashboard

**Supporting Files**:
- Workflow templates
- Platform checklists
- Status tracking

**Status**: Planned

---

## Agents

Specialized AI assistants for complex, high-volume, or exploratory tasks. Agents work independently with isolated context.

### Research Agent
**Priority**: 1 (Quality Content Generation)

**Purpose**: Systematically gather information, evidence, and supporting materials through large-scale research.

**Capabilities**:
- Gathers information, statistics, and current trends across many sources
- Finds credible sources and supporting evidence
- Summarizes research findings
- Identifies knowledge gaps
- Creates organized research reports

**Tools**: WebSearch, WebFetch, Read, Grep

**Why Agent**: High-volume research across many sources; keeps main context clean

**Status**: Planned

---

### Storytelling Coach Agent
**Priority**: 1 (Quality Content Generation)

**Purpose**: Guide narrative development and story structure through iterative coaching.

**Capabilities**:
- Applies storytelling frameworks (hero's journey, narrative arcs, etc.)
- Enhances emotional resonance and connection
- Structures content as compelling stories
- Identifies opportunities for narrative elements
- Provides storytelling best practices guidance

**Tools**: Read

**Why Agent**: Deep, iterative narrative analysis; specialized storytelling expertise

**Status**: Planned

---

### Accessibility Reviewer Agent
**Priority**: 1 (Quality Content Generation)

**Purpose**: Comprehensive accessibility review against WCAG guidelines.

**Capabilities**:
- Reviews content for accessibility standards
- Checks language complexity and readability levels
- Reviews for inclusive language
- Validates heading hierarchy and document structure
- Suggests improvements for broader reach
- Creates detailed accessibility report

**Tools**: Read, Grep

**Why Agent**: Thorough, specialized review requiring deep accessibility knowledge

**Status**: Planned

---

### Audience Analyzer Agent
**Priority**: 2 (Marketing Assistance)

**Purpose**: Deep audience research and analysis for strategic insights.

**Capabilities**:
- Analyzes target audience characteristics and needs
- Identifies audience pain points and interests
- Researches demographic and psychographic data
- Tailors messaging for specific segments
- Suggests framing and positioning strategies
- Provides comprehensive audience profiles

**Tools**: Read, WebSearch, WebFetch

**Why Agent**: Extensive research across many sources; builds detailed audience profiles

**Status**: Planned

---

### Content Strategist Agent
**Priority**: 2 (Marketing Assistance)

**Purpose**: Strategic content planning and portfolio analysis.

**Capabilities**:
- Analyzes entire content portfolio
- Identifies content themes, pillars, and gaps
- Suggests content series and campaigns
- Provides strategic recommendations
- Plans multi-channel content strategies
- Creates comprehensive strategy documents

**Tools**: Read, Grep, Glob

**Why Agent**: Large-scale analysis across content portfolio; strategic thinking

**Status**: Planned

---

### Competitor Analyzer Agent
**Priority**: 2 (Marketing Assistance)

**Purpose**: Market analysis and competitive intelligence gathering.

**Capabilities**:
- Analyzes competitor content at scale
- Identifies content gaps and opportunities
- Evaluates what's resonating in the market
- Suggests differentiation strategies
- Provides competitive intelligence reports
- Tracks market trends

**Tools**: WebSearch, WebFetch, Read

**Why Agent**: High-volume competitive research; market analysis

**Status**: Planned

---

### Performance Analyzer Agent
**Priority**: 2 (Marketing Assistance)

**Purpose**: Data-driven content performance analysis and optimization.

**Capabilities**:
- Analyzes published content metrics across platforms
- Identifies patterns in what's working
- Correlates content attributes with performance
- Suggests data-driven improvements
- Provides performance reports
- Helps refine content strategy

**Tools**: WebFetch, Read

**Why Agent**: Large-scale data analysis; pattern recognition across content

**Status**: Planned

---

### Content Repurposer Agent
**Priority**: 3 (Publishing Workflow)

**Purpose**: Adapt content between formats and platforms while maintaining quality.

**Capabilities**:
- Adapts content between formats (long-form ↔ LinkedIn ↔ Substack)
- Maintains core message across adaptations
- Optimizes for each platform's best practices
- Suggests platform-specific enhancements
- Creates variations for different audiences
- Manages multi-platform content versions

**Tools**: Read, Write

**Why Agent**: Complex transformation requiring platform expertise; multiple variations

**Status**: Planned

---

## Hooks

Automated actions triggered by events - formatting, validation, and protection.

### Auto-Format Markdown
**Priority**: 3 (Publishing Workflow)

**Event**: `PostToolUse` (after Write/Edit on .md files)

**Purpose**: Automatically format markdown content after generation or editing.

**Capabilities**:
- Fixes markdown syntax issues
- Standardizes formatting (headings, lists, etc.)
- Ensures consistent structure
- Runs prettier or custom formatter

**Status**: Planned

---

### Validate Content Metadata
**Priority**: 3 (Publishing Workflow)

**Event**: `PreToolUse` (before publishing operations)

**Purpose**: Ensure all required metadata is present before publishing.

**Capabilities**:
- Checks for required frontmatter fields
- Validates metadata completeness
- Blocks publishing if metadata missing
- Provides clear error messages

**Status**: Planned

---

### Protect Published Content
**Priority**: 3 (Publishing Workflow)

**Event**: `PreToolUse` (before Write/Edit on published/ directories)

**Purpose**: Prevent accidental overwrites of published content.

**Capabilities**:
- Blocks edits to published content directories
- Requires explicit confirmation for changes
- Protects content integrity
- Logs attempted changes

**Status**: Planned

---

### Auto-Add Timestamps
**Priority**: 3 (Publishing Workflow)

**Event**: `PostToolUse` (after Write on new content files)

**Purpose**: Automatically add creation and modification timestamps.

**Capabilities**:
- Adds created/modified timestamps to frontmatter
- Updates timestamps on edits
- Maintains content history
- Tracks content lifecycle

**Status**: Planned

---

### Grammar Quick Check
**Priority**: 1 (Quality Content Generation)

**Event**: `PostToolUse` (after Write/Edit on .md files)

**Purpose**: Quick grammar validation after content creation.

**Capabilities**:
- Runs basic grammar checks
- Flags obvious errors
- Provides quick feedback
- Optional - can be disabled

**Status**: Planned

---

## Future Considerations

These items are valuable but lower priority given the current focus:

### Optimization & Technical (Lower Priority)
- **SEO Optimizer Skill**: Search optimization (deferred - focus is on quality, not optimization)
- **Keyword Research Skill**: Keyword analysis and suggestions
- **Link Checker Hook**: Validate links before publishing

### Compliance & Risk (Lower Priority)
- **Legal/Compliance Reviewer Agent**: Legal issues and disclaimers requiring extensive research
- **Sensitivity Reader Agent**: Cultural sensitivity review across multiple dimensions

### Advanced Workflow (Lower Priority)
- **Content Coordinator Agent**: Master orchestration agent coordinating multiple agents
- **Version Manager Skill**: Track content versions and changes
- **Collaboration Manager Skill**: Multi-author workflow coordination

### Social Media Expansion (Lower Priority)
- **Twitter/X Publisher Skill**: Format and publish to Twitter/X
- **Medium Publisher Skill**: Format and publish to Medium
- **Platform Adapter Agent**: General multi-platform adaptation

## Implementation Guidelines

### Component Development Standards

#### Commands
Simple markdown files in `commands/` directory:

```markdown
# Command Name

Brief description of what this command does.

## Instructions

Step-by-step instructions for Claude to follow...
```

**Naming**: Use descriptive names like `content.outline.md`, `content.tone-adjust.md`

---

#### Skills
Directory with `SKILL.md` and optional supporting files:

```
skills/skill-name/
├── SKILL.md
├── templates/
├── config/
└── scripts/
```

**SKILL.md structure**:
```yaml
---
name: skill-command-name
description: What this skill does (helps Claude auto-invoke)
disable-model-invocation: false  # Allow auto-invocation
---

# Skill Instructions

Detailed instructions, templates, and procedures...
```

---

#### Agents
Markdown files in `agents/` directory with specialized focus:

```yaml
---
name: agent-name
description: What this agent specializes in (helps Claude auto-delegate)
allowed-tools: Read, Write, Grep, Glob, WebSearch, WebFetch
color: blue|green|orange|purple|red|yellow
model: claude-sonnet-4-5-20250929  # or claude-haiku for cost savings
---

# Agent Role and Instructions

Detailed system prompt for the specialized agent...
```

---

#### Hooks
JSON configuration in `hooks/hooks.json`:

```json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "description": "What this hook does",
      "on": {
        "tool": "Write",
        "match": ".*\\.md$"
      },
      "action": {
        "type": "bash",
        "command": "command-to-run"
      }
    }
  ]
}
```

---

### Key Principles

1. **Right Tool for the Job**: Choose component type based on complexity and use case
   - Commands: Simple, quick, user-triggered actions
   - Skills: Medium complexity with configuration
   - Agents: Complex, high-volume, specialized tasks
   - Hooks: Automated, event-driven actions

2. **Non-Destructive Review**: Agents that review content should create reports with line number references, not directly edit

3. **Clear Separation of Concerns**: Each component has a distinct focus area without overlap

4. **Workflow-Oriented**: Components should support systematic, repeatable processes

5. **Quality Over Speed**: Prioritize thoroughness and quality over quick hacks

6. **Skill Development**: Help users develop better content creation discipline

7. **Isolation When Needed**: Use agents for tasks that would clutter main context

8. **Automation When Appropriate**: Use hooks for repetitive validation or formatting

---

### File Organization

```
plugins/content-creator/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata
├── agents/                      # Specialized AI assistants
│   ├── ideation.md
│   ├── editor.md
│   ├── technical-reviewer.md
│   ├── research.md
│   └── [future agents].md
├── commands/                    # Simple slash commands
│   ├── content.outline.md
│   ├── content.tone-adjust.md
│   ├── content.headlines.md
│   └── [future commands].md
├── skills/                      # Medium-complexity features
│   ├── safe-file-reader/
│   ├── symlink-manager/
│   ├── content-planner/
│   ├── brand-voice-checker/
│   └── [future skills]/
├── hooks/                       # Event-driven automation
│   └── hooks.json
├── ROADMAP.md                   # This file
└── README.md                    # Plugin documentation
```

---

### Decision Matrix: Choosing Component Type

| Characteristic | Command | Skill | Agent | Hook |
|----------------|---------|-------|-------|------|
| **Complexity** | Simple | Medium | Complex | N/A |
| **Invocation** | Manual | Auto or manual | Auto-delegated | Event-triggered |
| **Context** | Adds to main | Adds to main | Isolated | N/A |
| **Configuration** | None | Yes | Limited | Yes |
| **Supporting files** | No | Yes | No | No |
| **Use case** | Quick action | Configured workflow | Large-scale task | Automation |

**Examples:**
- Outline generation → **Command** (quick, simple)
- Brand checking → **Skill** (needs config, templates)
- Content audit → **Agent** (high-volume, isolated)
- Auto-format → **Hook** (automated, event-driven)

## Contributing

When adding new components to this plugin:

1. **Check the Roadmap**: Ensure the addition aligns with the plugin's philosophy and priorities

2. **Choose the Right Component Type**:
   - Simple, quick action? → **Command**
   - Needs configuration or templates? → **Skill**
   - Complex, high-volume, or isolated task? → **Agent**
   - Automated validation or formatting? → **Hook**

3. **Follow Standards**: Use the established structure and conventions for that component type

4. **Update Documentation**: Add the new component to this roadmap with:
   - Clear purpose and capabilities
   - Priority level (1, 2, or 3)
   - Component type and rationale
   - Status (Planned, In Progress, Completed)

5. **Test Thoroughly**: Ensure the component provides value in real content creation workflows

6. **Focus on Workflows**: Consider how this fits into the content creation process

7. **Maintain Separation**: Ensure the component doesn't duplicate existing functionality

## Success Metrics

We'll know this plugin is successful when:

1. **Quality Improves**: Content consistently meets high standards across multiple dimensions
2. **Discipline Develops**: Users adopt systematic workflows and processes
3. **Efficiency Increases**: Time spent on mechanics decreases, time on substance increases
4. **Confidence Grows**: Users feel more confident in their content before publishing
5. **Publishing Smooths**: Getting content onto platforms becomes frictionless

---

**Version**: 1.0.0
**Last Updated**: 2025-01-25
**Status**: Active Development
