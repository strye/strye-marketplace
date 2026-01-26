# /spec.task-status - Track Task Implementation Progress

You are executing the `/spec.task-status` command to view implementation progress across all features.

## Command Arguments

- **feature-name**: Optional feature name to show status for specific feature (if omitted, shows all features)

## Command Purpose

Provide comprehensive task progress tracking including:
- Task completion status across all features
- Blocked tasks (waiting on incomplete prerequisites)
- Parent-child task dependencies
- Overall progress metrics
- Per-feature and project-wide statistics

## Execution Steps

### Step 1: Parse Arguments and Determine Scope

Determine which features to analyze:

```typescript
console.log('Analyzing task implementation progress...\n');

const featureName = args['feature-name'] || args.featureName || args.name;

let featuresToAnalyze: string[] = [];

if (featureName) {
  // Analyze specific feature
  const featureDir = `docs/features/${featureName}`;

  if (!dirExists(featureDir)) {
    console.error(`❌ Error: Feature not found: ${featureName}\n`);
    console.log('Available features:');

    const featuresDir = 'docs/features';
    if (dirExists(featuresDir)) {
      const features = listDirs(featuresDir);
      features.forEach(f => console.log(`  - ${f}`));
    }

    console.log('');
    return;
  }

  featuresToAnalyze = [featureName];
  console.log(`Analyzing feature: ${featureName}\n`);
} else {
  // Analyze all features
  const featuresDir = 'docs/features';

  if (!dirExists(featuresDir)) {
    console.error('❌ Error: No features directory found.\n');
    console.log('Create a feature first using: /spec.feature [name] "[description]"');
    console.log('');
    return;
  }

  featuresToAnalyze = listDirs(featuresDir);

  if (featuresToAnalyze.length === 0) {
    console.log('ℹ️  No features found.\n');
    return;
  }

  console.log(`Analyzing all features (${featuresToAnalyze.length} found)\n`);
}
```

### Step 2: Implement Task Parser (Task 11.1 integrated)

Parse markdown task lists into structured objects:

```typescript
interface ParsedTask {
  id: string;                // "1", "2.1", "3.1.2"
  title: string;             // Task title
  description: string;       // Full description
  completed: boolean;        // true if [x], false if [ ]
  optional: boolean;         // true if [ ]*
  requirementRefs: string[]; // ["FR-1.1.1", "FR-2.3.4"]
  indentLevel: number;       // 0, 1, 2, etc.
  parent?: string;           // Parent task ID (e.g., "2" for task "2.1")
  children: string[];        // Child task IDs
  lineNumber: number;        // Line in file
}

function parseTasksFromMarkdown(markdown: string, feature: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const lines = markdown.split('\n');

  let currentTask: ParsedTask | null = null;
  let inDescription = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match task line: - [ ] or - [x] or - [ ]* followed by task number and title
    const taskMatch = line.match(/^(\s*)- \[([ x])\](\*)?\s+(?:\*{0,2})(\d+(?:\.\d+)*)\.?\s+(.+?)(?:\*{0,2})$/);

    if (taskMatch) {
      // Save previous task
      if (currentTask) {
        tasks.push(currentTask);
      }

      const indent = taskMatch[1];
      const completed = taskMatch[2] === 'x';
      const optional = taskMatch[3] === '*';
      const id = taskMatch[4];
      const title = taskMatch[5].trim();

      // Calculate parent task ID
      let parent: string | undefined;
      if (id.includes('.')) {
        const parts = id.split('.');
        parts.pop(); // Remove last part
        parent = parts.join('.');
      }

      currentTask = {
        id,
        title,
        description: '',
        completed,
        optional,
        requirementRefs: [],
        indentLevel: Math.floor(indent.length / 2),
        parent,
        children: [],
        lineNumber: i + 1
      };

      inDescription = true;
      continue;
    }

    // Parse requirement references
    if (currentTask && line.trim().match(/^_?Requirements?:(.+)_?$/i)) {
      const reqMatch = line.match(/(?:FR-\d+\.\d+\.\d+|NFR-\d+\.\d+\.\d+|AC-\d+)/g);
      if (reqMatch) {
        currentTask.requirementRefs.push(...reqMatch);
      }
      inDescription = false;
      continue;
    }

    // Parse description (lines after task but before requirements)
    if (currentTask && inDescription && line.trim() && !line.trim().startsWith('-')) {
      currentTask.description += (currentTask.description ? ' ' : '') + line.trim();
    }
  }

  // Save last task
  if (currentTask) {
    tasks.push(currentTask);
  }

  // Build parent-child relationships
  for (const task of tasks) {
    if (task.parent) {
      const parentTask = tasks.find(t => t.id === task.parent);
      if (parentTask) {
        parentTask.children.push(task.id);
      }
    }
  }

  return tasks;
}

console.log('✓ Task parser initialized\n');
```

