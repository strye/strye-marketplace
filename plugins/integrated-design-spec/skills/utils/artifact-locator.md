---
description: Locate and identify artifacts in the requirements hierarchy
allowed-tools: Glob, Read, Bash
---

# Artifact Locator Utility

Utility for locating artifacts (epics, features, specs) by ID, name, or pattern in the requirements hierarchy.

## Purpose

Provides functions to:
- Find artifacts by ID
- Find artifacts by name or title
- Determine artifact type
- Check if artifact is simple (single file) or complex (folder)
- Get the main entry file for an artifact
- List all artifacts of a type
- Resolve artifact references (handle both ID and name formats)

## Functions

### findArtifactById(id: string): string | null

Finds an artifact by its full ID (e.g., "epic_001", "feat_030_e004", "spec_015_f030").

**Implementation:**

```typescript
function findArtifactById(id: string): string | null {
  // Determine artifact type from ID pattern
  if (id.startsWith('epic_')) {
    // Search in requirements/epics/
    const pattern = `requirements/epics/${id}-*.md`;
    const matches = glob(pattern);
    return matches.length > 0 ? matches[0] : null;
  } else if (id.startsWith('feat_')) {
    // Search in requirements/features/ for both files and folders
    const filePattern = `requirements/features/${id}-*.md`;
    const folderPattern = `requirements/features/${id}-*/`;

    const fileMatches = glob(filePattern);
    if (fileMatches.length > 0) {
      return fileMatches[0];
    }

    const folderMatches = glob(folderPattern);
    if (folderMatches.length > 0) {
      // Return the folder path
      return folderMatches[0];
    }

    return null;
  } else if (id.startsWith('spec_')) {
    // Search in requirements/specs/ (always folders)
    const pattern = `requirements/specs/${id}-*/`;
    const matches = glob(pattern);
    return matches.length > 0 ? matches[0] : null;
  }

  return null;
}
```

**Usage Example:**

```typescript
const epicPath = findArtifactById('epic_001');
// Returns: "requirements/epics/epic_001-spec-driven-development.md"

const featurePath = findArtifactById('feat_030_e004');
// Returns: "requirements/features/feat_030_e004-command-templates.md"
// or "requirements/features/feat_030_e004-command-templates/"

const specPath = findArtifactById('spec_015_f030');
// Returns: "requirements/specs/spec_015_f030-jwt-implementation/"
```

**Error Handling:**
- Returns null if artifact not found
- Returns null if ID pattern doesn't match expected format

---

### findArtifactByName(name: string): string | null

Finds an artifact by its full name or partial name.

**Implementation:**

```typescript
function findArtifactByName(name: string): string | null {
  // Try exact match first (full filename without extension)
  const patterns = [
    `requirements/epics/${name}.md`,
    `requirements/features/${name}.md`,
    `requirements/features/${name}/`,
    `requirements/specs/${name}/`
  ];

  for (const pattern of patterns) {
    const matches = glob(pattern);
    if (matches.length > 0) {
      return matches[0];
    }
  }

  // Try partial match (search for name anywhere in filename)
  const partialPatterns = [
    `requirements/epics/*${name}*.md`,
    `requirements/features/*${name}*.md`,
    `requirements/features/*${name}*/`,
    `requirements/specs/*${name}*/`
  ];

  for (const pattern of partialPatterns) {
    const matches = glob(pattern);
    if (matches.length > 0) {
      if (matches.length > 1) {
        console.warn(`Multiple artifacts found matching '${name}':`);
        for (const match of matches) {
          console.warn(`  - ${match}`);
        }
        console.warn('Returning first match. Use full ID for exact match.');
      }
      return matches[0];
    }
  }

  return null;
}
```

**Usage Example:**

