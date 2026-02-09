# /specid.tasks - Generate Implementation Tasks

You are executing the `/specid.tasks` command to generate implementation tasks from a feature's system design.

## Command Arguments

- **name**: Feature name in kebab-case (required)

## Command Purpose

Generate atomic, implementable tasks from a feature's system design document. Each task should:
- Be completable in < 4 hours
- Reference specific design components
- Include acceptance criteria
- Trace back to requirements
- Be marked as complete/incomplete based on codebase analysis

## Execution Steps

### Step 1: Parse and Validate Arguments

Parse the feature name from the command arguments:

```typescript
// Parse arguments
const featureName = args.name;

if (!featureName || featureName.trim().length === 0) {
  console.error('❌ Error: Feature name is required.');
  console.log('Usage: /spec.tasks [feature-name]');
  console.log('Example: /spec.tasks user-authentication');
  return;
}

// Validate kebab-case format
const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
if (!kebabCaseRegex.test(featureName)) {
  console.error('❌ Error: Feature name must be in kebab-case format.');
  console.log(`Invalid: "${featureName}"`);
  console.log('Valid examples: user-auth, data-export, payment-processing');
  return;
}

console.log(`Generating implementation tasks for: ${featureName}\n`);
```

### Step 2: Check Dependencies

Verify that both requirements.md and design.md exist for this feature:

```typescript
const featureDir = `docs/features/${featureName}`;
const requirementsPath = `${featureDir}/requirements.md`;
const designPath = `${featureDir}/design.md`;
const tasksPath = `${featureDir}/tasks.md`;

const requirementsExists = fileExists(requirementsPath);
const designExists = fileExists(designPath);

if (!requirementsExists || !designExists) {
  console.error('❌ Error: Missing prerequisite documents\n');

  const missing = [];
  if (!requirementsExists) missing.push('requirements.md');
  if (!designExists) missing.push('design.md');

  console.log(`Missing: ${missing.join(', ')}\n`);
  console.log('The /spec.tasks command requires both requirements and design documents.');
  console.log('Please run these commands first:\n');

  if (!requirementsExists) {
    console.log(`  /spec.feature ${featureName} "[description]"`);
  }
  if (!designExists) {
    console.log(`  /spec.design ${featureName} "[refinement or empty]"`);
  }

  console.log('');

  // Offer to auto-run prerequisite commands (FR-1.4)
  const autoRun = askYesNo('Would you like me to run the prerequisite commands now?');

  if (autoRun) {
    if (!requirementsExists) {
      console.log(`\nRunning: /spec.feature ${featureName}\n`);

      const featureDesc = ask('Brief description of the feature:');
      executeCommand(`/spec.feature ${featureName} "${featureDesc}"`);

      console.log('\n');
    }

    if (!designExists) {
      console.log(`\nRunning: /spec.design ${featureName}\n`);
      executeCommand(`/spec.design ${featureName} ""`);

      console.log('\n');
    }

    // After prerequisites complete, continue with task generation
    console.log('Prerequisites completed. Continuing with task generation...\n');
  } else {
    console.log('Task generation cancelled. Run prerequisite commands and try again.');
    return;
  }
}

console.log('✓ Found requirements.md');
console.log('✓ Found design.md');

const tasksExists = fileExists(tasksPath);
if (tasksExists) {
  console.log('ℹ️  Found existing tasks.md (will update)');
}

console.log('');
```

### Step 3: Read and Parse Requirements

Extract requirement IDs from requirements.md:

```typescript
console.log('Reading requirements document...\n');

const requirementsContent = readFile(requirementsPath);

// Extract all requirement IDs (FR-*, NFR-*, AC-*)
const requirementIdPattern = /(FR-\d+\.\d+\.\d+|NFR-\d+\.\d+\.\d+|AC-\d+)/g;
const requirementIds = [...new Set(requirementsContent.match(requirementIdPattern) || [])];

console.log(`Found ${requirementIds.length} requirement IDs:`);
console.log(`  ${requirementIds.slice(0, 5).join(', ')}${requirementIds.length > 5 ? ', ...' : ''}`);
console.log('');

// Parse user story
const userStoryMatch = requirementsContent.match(/As a (.+?), I want to (.+?) so that (.+?)\./s);
const userStory = userStoryMatch ? {
  role: userStoryMatch[1].trim(),
  goal: userStoryMatch[2].trim(),
  benefit: userStoryMatch[3].trim()
} : null;

if (userStory) {
  console.log(`User Story: As a ${userStory.role}, I want to ${userStory.goal}`);
  console.log('');
}
```