### Step 3: Implement Dependency Analyzer (Task 11.2 integrated)

Analyze task dependencies and identify blocked tasks:

```typescript
interface TaskDependency {
  taskId: string;
  dependsOn: string[];       // Task IDs this task depends on
  blocked: boolean;          // True if any dependency incomplete
  blockingTasks: string[];   // IDs of incomplete dependencies
}

function analyzeDependencies(tasks: ParsedTask[]): Map<string, TaskDependency> {
  const dependencies = new Map<string, TaskDependency>();

  for (const task of tasks) {
    const deps: string[] = [];
    let blocked = false;
    const blockingTasks: string[] = [];

    // Rule 1: Parent-child dependency (1.1 depends on 1)
    if (task.parent) {
      deps.push(task.parent);

      const parentTask = tasks.find(t => t.id === task.parent);
      if (parentTask && !parentTask.completed) {
        blocked = true;
        blockingTasks.push(task.parent);
      }
    }

    // Rule 2: Sequential dependency (task N depends on task N-1)
    // Only applies to main tasks (no decimal point)
    if (!task.id.includes('.')) {
      const taskNum = parseInt(task.id, 10);
      if (taskNum > 1) {
        const previousTaskId = (taskNum - 1).toString();
        const previousTask = tasks.find(t => t.id === previousTaskId);

        if (previousTask) {
          deps.push(previousTaskId);

          if (!previousTask.completed) {
            blocked = true;
            blockingTasks.push(previousTaskId);
          }
        }
      }
    }

    // Rule 3: Sibling dependency (2.2 depends on 2.1)
    // Sub-tasks depend on previous siblings
    if (task.id.includes('.')) {
      const parts = task.id.split('.');
      const lastPart = parseInt(parts[parts.length - 1], 10);

      if (lastPart > 1) {
        const previousSiblingParts = [...parts];
        previousSiblingParts[previousSiblingParts.length - 1] = (lastPart - 1).toString();
        const previousSiblingId = previousSiblingParts.join('.');

        const previousSibling = tasks.find(t => t.id === previousSiblingId);
        if (previousSibling) {
          deps.push(previousSiblingId);

          if (!previousSibling.completed) {
            blocked = true;
            blockingTasks.push(previousSiblingId);
          }
        }
      }
    }

    dependencies.set(task.id, {
      taskId: task.id,
      dependsOn: deps,
      blocked,
      blockingTasks
    });
  }

  return dependencies;
}

console.log('✓ Dependency analyzer initialized\n');
```

### Step 4: Parse Tasks from All Features

Process each feature's tasks.md file:

```typescript
interface FeatureTaskStatus {
  feature: string;
  hasTasks: boolean;
  tasks: ParsedTask[];
  dependencies: Map<string, TaskDependency>;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  blockedTasks: number;
  completionPercentage: number;
}

const featureStatuses: FeatureTaskStatus[] = [];

for (const feature of featuresToAnalyze) {
  const tasksPath = `docs/features/${feature}/tasks.md`;

  const status: FeatureTaskStatus = {
    feature,
    hasTasks: false,
    tasks: [],
    dependencies: new Map(),
    totalTasks: 0,
    completedTasks: 0,
    remainingTasks: 0,
    blockedTasks: 0,
    completionPercentage: 0
  };

  if (!fileExists(tasksPath)) {
    featureStatuses.push(status);
    continue;
  }

  status.hasTasks = true;

  const tasksContent = readFile(tasksPath);
  status.tasks = parseTasksFromMarkdown(tasksContent, feature);
  status.dependencies = analyzeDependencies(status.tasks);

  // Filter out optional tasks from statistics
  const nonOptionalTasks = status.tasks.filter(t => !t.optional);

  status.totalTasks = nonOptionalTasks.length;
  status.completedTasks = nonOptionalTasks.filter(t => t.completed).length;
  status.remainingTasks = status.totalTasks - status.completedTasks;

  // Count blocked tasks
  status.blockedTasks = nonOptionalTasks.filter(t => {
    const dep = status.dependencies.get(t.id);
    return dep && dep.blocked && !t.completed;
  }).length;

  status.completionPercentage = status.totalTasks > 0
    ? Math.round((status.completedTasks / status.totalTasks) * 100)
    : 0;

  featureStatuses.push(status);
}

console.log('✓ Parsed task data from all features\n');
```