```typescript
// Full name
const path1 = findArtifactByName('epic_001-spec-driven-development');
// Returns: "requirements/epics/epic_001-spec-driven-development.md"

// Partial name
const path2 = findArtifactByName('command-templates');
// Returns: "requirements/features/feat_030_e004-command-templates.md"
// (or warns if multiple matches found)

// Title only
const path3 = findArtifactByName('jwt-implementation');
// Returns: "requirements/specs/spec_015_f030-jwt-implementation/"
```

**Error Handling:**
- Returns null if no match found
- Warns if multiple matches found, returns first
- Suggests using full ID for exact match

---

### resolveArtifactReference(reference: string): string | null

Resolves a user-provided reference (can be ID, name, or path) to a full path.

**Implementation:**

```typescript
function resolveArtifactReference(reference: string): string | null {
  // If already a full path, return as-is
  if (reference.startsWith('requirements/')) {
    const exists = fileExists(reference);
    return exists ? reference : null;
  }

  // Try as ID first (more specific)
  const byId = findArtifactById(reference);
  if (byId) {
    return byId;
  }

  // Try as name
  const byName = findArtifactByName(reference);
  if (byName) {
    return byName;
  }

  return null;
}
```

**Usage Example:**

```typescript
// Handles all these formats:
resolveArtifactReference('epic_001');
resolveArtifactReference('epic_001-spec-driven-development');
resolveArtifactReference('spec-driven-development');
resolveArtifactReference('requirements/epics/epic_001-spec-driven-development.md');

// All resolve to: "requirements/epics/epic_001-spec-driven-development.md"
```

---

### getArtifactType(path: string): 'epic' | 'feature' | 'spec' | null

Determines the artifact type from a file path.

**Implementation:**

```typescript
function getArtifactType(path: string): 'epic' | 'feature' | 'spec' | null {
  if (path.includes('/epics/')) {
    return 'epic';
  } else if (path.includes('/features/')) {
    return 'feature';
  } else if (path.includes('/specs/')) {
    return 'spec';
  }

  // Also check filename pattern
  const basename = path.split('/').pop();
  if (basename?.startsWith('epic_')) {
    return 'epic';
  } else if (basename?.startsWith('feat_')) {
    return 'feature';
  } else if (basename?.startsWith('spec_')) {
    return 'spec';
  }

  return null;
}
```

**Usage Example:**

```typescript
getArtifactType('requirements/epics/epic_001-name.md');
// Returns: 'epic'

getArtifactType('requirements/features/feat_030_e004-name/');
// Returns: 'feature'

getArtifactType('requirements/specs/spec_015_f030-name/');
// Returns: 'spec'
```

---

### isSimpleArtifact(path: string): boolean

Checks if an artifact is a simple single file or complex folder structure.

**Implementation:**

```typescript
function isSimpleArtifact(path: string): boolean {
  // If path ends with .md, it's a single file (simple)
  if (path.endsWith('.md')) {
    return true;
  }

  // If path ends with /, it's a folder (complex)
  if (path.endsWith('/')) {
    return false;
  }

  // Check if file exists
  if (fileExists(path)) {
    return path.endsWith('.md');
  }

  // Check if directory exists
  if (dirExists(path)) {
    return false;
  }

  // Default to checking if .md file exists
  return fileExists(path + '.md');
}
```

**Usage Example:**

```typescript
isSimpleArtifact('requirements/features/feat_030_e004-name.md');
// Returns: true

isSimpleArtifact('requirements/features/feat_030_e004-name/');
// Returns: false

isSimpleArtifact('requirements/specs/spec_015_f030-name/');
// Returns: false (specs are always folders)
```

---

### getMainFile(artifactPath: string): string

Returns the main entry file for an artifact (handles both simple and complex).

**Implementation:**

```typescript
function getMainFile(artifactPath: string): string {
  // If already a .md file, return as-is
  if (artifactPath.endsWith('.md')) {
    return artifactPath;
  }

  // If folder, return index.md
  if (artifactPath.endsWith('/')) {
    return `${artifactPath}index.md`;
  }

  // Check if it's a file or folder
  if (fileExists(artifactPath)) {
    return artifactPath;
  }

  // Assume folder, return index.md
  const folderPath = artifactPath.endsWith('/') ? artifactPath : `${artifactPath}/`;
  return `${folderPath}index.md`;
}
```

