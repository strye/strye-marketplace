---
description: Load and fill templates from templates-reference.md
allowed-tools: Read
---

# Template Loader Utility

Utility for loading artifact templates from `requirements/templates-reference.md` and filling them with data.

## Purpose

Provides functions to:
- Load epic templates
- Load feature templates (simple and complex)
- Load spec templates (index.md, design.md, tasks.md)
- Fill templates with user data
- Extract templates from the templates-reference.md file

## Template File Structure

Templates are stored in `requirements/templates-reference.md` with the following structure:

```markdown
## Epic Template
...template content...

## Feature Template (Simple)
...template content...

## Feature Template (Complex)
### index.md
...template content...

### user-stories.md
...template content...

## Spec Template (index.md - Requirements)
...template content...

## Spec Template (design.md)
...template content...

## Spec Template (tasks.md)
...template content...
```

## Functions

### loadEpicTemplate(): string

Loads the epic template from templates-reference.md.

**Implementation:**

```typescript
function loadEpicTemplate(): string {
  // Read the templates file
  const templatesFile = readFile('requirements/templates-reference.md');

  // Extract the epic template section
  // Look for "## Epic Template" and extract content until next "##"
  const epicPattern = /## Epic Template\n\n```markdown\n([\s\S]*?)\n```/;
  const match = templatesFile.match(epicPattern);

  if (!match) {
    throw new Error('Epic template not found in templates-reference.md');
  }

  return match[1];
}
```

**Manual Extraction:**

```typescript
function extractSection(content: string, startMarker: string, endMarker: string = '\n## '): string {
  const startIndex = content.indexOf(startMarker);
  if (startIndex === -1) {
    return '';
  }

  // Find the start of the actual template content (after the markdown code fence)
  const codeBlockStart = content.indexOf('```markdown\n', startIndex);
  if (codeBlockStart === -1) {
    return '';
  }

  const contentStart = codeBlockStart + '```markdown\n'.length;

  // Find the end of the code block
  const codeBlockEnd = content.indexOf('\n```', contentStart);
  if (codeBlockEnd === -1) {
    return '';
  }

  return content.substring(contentStart, codeBlockEnd);
}

function loadEpicTemplate(): string {
  const templatesFile = readFile('requirements/templates-reference.md');
  return extractSection(templatesFile, '## Epic Template');
}
```

**Usage Example:**

```typescript
const epicTemplate = loadEpicTemplate();
// Returns the full epic template with placeholders
```

---

### loadFeatureTemplate(complex: boolean = false): string | FeatureTemplates

Loads feature template (simple or complex).

**Implementation:**

```typescript
interface FeatureTemplates {
  index: string;
  userStories: string;
  acceptanceCriteria: string;
}

function loadFeatureTemplate(complex: boolean = false): string | FeatureTemplates {
  const templatesFile = readFile('requirements/templates-reference.md');

  if (!complex) {
    // Load simple feature template
    return extractSection(templatesFile, '## Feature Template (Simple)');
  } else {
    // Load complex feature templates (multiple files)
    const indexTemplate = extractSection(templatesFile, '### index.md', '\n### user-stories.md');
    const userStoriesTemplate = extractSection(templatesFile, '### user-stories.md', '\n### acceptance-criteria.md');
    const acceptanceCriteriaTemplate = extractSection(templatesFile, '### acceptance-criteria.md', '\n---');

    return {
      index: indexTemplate,
      userStories: userStoriesTemplate,
      acceptanceCriteria: acceptanceCriteriaTemplate
    };
  }
}
```

**Usage Example:**

```typescript
// Simple feature
const simpleTemplate = loadFeatureTemplate(false);

// Complex feature
const complexTemplates = loadFeatureTemplate(true);
console.log(complexTemplates.index);
console.log(complexTemplates.userStories);
console.log(complexTemplates.acceptanceCriteria);
```

---

### loadSpecTemplates(): SpecTemplates

Loads all three spec templates (index.md, design.md, tasks.md).

**Implementation:**

```typescript
interface SpecTemplates {
  index: string;      // Requirements
  design: string;     // Technical design
  tasks: string;      // Implementation tasks
}

function loadSpecTemplates(): SpecTemplates {
  const templatesFile = readFile('requirements/templates-reference.md');

  // Extract each template section
  const indexTemplate = extractSection(
    templatesFile,
    '## Spec Template (index.md - Requirements)',
    '\n## Spec Template (design.md)'
  );

  const designTemplate = extractSection(
    templatesFile,
    '## Spec Template (design.md)',
    '\n## Spec Template (tasks.md)'
  );

  const tasksTemplate = extractSection(
    templatesFile,
    '## Spec Template (tasks.md)',
    '\n## EARS Notation Guide'
  );

  return {
    index: indexTemplate,
    design: designTemplate,
    tasks: tasksTemplate
  };
}
```

**Usage Example:**

```typescript
const specTemplates = loadSpecTemplates();