### Step 5: Calculate Overall Statistics

Aggregate statistics across all features:

```typescript
interface OverallStats {
  totalFeatures: number;
  featuresWithTasks: number;
  featuresWithoutTasks: number;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  blockedTasks: number;
  overallCompletion: number;
}

const stats: OverallStats = {
  totalFeatures: featureStatuses.length,
  featuresWithTasks: 0,
  featuresWithoutTasks: 0,
  totalTasks: 0,
  completedTasks: 0,
  remainingTasks: 0,
  blockedTasks: 0,
  overallCompletion: 0
};

for (const feature of featureStatuses) {
  if (feature.hasTasks) {
    stats.featuresWithTasks++;
    stats.totalTasks += feature.totalTasks;
    stats.completedTasks += feature.completedTasks;
    stats.remainingTasks += feature.remainingTasks;
    stats.blockedTasks += feature.blockedTasks;
  } else {
    stats.featuresWithoutTasks++;
  }
}

stats.overallCompletion = stats.totalTasks > 0
  ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
  : 0;
```

### Step 6: Display Per-Feature Task Status

Show detailed status for each feature:

```typescript
console.log('═══════════════════════════════════════');
console.log('Task Status by Feature');
console.log('═══════════════════════════════════════');
console.log('');

// Sort features by completion (ascending - show incomplete first)
const sortedFeatures = featureStatuses.sort((a, b) => {
  if (a.completionPercentage !== b.completionPercentage) {
    return a.completionPercentage - b.completionPercentage;
  }
  return a.feature.localeCompare(b.feature);
});

for (const feature of sortedFeatures) {
  if (!feature.hasTasks) {
    console.log(`✗ ${feature.feature} - No tasks defined`);
    console.log(`    Generate tasks with: /spec.tasks ${feature.feature}`);
    console.log('');
    continue;
  }

  // Feature header with progress bar
  const progressBar = generateProgressBar(feature.completionPercentage);
  console.log(`${feature.feature} ${progressBar} ${feature.completionPercentage}%`);
  console.log('');

  // Statistics
  console.log(`  Tasks: ${feature.completedTasks}/${feature.totalTasks} complete`);
  console.log(`  Remaining: ${feature.remainingTasks}`);

  if (feature.blockedTasks > 0) {
    console.log(`  Blocked: ${feature.blockedTasks}`);
  }

  console.log('');

  // Show incomplete tasks
  const incompleteTasks = feature.tasks.filter(t => !t.completed && !t.optional);

  if (incompleteTasks.length > 0) {
    console.log('  Incomplete tasks:');

    // Show up to 5 incomplete tasks
    const tasksToShow = incompleteTasks.slice(0, 5);

    for (const task of tasksToShow) {
      const dep = feature.dependencies.get(task.id);
      const blocked = dep && dep.blocked;

      if (blocked) {
        console.log(`    ⊗ ${task.id}. ${task.title} - BLOCKED`);
        console.log(`      Waiting on: ${dep.blockingTasks.join(', ')}`);
      } else {
        console.log(`    ○ ${task.id}. ${task.title}`);
      }
    }

    if (incompleteTasks.length > 5) {
      console.log(`    ... and ${incompleteTasks.length - 5} more`);
    }
  }

  console.log('');
}

function generateProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;

  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}
```

### Step 7: Display Blocked Tasks Report

Show all blocked tasks with dependency details:

```typescript
// Collect all blocked tasks across features
const allBlockedTasks: Array<{
  feature: string;
  task: ParsedTask;
  dependency: TaskDependency;
}> = [];

for (const feature of featureStatuses) {
  if (!feature.hasTasks) continue;

  for (const task of feature.tasks) {
    if (task.completed || task.optional) continue;

    const dep = feature.dependencies.get(task.id);
    if (dep && dep.blocked) {
      allBlockedTasks.push({ feature: feature.feature, task, dependency: dep });
    }
  }
}

if (allBlockedTasks.length > 0) {
  console.log('═══════════════════════════════════════');
  console.log('Blocked Tasks');
  console.log('═══════════════════════════════════════');
  console.log('');

  console.log(`${allBlockedTasks.length} task(s) are blocked by incomplete dependencies:\n`);

  for (const blocked of allBlockedTasks) {
    console.log(`⊗ ${blocked.feature} / ${blocked.task.id}. ${blocked.task.title}`);
    console.log(`  Blocked by: ${blocked.dependency.blockingTasks.join(', ')}`);
    console.log('');
  }
}
```