### Step 4: Read and Parse Design

Extract components and architecture from design.md:

```typescript
console.log('Reading system design document...\n');

const designContent = readFile(designPath);

// Parse components section
interface Component {
  name: string;
  type: 'UI' | 'Service' | 'Data' | 'Utility' | 'API' | 'Validation' | 'Auth';
  description: string;
  interfaces: string[];
  dependencies: string[];
  requirementRefs: string[];
}

function parseComponents(designContent: string): Component[] {
  const components: Component[] = [];

  // Look for component definitions in the design document
  // Pattern: ## Component: ComponentName (Type)
  const componentPattern = /##\s+Component:\s+(.+?)\s+\((.+?)\)\s*\n([\s\S]*?)(?=##\s+Component:|##\s+[A-Z]|$)/g;

  let match;
  while ((match = componentPattern.exec(designContent)) !== null) {
    const name = match[1].trim();
    const type = match[2].trim() as Component['type'];
    const section = match[3];

    // Extract description (first paragraph)
    const descMatch = section.match(/\n(.+?)(?=\n\n|\n###)/s);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract interfaces
    const interfacePattern = /interface\s+(\w+)/g;
    const interfaces: string[] = [];
    let ifMatch;
    while ((ifMatch = interfacePattern.exec(section)) !== null) {
      interfaces.push(ifMatch[1]);
    }

    // Extract dependencies
    const depPattern = /depends on[:\s]+(.+)/gi;
    const dependencies: string[] = [];
    let depMatch;
    while ((depMatch = depPattern.exec(section)) !== null) {
      const deps = depMatch[1].split(',').map(d => d.trim());
      dependencies.push(...deps);
    }

    // Extract requirement references
    const reqRefs = [...new Set(section.match(requirementIdPattern) || [])];

    components.push({
      name,
      type,
      description,
      interfaces,
      dependencies,
      requirementRefs: reqRefs
    });
  }

  return components;
}

const components = parseComponents(designContent);

console.log(`Found ${components.length} components in design:`);
components.forEach(comp => {
  console.log(`  - ${comp.name} (${comp.type})`);
});
console.log('');

// Parse data models/interfaces
const interfacePattern = /interface\s+(\w+)\s*{/g;
const interfaces: string[] = [];
let ifMatch;
while ((ifMatch = interfacePattern.exec(designContent)) !== null) {
  interfaces.push(ifMatch[1]);
}

console.log(`Found ${interfaces.length} data model interfaces`);
console.log('');
```

### Step 5: Analyze Codebase for Existing Implementation

Search the codebase to determine which components are already implemented:

```typescript
console.log('Analyzing codebase for existing implementations...\n');

interface CodebaseAnalysis {
  component: string;
  implemented: boolean;
  files: string[];
  tests: string[];
}

async function analyzeComponentImplementation(component: Component): Promise<CodebaseAnalysis> {
  const analysis: CodebaseAnalysis = {
    component: component.name,
    implemented: false,
    files: [],
    tests: []
  };

  // Convert component name to possible file names
  // Example: UserAuthService → user-auth-service, userAuthService, UserAuthService
  const kebabName = component.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  const camelName = component.name.charAt(0).toLowerCase() + component.name.slice(1);

  // Search patterns based on component type
  let searchPatterns: string[] = [];

  if (component.type === 'UI') {
    searchPatterns = [
      `**/${kebabName}.tsx`,
      `**/${kebabName}.jsx`,
      `**/${component.name}.tsx`,
      `**/${component.name}.jsx`,
      `**/components/**/${kebabName}*`,
    ];
  } else if (component.type === 'Service' || component.type === 'API') {
    searchPatterns = [
      `**/${kebabName}.ts`,
      `**/${kebabName}.js`,
      `**/${camelName}.ts`,
      `**/services/**/${kebabName}*`,
      `**/api/**/${kebabName}*`,
    ];
  } else if (component.type === 'Data') {
    searchPatterns = [
      `**/${kebabName}.model.ts`,
      `**/${kebabName}.schema.ts`,
      `**/models/**/${kebabName}*`,
      `**/schemas/**/${kebabName}*`,
    ];
  } else {
    searchPatterns = [
      `**/${kebabName}.ts`,
      `**/${kebabName}.js`,
    ];
  }

  // Search for implementation files
  for (const pattern of searchPatterns) {
    const files = glob(pattern);
    if (files.length > 0) {
      analysis.files.push(...files);
    }
  }

  // Also search for class/interface definitions in code
  if (analysis.files.length === 0) {
    // Grep for class/interface declarations
    const classMatches = grep(`(class|interface|const)\\s+${component.name}`, {
      fileTypes: ['ts', 'js', 'tsx', 'jsx'],
      includeLineNumbers: false
    });

    if (classMatches.length > 0) {
      analysis.files.push(...classMatches.map(m => m.file));
    }
  }

  // Search for test files
  const testPatterns = [
    `**/${kebabName}.test.ts`,
    `**/${kebabName}.spec.ts`,
    `**/${kebabName}.test.js`,
    `**/${component.name}.test.ts`,
    `**/tests/**/${kebabName}*`,
    `**/__tests__/**/${kebabName}*`,
  ];

  for (const pattern of testPatterns) {
    const testFiles = glob(pattern);
    if (testFiles.length > 0) {
      analysis.tests.push(...testFiles);
    }
  }

  // Also grep for test suites
  if (analysis.tests.length === 0) {
    const testMatches = grep(`describe\\(['"](${component.name}|${kebabName})`, {
      fileTypes: ['ts', 'js'],
      includeLineNumbers: false
    });

    if (testMatches.length > 0) {
      analysis.tests.push(...testMatches.map(m => m.file));
    }
  }

  // Mark as implemented if we found either implementation or tests
  analysis.implemented = analysis.files.length > 0 || analysis.tests.length > 0;

  // Deduplicate
  analysis.files = [...new Set(analysis.files)];
  analysis.tests = [...new Set(analysis.tests)];

  return analysis;
}

// Analyze all components
const analysisResults: Map<string, CodebaseAnalysis> = new Map();

for (const component of components) {
  const analysis = await analyzeComponentImplementation(component);
  analysisResults.set(component.name, analysis);

  if (analysis.implemented) {
    console.log(`✓ ${component.name} - Found implementation`);
    if (analysis.files.length > 0) {
      console.log(`    Files: ${analysis.files.slice(0, 2).join(', ')}${analysis.files.length > 2 ? ', ...' : ''}`);
    }
    if (analysis.tests.length > 0) {
      console.log(`    Tests: ${analysis.tests.slice(0, 2).join(', ')}${analysis.tests.length > 2 ? ', ...' : ''}`);
    }
  } else {
    console.log(`  ${component.name} - Not implemented`);
  }
}

console.log('');
```

### Step 6: Load Tasks Template

Load the tasks template with fallback to inline default:

```typescript
console.log('Loading tasks template...\n');

let tasksTemplate = '';

if (fileExists('.spec/templates/tasks.md')) {
  tasksTemplate = readFile('.spec/templates/tasks.md');
  console.log('✓ Loaded custom tasks template from .spec/templates/tasks.md\n');
} else {
  console.log('ℹ️  No custom template found, using inline default\n');
  tasksTemplate = getInlineTasksTemplate();
}

function getInlineTasksTemplate(): string {
  return `# Implementation Tasks - [FeatureName]

## Overview

**Feature**: [FeatureName]
**Requirements**: [RequirementsPath]
**Design**: [DesignPath]

## Task Summary

- **Total Tasks**: [TotalCount]
- **Completed**: [CompletedCount]
- **Remaining**: [RemainingCount]

## Implementation Tasks

[Tasks]

## Testing Strategy

All implementation tasks should have corresponding test tasks:
- Unit tests for individual components
- Integration tests for component interactions
- End-to-end tests for complete user flows

## Acceptance Criteria

Tasks are complete when:
- Implementation matches design specifications
- All tests pass
- Code review approved
- Documentation updated
`;
}
```

### Step 7: Generate Tasks from Components

Create atomic tasks for each component:

```typescript
console.log('Generating implementation tasks...\n');

