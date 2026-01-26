---
name: grammar-check
description: Comprehensive grammar, spelling, punctuation, and style checking for manuscript text while preserving author voice. Use when the user wants to proofread, edit for grammar, polish prose, or check for errors.
---

# Grammar Check Skill

## Purpose
Provide detailed grammar, spelling, punctuation, and style analysis while maintaining the author's unique voice and creative choices.

## When to Use This Skill

Activate when the user asks to:
- Check grammar or spelling
- Proofread a scene or chapter
- Polish prose
- Find typos or errors
- Edit for clarity
- Review dialogue formatting

## How to Perform Grammar Checks

### Step 1: Read the Target Content

Identify what to check:
```bash
# If user specified a file
Read [specified-file.md]

# If user said "this chapter" or "current chapter"
Find most recently modified file in current chapter directory

# If user said "everything" or "all chapters"
Find all markdown files in manuscript directories
```

### Step 2: Run Comprehensive Checks

Analyze for multiple issue types:

#### A. Spelling Errors
- Obvious misspellings
- Common typos (teh → the, recieve → receive)
- **BUT** watch for:
  - Intentional creative spelling
  - Made-up words for fantasy/sci-fi
  - Character names and place names
  - Genre-specific terminology

#### B. Grammar Issues
- Subject-verb agreement
- Tense consistency (especially in narrative)
- Pronoun agreement
- Sentence fragments (only if unintentional)
- Run-on sentences
- Comma splices
- Misplaced modifiers

#### C. Punctuation
- Missing or extra commas
- Dialogue formatting (American vs. British style)
- Quotation mark placement
- Apostrophe usage
- Em-dash vs. en-dash vs. hyphen
- Semicolon usage

