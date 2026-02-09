---
id: "003"
type: feature
title: "Professional Export System"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_002-writing-assistant-plugin
children:
  # Specs to be created if needed
tags:
  - export
  - manuscript
  - skill
  - pandoc
---

# Feature: Professional Export System

**Parent Epic:** [Writing Assistant Plugin](../epics/epic_002-writing-assistant-plugin.md)

## Description

Compiles markdown manuscript files into submission-ready formats (DOCX, PDF, EPUB) with industry-standard formatting. Auto-activated skill that handles multi-chapter projects, proper formatting, and professional output for agents, publishers, beta readers, or self-publishing.

## User Stories

### Story 1: Export for Submission

**As a** fiction author
**I want** to export my manuscript to DOCX with industry-standard formatting
**So that** I can submit to agents and publishers professionally

**Acceptance Criteria:**
- [x] Exports complete manuscript to DOCX format
- [x] Applies industry-standard manuscript formatting
- [x] Handles multi-chapter compilation
- [x] Maintains proper scene breaks and chapter divisions
- [x] Output is submission-ready

### Story 2: Beta Reader PDFs

**As a** fiction author
**I want** to export partial manuscripts as PDFs
**So that** I can share polished drafts with beta readers

**Acceptance Criteria:**
- [x] Exports selected chapters to PDF
- [x] Formatting is reader-friendly
- [x] Can export full or partial manuscript
- [x] PDF is properly formatted and navigable
- [x] Export completes without errors

### Story 3: Self-Publishing EPUB

**As a** fiction author self-publishing
**I want** to export my manuscript to EPUB format
**So that** I can distribute e-books directly

**Acceptance Criteria:**
- [x] Exports manuscript to EPUB format
- [x] EPUB validates and works on e-readers
- [x] Formatting is preserved appropriately
- [x] Metadata can be included
- [x] Output is distribution-ready

## Functional Requirements

- REQ-F-001: System shall export manuscripts to DOCX format
- REQ-F-002: System shall export manuscripts to PDF format
- REQ-F-003: System shall export manuscripts to EPUB format
- REQ-F-004: System shall apply industry-standard formatting for submissions
- REQ-F-005: System shall handle multi-chapter manuscript compilation
- REQ-F-006: System shall support partial manuscript export (selected chapters)
- REQ-F-007: System shall preserve scene breaks and chapter divisions
- REQ-F-008: System shall be auto-invoked when export is requested

## Non-Functional Requirements

- REQ-NF-001: Export shall complete within 30 seconds for typical novels (80k words)
- REQ-NF-002: Output files shall meet industry formatting standards
- REQ-NF-003: EPUB output shall validate against EPUB specifications
- REQ-NF-004: Skill shall provide clear progress feedback during export
- REQ-NF-005: Export errors shall be reported with actionable messages

## Implementation Details

**Component Type:** Skill (Auto-Activated)

**Location:** `writing-assistant/skills/export-manuscript/`

**Trigger Conditions:**
- Author requests manuscript export
- Author mentions DOCX, PDF, or EPUB format
- Author requests compilation or formatting for submission

**Dependencies:**
- Pandoc (external tool for format conversion)
- Markdown source files
- File system access

**Supported Formats:**
- **DOCX**: Industry-standard manuscript format for submissions
- **PDF**: Reader-friendly format for beta readers and review
- **EPUB**: E-book format for self-publishing distribution

**Formatting Standards:**
- 12pt Times New Roman or similar serif font
- Double-spaced lines
- 1-inch margins
- Proper chapter headings
- Scene break indicators
- Page numbering

## Dependencies

**External:**
- Pandoc (required)
  - Install: `brew install pandoc` (Mac)
  - Or: https://pandoc.org

**Internal:**
- Claude Code skill system
- File system access
- Markdown parsing

## Success Criteria

- [x] Exports work seamlessly for all three formats
- [x] Industry-standard formatting is applied correctly
- [x] Multi-chapter manuscripts compile properly
- [x] Partial exports function correctly
- [x] Output is submission/distribution ready
- [x] Skill auto-activates reliably
- [x] Export process is fast and error-free

## Notes

### Usage Examples

**Full Manuscript to DOCX:**
```
@gordon Export the full manuscript to DOCX for submission.
```

**Partial Manuscript to PDF:**
```
@gordon Compile chapters 1-10 as a PDF for my beta reader.
```

**EPUB for Self-Publishing:**
```
@gordon Export the complete novel to EPUB for self-publishing.
```

### Installation Requirement

Pandoc must be installed for this skill to function:

**Mac:**
```bash
brew install pandoc
```

**Linux:**
```bash
sudo apt-get install pandoc  # Debian/Ubuntu
sudo yum install pandoc      # RedHat/CentOS
```

**Windows:**
Download installer from https://pandoc.org

### Format Details

**DOCX (Submission Format):**
- Industry-standard manuscript formatting
- Proper headers and page numbering
- Scene breaks with # symbols
- Chapter headings formatted correctly

**PDF (Beta Reader Format):**
- Reader-friendly layout
- Table of contents (optional)
- Proper pagination
- Clean, professional appearance

**EPUB (Self-Publishing Format):**
- Valid EPUB 3.0 specification
- Reflowable text for e-readers
- Embedded metadata
- Chapter navigation

## Version History

- **v0.0.11** (Current): Production ready, all three formats supported
- **v1.0.0** (2026-01-20): Export Manuscript skill implemented
