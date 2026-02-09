# /specid.feature - Create or Refine Feature

You are executing the `/specid.feature` command to create or refine a feature document with requirements using EARS notation.

## Command Arguments

- **name**: Feature identifier (e.g., "FEAT-001") or name for new features (optional)
- **text**: Feature description (optional)
- **--epic**: Epic ID to link this feature to (e.g., "EPIC-001") (optional)

## Command Purpose

Features represent specific capabilities made up of user stories. This command helps you:
- Create new features (with automatic FEAT-NNN numbering)
- Link features to epics (optional - epics not required for small projects)
- Build out user stories collaboratively through conversation
- Generate acceptance criteria using EARS notation
- Ensure quality and traceability

**Philosophy**: This command is conversational and collaborative. The system asks probing questions to help you think through requirements, then **suggests** stories and criteria for your review and refinement.

## Execution Steps

### Step 1: Determine Mode and Context

```typescript
const featureName = args.name;
const featureText = args.text || '';
const epicId = args.epic || null;

// Check if refining existing feature
if (featureName && (
  featureName.match(/^FEAT-\d+$/) ||
  fileExists(`docs/planning/features/${featureName}.md`) ||
  dirExists(`docs/features/${featureName}`)
)) {
  console.log('📝 Refining existing feature...');
  return refineFeature(featureName, featureText);
}

// Creating new feature
console.log('📝 Creating new feature...');
console.log('');
```

## Create Feature Flow

### Step 2: Handle Epic Linking (Optional)