**Usage Example:**

```typescript
getMainFile('requirements/features/feat_030_e004-name.md');
// Returns: "requirements/features/feat_030_e004-name.md"

getMainFile('requirements/features/feat_030_e004-name/');
// Returns: "requirements/features/feat_030_e004-name/index.md"

getMainFile('requirements/specs/spec_015_f030-name/');
// Returns: "requirements/specs/spec_015_f030-name/index.md"
```

---

### listArtifacts(type: 'epic' | 'feature' | 'spec' | 'all' = 'all'): Artifact[]

Lists all artifacts of a specific type.

**Implementation:**

```typescript
interface Artifact {
  id: string;
  type: 'epic' | 'feature' | 'spec';
  title: string;
  path: string;
  mainFile: string;
  isSimple: boolean;
}

function listArtifacts(type: 'epic' | 'feature' | 'spec' | 'all' = 'all'): Artifact[] {
  const artifacts: Artifact[] = [];

  // List epics
  if (type === 'all' || type === 'epic') {
    const epicFiles = glob('requirements/epics/epic_*.md');
    for (const file of epicFiles) {
      const parsed = parseId(file);
      if (parsed.id) {
        artifacts.push({
          id: `epic_${parsed.id}`,
          type: 'epic',
          title: parsed.title || '',
          path: file,
          mainFile: file,
          isSimple: true
        });
      }
    }
  }

  // List features
  if (type === 'all' || type === 'feature') {
    const featureFiles = glob('requirements/features/feat_*.md');
    const featureFolders = glob('requirements/features/feat_*/');

    for (const file of featureFiles) {
      const parsed = parseId(file);
      if (parsed.id && parsed.epicId) {
        artifacts.push({
          id: `feat_${parsed.id}_e${parsed.epicId}`,
          type: 'feature',
          title: parsed.title || '',
          path: file,
          mainFile: file,
          isSimple: true
        });
      }
    }

    for (const folder of featureFolders) {
      const parsed = parseId(folder);
      if (parsed.id && parsed.epicId) {
        artifacts.push({
          id: `feat_${parsed.id}_e${parsed.epicId}`,
          type: 'feature',
          title: parsed.title || '',
          path: folder,
          mainFile: `${folder}index.md`,
          isSimple: false
        });
      }
    }
  }

  // List specs
  if (type === 'all' || type === 'spec') {
    const specFolders = glob('requirements/specs/spec_*/');

    for (const folder of specFolders) {
      const parsed = parseId(folder);
      if (parsed.id && parsed.featureId) {
        artifacts.push({
          id: `spec_${parsed.id}_f${parsed.featureId}`,
          type: 'spec',
          title: parsed.title || '',
          path: folder,
          mainFile: `${folder}index.md`,
          isSimple: false
        });
      }
    }
  }

  return artifacts;
}
```

**Usage Example:**

```typescript
// List all epics
const epics = listArtifacts('epic');
for (const epic of epics) {
  console.log(`${epic.id}: ${epic.title}`);
}

// List all artifacts
const all = listArtifacts('all');
console.log(`Total artifacts: ${all.length}`);
```

---

### getArtifactChildren(artifactPath: string): string[]

Retrieves the list of child artifact IDs from the parent's frontmatter.

**Implementation:**

```typescript
function getArtifactChildren(artifactPath: string): string[] {
  // Get main file
  const mainFile = getMainFile(artifactPath);

  // Read and parse frontmatter
  const content = readFile(mainFile);
  const parsed = parseFrontmatter(content);

  // Return children array
  if ('children' in parsed.frontmatter && Array.isArray(parsed.frontmatter.children)) {
    return parsed.frontmatter.children;
  }

  return [];
}
```

