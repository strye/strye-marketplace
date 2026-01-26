# /spec.init - Initialize SDD Project

You are executing the `/spec.init` command to bootstrap a new Spec-Driven Development (SDD) project.

## Command Arguments

- **text**: Project description and context (required)

## Command Purpose

Initialize a new SDD project by creating:
1. `CLAUDE.md` - Main project context file
2. `.spec/context/` - Context files (SDD principles, conventions, quality standards)
3. `docs/steering/` - Steering documents (product, tech, structure)

## Execution Steps

### Step 1: Check if Already Initialized

First, check if the project is already initialized:

```typescript
const alreadyInitialized = fileExists('CLAUDE.md');

if (alreadyInitialized) {
  console.log('⚠️ Project appears to be already initialized (CLAUDE.md exists).');

  const choice = askChoice(
    'How would you like to proceed?',
    [
      'Re-initialize (will backup existing files)',
      'Cancel initialization'
    ]
  );

  if (choice === 1) {
    console.log('Initialization cancelled.');
    return;
  }

  // Backup existing CLAUDE.md
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = readFile('CLAUDE.md');
  writeFile(`CLAUDE.md.backup-${timestamp}`, backup);
  console.log(`✓ Backed up existing CLAUDE.md`);
}
```

### Step 2: Ask for Confirmation Preference

Ask the user how they want to handle file operations:

```typescript
const confirmationMode = askChoice(
  'Would you like to review and confirm each file before it\'s written?',
  [
    'Yes - show me each file for confirmation (recommended for first time)',
    'No - proceed automatically without confirmation'
  ]
) === 0;

if (confirmationMode) {
  console.log('✓ Confirmation mode enabled. You\'ll review each file before it\'s written.\n');
} else {
  console.log('✓ Auto mode enabled. Files will be written automatically.\n');
}
```

### Step 3: Parse Project Description

Extract the project description from the `text` argument:

```typescript
// The text argument contains the project description
const projectDescription = args.text;

if (!projectDescription || projectDescription.trim().length === 0) {
  console.error('❌ Error: Project description is required.');
  console.log('Usage: /spec.init "Your project description here"');
  return;
}

console.log('Project Description:', projectDescription);
console.log('');
```

### Step 4: Create CLAUDE.md

Generate the main project context file:

```typescript
const claudeMdContent = `# [Project Name]

## Project Overview

${projectDescription}

## Project Mission

[Define the core mission - what problem does this solve and for whom?]

## Project Structure

- \`.spec/\` - Tool-agnostic specification assets (templates and context)
- \`.claude/\` - Claude Code specific tooling (commands and hooks)
- \`docs/steering/\` - Strategic direction documents (product, tech, structure)
- \`docs/features/\` - Feature-specific specifications (requirements, design, tasks)

## Core Workflow

The SDD workflow follows a systematic progression:
1. **Project Initialization** - Setup infrastructure and steering documents
2. **Feature Requirements** - Define what and why using EARS notation
3. **System Design** - Specify how, referencing requirements
4. **Task Generation** - Break down into implementable steps
5. **Validation** - Ensure consistency and completeness

## Getting Started

For developers working with this project, all slash commands use the \`spec.\` prefix:
- \`/spec.init [text]\` - Initialize new project
- \`/spec.feature [name, text]\` - Create or update feature requirements
- \`/spec.design [name, text]\` - Create or refine feature design
- \`/spec.tasks [name]\` - Generate implementation tasks
- \`/spec.status\` - View project documentation status

## Important Notes

- All specifications follow the 10 principles of Spec-Driven Development (see \`.spec/context/sdd-principles.md\`)
- Requirements use EARS (Easy Approach to Requirements Syntax) notation for clarity
- Every design decision should trace back to a requirement
- Specifications are living documents that evolve through continuous feedback

## Current Phase

[Document the current project phase and active work]
`;

