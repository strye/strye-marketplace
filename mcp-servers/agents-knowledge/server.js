#!/usr/bin/env node

/**
 * SDD Agents Knowledge MCP Server
 *
 * Provides queryable knowledge base for:
 * - Requirements Analyst agent
 * - Solutions Architect agent
 * - Spec Breakdown Strategist agent
 */

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

// Global knowledge base instance
let knowledge = null;

/**
 * Tool listing handler
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Requirements Analyst tools
      {
        name: "query_probing_questions",
        description:
          "Find probing questions for requirements discovery by category",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: [
                "happy_path",
                "error_discovery",
                "data_inputs",
                "outputs_results",
                "validation_rules",
                "edge_cases",
                "user_experience",
              ],
              description: "Question category to retrieve",
            },
            limit: {
              type: "number",
              description: "Maximum questions to return (default: 5)",
            },
          },
          required: ["category"],
        },
      },
      {
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
      },

      // Spec Breakdown Strategist tools
      {
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
              description:
                "Specific heuristic (e.g., 'ui_stories_together')",
            },
          },
          required: ["category"],
        },
      },
      {
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
      },

      // Solutions Architect tools
      {
        name: "translate_ears_to_components",
        description:
          "Translate EARS criteria to component specifications",
        inputSchema: {
          type: "object",
          properties: {
            ears_criterion: {
              type: "string",
              description:
                "EARS-formatted acceptance criterion (e.g., AC-5)",
            },
          },
          required: ["ears_criterion"],
        },
      },
      {
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
      },

      // Shared tools
      {
        name: "get_sdd_reference",
        description:
          "Get reference information about SDD framework and standards",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              enum: [
                "workflow",
                "naming_conventions",
                "quality_standards",
                "numbering_system",
              ],
            },
          },
          required: ["topic"],
        },
      },
    ],
  };
});

/**
 * Tool execution handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;

  try {
    switch (name) {
      // Requirements Analyst tools
      case "query_probing_questions":
        return await handleProbingQuestions(args);
      case "identify_requirement_gaps":
        return await handleGapIdentification(args);

      // Spec Breakdown tools
      case "query_spec_heuristics":
        return await handleSpecHeuristics(args);
      case "estimate_spec_effort":
        return await handleEffortEstimation(args);

      // Solutions Architect tools
      case "translate_ears_to_components":
        return await handleEARSTranslation(args);
      case "get_design_template":
        return await handleDesignTemplate(args);

      // Shared tools
      case "get_sdd_reference":
        return await handleSDDReference(args);

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Tool handler implementations
async function handleProbingQuestions(input) {
  const questions = knowledge.requirements.patterns.filter(
    (p) => p.category === input.category
  );
  const limited = questions.slice(0, input.limit || 5);

  const formatted = limited
    .map(
      (q) =>
        `**${q.id}**: ${q.question}\n\nExample: ${q.example}\n\nFollow-ups: ${q.follow_ups.join(", ")}`
    )
    .join("\n\n---\n\n");

  return {
    content: [
      {
        type: "text",
        text: formatted,
      },
    ],
  };
}

async function handleGapIdentification(input) {
  const gaps = knowledge.requirements.gap_identification;
  const categories = Object.keys(gaps);

  const response = `Common gaps to explore for this story:\n\n${categories
    .map((cat) => `**${cat}**:\n${gaps[cat].map((g) => `- ${g}`).join("\n")}`)
    .join("\n\n")}`;

  return {
    content: [
      {
        type: "text",
        text: response,
      },
    ],
  };
}

async function handleSpecHeuristics(input) {
  const heuristics = knowledge.spec_breakdown.heuristics.filter(
    (h) =>
      h.category === input.category &&
      (!input.heuristic || h.id === input.heuristic)
  );

  const formatted = heuristics
    .map(
      (h) =>
        `**${h.id}**\n\nRule: ${h.rule}\n\nSignals:\n${h.signals.map((s) => `- ${s}`).join("\n")}\n\nExample: ${h.example.grouping}\nRationale: ${h.example.rationale}\n\nEffort: ${h.effort_impact}`
    )
    .join("\n\n---\n\n");

  return {
    content: [
      {
        type: "text",
        text: formatted,
      },
    ],
  };
}

async function handleEffortEstimation(input) {
  const guidance = knowledge.spec_breakdown.effort_sizing;
  const factors = (input.complexity_factors || []).join(", ");

  const response = `Effort Estimation Guide\n\nStory Count: ${input.story_count}\nComplexity Factors: ${factors || "none"}\n\nSizing Guidelines:\n${Object.entries(guidance)
    .map(([size, desc]) => `${size}: ${desc}`)
    .join("\n")}`;

  return {
    content: [
      {
        type: "text",
        text: response,
      },
    ],
  };
}

async function handleEARSTranslation(input) {
  const patterns = knowledge.solutions_architect.ears_translation;
  const formatted = patterns
    .map(
      (p) =>
        `Pattern: ${p.format}\n\nSteps:\n${p.translation_steps.map((s) => `1. ${s}`).join("\n")}\n\nExample:\n${p.example.criterion}`
    )
    .join("\n\n---\n\n");

  return {
    content: [
      {
        type: "text",
        text: `Translating: ${input.ears_criterion}\n\n${formatted}`,
      },
    ],
  };
}

async function handleDesignTemplate(input) {
  const templates = knowledge.solutions_architect.templates;
  const template = templates[input.section];

  if (!template) {
    return {
      content: [
        {
          type: "text",
          text: `Template not found for section: ${input.section}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `## ${template.section}\n\n${template.description}\n\n\`\`\`\n${template.template}\n\`\`\``,
      },
    ],
  };
}

async function handleSDDReference(input) {
  const reference = knowledge.shared.sdd_framework[input.topic] || "Not found";

  return {
    content: [
      {
        type: "text",
        text: reference,
      },
    ],
  };
}

/**
 * Main server startup
 */
async function main() {
  // Load knowledge base
  knowledge = await loadKnowledgeBase();

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("SDD Agents Knowledge MCP server started");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
