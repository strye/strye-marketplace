# /spec.status - Project Documentation Status

You are executing the `/spec.status` command to view the status of all project documentation including steering documents and feature specifications.

## Command Arguments

None - this command displays status for the entire project.

## Command Purpose

Provide a comprehensive overview of:
- Steering document status (product.md, tech.md, structure.md)
- Feature specification completeness
- Documentation freshness (last modified dates)
- Missing or outdated documents
- Overall project health metrics

## Execution Steps

### Step 1: Check Steering Documents

Scan for steering documents and get their status:

```typescript
console.log('Checking project documentation status...\n');

interface SteeringDocStatus {
  name: string;
  path: string;
  exists: boolean;
  lastModified?: Date;
  outdated: boolean;
  daysOld?: number;
}

const steeringDocs: SteeringDocStatus[] = [
  { name: 'Product Steering', path: 'docs/steering/product.md', exists: false, outdated: false },
  { name: 'Tech Steering', path: 'docs/steering/tech.md', exists: false, outdated: false },
  { name: 'Structure Steering', path: 'docs/steering/structure.md', exists: false, outdated: false }
];

const OUTDATED_THRESHOLD_DAYS = 30;

for (const doc of steeringDocs) {
  if (fileExists(doc.path)) {
    doc.exists = true;

    // Get file modification time
    const stats = getFileStats(doc.path);
    doc.lastModified = stats.mtime;

    // Calculate days since last modification
    const now = new Date();
    const diffMs = now.getTime() - doc.lastModified.getTime();
    doc.daysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Mark as outdated if > 30 days
    doc.outdated = doc.daysOld > OUTDATED_THRESHOLD_DAYS;
  }
}

console.log('✓ Scanned steering documents\n');
```

### Step 2: Scan Features Directory

Discover all features and check their documentation:

```typescript
const featuresDir = 'docs/features';

if (!dirExists(featuresDir)) {
  console.log('ℹ️  No features directory found.\n');
  console.log('This project has no features yet.');
  console.log('Create your first feature with: /spec.feature [name] "[description]"\n');

  // Still show steering docs status
  displaySteeringStatus(steeringDocs);
  return;
}

const featureNames = listDirs(featuresDir);

if (featureNames.length === 0) {
  console.log('ℹ️  Features directory is empty.\n');
  console.log('Create your first feature with: /spec.feature [name] "[description]"\n');

  // Still show steering docs status
  displaySteeringStatus(steeringDocs);
  return;
}

console.log(`✓ Found ${featureNames.length} feature(s)\n`);
```

### Step 3: Check Feature Completeness

For each feature, check which documents exist:

```typescript
interface FeatureStatus {
  name: string;
  requirementsExists: boolean;
  requirementsModified?: Date;
  requirementsDaysOld?: number;
  designExists: boolean;
  designModified?: Date;
  designDaysOld?: number;
  tasksExists: boolean;
  tasksModified?: Date;
  tasksDaysOld?: number;
  completeness: number;      // 0-100%
  missingDocs: string[];
  outdatedDocs: string[];
}

const featureStatuses: FeatureStatus[] = [];

for (const featureName of featureNames) {
  const featureDir = `${featuresDir}/${featureName}`;

  const status: FeatureStatus = {
    name: featureName,
    requirementsExists: false,
    designExists: false,
    tasksExists: false,
    completeness: 0,
    missingDocs: [],
    outdatedDocs: []
  };

  // Check requirements.md
  const requirementsPath = `${featureDir}/requirements.md`;
  if (fileExists(requirementsPath)) {
    status.requirementsExists = true;
    const stats = getFileStats(requirementsPath);
    status.requirementsModified = stats.mtime;

    const diffMs = new Date().getTime() - status.requirementsModified.getTime();
    status.requirementsDaysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (status.requirementsDaysOld > OUTDATED_THRESHOLD_DAYS) {
      status.outdatedDocs.push('requirements.md');
    }
  } else {
    status.missingDocs.push('requirements.md');
  }

  // Check design.md
  const designPath = `${featureDir}/design.md`;
  if (fileExists(designPath)) {
    status.designExists = true;
    const stats = getFileStats(designPath);
    status.designModified = stats.mtime;

    const diffMs = new Date().getTime() - status.designModified.getTime();
    status.designDaysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (status.designDaysOld > OUTDATED_THRESHOLD_DAYS) {
      status.outdatedDocs.push('design.md');
    }
  } else {
    status.missingDocs.push('design.md');
  }

  // Check tasks.md
  const tasksPath = `${featureDir}/tasks.md`;
  if (fileExists(tasksPath)) {
    status.tasksExists = true;
    const stats = getFileStats(tasksPath);
    status.tasksModified = stats.mtime;

    const diffMs = new Date().getTime() - status.tasksModified.getTime();
    status.tasksDaysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (status.tasksDaysOld > OUTDATED_THRESHOLD_DAYS) {
      status.outdatedDocs.push('tasks.md');
    }
  } else {
    status.missingDocs.push('tasks.md');
  }

  // Calculate completeness percentage
  const docsPresent = [
    status.requirementsExists,
    status.designExists,
    status.tasksExists
  ].filter(Boolean).length;

  status.completeness = Math.round((docsPresent / 3) * 100);

  featureStatuses.push(status);
}

console.log('✓ Analyzed feature documentation\n');
```

