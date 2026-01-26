# /spec.steering - Manage Steering Documents

You are executing the `/spec.steering` command to create or update steering documents that guide the project's strategic direction.

## Command Arguments

- **text**: Guidance for what to create or update (required)

## Command Purpose

Create or update steering documents in `docs/steering/`:
- `product.md` - Product vision, features, and user needs
- `tech.md` - Technical architecture and technology choices
- `structure.md` - Codebase structure and organization conventions

## Execution Steps

### Step 1: Parse Text Argument

Extract the guidance from the text argument:

```typescript
const updateGuidance = args.text;

if (!updateGuidance || updateGuidance.trim().length === 0) {
  console.error('❌ Error: Update guidance is required.');
  console.log('Usage: /spec.steering "What you want to update"');
  console.log('');
  console.log('Examples:');
  console.log('  /spec.steering "Update our tech stack to use React and PostgreSQL"');
  console.log('  /spec.steering "Add mobile app users to our target audience"');
  console.log('  /spec.steering "Change directory structure to feature-based organization"');
  return;
}

console.log('Update Guidance:', updateGuidance);
console.log('');
```

### Step 2: Analyze Text to Determine Target Document(s)

Use keyword detection to determine which steering document(s) to update:

```typescript
// Document detection logic
const documentKeywords = {
  product: [
    'product', 'feature', 'user', 'customer', 'vision', 'roadmap',
    'audience', 'market', 'value', 'goal', 'objective', 'mission',
    'requirement', 'capability', 'need', 'persona', 'journey'
  ],
  tech: [
    'tech', 'technology', 'stack', 'architecture', 'framework',
    'language', 'database', 'infrastructure', 'api', 'backend',
    'frontend', 'library', 'tool', 'service', 'cloud', 'deployment',
    'performance', 'scalability', 'security', 'integration'
  ],
  structure: [
    'structure', 'organization', 'directory', 'folder', 'file',
    'naming', 'convention', 'pattern', 'layout', 'hierarchy',
    'module', 'package', 'component', 'organize', 'arrange'
  ]
};

// Normalize text for keyword matching
const normalizedText = updateGuidance.toLowerCase();

// Count keyword matches for each document type
const matches = {
  product: 0,
  tech: 0,
  structure: 0
};

for (const [docType, keywords] of Object.entries(documentKeywords)) {
  for (const keyword of keywords) {
    if (normalizedText.includes(keyword)) {
      matches[docType]++;
    }
  }
}

console.log('Document Detection Analysis:');
console.log(`  Product keywords: ${matches.product}`);
console.log(`  Tech keywords: ${matches.tech}`);
console.log(`  Structure keywords: ${matches.structure}`);
console.log('');

// Determine target document(s)
let targetDocuments = [];
const maxMatches = Math.max(matches.product, matches.tech, matches.structure);

if (maxMatches === 0) {
  // No clear match - ask user
  console.log('⚠️ Could not automatically determine which steering document to update.');
  console.log('');

  const choice = askChoice(
    'Which steering document would you like to update?',
    [
      'Product (vision, features, users)',
      'Tech (architecture, technology stack)',
      'Structure (codebase organization)',
      'Multiple documents'
    ]
  );

  if (choice === 0) {
    targetDocuments = ['product'];
  } else if (choice === 1) {
    targetDocuments = ['tech'];
  } else if (choice === 2) {
    targetDocuments = ['structure'];
  } else {
    // Multiple documents - ask which ones
    const selectProduct = askYesNo('Update Product steering?');
    const selectTech = askYesNo('Update Tech steering?');
    const selectStructure = askYesNo('Update Structure steering?');

    if (selectProduct) targetDocuments.push('product');
    if (selectTech) targetDocuments.push('tech');
    if (selectStructure) targetDocuments.push('structure');
  }
} else {
  // Auto-detect based on keyword matches
  // Include documents with matches close to the max
  const threshold = maxMatches * 0.5; // 50% of max matches

  if (matches.product >= threshold) targetDocuments.push('product');
  if (matches.tech >= threshold) targetDocuments.push('tech');
  if (matches.structure >= threshold) targetDocuments.push('structure');

  // If multiple documents detected, confirm with user
  if (targetDocuments.length > 1) {
    console.log(`Detected updates for: ${targetDocuments.join(', ')}`);
    const confirmAll = askYesNo('Update all detected documents?');

    if (!confirmAll) {
      // Let user select which ones
      const selected = [];
      for (const doc of targetDocuments) {
        const shouldUpdate = askYesNo(`Update ${doc}.md?`);
        if (shouldUpdate) selected.push(doc);
      }
      targetDocuments = selected;
    }
  }
}

if (targetDocuments.length === 0) {
  console.log('❌ No documents selected for update.');
  return;
}

console.log(`📝 Will update: ${targetDocuments.map(d => d + '.md').join(', ')}`);
console.log('');
```

