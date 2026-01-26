# Future Skill: Archive Management for Specifications

**Type**: Skill Concept (Future Implementation)
**Created**: 2025-12-14
**Status**: Ideation (Pre-Feature)
**Related Epic**: 001-integrated-design-spec

---

## Problem Statement

When working with specifications, we sometimes need to archive documents that are no longer authoritative but should be kept as historical references or backups. Currently, this process is manual and error-prone:

1. User must manually create `.archive` folder (if it doesn't exist)
2. User must manually rename file with timestamp in correct format
3. No consistent naming convention enforcement
4. No tracking of what was archived or why
5. No way to list or manage archived documents

**Example Current Workflow**:
```bash
# Manual process (error-prone):
mkdir -p .archive
mv document.md .archive/document_20251214_1609.md  # Must remember format
# If timestamp is wrong, have to fix it manually
```

---

## Desired Solution: Archive Skill

A Claude Code skill that automates the specification archiving process with:

1. **Automatic timestamping** using system time in `YYYYMMDD_HHMM` format
2. **Flexible archive locations** (can archive to top-level `.archive/` or project-specific `.archive/`)
3. **Optional archive metadata** (track why document was archived, by whom, etc.)
4. **Archive listing** (view what's in archive, when it was archived)
5. **Archive search** (find archived documents by name or date range)
6. **Batch archiving** (archive multiple files at once)

---

## Observed Best Practices (From Manual Implementation)

Based on the archive process we executed on 2025-12-14, the following practices emerged:

### Practice 1: Timestamp Format
**Format**: `YYYYMMDD_HHMM` appended to filename before extension

**Example**:
- Original: `memory_system_mvp.md`
- Archived: `memory_system_mvp_20251214_1609.md`
- Pattern: `{filename}_{YYYYMMDD}_{HHMM}.{extension}`

**Rationale**:
- Sortable by date (YYYYMMDD ensures chronological ordering)
- Includes hour and minute (HHMM) for precision
- Human-readable (date and time are obvious)
- Preserves original filename for easy identification

### Practice 2: Archive Location Strategy
**Principle**: Place `.archive/` folder at a level that makes sense for the content

**Examples**:
- Top-level archive: `/marketplace/.archive/` (for project-wide archived documents)
- Epic-level archive: `/specs/001-epic/.archive/` (for epic-specific archived documents)
- Feature-level archive: `/specs/001-epic/features/00-feature/.archive/` (for feature-specific archived documents)

**Current Implementation**:
- `memory_system_mvp.md` archived to `/marketplace/.archive/memory_system_mvp_20251214_1609.md`
- Reasoning: Document was created during early work on epic, so top-level archive makes sense for easy reference across all epics

### Practice 3: Archive Metadata
**Current Implementation**: None (just filename + timestamp)

**Potential Enhancements**:
- Could create `.archive/MANIFEST.md` to track:
  - What was archived
  - When it was archived
  - Why it was archived (optional note)
  - Original location
  - Archive date/time

**Example Manifest Entry**:
```markdown
## Archived Documents

### memory_system_mvp_20251214_1609.md
- **Original Path**: specs/001-integrated-design-spec/_memory/memory_system_mvp.md
- **Archive Date**: 2025-12-14 at 16:09
- **Reason**: Served as source documentation for Feature 0 spec; now superseded by feature/00-specification-memory-system/ specs
- **Size**: 19 KB
```

### Practice 4: Hidden vs. Visible
**Decision**: Use `.archive/` with leading dot (hidden folder)

**Rationale**:
- Indicates operational/derived nature (similar to `.git/`, `.venv/`)
- Doesn't clutter directory listings in most tools
- Still visible if explicitly searching for it
- Clear signal to developers: "archived, don't modify"

---

## Skill Requirements (For Future Implementation)

### Core Functionality

**Skill: `/specid.archive`** or similar command

**Inputs**:
- File path to archive
- Optional: Archive destination (default: project-level `.archive/`)
- Optional: Archive reason/notes (for metadata)
- Optional: Batch mode (archive multiple files)

**Outputs**:
- Success message with new archived filepath
- Archive metadata updated (if MANIFEST.md exists)
- Confirmation of timestamp applied

**Examples**:
```
/specid.archive memory_system_mvp.md
→ Archived to: .archive/memory_system_mvp_20251214_1609.md ✅

/specid.archive document.md --location=specs/001-epic/.archive/ --reason="Superseded by updated spec"
→ Archived to: specs/001-epic/.archive/document_20251214_1609.md
→ Metadata recorded in: specs/001-epic/.archive/MANIFEST.md ✅

/specid.archive file1.md file2.md file3.md --batch
→ Archived 3 files to .archive/ ✅
```

### Archive Management Commands

**Skill: List archived documents**
```
/specid.archive-list [location]
→ Shows all archived files in given location with timestamps
```

**Skill: Search archives**
```
/specid.archive-search pattern [date-range]
→ Find archived documents by name or date
```

**Skill: View archive metadata**
```
/specid.archive-manifest [location]
→ Display MANIFEST.md for archive location
```

---

## Implementation Considerations

### Timestamp Generation
- Must use system `date` command in `YYYYMMDD_HHMM` format
- Handle timezone consistently (recommend UTC or system local)
- Validate timestamp format before moving file

### Archive Organization
- Allow hierarchical archives (each folder level can have its own `.archive/`)
- Provide guidance on which level to use (epic, feature, or project-level)
- Prevent accidental nesting of archive folders

### Metadata Management
- Create `MANIFEST.md` automatically in archive folder
- Append entries as files are archived
- Optional: Parse manifest to show why documents were archived

### Error Handling
- Verify file exists before archiving
- Prevent archiving files already in `.archive/` (no double-archiving)
- Handle filename conflicts (what if `document_20251214_1609.md` already exists?)
- Validate archive location exists or create it

### Integration Points
- Could integrate with validation system (archive validation reports after approval)
- Could integrate with memory system (archive old session notes)
- Could trigger on spec state transitions (archive previous versions when state changes)

---

## Related Concepts

### Archive vs. Delete
**Decision**: Archive instead of delete
- Rationale: Keep historical record; useful for referencing old thinking
- Aligns with Git philosophy (nothing is truly deleted, just moved)

### Archive Retention Policy
**Future Consideration**: When should archives be purged?
- Current: Keep indefinitely
- Could implement: Archive anything >X months old, move to separate `_old-archive/`
- Could implement: Automatic cleanup based on storage size

### Cross-Archive Consistency
**Future Consideration**: How do archives relate across project hierarchy?
- Should top-level archive contain references to epic-level archives?
- Should there be a unified archive search across all levels?

---

## Success Criteria (For Future User Story)

When this becomes a real User Story, it should meet these criteria:

- [ ] `/specid.archive` command available
- [ ] Automatically timestamps files in `YYYYMMDD_HHMM` format
- [ ] Moves file to `.archive/` folder at specified location
- [ ] Creates/updates MANIFEST.md with archive metadata
- [ ] Prevents double-archiving (file already in archive)
- [ ] Handles batch archiving (multiple files at once)
- [ ] `/specid.archive-list` shows archived files with timestamps
- [ ] `/specid.archive-search` finds archived documents by pattern
- [ ] Helpful error messages for common mistakes
- [ ] Documentation and examples provided

---

## Notes for Future Implementer

1. **Start Simple**: MVP can just do timestamping + file movement. Metadata/manifest can be Phase 2.

2. **Leverage Existing Tools**: Use system `date` command for timestamps, standard file operations for moving files.

3. **Consider UI**: Could show:
   - Archive confirmation with visual feedback
   - Timestamp clearly highlighted
   - New filepath shown for easy reference

4. **Documentation**:
   - Show examples of archiving at different hierarchy levels
   - Explain when to use project-level vs. epic-level archives
   - Provide archive cleanup guidelines

5. **Testing**:
   - Test timestamp format with various system times
   - Test with files in different directories
   - Test batch operations
   - Test error cases (file already archived, archive location doesn't exist, etc.)

---

**Version**: 1.0.0 | **Type**: Skill Concept (Ideation) | **Status**: Pre-Feature | **Last Updated**: 2025-12-14