#### D. Style Issues
- Passive voice (flag, don't auto-change)
- Filter words (saw, felt, heard, etc.)
- Adverb overuse (-ly words in dialogue tags)
- Weak verbs (is, was, are)
- Repetitive words or phrases
- Show vs. tell issues

#### E. Consistency Checks
- Character name spelling
- Terminology consistency
- Capitalization of made-up terms
- POV consistency within scenes
- Tense consistency

### Step 3: Cross-Reference with Project Files

Check against established references:

```bash
# Compare character names with Lexicon/Characters/
Check character name consistency

# Compare terminology with Lexicon/World/
Check world-building term consistency

# Check established style choices
Look for style guide or writing preferences
```

### Step 4: Preserve Author Voice

**DO NOT flag as errors:**
- Intentional sentence fragments for effect
  - "Gone." "Never." "Impossible."
- Dialogue that reflects character voice
  - "I ain't going nowhere" (character dialect)
- Genre-specific language
  - "The ship jumped to hyperspace" (not literally jumping)
- Established creative spellings
  - "magick" instead of "magic" (if consistent)
- Stylistic choices
  - Starting sentences with "And" or "But"
  - Short, punchy sentences for pacing

**BE CAUTIOUS with:**
- "Said" bookisms (alternatives to "said")
  - Only flag if egregious or repetitive
- Sentence length variety
  - Note patterns, don't mandate changes
- Description density
  - Some authors are sparse, some lush - both valid

### Step 5: Output Format

Present findings in clear, actionable format:

```markdown
## Grammar Check Results: [filename]

### Critical Issues (Need Fixing)
**Line 23**: "there eyes" → "their eyes" [SPELLING]
**Line 45**: "The team were divided" → "The team was divided" [SUBJECT-VERB AGREEMENT]
**Line 67**: Missing closing quotation mark [PUNCTUATION]

### Style Suggestions (Consider Changing)
**Line 12**: Passive voice - "The door was opened by Sarah" → Consider: "Sarah opened the door" [PASSIVE VOICE]
**Line 34**: Filter word - "She felt afraid" → Consider: "Fear gripped her" or "Her hands trembled" [FILTER WORD]
**Line 89**: Adverb in dialogue tag - "'Go!' she said angrily" → Consider: "'Go!' she snapped" [ADVERB]

### Consistency Notes
**Line 102**: Character name "Sarha" - Did you mean "Sarah"? (Used 47 times elsewhere) [CONSISTENCY]
**Line 156**: "hyperspace" vs. "hyper-space" - Inconsistent with earlier usage [TERMINOLOGY]

### Summary
- Critical issues: 3
- Style suggestions: 3
- Consistency notes: 2
- Word count: 2,847
```

## Grammar Check Levels

Offer different levels based on user needs:

### Quick Check (Fast)
- Obvious spelling errors
- Critical grammar issues
- Dialogue formatting problems

### Standard Check (Balanced)
- All Quick Check items
- Style suggestions
- Consistency issues
- Common writing weaknesses

### Deep Check (Thorough)
- All Standard Check items
- Repetition analysis
- Pacing suggestions
- Show vs. tell analysis
- Sentence variety review

## Consistency Cross-Reference

When checking consistency, reference these files:

```
Lexicon/Characters/[character].md → Character names, traits
Lexicon/World/[file].md → Terminology, place names, tech/magic terms
Lexicon/Planning/style-guide.md → User's style preferences (if exists)
```

## Dialogue Formatting Rules

Check dialogue against standard formatting:

**American Style (default):**
- Commas and periods inside quotes
- "I'm going," she said.
- Action beats: She stood. "I'm leaving."

**British Style:**
- Commas and periods outside quotes
- 'I'm going', she said.

**Common Dialogue Issues to Flag:**
- Incorrect punctuation: "Let's go." She said. → "Let's go," she said.
- Missing dialogue tags when needed
- Overuse of exclamation points
- Inconsistent quotation marks (' vs. ")

## What NOT to Flag

Be intelligent about what to flag:

❌ **Don't flag:**
- Genre conventions ("beamed down" in Star Trek fanfic)
- Established character voice ("gonna," "ain't" if consistent)
- Intentional stylistic choices (short sentences, fragments)
- Creative punctuation for effect (em-dashes for interruption)
- Author's preferred spelling variants (grey vs. gray)

✅ **Do flag:**
- Actual errors (their/there/they're mistakes)
- Inconsistencies (Sarah → Sara midway through)
- Typos that aren't intentional
- Grammar that confuses meaning

## Example Workflows

### Example 1: Quick Proofread
```
User: "Quick grammar check on chapter 3"

1. Read chapter 3 files
2. Run quick check (critical issues only)
3. Output:
   "Chapter 3 Grammar Check:
   - 2 spelling errors found
   - 1 dialogue formatting issue
   - Overall: Clean! Ready for review."
```

### Example 2: Deep Edit
```
User: "Do a thorough edit of the opening scene"

1. Read scene file
2. Run deep check
3. Cross-reference character names with Lexicon
4. Analyze for show vs. tell
5. Check pacing and sentence variety
6. Provide detailed report with examples
```

### Example 3: Consistency Check
```
User: "Make sure character names are consistent in chapters 1-5"

1. Extract all character mentions from chapters 1-5
2. Compare with Lexicon/Characters/
3. Flag variations (Sara vs. Sarah, Dr. Webb vs. Dr. Webber)
4. Provide list of inconsistencies to fix
```

## Integration with Other Skills

This skill works well with:
- **export-manuscript**: Run grammar check before export
- **research-assistant**: Verify technical terms are correct

## Tone and Approach

When providing feedback:
- **Be helpful, not condescending**
- **Explain why something is an issue**
- **Offer alternatives, not just criticism**
- **Celebrate what works well**
- **Respect the author's choices**

Good: "Line 23: 'there' should be 'their' (possessive form)"
Bad: "You used the wrong there/their/they're"

Good: "Consider: The passive voice here slows the pacing. Active alternative: 'Sarah opened the door' has more immediacy."
Bad: "Don't use passive voice."

## Quality Assurance

After completing a grammar check:

```markdown
Grammar Check Complete: [filename]

Issues found:
- Critical: [N] (must fix)
- Style: [N] (consider)
- Consistency: [N] (review)

Word count: [N]
Reading time: ~[N] minutes

Status: [Ready for review / Needs revision / Clean]
```

## Notes

- Grammar checking is supportive, not prescriptive
- The author's voice matters more than perfect grammar
- Context matters - what works in one genre may not in another
- When in doubt, explain the rule and let the author decide
- Celebrate good writing, don't just point out problems