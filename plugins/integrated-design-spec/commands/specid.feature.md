# /spec.feature - Create or Update Feature Requirements

You are executing the `/spec.feature` command to create or update feature requirements using EARS notation (Easy Approach to Requirements Syntax).

## Command Arguments

- **name**: Feature name in kebab-case (required)
- **text**: Feature description and guidance (required)

## Command Purpose

Create or update feature requirements in `docs/features/[name]/requirements.md`:
- Define user stories with "As a / I want to / So that" format
- Generate acceptance criteria using EARS notation (WHEN/WHILE/IF/THEN/SHALL)
- Number criteria sequentially for traceability
- Include edge cases and error handling
- Validate against quality standards

## Execution Steps

### Step 1: Parse and Validate Arguments

Extract and validate the feature name and description:

```typescript
const featureName = args.name;
const featureDescription = args.text;

// Validate feature name is provided
if (!featureName || featureName.trim().length === 0) {
  console.error('❌ Error: Feature name is required.');
  console.log('Usage: /spec.feature [name] "[description]"');
  console.log('Example: /spec.feature user-auth "Add user authentication"');
  return;
}

// Validate feature description is provided
if (!featureDescription || featureDescription.trim().length === 0) {
  console.error('❌ Error: Feature description is required.');
  console.log('Usage: /spec.feature [name] "[description]"');
  return;
}

// Validate kebab-case format
const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
if (!kebabCaseRegex.test(featureName)) {
  console.error('❌ Error: Feature name must be in kebab-case format.');
  console.log('Examples of valid names: user-auth, data-export, real-time-sync');
  console.log(`Invalid name: ${featureName}`);

  const suggestion = featureName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  console.log(`Suggested name: ${suggestion}`);
  return;
}

console.log('Feature Name:', featureName);
console.log('Description:', featureDescription);
console.log('');
```

### Step 2: Check if Feature Exists

Determine if this is a new feature or updating an existing one:

```typescript
const featurePath = `docs/features/${featureName}`;
const requirementsPath = `${featurePath}/requirements.md`;
const isNewFeature = !dirExists(featurePath);

if (isNewFeature) {
  console.log('📝 Creating new feature...');
  console.log('');
} else {
  console.log('✓ Feature exists - will update requirements');
  console.log('');
}
```

### Step 3: Ask for Confirmation Preference

Ask user how they want to handle file operations:

```typescript
const confirmationMode = askChoice(
  'Would you like to review the requirements before they\'re written?',
  [
    'Yes - show me the requirements for confirmation',
    'No - proceed automatically'
  ]
) === 0;

console.log('');
```

### Step 4: Load Requirements Template

Load the template from `.spec/templates/`:

```typescript
const templatePath = '.spec/templates/requirements-template.md';
let template = '';
let templateSource = '';

if (fileExists(templatePath)) {
  template = readFile(templatePath);
  templateSource = 'custom template';
  console.log(`✓ Loaded template from ${templatePath}`);
} else {
  console.warn('⚠️ Warning: requirements-template.md not found');

  const useInline = askChoice(
    'How would you like to proceed?',
    [
      'Use inline default template (not recommended)',
      'Stop and create template first'
    ]
  ) === 0;

  if (!useInline) {
    console.log('');
    console.log(`Please create ${templatePath} and run this command again.`);
    return;
  }

  template = getInlineRequirementsTemplate();
  templateSource = 'inline default';
  console.log('⚠️ Using inline default template');
}

console.log('');
```

### Step 5: Ask Clarifying Questions

Elicit comprehensive requirements through targeted questions:

```typescript
console.log('Let\'s gather detailed requirements...');
console.log('');

// Core questions
const questions = [
  'Who are the primary users of this feature?',
  'What is the main goal or benefit for users?',
  'What are the key actions users can perform?',
  'What data or inputs are required?',
  'What are the expected outcomes or outputs?',
  'What happens if something goes wrong? (error scenarios)',
  'Are there any special conditions or edge cases?',
  'What are the performance or quality expectations?'
];

const answers = {};
for (const question of questions) {
  const answer = ask(question);
  answers[question] = answer || 'Not specified';
}

console.log('');
console.log('Great! Now let\'s think about edge cases and error handling...');
console.log('');

// Edge case questions
const edgeCaseQuestions = [
  'What happens with invalid or missing inputs?',
  'What happens with duplicate or conflicting data?',
  'What happens under high load or concurrent access?',
  'Are there any boundary conditions (min/max values, limits)?',
  'What permissions or access controls are needed?'
];

for (const question of edgeCaseQuestions) {
  const answer = ask(question);
  answers[question] = answer || 'Not specified';
}

console.log('');
```

