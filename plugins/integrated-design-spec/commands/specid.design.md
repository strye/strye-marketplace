# /spec.design - Create or Refine System Design

You are executing the `/spec.design` command to create or refine system design that traces back to requirements and aligns with steering documents.

## Command Arguments

- **name**: Feature name (required)
- **text**: Optional design guidance or refinement instructions

## Command Purpose

Create or update design in `docs/features/[name]/design.md`:
- Read requirements and extract requirement IDs
- Read steering documents (tech.md, structure.md) for constraints
- Generate component architecture
- Define data models with TypeScript interfaces
- Specify error handling strategies
- Include test strategy
- Reference specific requirement IDs throughout
- Validate requirement traceability

## Execution Steps

### Step 1: Parse and Validate Arguments

```typescript
const featureName = args.name;
const designGuidance = args.text || '';

if (!featureName || featureName.trim().length === 0) {
  console.error('❌ Error: Feature name is required.');
  console.log('Usage: /spec.design [name] "[optional guidance]"');
  console.log('Example: /spec.design user-auth');
  console.log('Example: /spec.design user-auth "Use JWT tokens for sessions"');
  return;
}

console.log('Feature:', featureName);
if (designGuidance) {
  console.log('Design Guidance:', designGuidance);
}
console.log('');
```

### Step 2: Validate Feature Exists

```typescript
const featurePath = `docs/features/${featureName}`;
const requirementsPath = `${featurePath}/requirements.md`;
const designPath = `${featurePath}/design.md`;

if (!dirExists(featurePath)) {
  console.error(`❌ Error: Feature '${featureName}' does not exist.`);
  console.log('');
  console.log(`Create the feature first with:`);
  console.log(`  /spec.feature ${featureName} "[description]"`);
  return;
}

console.log(`✓ Feature directory found: ${featurePath}`);
console.log('');
```

### Step 3: Check Dependencies (FR-1.1)

```typescript
// Check if requirements.md exists
if (!fileExists(requirementsPath)) {
  console.error('❌ Missing dependency: requirements.md');
  console.log('');
  console.log('Design requires requirements to exist first.');
  console.log('');
  console.log('To create requirements, run:');
  console.log(`  /spec.feature ${featureName} "[feature description]"`);
  console.log('');

  // Offer to auto-run prerequisite (FR-1.4)
  const autoRun = askYesNo('Would you like me to create the requirements now?');

  if (autoRun) {
    const description = ask('Brief feature description:');
    console.log('');
    console.log(`Running: /spec.feature ${featureName} "${description}"`);
    console.log('');

    executeCommand(`/spec.feature ${featureName} "${description}"`);

    // After auto-run completes, continue with design
    console.log('');
    console.log('Requirements created! Continuing with design...');
    console.log('');
  } else {
    console.log('Cancelled. Please create requirements first.');
    return;
  }
}

console.log(`✓ Requirements found: ${requirementsPath}`);
console.log('');
```

### Step 4: Read and Parse Requirements

```typescript
console.log('Reading requirements...');

const requirementsContent = readFile(requirementsPath);

// Parse requirement IDs
const requirementIds = extractRequirementIds(requirementsContent);

console.log(`✓ Found ${requirementIds.length} requirements`);
console.log(`  Requirement IDs: ${requirementIds.slice(0, 5).join(', ')}${requirementIds.length > 5 ? '...' : ''}`);
console.log('');

// Parse user stories for context
const userStories = extractUserStories(requirementsContent);
console.log(`✓ Found ${userStories.length} user stories`);
console.log('');
```

### Step 5: Read Steering Documents

