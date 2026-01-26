# /spec.validate - Validate Specification Completeness

You are executing the `/spec.validate` command to validate all feature specifications for completeness, consistency, and quality.

## Command Arguments

- **feature-name**: Optional feature name to validate specific feature (if omitted, validates all features)

## Command Purpose

Validate feature specifications to ensure:
- All requirements are covered in design documents (requirement traceability)
- All design elements map to implementation tasks (design traceability)
- Designs align with tech steering guidance
- Code structure follows structure steering conventions
- Specifications meet quality standards from refinement checklist

Generates a comprehensive validation report with errors, warnings, and recommendations.

## Execution Steps

### Step 1: Parse Arguments and Determine Scope

Determine which features to validate:

```typescript
// Parse optional feature name argument
const featureName = args['feature-name'] || args.featureName || args.name;

let featuresToValidate: string[] = [];

if (featureName) {
  // Validate specific feature
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

  featuresToValidate = [featureName];
  console.log(`Validating feature: ${featureName}\n`);
} else {
  // Validate all features
  const featuresDir = 'docs/features';

  if (!dirExists(featuresDir)) {
    console.error('❌ Error: No features directory found.\n');
    console.log('There are no features to validate.');
    console.log('Create a feature first using: /spec.feature [name] "[description]"');
    console.log('');
    return;
  }

  featuresToValidate = listDirs(featuresDir);

  if (featuresToValidate.length === 0) {
    console.log('ℹ️  No features found to validate.\n');
    return;
  }

  console.log(`Validating all features (${featuresToValidate.length} found)\n`);
}
```

### Step 2: Load Steering Documents

Read steering documents for validation context:

```typescript
console.log('Loading steering documents...\n');

let techSteering = '';
let structureSteering = '';
let productSteering = '';

const techPath = 'docs/steering/tech.md';
const structurePath = 'docs/steering/structure.md';
const productPath = 'docs/steering/product.md';

if (fileExists(techPath)) {
  techSteering = readFile(techPath);
  console.log(`✓ Loaded ${techPath}`);
} else {
  console.log(`⚠️  ${techPath} not found (skipping tech validation)`);
}

if (fileExists(structurePath)) {
  structureSteering = readFile(structurePath);
  console.log(`✓ Loaded ${structurePath}`);
} else {
  console.log(`⚠️  ${structurePath} not found (skipping structure validation)`);
}

if (fileExists(productPath)) {
  productSteering = readFile(productPath);
  console.log(`✓ Loaded ${productPath}`);
} else {
  console.log(`⚠️  ${productPath} not found (product steering optional)`);
}

console.log('');
```

### Step 3: Load Refinement Checklist (Optional)

Load quality checklist if available:

```typescript
let refinementChecklist: string[] = [];

const checklistPath = '.spec/templates/refinement-checklist.md';

if (fileExists(checklistPath)) {
  console.log('Loading refinement checklist...\n');

  const checklistContent = readFile(checklistPath);

  // Parse checklist items (lines starting with - or *)
  refinementChecklist = checklistContent
    .split('\n')
    .filter(line => line.trim().match(/^[-*]\s+/))
    .map(line => line.trim().replace(/^[-*]\s+/, ''));

  console.log(`✓ Loaded ${refinementChecklist.length} checklist items\n`);
} else {
  console.log('ℹ️  No refinement checklist found (using default validation only)\n');
}
```

### Step 4: Validate Each Feature

Process each feature and collect validation issues:

```typescript
interface ValidationIssue {
  feature: string;
  severity: 'error' | 'warning' | 'info';
  category: 'traceability' | 'steering' | 'quality' | 'completeness';
  message: string;
  file?: string;
  recommendation: string;
}

interface FeatureValidationResult {
  feature: string;
  issues: ValidationIssue[];
  requirementsFile: boolean;
  designFile: boolean;
  tasksFile: boolean;
  requirementCount: number;
  requirementsCovered: number;
  designElementCount: number;
  designElementsCovered: number;
}

const validationResults: FeatureValidationResult[] = [];

console.log('═══════════════════════════════════════');
console.log('Validating Features');
console.log('═══════════════════════════════════════');
console.log('');

for (const feature of featuresToValidate) {
  console.log(`▶ Validating: ${feature}\n`);

  const result: FeatureValidationResult = {
    feature,
    issues: [],
    requirementsFile: false,
    designFile: false,
    tasksFile: false,
    requirementCount: 0,
    requirementsCovered: 0,
    designElementCount: 0,
    designElementsCovered: 0
  };

  const featureDir = `docs/features/${feature}`;
  const requirementsPath = `${featureDir}/requirements.md`;
  const designPath = `${featureDir}/design.md`;
  const tasksPath = `${featureDir}/tasks.md`;

  // Check file existence
  result.requirementsFile = fileExists(requirementsPath);
  result.designFile = fileExists(designPath);
  result.tasksFile = fileExists(tasksPath);

  // Validate file completeness
  if (!result.requirementsFile) {
    result.issues.push({
      feature,
      severity: 'error',
      category: 'completeness',
      message: 'Missing requirements.md',
      file: requirementsPath,
      recommendation: `Create requirements using: /spec.feature ${feature} "[description]"`
    });
  }

  if (!result.designFile) {
    result.issues.push({
      feature,
      severity: 'error',
      category: 'completeness',
      message: 'Missing design.md',
      file: designPath,
      recommendation: `Create design using: /spec.design ${feature}`
    });
  }

  if (!result.tasksFile) {
    result.issues.push({
      feature,
      severity: 'warning',
      category: 'completeness',
      message: 'Missing tasks.md',
      file: tasksPath,
      recommendation: `Generate tasks using: /spec.tasks ${feature}`
    });
  }

  // Only continue with detailed validation if we have both requirements and design
  if (result.requirementsFile && result.designFile) {
    const requirementsContent = readFile(requirementsPath);
    const designContent = readFile(designPath);
    const tasksContent = result.tasksFile ? readFile(tasksPath) : '';

    // Validate requirement traceability
    const traceabilityResult = validateRequirementTraceability(
      feature,
      requirementsContent,
      designContent
    );

    result.requirementCount = traceabilityResult.totalRequirements;
    result.requirementsCovered = traceabilityResult.coveredRequirements;
    result.issues.push(...traceabilityResult.issues);

    // Validate design-to-tasks traceability
    if (result.tasksFile) {
      const designTraceabilityResult = validateDesignTraceability(
        feature,
        designContent,
        tasksContent
      );

      result.designElementCount = designTraceabilityResult.totalElements;
      result.designElementsCovered = designTraceabilityResult.coveredElements;
      result.issues.push(...designTraceabilityResult.issues);
    }

    // Validate tech steering compliance
    if (techSteering) {
      const techComplianceIssues = validateTechSteering(
        feature,
        designContent,
        techSteering
      );
      result.issues.push(...techComplianceIssues);
    }

    // Validate structure steering compliance
    if (structureSteering) {
      const structureComplianceIssues = validateStructureSteering(
        feature,
        designContent,
        structureSteering
      );
      result.issues.push(...structureComplianceIssues);
    }

    // Apply refinement checklist
    if (refinementChecklist.length > 0) {
      const checklistIssues = applyRefinementChecklist(
        feature,
        requirementsContent,
        designContent,
        refinementChecklist
      );
      result.issues.push(...checklistIssues);
    }
  }

  validationResults.push(result);

  // Display feature summary
  const errorCount = result.issues.filter(i => i.severity === 'error').length;
  const warningCount = result.issues.filter(i => i.severity === 'warning').length;
  const infoCount = result.issues.filter(i => i.severity === 'info').length;

  if (errorCount === 0 && warningCount === 0 && infoCount === 0) {
    console.log(`  ✓ ${feature} - All validations passed\n`);
  } else {
    console.log(`  Issues found: ${errorCount} errors, ${warningCount} warnings, ${infoCount} info\n`);
  }
}

console.log('');
```

