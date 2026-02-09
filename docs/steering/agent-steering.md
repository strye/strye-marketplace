# Agent Steering Specification

This document defines the specification and guidelines for creating SDD agents that work within the Claude Code plugin framework. All agents must follow these standards to ensure consistency, compatibility, and effective collaboration.

## Overview

Agents in this system are specialized Claude subagents that handle specific roles in the Spec-Driven Development workflow:

- **Requirements Analyst** - Elicit complete, testable requirements through conversation
- **Spec Breakdown Strategist** - Analyze stories and decompose into implementable specs
- **Solutions Architect** - Translate requirements into detailed technical designs

Future agents should follow these specifications to integrate seamlessly.

## Subagent Standards

All agents must be implemented as Claude subagents with proper frontmatter configuration. Refer to the [Anthropic Subagent Documentation](https://code.claude.com/docs/en/sub-agents) for complete details.

### Required Frontmatter Fields

```yaml
---
# REQUIRED: Unique identifier
name: lowercase-with-hyphens

# REQUIRED: Detailed description (determines Claude's delegation logic)
description: Clear, action-oriented description including:
  - What the agent does
  - When to use it
  - Key specializations
  - Integration with SDD workflow

# RECOMMENDED: Metadata for discovery
capabilities: ["capability1", "capability2"]  # Key abilities
tags: ["category1", "category2"]              # Organizational tags

# REQUIRED: Subagent Configuration
model: inherit                   # Use parent model by default
maxTurns: N                       # Bound iterations (8-12 typical)
permissionMode: default          # How to handle permission prompts

# REQUIRED: Tool Access (principle of least privilege)
tools:                           # Allowlist of tools
  - read
  - edit
  - write
  - bash
  - glob
  - grep

disallowedTools: []              # Denylist (usually empty if using allowlist)

# REQUIRED: MCP Server Access
mcpServers:
  - sdd_knowledge                # SDD knowledge base

# RECOMMENDED: Persistent context
memory: project                  # Project-level memory retention
---
```

### Frontmatter Details

#### `name`
- Unique identifier using lowercase letters and hyphens
- Examples: `requirements-analyst`, `spec-breakdown-strategist`, `solutions-architect`
- Used for subagent routing and identification

#### `description`
**Most Important Field** - Determines when Claude delegates to this agent.

Write detailed descriptions that include:
1. **What it does** - Core purpose in 1-2 sentences
2. **When to use it** - Specific triggering scenarios
3. **Key specializations** - Technical capabilities
4. **Integration context** - Where in the SDD workflow

**Example (Good):**
```
Transform business requirements into detailed, implementable technical solutions.
Specializes in EARS notation translation, requirement traceability, component design,
API design, data modeling, and cloud architecture. Use for system design and technical
specification creation.
```

**Example (Poor):**
```
Architecture agent
```

#### `capabilities`
List of technical capabilities for discovery. Should align with agent specialization.

```yaml
capabilities:
  - "requirements elicitation"
  - "collaborative discovery"
  - "EARS notation"
  - "gap identification"
```

#### `model`
- `inherit` - Use parent model (recommended for consistency)
- `sonnet`, `opus`, `haiku` - Specific models for specialized needs

#### `maxTurns`
Limits agentic iterations to prevent runaway execution:
- Requirements agents: 10 turns
- Analysis agents: 8 turns
- Design agents: 12 turns

#### `permissionMode`
How the agent handles permission prompts:
- `default` - Ask for permission (recommended)
- `acceptEdits` - Auto-accept file edits
- `dontAsk` - Never ask for permission
- `delegate` - Escalate to parent agent

#### `tools`
Allowlist of available tools. Use principle of least privilege:

**Core Tools (Most Agents):**
- `read` - Read files
- `edit` - Edit existing files
- `write` - Create new files
- `bash` - Run terminal commands
- `glob` - Find files by pattern
- `grep` - Search file contents

**Specialized Tools (When Needed):**
- `task` - Invoke other agents/tasks
- `notebookedit` - Edit Jupyter notebooks
- `webfetch` - Fetch web content
- `websearch` - Search the web

#### `mcpServers`
MCP (Model Context Protocol) servers providing external tools and knowledge:

```yaml
mcpServers:
  - sdd_knowledge    # SDD agents knowledge base
```

The `sdd_knowledge` MCP server provides:
- Probing question patterns (requirements analyst)
- Spec decomposition heuristics (spec strategist)
- EARS translation patterns (solutions architect)
- Design templates
- Quality standards

#### `memory`
Persistent memory scope:
- `project` - Maintain context within project (recommended)
- `user` - Maintain context across all projects
- `local` - No persistent memory

## Architecture Patterns

### Agent Roles in SDD Workflow

```
1. Requirements Discovery
   └─ /specid.feature invokes requirements-analyst
      └─ Elicit user stories, acceptance criteria, requirements

2. Spec Decomposition
   └─ /specid.prepare invokes spec-breakdown-strategist
      └─ Analyze stories, recommend spec grouping, dependencies

3. Technical Design
   └─ /specid.design invokes solutions-architect
      └─ Create system design, component specs, APIs

4. Implementation
   └─ /specid.tasks
      └─ Generate tasks from design (can use agents for complex specs)

5. Status Tracking
   └─ /specid.sync
      └─ Propagate status bottom-up
```

### Knowledge Access Pattern

All agents access shared knowledge via MCP server:

```
Agent Request
    │
    ├─ Queries MCP Tool (e.g., query_probing_questions)
    │
    └─ MCP Server
        ├─ Loads Knowledge (e.g., probing-patterns.json)
        └─ Returns Knowledge
```

Benefits:
- ✅ Single source of truth for knowledge
- ✅ Agents stay lean (100-150 lines)
- ✅ Reusable across multiple agents
- ✅ Easy to update patterns without modifying agents

## Creating New Agents

### Step 1: Define Agent Role

Identify the agent's purpose within the SDD workflow:
- What problem does it solve?
- When would Claude delegate to it?
- What are its key competencies?

### Step 2: Create Agent File

Create `agents/[agent-name].md` with:

```markdown
---
name: agent-name
description: [Detailed description as per Frontmatter Standards above]
capabilities: ["capability1", "capability2"]
tags: ["tag1", "tag2"]

# Subagent Configuration
model: inherit
maxTurns: 10
permissionMode: default
tools:
  - read
  - edit
  - write
  - bash
  - glob
  - grep
disallowedTools: []
mcpServers:
  - sdd_knowledge
memory: project
---

# [Agent Name] Agent

## Agent Identity and Role
Describe the agent's core purpose and philosophy.

## Core Competencies
List major capabilities with brief explanations.

## Working Methodologies
Explain how the agent approaches its work.

## Integration Points
Explain where this agent fits in the SDD workflow.

## Output Formats
Describe what the agent produces.

## When to Use This Agent
Provide clear triggering conditions.

## Success Criteria
Define what "good" looks like for this agent's outputs.
```

### Step 3: Use MCP Knowledge Base

Structure the agent to query MCP tools rather than embedding knowledge:

```markdown
## Knowledge Access

This agent uses the SDD Knowledge Base via MCP tools:

**Available Tool:** `get_agent_specific_knowledge(category)`

Query the knowledge base for:
- Proven patterns in your domain
- Best practices and standards
- Examples and templates
```

### Step 4: Keep Agents Lean

Target agent file sizes:
- Requirements agents: 100-150 lines
- Analysis agents: 80-120 lines
- Design agents: 150-200 lines

Achieve leanness by:
- Referencing MCP knowledge instead of embedding examples
- Using conversational guidance rather than exhaustive patterns
- Focusing on agent-specific logic, not domain knowledge

### Step 5: Add to Steering

Once validated, document the agent in this file under "Existing Agents" section.

## Existing Agents

### Requirements Analyst Agent

**File:** `agents/requirements-analyst.md`

**Purpose:** Guide requirements discovery through collaborative conversation and EARS notation.

**Key Capabilities:**
- Requirements elicitation through probing questions
- Collaborative discovery (human-in-the-loop)
- EARS notation translation and validation
- Requirement gap identification
- User story splitting guidance

**MCP Integration:**
- `query_probing_questions(category)` - Proven question patterns
- `identify_requirement_gaps(user_story)` - Systematic gap analysis

**When to Invoke:**
- Creating new features (`/specid.feature`)
- Refining existing requirements
- Validating requirement completeness
- Converting user descriptions to EARS criteria

**Key Behaviors:**
- Asks probing questions rather than providing answers
- Helps users discover requirements through conversation
- Suggests EARS-formatted criteria based on user answers
- Identifies gaps in requirements systematically

### Spec Breakdown Strategist Agent

**File:** `agents/spec-breakdown-strategist.md`

**Purpose:** Analyze user stories and break them into implementable specifications with optimal parallelization.

**Key Capabilities:**
- Technical cohesion analysis
- Dependency detection and ordering
- Parallelization opportunity identification
- Complexity balancing
- Risk isolation

**MCP Integration:**
- `query_spec_heuristics(category)` - Decomposition patterns
- `estimate_spec_effort(story_count, factors)` - Effort validation

**When to Invoke:**
- Breaking down features into specs (`/specid.prepare`)
- Reviewing existing spec breakdowns
- Planning implementation order
- Balancing workload across specs

**Key Behaviors:**
- Provides high-confidence recommendations (80-90% acceptance rate)
- Clearly explains grouping rationale
- Identifies all dependencies explicitly
- Balances spec sizes for predictable delivery

### Solutions Architect Agent

**File:** `agents/solutions-architect.md`

**Purpose:** Transform business requirements into detailed, implementable technical solutions.

**Key Capabilities:**
- EARS notation translation to components
- Requirement traceability (FR/NFR/AC → components)
- Component architecture design
- API design and specification
- Data modeling and database design
- Cloud architecture (AWS focus)

**MCP Integration:**
- `translate_ears_to_components(ears_criterion)` - EARS → component mapping
- `get_design_template(section)` - Design document templates
- `get_sdd_reference(topic)` - SDD framework references

**When to Invoke:**
- Creating system designs (`/specid.design`)
- Refining existing technical specifications
- Translating requirements to architecture
- Designing APIs and data models

**Key Behaviors:**
- Traces every component to specific requirements
- Translates EARS criteria to component interfaces
- Creates comprehensive requirement traceability matrix
- Provides implementation-ready specifications

## MCP Knowledge Base Reference

The `sdd_knowledge` MCP server provides:

### Available Tools

**Requirements Analyst Tools:**
- `query_probing_questions(category)` - Get probing patterns by category
- `identify_requirement_gaps(user_story)` - Find missing requirements

**Spec Breakdown Strategist Tools:**
- `query_spec_heuristics(category)` - Get decomposition heuristics
- `estimate_spec_effort(story_count, complexity_factors)` - Estimate effort

**Solutions Architect Tools:**
- `translate_ears_to_components(ears_criterion)` - Translate EARS to components
- `get_design_template(section)` - Get design templates

**Shared Tools:**
- `get_sdd_reference(topic)` - Get SDD framework reference

### Knowledge Base Organization

```
mcp-servers/agents-knowledge/
├── knowledge/
│   ├── requirements/
│   │   ├── probing-patterns.json (60+ question patterns)
│   │   ├── ears-patterns.json (EARS translation patterns)
│   │   └── gap-identification.json (common gaps)
│   ├── spec-breakdown/
│   │   ├── heuristics.json (decomposition heuristics)
│   │   └── effort-sizing.json (effort estimation)
│   ├── architect/
│   │   ├── ears-translation.json (EARS → component mapping)
│   │   └── templates.json (design templates)
│   └── shared/
│       ├── sdd-framework.json (SDD workflow, naming, status)
│       └── quality-standards.json (quality checklists)
```

## Design Principles

### 1. Lean Agent Files
Agents should be focused and concise:
- ~150 lines maximum for most agents
- Embed core logic and philosophy
- Reference MCP knowledge, don't embed examples
- Clear when to use agent, success criteria

### 2. Single Responsibility
Each agent has one clear role:
- Requirements Analyst: Elicit requirements
- Spec Breakdown Strategist: Decompose features
- Solutions Architect: Design solutions

New agents should have similarly focused responsibility.

### 3. Human-in-the-Loop
Agents should amplify human thinking:
- Ask probing questions rather than deciding
- Suggest patterns rather than mandate
- Let humans validate and refine
- Provide clear rationale for recommendations

### 4. Knowledge Centralization
Avoid embedding knowledge in agents:
- Store patterns, templates, heuristics in MCP knowledge base
- Query knowledge dynamically
- Update knowledge without changing agents
- Reuse knowledge across multiple agents

### 5. Requirement Traceability
For design agents, trace everything to requirements:
- Every component should satisfy requirement(s)
- Every requirement should be addressed by component(s)
- Maintain traceability matrix in design documents
- EARS criteria → component interfaces

### 6. Bounded Execution
All agents must have execution limits:
- Set appropriate `maxTurns` (8-12 typical)
- Prevent infinite loops
- Allow for iterative refinement
- Stop when primary task complete

## Quality Standards

### Agent Quality Criteria

- **Focused** - Single, clear responsibility
- **Actionable** - Produces clear outputs for next step
- **Traceable** - Results reference source requirements/rationale
- **Human-Centric** - Augments human judgment, doesn't replace
- **Efficient** - Minimal turns, focused execution
- **Documented** - Clear when/how to use

### Frontmatter Quality Checklist

Before finalizing an agent:

- [ ] `name` is unique, lowercase with hyphens
- [ ] `description` is detailed (3-5 sentences) with clear use cases
- [ ] `capabilities` lists 3-5 specific abilities
- [ ] `tags` are organized and descriptive
- [ ] `model` is set to `inherit` (unless specialized)
- [ ] `maxTurns` is appropriate for agent type (8-12)
- [ ] `tools` list includes only necessary tools
- [ ] `disallowedTools` is empty (using allowlist instead)
- [ ] `mcpServers` includes `sdd_knowledge` for SDD agents
- [ ] `memory` is set to `project`

### Content Quality Checklist

- [ ] Agent file is <200 lines (lean and focused)
- [ ] No embedded examples or patterns (reference MCP instead)
- [ ] Clear agent role and philosophy
- [ ] Lists core competencies (3-5 key areas)
- [ ] Explains how to use the agent
- [ ] Defines success criteria
- [ ] Integrates with SDD workflow
- [ ] References MCP knowledge tools

## Integration with CLAUDE.md

Agents are documented in `CLAUDE.md` with reference to this steering document:

```markdown
## Agents

SDD agents are specialized Claude subagents that handle specific roles in the workflow.
For agent specification and guidelines, see [Agent Steering](docs/steering/agent-steering.md).

### Existing Agents

- **Requirements Analyst** (`agents/requirements-analyst.md`) - Elicit complete requirements
- **Spec Breakdown Strategist** (`agents/spec-breakdown-strategist.md`) - Decompose features
- **Solutions Architect** (`agents/solutions-architect.md`) - Design technical solutions

### Creating New Agents

See [Agent Steering: Creating New Agents](docs/steering/agent-steering.md#creating-new-agents)
for the complete specification and guidelines.
```

## Maintenance

### Updating Agent Knowledge

To update agent knowledge without modifying agents:

1. Edit JSON files in `mcp-servers/agents-knowledge/knowledge/`
2. Restart the MCP server
3. Changes take effect immediately
4. Agents automatically use updated knowledge

### Adding New Agent Capabilities

If a new agent needs new MCP tools:

1. Add tool to `mcp-servers/agents-knowledge/server.js`
2. Create corresponding knowledge JSON file
3. Add agent to `mcpServers` list in agent frontmatter
4. Document tool in this steering file

### Agent Versioning

Track agent evolution in CLAUDE.md or agent file header:

```yaml
---
name: agent-name
...
# Agent Version History
# - v1.0 (2025-02-08): Initial implementation
# - v1.1 (2025-02-15): Added MCP integration
---
```

## Troubleshooting

### Agent Not Invoked
- Check `description` is detailed and action-oriented
- Verify agent name is unique
- Ensure frontmatter YAML is valid

### Agent Can't Access Files
- Verify `tools` list includes `read`, `edit`, `write`
- Check file paths are correct
- Ensure agent has project context

### Agent Can't Access MCP Knowledge
- Verify `mcpServers` includes `sdd_knowledge`
- Check MCP server is running
- Verify knowledge JSON files exist

### Agent Executing Too Many Turns
- Reduce `maxTurns` value
- Check agent isn't stuck in loop
- Verify agent completes task in primary phase

## References

- [Anthropic Subagent Documentation](https://code.claude.com/docs/en/sub-agents)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Spec-Driven Development Workflow](../CLAUDE.md)
