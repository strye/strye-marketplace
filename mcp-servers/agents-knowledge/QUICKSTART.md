# Quick Start: MCP Knowledge Base Server

## 30-Second Overview

This is an MCP (Model Context Protocol) server that serves SDD agent knowledge via queryable tools instead of embedding it in prompts.

**Problem solved:** Eliminate context bloat (agents were 500+ lines, now ~150 lines)

**Implementation:** Vanilla JavaScript - no TypeScript, no build step

## Test (3 minutes)

```bash
# Navigate to server directory
cd mcp-servers/agents-knowledge

# Install dependencies (MCP SDK only)
npm install

# Test with interactive inspector
npm run inspect
```

The inspector launches where you can test tools interactively.

## Run Server

```bash
# Start the server directly (no build needed!)
npm run dev
```

The server will start and listen for MCP requests.

## Test Tools

Use the MCP Inspector (`npm run inspect`) to try these tools:

```
# Requirements Analyst
query_probing_questions(category: "happy_path")
identify_requirement_gaps(user_story: "user login")

# Spec Breakdown Strategist
query_spec_heuristics(category: "technical_cohesion")
estimate_spec_effort(story_count: 5, complexity_factors: ["ui_work"])

# Solutions Architect
translate_ears_to_components(ears_criterion: "AC-5: WHEN user submits...")
get_design_template(section: "components")

# Shared
get_sdd_reference(topic: "workflow")
```

## How It Works

```
┌─────────────────────┐
│   Your Agent        │
│  (lean prompt,      │
│   ~150 lines)       │
└──────────┬──────────┘
           │
           │ queries via MCP
           ▼
┌─────────────────────┐
│   This Server       │
│  (tools that serve  │
│   knowledge on      │
│   demand)           │
└──────────┬──────────┘
           │
           │ loads from
           ▼
┌─────────────────────┐
│  Knowledge Base     │
│  (JSON files)       │
│                     │
│  agents/knowledge/  │
│  ├─ requirements/   │
│  ├─ spec-breakdown/ │
│  ├─ architect/      │
│  └─ shared/         │
└─────────────────────┘
```

## File Structure

```
mpc-servers/agents-knowledge/
├── server.js               ← Main server (vanilla JS, no build needed)
├── knowledge-loader.js     ← Loads JSON files from local knowledge/
├── knowledge/              ← Self-contained knowledge base
│   ├── requirements/
│   ├── spec-breakdown/
│   ├── architect/
│   └── shared/
├── package.json
└── README.md
```

Everything needed is in this directory - fully self-contained!

## Integration

When ready to integrate with Claude Code plugin:

```yaml
# plugin.yaml
mcp_servers:
  sdd_knowledge:
    command: "node"
    args:
      - "./mcp-servers/agents-knowledge/dist/server.js"
```

## Troubleshooting

### MCP Inspector Won't Launch
```bash
# Check Node version (need 18+)
node --version

# Check if port 3000 is available
lsof -i :3000
```

### Tools Return Empty
```bash
# Check knowledge files exist
ls agents/knowledge/requirements/
ls agents/knowledge/spec-breakdown/
ls agents/knowledge/architect/

# Verify JSON syntax
node -e "console.log(require('./agents/knowledge/requirements/probing-patterns.json'))"
```

### Build Fails
```bash
# Clean and rebuild
rm -rf dist
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

## Next Steps

1. ✓ Build server (`npm run build`)
2. ✓ Test with inspector (`npm run inspect`)
3. → Expand knowledge base (extract from markdown)
4. → Update agent prompts to use tools
5. → Integrate with plugin

## Documentation

- **Architecture:** `docs/planning/agent-enhancements/mcp-knowledge-base-architecture.md`
- **Implementation Guide:** `docs/planning/agent-enhancements/mcp-implementation-guide.md`
- **Full Summary:** `docs/planning/agent-enhancements/IMPLEMENTATION_SUMMARY.md`

## Key Stats

| Metric | Value |
|--------|-------|
| Tools Provided | 7 |
| Knowledge Files | 10 JSON files |
| Server Size | ~500 lines TypeScript |
| Knowledge Base | ~2,000 lines JSON |
| Agent Prompt Reduction | 70% |

---

**Ready to start?** → Run `npm install && npm run inspect`
