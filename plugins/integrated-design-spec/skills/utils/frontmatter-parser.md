---
description: Parse and manipulate YAML frontmatter in markdown files
allowed-tools: Read, Write
---

# Frontmatter Parser Utility

Utility for parsing, validating, and updating YAML frontmatter in epic, feature, and spec markdown files.

## Purpose

Provides functions to:
- Extract frontmatter and body from markdown files
- Validate frontmatter structure and required fields
- Update specific frontmatter fields
- Add children to parent artifacts
- Convert frontmatter back to YAML format
- Preserve formatting during updates

## Functions

### parse(content: string): ParsedDocument

Extracts YAML frontmatter and body content from a markdown file.

**Implementation:**

```typescript
interface ParsedDocument {
  frontmatter: Record<string, any>;
  body: string;
  raw: string;
}

function parse(content: string): ParsedDocument {
  // Match YAML frontmatter pattern: ---\n...content...\n---
  const frontmatterPattern = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterPattern);

  if (!match) {
    // No frontmatter found
    return {
      frontmatter: {},
      body: content,
      raw: content
    };
  }

  const yamlContent = match[1];
  const body = match[2];

  // Parse YAML (simplified pseudocode - actual implementation uses YAML parser)
  const frontmatter = parseYAML(yamlContent);

  return {
    frontmatter: frontmatter,
    body: body,
    raw: content
  };
}
```

**Manual Parsing Pattern (without YAML library):**

For simple frontmatter, you can parse line-by-line:

```typescript
function parseYAMLSimple(yamlContent: string): Record<string, any> {
  const lines = yamlContent.split('\n');
  const result: Record<string, any> = {};
  let currentKey = '';
  let currentArray: string[] = [];
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Array item: starts with "  - " or "- "
    if (trimmed.startsWith('- ')) {
      if (inArray) {
        currentArray.push(trimmed.substring(2));
      }
      continue;
    }

    // End of array, commit it
    if (inArray && !trimmed.startsWith('-')) {
      result[currentKey] = currentArray;
      currentArray = [];
      inArray = false;
    }

    // Key-value pair: "key: value"
    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (value === '') {
        // Empty value, might be start of array
        currentKey = key;
        currentArray = [];
        inArray = true;
      } else {
        // Simple key-value
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        result[key] = cleanValue;
      }
    }
  }

  // Commit final array if any
  if (inArray) {
    result[currentKey] = currentArray;
  }

  return result;
}
```

**Usage Example:**

```typescript
const fileContent = readFile('requirements/epics/epic_001-example.md');
const parsed = parse(fileContent);

console.log(parsed.frontmatter.id);        // "001"
console.log(parsed.frontmatter.title);     // "Example Epic"
console.log(parsed.frontmatter.children);  // ["feat_001_e001-feature-a"]
console.log(parsed.body);                  // Markdown content after frontmatter
```

**Error Handling:**
- If YAML is malformed, return empty frontmatter
- If no frontmatter delimiter found, treat entire content as body
- Preserve original content in `.raw` field

---

### stringify(frontmatter: Record<string, any>, body: string): string

Converts frontmatter object and body back to markdown format.

**Implementation:**

```typescript
function stringify(frontmatter: Record<string, any>, body: string): string {
  // Convert frontmatter to YAML
  const yamlLines: string[] = [];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      // Array format
      yamlLines.push(`${key}:`);
      if (value.length === 0) {
        yamlLines.push('  []');
      } else {
        for (const item of value) {
          yamlLines.push(`  - ${item}`);
        }
      }
    } else {
      // Simple value
      const quotedValue = typeof value === 'string' && value.includes(':')
        ? `"${value}"`
        : value;
      yamlLines.push(`${key}: ${quotedValue}`);
    }
  }

  const yamlContent = yamlLines.join('\n');

  // Combine with body
  const fullContent = `---\n${yamlContent}\n---\n${body}`;

  return fullContent;
}
```

**Usage Example:**

```typescript
const frontmatter = {
  id: "001",
  type: "epic",
  title: "Example Epic",
  status: "planning",
  created: "2026-02-02",
  updated: "2026-02-02",
  children: ["feat_001_e001-feature-a"],
  tags: ["example", "test"]
};

const body = "# Epic: Example Epic\n\nContent here...";

const markdown = stringify(frontmatter, body);
// Result:
// ---
// id: "001"
// type: epic
// title: Example Epic
// status: planning
// created: 2026-02-02
// updated: 2026-02-02
// children:
//   - feat_001_e001-feature-a
// tags:
//   - example
//   - test
// ---
// # Epic: Example Epic
//
// Content here...
```