```typescript
console.log('Reading steering documents...');

let techSteering = '';
let structureSteering = '';

if (fileExists('docs/steering/tech.md')) {
  techSteering = readFile('docs/steering/tech.md');
  console.log('✓ Loaded tech.md (technical constraints)');
} else {
  console.warn('⚠️ Warning: tech.md not found - design may not align with tech stack');
}

if (fileExists('docs/steering/structure.md')) {
  structureSteering = readFile('docs/steering/structure.md');
  console.log('✓ Loaded structure.md (organizational guidance)');
} else {
  console.warn('⚠️ Warning: structure.md not found - design may not follow conventions');
}

console.log('');
```

### Step 6: Load Design Template

```typescript
const templatePath = '.spec/templates/design-template.md';
let template = '';
let templateSource = '';

if (fileExists(templatePath)) {
  template = readFile(templatePath);
  templateSource = 'custom template';
  console.log(`✓ Loaded template from ${templatePath}`);
} else {
  console.warn('⚠️ Warning: design-template.md not found');

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

  template = getInlineDesignTemplate();
  templateSource = 'inline default';
  console.log('⚠️ Using inline default template');
}

console.log('');
```

### Step 7: Check if Design Exists (New vs Update)

```typescript
const isNewDesign = !fileExists(designPath);
let existingDesign = '';

if (isNewDesign) {
  console.log('📝 Creating new design...');
  console.log('');
} else {
  existingDesign = readFile(designPath);
  console.log('✓ Existing design found - will refine');
  console.log('');
}
```

### Step 8: Generate/Refine Design

```typescript
console.log('Generating design architecture...');
console.log('');

// Extract technical constraints from steering
const techConstraints = extractTechConstraints(techSteering);
const structureGuidelines = extractStructureGuidelines(structureSteering);

// Generate component architecture
const components = generateComponents(
  requirementsContent,
  userStories,
  requirementIds,
  techConstraints,
  designGuidance
);

console.log(`✓ Generated ${components.length} components`);
for (const component of components) {
  console.log(`  - ${component.name}: ${component.purpose}`);
}
console.log('');

// Generate data models
const dataModels = generateDataModels(
  requirementsContent,
  components,
  techConstraints
);

console.log(`✓ Generated ${dataModels.length} data models`);
for (const model of dataModels) {
  console.log(`  - ${model.name}`);
}
console.log('');

// Generate error handling strategy
const errorHandling = generateErrorHandling(
  requirementsContent,
  components
);

console.log(`✓ Defined error handling for ${errorHandling.length} error types`);
console.log('');

// Generate test strategy
const testStrategy = generateTestStrategy(
  components,
  requirementIds
);

console.log('✓ Created comprehensive test strategy');
console.log('');
```

### Step 9: Compile Design Document

```typescript
const designContent = compileDesignDocument({
  template: template,
  featureName: featureName,
  requirements: requirementsContent,
  requirementIds: requirementIds,
  userStories: userStories,
  components: components,
  dataModels: dataModels,
  errorHandling: errorHandling,
  testStrategy: testStrategy,
  techConstraints: techConstraints,
  structureGuidelines: structureGuidelines,
  designGuidance: designGuidance
});

console.log('✓ Compiled design document');
console.log('');
```

### Step 10: Validate Requirement Traceability (FR-5.4.3)

```typescript
console.log('Validating requirement traceability...');
console.log('');

const traceability = validateRequirementTraceability(
  requirementIds,
  designContent
);

if (traceability.uncoveredRequirements.length > 0) {
  console.warn(`⚠️ Warning: ${traceability.uncoveredRequirements.length} requirements not referenced in design:`);
  for (const reqId of traceability.uncoveredRequirements.slice(0, 5)) {
    console.warn(`  - ${reqId}`);
  }
  if (traceability.uncoveredRequirements.length > 5) {
    console.warn(`  ... and ${traceability.uncoveredRequirements.length - 5} more`);
  }
  console.log('');
  console.warn('Consider adding design sections that address these requirements.');
  console.log('');

  const proceedAnyway = askYesNo('Proceed with incomplete traceability?');
  if (!proceedAnyway) {
    console.log('Cancelled. Please refine the design to cover all requirements.');
    return;
  }
  console.log('');
} else {
  console.log('✓ All requirements are traced in design');
  console.log('');
}
```

