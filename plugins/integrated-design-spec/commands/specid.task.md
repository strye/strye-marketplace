# /specid.task - Execute Implementation Task

You are executing the `/specid.task` command to implement a specific task from a feature's task list.

## Command Arguments

- **feature-name**: Feature name in kebab-case (required)
- **task-id**: Task identifier (e.g., "1", "2.1", "3.1.2") (required)

## Command Purpose

Execute implementation work for a specific task or task group from a feature's tasks.md file. The command:
- Executes the task(s) in scope based on task-id
- For main tasks (e.g., "4"): executes the task plus all non-optional sub-tasks
- For sub-tasks (e.g., "4.2"): executes only that specific sub-task
- Skips optional tasks (marked with `[ ]*`) unless explicitly specified
- Updates tasks.md to mark completed tasks with [x]
- STOPS immediately after updating task statuses (no next-step recommendations)

## Execution Steps

### Step 1: Parse and Validate Arguments

Parse both required arguments from the command:

```typescript
// Parse arguments
const featureName = args['feature-name'] || args.featureName;
const taskId = args['task-id'] || args.taskId;

if (!featureName || featureName.trim().length === 0) {
  console.error('❌ Error: Feature name is required.');
  console.log('Usage: /spec.task [feature-name] [task-id]');
  console.log('Example: /spec.task user-authentication 1');
  console.log('Example: /spec.task user-authentication 2.1');
  return;
}

if (!taskId || taskId.trim().length === 0) {
  console.error('❌ Error: Task ID is required.');
  console.log('Usage: /spec.task [feature-name] [task-id]');
  console.log('Example: /spec.task user-authentication 1');
  return;
}

// Validate kebab-case format for feature name
const kebabCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
if (!kebabCaseRegex.test(featureName)) {
  console.error('❌ Error: Feature name must be in kebab-case format.');
  console.log(`Invalid: "${featureName}"`);
  console.log('Valid examples: user-auth, data-export, payment-processing');
  return;
}

// Validate task ID format (number with optional decimal levels)
const taskIdRegex = /^\d+(\.\d+)*$/;
if (!taskIdRegex.test(taskId)) {
  console.error('❌ Error: Task ID must be in format: 1, 2.1, 3.1.2, etc.');
  console.log(`Invalid: "${taskId}"`);
  return;
}

console.log(`Executing task ${taskId} for feature: ${featureName}\n`);
```

### Step 2: Validate Feature and Tasks File Exist

Check that the feature exists with a tasks.md file:

```typescript
const featureDir = `docs/features/${featureName}`;
const tasksPath = `${featureDir}/tasks.md`;
const requirementsPath = `${featureDir}/requirements.md`;
const designPath = `${featureDir}/design.md`;

if (!dirExists(featureDir)) {
  console.error(`❌ Error: Feature directory not found: ${featureDir}\n`);
  console.log('Available features:');

  const featuresDir = 'docs/features';
  if (dirExists(featuresDir)) {
    const features = listDirs(featuresDir);
    features.forEach(f => console.log(`  - ${f}`));
  } else {
    console.log('  (No features directory found)');
  }

  console.log('');
  return;
}

if (!fileExists(tasksPath)) {
  console.error(`❌ Error: Tasks file not found: ${tasksPath}\n`);
  console.log('This feature does not have a tasks.md file yet.');
  console.log('Generate tasks first by running:');
  console.log(`  /spec.tasks ${featureName}`);
  console.log('');
  return;
}

console.log(`✓ Found feature: ${featureName}`);
console.log(`✓ Found tasks file: ${tasksPath}`);
console.log('');
```

### Step 3: Read and Parse Tasks File

Extract all tasks from the tasks.md file:

