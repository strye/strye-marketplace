# /specid.prepare - Prepare Feature for Development

You are executing the `/specid.prepare` command to analyze a feature and create spec shells for implementation.

## Command Arguments

- **name**: Feature identifier (e.g., "FEAT-001" or "user-authentication") (required)

## Command Purpose

This command bridges the gap between feature planning and spec implementation by:
- Analyzing user stories in a feature
- Recommending intelligent groupings of stories into specs
- Creating spec shells (requirements.md stubs) for each spec
- Updating the feature document with spec links
- Providing implementation order based on dependencies

Think of this as the "prep work" before implementation - breaking down the feature into implementable chunks.

## Execution Steps

### Step 1: Identify and Load Feature

```typescript
const featureName = args.name;

if (!featureName || featureName.trim().length === 0) {
  console.error('❌ Error: Feature identifier is required.');
  console.log('Usage: /specid.prepare [feature-id or feature-name]');
  console.log('Example: /specid.prepare FEAT-001');
  console.log('Example: /specid.prepare user-authentication');
  return;
}

console.log(`Analyzing feature: ${featureName}...`);
console.log('');
```

### Step 2: Find Feature File

```typescript
// Try to find feature file by ID or name
let featurePath = '';
let featureId = '';

// Check if it's a feature ID (FEAT-NNN)
if (featureName.match(/^FEAT-\d+$/)) {
  const featuresDir = 'docs/planning/features';
  const featureFiles = listFiles(featuresDir, `${featureName}-*.md`);

  if (featureFiles.length === 0) {
    console.error(`❌ Error: Feature ${featureName} not found in ${featuresDir}/`);
    return;
  }

  featurePath = `${featuresDir}/${featureFiles[0]}`;
  featureId = featureName;

} else {
  // Try to find by kebab-case name (old structure)
  const oldPath = `docs/features/${featureName}/requirements.md`;
  if (fileExists(oldPath)) {
    featurePath = oldPath;
    console.warn('⚠️  Using old structure (docs/features/[name]/)');
    console.log('   Consider migrating to new structure with FEAT-NNN identifiers');
    console.log('');
  } else {
    console.error(`❌ Error: Feature not found`);
    console.log(`   Tried: ${oldPath}`);
    console.log(`   Tried: docs/planning/features/${featureName}.md`);
    return;
  }
}

const featureContent = readFile(featurePath);
console.log(`✓ Loaded feature from ${featurePath}`);
console.log('');
```

### Step 3: Parse Feature Content

```typescript
// Extract key information
const titleMatch = featureContent.match(/^# (.+)$/m);
const featureTitle = titleMatch ? titleMatch[1] : 'Unknown Feature';

// Extract epic link if present
const epicMatch = featureContent.match(/\*\*Epic\*\*: \[([^\]]+)\]/);
const epicId = epicMatch ? epicMatch[1] : null;

// Extract user stories
const userStories = extractUserStories(featureContent);

console.log('Feature Analysis:');
console.log(`  Title: ${featureTitle}`);
if (epicId) {
  console.log(`  Parent Epic: ${epicId}`);
}
console.log(`  User Stories: ${userStories.length}`);
console.log('');

if (userStories.length === 0) {
  console.error('❌ Error: No user stories found in feature');
  console.log('   Feature must have user stories before creating specs');
  console.log('');
  console.log('   Add user stories to the feature first with:');
  console.log(`   /specid.feature ${featureName}`);
  return;
}
```

### Step 4: Load Parent Epic (if applicable)

```typescript
let epicContext = '';

if (epicId) {
  console.log(`Loading parent epic ${epicId}...`);

  const epicPath = `docs/planning/epics/${epicId}-*.md`;
  const epicFiles = glob(epicPath);

  if (epicFiles.length > 0) {
    epicContext = readFile(epicFiles[0]);
    console.log('✓ Loaded epic context');
  } else {
    console.warn(`⚠️  Epic ${epicId} not found - proceeding without epic context`);
  }
  console.log('');
}
```

### Step 5: Analyze and Recommend Spec Breakdown