**Usage Example:**

```typescript
const epicPath = 'requirements/epics/epic_001-spec-driven-development.md';
const children = getArtifactChildren(epicPath);
// Returns: ["feat_009_e001-project-initialization", "feat_010_e001-three-tier-hierarchy", ...]
```

---

### getArtifactParent(artifactPath: string): string | null

Retrieves the parent artifact ID from the artifact's frontmatter.

**Implementation:**

```typescript
function getArtifactParent(artifactPath: string): string | null {
  // Get main file
  const mainFile = getMainFile(artifactPath);

  // Read and parse frontmatter
  const content = readFile(mainFile);
  const parsed = parseFrontmatter(content);

  // Return parent
  if ('parent' in parsed.frontmatter) {
    return parsed.frontmatter.parent;
  }

  return null;
}
```

**Usage Example:**

```typescript
const featurePath = 'requirements/features/feat_030_e004-command-templates.md';
const parent = getArtifactParent(featurePath);
// Returns: "epic_004-developer-experience"
```

---

## Usage in Commands

### Example: Finding an Artifact

```typescript
// In /specid.link command

// User provides: "epic_001" or "spec-driven-development"
const userInput = args.parent;

// Resolve to full path
const artifactPath = resolveArtifactReference(userInput);

if (!artifactPath) {
  console.error(`❌ Error: Artifact '${userInput}' not found`);
  return;
}

console.log(`✓ Found artifact: ${artifactPath}`);
```

### Example: Validating Parent-Child Relationships

```typescript
// In /specid.validate command

// List all features
const features = listArtifacts('feature');

for (const feature of features) {
  // Get parent epic ID from frontmatter
  const parentId = getArtifactParent(feature.path);

  if (!parentId) {
    console.error(`❌ Feature ${feature.id} has no parent`);
    continue;
  }

  // Check if parent exists
  const parentPath = resolveArtifactReference(parentId);

  if (!parentPath) {
    console.error(`❌ Feature ${feature.id} references non-existent parent: ${parentId}`);
  }
}
```

### Example: Listing Artifacts by Status

```typescript
// In /specid.list command with --status=active filter

const allArtifacts = listArtifacts('all');
const activeArtifacts = [];

for (const artifact of allArtifacts) {
  const content = readFile(artifact.mainFile);
  const parsed = parseFrontmatter(content);

  if (parsed.frontmatter.status === 'active') {
    activeArtifacts.push(artifact);
  }
}

console.log(`Active artifacts (${activeArtifacts.length}):`);
for (const artifact of activeArtifacts) {
  console.log(`  ${artifact.id}: ${artifact.title}`);
}
```

---

## Dependencies

- **Glob tool**: For finding files and directories
- **Bash tool**: For file system checks
- **Read tool**: For reading frontmatter
- **ID Generator utility**: For parseId function
- **Frontmatter Parser utility**: For parseFrontmatter function

---

## Helper Functions

```typescript
function fileExists(path: string): boolean {
  // Use Bash: test -f path
  const result = bash(`test -f "${path}" && echo "true" || echo "false"`);
  return result.trim() === 'true';
}

function dirExists(path: string): boolean {
  // Use Bash: test -d path
  const result = bash(`test -d "${path}" && echo "true" || echo "false"`);
  return result.trim() === 'true';
}
```

---

## Type Definitions

```typescript
interface Artifact {
  id: string;
  type: 'epic' | 'feature' | 'spec';
  title: string;
  path: string;
  mainFile: string;
  isSimple: boolean;
}
```

---

## Notes

- Always use `resolveArtifactReference()` when accepting user input for artifact references
- Use `getMainFile()` to get the entry point file for any artifact
- `listArtifacts()` is useful for building validation reports and tree views
- Artifact paths can be either files (.md) or folders (/)
- Always handle the case where an artifact is not found (return null)
- Specs are always folders, never single files
- Features can be either files or folders
- Epics are always single files
