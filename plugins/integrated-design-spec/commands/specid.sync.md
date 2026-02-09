# /specid.sync - Synchronize Status Across Documents

You are executing the `/specid.sync` command to automatically update status across all planning documents based on actual progress.

## Command Arguments

- **--dry-run**: Show what would change without actually writing files (optional)
- **--scope**: Limit sync to specific area: "specs", "features", "epics", or "all" (default: "all")

## Command Purpose

This command propagates status bottom-up through the hierarchy:
- **Specs** → status based on task completion in `tasks.md`
- **Features** → status based on linked spec statuses
- **Epics** → status based on feature statuses

This keeps your entire project status up-to-date automatically, eliminating manual status tracking overhead.

## Status Rules

### Spec Status (from tasks.md)
- **Draft**: No tasks defined yet, or all tasks are placeholders
- **Ready**: Tasks defined and ready to start
- **In Progress**: At least one task checked `[x]`, but not all
- **Done**: All tasks checked `[x]`
- **Blocked**: Contains "BLOCKED" or "⚠️" marker in tasks

### Feature Status (from linked specs)
- **Draft**: No specs created yet, or all specs are Draft
- **Ready**: All specs are Ready or Done, none In Progress
- **In Progress**: At least one spec is In Progress
- **Done**: All specs are Done
- **Blocked**: Any spec is Blocked

### Epic Status (from features)
- **Draft**: No features created yet, or all features are Draft
- **Ready**: All features are Ready or Done, none In Progress
- **In Progress**: At least one feature is In Progress
- **Done**: All features are Done
- **Blocked**: Any feature is Blocked

## Execution Steps

### Step 1: Parse Arguments and Initialize

```typescript
const dryRun = args['dry-run'] || false;
const scope = args.scope || 'all';

console.log('═══════════════════════════════════════');
console.log('Status Synchronization');
console.log('═══════════════════════════════════════');
console.log('');

if (dryRun) {
  console.log('🔍 DRY RUN MODE - No files will be modified');
  console.log('');
}

console.log(`Scope: ${scope}`);
console.log('');
```

### Step 2: Scan and Analyze Specs

```typescript
console.log('Scanning specs...');

const specsDir = 'docs/specs';
const specStatuses = new Map<string, SpecStatus>();

if (!dirExists(specsDir)) {
  console.log('⚠️  No specs directory found');
  console.log('');
} else {
  const specDirs = listDirectories(specsDir);

  for (const specDir of specDirs) {
    const specNumber = specDir.match(/^(\d+)/)?.[1];
    if (!specNumber) continue;

    const tasksPath = `${specsDir}/${specDir}/tasks.md`;
    const requirementsPath = `${specsDir}/${specDir}/requirements.md`;

    if (!fileExists(tasksPath)) {
      // No tasks file = Draft
      specStatuses.set(specNumber, {
        number: specNumber,
        name: specDir,
        currentStatus: 'Draft',
        newStatus: 'Draft',
        reason: 'No tasks.md file',
        path: requirementsPath
      });
      continue;
    }

    const tasksContent = readFile(tasksPath);
    const status = analyzeSpecStatus(tasksContent);

    // Try to get current status from requirements.md
    let currentStatus = 'Draft';
    if (fileExists(requirementsPath)) {
      const reqContent = readFile(requirementsPath);
      const statusMatch = reqContent.match(/\*\*Status\*\*:\s*(.+)$/m);
      if (statusMatch) {
        currentStatus = statusMatch[1].trim();
      }
    }

    specStatuses.set(specNumber, {
      number: specNumber,
      name: specDir,
      currentStatus: currentStatus,
      newStatus: status.status,
      reason: status.reason,
      path: requirementsPath,
      tasksTotal: status.totalTasks,
      tasksCompleted: status.completedTasks
    });
  }

  console.log(`✓ Analyzed ${specStatuses.size} specs`);
  console.log('');
}
```

### Step 3: Scan and Analyze Features