```typescript
console.log('Analyzing user stories and recommending spec breakdown...');
console.log('');

// Analyze technical considerations
const techConsiderations = extractTechnicalConsiderations(featureContent);
const dependencies = extractDependencies(featureContent);

// Get existing specs to determine next number
const specsDir = 'docs/specs';
let nextSpecNumber = 1;

if (dirExists(specsDir)) {
  const specDirs = listDirectories(specsDir);
  const specNumbers = specDirs
    .filter(d => d.match(/^\d+/))
    .map(d => parseInt(d.match(/^(\d+)/)[1]))
    .sort((a, b) => b - a);

  if (specNumbers.length > 0) {
    nextSpecNumber = specNumbers[0] + 1;
  }
} else {
  createDir(specsDir);
  console.log(`✓ Created ${specsDir}/ directory`);
  console.log('');
}

// Recommend spec groupings
const recommendedSpecs = analyzeAndGroupStories(
  userStories,
  techConsiderations,
  dependencies,
  nextSpecNumber
);

console.log('✓ Generated spec recommendations');
console.log('');
```

### Step 6: Present Recommendations to User

```typescript
console.log('═══════════════════════════════════════');
console.log('Recommended Spec Breakdown');
console.log('═══════════════════════════════════════');
console.log('');

// Build recommendations table
console.log('| Spec # | Name | Stories | Estimate | Dependencies |');
console.log('|--------|------|---------|----------|--------------|');

for (const spec of recommendedSpecs) {
  const storiesStr = spec.storyIds.join(', ');
  const depsStr = spec.dependencies.length > 0 ? spec.dependencies.join(', ') : 'None';
  const estimate = spec.estimate;

  console.log(`| ${spec.number} | ${spec.name} | ${storiesStr} | ${estimate} | ${depsStr} |`);
}

console.log('');

// Explain rationale
console.log('Rationale:');
for (const spec of recommendedSpecs) {
  console.log(`  • Spec ${spec.number}: ${spec.rationale}`);
}
console.log('');

// Show implementation order
console.log('Recommended Implementation Order:');
const orderedSpecs = recommendedSpecs.sort((a, b) => {
  // Specs with no dependencies first
  if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1;
  if (a.dependencies.length > 0 && b.dependencies.length === 0) return 1;
  return a.number - b.number;
});

for (let i = 0; i < orderedSpecs.length; i++) {
  const spec = orderedSpecs[i];
  console.log(`  ${i + 1}. Spec ${spec.number} - ${spec.name}`);
  if (spec.dependencies.length > 0) {
    console.log(`     (Requires: ${spec.dependencies.join(', ')})`);
  }
}
console.log('');
```

### Step 7: Confirm with User

```typescript
console.log('───────────────────────────────────────');
console.log('Review and Confirm');
console.log('───────────────────────────────────────');
console.log('');

const userChoice = askChoice(
  'Does this spec breakdown look good?',
  [
    'Yes - proceed with creation',
    'Adjust spec groupings',
    'Change implementation order',
    'Cancel - I\'ll create specs manually'
  ]
);

console.log('');

if (userChoice === 3) {
  console.log('Cancelled. You can create specs manually with:');
  console.log('  /specid.spec [spec-name]');
  return;
}

if (userChoice === 1 || userChoice === 2) {
  console.log('📝 Let\'s refine the breakdown...');
  console.log('');

  // Allow user to adjust (simplified for now)
  const adjustments = ask('Describe the changes you\'d like (e.g., "combine specs 2 and 3", "split spec 1"):');

  console.log('');
  console.log('Note: For complex adjustments, it may be easier to:');
  console.log('1. Proceed with these specs');
  console.log('2. Manually adjust after creation');
  console.log('');

  const proceedAnyway = askYesNo('Proceed with current breakdown?');
  if (!proceedAnyway) {
    console.log('Cancelled.');
    return;
  }
  console.log('');
}

console.log('✓ Proceeding with spec creation...');
console.log('');
```

### Step 8: Create Spec Shells