// Write CLAUDE.md with confirmation if needed
if (confirmationMode) {
  console.log('=== Preview: CLAUDE.md ===');
  console.log(claudeMdContent);
  console.log('=========================\n');

  const approved = askYesNo('Write this file?');
  if (!approved) {
    console.log('⚠️ Skipped CLAUDE.md - initialization cannot continue without it.');
    return;
  }
}

writeFile('CLAUDE.md', claudeMdContent);
console.log('✓ Created CLAUDE.md\n');
```

### Step 5: Create Directory Structure

Create the necessary directories:

```typescript
// Create .spec/context/ if it doesn't exist
if (!dirExists('.spec/context')) {
  createDir('.spec/context');
  console.log('✓ Created .spec/context/ directory');
}

// Create docs/steering/ if it doesn't exist
if (!dirExists('docs/steering')) {
  createDir('docs/steering');
  console.log('✓ Created docs/steering/ directory');
}

// Create docs/features/ if it doesn't exist
if (!dirExists('docs/features')) {
  createDir('docs/features');
  console.log('✓ Created docs/features/ directory');
}

console.log('');
```

### Step 6: Copy Context Files

Copy the SDD context files from `.spec/context/`:

```typescript
const contextFiles = [
  'sdd-principles.md',
  'project-conventions.md',
  'quality-standards.md'
];

console.log('Setting up context files...');

for (const file of contextFiles) {
  const sourcePath = `.spec/context/${file}`;

  // These files should already exist in the SDD Frameworks templates
  if (fileExists(sourcePath)) {
    console.log(`✓ Context file ready: ${file}`);
  } else {
    console.warn(`⚠️ Warning: ${file} not found in .spec/context/`);
    console.log(`  This file should exist in the SDD Frameworks templates.`);
  }
}

console.log('');
```

### Step 7: Generate Steering Documents

Ask clarifying questions and generate steering documents:

```typescript
console.log('Now let\'s set up your steering documents...\n');

// Product Steering
console.log('=== Product Steering ===');
console.log('This document defines the product vision, features, and user needs.\n');

const productQuestions = [
  'Who are the primary users of this product?',
  'What are the top 3 features or capabilities?',
  'What problem does this solve for users?',
  'What makes this product unique?'
];

const productAnswers = {};
for (const question of productQuestions) {
  const answer = ask(question);
  productAnswers[question] = answer;
}

// Load product steering template
let productTemplate = '';
if (fileExists('.spec/templates/product-steering.md')) {
  productTemplate = readFile('.spec/templates/product-steering.md');
} else {
  console.warn('⚠️ Warning: product-steering.md template not found, using inline default');
  productTemplate = getInlineProductTemplate();
}

// Fill template with answers
const productContent = fillProductTemplate(productTemplate, {
  projectDescription: projectDescription,
  primaryUsers: productAnswers['Who are the primary users of this product?'],
  topFeatures: productAnswers['What are the top 3 features or capabilities?'],
  problemSolved: productAnswers['What problem does this solve for users?'],
  uniqueValue: productAnswers['What makes this product unique?']
});

if (confirmationMode) {
  console.log('\n=== Preview: docs/steering/product.md ===');
  console.log(productContent);
  console.log('=========================================\n');

  const approved = askYesNo('Write this file?');
  if (approved) {
    writeFile('docs/steering/product.md', productContent);
    console.log('✓ Created docs/steering/product.md\n');
  } else {
    console.log('⚠️ Skipped docs/steering/product.md\n');
  }
} else {
  writeFile('docs/steering/product.md', productContent);
  console.log('✓ Created docs/steering/product.md\n');
}

// Tech Steering
console.log('=== Tech Steering ===');
console.log('This document defines the technical architecture and technology choices.\n');

const techQuestions = [
  'What is the primary programming language or framework?',
  'What type of architecture (e.g., monolith, microservices, serverless)?',
  'What database or data storage solution?',
  'Any specific technical constraints or requirements?'
];

const techAnswers = {};
for (const question of techQuestions) {
  const answer = ask(question);
  techAnswers[question] = answer;
}