```typescript
console.log('Scanning features...');

const featuresDir = 'docs/planning/features';
const featureStatuses = new Map<string, FeatureStatus>();

if (!dirExists(featuresDir)) {
  console.log('⚠️  No features directory found');
  console.log('');
} else {
  const featureFiles = glob(`${featuresDir}/FEAT-*.md`);

  for (const featureFile of featureFiles) {
    const featureContent = readFile(featureFile);
    const featureId = featureFile.match(/FEAT-\d+/)?.[0];
    if (!featureId) continue;

    // Extract current status
    const statusMatch = featureContent.match(/\*\*Status\*\*:\s*(.+)$/m);
    const currentStatus = statusMatch ? statusMatch[1].trim() : 'Draft';

    // Find linked specs
    const linkedSpecs = extractLinkedSpecs(featureContent);

    // Calculate new status based on specs
    const newStatus = calculateFeatureStatus(linkedSpecs, specStatuses);

    featureStatuses.set(featureId, {
      id: featureId,
      currentStatus: currentStatus,
      newStatus: newStatus.status,
      reason: newStatus.reason,
      path: featureFile,
      linkedSpecs: linkedSpecs,
      specsTotal: linkedSpecs.length,
      specsDone: linkedSpecs.filter(s => {
        const spec = specStatuses.get(s);
        return spec && spec.newStatus === 'Done';
      }).length
    });
  }

  console.log(`✓ Analyzed ${featureStatuses.size} features`);
  console.log('');
}
```

### Step 4: Scan and Analyze Epics

```typescript
console.log('Scanning epics...');

const epicsDir = 'docs/planning/epics';
const epicStatuses = new Map<string, EpicStatus>();

if (!dirExists(epicsDir)) {
  console.log('⚠️  No epics directory found (epics are optional)');
  console.log('');
} else {
  const epicFiles = glob(`${epicsDir}/EPIC-*.md`);

  for (const epicFile of epicFiles) {
    const epicContent = readFile(epicFile);
    const epicId = epicFile.match(/EPIC-\d+/)?.[0];
    if (!epicId) continue;

    // Extract current status
    const statusMatch = epicContent.match(/\*\*Status\*\*:\s*(.+)$/m);
    const currentStatus = statusMatch ? statusMatch[1].trim() : 'Draft';

    // Find linked features
    const linkedFeatures = extractLinkedFeatures(epicContent);

    // Calculate new status based on features
    const newStatus = calculateEpicStatus(linkedFeatures, featureStatuses);

    epicStatuses.set(epicId, {
      id: epicId,
      currentStatus: currentStatus,
      newStatus: newStatus.status,
      reason: newStatus.reason,
      path: epicFile,
      linkedFeatures: linkedFeatures,
      featuresTotal: linkedFeatures.length,
      featuresDone: linkedFeatures.filter(f => {
        const feature = featureStatuses.get(f);
        return feature && feature.newStatus === 'Done';
      }).length
    });
  }

  console.log(`✓ Analyzed ${epicStatuses.size} epics`);
  console.log('');
}
```

### Step 5: Present Changes Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('Proposed Status Changes');
console.log('═══════════════════════════════════════');
console.log('');

let changesCount = 0;

// Specs changes
if (scope === 'all' || scope === 'specs') {
  const specChanges = Array.from(specStatuses.values())
    .filter(s => s.currentStatus !== s.newStatus);

  if (specChanges.length > 0) {
    console.log('## Specs');
    console.log('');
    console.log('| Spec | Current | New | Reason |');
    console.log('|------|---------|-----|--------|');

    for (const spec of specChanges) {
      console.log(`| ${spec.name} | ${spec.currentStatus} | ${spec.newStatus} | ${spec.reason} |`);
      changesCount++;
    }
    console.log('');
  }
}

// Feature changes
if (scope === 'all' || scope === 'features') {
  const featureChanges = Array.from(featureStatuses.values())
    .filter(f => f.currentStatus !== f.newStatus);

  if (featureChanges.length > 0) {
    console.log('## Features');
    console.log('');
    console.log('| Feature | Current | New | Reason |');
    console.log('|---------|---------|-----|--------|');

    for (const feature of featureChanges) {
      console.log(`| ${feature.id} | ${feature.currentStatus} | ${feature.newStatus} | ${feature.reason} |`);
      changesCount++;
    }
    console.log('');
  }
}

// Epic changes
if (scope === 'all' || scope === 'epics') {
  const epicChanges = Array.from(epicStatuses.values())
    .filter(e => e.currentStatus !== e.newStatus);

  if (epicChanges.length > 0) {
    console.log('## Epics');
    console.log('');
    console.log('| Epic | Current | New | Reason |');
    console.log('|------|---------|-----|--------|');

    for (const epic of epicChanges) {
      console.log(`| ${epic.id} | ${epic.currentStatus} | ${epic.newStatus} | ${epic.reason} |`);
      changesCount++;
    }
    console.log('');
  }
}

