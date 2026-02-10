# Forecast Research Plugin - Setup Guide

## What Was Created

A complete forecasting research plugin with the following components:

### Plugin Metadata
- `.claude-plugin/plugin.json` - Plugin configuration and metadata
- Added to marketplace registry in `.claude-plugin/marketplace.json`

### Commands (3 slash commands)
1. **`/forecast.research`** - Initiates domain-specific research session
2. **`/forecast.config`** - Configure domains, sources, and storage settings
3. **`/forecast.status`** - View research system status and statistics

### Agents (2 autonomous agents)
1. **Research Agent** - Explores internet for domain-specific content
   - Performs targeted web searches
   - Fetches and validates article content
   - Manages URL-based deduplication
   - Stores content as markdown files

2. **Summary Agent** - Creates daily intelligence summaries
   - Analyzes collected content
   - Identifies trends and patterns
   - Generates structured daily summaries
   - Links back to source articles

### Skills (2 specialized skills)
1. **Content Fetcher** - Handles HTTP requests with:
   - Metadata extraction
   - Content quality validation
   - Error handling and retries
   - Rate limiting compliance

2. **Dedup Manager** - Manages duplicate prevention with:
   - URL tracking database
   - Duplicate detection
   - Periodic cleanup
   - Statistics and reporting

### Configuration
- **`config/config.json`** - Central configuration file with:
  - Storage directory path
  - Domain definitions (3 example domains included)
  - Search parameters and modes
  - Deduplication settings
  - Daily summary schedule

### Documentation
- **`README.md`** - Complete plugin documentation
- **`SETUP.md`** - This file

## Quick Start

### 1. View Configuration

```bash
/forecast.config view
```

Shows current domains, storage path, and all settings.

### 2. Customize Domains (Optional)

The plugin comes with 3 example domains. To customize:

```bash
/forecast.config add-domain       # Add new domain
/forecast.config update-domain    # Modify existing domain
/forecast.config set-storage /your/path  # Change storage location
```

### 3. Verify Storage Directory

The plugin stores content in `./forecast-research-content/` by default (configurable).
The system will create this automatically, or specify a custom path in config.json.

### 4. Start Your First Research

```bash
/forecast.research
```

This will:
- Research all enabled domains
- Search for relevant content
- Fetch articles (checking for duplicates)
- Save as markdown files with metadata
- Report statistics

### 5. Check Results

```bash
/forecast.status
```

Shows:
- Total articles collected
- Storage used
- Duplicate prevention stats
- Per-domain breakdown

## Key Features Configured

✓ **URL-Based Deduplication** - Tracks all URLs in `.forecast-tracking/url-tracking.json`
✓ **Markdown Storage** - Articles stored with rich frontmatter metadata
✓ **Multiple Search Modes** - "news", "broad", "indepth" per domain
✓ **Source Prioritization** - Each domain can prioritize different sources
✓ **Quality Validation** - Content checked for minimum quality standards
✓ **Rate Limiting** - Respectful fetching with automatic backoff
✓ **Daily Summaries** - Intelligent synthesis of collected content
✓ **Configurable Schedule** - Everything adjustable via config.json

## Directory Structure

```
plugins/forecast-research/
├── .claude-plugin/
│   └── plugin.json              # Plugin metadata
├── commands/
│   ├── forecast.research.md     # Research command
│   ├── forecast.config.md       # Configuration command
│   └── forecast.status.md       # Status command
├── agents/
│   ├── research-agent.md        # Content discovery agent
│   └── summary-agent.md         # Summary generation agent
├── skills/
│   ├── content-fetcher.md       # HTTP fetching & validation
│   └── dedup-manager.md         # Duplicate prevention
├── config/
│   └── config.json              # Configuration file (DEFAULT INCLUDED)
├── README.md                    # Full documentation
└── SETUP.md                     # This file

Content Storage (automatically created):
forecast-research-content/
├── ai-trends/                   # Example domain
├── climate-science/             # Example domain
├── biotech/                     # Example domain
└── daily-summaries/             # Generated summaries

.forecast-tracking/
└── url-tracking.json            # Deduplication database
```