// Write each template to its respective file
writeFile('requirements/specs/spec_001_f030-example/index.md', filledIndex);
writeFile('requirements/specs/spec_001_f030-example/design.md', filledDesign);
writeFile('requirements/specs/spec_001_f030-example/tasks.md', filledTasks);
```

---

### fillTemplate(template: string, data: Record<string, any>): string

Fills template placeholders with actual data.

**Implementation:**

```typescript
function fillTemplate(template: string, data: Record<string, any>): string {
  let filled = template;

  // Replace all placeholders in the format [PlaceholderName]
  for (const [key, value] of Object.entries(data)) {
    // Handle different placeholder formats
    const patterns = [
      new RegExp(`\\[${key}\\]`, 'g'),           // [key]
      new RegExp(`\\[${key}Here\\]`, 'g'),       // [keyHere]
      new RegExp(`\\[${toPascalCase(key)}\\]`, 'g') // [Key]
    ];

    for (const pattern of patterns) {
      filled = filled.replace(pattern, String(value));
    }
  }

  // Replace special placeholders
  filled = filled.replace(/\\[Date\\]/g, getCurrentDate());
  filled = filled.replace(/\\[YYYY-MM-DD\\]/g, getCurrentDate());

  return filled;
}

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

**Usage Example:**

```typescript
const epicTemplate = loadEpicTemplate();

const data = {
  id: "004",
  type: "epic",
  title: "Developer Experience",
  Epic: "Developer Experience",
  EpicTitle: "Developer Experience",
  tag1: "developer-experience",
  tag2: "tooling",
  // Date and YYYY-MM-DD are automatically filled
};

const filledTemplate = fillTemplate(epicTemplate, data);

// All placeholders like [id], [title], [Date] are replaced
```

---

### fillEpicTemplate(data: EpicData): string

Convenience function to fill an epic template with structured data.

**Implementation:**

```typescript
interface EpicData {
  id: string;
  title: string;
  vision: string;
  businessValue: string;
  successCriteria: string[];
  inScope: string[];
  outOfScope: string[];
  milestones?: Milestone[];
  stakeholders?: Stakeholder[];
  features?: string[];
  dependencies?: string[];
  risks?: Risk[];
  assumptions?: string[];
  tags: string[];
}

interface Milestone {
  name: string;
  targetDate: string;
  status: string;
}

interface Stakeholder {
  role: string;
  name: string;
  responsibility: string;
}

interface Risk {
  description: string;
  impact: string;
  mitigation: string;
}

function fillEpicTemplate(data: EpicData): string {
  const template = loadEpicTemplate();

  // Build success criteria list
  const successCriteriaList = data.successCriteria
    .map((criterion, i) => `- [ ] ${criterion}`)
    .join('\n');

  // Build in scope list
  const inScopeList = data.inScope.map(item => `- ${item}`).join('\n');

  // Build out of scope list
  const outOfScopeList = data.outOfScope.map(item => `- ${item}`).join('\n');

  // Build features list
  const featuresList = data.features?.length
    ? data.features.map(feature => `- ${feature}`).join('\n')
    : '- TBD';

  // Prepare replacement data
  const replacements = {
    id: data.id,
    type: 'epic',
    title: data.title,
    'Epic Title Here': data.title,
    '[Vision and business objectives]': data.vision,
    '[Business value explanation]': data.businessValue,
    '- [ ] Success criterion 1\n- [ ] Success criterion 2\n- [ ] Success criterion 3': successCriteriaList,
    '- Item 1\n- Item 2': inScopeList,
    tags: data.tags.map(tag => `  - ${tag}`).join('\n'),
    // Add more replacements as needed
  };

  return fillTemplate(template, replacements);
}
```

---

### fillFeatureTemplate(data: FeatureData, complex: boolean = false): string | FeatureTemplatesFilled

Convenience function to fill feature templates.

**Implementation:**