if (changesCount === 0) {
  console.log('✓ No status changes needed - everything is up to date!');
  console.log('');
  return;
}

console.log(`Total changes: ${changesCount}`);
console.log('');
```

### Step 6: Show Project Overview

```typescript
console.log('═══════════════════════════════════════');
console.log('Project Status Overview');
console.log('═══════════════════════════════════════');
console.log('');

// Specs overview
if (specStatuses.size > 0) {
  const specsByStatus = groupByStatus(Array.from(specStatuses.values()), 'newStatus');

  console.log('Specs:');
  console.log(`  Draft: ${specsByStatus.Draft || 0}`);
  console.log(`  Ready: ${specsByStatus.Ready || 0}`);
  console.log(`  In Progress: ${specsByStatus['In Progress'] || 0}`);
  console.log(`  Done: ${specsByStatus.Done || 0}`);
  console.log(`  Blocked: ${specsByStatus.Blocked || 0}`);

  // Progress percentage
  const totalSpecs = specStatuses.size;
  const doneSpecs = specsByStatus.Done || 0;
  const progress = Math.round((doneSpecs / totalSpecs) * 100);
  console.log(`  Progress: ${doneSpecs}/${totalSpecs} (${progress}%)`);
  console.log('');
}

// Features overview
if (featureStatuses.size > 0) {
  const featuresByStatus = groupByStatus(Array.from(featureStatuses.values()), 'newStatus');

  console.log('Features:');
  console.log(`  Draft: ${featuresByStatus.Draft || 0}`);
  console.log(`  Ready: ${featuresByStatus.Ready || 0}`);
  console.log(`  In Progress: ${featuresByStatus['In Progress'] || 0}`);
  console.log(`  Done: ${featuresByStatus.Done || 0}`);
  console.log(`  Blocked: ${featuresByStatus.Blocked || 0}`);

  const totalFeatures = featureStatuses.size;
  const doneFeatures = featuresByStatus.Done || 0;
  const progress = Math.round((doneFeatures / totalFeatures) * 100);
  console.log(`  Progress: ${doneFeatures}/${totalFeatures} (${progress}%)`);
  console.log('');
}

// Epics overview
if (epicStatuses.size > 0) {
  const epicsByStatus = groupByStatus(Array.from(epicStatuses.values()), 'newStatus');

  console.log('Epics:');
  console.log(`  Draft: ${epicsByStatus.Draft || 0}`);
  console.log(`  Ready: ${epicsByStatus.Ready || 0}`);
  console.log(`  In Progress: ${epicsByStatus['In Progress'] || 0}`);
  console.log(`  Done: ${epicsByStatus.Done || 0}`);
  console.log(`  Blocked: ${epicsByStatus.Blocked || 0}`);

  const totalEpics = epicStatuses.size;
  const doneEpics = epicsByStatus.Done || 0;
  const progress = Math.round((doneEpics / totalEpics) * 100);
  console.log(`  Progress: ${doneEpics}/${totalEpics} (${progress}%)`);
  console.log('');
}
```

### Step 7: Identify Blockers and Items Needing Attention

```typescript
console.log('═══════════════════════════════════════');
console.log('Items Needing Attention');
console.log('═══════════════════════════════════════');
console.log('');

const blockedItems = [];
const inProgressItems = [];

// Find blocked items
for (const spec of specStatuses.values()) {
  if (spec.newStatus === 'Blocked') {
    blockedItems.push(`Spec ${spec.name}: ${spec.reason}`);
  }
}

for (const feature of featureStatuses.values()) {
  if (feature.newStatus === 'Blocked') {
    blockedItems.push(`${feature.id}: ${feature.reason}`);
  }
}

for (const epic of epicStatuses.values()) {
  if (epic.newStatus === 'Blocked') {
    blockedItems.push(`${epic.id}: ${epic.reason}`);
  }
}

if (blockedItems.length > 0) {
  console.log('⚠️  Blocked Items:');
  for (const item of blockedItems) {
    console.log(`  - ${item}`);
  }
  console.log('');
}

// Find in-progress items
for (const spec of specStatuses.values()) {
  if (spec.newStatus === 'In Progress') {
    inProgressItems.push(`Spec ${spec.name}: ${spec.tasksCompleted}/${spec.tasksTotal} tasks`);
  }
}

for (const feature of featureStatuses.values()) {
  if (feature.newStatus === 'In Progress') {
    inProgressItems.push(`${feature.id}: ${feature.specsDone}/${feature.specsTotal} specs done`);
  }
}

