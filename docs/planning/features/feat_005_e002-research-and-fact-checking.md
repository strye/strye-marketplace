---
id: "005"
type: feature
title: "Research and Fact-Checking"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - research
  - skill
  - world-building
  - accuracy
---

# Feature: Research and Fact-Checking

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Auto-activated research assistant skill that gathers information for world-building, fact-checks technical details, and researches historical, cultural, and scientific topics. Documents findings with sources for author reference and story-bible integration.

## User Stories

### Story 1: World-Building Research

**As a** fiction author building a complex world
**I want** to research scientific, historical, or cultural topics
**So that** my world-building is grounded in accurate information

**Acceptance Criteria:**
- [x] Gathers factual information on requested topics
- [x] Provides sources for verification
- [x] Organizes findings clearly
- [x] Relevant to fiction writing context
- [x] Can be integrated into Lexicon/story-bible

### Story 2: Technical Fact-Checking

**As a** science fiction author
**I want** to verify technical details are plausible
**So that** my story maintains credibility with knowledgeable readers

**Acceptance Criteria:**
- [x] Fact-checks scientific concepts
- [x] Verifies technical terminology
- [x] Identifies implausibilities
- [x] Suggests corrections or alternatives
- [x] Provides explanations for creative license

### Story 3: Source Documentation

**As a** fiction author
**I want** research findings documented with sources
**So that** I can reference them later and verify accuracy

**Acceptance Criteria:**
- [x] Sources are clearly cited
- [x] Findings are organized by topic
- [x] Information is ready for story-bible integration
- [x] Can be saved to project files
- [x] Easy to reference during writing

## Functional Requirements

- REQ-F-001: System shall research requested topics for world-building
- REQ-F-002: System shall fact-check technical, scientific, and historical details
- REQ-F-003: System shall document sources for all findings
- REQ-F-004: System shall organize research clearly and usefully
- REQ-F-005: System shall integrate findings into project structure
- REQ-F-006: System shall be auto-activated on research requests
- REQ-F-007: System shall provide fiction-relevant context for findings

## Non-Functional Requirements

- REQ-NF-001: Research shall complete within 60 seconds for typical queries
- REQ-NF-002: Sources shall be credible and verifiable
- REQ-NF-003: Findings shall be organized for easy reference
- REQ-NF-004: Research shall be relevant to fiction writing context
- REQ-NF-005: Documentation shall be suitable for story-bible integration

## Implementation Details

**Component Type:** Skill (Auto-Activated)

**Location:** `writing-assistant/skills/research-assistant/`

**Trigger Conditions:**
- Author requests research for writing project
- Author mentions fact-checking needs
- Author asks about historical, scientific, or cultural topics
- Author needs world-building information

**Research Areas:**
- Scientific concepts and principles
- Historical events and periods
- Cultural practices and traditions
- Technical terminology and processes
- Geographic and environmental details
- Medical and biological information

**Output Format:**
- Topic summary
- Key findings
- Sources cited
- Fiction-writing implications
- Suggestions for story-bible documentation

## Dependencies

- Claude Code skill system
- Access to knowledge base (Claude's training data)
- File system access (for documentation)

## Success Criteria

- [x] Research provides accurate, useful information
- [x] Sources are documented clearly
- [x] Findings are relevant to fiction context
- [x] Information integrates with story-bible/Lexicon
- [x] Fact-checking identifies issues correctly
- [x] Skill auto-activates reliably
- [x] Research enhances world-building quality

## Notes

### Usage Examples

**World-Building Research:**
```
@gordon I need to research quantum entanglement for the FTL subplot. Use the research-assistant skill.
```

**Fact-Checking:**
```
@gordon Check if the physics in chapter 5 makes sense. The ship uses rotating sections for artificial gravity.
```

**Story-Bible Integration:**
```
@gordon Update Lexicon/World/technology.md with what we learned about FTL concepts.
```

### Research Output Example

**Topic:** Quantum Entanglement for FTL Communication

**Key Findings:**
- Entanglement allows correlated measurements but not faster-than-light information transfer
- "Spooky action at a distance" is a common misconception
- Measurement collapses the quantum state
- No-communication theorem prevents FTL signaling

**Sources:**
- Einstein, Podolsky, Rosen (EPR) paper (1935)
- Bell's Theorem
- Modern quantum physics textbooks

**Fiction-Writing Implications:**
- Pure entanglement won't work for FTL comms in hard sci-fi
- Could use as plot point: characters think they have FTL, discover limitation
- Or introduce fictional mechanism that exploits entanglement differently
- Soft sci-fi can handwave with "quantum ansible" trope

**Suggestions:**
- Document limitations in Lexicon/World/physics.md
- Consider alternative FTL mechanism (wormholes, hyperspace)
- Or embrace light-speed limit as story constraint

### Integration with Lexicon/Story-Bible

Research can be saved directly to project files:

```
Lexicon/
├── World/
│   ├── physics.md          # Scientific research
│   ├── technology.md       # Technical details
│   ├── history.md          # Historical research
│   └── culture.md          # Cultural research
├── Characters/
└── Planning/
```

### Creative License

The research assistant understands fiction writing needs:
- Identifies where creative license is acceptable
- Distinguishes hard vs. soft sci-fi requirements
- Suggests plausible alternatives to impossibilities
- Balances accuracy with storytelling needs

## Version History

- **v0.0.11** (Current): Production ready, full research capabilities
- **v1.0.0** (2026-01-20): Research Assistant skill implemented