### Step 3: Ask for Confirmation Preference

Ask user how they want to handle file operations:

```typescript
const confirmationMode = askChoice(
  'Would you like to review changes before they\'re written?',
  [
    'Yes - show me changes for confirmation',
    'No - proceed automatically'
  ]
) === 0;

console.log('');
```

### Step 4: Process Each Target Document

For each target document, update or create it:

```typescript
const updatedFiles = [];
const skippedFiles = [];

for (const docType of targetDocuments) {
  const filePath = `docs/steering/${docType}.md`;
  const templatePath = `.spec/templates/${docType}-steering.md`;

  console.log(`───────────────────────────────────────`);
  console.log(`Processing: ${docType}.md`);
  console.log(`───────────────────────────────────────`);
  console.log('');

  // Check if file exists
  const fileExists = checkFileExists(filePath);

  if (fileExists) {
    // UPDATE existing file
    console.log(`✓ Found existing ${docType}.md`);
    console.log('');

    // Read current content
    const currentContent = readFile(filePath);

    // Ask clarifying questions based on the update guidance
    console.log(`Let's refine the updates for ${docType}.md:`);
    console.log('');

    const clarifyingQuestions = generateClarifyingQuestions(docType, updateGuidance);
    const answers = {};

    for (const question of clarifyingQuestions) {
      const answer = ask(question);
      answers[question] = answer;
    }

    console.log('');

    // Generate updated content
    const updatedContent = updateSteeringDocument(
      docType,
      currentContent,
      updateGuidance,
      answers
    );

    // Show preview if confirmation mode
    if (confirmationMode) {
      console.log('=== Changes Preview ===');
      console.log('');
      console.log('[Showing diff of changes]');
      console.log('');

      // In practice, show actual diff
      const diff = generateDiff(currentContent, updatedContent);
      console.log(diff);
      console.log('');
      console.log('======================');
      console.log('');

      const approved = askYesNo('Apply these changes?');
      if (!approved) {
        console.log(`⚠️ Skipped ${filePath}`);
        skippedFiles.push(filePath);
        continue;
      }
    }

    // Write updated file
    writeFile(filePath, updatedContent);
    console.log(`✓ Updated ${filePath}`);
    updatedFiles.push(filePath);

  } else {
    // CREATE new file
    console.log(`⚠️ ${docType}.md does not exist yet`);
    console.log('');

    // Load template
    let template = '';
    let templateSource = '';

    if (checkFileExists(templatePath)) {
      template = readFile(templatePath);
      templateSource = 'custom template';
      console.log(`✓ Loaded template from ${templatePath}`);
    } else {
      console.warn(`⚠️ Warning: ${docType}-steering.md template not found`);

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
        skippedFiles.push(filePath);
        continue;
      }

      template = getInlineSteeringTemplate(docType);
      templateSource = 'inline default';
      console.log(`⚠️ Using inline default template`);
    }

    console.log('');

    // Ask clarifying questions
    console.log(`Let's set up ${docType}.md:`);
    console.log('');

    const clarifyingQuestions = generateClarifyingQuestions(docType, updateGuidance);
    const answers = {};

    for (const question of clarifyingQuestions) {
      const answer = ask(question);
      answers[question] = answer;
    }

    console.log('');

    // Fill template with answers
    const newContent = fillSteeringTemplate(
      template,
      docType,
      updateGuidance,
      answers
    );

    // Show preview if confirmation mode
    if (confirmationMode) {
      console.log('=== Preview ===');
      console.log('');
      console.log(newContent);
      console.log('');
      console.log('===============');
      console.log('');

      const approved = askYesNo('Create this file?');
      if (!approved) {
        console.log(`⚠️ Skipped ${filePath}`);
        skippedFiles.push(filePath);
        continue;
      }
    }

    // Write new file
    writeFile(filePath, newContent);
    console.log(`✓ Created ${filePath} (using ${templateSource})`);
    updatedFiles.push(filePath);
  }

  console.log('');
}
```

### Step 5: Validate Against Quality Checklist

Validate the updated steering documents:

```typescript
console.log('───────────────────────────────────────');
console.log('Validating Steering Documents');
console.log('───────────────────────────────────────');
console.log('');

// Load quality standards
let qualityIssues = [];

