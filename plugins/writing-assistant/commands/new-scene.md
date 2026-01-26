---
description: Create a new scene file in the specified chapter with proper numbering and template
argument-hint: [project-name] [chapter-number] [scene-name]
allowed-tools: Read, Write, Glob, Bash
---

# New Scene Command

Create a new scene in the manuscript with proper numbering:

## Process

1. **Validate project exists**
   ```bash
   if [ ! -d "$1" ]; then
     echo "Project '$1' not found. Available projects:"
     ls -d */ | grep -v "\.claude"
     exit 1
   fi
   \`\`\`

2. **Find the chapter directory**
   - Look for: `$1/3_content/chapter$2/`
   - Or: `$1/chapters/ch$2-*/`
   - Or: `$1/chapters/chapter-$2/`
   - Or ask user for exact path

3. **Determine next scene number**
   ```bash
   # Find highest numbered scene file
   cd "$1/[chapter-path]"
   last_scene=$(ls ???-*.md 2>/dev/null | sort -n | tail -1 | cut -d'-' -f1)
   next_num=$((10#$last_scene + 1))
   next_num_padded=$(printf "%03d" $next_num)
   \`\`\`

4. **Create the new scene file**
   Filename: `$next_num_padded-$3.md`
   Location: `$1/[chapter-path]/`

5. **Use this template**:

```markdown
# Scene: [Scene Name]

**Chapter:** $2
**POV:** [Character Name]
**Setting:** [Location, Time of Day]
**Purpose:** [What this scene accomplishes - plot, character development, world-building]
**Emotional Arc:** [Character starts feeling X, ends feeling Y]

---

[Scene content begins here]

\`\`\`

6. **Confirm creation**
   \`\`\`
   Created: [project]/[chapter-path]/[filename]
   Next: Open the file and start writing!
   \`\`\`

## Examples

```bash
# Create a scene in my-novel, chapter 7, called "confrontation"
> /new-scene my-novel 7 confrontation
# Creates: my-novel/3_content/chapter7/004-confrontation.md

# Create a scene in next-novel, chapter 3, called "discovery"
> /new-scene next-novel 3 discovery
# Creates: next-novel/chapters/ch03-beginning/003-discovery.md
\`\`\`

## Error Handling

If chapter doesn't exist:
\`\`\`
Chapter $2 not found in project '$1'.
Would you like to:
1. Create chapter $2 directory
2. List existing chapters
3. Specify exact path
\`\`\`

If scene name contains special characters:
\`\`\`
Scene name should not contain: / \ : * ? " < > |
Suggested: Replace spaces with hyphens
\`\`\`

## After Creation

Offer to:
- Open the file for editing
- Update planning documents
- Add scene to outline/beat sheet