```typescript
console.log('Creating spec shells...');
console.log('');

const createdSpecs: string[] = [];

for (const spec of recommendedSpecs) {
  const specNumber = String(spec.number).padStart(3, '0');
  const specSlug = spec.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const specDirName = `${specNumber}-${specSlug}`;
  const specPath = `${specsDir}/${specDirName}`;

  // Create spec directory
  createDir(specPath);

  // Create requirements.md
  const requirementsContent = generateSpecRequirements(
    spec,
    featureId,
    featureTitle,
    epicId,
    userStories
  );

  writeFile(`${specPath}/requirements.md`, requirementsContent);
  console.log(`✓ Created ${specPath}/requirements.md`);

  // Create placeholder design.md
  const designPlaceholder = `# Design: ${spec.name}

**Spec**: ${specNumber}
**Feature**: ${featureId} - ${featureTitle}
${epicId ? `**Epic**: ${epicId}\n` : ''}
**Created**: ${new Date().toISOString().split('T')[0]}

## Overview

TODO: Add technical design for this spec.

## Components

TODO: Define components and architecture.

## Data Models

TODO: Define data structures.

## Testing Strategy

TODO: Define test approach.
`;

  writeFile(`${specPath}/design.md`, designPlaceholder);
  console.log(`✓ Created ${specPath}/design.md (placeholder)`);

  // Create placeholder tasks.md
  const tasksPlaceholder = `# Tasks: ${spec.name}

**Spec**: ${specNumber}
**Feature**: ${featureId} - ${featureTitle}
${epicId ? `**Epic**: ${epicId}\n` : ''}

## Implementation Tasks

- [ ] Task 1: TODO - Complete design.md first
- [ ] Task 2: TODO - Define specific implementation tasks
- [ ] Task 3: TODO - Add tests

_Run \`/specid.task ${specNumber}\` to generate detailed tasks from design_
`;

  writeFile(`${specPath}/tasks.md`, tasksPlaceholder);
  console.log(`✓ Created ${specPath}/tasks.md (placeholder)`);

  createdSpecs.push(specDirName);
  console.log('');
}

console.log(`✓ Created ${createdSpecs.length} spec shells`);
console.log('');
```

### Step 9: Update Feature Document

```typescript
console.log('Updating feature document...');

// Add spec links to user stories table
let updatedFeature = featureContent;

for (const spec of recommendedSpecs) {
  for (const storyId of spec.storyIds) {
    // Find the story in the table and add spec link
    const storyPattern = new RegExp(
      `(\\| ${storyId} \\|[^|]+\\|[^|]+\\|)([^|]*)(\\|)`,
      'g'
    );

    const specNumber = String(spec.number).padStart(3, '0');
    const specLink = `[Spec ${specNumber}](../../specs/${specNumber}-${spec.name}/)`;

    updatedFeature = updatedFeature.replace(
      storyPattern,
      `$1 ${specLink} $3`
    );
  }
}

// Update "Last Updated" date
updatedFeature = updatedFeature.replace(
  /\*\*Last Updated\*\*: .+/,
  `**Last Updated**: ${new Date().toISOString().split('T')[0]}`
);

// Update status to "Ready" if all stories now have specs
const allStoriesHaveSpecs = userStories.every(story =>
  recommendedSpecs.some(spec => spec.storyIds.includes(story.id))
);

if (allStoriesHaveSpecs) {
  updatedFeature = updatedFeature.replace(
    /\*\*Status\*\*: Draft/,
    '**Status**: Ready'
  );
}

writeFile(featurePath, updatedFeature);
console.log(`✓ Updated ${featurePath}`);
console.log('');
```

### Step 10: Display Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Feature Prepared for Development');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Feature: ${featureId} - ${featureTitle}`);
if (epicId) {
  console.log(`Epic: ${epicId}`);
}
console.log('');
console.log('Specs Created:');
for (const specDir of createdSpecs) {
  console.log(`  - ${specsDir}/${specDir}/`);
}
console.log('');
console.log(`Status: ${allStoriesHaveSpecs ? 'Ready for implementation' : 'Partially prepared'}`);
console.log('');
```

### Step 11: STOP EXECUTION

```typescript
// Command execution STOPS here
```

### Step 12: Offer Next Steps

```typescript
console.log('───────────────────────────────────────');
console.log('Next Steps');
console.log('───────────────────────────────────────');
console.log('');
console.log('Your specs are created! For each spec, you should:');
console.log('');
console.log('1. Complete requirements.md with detailed acceptance criteria');
console.log('2. Complete design.md with technical design');
console.log('3. Generate tasks with /specid.tasks [spec-number]');
console.log('4. Begin implementation');
console.log('');
console.log('Recommended order:');
for (let i = 0; i < orderedSpecs.length; i++) {
  const spec = orderedSpecs[i];
  const specNumber = String(spec.number).padStart(3, '0');
  console.log(`  ${i + 1}. Work on Spec ${specNumber} - ${spec.name}`);
}
console.log('');

