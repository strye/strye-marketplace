---
description: Quick grammar and spelling check of the most recently modified file or specified file
argument-hint: [project-name] [optional: file-path]
allowed-tools: Read
---

# Quick Grammar Check Command

Run a fast grammar check focused on critical issues.

## Process

1. **Determine target file**
   
   If file specified:
   ```bash
   target="$1/$2"
   ```
   
   If no file specified, find most recent:
   ```bash
   # Find most recently modified .md file in manuscript directories
   target=$(find "$1/3_content" -name "*.md" -type f -printf '%T@ %p\n' 2>/dev/null | \
            sort -n | tail -1 | cut -d' ' -f2-)
   
   # Or in chapters/
   target=$(find "$1/chapters" -name "*.md" -type f -printf '%T@ %p\n' 2>/dev/null | \
            sort -n | tail -1 | cut -d' ' -f2-)
   ```

2. **Read the file**
   ```
   Read contents of $target
   ```

3. **Invoke grammar-check skill**
   ```
   Use the grammar-check skill with "quick" level:
   - Spelling errors
   - Critical grammar issues
   - Dialogue formatting
   - Obvious typos
   
   Skip:
   - Deep style analysis
   - Show vs. tell
   - Repetition checking
   ```

4. **Present condensed results**
   
   Focus on actionable fixes:
   ```markdown
   Quick Grammar Check: [filename]
   
   Critical Issues (Fix These):
   - Line 23: "there" → "their"
   - Line 45: Missing closing quote
   - Line 89: "recieve" → "receive"
   
   Dialogue Formatting:
   - Line 67: "Let's go." she said. → "Let's go," she said.
   
   Total: 4 issues found
   Status: Minor issues, quick fixes needed
   ```

## Quick vs. Full Grammar Check

**Quick Check (this command):**
- Run time: ~30 seconds
- Scope: Critical errors only
- Focus: Spelling, grammar, punctuation
- Use: Daily writing sessions, fast proofreading

**Full Grammar Check (grammar-check skill):**
- Run time: 2-5 minutes
- Scope: Comprehensive analysis
- Focus: Everything + style, consistency, pacing
- Use: Chapter completion, pre-submission editing

## Examples

```bash
# Check most recent file in my-novel
> /quick-grammar my-novel
# Finds and checks last modified scene

# Check specific file
> /quick-grammar my-novel 3_content/chapter7/004-confrontation.md
# Checks that exact file

# Check specific scene by name
> /quick-grammar my-novel
# Then specify: "Check the confrontation scene in chapter 7"
```

## After Grammar Check

Offer options:
```
Grammar check complete. Would you like to:
1. Fix these issues now
2. Run full grammar check for deeper analysis
3. Check another file
4. Continue writing
```

## Auto-Fix Option

If only 1-2 simple issues found:
```
Found 2 simple spelling errors. Fix automatically?
- Line 23: there → their
- Line 89: recieve → receive

[Y/n]
```

## Integration

Works well with:
- Daily writing workflow
- Quick proofreading between scenes
- Pre-commit checks
- Before sharing with beta readers

## Notes

- Optimized for speed over completeness
- Catches the most common errors
- Use full grammar-check skill for thorough editing
- Great for maintaining quality during drafting