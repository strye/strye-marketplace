# MCP-Based Knowledge Base Architecture for SDD Agents

## Overview

Instead of embedding knowledge directly in agent prompts (causing context bloat), we'll create an **MCP server** that provides agent knowledge as queryable tools and resources. This enables:

- ✅ **Zero Context Bloat** - Agents get lean prompts, load knowledge on-demand
- ✅ **Complete Reusability** - Multiple agents/commands query same knowledge base
- ✅ **Separation of Concerns** - Agent definitions separate from reference materials
- ✅ **Hot Updates** - Modify knowledge without restarting plugin
- ✅ **Progressive Disclosure** - Load only what's needed, when needed

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         Claude Code Plugin (commands/)                  │
│  - /specid.feature                                      │
│  - /specid.design                                       │
│  - /specid.prepare                                      │
│  - etc.                                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ queries via MCP
                     ▼
┌─────────────────────────────────────────────────────────┐
│    SDD Agent Knowledge MCP Server                       │
│  (agents-knowledge-mcp/)                                │
│                                                         │
│  Tools:                                                 │
│  - query_requirement_patterns                           │
│  - query_probing_questions                              │
│  - query_spec_heuristics                                │
│  - query_ears_translation                               │
│  - query_traceability_patterns                          │
│  - query_design_template                                │
│                                                         │
│  Resources:                                             │
│  - requirements-analyst knowledge base                  │
│  - spec-breakdown-strategist knowledge base             │
│  - solutions-architect knowledge base                   │
│  - shared SDD patterns                                  │
└─────────────────────────────────────────────────────────┘
                     ▲
                     │
                     │ loads from
                     ▼
┌─────────────────────────────────────────────────────────┐
│     Knowledge Base (agents/knowledge/)                  │
│  - patterns/                                            │
│  - question-library/                                    │
│  - heuristics/                                          │
│  - examples/                                            │
│  - templates/                                           │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure (Self-Contained)

```
integrated-design-spec/
├── agents/
│   ├── requirements-analyst.md          # Agent definition (lean)
│   ├── solutions-architect.md           # Agent definition (lean)
│   └── spec-breakdown-strategist.md     # Agent definition (lean)
│
└── mcp-servers/
    └── agents-knowledge/                # Self-contained MCP server
        ├── server.js                    # Main MCP server (vanilla JS)
        ├── knowledge-loader.js          # Load JSON knowledge base
        ├── knowledge/                   # Embedded knowledge base
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
        ├── package.json
        └── README.md
```

**Design: Self-Contained**
- MCP server includes all knowledge needed
- No external dependencies on `agents/knowledge/`
- Can be deployed as a single unit
- Easy to version and distribute

---

## MCP Server Design

### Server Initialization

The MCP server loads knowledge from JSON files and exposes them as queryable tools.