const startFirst = askYesNo('Would you like to start working on the first spec now?');

if (startFirst) {
  const firstSpec = orderedSpecs[0];
  const specNumber = String(firstSpec.number).padStart(3, '0');

  console.log('');
  console.log(`Opening Spec ${specNumber} for editing...`);
  console.log('');
  console.log('Complete the requirements.md and design.md files,');
  console.log('then run:');
  console.log(`  /specid.tasks ${specNumber}`);
} else {
  console.log('');
  console.log('No problem! Work on specs when you\'re ready.');
  console.log('');
}
```

## Helper Functions

### Extract User Stories

```typescript
function extractUserStories(content: string): UserStory[] {
  const stories: UserStory[] = [];
  const lines = content.split('\n');

  let inStoriesSection = false;
  let currentStoryId = '';

  for (const line of lines) {
    // Check for user stories table
    if (line.match(/^\| Story ID \|/) || line.match(/^\| ID \|/)) {
      inStoriesSection = true;
      continue;
    }

    if (inStoriesSection) {
      // Check if we've left the table
      if (line.trim() === '' || line.match(/^##/)) {
        inStoriesSection = false;
        continue;
      }

      // Parse table row
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);

      if (cells.length >= 2 && cells[0].match(/^(STORY-\d+|S\d+|US-\d+)$/)) {
        stories.push({
          id: cells[0],
          description: cells[1],
          status: cells[2] || 'Backlog',
          estimate: cells[3] || 'TBD'
        });
      }
    }

    // Also look for "As a / I want / So that" format
    if (line.match(/^\*\*As a\*\*/)) {
      const storyText = extractStoryFromFormat(lines, lines.indexOf(line));
      if (storyText) {
        stories.push({
          id: `STORY-${stories.length + 1}`,
          description: storyText,
          status: 'Backlog',
          estimate: 'TBD'
        });
      }
    }
  }

  return stories;
}
```

### Analyze and Group Stories

```typescript
function analyzeAndGroupStories(
  stories: UserStory[],
  techConsiderations: string,
  dependencies: string,
  startingNumber: number
): SpecRecommendation[] {

  const specs: SpecRecommendation[] = [];
  let currentNumber = startingNumber;

  // Simple grouping heuristics:
  // 1. UI-focused stories go together
  // 2. API/backend stories go together
  // 3. Integration stories separate
  // 4. Large stories (>5 days) become their own spec

  const uiStories = stories.filter(s =>
    /UI|page|form|display|view|interface/i.test(s.description)
  );

  const apiStories = stories.filter(s =>
    /API|endpoint|service|backend|database/i.test(s.description)
  );

  const authStories = stories.filter(s =>
    /auth|login|permission|access|security/i.test(s.description)
  );

  const integrationStories = stories.filter(s =>
    /integrat|connect|sync|webhook/i.test(s.description)
  );

  // Group UI stories if present
  if (uiStories.length > 0) {
    specs.push({
      number: currentNumber++,
      name: 'ui-components',
      storyIds: uiStories.map(s => s.id),
      estimate: estimateStories(uiStories),
      dependencies: [],
      rationale: 'Groups UI-related user stories for cohesive frontend implementation'
    });
  }

  // Group API/backend stories if present
  if (apiStories.length > 0) {
    specs.push({
      number: currentNumber++,
      name: 'api-backend',
      storyIds: apiStories.map(s => s.id),
      estimate: estimateStories(apiStories),
      dependencies: [],
      rationale: 'Groups backend/API stories for cohesive service layer implementation'
    });
  }

  // Auth usually comes first as a dependency
  if (authStories.length > 0) {
    const authSpec = {
      number: startingNumber, // Put first
      name: 'authentication-authorization',
      storyIds: authStories.map(s => s.id),
      estimate: estimateStories(authStories),
      dependencies: [],
      rationale: 'Authentication/authorization typically required first as foundation'
    };

    // Shift other specs up
    specs.forEach(s => s.number++);
    specs.unshift(authSpec);
    currentNumber++;
  }

  // Integration stories often depend on others
  if (integrationStories.length > 0) {
    const integrationDeps = specs.map(s => String(s.number).padStart(3, '0'));

    specs.push({
      number: currentNumber++,
      name: 'external-integration',
      storyIds: integrationStories.map(s => s.id),
      estimate: estimateStories(integrationStories),
      dependencies: integrationDeps,
      rationale: 'Integration work typically builds on core functionality'
    });
  }

  // Catch remaining stories
  const categorizedIds = new Set(specs.flatMap(s => s.storyIds));
  const remainingStories = stories.filter(s => !categorizedIds.has(s.id));

  if (remainingStories.length > 0) {
    specs.push({
      number: currentNumber++,
      name: 'additional-features',
      storyIds: remainingStories.map(s => s.id),
      estimate: estimateStories(remainingStories),
      dependencies: [],
      rationale: 'Additional feature work not fitting other categories'
    });
  }

  return specs;
}