```typescript
console.log('Reading tasks file...\n');

const tasksContent = readFile(tasksPath);

interface ParsedTask {
  id: string;              // "1", "2.1", "3.1.2"
  title: string;           // Task title
  description: string;     // Full task description
  acceptanceCriteria: string[];
  requirementRefs: string[];
  designRefs: string[];
  completed: boolean;      // true if [x], false if [ ]
  optional: boolean;       // true if [ ]*
  subtasks: ParsedTask[];  // Nested subtasks
  lineNumber: number;      // Line number in file for updates
  fullText: string;        // Complete task markdown
  indentLevel: number;     // Indentation depth (0, 1, 2, etc.)
}

function parseTasksFromMarkdown(markdown: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const lines = markdown.split('\n');

  let currentTask: ParsedTask | null = null;
  let currentSection: 'description' | 'acceptance' | 'none' = 'none';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match task line: - [ ] or - [x] followed by task number and title
    const taskMatch = line.match(/^(\s*)- \[([ x])\](\*)?\s+\*?\*?(\d+(?:\.\d+)*)\.\s+(.+?)\*?\*?$/);

    if (taskMatch) {
      // Save previous task if exists
      if (currentTask) {
        tasks.push(currentTask);
      }

      const indent = taskMatch[1];
      const completed = taskMatch[2] === 'x';
      const optional = taskMatch[3] === '*';
      const id = taskMatch[4];
      const title = taskMatch[5].trim();

      currentTask = {
        id,
        title,
        description: '',
        acceptanceCriteria: [],
        requirementRefs: [],
        designRefs: [],
        completed,
        optional,
        subtasks: [],
        lineNumber: i + 1,
        fullText: line,
        indentLevel: Math.floor(indent.length / 2)
      };

      currentSection = 'description';
      continue;
    }

    // If we're in a task, parse content
    if (currentTask) {
      // Check for acceptance criteria section
      if (line.trim().match(/^\*\*Acceptance Criteria\*\*:/)) {
        currentSection = 'acceptance';
        continue;
      }

      // Check for references section
      if (line.trim().match(/^\*\*References\*\*:/)) {
        // Extract requirement and design refs
        const reqMatches = line.matchAll(/\*\*(FR-\d+\.\d+\.\d+|NFR-\d+\.\d+\.\d+|AC-\d+)\*\*/g);
        for (const match of reqMatches) {
          currentTask.requirementRefs.push(match[1]);
        }

        const designMatches = line.matchAll(/\*([^*]+)\*/g);
        for (const match of designMatches) {
          if (!match[1].includes('FR-') && !match[1].includes('NFR-') && !match[1].includes('AC-')) {
            currentTask.designRefs.push(match[1].trim());
          }
        }

        currentSection = 'none';
        continue;
      }

      // Parse description or acceptance criteria
      const trimmedLine = line.trim();

      if (currentSection === 'description' && trimmedLine && !trimmedLine.startsWith('**')) {
        currentTask.description += (currentTask.description ? ' ' : '') + trimmedLine;
      } else if (currentSection === 'acceptance' && trimmedLine.startsWith('-')) {
        currentTask.acceptanceCriteria.push(trimmedLine.substring(1).trim());
      }

      currentTask.fullText += '\n' + line;
    }
  }

  // Save last task
  if (currentTask) {
    tasks.push(currentTask);
  }

  return tasks;
}

const allTasks = parseTasksFromMarkdown(tasksContent);

console.log(`Parsed ${allTasks.length} tasks from file`);
console.log('');
```

### Step 4: Determine Task Scope (Task 7.1 integrated)

Determine which tasks to execute based on the task ID:

```typescript
interface TaskScope {
  targetTasks: ParsedTask[];
  skippedOptional: ParsedTask[];
  isMainTask: boolean;
}

function determineTaskScope(taskId: string, allTasks: ParsedTask[]): TaskScope {
  const scope: TaskScope = {
    targetTasks: [],
    skippedOptional: [],
    isMainTask: !taskId.includes('.')
  };

  // Find the primary task by ID
  const primaryTask = allTasks.find(t => t.id === taskId);

  if (!primaryTask) {
    return scope; // Task not found
  }

  // If it's a sub-task (has decimal), only include that specific task
  if (!scope.isMainTask) {
    scope.targetTasks.push(primaryTask);
    return scope;
  }

  // If it's a main task, include the task and all non-optional sub-tasks
  scope.targetTasks.push(primaryTask);

  // Find all sub-tasks that belong to this main task
  const mainTaskPrefix = taskId + '.';

  for (const task of allTasks) {
    // Check if this is a direct sub-task (e.g., for task "4", include "4.1", "4.2" but not "4.1.1")
    if (task.id.startsWith(mainTaskPrefix)) {
      const remainder = task.id.substring(mainTaskPrefix.length);
      const isDirectSubtask = !remainder.includes('.'); // No additional dots

      if (isDirectSubtask) {
        if (task.optional) {
          // Skip optional tasks unless explicitly specified
          scope.skippedOptional.push(task);
        } else {
          // Include non-optional sub-tasks
          scope.targetTasks.push(task);
        }
      }
    }
  }

  return scope;
}

const scope = determineTaskScope(taskId, allTasks);

if (scope.targetTasks.length === 0) {
  console.error(`❌ Error: Task ${taskId} not found in ${tasksPath}\n`);
  console.log('Available tasks:');
  allTasks.slice(0, 10).forEach(t => {
    const status = t.completed ? '✓' : ' ';
    const optional = t.optional ? '*' : '';
    console.log(`  [${status}]${optional} ${t.id}. ${t.title}`);
  });
  if (allTasks.length > 10) {
    console.log(`  ... and ${allTasks.length - 10} more`);
  }
  console.log('');
  return;
}

console.log('Task Scope:');
if (scope.isMainTask) {
  console.log(`  Main task: ${taskId}`);
  if (scope.targetTasks.length > 1) {
    console.log(`  Including ${scope.targetTasks.length - 1} non-optional sub-task(s)`);
  }
  if (scope.skippedOptional.length > 0) {
    console.log(`  Skipping ${scope.skippedOptional.length} optional sub-task(s)`);
  }
} else {
  console.log(`  Sub-task: ${taskId}`);
}
console.log('');

console.log('Tasks to execute:');
scope.targetTasks.forEach(t => {
  const status = t.completed ? '[x]' : '[ ]';
  console.log(`  ${status} ${t.id}. ${t.title}`);
});
console.log('');

if (scope.skippedOptional.length > 0) {
  console.log('Skipped optional tasks:');
  scope.skippedOptional.forEach(t => {
    console.log(`  [ ]* ${t.id}. ${t.title}`);
  });
  console.log('');
}
```

### Step 5: Load Context from Requirements and Design

Read the requirements and design documents for context:

```typescript
console.log('Loading context documents...\n');

let requirementsContext = '';
let designContext = '';

if (fileExists(requirementsPath)) {
  requirementsContext = readFile(requirementsPath);
  console.log(`✓ Loaded requirements.md (${Math.round(requirementsContext.length / 1024)}KB)`);
} else {
  console.log('⚠️  requirements.md not found (continuing without requirements context)');
}

if (fileExists(designPath)) {
  designContext = readFile(designPath);
  console.log(`✓ Loaded design.md (${Math.round(designContext.length / 1024)}KB)`);
} else {
  console.log('⚠️  design.md not found (continuing without design context)');
}

console.log('');
```

### Step 6: Display Task Details

Show the task details before execution:

```typescript
console.log('═══════════════════════════════════════');
console.log('Task Details');
console.log('═══════════════════════════════════════');
console.log('');

for (const task of scope.targetTasks) {
  console.log(`Task ${task.id}: ${task.title}`);
  console.log('');

  if (task.description) {
    console.log('Description:');
    console.log(`  ${task.description}`);
    console.log('');
  }

  if (task.acceptanceCriteria.length > 0) {
    console.log('Acceptance Criteria:');
    task.acceptanceCriteria.forEach(ac => {
      console.log(`  - ${ac}`);
    });
    console.log('');
  }

  if (task.requirementRefs.length > 0) {
    console.log(`Requirements: ${task.requirementRefs.join(', ')}`);
    console.log('');
  }

  if (task.designRefs.length > 0) {
    console.log(`Design References: ${task.designRefs.join(', ')}`);
    console.log('');
  }

  if (task.completed) {
    console.log('Status: ✓ Already completed');
    console.log('');
  }

  console.log('───────────────────────────────────────');
  console.log('');
}
```

### Step 7: Confirm Execution

Ask user to confirm before proceeding:

```typescript
const alreadyCompleted = scope.targetTasks.filter(t => t.completed);
const needsImplementation = scope.targetTasks.filter(t => !t.completed);

if (alreadyCompleted.length === scope.targetTasks.length) {
  console.log('ℹ️  All tasks in scope are already marked as completed.\n');

  const reimplement = askYesNo('Would you like to re-implement these tasks anyway?');

  if (!reimplement) {
    console.log('');
    console.log('Task execution cancelled. No changes made.');
    console.log('');
    return;
  }

  console.log('');
  console.log('Proceeding with re-implementation...\n');
} else if (alreadyCompleted.length > 0) {
  console.log(`ℹ️  ${alreadyCompleted.length} of ${scope.targetTasks.length} tasks already completed.\n`);

  const proceedAnyway = askYesNo('Continue with remaining tasks?');

  if (!proceedAnyway) {
    console.log('');
    console.log('Task execution cancelled. No changes made.');
    console.log('');
    return;
  }

  console.log('');
  console.log('Proceeding with incomplete tasks...\n');
}

console.log('═══════════════════════════════════════');
console.log('Beginning Implementation');
console.log('═══════════════════════════════════════');
console.log('');
```