### Step 6: Generate Requirements with EARS Notation

Create or update requirements using EARS notation:

```typescript
// If updating, read existing content
let existingContent = '';
if (!isNewFeature && fileExists(requirementsPath)) {
  existingContent = readFile(requirementsPath);
  console.log('✓ Read existing requirements');
  console.log('');
}

// Generate user stories
const userStories = generateUserStories(
  featureName,
  featureDescription,
  answers
);

// Generate acceptance criteria with EARS notation
const acceptanceCriteria = generateEARSCriteria(
  featureName,
  featureDescription,
  answers,
  userStories
);

// Generate functional requirements
const functionalRequirements = generateFunctionalRequirements(
  featureName,
  acceptanceCriteria
);

// Generate non-functional requirements
const nonFunctionalRequirements = generateNonFunctionalRequirements(
  featureName,
  answers
);

// Compile full requirements document
const requirementsContent = compileRequirementsDocument({
  template: template,
  featureName: featureName,
  description: featureDescription,
  userStories: userStories,
  functionalRequirements: functionalRequirements,
  nonFunctionalRequirements: nonFunctionalRequirements,
  edgeCases: extractEdgeCases(answers),
  outOfScope: generateOutOfScope(featureDescription)
});

console.log('✓ Generated requirements with EARS notation');
console.log('');
```

### Step 7: Validate Requirements

Validate against quality checklist:

```typescript
console.log('Validating requirements...');
console.log('');

const validationIssues = validateRequirements(requirementsContent);

if (validationIssues.length > 0) {
  console.log('⚠️ Quality issues detected:');
  for (const issue of validationIssues) {
    console.log(`  - ${issue}`);
  }
  console.log('');
  console.log('Consider addressing these before proceeding.');
  console.log('');

  const proceedAnyway = askYesNo('Proceed anyway?');
  if (!proceedAnyway) {
    console.log('Cancelled. Please refine the requirements and try again.');
    return;
  }
  console.log('');
} else {
  console.log('✓ Requirements pass quality validation');
  console.log('');
}
```

### Step 8: Show Preview and Write File

Display preview if in confirmation mode, then write the file:

```typescript
// Create directory if new feature
if (isNewFeature) {
  createDir(featurePath);
  console.log(`✓ Created directory: ${featurePath}`);
  console.log('');
}

// Show preview if confirmation mode
if (confirmationMode) {
  console.log('═══════════════════════════════════════');
  console.log('Requirements Preview');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(requirementsContent);
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('');

  const approved = askYesNo('Write this file?');
  if (!approved) {
    console.log('⚠️ Cancelled - requirements not written');
    return;
  }
  console.log('');
}

// Write requirements file
writeFile(requirementsPath, requirementsContent);
console.log(`✓ ${isNewFeature ? 'Created' : 'Updated'} ${requirementsPath} (using ${templateSource})`);
console.log('');
```

### Step 9: Display Summary

Show what was accomplished:

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Feature Requirements Complete');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Feature: ${featureName}`);
console.log(`Location: ${requirementsPath}`);
console.log('');

// Count requirements
const frCount = functionalRequirements.length;
const nfrCount = nonFunctionalRequirements.length;
const storyCount = userStories.length;