### Step 5: Implement Traceability Checker

Validate requirement-to-design traceability:

```typescript
interface TraceabilityResult {
  totalRequirements: number;
  coveredRequirements: number;
  uncoveredRequirements: string[];
  issues: ValidationIssue[];
}

function validateRequirementTraceability(
  feature: string,
  requirementsContent: string,
  designContent: string
): TraceabilityResult {
  const result: TraceabilityResult = {
    totalRequirements: 0,
    coveredRequirements: 0,
    uncoveredRequirements: [],
    issues: []
  };

  // Extract all requirement IDs (FR-*, NFR-*, AC-*)
  const requirementIdPattern = /(FR-\d+\.\d+\.\d+|NFR-\d+\.\d+\.\d+|AC-\d+)/g;
  const requirementIds = [...new Set(requirementsContent.match(requirementIdPattern) || [])];

  result.totalRequirements = requirementIds.length;

  if (result.totalRequirements === 0) {
    result.issues.push({
      feature,
      severity: 'warning',
      category: 'traceability',
      message: 'No requirement IDs found in requirements.md',
      file: `docs/features/${feature}/requirements.md`,
      recommendation: 'Use EARS notation with numbered requirements (FR-X.X.X, NFR-X.X.X, AC-X)'
    });
    return result;
  }

  // Check which requirements are referenced in design
  for (const reqId of requirementIds) {
    if (designContent.includes(reqId)) {
      result.coveredRequirements++;
    } else {
      result.uncoveredRequirements.push(reqId);
    }
  }

  // Report uncovered requirements
  if (result.uncoveredRequirements.length > 0) {
    const coverage = Math.round((result.coveredRequirements / result.totalRequirements) * 100);

    result.issues.push({
      feature,
      severity: 'error',
      category: 'traceability',
      message: `${result.uncoveredRequirements.length} requirements not covered in design (${coverage}% coverage)`,
      file: `docs/features/${feature}/design.md`,
      recommendation: `Add references to: ${result.uncoveredRequirements.slice(0, 3).join(', ')}${result.uncoveredRequirements.length > 3 ? ', ...' : ''}`
    });
  }

  return result;
}
```

### Step 6: Implement Design-to-Tasks Traceability

Validate design elements map to tasks:

```typescript
interface DesignTraceabilityResult {
  totalElements: number;
  coveredElements: number;
  uncoveredElements: string[];
  issues: ValidationIssue[];
}

function validateDesignTraceability(
  feature: string,
  designContent: string,
  tasksContent: string
): DesignTraceabilityResult {
  const result: DesignTraceabilityResult = {
    totalElements: 0,
    coveredElements: 0,
    uncoveredElements: [],
    issues: []
  };

  // Extract component names from design
  // Pattern: ## Component: ComponentName or ### ComponentName
  const componentPattern = /##\s+(?:Component:\s+)?([A-Z][a-zA-Z0-9]+(?:Service|Component|Controller|Store|Model|Handler|Validator)?)/g;
  const components = new Set<string>();

  let match;
  while ((match = componentPattern.exec(designContent)) !== null) {
    components.add(match[1]);
  }

  result.totalElements = components.size;

  if (result.totalElements === 0) {
    result.issues.push({
      feature,
      severity: 'warning',
      category: 'traceability',
      message: 'No design components found',
      file: `docs/features/${feature}/design.md`,
      recommendation: 'Add component sections with ## Component: ComponentName headings'
    });
    return result;
  }

  // Check which components are referenced in tasks
  for (const component of components) {
    if (tasksContent.includes(component)) {
      result.coveredElements++;
    } else {
      result.uncoveredElements.push(component);
    }
  }

  // Report uncovered components
  if (result.uncoveredElements.length > 0) {
    const coverage = Math.round((result.coveredElements / result.totalElements) * 100);

    result.issues.push({
      feature,
      severity: 'warning',
      category: 'traceability',
      message: `${result.uncoveredElements.length} design components not in tasks (${coverage}% coverage)`,
      file: `docs/features/${feature}/tasks.md`,
      recommendation: `Add tasks for: ${result.uncoveredElements.slice(0, 3).join(', ')}${result.uncoveredElements.length > 3 ? ', ...' : ''}`
    });
  }

  return result;
}
```