if (inProgressItems.length > 0) {
  console.log('🔄 In Progress:');
  for (const item of inProgressItems) {
    console.log(`  - ${item}`);
  }
  console.log('');
}

if (blockedItems.length === 0 && inProgressItems.length === 0) {
  console.log('✓ No items need immediate attention');
  console.log('');
}
```

### Step 8: Confirm Changes

```typescript
if (dryRun) {
  console.log('');
  console.log('This was a dry run - no files were modified.');
  console.log('Run without --dry-run to apply these changes.');
  console.log('');
  return;
}

console.log('───────────────────────────────────────');
console.log('Confirmation');
console.log('───────────────────────────────────────');
console.log('');

const confirm = askYesNo(`Apply these ${changesCount} status updates?`);

if (!confirm) {
  console.log('');
  console.log('Cancelled - no changes made.');
  console.log('');
  return;
}

console.log('');
```

### Step 9: Apply Updates

```typescript
console.log('Applying updates...');
console.log('');

const today = new Date().toISOString().split('T')[0];
let updatedCount = 0;

// Update specs
if (scope === 'all' || scope === 'specs') {
  for (const spec of specStatuses.values()) {
    if (spec.currentStatus !== spec.newStatus && fileExists(spec.path)) {
      let content = readFile(spec.path);

      // Update status
      content = content.replace(
        /\*\*Status\*\*:\s*.+$/m,
        `**Status**: ${spec.newStatus}`
      );

      // Update date
      if (content.match(/\*\*Last Updated\*\*/)) {
        content = content.replace(
          /\*\*Last Updated\*\*:\s*.+$/m,
          `**Last Updated**: ${today}`
        );
      }

      writeFile(spec.path, content);
      console.log(`✓ Updated ${spec.name}: ${spec.currentStatus} → ${spec.newStatus}`);
      updatedCount++;
    }
  }
}

// Update features
if (scope === 'all' || scope === 'features') {
  for (const feature of featureStatuses.values()) {
    if (feature.currentStatus !== feature.newStatus && fileExists(feature.path)) {
      let content = readFile(feature.path);

      // Update status
      content = content.replace(
        /\*\*Status\*\*:\s*.+$/m,
        `**Status**: ${feature.newStatus}`
      );

      // Update date
      if (content.match(/\*\*Last Updated\*\*/)) {
        content = content.replace(
          /\*\*Last Updated\*\*:\s*.+$/m,
          `**Last Updated**: ${today}`
        );
      }

      writeFile(feature.path, content);
      console.log(`✓ Updated ${feature.id}: ${feature.currentStatus} → ${feature.newStatus}`);
      updatedCount++;
    }
  }
}

// Update epics
if (scope === 'all' || scope === 'epics') {
  for (const epic of epicStatuses.values()) {
    if (epic.currentStatus !== epic.newStatus && fileExists(epic.path)) {
      let content = readFile(epic.path);

      // Update status
      content = content.replace(
        /\*\*Status\*\*:\s*.+$/m,
        `**Status**: ${epic.newStatus}`
      );

      // Update date
      if (content.match(/\*\*Last Updated\*\*/)) {
        content = content.replace(
          /\*\*Last Updated\*\*:\s*.+$/m,
          `**Last Updated**: ${today}`
        );
      }

      writeFile(epic.path, content);
      console.log(`✓ Updated ${epic.id}: ${epic.currentStatus} → ${epic.newStatus}`);
      updatedCount++;
    }
  }
}

console.log('');
console.log(`✓ Updated ${updatedCount} documents`);
console.log('');
```

### Step 10: Display Summary

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Status Synchronization Complete');
console.log('═══════════════════════════════════════');
console.log('');
console.log(`Documents updated: ${updatedCount}`);
console.log(`Date: ${today}`);
console.log('');

if (blockedItems.length > 0) {
  console.log('⚠️  Note: You have blocked items that need attention');
  console.log('');
}
```

### Step 11: STOP EXECUTION

```typescript
// Command execution STOPS here
```

### Step 12: Suggest Next Steps