### Step 8: Execute Implementation for Each Task

Implement each task in the scope:

```typescript
const completedTasks: ParsedTask[] = [];
const failedTasks: Array<{task: ParsedTask, error: string}> = [];

for (const task of scope.targetTasks) {
  // Skip already completed tasks unless user chose to re-implement
  if (task.completed && needsImplementation.length > 0) {
    console.log(`⊘ Skipping ${task.id} (already completed)\n`);
    continue;
  }

  console.log(`▶ Implementing Task ${task.id}: ${task.title}\n`);

  try {
    // Build context for implementation
    const implementationContext = `
You are implementing the following task:

**Task ID**: ${task.id}
**Title**: ${task.title}
**Description**: ${task.description}

**Acceptance Criteria**:
${task.acceptanceCriteria.map(ac => `- ${ac}`).join('\n')}

${task.requirementRefs.length > 0 ? `**Requirement References**: ${task.requirementRefs.join(', ')}` : ''}
${task.designRefs.length > 0 ? `**Design References**: ${task.designRefs.join(', ')}` : ''}

**Requirements Context**:
${requirementsContext ? requirementsContext.substring(0, 10000) + '...' : 'Not available'}

**Design Context**:
${designContext ? designContext.substring(0, 10000) + '...' : 'Not available'}

Please implement this task according to the specifications above. Ensure all acceptance criteria are met.
`;

    // Execute the implementation
    // Note: In a real system, this would invoke the AI to perform the work
    // For this command specification, we represent it as a function call
    const implementationResult = await executeImplementation(implementationContext, task);

    if (implementationResult.success) {
      console.log(`  ✓ Implementation complete`);

      // Verify acceptance criteria
      const verification = await verifyAcceptanceCriteria(task, implementationResult);

      if (verification.allMet) {
        console.log(`  ✓ All acceptance criteria verified`);
        completedTasks.push(task);
      } else {
        console.log(`  ⚠️  Some acceptance criteria not met:`);
        verification.unmet.forEach(ac => {
          console.log(`    - ${ac}`);
        });

        const continueAnyway = askYesNo('Mark as complete anyway?');
        if (continueAnyway) {
          completedTasks.push(task);
        } else {
          failedTasks.push({task, error: 'Acceptance criteria not met'});
        }
      }
    } else {
      console.log(`  ✗ Implementation failed: ${implementationResult.error}`);
      failedTasks.push({task, error: implementationResult.error});
    }

    console.log('');

  } catch (error) {
    console.error(`  ✗ Error implementing task: ${error.message}`);
    failedTasks.push({task, error: error.message});
    console.log('');
  }
}

// Helper functions (conceptual - would be implemented in practice)
async function executeImplementation(context: string, task: ParsedTask): Promise<{success: boolean, error?: string}> {
  // This would use the AI to perform the actual implementation work
  // For specification purposes, we describe the expected behavior

  // 1. Parse the context to understand requirements
  // 2. Identify files to create/modify based on design references
  // 3. Generate code according to acceptance criteria
  // 4. Write files to the codebase
  // 5. Return success/failure

  return {success: true};
}

async function verifyAcceptanceCriteria(
  task: ParsedTask,
  implementationResult: any
): Promise<{allMet: boolean, unmet: string[]}> {
  // This would verify that the implementation meets the acceptance criteria
  // For specification purposes, we describe the expected behavior

  // 1. Check each acceptance criterion against the implementation
  // 2. Return list of unmet criteria

  return {allMet: true, unmet: []};
}
```

### Step 9: Update Tasks File

Mark completed tasks with [x] in the tasks.md file:

```typescript
console.log('Updating tasks.md...\n');

if (completedTasks.length === 0) {
  console.log('⚠️  No tasks completed successfully. No changes made to tasks.md.');
  console.log('');
} else {
  // Read the current file
  let updatedContent = tasksContent;

  // Update each completed task
  for (const task of completedTasks) {
    // Find the task line and update the checkbox
    // Match: - [ ] or - [ ]* followed by the task number
    const taskLinePattern = new RegExp(
      `^(\\s*)- \\[ \\](\\*)?\\s+(\\*?\\*?${task.id}\\.\\s+.+?\\*?\\*?)$`,
      'gm'
    );

    updatedContent = updatedContent.replace(
      taskLinePattern,
      (match, indent, optional, rest) => {
        return `${indent}- [x]${optional || ''}  ${rest}`;
      }
    );
  }

  // Write the updated file
  writeFile(tasksPath, updatedContent);

  console.log(`✓ Updated ${tasksPath}`);
  console.log(`  Marked ${completedTasks.length} task(s) as completed`);
  console.log('');
}
```

### Step 10: Display Summary

Show execution results:

```typescript
console.log('═══════════════════════════════════════');
console.log('Task Execution Summary');
console.log('═══════════════════════════════════════');
console.log('');

console.log(`Feature: ${featureName}`);
console.log(`Task ID: ${taskId}`);
console.log('');

console.log('Results:');
console.log(`  Total in scope: ${scope.targetTasks.length}`);
console.log(`  Completed: ${completedTasks.length}`);
console.log(`  Failed: ${failedTasks.length}`);
if (scope.skippedOptional.length > 0) {
  console.log(`  Skipped (optional): ${scope.skippedOptional.length}`);
}
console.log('');

if (completedTasks.length > 0) {
  console.log('✓ Completed Tasks:');
  completedTasks.forEach(t => {
    console.log(`  ✓ ${t.id}. ${t.title}`);
  });
  console.log('');
}

if (failedTasks.length > 0) {
  console.log('✗ Failed Tasks:');
  failedTasks.forEach(({task, error}) => {
    console.log(`  ✗ ${task.id}. ${task.title}`);
    console.log(`    Reason: ${error}`);
  });
  console.log('');
}

if (scope.skippedOptional.length > 0) {
  console.log('⊘ Skipped Optional Tasks:');
  scope.skippedOptional.forEach(t => {
    console.log(`  ⊘ ${t.id}. ${t.title}`);
  });
  console.log('');
}

console.log('═══════════════════════════════════════');
console.log('');
```

### Step 11: STOP EXECUTION

**CRITICAL**: The command must stop here. Do NOT recommend next steps or offer to continue.

```typescript
// Command execution STOPS here - NO next step recommendations
```

## Important Notes

1. **Execution Control**: This command STOPS immediately after displaying the summary. It does NOT recommend next steps or offer to run additional commands. This is a critical requirement (Requirement 1).

2. **Task Scope Logic**:
   - **Main task** (e.g., "4"): Executes task 4 plus all non-optional sub-tasks (4.1, 4.2, etc.)
   - **Sub-task** (e.g., "4.2"): Executes only that specific sub-task
   - **Optional tasks** (`[ ]*`): Only executed if explicitly specified by task ID

3. **Already Completed Tasks**: The command detects already completed tasks and asks the user how to proceed (skip or re-implement).

4. **Acceptance Criteria Verification**: After implementation, the command verifies that all acceptance criteria are met before marking the task as complete.

5. **Atomic Updates**: The tasks.md file is only updated after successful implementation and verification.

6. **Context Loading**: The command loads requirements.md and design.md to provide context for implementation, but continues without them if they're missing.

7. **Error Handling**: Failed tasks are tracked separately and reported in the summary without blocking other tasks.

## Data Models

### ParsedTask Interface

```typescript
interface ParsedTask {
  id: string;              // "1", "2.1", "3.1.2"
  title: string;           // Task title
  description: string;     // Full task description
  acceptanceCriteria: string[];
  requirementRefs: string[];  // ["FR-1.1.1", "FR-1.2.3"]
  designRefs: string[];    // ["Component: UserAuthService"]
  completed: boolean;      // true if [x], false if [ ]
  optional: boolean;       // true if [ ]*
  subtasks: ParsedTask[];  // Nested subtasks (if needed)
  lineNumber: number;      // Line number in file for updates
  fullText: string;        // Complete task markdown
  indentLevel: number;     // Indentation depth
}
```

### TaskScope Interface

```typescript
interface TaskScope {
  targetTasks: ParsedTask[];     // Tasks to execute
  skippedOptional: ParsedTask[]; // Optional tasks skipped
  isMainTask: boolean;           // true if no decimal in ID
}
```

### Implementation Result Interface

```typescript
interface ImplementationResult {
  success: boolean;
  error?: string;
  filesCreated?: string[];
  filesModified?: string[];
}
```