### Step 8: Display Overall Summary

Show project-wide statistics:

```typescript
console.log('═══════════════════════════════════════');
console.log('Overall Progress');
console.log('═══════════════════════════════════════');
console.log('');

console.log('Features:');
console.log(`  Total: ${stats.totalFeatures}`);
console.log(`  With tasks: ${stats.featuresWithTasks}`);
console.log(`  Without tasks: ${stats.featuresWithoutTasks}`);
console.log('');

console.log('Tasks:');
console.log(`  Total: ${stats.totalTasks}`);
console.log(`  Completed: ${stats.completedTasks}`);
console.log(`  Remaining: ${stats.remainingTasks}`);
console.log(`  Blocked: ${stats.blockedTasks}`);
console.log('');

const progressBar = generateProgressBar(stats.overallCompletion, 30);
console.log(`Overall Progress: ${progressBar} ${stats.overallCompletion}%`);
console.log('');

// Health indicator
const health = getProgressHealth(stats.overallCompletion, stats.blockedTasks, stats.totalTasks);
console.log(`Project Health: ${health}`);
console.log('');

function getProgressHealth(completion: number, blocked: number, total: number): string {
  const blockedPercentage = total > 0 ? (blocked / total) * 100 : 0;

  if (completion === 100) return '🟢 Complete';
  if (completion >= 75 && blockedPercentage < 10) return '🟢 On Track';
  if (completion >= 50 && blockedPercentage < 20) return '🟡 Progressing';
  if (completion >= 25 && blockedPercentage < 30) return '🟠 Needs Attention';
  return '🔴 Behind Schedule';
}
```

### Step 9: Display Next Actions

Provide actionable recommendations:

```typescript
console.log('═══════════════════════════════════════');
console.log('Recommended Next Actions');
console.log('═══════════════════════════════════════');
console.log('');

const recommendations: string[] = [];

// Prioritize unblocked tasks
const unblockedTasks: Array<{ feature: string; task: ParsedTask }> = [];

for (const feature of featureStatuses) {
  if (!feature.hasTasks) continue;

  for (const task of feature.tasks) {
    if (task.completed || task.optional) continue;

    const dep = feature.dependencies.get(task.id);
    if (!dep || !dep.blocked) {
      unbl ockedTasks.push({ feature: feature.feature, task });
    }
  }
}

if (unblockedTasks.length > 0) {
  console.log('Ready to implement (not blocked):');
  console.log('');

  // Show top 5 unblocked tasks
  const tasksToShow = unblockedTasks.slice(0, 5);

  for (const { feature, task } of tasksToShow) {
    console.log(`  ${feature} / ${task.id}. ${task.title}`);
    console.log(`    Run: /spec.task ${feature} ${task.id}`);
    console.log('');
  }

  if (unblockedTasks.length > 5) {
    console.log(`  ... and ${unblockedTasks.length - 5} more unblocked task(s)`);
    console.log('');
  }
} else if (allBlockedTasks.length > 0) {
  console.log('All tasks are blocked!');
  console.log('');
  console.log('Complete these blocking tasks first:');
  console.log('');

  // Show unique blocking task IDs
  const blockingIds = new Set<string>();
  for (const blocked of allBlockedTasks) {
    blocked.dependency.blockingTasks.forEach(id => blockingIds.add(id));
  }

  for (const id of blockingIds) {
    console.log(`  Task ${id}`);
  }

  console.log('');
} else if (stats.featuresWithoutTasks > 0) {
  console.log('Some features have no tasks defined:');
  console.log('');

  for (const feature of featureStatuses) {
    if (!feature.hasTasks) {
      console.log(`  ${feature.feature}`);
      console.log(`    Run: /spec.tasks ${feature.feature}`);
      console.log('');
    }
  }
} else {
  console.log('✓ All tasks are complete!');
  console.log('');
  console.log('Consider running /spec.validate to ensure quality.');
  console.log('');
}
```

### Step 10: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed to the next step.

