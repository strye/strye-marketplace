# /specid.epic - Create or Refine Epic

You are executing the `/specid.epic` command to create or refine an Epic document. Epics are **optional** - smaller projects may not need them.

## Command Arguments

- **name**: Epic identifier (e.g., "EPIC-001" or "user-management") (optional for create)
- **text**: Epic description or refinement instructions (optional)

## Command Purpose

Epics represent large strategic initiatives spanning multiple features. They are optional for:
- Small projects where the entire project is effectively one epic
- Single-feature projects
- Proof-of-concepts or prototypes

Use epics when:
- You have multiple related features that form a cohesive initiative
- You need to track business value at a higher level than individual features
- You want to communicate strategic roadmap to stakeholders

## Execution Steps

### Step 1: Determine Operation Mode

```typescript
const epicName = args.name;
const epicText = args.text || '';

// Check if user wants to create or refine
if (epicName && fileExists(`docs/planning/epics/${epicName}.md`)) {
  console.log('📝 Refining existing epic...');
  return refineEpic(epicName, epicText);
} else if (epicName && epicName.match(/^EPIC-\d+$/)) {
  console.log('📝 Creating new epic with specified ID...');
  return createEpic(epicName, epicText);
} else {
  console.log('📝 Creating new epic...');
  return createEpic(null, epicText);
}
```

## Create Epic Flow

### Step 1: Gather Information

Ask the user structured questions:

```typescript
console.log('Let\'s create a new epic. I\'ll ask a few questions to understand the scope.\n');

const epicInfo = {
  title: ask('[1] What is the name/title of this epic?'),
  problem: ask('[2] What problem does this epic solve?'),
  businessValue: ask('[3] What is the business value? Why is this important?'),
  features: ask('[4] What are the main features or capabilities needed? (List 3-5)'),
  priority: askChoice(
    '[5] What is the priority level?',
    ['Critical', 'Important', 'Necessary', 'Nice to have']
  ),
  considerations: ask('[6] Are there any dependencies, risks or milestones to consider?')
};

console.log('');
```

### Step 2: Determine Epic Number

```typescript
console.log('Determining epic number...');

// Check for existing epics
const epicsDir = 'docs/planning/epics';
let epicNumber = 1;

if (dirExists(epicsDir)) {
  const epicFiles = listFiles(epicsDir, '*.md');
  const epicNumbers = epicFiles
    .filter(f => f.match(/EPIC-(\d+)/))
    .map(f => parseInt(f.match(/EPIC-(\d+)/)[1]))
    .sort((a, b) => b - a);

  if (epicNumbers.length > 0) {
    epicNumber = epicNumbers[0] + 1;
  }
} else {
  // Create directory structure
  createDir(epicsDir);
  console.log('✓ Created docs/planning/epics/ directory');
}

const epicId = `EPIC-${String(epicNumber).padStart(3, '0')}`;
const epicSlug = epicInfo.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const epicFileName = `${epicId}-${epicSlug}.md`;
const epicPath = `${epicsDir}/${epicFileName}`;

console.log(`✓ Epic ID: ${epicId}`);
console.log('');
```

### Step 3: Load Template

```typescript
const templatePath = '.spec/templates/epic-template.md';
let template = '';

if (fileExists(templatePath)) {
  template = readFile(templatePath);
  console.log(`✓ Loaded template from ${templatePath}`);
} else {
  template = getInlineEpicTemplate();
  console.log('⚠️  Using inline default template');
  console.log(`   (Create ${templatePath} to customize)`);
}

console.log('');
```

### Step 4: Generate Epic Content

```typescript
// Parse features list
const featuresList = epicInfo.features
  .split(/[,\n]/)
  .map(f => f.trim())
  .filter(f => f.length > 0);

// Build features table
let featuresTable = '| Feature | Status | Specs | Priority |\n';
featuresTable += '|---------|--------|-------|----------|\n';
for (const feature of featuresList) {
  featuresTable += `| ${feature} | Draft | - | TBD |\n`;
}

// Fill template
const epicContent = template
  .replace(/\[EPIC-ID\]/g, epicId)
  .replace(/\[EPIC-TITLE\]/g, epicInfo.title)
  .replace(/\[DATE\]/g, new Date().toISOString().split('T')[0])
  .replace(/\[PRIORITY\]/g, ['Critical', 'Important', 'Necessary', 'Nice to have'][epicInfo.priority])
  .replace(/\[PROBLEM-STATEMENT\]/g, epicInfo.problem)
  .replace(/\[BUSINESS-VALUE\]/g, epicInfo.businessValue)
  .replace(/\[FEATURES-TABLE\]/g, featuresTable)
  .replace(/\[DEPENDENCIES-RISKS\]/g, epicInfo.considerations || 'None identified yet.');

console.log('✓ Generated epic content');
console.log('');
```

### Step 5: Confirm and Write