```typescript
console.log('───────────────────────────────────────');
console.log('Next Steps');
console.log('───────────────────────────────────────');
console.log('');

if (blockedItems.length > 0) {
  console.log('1. Address blocked items to unblock progress');
  console.log('');
}

if (inProgressItems.length > 0) {
  console.log('2. Continue working on in-progress items:');
  for (const item of inProgressItems.slice(0, 3)) {
    console.log(`   - ${item}`);
  }
  console.log('');
}

const readySpecs = Array.from(specStatuses.values())
  .filter(s => s.newStatus === 'Ready')
  .slice(0, 3);

if (readySpecs.length > 0) {
  console.log('3. Start working on ready specs:');
  for (const spec of readySpecs) {
    console.log(`   - ${spec.name}`);
  }
  console.log('');
}

console.log('Run /specid.sync regularly to keep status current.');
console.log('Use /specid.sync --dry-run to preview changes first.');
console.log('');
```

## Helper Functions

### Analyze Spec Status

```typescript
function analyzeSpecStatus(tasksContent: string): { status: string; reason: string; totalTasks: number; completedTasks: number } {
  // Check for blocked markers
  if (tasksContent.match(/BLOCKED|⚠️|🚫/i)) {
    return {
      status: 'Blocked',
      reason: 'Contains blocked marker',
      totalTasks: 0,
      completedTasks: 0
    };
  }

  // Count tasks
  const allTasks = tasksContent.match(/^- \[[ x]\]/gm) || [];
  const completedTasks = tasksContent.match(/^- \[x\]/gm) || [];

  const total = allTasks.length;
  const completed = completedTasks.length;

  if (total === 0) {
    // Check if it's truly empty or just placeholders
    if (tasksContent.match(/TODO|TBD|placeholder/i)) {
      return {
        status: 'Draft',
        reason: 'Tasks are placeholders',
        totalTasks: 0,
        completedTasks: 0
      };
    }
    return {
      status: 'Draft',
      reason: 'No tasks defined',
      totalTasks: 0,
      completedTasks: 0
    };
  }

  if (completed === 0) {
    return {
      status: 'Ready',
      reason: 'Tasks defined but not started',
      totalTasks: total,
      completedTasks: 0
    };
  }

  if (completed === total) {
    return {
      status: 'Done',
      reason: 'All tasks completed',
      totalTasks: total,
      completedTasks: completed
    };
  }

  return {
    status: 'In Progress',
    reason: `${completed}/${total} tasks completed`,
    totalTasks: total,
    completedTasks: completed
  };
}
```

### Extract Linked Specs

```typescript
function extractLinkedSpecs(featureContent: string): string[] {
  const specs: string[] = [];

  // Look for spec links in various formats
  const specMatches = featureContent.matchAll(/Spec\s+(\d+)/gi);

  for (const match of specMatches) {
    const specNumber = match[1].padStart(3, '0');
    if (!specs.includes(specNumber)) {
      specs.push(specNumber);
    }
  }

  // Also check for directory-style links
  const dirMatches = featureContent.matchAll(/specs\/(\d+)-/g);

  for (const match of dirMatches) {
    const specNumber = match[1].padStart(3, '0');
    if (!specs.includes(specNumber)) {
      specs.push(specNumber);
    }
  }

  return specs.sort();
}
```

### Calculate Feature Status

```typescript
function calculateFeatureStatus(
  linkedSpecs: string[],
  specStatuses: Map<string, SpecStatus>
): { status: string; reason: string } {

  if (linkedSpecs.length === 0) {
    return {
      status: 'Draft',
      reason: 'No specs created yet'
    };
  }

  const statuses = linkedSpecs.map(specNum => {
    const spec = specStatuses.get(specNum);
    return spec ? spec.newStatus : 'Draft';
  });

  // Check for blocked
  if (statuses.includes('Blocked')) {
    const blockedSpecs = linkedSpecs.filter(s => {
      const spec = specStatuses.get(s);
      return spec && spec.newStatus === 'Blocked';
    });
    return {
      status: 'Blocked',
      reason: `Spec ${blockedSpecs[0]} is blocked`
    };
  }

  // Check for in progress
  if (statuses.includes('In Progress')) {
    const inProgressSpecs = linkedSpecs.filter(s => {
      const spec = specStatuses.get(s);
      return spec && spec.newStatus === 'In Progress';
    });
    return {
      status: 'In Progress',
      reason: `Spec ${inProgressSpecs[0]} in progress`
    };
  }

  // Check if all done
  if (statuses.every(s => s === 'Done')) {
    return {
      status: 'Done',
      reason: 'All specs completed'
    };
  }

  // Check if all ready or done
  if (statuses.every(s => s === 'Ready' || s === 'Done')) {
    return {
      status: 'Ready',
      reason: 'All specs ready or done'
    };
  }

  // Otherwise draft
  return {
    status: 'Draft',
    reason: 'Some specs still in draft'
  };
}
```