```typescript
// Command execution STOPS here
```

### Step 11: Offer Next Step (Optional)

After stopping, optionally suggest actions:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');

if (unblockedTasks.length > 0) {
  console.log('You have tasks ready to implement.');
  console.log('');

  const startWork = askYesNo('Would you like to start working on the first unblocked task?');

  if (startWork) {
    const { feature, task } = unbl ockedTasks[0];

    console.log('');
    console.log(`Starting: ${feature} / ${task.id}. ${task.title}`);
    console.log('');

    executeCommand(`/spec.task ${feature} ${task.id}`);

    // STOP again after that command completes
  } else {
    console.log('');
    console.log('You can implement tasks anytime using:');
    console.log(`  /spec.task [feature] [task-id]`);
    console.log('');
  }
} else if (stats.remainingTasks === 0) {
  console.log('All tasks complete! Run /spec.validate to verify quality.');
  console.log('');
} else {
  console.log('Focus on unblocking tasks to resume progress.');
  console.log('');
}
```

## Data Models

### ParsedTask Interface

```typescript
interface ParsedTask {
  id: string;                // "1", "2.1", "3.1.2"
  title: string;
  description: string;
  completed: boolean;        // [x] vs [ ]
  optional: boolean;         // [ ]*
  requirementRefs: string[];
  indentLevel: number;
  parent?: string;           // Parent task ID
  children: string[];        // Child task IDs
  lineNumber: number;
}
```

### TaskDependency Interface

```typescript
interface TaskDependency {
  taskId: string;
  dependsOn: string[];       // All dependencies
  blocked: boolean;          // True if any dependency incomplete
  blockingTasks: string[];   // IDs of incomplete dependencies
}
```

### FeatureTaskStatus Interface

```typescript
interface FeatureTaskStatus {
  feature: string;
  hasTasks: boolean;
  tasks: ParsedTask[];
  dependencies: Map<string, TaskDependency>;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  blockedTasks: number;
  completionPercentage: number;
}
```

### OverallStats Interface

```typescript
interface OverallStats {
  totalFeatures: number;
  featuresWithTasks: number;
  featuresWithoutTasks: number;
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  blockedTasks: number;
  overallCompletion: number;
}
```

## Dependency Rules

The dependency analyzer implements these rules:

1. **Parent-Child**: Sub-task 1.1 depends on task 1
2. **Sequential**: Task 2 depends on task 1 (main tasks only)
3. **Sibling**: Sub-task 2.2 depends on sub-task 2.1

## Example Output

```
═══════════════════════════════════════
Task Status by Feature
═══════════════════════════════════════

user-authentication [████████████████████] 100%

  Tasks: 12/12 complete
  Remaining: 0

data-export [████████░░░░░░░░░░░░] 40%

  Tasks: 4/10 complete
  Remaining: 6
  Blocked: 2

  Incomplete tasks:
    ○ 5. Implement ExportService
    ⊗ 6. Test ExportService - BLOCKED
      Waiting on: 5
    ○ 7. Add CSV format support

═══════════════════════════════════════
Blocked Tasks
═══════════════════════════════════════

2 task(s) are blocked by incomplete dependencies:

⊗ data-export / 6. Test ExportService
  Blocked by: 5

⊗ data-export / 7.1. CSV formatter tests
  Blocked by: 7

═══════════════════════════════════════
Overall Progress
═══════════════════════════════════════

Features:
  Total: 2
  With tasks: 2
  Without tasks: 0

Tasks:
  Total: 22
  Completed: 16
  Remaining: 6
  Blocked: 2

Overall Progress: [████████████████████░░░░░░░░░░] 73%

Project Health: 🟡 Progressing
```

## Requirements Satisfied

- ✅ FR-5.8.1: Parses markdown task lists with checkbox syntax
- ✅ FR-5.8.2: Extracts task IDs, titles, and metadata
- ✅ FR-5.8.3: Aggregates statistics across all features
- ✅ FR-5.8.4: Identifies blocked tasks with dependency information
- ✅ Task 11.1: Implements task parser for markdown
- ✅ Task 11.2: Implements dependency analyzer
- ✅ Scans all features for tasks.md files
- ✅ Groups tasks by feature for display
- ✅ Shows progress statistics per feature
- ✅ Displays overall summary with visual indicators
- ✅ Highlights blocked tasks with blocking details
- ✅ Calculates completion percentages
- ✅ Provides actionable next steps