```javascript
// server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadKnowledgeBase } from "./knowledge-loader.js";

// Initialize server
const server = new Server({
  name: "sdd-agents-knowledge",
  version: "1.0.0",
});

// Load knowledge base from JSON files
let knowledge = await loadKnowledgeBase();

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [...7 tool definitions...] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Handle tool calls with knowledge
  switch (request.name) {
    case "query_probing_questions":
      return handleProbingQuestions(request.arguments);
    // ... etc
  }
});

// Connect via stdio
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Knowledge-Driven Tools

Instead of embedding knowledge in prompts, agents query it via tools:

```javascript
// server.js (excerpt)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;

  switch (name) {
    // Tool 1: Query probing questions by category
    case "query_probing_questions": {
      const questions = knowledge.requirements.patterns.filter(
        (p) => p.category === args.category
      );
      const limited = questions.slice(0, args.limit || 5);
      const formatted = limited
        .map(
          (q) =>
            `**${q.id}**: ${q.question}\n\nExample: ${q.example}`
        )
        .join("\n\n---\n\n");

      return {
        content: [{ type: "text", text: formatted }],
      };
    }
    // ... more tools

  // Tool 2: Translate user answer to EARS criteria
  server.registerTool({
    name: "translate_to_ears",
    description: "Translate user answer into EARS-formatted acceptance criteria",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description: "The probing question asked",
        },
        answer: {
          type: "string",
          description: "User's answer",
        },
      },
      required: ["question", "answer"],
    },
    execute: async (input) => {
      const patterns = knowledge.requirements.earsPatterns;
      // Analyze answer and suggest EARS pattern
      const suggestion = analyzeAndSuggestEARS(input.answer, patterns);
      return {
        content: [
          {
            type: "text",
            text: suggestion,
          },
        ],
      };
    },
  });

  // Tool 3: Identify requirement gaps
  server.registerTool({
    name: "identify_requirement_gaps",
    description: "Identify missing requirements based on story description",
    inputSchema: {
      type: "object",
      properties: {
        user_story: {
          type: "string",
          description: "User story or feature description",
        },
      },
      required: ["user_story"],
    },
    execute: async (input) => {
      const gaps = knowledge.requirements.gaps;
      // Analyze story and suggest gaps
      const identified = identifyGaps(input.user_story, gaps);
      return {
        content: [
          {
            type: "text",
            text: identified,
          },
        ],
      };
    },
  });
}
```

### Spec Breakdown Tools

```typescript
// src/tools/spec-tools.ts
export function registerSpecTools(server: Server, knowledge: KnowledgeBase) {
  // Tool 1: Query heuristics by category
  server.registerTool({
    name: "query_spec_heuristics",
    description: "Query spec decomposition heuristics",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "technical_cohesion",
            "dependencies",
            "parallel_work",
            "size_balancing",
            "risk_isolation",
          ],
        },
        heuristic: {
          type: "string",
          description: "Specific heuristic (e.g., 'ui_stories_together')",
        },
      },
      required: ["category"],
    },
    execute: async (input) => {
      const heuristics = knowledge.specBreakdown.heuristics.filter(
        (h) =>
          h.category === input.category &&
          (!input.heuristic || h.id === input.heuristic)
      );
      return {
        content: [
          {
            type: "text",
            text: formatHeuristics(heuristics),
          },
        ],
      };
    },
  });

  // Tool 2: Dependency chain analysis
  server.registerTool({
    name: "analyze_dependency_chains",
    description: "Analyze dependencies between user stories",
    inputSchema: {
      type: "object",
      properties: {
        stories: {
          type: "array",
          items: { type: "string" },
          description: "User story descriptions",
        },
      },
      required: ["stories"],
    },
    execute: async (input) => {
      // Analyze dependencies and suggest grouping
      const analysis = analyzeChains(input.stories, knowledge.specBreakdown);
      return {
        content: [
          {
            type: "text",
            text: analysis,
          },
        ],
      };
    },
  });

  // Tool 3: Effort sizing guidance
  server.registerTool({
    name: "estimate_spec_effort",
    description: "Get effort estimation guidelines",
    inputSchema: {
      type: "object",
      properties: {
        story_count: {
          type: "number",
          description: "Number of stories in spec",
        },
        complexity_factors: {
          type: "array",
          items: { type: "string" },
          description: "Complexity indicators (new_tech, external_deps, etc)",
        },
      },
      required: ["story_count"],
    },
    execute: async (input) => {
      const guidance = knowledge.specBreakdown.effortSizing;
      const estimate = calculateEffort(input, guidance);
      return {
        content: [
          {
            type: "text",
            text: estimate,
          },
        ],
      };
    },
  });
}
```

### Solutions Architect Tools

```typescript
// src/tools/architect-tools.ts
export function registerArchitectTools(server: Server, knowledge: KnowledgeBase) {
  // Tool 1: Translate EARS to component design
  server.registerTool({
    name: "translate_ears_to_components",
    description: "Translate EARS criteria to component specifications",
    inputSchema: {
      type: "object",
      properties: {
        ears_criterion: {
          type: "string",
          description: "EARS-formatted acceptance criterion (e.g., AC-5)",
        },
      },
      required: ["ears_criterion"],
    },
    execute: async (input) => {
      const patterns = knowledge.architect.earsTranslation;
      const translation = translateEARS(input.ears_criterion, patterns);
      return {
        content: [
          {
            type: "text",
            text: translation,
          },
        ],
      };
    },
  });

  // Tool 2: Get traceability patterns
  server.registerTool({
    name: "get_traceability_pattern",
    description: "Get requirement traceability patterns for design docs",
    inputSchema: {
      type: "object",
      properties: {
        pattern_type: {
          type: "string",
          enum: [
            "component_requirements",
            "traceability_matrix",
            "validation_checklist",
          ],
        },
        requirement_type: {
          type: "string",
          enum: ["functional", "non_functional", "acceptance_criteria"],
        },
      },
      required: ["pattern_type"],
    },
    execute: async (input) => {
      const pattern = knowledge.architect.traceability[input.patternType];
      return {
        content: [
          {
            type: "text",
            text: formatPattern(pattern),
          },
        ],
      };
    },
  });

  // Tool 3: API design patterns
  server.registerTool({
    name: "get_api_pattern",
    description: "Get API design patterns and examples",
    inputSchema: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          enum: ["rest", "graphql", "event_driven", "rpc"],
        },
        context: {
          type: "string",
          description: "Design context (e.g., 'microservices', 'mobile_backend')",
        },
      },
      required: ["pattern"],
    },
    execute: async (input) => {
      const pattern = knowledge.architect.apiPatterns[input.pattern];
      return {
        content: [
          {
            type: "text",
            text: formatAPIPattern(pattern, input.context),
          },
        ],
      };
    },
  });

  // Tool 4: Design templates
  server.registerTool({
    name: "get_design_template",
    description: "Get design document template sections",
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          enum: [
            "overview",
            "requirements",
            "solution_architecture",
            "components",
            "data_models",
            "api_specs",
            "sequence_diagrams",
            "testing_strategy",
            "traceability_matrix",
          ],
        },
      },
      required: ["section"],
    },
    execute: async (input) => {
      const template = knowledge.architect.templates[input.section];
      return {
        content: [
          {
            type: "text",
            text: template,
          },
        ],
      };
    },
  });
}
```

---

## Knowledge Base Files (JSON Format)

### requirements/probing-patterns.json

```json
{
  "patterns": [
    {
      "category": "happy_path",
      "id": "q1.1_ideal_scenario",
      "question": "Let's start with the ideal scenario - walk me through what happens when everything works perfectly.",
      "example": "User clicks 'Add to Cart', item appears in cart, success message shows.",
      "follow_ups": [
        "What triggers this action?",
        "What does the user see?",
        "How does the user know it succeeded?"
      ]
    },
    {
      "category": "error_discovery",
      "id": "q2.1_what_could_go_wrong",
      "question": "What could go wrong - what errors or failures should we handle?",
      "example": "Item out of stock, session expired, server down",
      "resulting_criteria": [
        "IF item is out of stock WHEN user clicks Add to Cart, display error",
        "IF session expired WHEN adding to cart, redirect to login"
      ]
    }
  ]
}
```

### spec-breakdown/heuristics.json

```json
{
  "heuristics": [
    {
      "category": "technical_cohesion",
      "id": "heuristic_1.1_ui_stories_together",
      "rule": "If 3+ stories modify the same page/component, group them",
      "signals": [
        "Stories mention same UI location",
        "Stories share UI state",
        "Stories require same framework"
      ],
      "example": {
        "stories": [
          "Display product list on catalog page",
          "Add filtering to product catalog",
          "Add sorting to product catalog"
        ],
        "grouping": "SPEC-001: Product Catalog UI",
        "rationale": "All work on same React component, shared state"
      },
      "effort_impact": "Medium (typically 5-10 days)"
    }
  ]
}
```

### architect/ears-translation.json

```json
{
  "patterns": [
    {
      "ears_format": "WHEN [trigger], the system SHALL [response]",
      "translation_steps": [
        "Identify trigger event",
        "Identify required response",
        "Map to components needed",
        "Define interfaces"
      ],
      "example": {
        "criterion": "AC-5: WHEN user submits valid credentials, system SHALL authenticate and redirect to dashboard",
        "components": [
          {
            "name": "AuthenticationService",
            "method": "authenticate(credentials: Credentials)",
            "responsibility": "Validate credentials"
          },
          {
            "name": "NavigationService",
            "method": "redirectToDashboard(user: User)",
            "responsibility": "Redirect after auth"
          }
        ]
      }
    }
  ]
}
```

---

## How Agents Use the Knowledge Base

### Requirements Analyst Example

**Agent Prompt (lean):**
```markdown
You are a Requirements Analyst specializing in collaborative requirements discovery.