console.log('Summary:');
console.log(`  - ${storyCount} user ${storyCount === 1 ? 'story' : 'stories'}`);
console.log(`  - ${frCount} functional requirements`);
console.log(`  - ${nfrCount} non-functional requirements`);
console.log('');
```

### Step 10: STOP EXECUTION

**CRITICAL**: The command must stop here.

```typescript
// Command execution STOPS here
```

### Step 11: Offer Next Step (Optional)

After stopping, optionally suggest moving to design:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');
console.log('Requirements are complete! Ready to move to design?');
console.log('');
console.log('The design phase will create the system architecture');
console.log('and implementation plan based on these requirements.');
console.log('');

const proceedToDesign = askYesNo(`Would you like to create the design for ${featureName}?`);

if (proceedToDesign) {
  console.log('');
  console.log(`Running: /spec.design ${featureName}`);
  console.log('');

  // Execute /spec.design command
  executeCommand(`/spec.design ${featureName}`);

  // STOP again after that command completes
} else {
  console.log('');
  console.log(`No problem! Run \`/spec.design ${featureName}\` when you're ready.`);
  console.log('');
}
```

## Helper Functions

### Generate User Stories

```typescript
function generateUserStories(
  featureName: string,
  description: string,
  answers: Record<string, string>
): UserStory[] {

  const primaryUsers = answers['Who are the primary users of this feature?'];
  const mainGoal = answers['What is the main goal or benefit for users?'];
  const keyActions = answers['What are the key actions users can perform?'];

  const stories: UserStory[] = [];

  // Parse key actions into individual stories
  const actions = keyActions.split(/[,;]/).map(a => a.trim()).filter(a => a.length > 0);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];

    stories.push({
      id: i + 1,
      title: action.charAt(0).toUpperCase() + action.slice(1),
      asA: primaryUsers || 'user',
      iWantTo: action,
      soThat: mainGoal || 'achieve my goals',
      acceptanceCriteria: [] // Will be filled by EARS generation
    });
  }

  // If no actions parsed, create a single story from the description
  if (stories.length === 0) {
    stories.push({
      id: 1,
      title: description,
      asA: primaryUsers || 'user',
      iWantTo: description,
      soThat: mainGoal || 'achieve my goals',
      acceptanceCriteria: []
    });
  }

  return stories;
}
```

### Generate EARS Criteria

```typescript
function generateEARSCriteria(
  featureName: string,
  description: string,
  answers: Record<string, string>,
  userStories: UserStory[]
): AcceptanceCriterion[] {

  const criteria: AcceptanceCriterion[] = [];
  let criterionNumber = 1;

  for (const story of userStories) {
    // Happy path criteria (WHEN trigger, THEN outcome)
    const inputs = answers['What data or inputs are required?'];
    const outputs = answers['What are the expected outcomes or outputs?'];

    if (inputs && outputs) {
      criteria.push({
        id: `AC-${criterionNumber++}`,
        type: 'WHEN',
        condition: `${inputs} is provided`,
        action: `SHALL ${outputs}`,
        category: 'happy-path'
      });
    }

    // Error handling criteria (IF condition, THEN error response)
    const errorScenarios = answers['What happens if something goes wrong? (error scenarios)'];
    if (errorScenarios) {
      const errors = errorScenarios.split(/[,;]/).map(e => e.trim()).filter(e => e.length > 0);
      for (const error of errors) {
        criteria.push({
          id: `AC-${criterionNumber++}`,
          type: 'IF',
          condition: error,
          action: 'THEN SHALL display appropriate error message',
          category: 'error-handling'
        });
      }
    }

    // Edge case criteria
    const invalidInputs = answers['What happens with invalid or missing inputs?'];
    if (invalidInputs) {
      criteria.push({
        id: `AC-${criterionNumber++}`,
        type: 'IF',
        condition: 'input is invalid or missing',
        action: `THEN SHALL ${invalidInputs}`,
        category: 'edge-case'
      });
    }

    const duplicateData = answers['What happens with duplicate or conflicting data?'];
    if (duplicateData) {
      criteria.push({
        id: `AC-${criterionNumber++}`,
        type: 'IF',
        condition: 'duplicate or conflicting data is detected',
        action: `THEN SHALL ${duplicateData}`,
        category: 'edge-case'
      });
    }

    // Performance criteria (WHILE condition, SHALL maintain performance)
    const performance = answers['What are the performance or quality expectations?'];
    if (performance) {
      criteria.push({
        id: `AC-${criterionNumber++}`,
        type: 'WHILE',
        condition: 'processing requests',
        action: `SHALL ${performance}`,
        category: 'performance'
      });
    }

    // Permission criteria
    const permissions = answers['What permissions or access controls are needed?'];
    if (permissions) {
      criteria.push({
        id: `AC-${criterionNumber++}`,
        type: 'WHEN',
        condition: 'user lacks required permissions',
        action: 'SHALL deny access and show permission error',
        category: 'security'
      });
    }

    // Assign criteria to story
    story.acceptanceCriteria = criteria.filter(c =>
      c.id.startsWith('AC-') // All criteria for this story
    );
  }

  return criteria;
}
```

### Generate Functional Requirements

```typescript
function generateFunctionalRequirements(
  featureName: string,
  criteria: AcceptanceCriterion[]
): FunctionalRequirement[] {

  const requirements: FunctionalRequirement[] = [];
  let reqNumber = 1;

  // Group criteria by category
  const categorized = {
    'happy-path': criteria.filter(c => c.category === 'happy-path'),
    'error-handling': criteria.filter(c => c.category === 'error-handling'),
    'edge-case': criteria.filter(c => c.category === 'edge-case'),
    'security': criteria.filter(c => c.category === 'security')
  };

  // Create requirements from happy path criteria
  for (const criterion of categorized['happy-path']) {
    requirements.push({
      id: `FR-${reqNumber++}`,
      statement: `${criterion.type} ${criterion.condition}, the system ${criterion.action}`,
      acceptanceCriteria: [criterion.id],
      priority: 'must-have'
    });
  }

  // Create requirements from error handling
  if (categorized['error-handling'].length > 0) {
    requirements.push({
      id: `FR-${reqNumber++}`,
      statement: 'The system SHALL handle all error conditions gracefully with user-friendly messages',
      acceptanceCriteria: categorized['error-handling'].map(c => c.id),
      priority: 'must-have'
    });
  }

  // Create requirements from security criteria
  if (categorized['security'].length > 0) {
    requirements.push({
      id: `FR-${reqNumber++}`,
      statement: 'The system SHALL enforce appropriate access controls and permissions',
      acceptanceCriteria: categorized['security'].map(c => c.id),
      priority: 'must-have'
    });
  }

  return requirements;
}
```

### Generate Non-Functional Requirements

```typescript
function generateNonFunctionalRequirements(
  featureName: string,
  answers: Record<string, string>
): NonFunctionalRequirement[] {

  const requirements: NonFunctionalRequirement[] = [];
  let reqNumber = 1;

  // Performance
  const performance = answers['What are the performance or quality expectations?'];
  if (performance) {
    requirements.push({
      id: `NFR-${reqNumber++}`,
      type: 'Performance',
      statement: performance,
      priority: 'should-have'
    });
  }

  // High load handling
  const highLoad = answers['What happens under high load or concurrent access?'];
  if (highLoad) {
    requirements.push({
      id: `NFR-${reqNumber++}`,
      type: 'Scalability',
      statement: highLoad,
      priority: 'should-have'
    });
  }

  // Always include these baseline NFRs
  requirements.push({
    id: `NFR-${reqNumber++}`,
    type: 'Usability',
    statement: 'The feature SHALL provide clear user feedback and intuitive interactions',
    priority: 'must-have'
  });

  requirements.push({
    id: `NFR-${reqNumber++}`,
    type: 'Maintainability',
    statement: 'The code SHALL follow project coding standards and be well-documented',
    priority: 'must-have'
  });

  return requirements;
}
```

### Compile Requirements Document

```typescript
function compileRequirementsDocument(data: {
  template: string;
  featureName: string;
  description: string;
  userStories: UserStory[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  edgeCases: string[];
  outOfScope: string[];
}): string {

  let content = data.template;

  // Replace basic placeholders
  content = content.replace(/\[FeatureName\]/g, data.featureName);
  content = content.replace(/\[feature-name\]/g, data.featureName);
  content = content.replace(/\[Date\]/g, new Date().toISOString().split('T')[0]);
  content = content.replace(/\[Description\]/g, data.description);

  // Build user stories section
  let storiesSection = '';
  for (const story of data.userStories) {
    storiesSection += `\n### Story ${story.id}: ${story.title}\n\n`;
    storiesSection += `**As a** ${story.asA}\n`;
    storiesSection += `**I want to** ${story.iWantTo}\n`;
    storiesSection += `**So that** ${story.soThat}\n\n`;
    storiesSection += `**Acceptance Criteria**:\n\n`;

    for (const criterion of story.acceptanceCriteria) {
      const earsFmt = formatEARSCriterion(criterion);
      storiesSection += `${earsFmt}\n`;
    }
  }

  // Build functional requirements section
  let frSection = '';
  for (const req of data.functionalRequirements) {
    frSection += `- **${req.id}**: ${req.statement}\n`;
  }

  // Build non-functional requirements section
  let nfrSection = '';
  for (const req of data.nonFunctionalRequirements) {
    nfrSection += `- **${req.id}** (${req.type}): ${req.statement}\n`;
  }

  // Build edge cases section
  let edgeCasesSection = '';
  for (const edgeCase of data.edgeCases) {
    edgeCasesSection += `- ${edgeCase}\n`;
  }

  // Build out of scope section
  let outOfScopeSection = '';
  for (const item of data.outOfScope) {
    outOfScopeSection += `- ${item}\n`;
  }

  // Replace sections in template
  content = content.replace(/\[UserStories\]/g, storiesSection);
  content = content.replace(/\[FunctionalRequirements\]/g, frSection);
  content = content.replace(/\[NonFunctionalRequirements\]/g, nfrSection);
  content = content.replace(/\[EdgeCases\]/g, edgeCasesSection || '- TBD');
  content = content.replace(/\[OutOfScope\]/g, outOfScopeSection || '- TBD');

  return content;
}

function formatEARSCriterion(criterion: AcceptanceCriterion): string {
  return `${criterion.id}. ${criterion.type} ${criterion.condition}, ${criterion.action}`;
}
```

### Validation

```typescript
function validateRequirements(content: string): string[] {
  const issues = [];

  // Check for unfilled placeholders
  if (content.includes('[') && content.includes(']')) {
    if (content.match(/\[[A-Z][a-zA-Z]+\]/)) {
      issues.push('Contains unfilled placeholders');
    }
  }

  // Check for EARS notation
  const hasEARS = content.includes('WHEN') || content.includes('IF') ||
                  content.includes('WHILE') || content.includes('SHALL');
  if (!hasEARS) {
    issues.push('Missing EARS notation (WHEN/IF/WHILE/SHALL)');
  }

  // Check for user stories
  if (!content.includes('As a') || !content.includes('I want to')) {
    issues.push('Missing proper user story format');
  }

  // Check for numbered acceptance criteria
  const hasNumberedCriteria = /AC-\d+/.test(content) || /\d+\.\s+(WHEN|IF|WHILE)/.test(content);
  if (!hasNumberedCriteria) {
    issues.push('Acceptance criteria should be numbered for traceability');
  }

  // Check minimum length
  if (content.length < 1000) {
    issues.push('Requirements document seems too short - consider adding more detail');
  }

  return issues;
}
```

### Extract Edge Cases

```typescript
function extractEdgeCases(answers: Record<string, string>): string[] {
  const edgeCases = [];

  const invalid = answers['What happens with invalid or missing inputs?'];
  if (invalid && invalid !== 'Not specified') {
    edgeCases.push(`Invalid inputs: ${invalid}`);
  }

  const duplicate = answers['What happens with duplicate or conflicting data?'];
  if (duplicate && duplicate !== 'Not specified') {
    edgeCases.push(`Duplicate data: ${duplicate}`);
  }

  const boundaries = answers['Are there any boundary conditions (min/max values, limits)?'];
  if (boundaries && boundaries !== 'Not specified') {
    edgeCases.push(`Boundary conditions: ${boundaries}`);
  }

  return edgeCases;
}
```

### Get Inline Template

```typescript
function getInlineRequirementsTemplate(): string {
  return `# Requirements: [FeatureName]

**Feature**: [feature-name]
**Created**: [Date]
**Status**: Draft

## Overview

[Description]

## User Stories

[UserStories]

## Functional Requirements

[FunctionalRequirements]

## Non-Functional Requirements

[NonFunctionalRequirements]

## Edge Cases

[EdgeCases]

## Out of Scope

[OutOfScope]
`;
}
```

## Type Definitions

```typescript
interface UserStory {
  id: number;
  title: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: AcceptanceCriterion[];
}

interface AcceptanceCriterion {
  id: string;
  type: 'WHEN' | 'WHILE' | 'IF';
  condition: string;
  action: string; // Should include SHALL
  category: 'happy-path' | 'error-handling' | 'edge-case' | 'performance' | 'security';
}

interface FunctionalRequirement {
  id: string;
  statement: string;
  acceptanceCriteria: string[];
  priority: 'must-have' | 'should-have' | 'could-have';
}

interface NonFunctionalRequirement {
  id: string;
  type: string;
  statement: string;
  priority: 'must-have' | 'should-have' | 'could-have';
}
```

## Requirements Satisfied

- ✅ FR-5.3.1: Creates feature directory and requirements.md for new features
- ✅ FR-5.3.2: Updates existing requirements.md for existing features
- ✅ FR-5.3.3: Generates requirements using EARS notation with numbered criteria
- ✅ FR-5.3.4: Asks clarifying questions to elicit edge cases and acceptance criteria
- ✅ FR-5.3.5: Includes user stories with proper format and validates quality
- ✅ Requirement 1: Command execution control (STOP after completion, asks permission)