```typescript
interface FeatureData {
  id: string;
  epicId: string;
  title: string;
  description: string;
  userStories: UserStory[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  dependencies?: string[];
  tags: string[];
}

interface UserStory {
  title: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: string[];
}

interface FeatureTemplatesFilled {
  index: string;
  userStories: string;
  acceptanceCriteria: string;
}

function fillFeatureTemplate(
  data: FeatureData,
  complex: boolean = false
): string | FeatureTemplatesFilled {
  const template = loadFeatureTemplate(complex);

  // Build user stories section
  let userStoriesSection = '';
  for (const story of data.userStories) {
    userStoriesSection += `### Story: ${story.title}\n\n`;
    userStoriesSection += `**As a** ${story.asA}\n`;
    userStoriesSection += `**I want** ${story.iWantTo}\n`;
    userStoriesSection += `**So that** ${story.soThat}\n\n`;
    userStoriesSection += `**Acceptance Criteria:**\n`;
    for (const ac of story.acceptanceCriteria) {
      userStoriesSection += `- [ ] ${ac}\n`;
    }
    userStoriesSection += '\n';
  }

  // Build functional requirements list
  const frList = data.functionalRequirements.map(req => `- ${req}`).join('\n');

  // Build non-functional requirements list
  const nfrList = data.nonFunctionalRequirements.map(req => `- ${req}`).join('\n');

  const replacements = {
    id: data.id,
    type: 'feature',
    title: data.title,
    'Feature Title Here': data.title,
    parent: `epic_${data.epicId}-epic-name`,
    '[Description]': data.description,
    '[UserStories]': userStoriesSection,
    '[FunctionalRequirements]': frList,
    '[NonFunctionalRequirements]': nfrList,
  };

  if (!complex) {
    return fillTemplate(template as string, replacements);
  } else {
    const templates = template as FeatureTemplates;
    return {
      index: fillTemplate(templates.index, replacements),
      userStories: fillTemplate(templates.userStories, replacements),
      acceptanceCriteria: fillTemplate(templates.acceptanceCriteria, replacements),
    };
  }
}
```

---

### fillSpecTemplates(data: SpecData): SpecTemplatesFilled

Convenience function to fill all three spec templates.

**Implementation:**

```typescript
interface SpecData {
  id: string;
  featureId: string;
  title: string;
  overview: string;
  userStories: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  constraints?: string[];
  assumptions?: string[];
  dependencies?: string[];
  tags: string[];
}

interface SpecTemplatesFilled {
  index: string;
  design: string;
  tasks: string;
}

function fillSpecTemplates(data: SpecData): SpecTemplatesFilled {
  const templates = loadSpecTemplates();

  const replacements = {
    id: data.id,
    type: 'spec',
    title: data.title,
    'Spec Title Here': data.title,
    parent: `feat_${data.featureId}_e001-feature-name`,
    '[Overview]': data.overview,
  };

  return {
    index: fillTemplate(templates.index, replacements),
    design: fillTemplate(templates.design, replacements),
    tasks: fillTemplate(templates.tasks, replacements),
  };
}
```

---

## Usage in Commands

### Example: Creating an Epic

```typescript
// In /specid.epic command

// Step 1: Load template
const epicTemplate = loadEpicTemplate();

// Step 2: Gather data from user
const epicData: EpicData = {
  id: "004",
  title: "Developer Experience",
  vision: "Make plugin development faster and more intuitive",
  businessValue: "Reduce time to create plugins by 50%",
  successCriteria: [
    "Reduce time to create plugin by 50%",
    "Increase developer satisfaction score to 8+",
    "Zero setup issues reported"
  ],
  inScope: ["Better templates", "Validation", "Error messages"],
  outOfScope: ["GUI tools", "Visual editors"],
  tags: ["developer-experience", "tooling"]
};

// Step 3: Fill template
const filledTemplate = fillEpicTemplate(epicData);

// Step 4: Write to file
const filename = `epic_${epicData.id}-${toKebabCase(epicData.title)}.md`;
writeFile(`requirements/epics/${filename}`, filledTemplate);
```

### Example: Creating a Spec

```typescript
// In /specid.spec command

// Step 1: Load templates
const specTemplates = loadSpecTemplates();

// Step 2: Gather data
const specData: SpecData = {
  id: "001",
  featureId: "030",
  title: "Command Template System",
  overview: "Provides standard templates for creating commands",
  userStories: [
    "WHEN a developer creates a new command, THE SYSTEM SHALL provide a validated template"
  ],
  functionalRequirements: [
    "REQ-F-001: System SHALL provide command templates"
  ],
  nonFunctionalRequirements: [
    "REQ-NF-001: Templates SHALL be easily customizable"
  ],
  tags: ["template", "command"]
};

// Step 3: Fill templates
const filled = fillSpecTemplates(specData);

// Step 4: Create folder and write files
const folderName = `spec_${specData.id}_f${specData.featureId}-${toKebabCase(specData.title)}`;
const folderPath = `requirements/specs/${folderName}`;

createDirectory(folderPath);
writeFile(`${folderPath}/index.md`, filled.index);
writeFile(`${folderPath}/design.md`, filled.design);
writeFile(`${folderPath}/tasks.md`, filled.tasks);
```

---

## Dependencies

- **Read tool**: For reading templates-reference.md

---

## Helper Functions

```typescript
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createDirectory(path: string): void {
  // Use Bash: mkdir -p path
  bash(`mkdir -p "${path}"`);
}
```

---

## Type Definitions

```typescript
interface FeatureTemplates {
  index: string;
  userStories: string;
  acceptanceCriteria: string;
}

interface SpecTemplates {
  index: string;
  design: string;
  tasks: string;
}

// (Other interfaces defined above)
```

---

## Notes

- Templates are extracted from requirements/templates-reference.md using section markers
- Placeholder format: `[PlaceholderName]`
- Special placeholders like `[Date]` and `[YYYY-MM-DD]` are auto-filled
- Template filling is case-sensitive for placeholders
- Always validate filled templates before writing to files
- If templates-reference.md is not found, commands should provide inline fallback templates