```typescript
const confirmationMode = askChoice(
  'Would you like to review the epic before it\'s written?',
  ['Yes - show me for confirmation', 'No - proceed automatically']
) === 0;

console.log('');

if (confirmationMode) {
  console.log('═══════════════════════════════════════');
  console.log('Epic Preview');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(epicContent);
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('');

  const approved = askYesNo('Write this epic?');
  if (!approved) {
    console.log('⚠️  Cancelled - epic not written');
    return;
  }
  console.log('');
}

// Write epic file
writeFile(epicPath, epicContent);
console.log(`✓ Created ${epicPath}`);
console.log('');
```

### Step 6: Display Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Epic Created Successfully');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Epic ID: ${epicId}`);
console.log(`Title: ${epicInfo.title}`);
console.log(`Priority: ${['Critical', 'Important', 'Necessary', 'Nice to have'][epicInfo.priority]}`);
console.log(`Location: ${epicPath}`);
console.log('');
console.log(`Features to implement: ${featuresList.length}`);
console.log('');
```

### Step 7: STOP EXECUTION

```typescript
// Command execution STOPS here
```

### Step 8: Offer Next Step

```typescript
console.log('───────────────────────────────────────');
console.log('Next Steps (Optional)');
console.log('───────────────────────────────────────');
console.log('');
console.log('Your epic is ready! You can now:');
console.log('');
console.log(`1. Create features under this epic:`);
console.log(`   /specid.feature --epic ${epicId}`);
console.log('');
console.log('2. Create features without an epic (for smaller projects):');
console.log('   /specid.feature [feature-name] "[description]"');
console.log('');

const createFeature = askYesNo('Would you like to create the first feature now?');