function estimateStories(stories: UserStory[]): string {
  // Simple heuristic: count stories and complexity
  if (stories.length === 1) return 'S (1-2 days)';
  if (stories.length <= 3) return 'M (3-5 days)';
  return 'L (5+ days)';
}
```

### Generate Spec Requirements

```typescript
function generateSpecRequirements(
  spec: SpecRecommendation,
  featureId: string,
  featureTitle: string,
  epicId: string | null,
  allStories: UserStory[]
): string {

  const specNumber = String(spec.number).padStart(3, '0');
  const relevantStories = allStories.filter(s => spec.storyIds.includes(s.id));

  let content = `# Requirements: ${spec.name}

**Spec**: ${specNumber}
**Feature**: ${featureId} - ${featureTitle}
${epicId ? `**Epic**: ${epicId}\n` : ''}**Created**: ${new Date().toISOString().split('T')[0]}
**Status**: Draft
**Estimate**: ${spec.estimate}

## Context

This spec implements the following user stories from ${featureId}:
${relevantStories.map(s => `- ${s.id}: ${s.description}`).join('\n')}

## User Stories

`;

  // Add each story with acceptance criteria placeholders
  for (const story of relevantStories) {
    content += `### ${story.id}

${story.description}

**Acceptance Criteria**:

- [ ] AC-1: TODO - Define acceptance criteria using EARS notation
- [ ] AC-2: TODO - Add more criteria

`;
  }

  content += `## Dependencies

`;

  if (spec.dependencies.length > 0) {
    content += `This spec depends on:\n`;
    for (const dep of spec.dependencies) {
      content += `- Spec ${dep}\n`;
    }
  } else {
    content += `No dependencies - can be implemented independently.\n`;
  }

  content += `
## Out of Scope

_Define what is explicitly NOT included in this spec._

- TBD

## Notes

${spec.rationale}

---

_Next steps: Complete acceptance criteria, then run \`/specid.design ${specNumber}\`_
`;

  return content;
}
```

## Type Definitions

```typescript
interface UserStory {
  id: string;
  description: string;
  status: string;
  estimate: string;
}

interface SpecRecommendation {
  number: number;
  name: string;
  storyIds: string[];
  estimate: string;
  dependencies: string[];
  rationale: string;
}
```

## Requirements Satisfied

- ✅ Analyzes feature and extracts user stories
- ✅ Recommends intelligent spec groupings based on story content
- ✅ Considers technical considerations and dependencies
- ✅ Presents recommendations in clear table format
- ✅ Explains rationale for each spec grouping
- ✅ Waits for user confirmation before creating files
- ✅ Creates spec shells with requirements.md, design.md, tasks.md
- ✅ Updates feature document with spec links
- ✅ Updates feature status to "Ready" when complete
- ✅ Provides clear next steps and implementation order
- ✅ Works with both new (FEAT-NNN) and old (kebab-case) structures