interface Task {
  number: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  requirementRefs: string[];
  designRefs: string[];
  completed: boolean;
  subtasks?: Task[];
}

function generateTasksFromComponents(
  components: Component[],
  analysisResults: Map<string, CodebaseAnalysis>
): Task[] {
  const tasks: Task[] = [];
  let taskNumber = 1;

  // Group components by dependency order (implement dependencies first)
  const sortedComponents = topologicalSort(components);

  for (const component of sortedComponents) {
    const analysis = analysisResults.get(component.name);
    const isImplemented = analysis?.implemented || false;

    // Main implementation task
    const implementationTask: Task = {
      number: `${taskNumber}`,
      title: `Implement ${component.name}`,
      description: `Create the ${component.name} ${component.type} component as specified in the design document.\n\n${component.description}`,
      acceptanceCriteria: [
        `${component.name} implements all methods/properties from design`,
        component.interfaces.length > 0
          ? `Implements interfaces: ${component.interfaces.join(', ')}`
          : 'Follows TypeScript best practices',
        component.dependencies.length > 0
          ? `Integrates with dependencies: ${component.dependencies.join(', ')}`
          : 'Has no circular dependencies',
        'Code is properly documented with JSDoc comments',
        'No TypeScript errors or warnings',
      ],
      requirementRefs: component.requirementRefs,
      designRefs: [`Component: ${component.name}`],
      completed: isImplemented && (analysis?.files.length || 0) > 0,
      subtasks: []
    };

    // Add subtasks for complex components
    if (component.interfaces.length > 1) {
      component.interfaces.forEach((iface, idx) => {
        implementationTask.subtasks!.push({
          number: `${taskNumber}.${idx + 1}`,
          title: `Implement ${iface} interface`,
          description: `Create the ${iface} interface definition and implementation.`,
          acceptanceCriteria: [
            `${iface} interface is properly typed`,
            'Interface matches design specification',
          ],
          requirementRefs: component.requirementRefs,
          designRefs: [`Interface: ${iface}`],
          completed: isImplemented,
        });
      });
    }

    tasks.push(implementationTask);

    // Test task (always follows implementation)
    const testTask: Task = {
      number: `${taskNumber + 1}`,
      title: `Test ${component.name}`,
      description: `Write comprehensive tests for ${component.name}.`,
      acceptanceCriteria: [
        'Unit tests cover all public methods',
        'Edge cases and error handling tested',
        'Test coverage > 80%',
        'All tests pass',
      ],
      requirementRefs: component.requirementRefs,
      designRefs: [`Component: ${component.name}`],
      completed: isImplemented && (analysis?.tests.length || 0) > 0,
    };

    tasks.push(testTask);

    taskNumber += 2;
  }

  // Add integration tasks if multiple components
  if (components.length > 1) {
    tasks.push({
      number: `${taskNumber}`,
      title: 'Integration Testing',
      description: 'Test component interactions and data flow.',
      acceptanceCriteria: [
        'All components integrate correctly',
        'Data flows properly between components',
        'No integration errors',
      ],
      requirementRefs: requirementIds,
      designRefs: ['System Architecture'],
      completed: false,
    });

    taskNumber++;
  }

  // Add end-to-end task based on user story
  if (userStory) {
    tasks.push({
      number: `${taskNumber}`,
      title: 'End-to-End User Flow',
      description: `Implement complete user flow: ${userStory.goal}`,
      acceptanceCriteria: [
        `User can ${userStory.goal}`,
        'All acceptance criteria from requirements are met',
        'User experience is smooth and intuitive',
      ],
      requirementRefs: requirementIds,
      designRefs: ['User Flow'],
      completed: false,
    });
  }

  return tasks;
}