### Step 11: Ask for Confirmation Preference

```typescript
const confirmationMode = askChoice(
  'Would you like to review the design before it\'s written?',
  [
    'Yes - show me the design for confirmation',
    'No - proceed automatically'
  ]
) === 0;

console.log('');
```

### Step 12: Show Preview and Write File

```typescript
if (confirmationMode) {
  console.log('═══════════════════════════════════════');
  console.log('Design Preview');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(designContent);
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('');

  const approved = askYesNo('Write this design?');
  if (!approved) {
    console.log('⚠️ Cancelled - design not written');
    return;
  }
  console.log('');
}

// Write design file
writeFile(designPath, designContent);
console.log(`✓ ${isNewDesign ? 'Created' : 'Updated'} ${designPath} (using ${templateSource})`);
console.log('');
```

### Step 13: Display Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ System Design Complete');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Feature: ${featureName}`);
console.log(`Location: ${designPath}`);
console.log('');
console.log('Summary:');
console.log(`  - ${components.length} components designed`);
console.log(`  - ${dataModels.length} data models defined`);
console.log(`  - ${requirementIds.length} requirements traced`);
console.log(`  - ${traceability.coveredRequirements.length}/${requirementIds.length} requirements covered (${Math.round(traceability.coverage * 100)}%)`);
console.log('');
```

### Step 14: STOP EXECUTION

```typescript
// Command execution STOPS here
```

### Step 15: Offer Next Step (Optional)

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');
console.log('Design is complete! Ready to generate implementation tasks?');
console.log('');
console.log('The tasks phase will create a step-by-step implementation');
console.log('plan based on this design.');
console.log('');

const proceedToTasks = askYesNo(`Would you like to generate tasks for ${featureName}?`);

if (proceedToTasks) {
  console.log('');
  console.log(`Running: /spec.tasks ${featureName}`);
  console.log('');

  executeCommand(`/spec.tasks ${featureName}`);
  // STOP again after that command completes
} else {
  console.log('');
  console.log(`No problem! Run \`/spec.tasks ${featureName}\` when you're ready.`);
  console.log('');
}
```

## Helper Functions

### Extract Requirement IDs

```typescript
function extractRequirementIds(requirementsContent: string): string[] {
  const ids: string[] = [];
  const regex = /\b([FN]R-\d+(?:\.\d+)*|AC-\d+)\b/g;
  let match;

  while ((match = regex.exec(requirementsContent)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }

  return ids.sort();
}
```

### Extract User Stories

```typescript
function extractUserStories(requirementsContent: string): UserStory[] {
  const stories: UserStory[] = [];
  const lines = requirementsContent.split('\n');

  let currentStory: Partial<UserStory> | null = null;

  for (const line of lines) {
    if (line.match(/^### Story \d+:/)) {
      if (currentStory) stories.push(currentStory as UserStory);
      currentStory = { title: line.replace(/^### Story \d+:\s*/, '') };
    } else if (line.startsWith('**As a**') && currentStory) {
      currentStory.asA = line.replace(/^\*\*As a\*\*\s*/, '');
    } else if (line.startsWith('**I want to**') && currentStory) {
      currentStory.iWantTo = line.replace(/^\*\*I want to\*\*\s*/, '');
    } else if (line.startsWith('**So that**') && currentStory) {
      currentStory.soThat = line.replace(/^\*\*So that\*\*\s*/, '');
    }
  }

  if (currentStory) stories.push(currentStory as UserStory);
  return stories;
}
```

### Generate Components

```typescript
function generateComponents(
  requirementsContent: string,
  userStories: UserStory[],
  requirementIds: string[],
  techConstraints: TechConstraints,
  designGuidance: string
): Component[] {

  const components: Component[] = [];

  // Analyze requirements to identify needed components
  const needsAuth = /authenticat|login|user|permission|access/i.test(requirementsContent);
  const needsData = /store|save|persist|database|retrieve/i.test(requirementsContent);
  const needsUI = /display|show|view|interface|form/i.test(requirementsContent);
  const needsAPI = /api|endpoint|request|response|http/i.test(requirementsContent);
  const needsValidation = /validat|verify|check|ensure/i.test(requirementsContent);

  // Generate components based on needs
  if (needsUI) {
    components.push({
      name: 'UIComponent',
      type: 'presentation',
      purpose: 'User interface for feature interactions',
      responsibilities: [
        'Render user interface',
        'Handle user input',
        'Display feedback and errors',
        'Manage component state'
      ],
      interfaces: generateComponentInterface('UIComponent', techConstraints),
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  if (needsAPI) {
    components.push({
      name: 'APIService',
      type: 'service',
      purpose: 'Handle API communication and data fetching',
      responsibilities: [
        'Make HTTP requests',
        'Handle responses and errors',
        'Transform data formats',
        'Manage request lifecycle'
      ],
      interfaces: generateComponentInterface('APIService', techConstraints),
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  if (needsData) {
    components.push({
      name: 'DataStore',
      type: 'data',
      purpose: 'Manage data persistence and retrieval',
      responsibilities: [
        'Store and retrieve data',
        'Ensure data consistency',
        'Handle data migrations',
        'Provide data access layer'
      ],
      interfaces: generateComponentInterface('DataStore', techConstraints),
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  if (needsValidation) {
    components.push({
      name: 'ValidationService',
      type: 'utility',
      purpose: 'Validate inputs and business rules',
      responsibilities: [
        'Validate user inputs',
        'Enforce business rules',
        'Provide error messages',
        'Sanitize data'
      ],
      interfaces: generateComponentInterface('ValidationService', techConstraints),
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  if (needsAuth) {
    components.push({
      name: 'AuthService',
      type: 'service',
      purpose: 'Handle authentication and authorization',
      responsibilities: [
        'Authenticate users',
        'Manage sessions/tokens',
        'Check permissions',
        'Handle auth errors'
      ],
      interfaces: generateComponentInterface('AuthService', techConstraints),
      requirementRefs: requirementIds.filter(id => id.startsWith('FR'))
    });
  }

  return components;
}
```

### Generate Component Interface

```typescript
function generateComponentInterface(
  componentName: string,
  techConstraints: TechConstraints
): string {

  // Generate TypeScript interface based on component type
  const interfaces: Record<string, string> = {
    UIComponent: `interface ${componentName}Props {
  data: any;
  onAction: (action: string) => void;
  isLoading: boolean;
  error?: Error;
}

interface ${componentName}State {
  localData: any;
  isValid: boolean;
}`,

    APIService: `interface ${componentName} {
  fetch(endpoint: string, options?: RequestOptions): Promise<Response>;
  post(endpoint: string, data: any): Promise<Response>;
  handleError(error: Error): ErrorResponse;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}`,

    DataStore: `interface ${componentName} {
  save(key: string, value: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}`,

    ValidationService: `interface ${componentName} {
  validate(data: any, rules: ValidationRules): ValidationResult;
  sanitize(input: string): string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}`,

    AuthService: `interface ${componentName} {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  checkPermission(resource: string): boolean;
  getCurrentUser(): User | null;
}`
  };

  return interfaces[componentName] || `interface ${componentName} {\n  // Define interface\n}`;
}
```

### Generate Data Models

```typescript
function generateDataModels(
  requirementsContent: string,
  components: Component[],
  techConstraints: TechConstraints
): DataModel[] {

  const models: DataModel[] = [];

  // Identify entities from requirements
  const hasUser = /user|account|profile/i.test(requirementsContent);
  const hasSession = /session|login|token/i.test(requirementsContent);
  const hasData = /data|record|item|entity/i.test(requirementsContent);

  if (hasUser) {
    models.push({
      name: 'User',
      description: 'User account and profile information',
      interface: `interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}`
    });
  }

  if (hasSession) {
    models.push({
      name: 'Session',
      description: 'User session and authentication data',
      interface: `interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}`
    });
  }

  // Generic data model if needed
  if (hasData && models.length === 0) {
    models.push({
      name: 'DataEntity',
      description: 'Core data entity for the feature',
      interface: `interface DataEntity {
  id: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}`
    });
  }

  return models;
}
```

### Generate Error Handling

```typescript
function generateErrorHandling(
  requirementsContent: string,
  components: Component[]
): ErrorStrategy[] {

  const strategies: ErrorStrategy[] = [];

  // Standard error types
  strategies.push({
    errorType: 'ValidationError',
    handling: 'Display user-friendly validation messages',
    userExperience: 'Show inline field errors, highlight invalid fields'
  });

  strategies.push({
    errorType: 'NetworkError',
    handling: 'Retry with exponential backoff, show offline indicator',
    userExperience: 'Display retry button, queue actions for later'
  });

  strategies.push({
    errorType: 'AuthenticationError',
    handling: 'Redirect to login, clear invalid session',
    userExperience: 'Show login modal, preserve navigation intent'
  });

  strategies.push({
    errorType: 'AuthorizationError',
    handling: 'Display permission denied message, log attempt',
    userExperience: 'Show helpful message about required permissions'
  });

  strategies.push({
    errorType: 'ServerError',
    handling: 'Log error details, show generic user message',
    userExperience: 'Display friendly error page with support contact'
  });

  return strategies;
}
```

### Generate Test Strategy

```typescript
function generateTestStrategy(
  components: Component[],
  requirementIds: string[]
): TestStrategy {

  return {
    unit: {
      description: 'Test individual components in isolation',
      coverage: components.map(c => ({
        component: c.name,
        tests: [
          `Test ${c.name} renders correctly`,
          `Test ${c.name} handles props/inputs`,
          `Test ${c.name} error states`,
          `Test ${c.name} business logic`
        ]
      }))
    },
    integration: {
      description: 'Test component interactions and data flow',
      coverage: [
        'Test complete user workflows',
        'Test API integration',
        'Test data persistence',
        'Test error handling across components'
      ]
    },
    e2e: {
      description: 'Test complete feature from user perspective',
      scenarios: [
        'Happy path: successful completion',
        'Error scenarios: validation failures',
        'Edge cases: boundary conditions',
        'Performance: response times'
      ]
    },
    requirementCoverage: {
      description: 'Ensure all requirements have test coverage',
      requirements: requirementIds
    }
  };
}
```

### Validate Requirement Traceability

```typescript
function validateRequirementTraceability(
  requirementIds: string[],
  designContent: string
): TraceabilityResult {

  const coveredRequirements: string[] = [];
  const uncoveredRequirements: string[] = [];

  for (const reqId of requirementIds) {
    if (designContent.includes(reqId)) {
      coveredRequirements.push(reqId);
    } else {
      uncoveredRequirements.push(reqId);
    }
  }

  return {
    coveredRequirements,
    uncoveredRequirements,
    coverage: coveredRequirements.length / requirementIds.length
  };
}
```

### Compile Design Document

```typescript
function compileDesignDocument(data: DesignData): string {
  let content = data.template;

  // Replace placeholders
  content = content.replace(/\[FeatureName\]/g, data.featureName);
  content = content.replace(/\[feature-name\]/g, data.featureName);
  content = content.replace(/\[Date\]/g, new Date().toISOString().split('T')[0]);

  // Build components section
  let componentsSection = '';
  for (const component of data.components) {
    componentsSection += `\n### Component: ${component.name}\n\n`;
    componentsSection += `**Purpose**: ${component.purpose}\n\n`;
    componentsSection += `**Responsibilities**:\n`;
    for (const resp of component.responsibilities) {
      componentsSection += `- ${resp}\n`;
    }
    componentsSection += `\n**Interfaces**:\n\`\`\`typescript\n${component.interfaces}\n\`\`\`\n\n`;
    componentsSection += `_References: ${component.requirementRefs.join(', ')}_\n`;
  }

  // Build data models section
  let dataModelsSection = '';
  for (const model of data.dataModels) {
    dataModelsSection += `\n### ${model.name}\n\n`;
    dataModelsSection += `${model.description}\n\n`;
    dataModelsSection += `\`\`\`typescript\n${model.interface}\n\`\`\`\n`;
  }

  // Build error handling section
  let errorSection = '| Error Type | Handling Strategy | User Experience |\n';
  errorSection += '|------------|-------------------|------------------|\n';
  for (const strategy of data.errorHandling) {
    errorSection += `| ${strategy.errorType} | ${strategy.handling} | ${strategy.userExperience} |\n`;
  }

  // Build test strategy section
  let testSection = `### Unit Tests\n\n`;
  for (const coverage of data.testStrategy.unit.coverage) {
    testSection += `**${coverage.component}**:\n`;
    for (const test of coverage.tests) {
      testSection += `- ${test}\n`;
    }
    testSection += '\n';
  }
  testSection += `### Integration Tests\n\n`;
  for (const test of data.testStrategy.integration.coverage) {
    testSection += `- ${test}\n`;
  }

  // Replace sections
  content = content.replace(/\[Components\]/g, componentsSection);
  content = content.replace(/\[DataModels\]/g, dataModelsSection);
  content = content.replace(/\[ErrorHandling\]/g, errorSection);
  content = content.replace(/\[TestStrategy\]/g, testSection);

  return content;
}
```

### Get Inline Template

```typescript
function getInlineDesignTemplate(): string {
  return `# Design: [FeatureName]

**Feature**: [feature-name]
**Created**: [Date]
**Status**: Draft

## Overview

[High-level design approach]

## Components

[Components]

## Data Models

[DataModels]

## Error Handling

[ErrorHandling]

## Testing Strategy

[TestStrategy]

## Security Considerations

- Input validation
- Access control
- Data sanitization

## Performance Considerations

- Response time targets
- Scalability approach
`;
}
```

## Type Definitions

```typescript
interface Component {
  name: string;
  type: 'presentation' | 'service' | 'data' | 'utility';
  purpose: string;
  responsibilities: string[];
  interfaces: string;
  requirementRefs: string[];
}

interface DataModel {
  name: string;
  description: string;
  interface: string;
}

interface ErrorStrategy {
  errorType: string;
  handling: string;
  userExperience: string;
}

interface TestStrategy {
  unit: {
    description: string;
    coverage: Array<{
      component: string;
      tests: string[];
    }>;
  };
  integration: {
    description: string;
    coverage: string[];
  };
  e2e: {
    description: string;
    scenarios: string[];
  };
  requirementCoverage: {
    description: string;
    requirements: string[];
  };
}

interface TraceabilityResult {
  coveredRequirements: string[];
  uncoveredRequirements: string[];
  coverage: number;
}
```

## Requirements Satisfied

- ✅ FR-5.4.1: Reads requirements.md to understand what to design
- ✅ FR-5.4.2: Reads tech.md and structure.md for architectural constraints
- ✅ FR-5.4.3: Validates requirement traceability (all requirements covered)
- ✅ FR-5.4.4: Generates design.md with component architecture and TypeScript interfaces
- ✅ FR-5.4.5: References specific requirement IDs throughout design
- ✅ FR-1.1: Checks requirements.md exists (dependency validation)
- ✅ FR-1.4: Offers to auto-run prerequisite command
- ✅ Requirement 1: Command execution control (STOP after completion)