## Configuration Highlights

### Example Domains Included

1. **ai-trends** - AI & Machine Learning trends (broad search, daily)
2. **climate-science** - Climate & Sustainability (news mode, daily)
3. **biotech** - Biotechnology & Healthcare (in-depth mode, weekly)

### Configurable Per Domain

```json
{
  "id": "domain-id",
  "name": "Display Name",
  "keywords": ["keyword1", "keyword2"],
  "searchMode": "broad|news|indepth",
  "sourcePreferences": ["news", "academic", "blogs", "forums", "scientific", "research"],
  "updateFrequency": "daily|weekly|monthly"
}
```

### Deduplication Settings

- **Strategy**: URL-based (tracks every URL downloaded)
- **Tracking File**: `.forecast-tracking/url-tracking.json`
- **Cleanup**: Removes entries older than 90 days

## How Articles Are Stored

Each article is a markdown file with frontmatter metadata:

```markdown
---
title: Article Title
url: https://example.com/article
domain: ai-trends
source: news
author: Author Name
publishDate: 2024-01-15
fetchedDate: 2024-01-15T10:30:00Z
contentLength: 2048
estimatedReadTime: 8
qualityScore: 85
tags: [tag1, tag2]
---

# Article Title

Article content in clean markdown format...
```

## How Deduplication Works

1. **Before Fetching**: Research agent checks URL in tracking database
2. **If URL Exists**: Article skipped (already have it)
3. **If URL New**: Article fetched, stored, and URL added to database
4. **Automatic Cleanup**: Old entries removed after 90 days

## How Daily Summaries Work

The Summary Agent:
- Runs daily at 09:00 AM (configurable)
- Analyzes all articles collected in the last 24 hours
- Identifies trends and patterns across domains
- Extracts key insights and breakthroughs
- Generates organized summary as markdown
- Saves to `daily-summaries/YYYY-MM-DD-summary.md`

## Next Steps

1. **Run first research**: `/forecast.research`
2. **Check the results**: View files in `forecast-research-content/`
3. **Customize domains**: Add or modify domains in config
4. **Monitor status**: `/forecast.status` shows statistics
5. **Review daily summaries**: Check `daily-summaries/` folder

## Customization Examples

### Change Storage Location

```bash
/forecast.config set-storage /Users/you/research-data
```

### Add New Domain

```bash
/forecast.config add-domain
```

Then follow prompts for:
- Domain ID
- Domain name
- Keywords
- Search mode
- Source preferences
- Update frequency

### Modify Existing Domain

Edit `config/config.json` directly:

```json
{
  "id": "my-domain",
  "name": "My Research Topic",
  "keywords": ["keyword1", "keyword2"],
  "searchMode": "broad",
  "updateFrequency": "daily"
}
```

## Search Modes Explained

- **News**: Focuses on news outlets and recent publications (quick, current)
- **Broad**: General web search (diverse sources and perspectives)
- **In-Depth**: Academic papers and research databases (detailed, authoritative)

## Troubleshooting

### Research finds nothing
- Verify keywords are relevant
- Try different search modes
- Check internet connection

### Duplicate URLs appearing
- Check `.forecast-tracking/url-tracking.json` exists
- Verify file permissions
- Try running `/forecast.status` to see dedup stats

### Storage path issues
- Ensure path exists or is writable
- Use absolute paths for clarity
- Check disk space available

### Too slow
- Reduce `maxArticlesPerSearch` in config
- Research fewer domains at once
- Increase request timeout if getting errors

## Support

For issues or questions about the plugin:
1. Review the full README.md
2. Check config.json for relevant settings
3. Run `/forecast.status` for system diagnostics
4. Examine log output from `/forecast.research`

---

**You're ready to start using Forecast Research!**

Begin with: `/forecast.research`
