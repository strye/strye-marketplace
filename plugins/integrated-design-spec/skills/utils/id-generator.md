---
description: Generate sequential IDs for epics, features, and specs
allowed-tools: Glob, Bash, Read
---

# ID Generator Utility

Utility for generating unique, sequential IDs for epics, features, and specs in the requirements hierarchy.

## Purpose

Provides functions to:
- Generate the next available ID for each artifact type
- Parse existing IDs from filenames
- Extract parent IDs (epic ID from feature name, feature ID from spec name)
- Validate ID format

## Functions

### getNextEpicId(): string

Generates the next sequential epic ID.

**Implementation:**

```typescript
function getNextEpicId(): string {
  // 1. Find all epic files in requirements/epics/
  const epicFiles = glob('requirements/epics/epic_*.md');

  if (epicFiles.length === 0) {
    // No epics exist yet, start with 001
    return '001';
  }

  // 2. Extract IDs using regex pattern: epic_(\d{3})-
  const ids: number[] = [];
  for (const file of epicFiles) {
    const match = file.match(/epic_(\d{3})-/);
    if (match) {
      ids.push(parseInt(match[1], 10));
    }
  }

  // 3. Find maximum ID
  const maxId = Math.max(...ids);

  // 4. Increment and zero-pad to 3 digits
  const nextId = (maxId + 1).toString().padStart(3, '0');

  return nextId;
}
```

**Bash Implementation:**

```bash
# Find the highest epic ID
ls requirements/epics/ 2>/dev/null | grep -o 'epic_[0-9]*' | sed 's/epic_//' | sort -n | tail -1
# Then increment in the command
```

**Error Handling:**
- If requirements/epics/ doesn't exist, return '001'
- If no matching files found, return '001'
- If parsing fails, return '001' as safe default

---

### getNextFeatureId(): string

Generates the next sequential feature ID.

**Implementation:**

```typescript
function getNextFeatureId(): string {
  // 1. Find all feature files in requirements/features/
  const featureFiles = glob('requirements/features/feat_*.md');
  const featureDirs = glob('requirements/features/feat_*/', { onlyDirectories: true });

  // Combine files and directories
  const allFeatures = [...featureFiles, ...featureDirs];

  if (allFeatures.length === 0) {
    return '001';
  }

  // 2. Extract IDs using regex pattern: feat_(\d{3})_e\d{3}-
  const ids: number[] = [];
  for (const item of allFeatures) {
    const match = item.match(/feat_(\d{3})_e\d{3}-/);
    if (match) {
      ids.push(parseInt(match[1], 10));
    }
  }

  if (ids.length === 0) {
    return '001';
  }

  // 3. Find maximum ID
  const maxId = Math.max(...ids);

  // 4. Increment and zero-pad
  const nextId = (maxId + 1).toString().padStart(3, '0');

  return nextId;
}
```

**Bash Implementation:**

```bash
# Find the highest feature ID (checking both files and folders)
(ls requirements/features/ 2>/dev/null | grep -o 'feat_[0-9]*' | sed 's/feat_//' | sort -n | tail -1) || echo "000"
# Then increment in the command
```

**Error Handling:**
- If requirements/features/ doesn't exist, return '001'
- If no matching files found, return '001'
- Handles both single files (.md) and folders (/)

---

### getNextSpecId(): string

Generates the next sequential spec ID.

**Implementation:**

```typescript
function getNextSpecId(): string {
  // 1. Find all spec directories in requirements/specs/
  const specDirs = glob('requirements/specs/spec_*/', { onlyDirectories: true });

  if (specDirs.length === 0) {
    return '001';
  }

  // 2. Extract IDs using regex pattern: spec_(\d{3})_f\d{3}-
  const ids: number[] = [];
  for (const dir of specDirs) {
    const match = dir.match(/spec_(\d{3})_f\d{3}-/);
    if (match) {
      ids.push(parseInt(match[1], 10));
    }
  }

  if (ids.length === 0) {
    return '001';
  }

  // 3. Find maximum ID
  const maxId = Math.max(...ids);

  // 4. Increment and zero-pad
  const nextId = (maxId + 1).toString().padStart(3, '0');

  return nextId;
}
```

**Bash Implementation:**

```bash
# Find the highest spec ID
ls requirements/specs/ 2>/dev/null | grep -o 'spec_[0-9]*' | sed 's/spec_//' | sort -n | tail -1
# Then increment in the command
```

**Error Handling:**
- If requirements/specs/ doesn't exist, return '001'
- If no matching directories found, return '001'

---

### parseId(filename: string): ParsedId

Extracts artifact type, ID, and parent IDs from filename.

**Implementation:**