### Step 4: Calculate Summary Statistics

Aggregate statistics across all features:

```typescript
interface ProjectStats {
  totalFeatures: number;
  completeFeatures: number;      // 100% completeness
  partialFeatures: number;        // > 0% but < 100%
  emptyFeatures: number;          // 0% completeness
  totalDocs: number;              // Total expected documents
  existingDocs: number;           // Documents that exist
  missingDocs: number;            // Documents missing
  outdatedDocs: number;           // Documents > 30 days old
  overallCompleteness: number;    // 0-100%
}

const stats: ProjectStats = {
  totalFeatures: featureStatuses.length,
  completeFeatures: 0,
  partialFeatures: 0,
  emptyFeatures: 0,
  totalDocs: featureStatuses.length * 3,  // 3 docs per feature
  existingDocs: 0,
  missingDocs: 0,
  outdatedDocs: 0,
  overallCompleteness: 0
};

for (const feature of featureStatuses) {
  if (feature.completeness === 100) {
    stats.completeFeatures++;
  } else if (feature.completeness === 0) {
    stats.emptyFeatures++;
  } else {
    stats.partialFeatures++;
  }

  const docsPresent = [
    feature.requirementsExists,
    feature.designExists,
    feature.tasksExists
  ].filter(Boolean).length;

  stats.existingDocs += docsPresent;
  stats.missingDocs += feature.missingDocs.length;
  stats.outdatedDocs += feature.outdatedDocs.length;
}

stats.overallCompleteness = Math.round((stats.existingDocs / stats.totalDocs) * 100);
```

### Step 5: Display Steering Document Status

Show steering documents section:

```typescript
function displaySteeringStatus(steeringDocs: SteeringDocStatus[]): void {
  console.log('═══════════════════════════════════════');
  console.log('Steering Documents');
  console.log('═══════════════════════════════════════');
  console.log('');

  for (const doc of steeringDocs) {
    if (doc.exists) {
      const status = doc.outdated ? '⚠' : '✓';
      const age = doc.daysOld !== undefined ? ` (${doc.daysOld} days old)` : '';
      const outdatedWarning = doc.outdated ? ' - OUTDATED' : '';

      console.log(`  ${status} ${doc.name}${age}${outdatedWarning}`);

      if (doc.lastModified) {
        const dateStr = doc.lastModified.toLocaleDateString();
        console.log(`    Last modified: ${dateStr}`);
      }
    } else {
      console.log(`  ✗ ${doc.name} - MISSING`);
      console.log(`    Create with: /spec.steering "[guidance]"`);
    }

    console.log('');
  }
}

displaySteeringStatus(steeringDocs);
```

### Step 6: Display Feature Status

Show detailed feature status:

```typescript
console.log('═══════════════════════════════════════');
console.log('Feature Documentation');
console.log('═══════════════════════════════════════');
console.log('');

// Sort features by completeness (descending) then name
const sortedFeatures = featureStatuses.sort((a, b) => {
  if (a.completeness !== b.completeness) {
    return b.completeness - a.completeness;
  }
  return a.name.localeCompare(b.name);
});

for (const feature of sortedFeatures) {
  // Feature header with completeness
  const completenessIndicator = getCompletenessIndicator(feature.completeness);
  console.log(`${completenessIndicator} ${feature.name} (${feature.completeness}% complete)`);

  // Show document status
  console.log('');

  // Requirements
  if (feature.requirementsExists) {
    const status = feature.outdatedDocs.includes('requirements.md') ? '⚠' : '✓';
    const age = feature.requirementsDaysOld !== undefined ? ` (${feature.requirementsDaysOld} days old)` : '';
    console.log(`    ${status} requirements.md${age}`);
  } else {
    console.log(`    ✗ requirements.md - MISSING`);
  }

  // Design
  if (feature.designExists) {
    const status = feature.outdatedDocs.includes('design.md') ? '⚠' : '✓';
    const age = feature.designDaysOld !== undefined ? ` (${feature.designDaysOld} days old)` : '';
    console.log(`    ${status} design.md${age}`);
  } else {
    console.log(`    ✗ design.md - MISSING`);
  }

  // Tasks
  if (feature.tasksExists) {
    const status = feature.outdatedDocs.includes('tasks.md') ? '⚠' : '✓';
    const age = feature.tasksDaysOld !== undefined ? ` (${feature.tasksDaysOld} days old)` : '';
    console.log(`    ${status} tasks.md${age}`);
  } else {
    console.log(`    ✗ tasks.md - MISSING`);
  }

  // Show recommendations for missing docs
  if (feature.missingDocs.length > 0) {
    console.log('');
    console.log('    Next steps:');

    if (feature.missingDocs.includes('requirements.md')) {
      console.log(`      • /spec.feature ${feature.name} "[description]"`);
    }
    if (feature.missingDocs.includes('design.md')) {
      console.log(`      • /spec.design ${feature.name}`);
    }
    if (feature.missingDocs.includes('tasks.md')) {
      console.log(`      • /spec.tasks ${feature.name}`);
    }
  }

  console.log('');
}

function getCompletenessIndicator(completeness: number): string {
  if (completeness === 100) return '✓';
  if (completeness === 0) return '✗';
  return '◐';  // Partial
}
```

### Step 7: Display Summary Statistics

Show overall project health:

```typescript
console.log('═══════════════════════════════════════');
console.log('Project Summary');
console.log('═══════════════════════════════════════');
console.log('');

console.log('Features:');
console.log(`  Total: ${stats.totalFeatures}`);
console.log(`  Complete (100%): ${stats.completeFeatures}`);
console.log(`  Partial: ${stats.partialFeatures}`);
console.log(`  Empty (0%): ${stats.emptyFeatures}`);
console.log('');

console.log('Documentation:');
console.log(`  Total expected: ${stats.totalDocs} documents`);
console.log(`  Existing: ${stats.existingDocs}`);
console.log(`  Missing: ${stats.missingDocs}`);
console.log(`  Outdated (>30 days): ${stats.outdatedDocs}`);
console.log('');

console.log(`Overall Completeness: ${stats.overallCompleteness}%`);
console.log('');

// Display health indicator
const healthIndicator = getProjectHealthIndicator(stats.overallCompleteness);
console.log(`Project Health: ${healthIndicator}`);
console.log('');

function getProjectHealthIndicator(completeness: number): string {
  if (completeness >= 90) return '🟢 Excellent';
  if (completeness >= 70) return '🟡 Good';
  if (completeness >= 50) return '🟠 Fair';
  return '🔴 Needs Attention';
}
```

### Step 8: Display Recommendations

Provide actionable next steps:

```typescript
console.log('═══════════════════════════════════════');
console.log('Recommendations');
console.log('═══════════════════════════════════════');
console.log('');

const recommendations: string[] = [];

// Check for missing steering docs
const missingSteeringDocs = steeringDocs.filter(d => !d.exists);
if (missingSteeringDocs.length > 0) {
  recommendations.push(
    `Create missing steering documents (${missingSteeringDocs.map(d => d.name).join(', ')})`
  );
}

// Check for outdated steering docs
const outdatedSteeringDocs = steeringDocs.filter(d => d.outdated);
if (outdatedSteeringDocs.length > 0) {
  recommendations.push(
    `Update outdated steering documents (${outdatedSteeringDocs.map(d => d.name).join(', ')})`
  );
}

// Check for empty features
if (stats.emptyFeatures > 0) {
  recommendations.push(
    `${stats.emptyFeatures} feature(s) have no documentation - start with requirements`
  );
}

// Check for incomplete features
if (stats.partialFeatures > 0) {
  recommendations.push(
    `${stats.partialFeatures} feature(s) partially documented - complete the workflow`
  );
}

// Check for outdated feature docs
if (stats.outdatedDocs > 0) {
  recommendations.push(
    `${stats.outdatedDocs} document(s) haven't been updated in 30+ days - review for accuracy`
  );
}

// Suggest validation if docs exist
if (stats.existingDocs > 0 && stats.missingDocs === 0) {
  recommendations.push(
    'All documents present - run /spec.validate to check quality'
  );
}

if (recommendations.length === 0) {
  console.log('✓ Project documentation is up to date!');
  console.log('');
  console.log('Consider running /spec.validate to ensure quality.');
} else {
  recommendations.forEach((rec, idx) => {
    console.log(`${idx + 1}. ${rec}`);
  });
}

console.log('');
```

### Step 9: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed to the next step.

```typescript
// Command execution STOPS here
```

### Step 10: Offer Next Step (Optional)

After stopping, optionally suggest actions:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');

if (stats.missingDocs > 0 || stats.emptyFeatures > 0) {
  console.log('Your project has incomplete documentation.');
  console.log('');

  const takeAction = askYesNo('Would you like help completing the missing documentation?');

  if (takeAction) {
    console.log('');
    console.log('Recommended workflow:');
    console.log('');

    // Find first feature with missing docs
    const incompleteFeature = featureStatuses.find(f => f.completeness < 100);

    if (incompleteFeature) {
      console.log(`Feature: ${incompleteFeature.name}`);
      console.log('');

      if (incompleteFeature.missingDocs.includes('requirements.md')) {
        console.log(`1. Create requirements: /spec.feature ${incompleteFeature.name} "[description]"`);
      } else if (incompleteFeature.missingDocs.includes('design.md')) {
        console.log(`1. Create design: /spec.design ${incompleteFeature.name}`);
      } else if (incompleteFeature.missingDocs.includes('tasks.md')) {
        console.log(`1. Generate tasks: /spec.tasks ${incompleteFeature.name}`);
      }

      console.log('');
    }
  } else {
    console.log('');
    console.log('You can complete documentation anytime using the commands shown above.');
  }
} else if (stats.outdatedDocs > 0) {
  console.log('Some documents haven\'t been updated recently.');
  console.log('');
  console.log('Consider reviewing outdated documents to ensure they reflect current requirements.');
} else {
  console.log('Documentation is complete!');
  console.log('');
  console.log('Run /spec.validate to check specification quality.');
}

console.log('');
```

## Data Models

### SteeringDocStatus Interface

```typescript
interface SteeringDocStatus {
  name: string;              // "Product Steering"
  path: string;              // "docs/steering/product.md"
  exists: boolean;
  lastModified?: Date;
  outdated: boolean;         // true if > 30 days old
  daysOld?: number;
}
```

### FeatureStatus Interface

```typescript
interface FeatureStatus {
  name: string;
  requirementsExists: boolean;
  requirementsModified?: Date;
  requirementsDaysOld?: number;
  designExists: boolean;
  designModified?: Date;
  designDaysOld?: number;
  tasksExists: boolean;
  tasksModified?: Date;
  tasksDaysOld?: number;
  completeness: number;      // 0, 33, 67, or 100
  missingDocs: string[];
  outdatedDocs: string[];
}
```

### ProjectStats Interface

```typescript
interface ProjectStats {
  totalFeatures: number;
  completeFeatures: number;      // 100% completeness
  partialFeatures: number;        // > 0% but < 100%
  emptyFeatures: number;          // 0% completeness
  totalDocs: number;
  existingDocs: number;
  missingDocs: number;
  outdatedDocs: number;
  overallCompleteness: number;    // 0-100%
}
```