---

### validate(frontmatter: Record<string, any>, type: 'epic' | 'feature' | 'spec'): ValidationResult

Validates frontmatter has all required fields for the artifact type.

**Implementation:**

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validate(
  frontmatter: Record<string, any>,
  type: 'epic' | 'feature' | 'spec'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Common required fields for all types
  const commonFields = ['id', 'type', 'title', 'status', 'created', 'updated', 'tags'];

  for (const field of commonFields) {
    if (!(field in frontmatter)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate type matches expected
  if (frontmatter.type !== type) {
    errors.push(`Type mismatch: expected '${type}', found '${frontmatter.type}'`);
  }

  // Validate status enum
  const validStatuses = ['planning', 'ready', 'active', 'completed', 'deprecated'];
  if (frontmatter.status && !validStatuses.includes(frontmatter.status)) {
    errors.push(`Invalid status: '${frontmatter.status}'. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (frontmatter.created && !datePattern.test(frontmatter.created)) {
    errors.push(`Invalid created date format: '${frontmatter.created}'. Expected YYYY-MM-DD`);
  }
  if (frontmatter.updated && !datePattern.test(frontmatter.updated)) {
    errors.push(`Invalid updated date format: '${frontmatter.updated}'. Expected YYYY-MM-DD`);
  }

  // Validate ID format (3-digit zero-padded)
  const idPattern = /^\d{3}$/;
  if (frontmatter.id && !idPattern.test(frontmatter.id)) {
    errors.push(`Invalid ID format: '${frontmatter.id}'. Expected 3-digit zero-padded (001, 002, etc.)`);
  }

  // Type-specific validation
  if (type === 'feature' || type === 'spec') {
    // Features and specs require parent field
    if (!('parent' in frontmatter)) {
      errors.push(`Missing required field for ${type}: parent`);
    }
  }

  // Validate children is an array
  if ('children' in frontmatter) {
    if (!Array.isArray(frontmatter.children)) {
      errors.push('Children field must be an array');
    }
  } else {
    // Children field is optional but recommended for epics and features
    if (type === 'epic' || type === 'feature') {
      warnings.push(`Missing 'children' field (optional but recommended)`);
    }
  }

  // Validate tags is an array
  if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
    errors.push('Tags field must be an array');
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings
  };
}
```

**Usage Example:**

```typescript
const parsed = parse(readFile('requirements/epics/epic_001-example.md'));
const validation = validate(parsed.frontmatter, 'epic');

if (!validation.valid) {
  console.log('Validation errors:');
  for (const error of validation.errors) {
    console.log(`  ❌ ${error}`);
  }
}

if (validation.warnings.length > 0) {
  console.log('Validation warnings:');
  for (const warning of validation.warnings) {
    console.log(`  ⚠️  ${warning}`);
  }
}
```

---

### updateField(content: string, field: string, value: any): string

Updates a single frontmatter field while preserving the rest of the file.

**Implementation:**

```typescript
function updateField(content: string, field: string, value: any): string {
  // Parse the document
  const parsed = parse(content);

  // Update the field
  parsed.frontmatter[field] = value;

  // Automatically update the 'updated' date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  parsed.frontmatter.updated = today;

  // Stringify and return
  return stringify(parsed.frontmatter, parsed.body);
}
```

**Usage Example:**

```typescript
// Update status to "active"
const originalContent = readFile('requirements/epics/epic_001-example.md');
const updatedContent = updateField(originalContent, 'status', 'active');
writeFile('requirements/epics/epic_001-example.md', updatedContent);

// Updated field is now "active" and "updated" date is set to today
```

---

### addChild(content: string, childId: string): string

Adds a child ID to the frontmatter children array.

**Implementation:**

```typescript
function addChild(content: string, childId: string): string {
  // Parse the document
  const parsed = parse(content);

  // Initialize children array if it doesn't exist
  if (!('children' in parsed.frontmatter) || !Array.isArray(parsed.frontmatter.children)) {
    parsed.frontmatter.children = [];
  }

  // Check if child already exists
  if (parsed.frontmatter.children.includes(childId)) {
    console.log(`Child '${childId}' already exists in children array`);
    return content; // No change needed
  }

  // Add child
  parsed.frontmatter.children.push(childId);

  // Update the 'updated' date
  const today = new Date().toISOString().split('T')[0];
  parsed.frontmatter.updated = today;

  // Stringify and return
  return stringify(parsed.frontmatter, parsed.body);
}
```

**Usage Example:**

```typescript
// Add a feature to an epic's children
const epicContent = readFile('requirements/epics/epic_001-example.md');
const updatedEpic = addChild(epicContent, 'feat_030_e001-new-feature');
writeFile('requirements/epics/epic_001-example.md', updatedEpic);
```

---

### removeChild(content: string, childId: string): string

Removes a child ID from the frontmatter children array.

**Implementation:**

```typescript
function removeChild(content: string, childId: string): string {
  // Parse the document
  const parsed = parse(content);

  // Check if children exists
  if (!('children' in parsed.frontmatter) || !Array.isArray(parsed.frontmatter.children)) {
    console.log('No children array found');
    return content;
  }

  // Filter out the child
  const originalLength = parsed.frontmatter.children.length;
  parsed.frontmatter.children = parsed.frontmatter.children.filter(
    (child: string) => child !== childId
  );

  if (parsed.frontmatter.children.length === originalLength) {
    console.log(`Child '${childId}' not found in children array`);
    return content;
  }

  // Update the 'updated' date
  const today = new Date().toISOString().split('T')[0];
  parsed.frontmatter.updated = today;

  // Stringify and return
  return stringify(parsed.frontmatter, parsed.body);
}
```

---

### updateMultipleFields(content: string, updates: Record<string, any>): string

Updates multiple frontmatter fields at once.

**Implementation:**

```typescript
function updateMultipleFields(content: string, updates: Record<string, any>): string {
  // Parse the document
  const parsed = parse(content);

  // Apply all updates
  for (const [field, value] of Object.entries(updates)) {
    parsed.frontmatter[field] = value;
  }

  // Automatically update the 'updated' date
  const today = new Date().toISOString().split('T')[0];
  parsed.frontmatter.updated = today;

  // Stringify and return
  return stringify(parsed.frontmatter, parsed.body);
}
```

**Usage Example:**

```typescript
const content = readFile('requirements/features/feat_001_e001-example.md');
const updated = updateMultipleFields(content, {
  status: 'active',
  tags: ['feature', 'priority-high']
});
writeFile('requirements/features/feat_001_e001-example.md', updated);
```

---

## Usage in Commands

### Example: Creating a New Epic with Frontmatter

```typescript
// In /specid.epic command

// Prepare frontmatter
const frontmatter = {
  id: "004",
  type: "epic",
  title: "Developer Experience",
  status: "planning",
  created: "2026-02-02",
  updated: "2026-02-02",
  children: [],
  tags: ["developer-experience", "tooling"]
};

// Prepare body content
const body = `# Epic: Developer Experience

## Vision
...
`;

// Generate full markdown
const markdownContent = stringify(frontmatter, body);

// Write to file
writeFile('requirements/epics/epic_004-developer-experience.md', markdownContent);
```

### Example: Updating Epic Status

```typescript
// In /specid.status command

// Read existing file
const epicPath = 'requirements/epics/epic_004-developer-experience.md';
const content = readFile(epicPath);

// Update status
const updatedContent = updateField(content, 'status', 'active');

// Write back
writeFile(epicPath, updatedContent);
```

### Example: Linking Feature to Epic

```typescript
// In /specid.link command

// Read parent epic
const epicPath = 'requirements/epics/epic_004-developer-experience.md';
const epicContent = readFile(epicPath);

// Add child feature
const updatedEpic = addChild(epicContent, 'feat_030_e004-command-templates');

// Write back
writeFile(epicPath, updatedEpic);
```

---

## Dependencies

- **Read tool**: For reading markdown files
- **Write tool**: For writing updated files

---

## Type Definitions

```typescript
interface ParsedDocument {
  frontmatter: Record<string, any>;
  body: string;
  raw: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

---

## Validation Rules Summary

### Required Fields by Type

**Epic:**
- id, type, title, status, created, updated, tags
- children (optional but recommended)

**Feature:**
- id, type, title, status, created, updated, parent, tags
- children (optional but recommended)

**Spec:**
- id, type, title, status, created, updated, parent, tags

### Field Format Rules

- **id**: 3-digit zero-padded (001, 002, etc.)
- **type**: Must match artifact type ('epic', 'feature', or 'spec')
- **status**: Must be one of: planning, ready, active, completed, deprecated
- **created/updated**: Must be YYYY-MM-DD format
- **children**: Must be array of strings
- **tags**: Must be array of strings
- **parent**: Must be valid artifact ID (required for features and specs)

---

## Notes

- Frontmatter updates automatically set the `updated` date to today
- YAML parsing is simplified; consider using a proper YAML library for production
- Preserve original formatting where possible
- Always validate frontmatter after parsing from user files
- Handle edge cases like missing frontmatter, malformed YAML, etc.
