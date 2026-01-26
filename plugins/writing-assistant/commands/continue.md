---
description: Resume work on a writing project by reviewing current status and recent work
argument-hint: [project-name]
allowed-tools: Read, Glob
---

# Continue Session Command

Resume your writing session with full context.

## Process

1. **Validate project**
   ```bash
   if [ ! -d "$1" ]; then
     echo "Project '$1' not found. Available projects:"
     ls -d */ | grep -v "\.claude"
     exit 1
   fi
   ```

2. **Read project status**
   
   Look for project overview in order of preference:
   ```bash
   # Check these files:
   - $1/project-file.md
   - $1/README.md
   - $1/Lexicon/Planning/story-spine.md
   - .claude/CLAUDE.md (for project-specific notes)
   ```
   
   Extract:
   - Project title
   - Current status (draft number, completion %)
   - Last updated date
   - Current focus/next steps
   - Recent decisions

3. **Find recent work**
   
   Get the 5 most recently modified manuscript files:
   ```bash
   find "$1/3_content" -name "*.md" -type f -printf '%T@ %p\n' | \
     sort -n | tail -5 | cut -d' ' -f2-
   
   # Or for simple chapters structure:
   find "$1/chapters" -name "*.md" -type f -printf '%T@ %p\n' | \
     sort -n | tail -5 | cut -d' ' -f2-
   ```

4. **Check recent notes**
   
   Look for latest brainstorm session:
   ```bash
   # Find most recent dated note
   find "$1/notes" -name "brainstorm-*.md" | sort | tail -1
   
   # Or most recent general note
   find "$1/notes" -name "*.md" -type f -printf '%T@ %p\n' | \
     sort -n | tail -1 | cut -d' ' -f2-
   ```

5. **Review open questions**
   
   Check for planning documents:
   ```bash
   # Common locations:
   $1/Lexicon/Planning/open-questions.md
   $1/Lexicon/Planning/plot-threads.md
   $1/notes/todo.md
   ```

6. **Calculate progress**
   
   Run quick word count (silently):
   ```bash
   current_words=$(find "$1/3_content" -name "*.md" -exec cat {} + | wc -w)
   ```

## Output Format

Present a comprehensive session resume:

```markdown
# Welcome Back to [Project Title]

## Current Status
- **Draft:** [Number] in progress
- **Progress:** [X]% complete ([current words] / [target words])
- **Last Session:** [Date of last modification]
- **Current Focus:** [From project file]

## Where You Left Off

**Recently Modified:**
1. Chapter 7, Scene 4: "Confrontation" (modified 2 hours ago)
   - Last line: "She stepped into the darkness..."
2. Chapter 7, Scene 3: "Discovery" (modified yesterday)
3. Lexicon/Characters/sarah.md (modified yesterday)

**From Your Notes:**
Latest brainstorm (Jan 2):
- Decided to change Marcus's motivation to corporate blackmail
- Need to add foreshadowing in Chapter 3
- Considering cutting the love interest subplot

## Open Questions
- [ ] How does Sarah defeat the entity? (exploring in Ch. 18)
- [ ] Does Sarah reconcile with her sister?
- [x] Why did Marcus betray the team? (resolved: corporate blackmail)

## Next Steps
(From project-file.md)
1. Complete Chapter 10 - Sarah enters the facility
2. Revise Chapters 1-3 for foreshadowing
3. Research deep-sea communication tech for Chapter 12

## Writing Statistics
- Current word count: 47,234 words
- Target: 80,000 words
- Remaining: 32,766 words (41%)
- Average chapter: 4,294 words
- Last session output: ~2,100 words

---

**What would you like to work on today?**

Suggestions:
- Continue Chapter 7, Scene 4
- Address open questions
- Research for Chapter 12
- Revise earlier chapters for foreshadowing
```

## Follow-up Actions

Based on session resume, offer:

```
I can help you:
1. Pick up where you left off in Chapter 7
2. Work on one of your open questions
3. Do research for upcoming chapters
4. Review and revise earlier chapters
5. Brainstorm new ideas

Which would you like to do?
```

## Smart Context Loading

If the user wants to continue writing:

```bash
# Automatically read:
- The file they were last working on
- Related character files from Lexicon/Characters/
- Relevant planning documents
- Previous scene for continuity

Then summarize:
"I've read your last scene and Sarah's character file. 
Ready to continue from where the scene ended. 
Shall we discuss what happens next, or should I draft 
the next section?"
```

## Integration with Other Commands

This command can trigger:
- `/wordcount` (for current stats)
- `/new-scene` (if starting a new scene)
- Automatic invocation of `@gordon` agent

## Examples

```bash
# Resume work on my-novel
> /continue my-novel
# Gets full context and asks what to work on

# Resume and immediately start writing
> /continue my-novel
# Then: "Let's continue chapter 7, scene 4"

# Resume and brainstorm
> /continue my-novel
# Then: "Let's brainstorm solutions to the open questions"
```

## Daily Writing Routine

This command is perfect for starting each writing session:

```bash
# Every day:
1. > /continue my-novel
2. Review status and recent work
3. Decide what to tackle
4. Get to work with full context
```

## Context Preservation

The resume includes:
- ✅ Project status and goals
- ✅ Recent work and modifications
- ✅ Latest notes and decisions
- ✅ Open questions and problems
- ✅ Next planned steps
- ✅ Writing statistics and progress

This ensures you never waste time figuring out where you were.

## Notes

- Designed to eliminate "where was I?" friction
- Provides full context in under 30 seconds
- Automatically prepares Gordon to continue collaborating
- Updates dynamically based on actual file modifications
- Perfect for writers who work in multiple sessions