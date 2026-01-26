---
name: export-manuscript
description: Export and compile manuscript from multiple markdown files into standard submission formats (DOCX, PDF, EPUB). Use when the user wants to compile, export, format, or prepare their manuscript for submission or distribution.
---

# Manuscript Export Skill

## Purpose
Convert markdown-based manuscript files into industry-standard submission formats, handling compilation, formatting, and conversion automatically.

## When to Use This Skill

Activate this skill when the user asks to:
- Export or compile the manuscript
- Create a submission-ready document
- Generate a PDF or DOCX of their work
- Prepare the manuscript for beta readers or publishers
- Create an EPUB for distribution

## How to Use This Skill

### Step 1: Locate Manuscript Files

Ask the user which chapters/sections to include, or auto-detect based on common patterns:

```bash
# Pattern 1: Obsidian-style (3_content/chapter#/)
find */3_content -name "*.md" -type f | sort

# Pattern 2: Simple chapters/ directory
find */chapters -name "*.md" -type f | sort

# Pattern 3: Custom - ask the user
```


### Step 2: Read Project Metadata

Look for metadata in these files (in order of preference):
1. `project-file.md`
2. `README.md`
3. `.claude/CLAUDE.md`
4. Ask the user directly

Extract:
- **Title**: The manuscript title
- **Author**: Author name(s)
- **Word count target**: If specified
- **Current status**: Draft number, completion stage

### Step 3: Compile Content

Process files in order:

1. **Sort chapters/scenes numerically**
   - Respect numbering schemes (ch01, chapter-1, 001-, etc.)
   - Maintain scene order within chapters

2. **Clean markdown for export**
   - Remove Obsidian-specific syntax: `[[wikilinks]]`, `#tags`
   - Strip metadata blocks (YAML frontmatter)
   - Convert scene breaks to standard format (`***` or `# `)
   - Remove comments (`<!-- -->`)

3. **Combine into single document**
   - Create proper chapter breaks
   - Maintain scene breaks within chapters
   - Add title page if requested

### Step 4: Format for Submission

Apply industry-standard manuscript formatting:

**Title Page:**
```
[Title]
by [Author Name]

[Word Count] words
[Contact Information]
```

**Chapter Formatting:**
- Chapter headers: "Chapter One" or "Chapter 1" (ask user preference)
- Centered or left-aligned (ask user preference)
- Page breaks between chapters

**Scene Breaks:**
- Use `#` or `***` (ask user preference)
- Consistent throughout manuscript

**Text Formatting:**
- 12pt font (Times New Roman, Courier, or user preference)
- Double-spaced
- 1-inch margins
- Header with Author Name / Title / Page Number

### Step 5: Convert to Desired Format

Use Pandoc for conversion:

**DOCX (Word Document):**
```bash
pandoc compiled-manuscript.md -o manuscript.docx \
  --reference-doc=manuscript-template.docx \
  -V fontsize=12pt \
  -V geometry:margin=1in
```

**PDF:**
```bash
pandoc compiled-manuscript.md -o manuscript.pdf \
  -V fontsize=12pt \
  -V geometry:margin=1in \
  -V linestretch=2
```

**EPUB:**
```bash
pandoc compiled-manuscript.md -o manuscript.epub \
  --metadata title="[Title]" \
  --metadata author="[Author]"
```

### Step 6: Quality Checks

Before finalizing:
- Verify all chapters included
- Check chapter order
- Confirm formatting consistency
- Verify word count matches expectations
- Preview the output file

## Output Formats Supported

- **DOCX** - Standard Word format for submissions
- **PDF** - For sharing/review, print-ready
- **EPUB** - For e-reader distribution
- **Markdown** - Compiled single file
- **HTML** - Web-ready version

## User Preferences to Gather

Before exporting, ask about:

1. **Chapter numbering**: Words ("Chapter One") vs. numbers ("Chapter 1")
2. **Front matter**: Include dedication, acknowledgments, author note?
3. **Scene breaks**: `#`, `***`, or custom?
4. **Word count display**: Include in header/footer?
5. **Which chapters**: All, or specific range?
6. **File name**: Custom or auto-generated?

## Dependencies

**Required:**
- Pandoc: https://pandoc.org/installing.html

**Optional:**
- Custom template.docx for consistent formatting
- LaTeX (for PDF generation with advanced formatting)

## Template for Standard Manuscript Format

If the user doesn't have a template, offer to create one:

```markdown
# Standard Manuscript Format Template

**Font**: 12pt Times New Roman or Courier
**Spacing**: Double-spaced
**Margins**: 1 inch all sides
**Header**: Author Last Name / Title / Page Number
**Indentation**: 0.5 inch first line indent (except after scene breaks)
**Scene breaks**: # centered
**Chapter breaks**: New page, "Chapter [Number]" centered
```

## Example Workflows

### Example 1: Full Manuscript Export
```
User: "Export the full manuscript to DOCX"

1. Find all chapters in [project]/3_content/
2. Read project-file.md for title and author
3. Compile all chapters in order
4. Ask: "Chapter numbering preference? Words or numbers?"
5. Apply standard manuscript formatting
6. Convert to DOCX using Pandoc
7. Save as "[Title]-by-[Author].docx"
8. Confirm: "Exported 15 chapters, 82,341 words"
```

### Example 2: Partial Export for Beta Readers
```
User: "Create a PDF of chapters 1-5 for my beta reader"

1. Find chapters 1-5
2. Compile into single document
3. Add title page
4. Convert to PDF
5. Save as "[Title]-chapters-1-5.pdf"
6. Confirm: "Exported chapters 1-5, 23,456 words"
```

### Example 3: EPUB for Distribution
```
User: "Generate an EPUB version"

1. Compile full manuscript
2. Include front matter if available
3. Add metadata (title, author, description)
4. Convert to EPUB
5. Validate EPUB structure
6. Confirm: "Created [Title].epub"
```

## Error Handling

If Pandoc is not installed:
```
"Pandoc is required for manuscript export. Install it:
- Mac: brew install pandoc
- Linux: sudo apt-get install pandoc
- Windows: Download from https://pandoc.org/installing.html"
```

If files are missing:
```
"I couldn't find chapter X. Please verify the file exists at [path]."
```

If formatting issues occur:
```
"There's a formatting issue in [file] at line [N]. 
I'll skip that section and continue. Please review after export."
```

## Quality Assurance

After export, provide a summary:
```
Manuscript Export Complete:
- Format: DOCX
- Total Words: 82,341
- Chapters: 15
- File: the-signal-in-the-dark-by-jane-doe.docx
- Location: [path]

Next steps:
- Review formatting
- Run spell check
- Verify chapter order
- Check scene breaks
```

## Notes

- Always preserve the original markdown files
- Create a backup before making changes
- Respect the user's creative choices in formatting
- When in doubt about formatting preferences, ask
- Keep the export process transparent - explain what you're doing
