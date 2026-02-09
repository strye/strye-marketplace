# Self-Contained MCP Server

This MCP server is completely self-contained and can be deployed as a single unit.

## Structure

```
agents-knowledge/
├── server.js                    # MCP server (vanilla JS, 300 lines)
├── knowledge-loader.js          # JSON loader (60 lines)
├── knowledge/                   # Embedded knowledge base
│   ├── requirements/            # Probing questions, EARS patterns, gaps
│   ├── spec-breakdown/          # Heuristics, effort sizing
│   ├── architect/               # EARS translation, design templates
│   └── shared/                  # SDD framework, quality standards
├── package.json                 # Dependencies (MCP SDK only)
└── README.md
```

## Key Features

### ✅ Self-Contained
- All knowledge embedded in `knowledge/` directory
- No external dependencies on other directories
- Can be deployed independently
- Single directory contains everything needed

### ✅ Vanilla JavaScript
- No TypeScript, no build step
- Runs directly: `npm run dev`
- Easy to modify knowledge files
- Instant restart on changes

### ✅ Knowledge Base Included
- 9 JSON files with organized knowledge
- Requirements Analyst patterns
- Spec Breakdown heuristics
- Solutions Architect templates
- Shared SDD framework

## Usage

### Install
```bash
npm install
```

### Run
```bash
npm run dev
```

### Test
```bash
npm run inspect
```

## How It Works

1. **Server starts** - Loads `knowledge/` directory
2. **Tool requests arrive** - MCP Inspector or Claude Code plugin
3. **Knowledge loader reads** - Parses JSON files from `knowledge/`
4. **Tools return knowledge** - Agents query via MCP protocol
5. **No external calls** - All data is local

## Deployment

The entire `agents-knowledge/` directory is self-contained:

```bash
# Deploy as a single unit
cp -r agents-knowledge/ /deployment/location/
cd /deployment/location/agents-knowledge
npm install
npm run dev
```

## Knowledge Updates

To update knowledge:

1. Edit files in `knowledge/` subdirectories
2. Restart server (`Ctrl+C`, then `npm run dev`)
3. Changes take effect immediately
4. No build step needed
5. No external files to update

## Integration

Connect to Claude Code plugin:

```yaml
mcp_servers:
  sdd_knowledge:
    command: "node"
    args:
      - "/path/to/agents-knowledge/server.js"
```

That's it! Server is ready to use.

## Design Philosophy

- **Single Responsibility** - Just serves knowledge
- **No Dependencies** - Minimal npm packages
- **Easy to Update** - Edit JSON, restart
- **Production Ready** - No build tools needed
- **Portable** - Move directory anywhere
- **Maintainable** - Vanilla JS, clear structure

## Status

✅ Fully self-contained
✅ Ready for deployment
✅ No external dependencies
✅ All knowledge embedded
✅ Vanilla JavaScript (no TypeScript)
✅ No build step required