```typescript
let parentEpic = null;

if (epicId) {
  console.log(`Checking epic: ${epicId}...`);

  // Find epic file
  const epicFiles = glob(`docs/planning/epics/${epicId}-*.md`);

  if (epicFiles.length === 0) {
    console.warn(`⚠️  Epic ${epicId} not found`);

    const proceed = askChoice(
      'How would you like to proceed?',
      [
        'Continue without epic (standalone feature)',
        'Create the epic first',
        'Cancel'
      ]
    );

    if (proceed === 1) {
      console.log('');
      console.log(`Let's create the epic first...`);
      executeCommand(`/specid.epic`);
      return;
    } else if (proceed === 2) {
      console.log('Cancelled.');
      return;
    }

    console.log('');
    console.log('✓ Proceeding as standalone feature');
  } else {
    parentEpic = readFile(epicFiles[0]);
    const epicTitle = parentEpic.match(/^# (.+)$/m)[1];
    console.log(`✓ Will link to: ${epicId} - ${epicTitle}`);
  }

  console.log('');
} else {
  console.log('💡 Tip: Features can optionally belong to epics for better organization.');
  console.log('   Add --epic EPIC-NNN to link this feature to an epic.');
  console.log('');

  const linkToEpic = askYesNo('Would you like to link this feature to an epic?');

  if (linkToEpic) {
    // List available epics
    const epicFiles = glob('docs/planning/epics/EPIC-*.md');

    if (epicFiles.length === 0) {
      console.log('');
      console.log('No epics found. Create one first with:');
      console.log('  /specid.epic');
      console.log('');
      console.log('Continuing as standalone feature...');
      console.log('');
    } else {
      console.log('');
      console.log('Available epics:');
      epicFiles.forEach((file, i) => {
        const content = readFile(file);
        const id = file.match(/EPIC-\d+/)[0];
        const title = content.match(/^# (.+)$/m)[1];
        console.log(`  ${i + 1}. ${id}: ${title}`);
      });
      console.log('');

      const epicChoice = ask('Enter epic number or ID (or leave blank to skip):');

      if (epicChoice) {
        // Parse choice
        if (epicChoice.match(/^\d+$/)) {
          const idx = parseInt(epicChoice) - 1;
          if (idx >= 0 && idx < epicFiles.length) {
            parentEpic = readFile(epicFiles[idx]);
            epicId = epicFiles[idx].match(/EPIC-\d+/)[0];
          }
        } else if (epicChoice.match(/^EPIC-\d+$/)) {
          const file = epicFiles.find(f => f.includes(epicChoice));
          if (file) {
            parentEpic = readFile(file);
            epicId = epicChoice;
          }
        }
      }

      console.log('');
    }
  } else {
    console.log('');
  }
}
```

### Step 3: Gather Basic Feature Information

```typescript
console.log('Let\'s define this feature. I\'ll ask a few questions to understand what you\'re building.');
console.log('');

const featureInfo = {
  title: featureName || ask('[1] What is the feature name/title?'),
  overview: featureText || ask('[2] What does this feature do? (Brief overview)'),
  problem: ask('[3] What problem does this solve for users?'),
  value: ask('[4] What value does it provide?')
};

console.log('');
console.log('Great! Now let\'s think about the user stories...');
console.log('');
```

### Step 4: Collaborative Story Building

```typescript
// Start with initial suggestions based on what we know
console.log('Based on your description, I\'m thinking about the user stories needed.');
console.log('Let me suggest some stories, and you can refine them.');
console.log('');

// Generate initial story suggestions
const suggestedStories = generateStorySuggestions(
  featureInfo.overview,
  featureInfo.problem
);

console.log('Suggested User Stories:');
console.log('');

suggestedStories.forEach((story, i) => {
  console.log(`Story ${i + 1}:`);
  console.log(`  As a ${story.asA}`);
  console.log(`  I want to ${story.iWantTo}`);
  console.log(`  So that ${story.soThat}`);
  console.log('');
});

const storiesLookGood = askChoice(
  'How do these stories look?',
  [
    'Good - let\'s use these',
    'Need refinement - let me edit them',
    'Start over - I\'ll write them myself'
  ]
);

console.log('');

let finalStories = [];

if (storiesLookGood === 0) {
  // Use suggested stories
  finalStories = suggestedStories;

} else if (storiesLookGood === 1) {
  // Refine stories one by one
  console.log('Let\'s refine each story...');
  console.log('');

  for (let i = 0; i < suggestedStories.length; i++) {
    const story = suggestedStories[i];

    console.log(`Story ${i + 1} (current):`);
    console.log(`  As a ${story.asA}`);
    console.log(`  I want to ${story.iWantTo}`);
    console.log(`  So that ${story.soThat}`);
    console.log('');

    const action = askChoice(
      'What would you like to do?',
      ['Keep as-is', 'Edit', 'Remove', 'Split into multiple stories']
    );

    if (action === 0) {
      finalStories.push(story);

    } else if (action === 1) {
      // Edit
      finalStories.push({
        asA: ask('  As a... (press Enter to keep):', story.asA) || story.asA,
        iWantTo: ask('  I want to... (press Enter to keep):', story.iWantTo) || story.iWantTo,
        soThat: ask('  So that... (press Enter to keep):', story.soThat) || story.soThat
      });

    } else if (action === 2) {
      // Remove - don't add to finalStories
      console.log('  ✓ Removed');

    } else if (action === 3) {
      // Split
      console.log('  Let\'s split this into multiple stories...');
      const numStories = parseInt(ask('  How many stories? (2-3):')) || 2;

      for (let j = 0; j < numStories; j++) {
        console.log(`  Story ${i + 1}.${j + 1}:`);
        finalStories.push({
          asA: ask('    As a...:', story.asA),
          iWantTo: ask('    I want to...:'),
          soThat: ask('    So that...:', story.soThat)
        });
      }
    }

    console.log('');
  }

  // Ask if they want to add more
  if (askYesNo('Add additional stories?')) {
    console.log('');
    while (true) {
      console.log('New story:');
      finalStories.push({
        asA: ask('  As a...:'),
        iWantTo: ask('  I want to...:'),
        soThat: ask('  So that...:')
      });

      console.log('');
      if (!askYesNo('Add another?')) break;
      console.log('');
    }
  }

} else {
  // Write from scratch
  console.log('Let\'s write the stories from scratch...');
  console.log('');

  while (true) {
    console.log('User story:');
    finalStories.push({
      asA: ask('  As a...:'),
      iWantTo: ask('  I want to...:'),
      soThat: ask('  So that...:')
    });

    console.log('');
    if (!askYesNo('Add another story?')) break;
    console.log('');
  }
}

console.log('');
console.log(`✓ ${finalStories.length} user ${finalStories.length === 1 ? 'story' : 'stories'} defined`);
console.log('');
```

### Step 5: Build Acceptance Criteria Collaboratively

```typescript
console.log('Now let\'s define acceptance criteria for each story.');
console.log('I\'ll ask probing questions to help think through the details...');
console.log('');

const storiesWithCriteria = [];

for (let i = 0; i < finalStories.length; i++) {
  const story = finalStories[i];

  console.log('─────────────────────────────────────');
  console.log(`Story ${i + 1}: ${story.iWantTo}`);
  console.log('─────────────────────────────────────');
  console.log('');

  // Probing questions to elicit criteria
  console.log('Let me ask some questions to understand the details...');
  console.log('');

  const details = {
    happyPath: ask('[1] What happens when everything works correctly?'),
    inputs: ask('[2] What inputs or data are needed?'),
    outputs: ask('[3] What should the user see or get as output?'),
    errors: ask('[4] What could go wrong? What errors should we handle?'),
    validation: ask('[5] What validations or checks are needed?'),
    edgeCases: ask('[6] Any edge cases or special scenarios? (optional):')
  };

  console.log('');

  // Generate suggested criteria in EARS format
  const suggestedCriteria = generateEARSCriteria(story, details);

  console.log('Based on your answers, here are suggested acceptance criteria:');
  console.log('');

  suggestedCriteria.forEach((criterion, idx) => {
    console.log(`${criterion.id}. ${criterion.type} ${criterion.condition}, ${criterion.action}`);
  });

  console.log('');

  const criteriaOk = askChoice(
    'How do these criteria look?',
    [
      'Good - use these',
      'Let me refine them',
      'Add more criteria'
    ]
  );

  console.log('');

  let finalCriteria = [...suggestedCriteria];

  if (criteriaOk === 1) {
    // Refine
    console.log('Let\'s refine the criteria...');
    finalCriteria = [];

    for (const criterion of suggestedCriteria) {
      console.log(`Current: ${criterion.id}. ${criterion.type} ${criterion.condition}, ${criterion.action}`);

      const action = askChoice(
        'What would you like to do?',
        ['Keep', 'Edit', 'Remove']
      );

      if (action === 0) {
        finalCriteria.push(criterion);
      } else if (action === 1) {
        const type = askChoice(
          '  Criterion type:',
          ['WHEN', 'IF', 'WHILE']
        );
        finalCriteria.push({
          id: criterion.id,
          type: ['WHEN', 'IF', 'WHILE'][type],
          condition: ask('  Condition:', criterion.condition),
          action: ask('  Action (should include SHALL):', criterion.action)
        });
      }
      // Remove: don't add

      console.log('');
    }
  }

  if (criteriaOk === 2 || askYesNo('Add more acceptance criteria?')) {
    console.log('');
    let acNumber = finalCriteria.length + 1;

    while (true) {
      console.log(`New criterion AC-${acNumber}:`);

      const type = askChoice(
        '  Type:',
        ['WHEN (trigger/input)', 'IF (conditional)', 'WHILE (ongoing state)']
      );

      finalCriteria.push({
        id: `AC-${acNumber}`,
        type: ['WHEN', 'IF', 'WHILE'][type],
        condition: ask('  Condition (e.g., "user clicks submit button"):'),
        action: ask('  Action (use SHALL, e.g., "the system SHALL validate inputs"):')
      });

      acNumber++;
      console.log('');

      if (!askYesNo('Add another criterion?')) break;
      console.log('');
    }
  }

  storiesWithCriteria.push({
    ...story,
    criteria: finalCriteria,
    storyId: `US-${i + 1}`
  });

  console.log('');
}

console.log('✓ Acceptance criteria defined for all stories');
console.log('');
```

### Step 6: Determine Feature Number

```typescript
console.log('Assigning feature number...');

const featuresDir = 'docs/planning/features';
let featureNumber = 1;

if (!dirExists(featuresDir)) {
  createDir(featuresDir);
  console.log(`✓ Created ${featuresDir}/`);
}

const featureFiles = glob(`${featuresDir}/FEAT-*.md`);
const featureNumbers = featureFiles
  .filter(f => f.match(/FEAT-(\d+)/))
  .map(f => parseInt(f.match(/FEAT-(\d+)/)[1]))
  .sort((a, b) => b - a);

if (featureNumbers.length > 0) {
  featureNumber = featureNumbers[0] + 1;
}

const featureId = `FEAT-${String(featureNumber).padStart(3, '0')}`;
const featureSlug = featureInfo.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const featureFileName = `${featureId}-${featureSlug}.md`;
const featurePath = `${featuresDir}/${featureFileName}`;

console.log(`✓ Feature ID: ${featureId}`);
console.log('');
```

### Step 7: Generate Functional and Non-Functional Requirements

```typescript
console.log('Generating functional and non-functional requirements...');
console.log('');

// Extract functional requirements from criteria
const functionalRequirements = [];
let frNumber = 1;

// Group criteria by category
const happyPathCriteria = [];
const errorCriteria = [];
const validationCriteria = [];

for (const story of storiesWithCriteria) {
  for (const criterion of story.criteria) {
    const text = `${criterion.condition} ${criterion.action}`.toLowerCase();

    if (text.includes('error') || text.includes('invalid') || text.includes('fail')) {
      errorCriteria.push(criterion);
    } else if (text.includes('validat') || text.includes('check') || text.includes('verify')) {
      validationCriteria.push(criterion);
    } else {
      happyPathCriteria.push(criterion);
    }
  }
}

// Create FRs from happy path
if (happyPathCriteria.length > 0) {
  for (const criterion of happyPathCriteria.slice(0, 3)) {
    functionalRequirements.push({
      id: `FR-${frNumber++}`,
      statement: `${criterion.type} ${criterion.condition}, the system ${criterion.action}`,
      references: [criterion.id]
    });
  }
}

// Create FR for error handling if needed
if (errorCriteria.length > 0) {
  functionalRequirements.push({
    id: `FR-${frNumber++}`,
    statement: 'The system SHALL handle all error conditions gracefully with user-friendly messages',
    references: errorCriteria.map(c => c.id)
  });
}

// Create FR for validation if needed
if (validationCriteria.length > 0) {
  functionalRequirements.push({
    id: `FR-${frNumber++}`,
    statement: 'The system SHALL validate all inputs according to business rules',
    references: validationCriteria.map(c => c.id)
  });
}

// Non-functional requirements
const nonFunctionalRequirements = [
  {
    id: 'NFR-1',
    type: 'Usability',
    statement: 'The feature SHALL provide clear user feedback and intuitive interactions'
  },
  {
    id: 'NFR-2',
    type: 'Performance',
    statement: 'The feature SHALL respond to user actions within 2 seconds'
  },
  {
    id: 'NFR-3',
    type: 'Maintainability',
    statement: 'The code SHALL follow project coding standards and be well-documented'
  }
];

console.log(`✓ Generated ${functionalRequirements.length} functional requirements`);
console.log(`✓ Generated ${nonFunctionalRequirements.length} non-functional requirements`);
console.log('');
```

### Step 8: Load Template and Generate Document

```typescript
const templatePath = '.spec/templates/feature-template.md';
let template = '';

if (fileExists(templatePath)) {
  template = readFile(templatePath);
  console.log(`✓ Loaded template from ${templatePath}`);
} else {
  template = getInlineFeatureTemplate();
  console.log('⚠️  Using inline default template');
}

console.log('');

// Build document sections
let userStoriesSection = '';
for (const story of storiesWithCriteria) {
  userStoriesSection += `### ${story.storyId}: ${story.iWantTo}\n\n`;
  userStoriesSection += `**As a** ${story.asA}\n`;
  userStoriesSection += `**I want to** ${story.iWantTo}\n`;
  userStoriesSection += `**So that** ${story.soThat}\n\n`;
  userStoriesSection += `**Acceptance Criteria**:\n\n`;

  for (const criterion of story.criteria) {
    userStoriesSection += `${criterion.id}. ${criterion.type} ${criterion.condition}, ${criterion.action}\n`;
  }

  userStoriesSection += '\n';
}

let frSection = '';
for (const fr of functionalRequirements) {
  frSection += `- **${fr.id}**: ${fr.statement}\n`;
  frSection += `  - _References: ${fr.references.join(', ')}_\n`;
}

let nfrSection = '';
for (const nfr of nonFunctionalRequirements) {
  nfrSection += `- **${nfr.id}** (${nfr.type}): ${nfr.statement}\n`;
}

const featureContent = template
  .replace(/\[FEATURE-ID\]/g, featureId)
  .replace(/\[FEATURE-TITLE\]/g, featureInfo.title)
  .replace(/\[EPIC-LINK\]/g, epicId ? `**Epic**: [${epicId}](../../planning/epics/${epicId}-*.md)\n` : '')
  .replace(/\[DATE\]/g, new Date().toISOString().split('T')[0])
  .replace(/\[OVERVIEW\]/g, featureInfo.overview)
  .replace(/\[PROBLEM\]/g, featureInfo.problem)
  .replace(/\[VALUE\]/g, featureInfo.value)
  .replace(/\[USER-STORIES\]/g, userStoriesSection)
  .replace(/\[FUNCTIONAL-REQUIREMENTS\]/g, frSection)
  .replace(/\[NON-FUNCTIONAL-REQUIREMENTS\]/g, nfrSection);

console.log('✓ Generated feature document');
console.log('');
```

### Step 9: Validate Quality

```typescript
console.log('Validating requirements quality...');
console.log('');

const issues = validateRequirements(featureContent, storiesWithCriteria);

if (issues.length > 0) {
  console.log('⚠️  Quality checks found some issues:');
  for (const issue of issues) {
    console.log(`  - ${issue}`);
  }
  console.log('');

  const proceed = askYesNo('These are recommendations. Proceed anyway?');
  if (!proceed) {
    console.log('Cancelled. Please refine and try again.');
    return;
  }
  console.log('');
} else {
  console.log('✓ All quality checks passed');
  console.log('');
}
```

### Step 10: Preview and Write

```typescript
const confirmationMode = askChoice(
  'Would you like to review the complete feature document?',
  ['Yes - show me the full document', 'No - just write it']
) === 0;

console.log('');

if (confirmationMode) {
  console.log('═══════════════════════════════════════');
  console.log('Feature Document Preview');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(featureContent);
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('');

  const approved = askYesNo('Write this feature?');
  if (!approved) {
    console.log('⚠️  Cancelled - feature not written');
    return;
  }
  console.log('');
}

writeFile(featurePath, featureContent);
console.log(`✓ Created ${featurePath}`);
console.log('');
```

### Step 11: Update Epic (if applicable)

```typescript
if (epicId && parentEpic) {
  console.log(`Updating epic ${epicId}...`);

  // Find features table and add new feature
  let updatedEpic = parentEpic;

  // Add to features table
  const featureRow = `| [${featureId}](../../planning/features/${featureFileName}) | Draft | - | TBD |`;

  updatedEpic = updatedEpic.replace(
    /(## Features\n\n\| Feature[\s\S]+?\n\|[-|\s]+\|)\n/,
    `$1\n${featureRow}\n`
  );

  // Update date
  updatedEpic = updatedEpic.replace(
    /\*\*Last Updated\*\*: .+/,
    `**Last Updated**: ${new Date().toISOString().split('T')[0]}`
  );

  const epicPath = glob(`docs/planning/epics/${epicId}-*.md`)[0];
  writeFile(epicPath, updatedEpic);

  console.log(`✓ Added feature to ${epicId}`);
  console.log('');
}
```

### Step 12: Display Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Feature Created Successfully');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Feature ID: ${featureId}`);
console.log(`Title: ${featureInfo.title}`);
if (epicId) {
  console.log(`Epic: ${epicId}`);
}
console.log(`Location: ${featurePath}`);
console.log('');
console.log('Summary:');
console.log(`  - ${storiesWithCriteria.length} user stories`);
console.log(`  - ${storiesWithCriteria.reduce((sum, s) => sum + s.criteria.length, 0)} acceptance criteria`);
console.log(`  - ${functionalRequirements.length} functional requirements`);
console.log(`  - ${nonFunctionalRequirements.length} non-functional requirements`);
console.log('');
```

### Step 13: STOP EXECUTION

```typescript
// Command execution STOPS here
```

### Step 14: Offer Next Steps

```typescript
console.log('───────────────────────────────────────');
console.log('Next Steps (Optional)');
console.log('───────────────────────────────────────');
console.log('');
console.log('Your feature is ready! You can now:');
console.log('');
console.log('1. Prepare feature for development (creates spec breakdown):');
console.log(`   /specid.prepare ${featureId}`);
console.log('');
console.log('2. Create first spec manually:');
console.log('   /specid.spec [spec-name]');
console.log('');

const prepareNow = askYesNo('Would you like to prepare this feature for development now?');

if (prepareNow) {
  console.log('');
  console.log(`Running: /specid.prepare ${featureId}`);
  console.log('');
  executeCommand(`/specid.prepare ${featureId}`);
} else {
  console.log('');
  console.log('No problem! Run /specid.prepare when you\'re ready.');
  console.log('');
}
```

## Refine Feature Flow

```typescript
function refineFeature(featureName: string, refinementText: string) {
  console.log(`Loading feature: ${featureName}...`);

  // Find feature file
  let featurePath = '';

  if (featureName.match(/^FEAT-\d+$/)) {
    const files = glob(`docs/planning/features/${featureName}-*.md`);
    if (files.length > 0) {
      featurePath = files[0];
    }
  } else {
    // Check old structure
    if (fileExists(`docs/planning/features/${featureName}.md`)) {
      featurePath = `docs/planning/features/${featureName}.md`;
    } else if (fileExists(`docs/features/${featureName}/requirements.md`)) {
      featurePath = `docs/features/${featureName}/requirements.md`;
    }
  }

  if (!featurePath) {
    console.error(`❌ Feature not found: ${featureName}`);
    return;
  }

  const featureContent = readFile(featurePath);
  console.log(`✓ Loaded from ${featurePath}`);
  console.log('');

  // Extract current info
  const titleMatch = featureContent.match(/^# (.+)$/m);
  const statusMatch = featureContent.match(/\*\*Status\*\*: (.+)$/m);

  console.log('Current Feature:');
  console.log(`  Title: ${titleMatch ? titleMatch[1] : 'Unknown'}`);
  console.log(`  Status: ${statusMatch ? statusMatch[1] : 'Unknown'}`);
  console.log('');

  if (refinementText) {
    console.log(`Refinement guidance: ${refinementText}`);
    console.log('');
  }

  const refinementArea = askChoice(
    'What would you like to refine?',
    [
      'Overview/problem/value',
      'User stories (add/modify/remove)',
      'Acceptance criteria',
      'Requirements (FR/NFR)',
      'Multiple areas'
    ]
  );

  console.log('');

  // Handle based on selection
  // ... (simplified for brevity - similar pattern to epic refinement)

  console.log('✓ Feature refined');
  console.log('');
}
```

## Helper Functions

### Generate Story Suggestions

```typescript
function generateStorySuggestions(overview: string, problem: string): Story[] {
  const stories: Story[] = [];

  // Simple heuristic-based suggestions
  const text = `${overview} ${problem}`.toLowerCase();

  // Common patterns
  if (text.match(/create|add|new/)) {
    stories.push({
      asA: 'user',
      iWantTo: 'create new items',
      soThat: 'I can manage my data'
    });
  }

  if (text.match(/view|see|display|show/)) {
    stories.push({
      asA: 'user',
      iWantTo: 'view existing items',
      soThat: 'I can find the information I need'
    });
  }

  if (text.match(/edit|update|modify|change/)) {
    stories.push({
      asA: 'user',
      iWantTo: 'edit existing items',
      soThat: 'I can keep information up to date'
    });
  }

  if (text.match(/delete|remove/)) {
    stories.push({
      asA: 'user',
      iWantTo: 'delete unwanted items',
      soThat: 'I can maintain clean data'
    });
  }

  if (text.match(/search|find|filter/)) {
    stories.push({
      asA: 'user',
      iWantTo: 'search and filter items',
      soThat: 'I can quickly find what I need'
    });
  }

  // If no patterns matched, provide generic template
  if (stories.length === 0) {
    stories.push({
      asA: 'user',
      iWantTo: 'use this feature',
      soThat: 'I can achieve my goal'
    });
  }

  return stories;
}
```

### Generate EARS Criteria

```typescript
function generateEARSCriteria(story: Story, details: any): Criterion[] {
  const criteria: Criterion[] = [];
  let acNumber = 1;

  // Happy path
  if (details.happyPath && details.inputs && details.outputs) {
    criteria.push({
      id: `AC-${acNumber++}`,
      type: 'WHEN',
      condition: details.inputs,
      action: `the system SHALL ${details.outputs}`
    });
  }

  // Validation
  if (details.validation) {
    criteria.push({
      id: `AC-${acNumber++}`,
      type: 'WHEN',
      condition: 'inputs are provided',
      action: `the system SHALL ${details.validation}`
    });
  }

  // Error handling
  if (details.errors) {
    const errors = details.errors.split(/[,;]/).map(e => e.trim()).filter(e => e);

    for (const error of errors.slice(0, 2)) {
      criteria.push({
        id: `AC-${acNumber++}`,
        type: 'IF',
        condition: error,
        action: 'the system SHALL display an appropriate error message'
      });
    }
  }

  // Edge cases
  if (details.edgeCases) {
    criteria.push({
      id: `AC-${acNumber++}`,
      type: 'IF',
      condition: details.edgeCases,
      action: 'the system SHALL handle gracefully'
    });
  }

  return criteria;
}
```

### Validate Requirements

```typescript
function validateRequirements(content: string, stories: any[]): string[] {
  const issues: string[] = [];

  // Check for EARS notation
  if (!content.match(/\b(WHEN|IF|WHILE)\b.*\bSHALL\b/)) {
    issues.push('Consider using EARS notation (WHEN/IF/WHILE...SHALL) for clarity');
  }

  // Check story count
  if (stories.length === 0) {
    issues.push('No user stories defined');
  }

  // Check for acceptance criteria
  const criteriaCount = stories.reduce((sum, s) => sum + (s.criteria?.length || 0), 0);
  if (criteriaCount === 0) {
    issues.push('No acceptance criteria defined');
  }

  // Check for FR/NFR
  if (!content.includes('FR-1')) {
    issues.push('No functional requirements (FR-) defined');
  }

  return issues;
}
```

### Get Inline Template

```typescript
function getInlineFeatureTemplate(): string {
  return `# [FEATURE-TITLE]

**Feature ID**: [FEATURE-ID]
[EPIC-LINK]**Created**: [DATE]
**Last Updated**: [DATE]
**Status**: Draft

## Overview

[OVERVIEW]

## Problem Statement

[PROBLEM]

## Value Proposition

[VALUE]

## User Stories

[USER-STORIES]

## Functional Requirements

[FUNCTIONAL-REQUIREMENTS]

## Non-Functional Requirements

[NON-FUNCTIONAL-REQUIREMENTS]

## Technical Considerations

_To be added during design phase_

## Dependencies

_To be identified_

## Out of Scope

_To be defined_

## Notes

_This feature was created using /specid.feature_
`;
}
```

## Type Definitions

```typescript
interface Story {
  asA: string;
  iWantTo: string;
  soThat: string;
  storyId?: string;
  criteria?: Criterion[];
}

interface Criterion {
  id: string;
  type: 'WHEN' | 'IF' | 'WHILE';
  condition: string;
  action: string;
}

interface FunctionalRequirement {
  id: string;
  statement: string;
  references: string[];
}

interface NonFunctionalRequirement {
  id: string;
  type: string;
  statement: string;
}
```

## Requirements Satisfied

- ✅ Conversational, collaborative approach with probing questions
- ✅ Suggests stories and criteria rather than auto-creating
- ✅ User can refine, edit, add, remove suggestions
- ✅ Epic linking (optional --epic parameter)
- ✅ FEAT-NNN sequential numbering
- ✅ New directory structure (docs/planning/features/)
- ✅ EARS notation (WHEN/IF/WHILE...SHALL)
- ✅ Automatic FR/NFR generation with traceability
- ✅ Quality validation with helpful recommendations
- ✅ Updates parent epic when linked
- ✅ Confirmation mode for final review
- ✅ STOP after completion, offers next steps
- ✅ Template system with fallback
- ✅ Backward compatibility with old structure