// Helper: Topological sort for dependency ordering
function topologicalSort(components: Component[]): Component[] {
  const sorted: Component[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(comp: Component) {
    if (visited.has(comp.name)) return;
    if (visiting.has(comp.name)) {
      console.warn(`⚠️  Circular dependency detected: ${comp.name}`);
      return;
    }

    visiting.add(comp.name);

    // Visit dependencies first
    comp.dependencies.forEach(depName => {
      const dep = components.find(c => c.name === depName);
      if (dep) visit(dep);
    });

    visiting.delete(comp.name);
    visited.add(comp.name);
    sorted.push(comp);
  }

  components.forEach(comp => visit(comp));

  return sorted;
}

const tasks = generateTasksFromComponents(components, analysisResults);

console.log(`Generated ${tasks.length} implementation tasks`);
console.log('');
```

### Step 8: Format Tasks as Markdown

Convert tasks to markdown format with proper numbering:

```typescript
function formatTasksAsMarkdown(tasks: Task[]): string {
  let markdown = '';

  for (const task of tasks) {
    const checkbox = task.completed ? '[x]' : '[ ]';
    const refs = [
      ...task.requirementRefs.map(r => `**${r}**`),
      ...task.designRefs.map(d => `*${d}*`)
    ].join(', ');

    markdown += `- ${checkbox} **${task.number}. ${task.title}**\n\n`;
    markdown += `  ${task.description}\n\n`;

    if (task.acceptanceCriteria.length > 0) {
      markdown += `  **Acceptance Criteria**:\n`;
      task.acceptanceCriteria.forEach(ac => {
        markdown += `  - ${ac}\n`;
      });
      markdown += '\n';
    }

    if (refs) {
      markdown += `  **References**: ${refs}\n\n`;
    }

    // Add subtasks if present
    if (task.subtasks && task.subtasks.length > 0) {
      task.subtasks.forEach(subtask => {
        const subCheckbox = subtask.completed ? '[x]' : '[ ]';
        markdown += `  - ${subCheckbox} **${subtask.number}. ${subtask.title}**\n`;
        markdown += `    ${subtask.description}\n\n`;

        if (subtask.acceptanceCriteria.length > 0) {
          markdown += `    **Acceptance Criteria**:\n`;
          subtask.acceptanceCriteria.forEach(ac => {
            markdown += `    - ${ac}\n`;
          });
          markdown += '\n';
        }
      });
    }
  }

  return markdown;
}

const tasksMarkdown = formatTasksAsMarkdown(tasks);
```

### Step 9: Fill Template and Calculate Summary

Populate the template with generated content:

```typescript
const completedCount = tasks.filter(t => t.completed).length;
const totalCount = tasks.length;
const remainingCount = totalCount - completedCount;

const completionPercentage = totalCount > 0
  ? Math.round((completedCount / totalCount) * 100)
  : 0;

let tasksContent = tasksTemplate
  .replace(/\[FeatureName\]/g, featureName)
  .replace(/\[RequirementsPath\]/g, `[requirements.md](./requirements.md)`)
  .replace(/\[DesignPath\]/g, `[design.md](./design.md)`)
  .replace(/\[TotalCount\]/g, totalCount.toString())
  .replace(/\[CompletedCount\]/g, `${completedCount} (${completionPercentage}%)`)
  .replace(/\[RemainingCount\]/g, remainingCount.toString())
  .replace(/\[Tasks\]/g, tasksMarkdown);

console.log('Task Summary:');
console.log(`  Total: ${totalCount}`);
console.log(`  Completed: ${completedCount} (${completionPercentage}%)`);
console.log(`  Remaining: ${remainingCount}`);
console.log('');
```

### Step 10: Ask for Confirmation Preference

Determine if user wants to review before writing:

```typescript
let confirmationMode = false;

// Check if we're creating new file or updating existing
if (!tasksExists) {
  confirmationMode = askYesNo('Would you like to review the tasks before saving? (recommended for first time)');
} else {
  confirmationMode = askYesNo('Would you like to review the updated tasks before saving?');
}

console.log('');
```

### Step 11: Write Tasks File

Save tasks.md with optional confirmation:

```typescript
if (confirmationMode) {
  console.log('═══════════════════════════════════════');
  console.log(`Preview: ${tasksPath}`);
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log(tasksContent);
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('');

  const approved = askYesNo('Write this file?');

  if (!approved) {
    console.log('❌ Task generation cancelled by user.');
    console.log('');
    return;
  }
}

writeFile(tasksPath, tasksContent);

if (tasksExists) {
  console.log(`✓ Updated ${tasksPath}`);
} else {
  console.log(`✓ Created ${tasksPath}`);
}
console.log('');
```

### Step 12: Display Summary and Insights

Show completion status and recommendations:

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Task Generation Complete');
console.log('═══════════════════════════════════════');
console.log('');

console.log('📊 Task Summary:');
console.log(`  Total Tasks: ${totalCount}`);
console.log(`  Completed: ${completedCount} (${completionPercentage}%)`);
console.log(`  Remaining: ${remainingCount}`);
console.log('');

if (completedCount > 0) {
  console.log('✓ Existing Implementation Detected:');
  tasks.filter(t => t.completed).forEach(t => {
    console.log(`  ✓ ${t.title}`);
  });
  console.log('');
}

if (remainingCount > 0) {
  console.log('📋 Next Tasks to Implement:');
  const nextTasks = tasks.filter(t => !t.completed).slice(0, 3);
  nextTasks.forEach(t => {
    console.log(`  ${t.number}. ${t.title}`);
  });
  if (remainingCount > 3) {
    console.log(`  ... and ${remainingCount - 3} more`);
  }
  console.log('');
}

console.log('📄 Generated Files:');
console.log(`  ✓ ${tasksPath}`);
console.log('');
```

### Step 13: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed to the next step.

```typescript
// Command execution STOPS here
```

### Step 14: Offer Next Step (Optional)

After stopping, suggest the next action:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');

if (remainingCount > 0) {
  console.log('Your implementation tasks are ready!');
  console.log('');
  console.log('Would you like to start implementing the first task?');
  console.log('');

  const firstIncompleteTask = tasks.find(t => !t.completed);
  if (firstIncompleteTask) {
    console.log(`Next task: ${firstIncompleteTask.number}. ${firstIncompleteTask.title}`);
    console.log('');

    const startImplementation = askYesNo('Would you like me to help you implement this task now?');

    if (startImplementation) {
      console.log('');
      console.log(`Running: /spec.task ${featureName} ${firstIncompleteTask.number}`);
      console.log('');

      // Execute /spec.task command
      executeCommand(`/spec.task ${featureName} ${firstIncompleteTask.number}`);

      // STOP again after that command completes
    } else {
      console.log('');
      console.log('No problem! You can start implementation anytime with:');
      console.log(`  /spec.task ${featureName} ${firstIncompleteTask.number}`);
      console.log('');
    }
  }
} else {
  console.log('🎉 All tasks appear to be implemented!');
  console.log('');
  console.log('Consider running validation to ensure everything is complete:');
  console.log(`  /spec.validate ${featureName}`);
  console.log('');
}
```

## Data Models

### Component Interface

```typescript
interface Component {
  name: string;
  type: 'UI' | 'Service' | 'Data' | 'Utility' | 'API' | 'Validation' | 'Auth';
  description: string;
  interfaces: string[];
  dependencies: string[];
  requirementRefs: string[];
}
```

### Task Interface

```typescript
interface Task {
  number: string;          // "1", "1.1", "2", etc.
  title: string;           // "Implement UserAuthService"
  description: string;     // Detailed task description
  acceptanceCriteria: string[];
  requirementRefs: string[]; // ["FR-1.1.1", "FR-1.2.3"]
  designRefs: string[];    // ["Component: UserAuthService"]
  completed: boolean;      // Based on codebase analysis
  subtasks?: Task[];       // Nested tasks for complex components
}
```

### Codebase Analysis Interface

```typescript
interface CodebaseAnalysis {
  component: string;       // Component name
  implemented: boolean;    // True if any files/tests found
  files: string[];         // Implementation file paths
  tests: string[];         // Test file paths
}
```

## Helper Functions

### Parse Components from Design

```typescript
function parseComponents(designContent: string): Component[] {
  const components: Component[] = [];

  // Pattern: ## Component: ComponentName (Type)
  const componentPattern = /##\s+Component:\s+(.+?)\s+\((.+?)\)\s*\n([\s\S]*?)(?=##\s+Component:|##\s+[A-Z]|$)/g;

  let match;
  while ((match = componentPattern.exec(designContent)) !== null) {
    const name = match[1].trim();
    const type = match[2].trim() as Component['type'];
    const section = match[3];

    // Extract description, interfaces, dependencies, requirement refs
    // ... (full implementation in Step 4)

    components.push({
      name,
      type,
      description,
      interfaces,
      dependencies,
      requirementRefs
    });
  }

  return components;
}
```

### Analyze Component Implementation

```typescript
async function analyzeComponentImplementation(component: Component): Promise<CodebaseAnalysis> {
  const analysis: CodebaseAnalysis = {
    component: component.name,
    implemented: false,
    files: [],
    tests: []
  };

  // Convert to kebab-case and camelCase variations
  const kebabName = component.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  // Search for files by pattern (glob)
  // Search for class/interface definitions (grep)
  // Search for test files
  // Mark as implemented if found

  return analysis;
}
```

### Topological Sort for Dependencies

```typescript
function topologicalSort(components: Component[]): Component[] {
  const sorted: Component[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(comp: Component) {
    if (visited.has(comp.name)) return;
    if (visiting.has(comp.name)) {
      console.warn(`⚠️  Circular dependency detected: ${comp.name}`);
      return;
    }

    visiting.add(comp.name);

    // Visit dependencies first
    comp.dependencies.forEach(depName => {
      const dep = components.find(c => c.name === depName);
      if (dep) visit(dep);
    });

    visiting.delete(comp.name);
    visited.add(comp.name);
    sorted.push(comp);
  }

  components.forEach(comp => visit(comp));

  return sorted;
}
```

### Generate Tasks from Components

```typescript
function generateTasksFromComponents(
  components: Component[],
  analysisResults: Map<string, CodebaseAnalysis>
): Task[] {
  const tasks: Task[] = [];
  let taskNumber = 1;

  const sortedComponents = topologicalSort(components);

  for (const component of sortedComponents) {
    // Create implementation task
    // Create test task
    // Add subtasks if complex
    // Mark completed based on codebase analysis

    taskNumber += 2; // Implementation + Test
  }

  // Add integration tasks
  // Add end-to-end task

  return tasks;
}
```

### Format Tasks as Markdown

```typescript
function formatTasksAsMarkdown(tasks: Task[]): string {
  let markdown = '';

  for (const task of tasks) {
    const checkbox = task.completed ? '[x]' : '[ ]';
    const refs = [
      ...task.requirementRefs.map(r => `**${r}**`),
      ...task.designRefs.map(d => `*${d}*`)
    ].join(', ');

    markdown += `- ${checkbox} **${task.number}. ${task.title}**\n\n`;
    markdown += `  ${task.description}\n\n`;

    if (task.acceptanceCriteria.length > 0) {
      markdown += `  **Acceptance Criteria**:\n`;
      task.acceptanceCriteria.forEach(ac => {
        markdown += `  - ${ac}\n`;
      });
      markdown += '\n';
    }

    if (refs) {
      markdown += `  **References**: ${refs}\n\n`;
    }

    // Add subtasks recursively
    if (task.subtasks) {
      task.subtasks.forEach(subtask => {
        // ... format subtask
      });
    }
  }

  return markdown;
}
```

## Important Notes

1. **Execution Control**: This command STOPS after completing task generation. It does NOT automatically chain to `/spec.task` without explicit user permission.

2. **Codebase Analysis**: The command analyzes the existing codebase to determine which tasks are already complete, marking them with `[x]`.

3. **Atomic Tasks**: Each task should be completable in < 4 hours. Complex components are broken into subtasks.

4. **Dependency Order**: Tasks are ordered by component dependencies (dependencies implemented first).

5. **Test Pairing**: Every implementation task has a corresponding test task.

6. **Requirement Traceability**: Each task references specific requirements and design elements.

7. **Template Fallback**: Loads custom template from `.spec/templates/tasks.md` with inline default as fallback.

## Requirements Satisfied

- ✅ FR-5.5.1: Parses feature name and validates format
- ✅ FR-5.5.2: Reads requirements.md and design.md
- ✅ FR-5.5.3: Generates atomic tasks from design components
- ✅ FR-5.5.4: Analyzes codebase for existing implementations
- ✅ FR-5.5.5: Marks completed tasks based on codebase analysis
- ✅ FR-5.5.6: Displays task summary with completion percentage
- ✅ FR-1.1: Validates dependencies (requirements.md and design.md)
- ✅ FR-1.4: Offers to auto-run prerequisite commands if missing
- ✅ Requirement: Command execution control (stops after completion, asks permission)