### Verification Result Interface

```typescript
interface VerificationResult {
  allMet: boolean;
  unmet: string[];  // List of unmet acceptance criteria
}
```

## Helper Functions

### Parse Tasks from Markdown

```typescript
function parseTasksFromMarkdown(markdown: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const lines = markdown.split('\n');

  let currentTask: ParsedTask | null = null;
  let currentSection: 'description' | 'acceptance' | 'none' = 'none';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match task line: - [ ] or - [x] or - [ ]* followed by task number
    const taskMatch = line.match(/^(\s*)- \[([ x])\](\*)?\s+\*?\*?(\d+(?:\.\d+)*)\.\s+(.+?)\*?\*?$/);

    if (taskMatch) {
      if (currentTask) tasks.push(currentTask);

      currentTask = {
        id: taskMatch[4],
        title: taskMatch[5].trim(),
        description: '',
        acceptanceCriteria: [],
        requirementRefs: [],
        designRefs: [],
        completed: taskMatch[2] === 'x',
        optional: taskMatch[3] === '*',
        subtasks: [],
        lineNumber: i + 1,
        fullText: line,
        indentLevel: Math.floor(taskMatch[1].length / 2)
      };

      currentSection = 'description';
      continue;
    }

    // Parse task content (description, acceptance criteria, references)
    // ... (full implementation in Step 3)
  }

  if (currentTask) tasks.push(currentTask);

  return tasks;
}
```

### Determine Task Scope

```typescript
function determineTaskScope(taskId: string, allTasks: ParsedTask[]): TaskScope {
  const scope: TaskScope = {
    targetTasks: [],
    skippedOptional: [],
    isMainTask: !taskId.includes('.')
  };

  const primaryTask = allTasks.find(t => t.id === taskId);
  if (!primaryTask) return scope;

  // Sub-task: only include the specific task
  if (!scope.isMainTask) {
    scope.targetTasks.push(primaryTask);
    return scope;
  }

  // Main task: include task + non-optional direct sub-tasks
  scope.targetTasks.push(primaryTask);

  const mainTaskPrefix = taskId + '.';
  for (const task of allTasks) {
    if (task.id.startsWith(mainTaskPrefix)) {
      const remainder = task.id.substring(mainTaskPrefix.length);
      const isDirectSubtask = !remainder.includes('.');

      if (isDirectSubtask) {
        if (task.optional) {
          scope.skippedOptional.push(task);
        } else {
          scope.targetTasks.push(task);
        }
      }
    }
  }

  return scope;
}
```

### Execute Implementation

```typescript
async function executeImplementation(
  context: string,
  task: ParsedTask
): Promise<ImplementationResult> {
  // 1. Parse context to understand requirements and design
  // 2. Identify files to create/modify based on design references
  // 3. Generate code according to acceptance criteria
  // 4. Write files to the codebase
  // 5. Return success/failure with file list

  return {
    success: true,
    filesCreated: [],
    filesModified: []
  };
}
```

### Verify Acceptance Criteria

```typescript
async function verifyAcceptanceCriteria(
  task: ParsedTask,
  implementationResult: ImplementationResult
): Promise<VerificationResult> {
  const unmet: string[] = [];

  // For each acceptance criterion:
  // 1. Determine how to verify it (file exists, test passes, etc.)
  // 2. Run verification
  // 3. Track unmet criteria

  for (const criterion of task.acceptanceCriteria) {
    // Verify criterion
    // If not met, add to unmet list
  }

  return {
    allMet: unmet.length === 0,
    unmet
  };
}
```

## Requirements Satisfied

- ✅ Requirement 1: Command execution control (STOPS immediately, no next-step recommendations)
- ✅ Requirement 7: Task execution with proper scope handling
- ✅ Task 7.1: Task scope determiner (main task vs sub-task logic)
- ✅ Task 7.2: Optional task handler (skips `[ ]*` unless explicitly specified)
- ✅ Parses feature-name and task-id arguments
- ✅ Validates feature exists with tasks.md
- ✅ Reads and parses tasks.md to extract all tasks
- ✅ Determines task scope based on task ID format
- ✅ Executes implementation work for each task in scope
- ✅ Verifies acceptance criteria completion
- ✅ Updates tasks.md marking completed tasks with [x]
- ✅ Displays summary of completed tasks
- ✅ STOPS execution immediately after updates (no next steps)
