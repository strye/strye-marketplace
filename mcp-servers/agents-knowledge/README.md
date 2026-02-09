# SDD Agents Knowledge MCP Server

Provides a queryable knowledge base for the Spec-Driven Development (SDD) agent framework. Eliminates context bloat by serving knowledge via Model Context Protocol (MCP) tools instead of embedding it in agent prompts.

**Implementation:** Pure vanilla JavaScript (no TypeScript, no build step)

## Architecture

This MCP server provides on-demand access to:

- **Requirements Analyst Knowledge**: Probing question patterns, EARS notation translation, gap identification
- **Spec Breakdown Strategist Knowledge**: Decomposition heuristics, dependency analysis, effort estimation
- **Solutions Architect Knowledge**: EARS-to-component translation, design templates, API patterns
- **Shared SDD Framework**: Workflow standards, naming conventions, quality checkpoints

## Tools Provided

### Requirements Analyst Tools

- `query_probing_questions(category)` - Get probing questions by category
- `identify_requirement_gaps(user_story)` - Identify missing requirements

### Spec Breakdown Strategist Tools

- `query_spec_heuristics(category)` - Get decomposition heuristics
- `estimate_spec_effort(story_count, complexity_factors)` - Get effort estimation guidance

### Solutions Architect Tools

- `translate_ears_to_components(ears_criterion)` - Translate EARS criteria to component design
- `get_design_template(section)` - Get design document template sections

### Shared Tools

- `get_sdd_reference(topic)` - Get SDD framework reference information

## Usage

### Install Dependencies

```bash
npm install
```

No build step required - code runs directly!

### Run Server

```bash
npm run dev
```

### Test Tools (Interactive Inspector)

```bash
npm run inspect
```

This launches the MCP Inspector where you can test tools interactively.

## Project Structure

```
mcp-servers/agents-knowledge/          # Self-contained MCP server
├── server.js                          # Main MCP server (300 lines)
├── knowledge-loader.js                # JSON file loader (60 lines)
├── knowledge/                         # Local knowledge base
│   ├── requirements/
│   │   ├── probing-patterns.json
│   │   ├── ears-patterns.json
│   │   └── gap-identification.json
│   ├── spec-breakdown/
│   │   ├── heuristics.json
│   │   └── effort-sizing.json
│   ├── architect/
│   │   ├── ears-translation.json
│   │   └── templates.json
│   └── shared/
│       ├── sdd-framework.json
│       └── quality-standards.json
├── package.json                       # Minimal dependencies
├── README.md                          # This file
└── QUICKSTART.md                      # Quick start guide
```

## Self-Contained Design

The MPC server is completely self-contained with knowledge base included. No external dependencies on `agents/knowledge/` directory.

**Advantages:**
- Can be deployed independently
- Knowledge updates don't require changes outside the server
- Single directory contains everything needed
- Easy to version and distribute

## Why Vanilla JavaScript?

- **No build step required** - Run code directly
- **No TypeScript overhead** - Simpler to maintain and update
- **Easier to modify** - Edit JSON, restart server (no compilation)
- **Smaller footprint** - Fewer dependencies
- **Simpler debugging** - Direct stack traces
- **Aligned with project standards** - "No TypeScript unless no other option"

## Implementation Status

- [x] Server setup and tool registration (vanilla JS)
- [x] Knowledge loader from JSON files
- [x] Remove TypeScript and build configuration
- [ ] Extract knowledge from markdown to JSON files
- [ ] Integration tests with MCP Inspector
- [ ] Plugin integration with Claude Code

## Next Steps

1. Install dependencies: `npm install`
2. Test with inspector: `npm run inspect`
3. Extract knowledge from agent markdown → JSON
4. Create remaining knowledge base JSON files
5. Integrate with Claude Code plugin

## Related Documentation

- [MCP Knowledge Base Architecture](../../../docs/planning/agent-enhancements/mcp-knowledge-base-architecture.md)
- [MCP Implementation Guide](../../../docs/planning/agent-enhancements/mcp-implementation-guide.md)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