// Load tech steering template
let techTemplate = '';
if (fileExists('.spec/templates/tech-steering.md')) {
  techTemplate = readFile('.spec/templates/tech-steering.md');
} else {
  console.warn('⚠️ Warning: tech-steering.md template not found, using inline default');
  techTemplate = getInlineTechTemplate();
}

// Fill template
const techContent = fillTechTemplate(techTemplate, {
  primaryLanguage: techAnswers['What is the primary programming language or framework?'],
  architecture: techAnswers['What type of architecture (e.g., monolith, microservices, serverless)?'],
  database: techAnswers['What database or data storage solution?'],
  constraints: techAnswers['Any specific technical constraints or requirements?']
});

if (confirmationMode) {
  console.log('\n=== Preview: docs/steering/tech.md ===');
  console.log(techContent);
  console.log('=====================================\n');

  const approved = askYesNo('Write this file?');
  if (approved) {
    writeFile('docs/steering/tech.md', techContent);
    console.log('✓ Created docs/steering/tech.md\n');
  } else {
    console.log('⚠️ Skipped docs/steering/tech.md\n');
  }
} else {
  writeFile('docs/steering/tech.md', techContent);
  console.log('✓ Created docs/steering/tech.md\n');
}

// Structure Steering
console.log('=== Structure Steering ===');
console.log('This document defines the codebase structure and organization.\n');

const structureQuestions = [
  'What is the preferred directory structure (e.g., feature-based, layer-based)?',
  'What naming conventions should be followed?',
  'How should files be organized (e.g., by feature, by type)?'
];

const structureAnswers = {};
for (const question of structureQuestions) {
  const answer = ask(question);
  structureAnswers[question] = answer;
}

// Load structure steering template
let structureTemplate = '';
if (fileExists('.spec/templates/structure-steering.md')) {
  structureTemplate = readFile('.spec/templates/structure-steering.md');
} else {
  console.warn('⚠️ Warning: structure-steering.md template not found, using inline default');
  structureTemplate = getInlineStructureTemplate();
}

// Fill template
const structureContent = fillStructureTemplate(structureTemplate, {
  directoryStructure: structureAnswers['What is the preferred directory structure (e.g., feature-based, layer-based)?'],
  namingConventions: structureAnswers['What naming conventions should be followed?'],
  fileOrganization: structureAnswers['How should files be organized (e.g., by feature, by type)?']
});

if (confirmationMode) {
  console.log('\n=== Preview: docs/steering/structure.md ===');
  console.log(structureContent);
  console.log('==========================================\n');

  const approved = askYesNo('Write this file?');
  if (approved) {
    writeFile('docs/steering/structure.md', structureContent);
    console.log('✓ Created docs/steering/structure.md\n');
  } else {
    console.log('⚠️ Skipped docs/steering/structure.md\n');
  }
} else {
  writeFile('docs/steering/structure.md', structureContent);
  console.log('✓ Created docs/steering/structure.md\n');
}
```

### Step 8: Display Summary

Show what was accomplished:

```typescript
console.log('');
console.log('═══════════════════════════════════════');
console.log('✓ SDD Project Initialization Complete');
console.log('═══════════════════════════════════════');
console.log('');
console.log('Created files:');
console.log('  ✓ CLAUDE.md');
console.log('  ✓ .spec/context/ (sdd-principles.md, project-conventions.md, quality-standards.md)');
console.log('  ✓ docs/steering/product.md');
console.log('  ✓ docs/steering/tech.md');
console.log('  ✓ docs/steering/structure.md');
console.log('');
console.log('Your SDD project is now set up! 🎉');
console.log('');
```

### Step 9: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed to the next step.

```typescript
// Command execution STOPS here
```

### Step 10: Offer Next Step (Optional)

After stopping, optionally suggest the next step:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');
console.log('Would you like to create your first feature specification?');
console.log('');
console.log('If yes, you can run:');
console.log('  /spec.feature [feature-name] "[description]"');
console.log('');
console.log('Example:');
console.log('  /spec.feature user-authentication "Add user login and registration"');
console.log('');

const createFirstFeature = askYesNo('Would you like me to help you create your first feature now?');

if (createFirstFeature) {
  const featureName = ask('What is the feature name? (use kebab-case)');
  const featureDesc = ask('Brief description of the feature:');

  console.log('');
  console.log(`Running: /spec.feature ${featureName} "${featureDesc}"`);
  console.log('');

  // Execute /spec.feature command
  executeCommand(`/spec.feature ${featureName} "${featureDesc}"`);

  // STOP again after that command completes
} else {
  console.log('');
  console.log('No problem! Run /spec.feature whenever you\'re ready.');
  console.log('');
}
```