Your role:
- Ask probing questions to help users think through edge cases
- Translate answers into EARS-formatted criteria
- Identify missing requirements

You have access to a knowledge base via MCP tools:
- query_probing_questions(category) - Get questions for specific category
- identify_requirement_gaps(user_story) - Find missing requirements
- translate_to_ears(question, answer) - Convert answer to EARS format

Start by querying relevant probing questions based on the feature context.
Build criteria iteratively based on user answers.
```

**Agent Usage During Conversation:**

1. **User says:** "We need user login feature"
2. **Agent queries:** `query_probing_questions(category: "happy_path")`
3. **Knowledge base returns:** Top 5 questions about user authentication
4. **Agent:** "Let me ask some questions to flesh this out..."
5. **User answers:** "User enters email and password, system authenticates"
6. **Agent queries:** `translate_to_ears(question, answer)`
7. **Knowledge base returns:** Suggested EARS criteria
8. **Agent:** "Based on your answer, I suggest: AC-1. WHEN user provides valid credentials..."

### Solutions Architect Example

**Agent Prompt (lean):**
```markdown
You are a Solutions Architect translating business requirements into technical designs.

Your role:
- Analyze requirements in terms of EARS criteria
- Design components that satisfy each criterion
- Create traceability matrix linking requirements to components