### Extract Linked Features

```typescript
function extractLinkedFeatures(epicContent: string): string[] {
  const features: string[] = [];

  // Look for FEAT-NNN patterns
  const featMatches = epicContent.matchAll(/FEAT-(\d+)/g);

  for (const match of featMatches) {
    const featureId = `FEAT-${match[1]}`;
    if (!features.includes(featureId)) {
      features.push(featureId);
    }
  }

  return features.sort();
}
```

### Calculate Epic Status

```typescript
function calculateEpicStatus(
  linkedFeatures: string[],
  featureStatuses: Map<string, FeatureStatus>
): { status: string; reason: string } {

  if (linkedFeatures.length === 0) {
    return {
      status: 'Draft',
      reason: 'No features created yet'
    };
  }

  const statuses = linkedFeatures.map(featId => {
    const feature = featureStatuses.get(featId);
    return feature ? feature.newStatus : 'Draft';
  });

  // Check for blocked
  if (statuses.includes('Blocked')) {
    const blockedFeatures = linkedFeatures.filter(f => {
      const feature = featureStatuses.get(f);
      return feature && feature.newStatus === 'Blocked';
    });
    return {
      status: 'Blocked',
      reason: `${blockedFeatures[0]} is blocked`
    };
  }

  // Check for in progress
  if (statuses.includes('In Progress')) {
    const inProgressFeatures = linkedFeatures.filter(f => {
      const feature = featureStatuses.get(f);
      return feature && feature.newStatus === 'In Progress';
    });
    return {
      status: 'In Progress',
      reason: `${inProgressFeatures[0]} in progress`
    };
  }

  // Check if all done
  if (statuses.every(s => s === 'Done')) {
    return {
      status: 'Done',
      reason: 'All features completed'
    };
  }

  // Check if all ready or done
  if (statuses.every(s => s === 'Ready' || s === 'Done')) {
    return {
      status: 'Ready',
      reason: 'All features ready or done'
    };
  }

  // Otherwise draft
  return {
    status: 'Draft',
    reason: 'Some features still in draft'
  };
}
```

### Group By Status

```typescript
function groupByStatus(items: any[], statusField: string): Record<string, number> {
  const groups: Record<string, number> = {};

  for (const item of items) {
    const status = item[statusField] || 'Draft';
    groups[status] = (groups[status] || 0) + 1;
  }

  return groups;
}
```

## Type Definitions

```typescript
interface SpecStatus {
  number: string;
  name: string;
  currentStatus: string;
  newStatus: string;
  reason: string;
  path: string;
  tasksTotal?: number;
  tasksCompleted?: number;
}

interface FeatureStatus {
  id: string;
  currentStatus: string;
  newStatus: string;
  reason: string;
  path: string;
  linkedSpecs: string[];
  specsTotal: number;
  specsDone: number;
}

interface EpicStatus {
  id: string;
  currentStatus: string;
  newStatus: string;
  reason: string;
  path: string;
  linkedFeatures: string[];
  featuresTotal: number;
  featuresDone: number;
}
```

## Usage Examples

### Example 1: Regular Sync

```bash
/specid.sync
```

Scans all specs, features, and epics, shows proposed changes, and applies after confirmation.

### Example 2: Dry Run

```bash
/specid.sync --dry-run
```

Shows what would change without actually modifying files. Great for checking status before committing.

### Example 3: Scope to Specs Only

```bash
/specid.sync --scope specs
```

Only updates spec statuses, leaves features and epics unchanged.

### Example 4: Automated in CI/CD

```bash
# In a git hook or CI pipeline
/specid.sync --dry-run > status-report.txt
```

Generate status reports without modifying files.

## Requirements Satisfied

- ✅ Automatically determines status from task completion
- ✅ Propagates status bottom-up (specs → features → epics)
- ✅ Shows comprehensive project overview with progress percentages
- ✅ Identifies blocked items and items needing attention
- ✅ Supports dry-run mode for preview
- ✅ Supports scoped updates (specs, features, epics, all)
- ✅ Updates "Last Updated" dates automatically
- ✅ Provides clear change summary before applying
- ✅ Suggests next steps based on current status
- ✅ Works with the new EPIC-NNN/FEAT-NNN numbering system