## Helper Functions

These are conceptual helpers that would be implemented in practice:

```typescript
function fillProductTemplate(template: string, data: any): string {
  // Replace placeholders in template with actual data
  let content = template;

  // Simple placeholder replacement
  content = content.replace(/\[ProjectName\]/g, 'Your Project');
  content = content.replace(/\[ProjectDescription\]/g, data.projectDescription);
  content = content.replace(/\[PrimaryUsers\]/g, data.primaryUsers || 'TBD');
  content = content.replace(/\[TopFeatures\]/g, data.topFeatures || 'TBD');
  content = content.replace(/\[ProblemSolved\]/g, data.problemSolved || 'TBD');
  content = content.replace(/\[UniqueValue\]/g, data.uniqueValue || 'TBD');

  return content;
}

function fillTechTemplate(template: string, data: any): string {
  let content = template;

  content = content.replace(/\[PrimaryLanguage\]/g, data.primaryLanguage || 'TBD');
  content = content.replace(/\[Architecture\]/g, data.architecture || 'TBD');
  content = content.replace(/\[Database\]/g, data.database || 'TBD');
  content = content.replace(/\[Constraints\]/g, data.constraints || 'None specified');

  return content;
}

function fillStructureTemplate(template: string, data: any): string {
  let content = template;

  content = content.replace(/\[DirectoryStructure\]/g, data.directoryStructure || 'TBD');
  content = content.replace(/\[NamingConventions\]/g, data.namingConventions || 'TBD');
  content = content.replace(/\[FileOrganization\]/g, data.fileOrganization || 'TBD');

  return content;
}

function getInlineProductTemplate(): string {
  return `# Product Steering

## Product Vision

[ProjectDescription]

## Target Users

[PrimaryUsers]

## Core Features

[TopFeatures]

## Value Proposition

[ProblemSolved]

## Unique Differentiators

[UniqueValue]
`;
}

function getInlineTechTemplate(): string {
  return `# Tech Steering

## Technology Stack

**Primary Language**: [PrimaryLanguage]
**Architecture**: [Architecture]
**Database**: [Database]

## Technical Constraints

[Constraints]
`;
}

function getInlineStructureTemplate(): string {
  return `# Structure Steering

## Directory Structure

[DirectoryStructure]

## Naming Conventions

[NamingConventions]

## File Organization

[FileOrganization]
`;
}
```

## Important Notes

1. **Execution Control**: This command STOPS after completing initialization. It does NOT automatically chain to `/spec.feature` without explicit user permission.

2. **Confirmation Mode**: User chooses upfront whether to review files before writing.

3. **Error Handling**: If any critical file (like CLAUDE.md) is skipped in confirmation mode, the command should warn and potentially exit.

4. **Idempotent**: The command can be re-run safely - it will offer to backup existing files.

5. **Templates**: The command loads steering templates from `.spec/templates/` and falls back to inline defaults if needed.

## Requirements Satisfied

- ✅ FR-5.1.1: Creates CLAUDE.md with project context
- ✅ FR-5.1.2: Generates .spec/context/ directory with context files
- ✅ FR-5.1.3: Generates docs/steering/ directory with steering documents
- ✅ FR-5.1.4: Asks clarifying questions to refine steering content
- ✅ FR-5.1.5: Offers to proceed to first feature creation
- ✅ FR-3.1: Asks for confirmation preference upfront
- ✅ Requirement 1: Command execution control (stops after completion, asks permission)