You have access to a knowledge base via MCP tools:
- translate_ears_to_components(criterion) - Get component design patterns
- get_traceability_pattern(pattern_type) - Get traceability templates
- get_design_template(section) - Get design document sections
```

**Agent Usage During Design:**

1. **User provides:** requirements.md with FR-1, AC-5, NFR-2
2. **Agent queries:** `translate_ears_to_components(AC-5)` for each criterion
3. **Knowledge base returns:** Component patterns for each EARS criterion
4. **Agent queries:** `get_traceability_pattern("traceability_matrix")`
5. **Knowledge base returns:** Template for requirement traceability matrix
6. **Agent produces:** design.md with full component specs and traceability

### Spec Breakdown Strategist Example

**Agent Prompt (lean):**
```markdown
You are a Spec Breakdown Strategist analyzing user stories.

Your role:
- Identify technical cohesion and dependencies
- Recommend spec groupings with rationale
- Provide implementation order and parallelization strategy

You have access to a knowledge base via MCP tools:
- query_spec_heuristics(category) - Get decomposition heuristics
- analyze_dependency_chains(stories) - Analyze dependencies
- estimate_spec_effort(story_count, factors) - Estimate effort
```

**Agent Usage During Decomposition:**

1. **User provides:** 12 user stories for feature
2. **Agent queries:** `query_spec_heuristics(category: "technical_cohesion")`
3. **Knowledge base returns:** Rules for UI/backend/data grouping
4. **Agent queries:** `analyze_dependency_chains(stories)`
5. **Knowledge base returns:** Dependency analysis framework
6. **Agent produces:** High-confidence spec breakdown with rationale

---

## Integration with Claude Code Plugin

### Configuration in plugin.yaml

```yaml
mcp_servers:
  sdd_knowledge:
    command: "node"
    args:
      - "./mcp-servers/agents-knowledge/dist/server.js"
    env:
      KNOWLEDGE_BASE_PATH: "./agents/knowledge"

command_contexts:
  specid.feature:
    agents:
      - requirements-analyst
    mcp_servers:
      - sdd_knowledge
    tools:
      - query_probing_questions
      - translate_to_ears
      - identify_requirement_gaps

  specid.design:
    agents:
      - solutions-architect
    mcp_servers:
      - sdd_knowledge
    tools:
      - translate_ears_to_components
      - get_traceability_pattern
      - get_design_template

  specid.prepare:
    agents:
      - spec-breakdown-strategist
    mcp_servers:
      - sdd_knowledge
    tools:
      - query_spec_heuristics
      - analyze_dependency_chains
      - estimate_spec_effort
```

---

## Benefits of MCP-Based Approach

| Aspect | Before (Context in Prompt) | After (MCP Knowledge Base) |
|--------|--------------------------|--------------------------|
| **Context Size** | Agents: 500+ lines each | Agents: 100-150 lines each |
| **Knowledge Updates** | Edit prompt, restart agent | Update JSON, auto-reload |
| **Reusability** | Knowledge tied to one agent | Tools queried by multiple agents |
| **Discoverability** | Hidden in prompt | Listed as tools, discoverable |
| **Scalability** | Adding knowledge bloats prompt | Add tools without size limit |
| **Performance** | All knowledge loaded upfront | Load on-demand via tool calls |
| **Version Control** | Difficult to track changes | Clear diffs on JSON updates |

---

## Implementation Phases

### Phase 1: MCP Server Setup
1. Create project structure (`mcp-servers/agents-knowledge/`)
2. Initialize TypeScript project with MCP SDK
3. Implement knowledge loader from JSON files
4. Register basic tool groups

### Phase 2: Knowledge Extraction
1. Extract probing questions from `requirements-analyst-question-library.md` → JSON
2. Extract heuristics from `spec-breakdown-heuristics.md` → JSON
3. Extract patterns from agent files → JSON
4. Organize in knowledge base structure

### Phase 3: Tool Implementation
1. Implement Requirements Analyst tools
2. Implement Spec Breakdown Strategist tools
3. Implement Solutions Architect tools
4. Test with MCP Inspector

### Phase 4: Integration
1. Build MCP server
2. Configure plugin.yaml to reference MCP server
3. Update agent prompts to use MCP tools
4. Test end-to-end in Claude Code

### Phase 5: Validation
1. Run evaluations with MCP knowledge base
2. Verify context size reduction
3. Verify agents can still accomplish original goals
4. Performance testing

---

## Next Steps

1. **Approve architecture** - Does this approach fit your needs?
2. **Choose implementation language** - TypeScript (recommended) or Python?
3. **Start Phase 1** - Set up MCP server project
4. **Extract knowledge** - Convert markdown → JSON knowledge base
5. **Implement tools** - Register tools for each agent group

Would you like me to proceed with implementing this architecture?
