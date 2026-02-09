---
id: "004"
type: feature
title: "Grammar and Style Checking"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - grammar
  - editing
  - skill
  - quality
---

# Feature: Grammar and Style Checking

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Comprehensive grammar, spelling, and style analysis for fiction manuscripts that preserves author voice while catching errors. Auto-activated skill and quick-check command provide both thorough reviews and fast proofreading. Includes dialogue formatting verification and consistency checking across manuscripts.

## User Stories

### Story 1: Comprehensive Grammar Review

**As a** fiction author
**I want** thorough grammar and spelling analysis of my manuscript
**So that** I can catch errors before submission while preserving my voice

**Acceptance Criteria:**
- [x] Identifies grammar errors with specific examples
- [x] Catches spelling mistakes
- [x] Suggests style improvements
- [x] Preserves author's unique voice
- [x] Provides actionable corrections

### Story 2: Quick Proofreading

**As a** fiction author
**I want** fast grammar checks of recent work
**So that** I can catch critical issues between writing sessions

**Acceptance Criteria:**
- [x] Quick command focuses on recent scenes
- [x] Highlights critical issues first
- [x] Completes within seconds
- [x] Provides concise feedback
- [x] Doesn't disrupt writing flow

### Story 3: Dialogue Formatting

**As a** fiction author
**I want** dialogue formatting verified
**So that** my manuscript follows professional standards

**Acceptance Criteria:**
- [x] Checks dialogue punctuation
- [x] Verifies tag formatting ("she said" vs "she said.")
- [x] Identifies formatting inconsistencies
- [x] Suggests corrections
- [x] Maintains dialogue voice

## Functional Requirements

- REQ-F-001: System shall identify grammar errors in manuscript
- REQ-F-002: System shall detect spelling mistakes
- REQ-F-003: System shall suggest style improvements
- REQ-F-004: System shall preserve author voice in suggestions
- REQ-F-005: System shall verify dialogue formatting
- REQ-F-006: System shall check consistency across manuscript
- REQ-F-007: System shall provide quick proofreading command
- REQ-F-008: System shall auto-activate on grammar check requests

## Non-Functional Requirements

- REQ-NF-001: Full grammar check shall complete within 60 seconds for 10k words
- REQ-NF-002: Quick grammar check shall complete within 10 seconds
- REQ-NF-003: Suggestions shall be specific with line/paragraph references
- REQ-NF-004: False positive rate shall be minimized
- REQ-NF-005: Author voice preservation shall be prioritized over rigid rules

## Implementation Details

**Components:**

1. **Grammar Check Skill (Auto-Activated)**
   - Location: `writing-assistant/skills/grammar-check/`
   - Comprehensive analysis
   - Style suggestions
   - Consistency checking

2. **Quick Grammar Command**
   - Location: `writing-assistant/commands/quick-grammar.md`
   - Fast proofreading
   - Critical issues only
   - Recent work focus

**Trigger Conditions:**
- Author requests grammar or spelling review
- Author mentions proofreading or editing
- Author uses /quick-grammar command

**Analysis Areas:**
- Grammar and syntax
- Spelling and typos
- Dialogue punctuation
- Dialogue tag formatting
- Consistency (character names, terminology)
- Style (sentence variety, passive voice, word repetition)

## Dependencies

- Claude Code skill and command systems
- Markdown file access
- Natural language processing

## Success Criteria

- [x] Grammar errors are caught accurately
- [x] Author voice is preserved in suggestions
- [x] Dialogue formatting is verified correctly
- [x] Quick checks are fast and focused
- [x] Comprehensive checks are thorough
- [x] False positives are minimal
- [x] Feedback is actionable and specific

## Notes

### Usage Examples

**Comprehensive Review:**
```
@gordon Do a full grammar check on chapters 1-3.
```

**Quick Check:**
```bash
/quick-grammar my-novel
```

**Specific File:**
```bash
/quick-grammar my-novel chapters/chapter8/003-revelation.md
```

### Voice Preservation

The grammar checker prioritizes preserving author voice:

**Example 1 - Accepts Stylistic Choice:**
> *Fragment detected: "Gone. All of it."*
> Analysis: Intentional fragments for dramatic effect. No change needed.

**Example 2 - Suggests Improvement:**
> *Repetition: "very" used 12 times in this chapter*
> Suggestion: Consider varying intensity words for stronger prose.

**Example 3 - Dialogue:**
> *Dialogue tag: "Marcus said, smiling."*
> Note: Standard format. Could tighten to: "Marcus smiled."

### Dialogue Formatting Standards

Checked formatting rules:
- Commas inside closing quotes for tags
- Periods for action beats
- Capitalization after dialogue
- Tag placement and punctuation
- Consistent style across manuscript

**Correct:**
```
"We need to leave," Sarah said.
"Now?" Marcus looked up. "But the data—"
"Now," she repeated.
```

## Version History

- **v0.0.11** (Current): Production ready, full grammar and style checking
- **v1.0.0** (2026-01-20): Grammar Check skill and quick-grammar command implemented
