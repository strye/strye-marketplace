---
description: Calculate total word count and breakdown by chapter for the specified project
argument-hint: [project-name]
allowed-tools: Read, Bash
---

# Word Count Command

Calculate comprehensive word count for the manuscript.

## Process

1. **Validate project**
   ```bash
   if [ ! -d "$1" ]; then
     echo "Project '$1' not found."
     exit 1
   fi
   ```

2. **Find manuscript files**
   
   Try these patterns in order:
   ```bash
   # Pattern 1: Obsidian-style
   find "$1/3_content" -name "*.md" -type f 2>/dev/null
   
   # Pattern 2: Simple chapters
   find "$1/chapters" -name "*.md" -type f 2>/dev/null
   
   # Pattern 3: Custom - ask user
   ```

3. **Calculate total word count**
   ```bash
   total_words=$(find [manuscript-path] -name "*.md" -type f -exec cat {} + | wc -w)
   ```

4. **Calculate breakdown by chapter**
   ```bash
   for chapter in [manuscript-path]/*/; do
     chapter_name=$(basename "$chapter")
     chapter_words=$(find "$chapter" -name "*.md" -exec cat {} + | wc -w)
     echo "$chapter_name: $chapter_words words"
   done
   ```

5. **Calculate breakdown by scene (optional)**
   ```bash
   # If user wants scene-level detail
   for scene in [chapter-path]/*.md; do
     scene_name=$(basename "$scene" .md)
     scene_words=$(wc -w < "$scene")
     echo "  $scene_name: $scene_words words"
   done
   ```

6. **Check progress toward goal**
   
   Look for word count target in:
   - `$1/project-file.md`
   - `$1/README.md`
   - `.claude/CLAUDE.md`
   
   If found, calculate percentage:
   ```
   Progress: [current] / [target] words ([percentage]%)
   ```

## Output Format

```
Word Count Report: [project-name]
Generated: [date and time]

Total Manuscript: 82,341 words

Breakdown by Chapter:
  Chapter 1: 5,421 words (7 scenes)
  Chapter 2: 6,112 words (6 scenes)
  Chapter 3: 5,890 words (8 scenes)
  Chapter 4: 7,234 words (9 scenes)
  Chapter 5: 6,543 words (7 scenes)
  Chapter 6: 5,987 words (6 scenes)
  Chapter 7: 6,234 words (7 scenes)
  Chapter 8: 5,876 words (6 scenes)
  Chapter 9: 6,123 words (7 scenes)
  Chapter 10: 5,432 words (6 scenes)
  Chapter 11: 6,789 words (8 scenes)
  Chapter 12: 5,234 words (6 scenes)
  Chapter 13: 6,456 words (7 scenes)
  Chapter 14: 5,678 words (6 scenes)
  Chapter 15: 7,332 words (9 scenes)

Progress: 82,341 / 90,000 words (91.5%)
Remaining: 7,659 words

Average Chapter Length: 5,489 words
Average Scene Length: 782 words

Status: On target for completion
```

## Enhanced Analysis (Optional)

If user requests detailed analysis:

```
Writing Pace Analysis:
- Shortest chapter: Chapter 12 (5,234 words)
- Longest chapter: Chapter 15 (7,332 words)
- Most consistent section: Chapters 5-10 (avg 6,112 words)
- Variation: Moderate (suggests good pacing variety)

Scene Analysis:
- Shortest scene: Chapter 3, Scene 2 (423 words)
- Longest scene: Chapter 4, Scene 6 (1,234 words)
- Average scene: 782 words

Recommendations:
- Chapter 12 is notably shorter - intentional?
- Consider if Chapter 15 needs to be split
- Overall pacing looks good
```

## Update Project File

Offer to update the project file:

```markdown
Would you like me to update [project]/project-file.md with current word count?

Current entry shows: 75,000 words (last updated: 2025-12-15)
New entry: 82,341 words (updated: 2026-01-03)
```

## Examples

```bash
# Basic word count
> /wordcount my-novel
# Returns total and chapter breakdown

# With scene-level detail
> /wordcount next-novel
# Then respond: "Show scene-level breakdown for chapters 5-7"

# Multiple projects comparison
> /wordcount my-novel
> /wordcount next-novel
# Compare progress across projects
```

## Integration

This command works well with:
- **export-manuscript**: Check word count before export
- **new-scene**: Track progress after writing sessions
- **Project planning**: Monitor pacing and chapter balance

## Notes

- Counts only manuscript content (ignores YAML frontmatter)
- Excludes planning documents (unless user specifies)
- Updates can be tracked over time for writing velocity
- Useful for setting and achieving writing goals