for (const filePath of updatedFiles) {
  const content = readFile(filePath);
  const docType = filePath.includes('product') ? 'product' :
                  filePath.includes('tech') ? 'tech' : 'structure';

  // Apply quality checklist
  const issues = validateSteeringDocument(docType, content);

  if (issues.length > 0) {
    console.log(`⚠️ Quality issues in ${filePath}:`);
    for (const issue of issues) {
      console.log(`  - ${issue}`);
    }
    qualityIssues.push(...issues);
  } else {
    console.log(`✓ ${filePath} passes quality checks`);
  }
}

console.log('');
```

### Step 6: Display Summary

Show what was accomplished:

```typescript
console.log('═══════════════════════════════════════');
console.log('✓ Steering Update Complete');
console.log('═══════════════════════════════════════');
console.log('');

if (updatedFiles.length > 0) {
  console.log('Updated/Created:');
  for (const file of updatedFiles) {
    console.log(`  ✓ ${file}`);
  }
  console.log('');
}

if (skippedFiles.length > 0) {
  console.log('Skipped:');
  for (const file of skippedFiles) {
    console.log(`  ⚠️ ${file}`);
  }
  console.log('');
}

if (qualityIssues.length > 0) {
  console.log(`⚠️ ${qualityIssues.length} quality issues detected`);
  console.log('Review the warnings above and consider addressing them.');
  console.log('');
}

console.log('Your steering documents have been updated.');
console.log('');
```

### Step 7: STOP EXECUTION

**CRITICAL**: The command must stop here and NOT automatically proceed.

```typescript
// Command execution STOPS here
```

Note: This command does NOT offer a next step because steering documents are typically updated independently and don't have a natural "next step" in the SDD workflow.

## Helper Functions

These are conceptual helpers that would be implemented in practice:

```typescript
function generateClarifyingQuestions(
  docType: string,
  updateGuidance: string
): string[] {

  if (docType === 'product') {
    return [
      'What aspect of the product are you updating? (vision, features, users, etc.)',
      'What is the key change or addition?',
      'Why is this change important?',
      'Who does this impact?'
    ];
  } else if (docType === 'tech') {
    return [
      'What technical aspect are you updating? (stack, architecture, database, etc.)',
      'What is the specific technology or approach?',
      'What are the reasons for this choice?',
      'Are there any constraints or tradeoffs?'
    ];
  } else if (docType === 'structure') {
    return [
      'What structural aspect are you updating? (directories, naming, organization)',
      'What is the new convention or pattern?',
      'What are the benefits of this structure?',
      'Are there any migration considerations?'
    ];
  }

  return [];
}

function updateSteeringDocument(
  docType: string,
  currentContent: string,
  updateGuidance: string,
  answers: Record<string, string>
): string {

  // This is where AI would intelligently update the document
  // For now, this is a placeholder that shows the concept

  // Parse current structure
  const sections = parseMarkdownSections(currentContent);

  // Determine which section(s) to update based on guidance and answers
  const targetSection = determineTargetSection(docType, updateGuidance, answers);

  // Update the relevant section(s)
  const updatedSections = { ...sections };

  // Apply updates (this would use AI to intelligently modify content)
  const aspect = answers['What aspect of the product are you updating? (vision, features, users, etc.)'] ||
                 answers['What technical aspect are you updating? (stack, architecture, database, etc.)'] ||
                 answers['What structural aspect are you updating? (directories, naming, organization)'];

  const change = answers['What is the key change or addition?'] ||
                 answers['What is the specific technology or approach?'] ||
                 answers['What is the new convention or pattern?'];

  if (targetSection && change) {
    updatedSections[targetSection] += `\n\n${change}`;
  }

  // Reconstruct document
  return reconstructMarkdown(updatedSections);
}

function fillSteeringTemplate(
  template: string,
  docType: string,
  updateGuidance: string,
  answers: Record<string, string>
): string {

  let content = template;

  // Replace common placeholders
  content = content.replace(/\[Date\]/g, new Date().toISOString().split('T')[0]);
  content = content.replace(/\[UpdateGuidance\]/g, updateGuidance);

  // Replace type-specific placeholders based on answers
  for (const [question, answer] of Object.entries(answers)) {
    // Simple replacement - in practice this would be more sophisticated
    if (answer) {
      content = content.replace(/\[TBD\]/i, answer);
    }
  }

  return content;
}

