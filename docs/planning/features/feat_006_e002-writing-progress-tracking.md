---
id: "006"
type: feature
title: "Writing Progress Tracking"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - wordcount
  - statistics
  - command
  - progress
---

# Feature: Writing Progress Tracking

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Command-based word count tracking and manuscript statistics. Calculates total manuscript word count with breakdown by chapter and scene, tracks progress toward goals, and provides writing statistics and analysis.

## User Stories

### Story 1: Check Manuscript Length

**As a** fiction author
**I want** to know my manuscript's total word count
**So that** I can track progress toward my target length

**Acceptance Criteria:**
- [x] Calculates total manuscript word count accurately
- [x] Provides breakdown by chapter
- [x] Provides breakdown by scene
- [x] Displays results clearly
- [x] Command executes quickly

### Story 2: Monitor Progress

**As a** fiction author working toward a goal
**I want** to see writing statistics over time
**So that** I can understand my productivity and pace

**Acceptance Criteria:**
- [x] Shows total words written
- [x] Provides chapter and scene counts
- [x] Indicates manuscript structure
- [x] Helps track toward word count goals
- [x] Works across writing sessions

### Story 3: Multi-Project Tracking

**As a** fiction author with multiple novels
**I want** to track word counts separately per project
**So that** I can monitor progress on each manuscript independently

**Acceptance Criteria:**
- [x] Accepts project name parameter
- [x] Tracks each project separately
- [x] Provides project-specific statistics
- [x] Allows comparison between projects
- [x] Maintains accuracy per project

## Functional Requirements

- REQ-F-001: System shall calculate total manuscript word count
- REQ-F-002: System shall provide word count breakdown by chapter
- REQ-F-003: System shall provide word count breakdown by scene
- REQ-F-004: System shall support multiple project tracking
- REQ-F-005: System shall display statistics clearly
- REQ-F-006: System shall execute via manual command
- REQ-F-007: System shall handle various project structures

## Non-Functional Requirements

- REQ-NF-001: Word count calculation shall complete within 5 seconds for 100k word manuscript
- REQ-NF-002: Accuracy shall be within ±1% of actual word count
- REQ-NF-003: Output shall be formatted for easy reading
- REQ-NF-004: Command shall work with flexible project structures
- REQ-NF-005: Statistics shall include meaningful breakdowns

## Implementation Details

**Component Type:** Command

**Location:** `writing-assistant/commands/wordcount.md`

**Command Format:**
```bash
/wordcount [project-name]
```

**Output Includes:**
- Total manuscript word count
- Chapter count
- Scene count
- Average words per chapter
- Average words per scene
- Breakdown by chapter with scene counts
- Longest/shortest chapters (optional)

**Supported Structures:**
- chapters/ folder
- 3_content/ folder
- manuscript/ folder
- Custom project structures

**File Types Counted:**
- Markdown files (.md)
- Scene files (###-scene-name.md)
- Chapter files

## Dependencies

- Bash (for file processing)
- File system access
- Markdown file support
- Claude Code command system

## Success Criteria

- [x] Word counts are accurate
- [x] Chapter and scene breakdowns are correct
- [x] Multi-project tracking works reliably
- [x] Command executes quickly
- [x] Output is clear and useful
- [x] Various project structures are supported
- [x] Authors find statistics helpful for tracking progress

## Notes

### Usage Examples

**Single Project:**
```bash
/wordcount my-novel
```

**Output Example:**
```
📊 Word Count Report: my-novel

Total Words: 87,453
Total Chapters: 12
Total Scenes: 48

Average per Chapter: 7,288 words
Average per Scene: 1,822 words

Chapter Breakdown:
  Chapter 1: 8,234 words (4 scenes)
  Chapter 2: 7,891 words (3 scenes)
  Chapter 3: 6,543 words (5 scenes)
  ...
  Chapter 12: 9,012 words (4 scenes)

Progress: 87.5% toward 100k goal
```

### Progress Tracking Tips

Authors can use wordcount to:
- **Track daily/weekly progress**: Run at end of sessions
- **Monitor pacing**: Identify short/long chapters
- **Plan revisions**: Know which sections need expansion/trimming
- **Motivate writing**: See tangible progress numbers
- **Assess structure**: Chapter and scene balance

### Goal Setting

Common manuscript goals:
- **Short story**: 1,000-7,500 words
- **Novelette**: 7,500-17,500 words
- **Novella**: 17,500-40,000 words
- **Novel**: 40,000-110,000 words
- **Epic fantasy**: 110,000-200,000+ words

**Genre-Specific Targets:**
- YA: 50,000-80,000 words
- Mystery/Thriller: 70,000-90,000 words
- Romance: 70,000-100,000 words
- Science Fiction: 90,000-120,000 words
- Epic Fantasy: 100,000-180,000 words

### Integration with Writing Session

Typical workflow:
1. `/continue my-novel` - Resume session
2. Write scenes with Gordon's collaboration
3. `/wordcount my-novel` - Check progress
4. Repeat

## Version History

- **v0.0.11** (Current): Production ready, full statistics
- **v1.0.0** (2026-01-15): Wordcount command implemented