### Step 7: Validate Tech Steering Compliance

Check design aligns with tech decisions:

```typescript
function validateTechSteering(
  feature: string,
  designContent: string,
  techSteering: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Extract tech decisions from steering doc
  const techDecisions = parseTechDecisions(techSteering);

  // Check for required technology mentions
  if (techDecisions.language) {
    const languagePattern = new RegExp(techDecisions.language, 'i');
    if (!languagePattern.test(designContent)) {
      issues.push({
        feature,
        severity: 'info',
        category: 'steering',
        message: `Design doesn't mention primary language: ${techDecisions.language}`,
        file: `docs/features/${feature}/design.md`,
        recommendation: 'Ensure design specifies implementation language and framework'
      });
    }
  }

  // Check for architecture alignment
  if (techDecisions.architecture) {
    const architecturePattern = new RegExp(techDecisions.architecture, 'i');
    if (!architecturePattern.test(designContent)) {
      issues.push({
        feature,
        severity: 'warning',
        category: 'steering',
        message: `Design may not align with architecture: ${techDecisions.architecture}`,
        file: `docs/features/${feature}/design.md`,
        recommendation: 'Verify design follows project architecture patterns'
      });
    }
  }

  return issues;
}

function parseTechDecisions(techSteering: string): {
  language?: string;
  architecture?: string;
  database?: string;
} {
  const decisions: any = {};

  // Extract language (look for common patterns)
  const languageMatch = techSteering.match(/(?:language|framework):\s*([^\n]+)/i);
  if (languageMatch) {
    decisions.language = languageMatch[1].trim();
  }

  // Extract architecture
  const architectureMatch = techSteering.match(/(?:architecture|pattern):\s*([^\n]+)/i);
  if (architectureMatch) {
    decisions.architecture = architectureMatch[1].trim();
  }

  // Extract database
  const databaseMatch = techSteering.match(/(?:database|data store):\s*([^\n]+)/i);
  if (databaseMatch) {
    decisions.database = databaseMatch[1].trim();
  }

  return decisions;
}
```

### Step 8: Validate Structure Steering Compliance

Check code organization follows conventions:

```typescript
function validateStructureSteering(
  feature: string,
  designContent: string,
  structureSteering: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Extract structure conventions
  const conventions = parseStructureConventions(structureSteering);

  // Check naming conventions
  if (conventions.namingStyle) {
    const componentPattern = /(?:class|interface|const)\s+([A-Z][a-zA-Z0-9]+)/g;
    const components: string[] = [];

    let match;
    while ((match = componentPattern.exec(designContent)) !== null) {
      components.push(match[1]);
    }

    // Check if components follow naming convention
    if (conventions.namingStyle === 'PascalCase') {
      const invalidNames = components.filter(name => !name.match(/^[A-Z][a-zA-Z0-9]+$/));
      if (invalidNames.length > 0) {
        issues.push({
          feature,
          severity: 'info',
          category: 'steering',
          message: `${invalidNames.length} components may not follow PascalCase convention`,
          file: `docs/features/${feature}/design.md`,
          recommendation: 'Ensure all component names use PascalCase'
        });
      }
    }
  }

  // Check directory structure mentions
  if (conventions.directoryStructure) {
    const hasStructureSection = designContent.match(/##\s*(?:File|Directory|Project)\s+Structure/i);
    if (!hasStructureSection) {
      issues.push({
        feature,
        severity: 'info',
        category: 'steering',
        message: 'Design missing file structure section',
        file: `docs/features/${feature}/design.md`,
        recommendation: 'Add section documenting where files will be located'
      });
    }
  }

  return issues;
}

function parseStructureConventions(structureSteering: string): {
  namingStyle?: string;
  directoryStructure?: string;
} {
  const conventions: any = {};

  // Detect naming style
  if (structureSteering.match(/PascalCase/i)) {
    conventions.namingStyle = 'PascalCase';
  } else if (structureSteering.match(/camelCase/i)) {
    conventions.namingStyle = 'camelCase';
  } else if (structureSteering.match(/kebab-case/i)) {
    conventions.namingStyle = 'kebab-case';
  }

  // Check for directory structure mention
  if (structureSteering.match(/directory|folder|file\s+structure/i)) {
    conventions.directoryStructure = 'defined';
  }

  return conventions;
}
```

### Step 9: Apply Refinement Checklist

Validate against quality criteria:

```typescript
function applyRefinementChecklist(
  feature: string,
  requirementsContent: string,
  designContent: string,
  checklist: string[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for common quality criteria
  for (const item of checklist) {
    const lowerItem = item.toLowerCase();

    // User stories check
    if (lowerItem.includes('user stor')) {
      if (!requirementsContent.match(/As a .+, I want to .+, so that/i)) {
        issues.push({
          feature,
          severity: 'info',
          category: 'quality',
          message: 'Requirements missing user story format',
          file: `docs/features/${feature}/requirements.md`,
          recommendation: 'Add user stories using: As a [role], I want to [goal], so that [benefit]'
        });
      }
    }

    // Acceptance criteria check
    if (lowerItem.includes('acceptance criteria')) {
      if (!requirementsContent.match(/acceptance criteria/i)) {
        issues.push({
          feature,
          severity: 'warning',
          category: 'quality',
          message: 'Requirements missing acceptance criteria section',
          file: `docs/features/${feature}/requirements.md`,
          recommendation: 'Add numbered acceptance criteria with EARS notation'
        });
      }
    }

    // Test strategy check
    if (lowerItem.includes('test')) {
      if (!designContent.match(/test(?:ing)?\s+(?:strategy|plan|approach)/i)) {
        issues.push({
          feature,
          severity: 'info',
          category: 'quality',
          message: 'Design missing test strategy section',
          file: `docs/features/${feature}/design.md`,
          recommendation: 'Add test strategy section describing unit, integration, and e2e tests'
        });
      }
    }

    // Error handling check
    if (lowerItem.includes('error')) {
      if (!designContent.match(/error\s+(?:handling|strategy)/i)) {
        issues.push({
          feature,
          severity: 'warning',
          category: 'quality',
          message: 'Design missing error handling strategy',
          file: `docs/features/${feature}/design.md`,
          recommendation: 'Add error handling section describing error types and recovery'
        });
      }
    }

    // Data models check
    if (lowerItem.includes('data model') || lowerItem.includes('interface')) {
      if (!designContent.match(/interface\s+[A-Z]/)) {
        issues.push({
          feature,
          severity: 'info',
          category: 'quality',
          message: 'Design missing TypeScript interfaces',
          file: `docs/features/${feature}/design.md`,
          recommendation: 'Define TypeScript interfaces for all data models'
        });
      }
    }
  }

  return issues;
}
```

### Step 10: Generate Validation Report

Display comprehensive validation results:

```typescript
console.log('═══════════════════════════════════════');
console.log('Validation Report');
console.log('═══════════════════════════════════════');
console.log('');

// Calculate overall statistics
const totalFeatures = validationResults.length;
const totalIssues = validationResults.reduce((sum, r) => sum + r.issues.length, 0);
const totalErrors = validationResults.reduce(
  (sum, r) => sum + r.issues.filter(i => i.severity === 'error').length,
  0
);
const totalWarnings = validationResults.reduce(
  (sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length,
  0
);
const totalInfo = validationResults.reduce(
  (sum, r) => sum + r.issues.filter(i => i.severity === 'info').length,
  0
);

// Summary statistics
console.log('Summary:');
console.log(`  Features validated: ${totalFeatures}`);
console.log(`  Total issues: ${totalIssues}`);
console.log(`    Errors: ${totalErrors}`);
console.log(`    Warnings: ${totalWarnings}`);
console.log(`    Info: ${totalInfo}`);
console.log('');

// Display issues by feature
for (const result of validationResults) {
  const featureIssues = result.issues;

  if (featureIssues.length === 0) {
    console.log(`✓ ${result.feature} - All validations passed`);
    if (result.requirementCount > 0) {
      console.log(`    Requirements: ${result.requirementsCovered}/${result.requirementCount} covered (100%)`);
    }
    if (result.designElementCount > 0) {
      console.log(`    Design elements: ${result.designElementsCovered}/${result.designElementCount} covered (100%)`);
    }
    console.log('');
    continue;
  }

  console.log(`${result.feature}:`);
  console.log('');

  // Group issues by severity
  const errors = featureIssues.filter(i => i.severity === 'error');
  const warnings = featureIssues.filter(i => i.severity === 'warning');
  const info = featureIssues.filter(i => i.severity === 'info');

  if (errors.length > 0) {
    console.log('  Errors:');
    errors.forEach(issue => {
      console.log(`    ✗ ${issue.message}`);
      if (issue.file) {
        console.log(`      File: ${issue.file}`);
      }
      console.log(`      Fix: ${issue.recommendation}`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log('  Warnings:');
    warnings.forEach(issue => {
      console.log(`    ⚠  ${issue.message}`);
      if (issue.file) {
        console.log(`      File: ${issue.file}`);
      }
      console.log(`      Suggestion: ${issue.recommendation}`);
      console.log('');
    });
  }

  if (info.length > 0) {
    console.log('  Info:');
    info.forEach(issue => {
      console.log(`    ℹ  ${issue.message}`);
      if (issue.file) {
        console.log(`      File: ${issue.file}`);
      }
      console.log(`      Suggestion: ${issue.recommendation}`);
      console.log('');
    });
  }

  // Display traceability metrics
  if (result.requirementCount > 0) {
    const reqCoverage = Math.round((result.requirementsCovered / result.requirementCount) * 100);
    console.log(`  Requirement Coverage: ${result.requirementsCovered}/${result.requirementCount} (${reqCoverage}%)`);
  }

  if (result.designElementCount > 0) {
    const designCoverage = Math.round((result.designElementsCovered / result.designElementCount) * 100);
    console.log(`  Design Coverage: ${result.designElementsCovered}/${result.designElementCount} (${designCoverage}%)`);
  }

  console.log('');
}
```

### Step 11: Display Overall Status

Show validation conclusion:

```typescript
console.log('═══════════════════════════════════════');

if (totalErrors === 0 && totalWarnings === 0) {
  console.log('✓ All Validations Passed');
} else if (totalErrors === 0) {
  console.log('⚠  Validation Complete with Warnings');
} else {
  console.log('✗ Validation Failed');
}

console.log('═══════════════════════════════════════');
console.log('');

// Provide next steps
if (totalErrors > 0) {
  console.log('Next Steps:');
  console.log('  1. Fix all errors (critical issues)');
  console.log('  2. Address warnings (recommended improvements)');
  console.log('  3. Re-run validation to verify fixes');
  console.log('');
} else if (totalWarnings > 0) {
  console.log('Next Steps:');
  console.log('  1. Review warnings and apply recommendations');
  console.log('  2. Re-run validation to confirm improvements');
  console.log('');
} else {
  console.log('Your specifications are complete and consistent!');
  console.log('');
}
```

### Step 12: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed to the next step.

```typescript
// Command execution STOPS here
```

### Step 13: Offer Next Step (Optional)

After stopping, optionally suggest fixes:

```typescript
console.log('───────────────────────────────────────');
console.log('Next Step (Optional)');
console.log('───────────────────────────────────────');
console.log('');

if (totalErrors > 0 || totalWarnings > 0) {
  console.log('Would you like help fixing the validation issues?');
  console.log('');

  const offerFix = askYesNo('Would you like me to suggest specific fixes?');

  if (offerFix) {
    console.log('');
    console.log('Recommended actions:');
    console.log('');

    // Show top 5 most critical issues
    const allIssues = validationResults.flatMap(r =>
      r.issues.map(i => ({...i, feature: r.feature}))
    );

    const criticalIssues = allIssues
      .filter(i => i.severity === 'error')
      .slice(0, 5);

    if (criticalIssues.length > 0) {
      criticalIssues.forEach((issue, idx) => {
        console.log(`${idx + 1}. ${issue.feature}: ${issue.message}`);
        console.log(`   Action: ${issue.recommendation}`);
        console.log('');
      });
    }

    console.log('Address these issues and run /spec.validate again.');
  } else {
    console.log('You can fix issues manually and re-run: /spec.validate');
  }

  console.log('');
} else {
  console.log('All validations passed! Your specifications are ready.');
  console.log('');
  console.log('Consider running /spec.status to see overall project status.');
  console.log('');
}
```

## Data Models

### ValidationIssue Interface

```typescript
interface ValidationIssue {
  feature: string;          // Feature name
  severity: 'error' | 'warning' | 'info';
  category: 'traceability' | 'steering' | 'quality' | 'completeness';
  message: string;          // Issue description
  file?: string;            // File path if applicable
  recommendation: string;   // Actionable fix suggestion
}
```

### FeatureValidationResult Interface

```typescript
interface FeatureValidationResult {
  feature: string;
  issues: ValidationIssue[];
  requirementsFile: boolean;
  designFile: boolean;
  tasksFile: boolean;
  requirementCount: number;
  requirementsCovered: number;
  designElementCount: number;
  designElementsCovered: number;
}
```

### TraceabilityResult Interface

```typescript
interface TraceabilityResult {
  totalRequirements: number;
  coveredRequirements: number;
  uncoveredRequirements: string[];
  issues: ValidationIssue[];
}
```

### DesignTraceabilityResult Interface

```typescript
interface DesignTraceabilityResult {
  totalElements: number;
  coveredElements: number;
  uncoveredElements: string[];
  issues: ValidationIssue[];
}
```

## Important Notes

1. **Execution Control**: This command STOPS after displaying the validation report. Next steps are optional and require permission.

2. **Validation Scope**: Can validate a single feature or all features in the project.

3. **Traceability Checking**:
   - Requirements → Design: Ensures all FR-*, NFR-*, AC-* IDs are referenced in design
   - Design → Tasks: Ensures all components have corresponding tasks

4. **Steering Compliance**: Validates designs align with tech and structure steering documents.

5. **Quality Checklist**: Applies refinement checklist if available in `.spec/templates/`.

6. **Severity Levels**:
   - **Error**: Critical issue that must be fixed (e.g., missing traceability)
   - **Warning**: Important issue that should be addressed (e.g., missing sections)
   - **Info**: Suggestion for improvement (e.g., naming conventions)

7. **Actionable Recommendations**: Every issue includes a specific recommendation for how to fix it.

## Requirements Satisfied

- ✅ FR-5.6.1: Validates all requirements are covered in design
- ✅ FR-5.6.2: Validates all design elements map to tasks
- ✅ FR-5.6.3: Validates design aligns with tech steering
- ✅ FR-5.6.4: Validates structure follows conventions
- ✅ FR-5.6.5: Generates validation report with recommendations
- ✅ Task 7.1 (9.1): Implements traceability checker module
- ✅ Scans all features in docs/features/
- ✅ Parses requirement IDs and design references
- ✅ Builds traceability matrices
- ✅ Applies refinement checklist
- ✅ Displays formatted report with severity indicators
- ✅ Provides actionable recommendations