function validateSteeringDocument(
  docType: string,
  content: string
): string[] {

  const issues = [];

  // Check for placeholder text that wasn't filled in
  if (content.includes('[TBD]') || content.includes('TODO')) {
    issues.push('Contains unfilled placeholders (TBD or TODO)');
  }

  // Check for minimum content length
  if (content.length < 500) {
    issues.push('Document seems too short - consider adding more detail');
  }

  // Type-specific validations
  if (docType === 'product') {
    if (!content.toLowerCase().includes('user')) {
      issues.push('Product steering should mention target users');
    }
    if (!content.toLowerCase().includes('feature')) {
      issues.push('Product steering should describe key features');
    }
  } else if (docType === 'tech') {
    if (!content.toLowerCase().includes('architecture')) {
      issues.push('Tech steering should describe architecture approach');
    }
  } else if (docType === 'structure') {
    if (!content.toLowerCase().includes('directory') && !content.toLowerCase().includes('folder')) {
      issues.push('Structure steering should describe directory organization');
    }
  }

  return issues;
}

function getInlineSteeringTemplate(docType: string): string {

  if (docType === 'product') {
    return `# Product Steering

**Last Updated**: [Date]

## Product Vision

[Describe the product vision and mission]

## Target Users

[Describe who will use this product]

## Core Features

[List and describe key features]

## Value Proposition

[What problem does this solve? Why is it valuable?]

## Product Goals

[Short-term and long-term goals]
`;
  } else if (docType === 'tech') {
    return `# Tech Steering

**Last Updated**: [Date]

## Technology Stack

[Describe the primary technologies]

## Architecture

[Describe the architectural approach]

## Technical Decisions

[Key technical decisions and rationale]

## Constraints and Tradeoffs

[Any technical constraints or tradeoffs]
`;
  } else if (docType === 'structure') {
    return `# Structure Steering

**Last Updated**: [Date]

## Directory Structure

[Describe the directory organization]

## Naming Conventions

[Describe naming patterns and conventions]

## File Organization

[Describe how files should be organized]

## Code Organization Principles

[Key principles for organizing code]
`;
  }

  return '';
}

function parseMarkdownSections(content: string): Record<string, string> {
  // Parse markdown into sections by headers
  const sections: Record<string, string> = {};
  const lines = content.split('\n');
  let currentSection = 'preamble';
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      // Start new section
      currentSection = line.substring(3).trim();
      currentContent = [line];
    } else {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }

  return sections;
}

function determineTargetSection(
  docType: string,
  updateGuidance: string,
  answers: Record<string, string>
): string {

  // Determine which section of the document to update
  // This is a simplified version - in practice would be more sophisticated

  const guidance = updateGuidance.toLowerCase();

  if (docType === 'product') {
    if (guidance.includes('user') || guidance.includes('audience')) return 'Target Users';
    if (guidance.includes('feature')) return 'Core Features';
    if (guidance.includes('vision') || guidance.includes('mission')) return 'Product Vision';
    if (guidance.includes('goal')) return 'Product Goals';
  } else if (docType === 'tech') {
    if (guidance.includes('stack') || guidance.includes('technology')) return 'Technology Stack';
    if (guidance.includes('architecture')) return 'Architecture';
    if (guidance.includes('decision')) return 'Technical Decisions';
  } else if (docType === 'structure') {
    if (guidance.includes('directory') || guidance.includes('folder')) return 'Directory Structure';
    if (guidance.includes('naming')) return 'Naming Conventions';
    if (guidance.includes('organize') || guidance.includes('organization')) return 'File Organization';
  }

  return '';
}

function reconstructMarkdown(sections: Record<string, string>): string {
  return Object.values(sections).join('\n\n');
}

function generateDiff(original: string, updated: string): string {
  // Generate a simple diff view
  // In practice, this would use a proper diff algorithm

  return `
--- Original
+++ Updated
@@ Changes @@
${updated}
`;
}
```

## Important Notes

1. **Document Detection**: Uses keyword-based detection with fallback to user choice
2. **Smart Updates**: Updates existing files intelligently or creates new ones from templates
3. **Quality Validation**: Checks documents against quality standards
4. **Confirmation Mode**: User can review changes before they're applied
5. **Execution Control**: Command STOPS after completing updates (no automatic next step)
6. **No Next Step**: Steering updates are independent - no natural next command to suggest

## Requirements Satisfied

- ✅ FR-5.2.1: Determines which steering document(s) to modify based on prompt
- ✅ FR-5.2.2: Loads appropriate templates for new documents
- ✅ FR-5.2.3: Intelligently updates existing documents
- ✅ FR-3.2: Asks clarifying questions based on text argument
- ✅ FR-3.3: Validates against quality checklist
- ✅ Requirement 1: Command execution control (stops after completion)