## Helper Functions

### Get Completeness Indicator

```typescript
function getCompletenessIndicator(completeness: number): string {
  if (completeness === 100) return '✓';   // Complete
  if (completeness === 0) return '✗';     // Empty
  return '◐';                              // Partial
}
```

### Get Project Health Indicator

```typescript
function getProjectHealthIndicator(completeness: number): string {
  if (completeness >= 90) return '🟢 Excellent';
  if (completeness >= 70) return '🟡 Good';
  if (completeness >= 50) return '🟠 Fair';
  return '🔴 Needs Attention';
}
```

### Calculate Feature Completeness

```typescript
function calculateCompleteness(
  requirementsExists: boolean,
  designExists: boolean,
  tasksExists: boolean
): number {
  const docsPresent = [
    requirementsExists,
    designExists,
    tasksExists
  ].filter(Boolean).length;

  return Math.round((docsPresent / 3) * 100);
}

// Returns: 0%, 33%, 67%, or 100%
```

## Important Notes

1. **Execution Control**: This command STOPS after displaying the status report. Next steps are optional and require permission.

2. **Outdated Threshold**: Documents are flagged as outdated if not modified in 30+ days.

3. **Completeness Calculation**:
   - 0/3 documents = 0%
   - 1/3 documents = 33%
   - 2/3 documents = 67%
   - 3/3 documents = 100%

4. **Visual Indicators**:
   - ✓ = Complete/Present
   - ✗ = Missing
   - ⚠ = Outdated
   - ◐ = Partial

5. **Health Metrics**:
   - 🟢 Excellent: 90-100% complete
   - 🟡 Good: 70-89% complete
   - 🟠 Fair: 50-69% complete
   - 🔴 Needs Attention: < 50% complete

6. **Actionable Recommendations**: The command suggests specific next steps based on the current state.

## Example Output

```
═══════════════════════════════════════
Steering Documents
═══════════════════════════════════════

  ✓ Product Steering (15 days old)
    Last modified: 2025-10-25

  ✓ Tech Steering (8 days old)
    Last modified: 2025-11-01

  ⚠ Structure Steering (45 days old) - OUTDATED
    Last modified: 2025-09-25

═══════════════════════════════════════
Feature Documentation
═══════════════════════════════════════

✓ user-authentication (100% complete)

    ✓ requirements.md (12 days old)
    ✓ design.md (10 days old)
    ✓ tasks.md (5 days old)

◐ data-export (67% complete)

    ✓ requirements.md (3 days old)
    ✓ design.md (2 days old)
    ✗ tasks.md - MISSING

    Next steps:
      • /spec.tasks data-export

✗ payment-processing (0% complete)

    ✗ requirements.md - MISSING
    ✗ design.md - MISSING
    ✗ tasks.md - MISSING

    Next steps:
      • /spec.feature payment-processing "[description]"

═══════════════════════════════════════
Project Summary
═══════════════════════════════════════

Features:
  Total: 3
  Complete (100%): 1
  Partial: 1
  Empty (0%): 1

Documentation:
  Total expected: 9 documents
  Existing: 5
  Missing: 4
  Outdated (>30 days): 1

Overall Completeness: 56%

Project Health: 🟠 Fair

═══════════════════════════════════════
Recommendations
═══════════════════════════════════════

1. Update outdated steering documents (Structure Steering)
2. 1 feature(s) have no documentation - start with requirements
3. 1 feature(s) partially documented - complete the workflow
4. 1 document(s) haven't been updated in 30+ days - review for accuracy
```

## Requirements Satisfied

- ✅ FR-5.7.1: Checks steering documents with file stats
- ✅ FR-5.7.2: Scans all features and checks documentation
- ✅ FR-5.7.3: Calculates feature completeness (0%, 33%, 67%, 100%)
- ✅ FR-5.7.4: Identifies missing and outdated documents
- ✅ FR-5.7.5: Generates formatted status report with visual indicators
- ✅ Shows steering document status with modification dates
- ✅ Displays feature list with completeness percentages
- ✅ Highlights missing and outdated documents
- ✅ Shows overall summary statistics
- ✅ Provides actionable recommendations
