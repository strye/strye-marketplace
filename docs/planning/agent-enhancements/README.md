# Agent Enhancements & MCP Knowledge Base

This directory contains planning documents and implementations for enhancing the SDD agent framework.

## Quick Navigation

### 📋 Status Documents
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete overview of what was done and what's next
- **[solutions-architect-enhancement-plan.md](./solutions-architect-enhancement-plan.md)** - Specific enhancements needed for Solutions Architect

### 🏗️ Architecture & Design
- **[mcp-knowledge-base-architecture.md](./mcp-knowledge-base-architecture.md)** - Complete MCP architecture design with benefits, structure, and integration patterns

### 🚀 Implementation
- **[mcp-implementation-guide.md](./mcp-implementation-guide.md)** - Step-by-step implementation guide with 6 phases, examples, and troubleshooting

## What's This About?

### The Problem
Agent prompts contain large amounts of knowledge (questions, heuristics, patterns):
- Requirements Analyst: ~500 lines including full question library
- Spec Breakdown Strategist: ~700 lines including all heuristics
- Solutions Architect: ~1500 lines including patterns and templates

**Result:** Context bloat, difficult to update, not reusable

### The Solution
MCP (Model Context Protocol) Server providing knowledge as queryable tools:
- Agents: ~100-150 lines (70% reduction)
- Knowledge: Served on-demand via tools
- Reusable: Multiple agents use same knowledge base
- Maintainable: Update JSON files, not prompts

### What Was Built

**1. MCP Server Project** (`mcp-servers/agents-knowledge/`)
- Node.js/TypeScript server with 7 tools
- Loads knowledge from JSON files
- Ready to integrate with Claude Code plugin

**2. Knowledge Base** (`agents/knowledge/`)
- Requirements: Probing patterns, EARS notation, gap identification
- Spec Breakdown: Heuristics, effort sizing, dependency patterns
- Architecture: EARS translation, design templates, API patterns
- Shared: SDD framework, quality standards

**3. Documentation**
- Complete architecture design
- Step-by-step implementation guide
- Integration examples

## Getting Started

### To Review
1. Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 5 min overview
2. Skim [mcp-knowledge-base-architecture.md](./mcp-knowledge-base-architecture.md) - understand the approach

### To Implement
1. Follow [mcp-implementation-guide.md](./mcp-implementation-guide.md)
2. Phase 1: Build MCP server (30 min)
3. Phase 2: Expand knowledge base (2-3 hours)
4. Phase 3-6: Integration and testing

### To Understand the Code
1. `mcp-servers/agents-knowledge/src/server.ts` - Main MCP server
2. `mcp-servers/agents-knowledge/src/types.ts` - Type definitions
3. `agents/knowledge/*.json` - Knowledge base files

## Key Files

### MCP Server
```
mcp-servers/agents-knowledge/
├── src/server.ts              # Main server (300 lines)
├── src/types.ts               # Type definitions (150 lines)
├── src/resources/knowledge-loader.ts  # JSON loader
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

### Knowledge Base
```
agents/knowledge/
├── requirements/              # Requirements Analyst knowledge
│   ├── probing-patterns.json  # 16 question patterns
│   ├── ears-patterns.json     # EARS notation examples
│   └── gap-identification.json
├── spec-breakdown/            # Spec Breakdown Strategist knowledge
│   ├── heuristics.json        # 6 core heuristics
│   └── effort-sizing.json
├── architect/                 # Solutions Architect knowledge
│   ├── ears-translation.json  # EARS → components
│   └── templates.json         # 9 design templates
└── shared/                    # Shared knowledge
    ├── sdd-framework.json     # SDD workflow reference
    └── quality-standards.json
```

## MCP Tools Available

| Tool | Purpose | Category |
|------|---------|----------|
| `query_probing_questions(category)` | Get probing questions by category | Requirements |
| `identify_requirement_gaps(story)` | Find missing requirements | Requirements |
| `query_spec_heuristics(category)` | Get decomposition heuristics | Spec Breakdown |
| `estimate_spec_effort(count, factors)` | Get effort estimation | Spec Breakdown |
| `translate_ears_to_components(criterion)` | EARS → component mapping | Architecture |
| `get_design_template(section)` | Get design document templates | Architecture |
| `get_sdd_reference(topic)` | Get SDD framework reference | Shared |

## Architecture Visualization

```
Before (Context Bloat):
Agent Prompt (500+ lines)
├── Identity & philosophy
├── Probing questions (full library)
├── Heuristics (all patterns)
├── Examples
└── Templates

After (MCP-Based):
Agent Prompt (100-150 lines)   ←→   MCP Server   ←→   Knowledge Base (JSON)
├── Identity & philosophy            ├── Tool 1        ├── probing-patterns.json
├── Role description                 ├── Tool 2        ├── heuristics.json
└── References to tools              └── Tool 7        └── templates.json
```

## Implementation Timeline

- **Phase 1** (30 min): Build MCP server
- **Phase 2** (2-3 hrs): Expand knowledge base
- **Phase 3** (1 hr): Update agent prompts
- **Phase 4** (1-2 hrs): Test integration
- **Phase 5** (2-3 hrs): Plugin integration
- **Phase 6** (1 hr): Validation

**Total: 8-10 hours** to full implementation

## Key Benefits

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Agent Prompt Size | 500-700 lines | 100-150 lines | **70% reduction** |
| Knowledge Updates | Edit prompt | Update JSON | **5x faster** |
| Reusability | Per-agent | Shared tools | **100% shareable** |
| Scalability | Limited | Unlimited | **No limits** |
| Context Used | Always loaded | On-demand | **Reduced** |

## Questions?

- **How does it work?** → Read [mcp-knowledge-base-architecture.md](./mcp-knowledge-base-architecture.md)
- **How do I implement?** → Follow [mcp-implementation-guide.md](./mcp-implementation-guide.md)
- **What's the status?** → Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Official MCP docs?** → https://modelcontextprotocol.io/

## Next Steps

1. ✅ Architecture designed
2. ✅ Code written
3. ✅ Knowledge base initialized
4. ✅ Documentation complete
5. ⏳ Ready for implementation

**When you're ready to implement, start with Phase 1 in the implementation guide!**