if (createFeature) {
  const withEpic = askYesNo(`Link it to ${epicId}?`);

  console.log('');
  if (withEpic) {
    console.log(`Running: /specid.feature --epic ${epicId}`);
    executeCommand(`/specid.feature --epic ${epicId}`);
  } else {
    console.log('Running: /specid.feature');
    executeCommand('/specid.feature');
  }
} else {
  console.log('');
  console.log('No problem! Create features when you\'re ready.');
  console.log('');
}
```

## Refine Epic Flow

### Step 1: Load Existing Epic

```typescript
function refineEpic(epicName: string, refinementText: string) {
  console.log(`Loading epic: ${epicName}...`);

  const epicPath = `docs/planning/epics/${epicName}.md`;
  const epicContent = readFile(epicPath);

  console.log('✓ Epic loaded');
  console.log('');
}
```

### Step 2: Review Current State

```typescript
// Extract key information
const titleMatch = epicContent.match(/^# (.+)$/m);
const statusMatch = epicContent.match(/\*\*Status\*\*: (.+)$/m);
const priorityMatch = epicContent.match(/\*\*Priority\*\*: (.+)$/m);

console.log('Current Epic:');
console.log(`  Title: ${titleMatch ? titleMatch[1] : 'Unknown'}`);
console.log(`  Status: ${statusMatch ? statusMatch[1] : 'Unknown'}`);
console.log(`  Priority: ${priorityMatch ? priorityMatch[1] : 'Unknown'}`);
console.log('');

// Count features
const featureRows = epicContent.match(/^\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|$/gm);
const featureCount = featureRows ? featureRows.length - 1 : 0; // Subtract header
console.log(`  Features: ${featureCount}`);
console.log('');
```

### Step 3: Gather Refinements

```typescript
// If refinement text provided, use it as guidance
if (refinementText) {
  console.log('Refinement guidance:', refinementText);
  console.log('');
}

const refinementArea = askChoice(
  'What would you like to refine?',
  [
    'Overview/business value',
    'Features list (add/remove/reprioritize)',
    'Dependencies/risks',
    'Status and priority',
    'Multiple areas'
  ]
);

console.log('');

let updates: Record<string, string> = {};

switch (refinementArea) {
  case 0: // Overview
    updates.overview = ask('Enter the updated overview/business value:');
    break;

  case 1: // Features
    console.log('Current features:');
    // Show current features
    const currentFeatures = extractFeaturesFromTable(epicContent);
    currentFeatures.forEach((f, i) => console.log(`  ${i + 1}. ${f.name} (${f.status})`));
    console.log('');

    const featureAction = askChoice(
      'What would you like to do?',
      ['Add new feature', 'Update existing feature', 'Remove feature']
    );

    // Handle feature updates...
    break;

  case 2: // Dependencies/risks
    updates.dependencies = ask('Enter updated dependencies, risks, or milestones:');
    break;

  case 3: // Status/priority
    const newStatus = askChoice(
      'Select new status:',
      ['Draft', 'In Progress', 'Blocked', 'Done']
    );
    const newPriority = askChoice(
      'Select new priority:',
      ['Critical', 'Important', 'Necessary', 'Nice to have']
    );
    updates.status = ['Draft', 'In Progress', 'Blocked', 'Done'][newStatus];
    updates.priority = ['Critical', 'Important', 'Necessary', 'Nice to have'][newPriority];
    break;

  case 4: // Multiple
    console.log('Let\'s go through each section...');
    // Ask about each area
    break;
}

console.log('');
```

### Step 4: Apply Changes

```typescript
let updatedContent = epicContent;

// Update sections based on refinements
if (updates.overview) {
  updatedContent = updatedContent.replace(
    /## Overview\n\n[\s\S]+?(?=\n##)/,
    `## Overview\n\n${updates.overview}\n`
  );
}

if (updates.status) {
  updatedContent = updatedContent.replace(
    /\*\*Status\*\*: .+/,
    `**Status**: ${updates.status}`
  );
}

if (updates.priority) {
  updatedContent = updatedContent.replace(
    /\*\*Priority\*\*: .+/,
    `**Priority**: ${updates.priority}`
  );
}

if (updates.dependencies) {
  updatedContent = updatedContent.replace(
    /## Dependencies, Risks & Milestones\n\n[\s\S]+?(?=\n##|$)/,
    `## Dependencies, Risks & Milestones\n\n${updates.dependencies}\n`
  );
}

// Update "Last Updated" date
updatedContent = updatedContent.replace(
  /\*\*Last Updated\*\*: .+/,
  `**Last Updated**: ${new Date().toISOString().split('T')[0]}`
);

console.log('✓ Applied changes');
console.log('');
```

### Step 5: Write Updated Epic

```typescript
writeFile(epicPath, updatedContent);
console.log(`✓ Updated ${epicPath}`);
console.log('');

console.log('═══════════════════════════════════════');
console.log('✓ Epic Refined Successfully');
console.log('═══════════════════════════════════════');
console.log('');
console.log('Changes made:');
for (const [key, value] of Object.entries(updates)) {
  console.log(`  - Updated ${key}`);
}
console.log('');
```

## Helper Functions

### Get Inline Epic Template

```typescript
function getInlineEpicTemplate(): string {
  return `# [EPIC-TITLE]

**Epic ID**: [EPIC-ID]
**Created**: [DATE]
**Last Updated**: [DATE]
**Status**: Draft
**Priority**: [PRIORITY]

## Overview

[PROBLEM-STATEMENT]

## Business Value

[BUSINESS-VALUE]

## Features

[FEATURES-TABLE]

## Dependencies, Risks & Milestones

[DEPENDENCIES-RISKS]

## Success Criteria

- [ ] All features completed
- [ ] Business value metrics achieved
- [ ] Stakeholder acceptance

## Notes

_This epic was created using /specid.epic_
`;
}
```

### Extract Features from Table

```typescript
function extractFeaturesFromTable(content: string): Feature[] {
  const features: Feature[] = [];
  const tableMatch = content.match(/\| Feature \|[\s\S]+?(?=\n\n|$)/);

  if (!tableMatch) return features;

  const rows = tableMatch[0].split('\n').slice(2); // Skip header and separator

  for (const row of rows) {
    const cells = row.split('|').map(c => c.trim()).filter(c => c.length > 0);
    if (cells.length >= 4) {
      features.push({
        name: cells[0],
        status: cells[1],
        specs: cells[2],
        priority: cells[3]
      });
    }
  }

  return features;
}
```

## Type Definitions

```typescript
interface Feature {
  name: string;
  status: string;
  specs: string;
  priority: string;
}

interface EpicInfo {
  title: string;
  problem: string;
  businessValue: string;
  features: string;
  priority: number;
  considerations: string;
}
```

## Epic Template Structure

Epics should follow this structure:

```markdown
# Epic Title

**Epic ID**: EPIC-001
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD
**Status**: Draft | In Progress | Blocked | Done
**Priority**: Critical | Important | Necessary | Nice to have

## Overview
What problem does this solve? Context and background.

## Business Value
Why is this important? What value does it deliver?

## Features
| Feature | Status | Specs | Priority |
|---------|--------|-------|----------|
| Feature 1 | Draft | - | High |
| Feature 2 | In Progress | FEAT-001 | High |

## Dependencies, Risks & Milestones
Any dependencies, risks, or key milestones.

## Success Criteria
- [ ] Measurable success criteria
- [ ] Business metrics

## Notes
Additional context, decisions, or learnings.
```

## Requirements Satisfied

- ✅ Creates epics with sequential numbering (EPIC-001, EPIC-002)
- ✅ Epics are optional - can create features without epics
- ✅ Supports both create and refine operations
- ✅ Loads templates from .spec/templates/epic-template.md
- ✅ Structured question flow with numbered options
- ✅ Confirmation mode for review before writing
- ✅ STOP after completion, offers optional next step
- ✅ Integrates with feature creation workflow
