/**
 * Load knowledge base from JSON files
 */

import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Knowledge base path - local to MCP server directory
const KNOWLEDGE_BASE_PATH = path.resolve(__dirname, "./knowledge");

/**
 * Load all knowledge from JSON files
 */
export async function loadKnowledgeBase() {
  try {
    const knowledge = {
      requirements: {
        patterns: await loadJSON("requirements/probing-patterns.json"),
        ears_translation: await loadJSON("requirements/ears-patterns.json"),
        gap_identification: await loadJSON(
          "requirements/gap-identification.json"
        ),
      },
      spec_breakdown: {
        heuristics: await loadJSON("spec-breakdown/heuristics.json"),
        dependency_patterns: await loadJSON(
          "spec-breakdown/dependency-patterns.json"
        ),
        effort_sizing: await loadJSON("spec-breakdown/effort-sizing.json"),
      },
      solutions_architect: {
        ears_translation: await loadJSON("architect/ears-translation.json"),
        traceability_patterns: await loadJSON("architect/traceability.json"),
        api_patterns: await loadJSON("architect/api-patterns.json"),
        templates: await loadJSON("architect/templates.json"),
      },
      shared: {
        sdd_framework: await loadJSON("shared/sdd-framework.json"),
        quality_standards: await loadJSON("shared/quality-standards.json"),
      },
    };

    console.error(`Loaded knowledge base from ${KNOWLEDGE_BASE_PATH}`);
    return knowledge;
  } catch (error) {
    console.error(
      "Error loading knowledge base:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

/**
 * Load a single JSON file
 */
async function loadJSON(filePath) {
  const fullPath = path.join(KNOWLEDGE_BASE_PATH, filePath);
  try {
    const content = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.warn(`Knowledge file not found: ${filePath} (path: ${fullPath})`);
      return {};
    }
    throw error;
  }
}