```typescript
interface ParsedId {
  type: 'epic' | 'feature' | 'spec' | null;
  id: string | null;
  epicId?: string;
  featureId?: string;
  title?: string;
}

function parseId(filename: string): ParsedId {
  // Remove path and extension
  const basename = filename.split('/').pop()?.replace(/\.md$/, '').replace(/\/$/, '');

  if (!basename) {
    return { type: null, id: null };
  }

  // Try epic pattern: epic_001-title
  const epicMatch = basename.match(/^epic_(\d{3})-(.+)$/);
  if (epicMatch) {
    return {
      type: 'epic',
      id: epicMatch[1],
      title: epicMatch[2]
    };
  }

  // Try feature pattern: feat_001_e002-title
  const featureMatch = basename.match(/^feat_(\d{3})_e(\d{3})-(.+)$/);
  if (featureMatch) {
    return {
      type: 'feature',
      id: featureMatch[1],
      epicId: featureMatch[2],
      title: featureMatch[3]
    };
  }

  // Try spec pattern: spec_001_f002-title
  const specMatch = basename.match(/^spec_(\d{3})_f(\d{3})-(.+)$/);
  if (specMatch) {
    return {
      type: 'spec',
      id: specMatch[1],
      featureId: specMatch[2],
      title: specMatch[3]
    };
  }

  // No match
  return { type: null, id: null };
}
```

**Usage Example:**

```typescript
const parsed = parseId('requirements/features/feat_012_e003-solutions-architecture/');
// Returns:
// {
//   type: 'feature',
//   id: '012',
//   epicId: '003',
//   title: 'solutions-architecture'
// }
```

**Error Handling:**
- Returns null values if pattern doesn't match
- Handles both files and directories
- Strips .md extension and trailing slashes

---

### validateIdFormat(id: string): boolean

Validates that an ID follows the correct format (3-digit zero-padded).

**Implementation:**

```typescript
function validateIdFormat(id: string): boolean {
  const idPattern = /^\d{3}$/;
  return idPattern.test(id);
}
```

**Usage Example:**

```typescript
validateIdFormat('001');  // true
validateIdFormat('042');  // true
validateIdFormat('1');    // false (not zero-padded)
validateIdFormat('1234'); // false (too many digits)
```

---

### formatArtifactName(type: 'epic' | 'feature' | 'spec', id: string, title: string, parentId?: string): string

Formats a complete artifact filename according to conventions.

**Implementation:**

```typescript
function formatArtifactName(
  type: 'epic' | 'feature' | 'spec',
  id: string,
  title: string,
  parentId?: string
): string {
  // Convert title to kebab-case if not already
  const kebabTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  switch (type) {
    case 'epic':
      return `epic_${id}-${kebabTitle}`;

    case 'feature':
      if (!parentId) {
        throw new Error('Feature requires parentId (epic ID)');
      }
      return `feat_${id}_e${parentId}-${kebabTitle}`;

    case 'spec':
      if (!parentId) {
        throw new Error('Spec requires parentId (feature ID)');
      }
      return `spec_${id}_f${parentId}-${kebabTitle}`;
  }
}
```

**Usage Examples:**

```typescript
formatArtifactName('epic', '004', 'User Authentication');
// Returns: 'epic_004-user-authentication'

formatArtifactName('feature', '030', 'Login System', '004');
// Returns: 'feat_030_e004-login-system'

formatArtifactName('spec', '015', 'JWT Implementation', '030');
// Returns: 'spec_015_f030-jwt-implementation'
```

---

## Usage in Commands

### Example: Creating an Epic

```typescript
// In /specid.epic command

// Step 1: Get next ID
const nextId = getNextEpicId();
console.log(`Next epic ID: ${nextId}`);

// Step 2: Format filename
const title = 'Developer Experience';
const filename = formatArtifactName('epic', nextId, title);
// Result: epic_004-developer-experience

// Step 3: Create file path
const filePath = `requirements/epics/${filename}.md`;
```

### Example: Creating a Feature

```typescript
// In /specid.feature command

// Step 1: Parse parent epic ID from user input
const parentEpic = 'epic_004-developer-experience';
const parsed = parseId(parentEpic);
const epicId = parsed.id; // '004'

// Step 2: Get next feature ID
const nextId = getNextFeatureId();

// Step 3: Format filename
const title = 'Command Templates';
const filename = formatArtifactName('feature', nextId, title, epicId);
// Result: feat_030_e004-command-templates

// Step 4: Create file path
const filePath = `requirements/features/${filename}.md`;
```

---

## Dependencies

- **Glob tool**: For finding files and directories
- **Bash tool**: For executing shell commands
- **Read tool**: For validating file existence

---

## Type Definitions

```typescript
interface ParsedId {
  type: 'epic' | 'feature' | 'spec' | null;
  id: string | null;
  epicId?: string;
  featureId?: string;
  title?: string;
}
```

---

## Validation Rules

1. **IDs must be unique** within each artifact type
2. **IDs must be sequential** (no gaps allowed, but that's a soft requirement)
3. **IDs are permanent** - never reused even if artifact is deleted
4. **IDs must be 3-digit zero-padded** (001, 002, ..., 999)
5. **Filenames must use kebab-case** for titles

---

## Notes

- This utility is read-only (uses Glob and Read tools only)
- ID generation is deterministic based on existing files
- Concurrent ID generation could cause collisions (manual resolution needed)
- Maximum 999 artifacts per type (reasonable limit)
- Bash commands provided as alternative to TypeScript pseudocode for actual implementation
