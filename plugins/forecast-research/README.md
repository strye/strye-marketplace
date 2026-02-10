# Forecast Research Plugin

A comprehensive research plugin for domain-specific internet exploration, content aggregation, and daily forecasting summaries. Automatically discovers and tracks relevant articles, news, and content across configurable domains with intelligent deduplication.

## Overview

The Forecast Research plugin provides autonomous research capabilities to help you stay informed about topics that matter. It continuously monitors the internet for domain-specific content, stores everything intelligently, prevents duplicate collection, and generates daily summaries of key insights.

### Key Features

- **Domain-Specific Research**: Configure custom research domains with keywords and search strategies
- **Autonomous Discovery**: Internet exploration agent finds and collects relevant content automatically
- **Smart Deduplication**: URL-based tracking prevents downloading the same article twice
- **Content Management**: Markdown-based storage with rich metadata and frontmatter
- **Daily Summaries**: Intelligent analysis agent synthesizes insights across domains
- **Flexible Search Modes**: News, broad web, or in-depth academic search modes per domain
- **Rate-Limit Compliance**: Respectful fetching with automatic backoff and delays

## Getting Started

### 1. Initialize Configuration

The plugin comes with a default configuration file at `config/config.json`. It includes three example domains:

- **AI & Machine Learning Trends**: Broad search of AI developments
- **Climate Science & Sustainability**: News-focused climate updates
- **Biotechnology & Healthcare**: In-depth academic research

To customize:

```bash
/forecast.config view                    # See current configuration
/forecast.config add-domain              # Add a new research domain
/forecast.config update-domain           # Modify existing domain
/forecast.config set-storage <path>      # Change storage directory
```

### 2. Configure Storage Directory

By default, content is stored in `./forecast-research-content/`. Change this in the config:

```json
{
  "storageDirectory": "/path/to/your/research"
}
```

All articles and summaries will be organized by domain within this directory.

### 3. Start Research

Kick off a research session:

```bash
/forecast.research                    # Research all enabled domains
/forecast.research domain=ai-trends   # Research specific domain
```

The research agent will:
- Search for relevant content using configured keywords
- Check against duplicate URLs already in the system
- Fetch and validate article content
- Save new articles as markdown files with metadata
- Report statistics on what was found and deduplicated

### 4. Check Status

Monitor research activities:

```bash
/forecast.status
```

Shows:
- Overall statistics (total articles, storage used)
- Per-domain status and article counts
- Last research session timestamp
- Deduplication tracking status
- Recent activity and any errors

## Architecture

### Components

#### Commands

- **`/forecast.research`**: Initiates research session for one or all domains
- **`/forecast.config`**: Manage research configuration and domains
- **`/forecast.status`**: View research system status and statistics

#### Agents

- **Research Agent** (`agents/research-agent.md`): Autonomous internet exploration and content collection
- **Summary Agent** (`agents/summary-agent.md`): Daily intelligence summary generation

#### Skills

- **Content Fetcher** (`skills/content-fetcher.md`): HTTP requests, validation, metadata extraction
- **Dedup Manager** (`skills/dedup-manager.md`): URL tracking and duplicate prevention

### Directory Structure

```
forecast-research-content/
├── ai-trends/
│   ├── article-1.md
│   ├── article-2.md
│   └── ...
├── climate-science/
│   ├── article-1.md
│   └── ...
├── biotech/
│   ├── article-1.md
│   └── ...
└── daily-summaries/
    ├── 2024-01-15-summary.md
    ├── 2024-01-16-summary.md
    └── ...

.forecast-tracking/
└── url-tracking.json    # Deduplication database
```

## Configuration Guide

### config.json Structure

```json
{
  "storageDirectory": "./forecast-research-content",
  "domains": [
    {
      "id": "unique-domain-id",
      "name": "Display Name",
      "keywords": ["keyword1", "keyword2"],
      "searchMode": "broad|news|indepth",
      "sourcePreferences": ["news", "academic", "blogs", "forums", "scientific", "research"],
      "updateFrequency": "daily|weekly|monthly",
      "enabled": true
    }
  ],
  "deduplication": {
    "strategy": "url",
    "trackingFile": ".forecast-tracking/url-tracking.json",
    "cleanupOldEntriesAfterDays": 90
  },
  "research": {
    "maxResultsPerDomain": 20,
    "maxArticlesPerSearch": 50,
    "retryFailedRequests": 3,
    "requestTimeoutSeconds": 30
  },
  "summary": {
    "generateDailyAt": "09:00",
    "includeTopicsSummary": true,
    "includeKeyInsights": true,
    "outputDirectory": "./forecast-research-content/daily-summaries"
  }
}
```

### Domain Search Modes

- **News Mode**: Focuses on news sites and recent publications
- **Broad Mode**: General web search across news, blogs, and forums
- **In-Depth Mode**: Academic papers and specialized research sources

### Source Preferences

Available sources to prioritize:
- `news`: News outlets and publications
- `academic`: Academic papers and research databases
- `blogs`: Industry blogs and expert commentary
- `forums`: Discussion forums and community discussions
- `scientific`: Scientific journals and research repositories
- `research`: Technical research papers and whitepapers

## Article Storage Format

Articles are stored as markdown files with YAML frontmatter:

```markdown
---
title: Article Title
url: https://example.com/article
domain: ai-trends
source: news
author: John Doe
publishDate: 2024-01-15
fetchedDate: 2024-01-15T10:30:00Z
contentLength: 2048
estimatedReadTime: 8
qualityScore: 85
tags: [machine-learning, neural-networks, research]
---

# Article Title

Article content in clean markdown format...
```

### Metadata Fields

- `title`: Article headline
- `url`: Original article URL
- `domain`: Which domain this was collected for
- `source`: Source type (news, academic, blog, forum)
- `author`: Article author if available
- `publishDate`: Original publication date
- `fetchedDate`: When the plugin fetched this article
- `contentLength`: Character count of article content
- `estimatedReadTime`: Estimated minutes to read
- `qualityScore`: 0-100 quality assessment
- `tags`: Relevant topic tags

## Deduplication System

The plugin uses URL-based deduplication to prevent collecting the same article twice:

### How It Works

1. **Before Fetching**: Research agent checks if URL exists in tracking database
2. **If Found**: Article is skipped and logged as duplicate prevented
3. **If New**: Article is fetched, saved, and URL added to tracking database
4. **Periodic Cleanup**: Old entries (default: >90 days) are removed automatically

### Tracking Database

Located at `.forecast-tracking/url-tracking.json`, stores:
- URL
- Domain collected for
- Fetch timestamp
- Content metadata
- Source information

### Checking Duplicates

You can query the deduplication status:

```bash
/forecast.status    # Shows duplicate prevention statistics
```

## Daily Summaries

The Summary Agent automatically generates daily intelligence summaries:

### What's Included

- **Executive Summary**: Key developments across all domains
- **Domain Highlights**: Top articles and trends per domain
- **Cross-Domain Patterns**: Topics appearing in multiple domains
- **Insights Classification**: Breakthroughs, trends, warnings, opportunities
- **Statistics**: Metrics on articles analyzed and topics identified
- **Top Articles**: Links to most important articles worth deep dive

### Summary Timing

Default: Runs daily at 09:00 AM (configurable in `config/config.json`)

To view today's summary:

```bash
cat ./forecast-research-content/daily-summaries/YYYY-MM-DD-summary.md
```

### Accessing Historical Summaries

All daily summaries are archived in `daily-summaries/` directory with date-based filenames:
- `2024-01-15-summary.md`
- `2024-01-16-summary.md`
- etc.

## Research Workflow

### Typical Day

1. **Morning**: Daily Summary Agent generates overnight summary (9:00 AM)
2. **Throughout Day**: You can manually trigger research: `/forecast.research`
3. **Evening**: Optional scheduled research run
4. **Continuous**: URL deduplication prevents duplicate collection

### Manual Research

Trigger research on-demand:

```bash
/forecast.research                              # Research all domains
/forecast.research domain=ai-trends             # Single domain
/forecast.research domain=ai-trends limit=10    # Limit results
/forecast.research force=true                   # Skip dedup, re-fetch all
```

## Content Quality

The Content Fetcher validates article quality:

### Acceptance Criteria

- Minimum content length: 500 characters
- Must be actual article content (not ads/boilerplate)
- Language must be configured language (default: English)
- Not detected as behind paywall
- Not low-quality/spam content

### Quality Scoring

Each article receives a 0-100 quality score based on:
- Content depth and length
- Source reputation
- Metadata completeness
- Readability metrics

## Performance & Optimization

### Efficiency Features

- **Rate Limiting**: Respectful fetching with delays between requests
- **Parallel Fetching**: Up to 5 concurrent fetches per domain
- **Caching**: Metadata cached to avoid re-parsing
- **Deduplication**: Prevents redundant downloads
- **Cleanup**: Removes old tracking entries automatically

### Storage Impact

- Example 20 articles per domain per day ≈ 1-2 MB per day
- 1000 articles total ≈ 50-100 MB
- Tracking database ≈ 500 KB per 1000 URLs

## Troubleshooting

### No Articles Found

- Check keywords are relevant and specific
- Verify internet connection
- Check request timeout settings (increase if needed)
- Review search mode appropriate for topic

### Duplicate Prevention Issues

- Verify `.forecast-tracking/url-tracking.json` exists
- Check file permissions on tracking directory
- Run status command to verify dedup system working

### Missing Content

- Verify storage directory path is correct
- Check disk space availability
- Review content quality thresholds

### Slow Research

- Reduce `maxArticlesPerSearch` in config
- Limit domains being researched
- Increase request timeout if getting timeouts

## Advanced Configuration

### Custom Source Prioritization

Each domain can prioritize different sources:

```json
{
  "id": "ai-trends",
  "sourcePreferences": ["academic", "news", "research", "blogs"]
}
```

Sources are searched in priority order.

### Per-Domain Update Frequency

Control how often each domain is researched:

```json
{
  "updateFrequency": "daily"     // daily, weekly, monthly
}
```

### Storage Organization

Customize output directory:

```bash
/forecast.config set-storage /path/to/your/research
```

## Integration & Extensibility

### Skills Used

- **Content Fetcher**: Handles all HTTP requests and content validation
- **Dedup Manager**: Manages URL tracking and duplicate prevention

### Agents

- **Research Agent**: Discovers and collects content
- **Summary Agent**: Analyzes content and generates summaries

### Configuration

All behavior controlled through `config/config.json` - no code changes needed.

## Use Cases

### Research Teams
Monitor industry trends, competitor developments, and market shifts across multiple domains

### Forecasters
Gather forecasting-relevant content on AI, climate, biotech, and other future-shaping fields

### Analysts
Build content repositories for cross-domain pattern analysis and insights

### Consultants
Stay current with latest developments in relevant domains for client advising

### Academics
Track research trends and developments in specialized fields

## Support & Customization

### Common Customizations

1. **Add new domain**: `/forecast.config add-domain`
2. **Change storage path**: `/forecast.config set-storage <path>`
3. **Adjust search frequency**: Edit `config/config.json` update frequency
4. **Modify quality thresholds**: Edit `research` section in config

### Feedback & Issues

For issues or feature requests, reach out to the plugin maintainer.

## Version History

- **1.0.0**: Initial release
  - Domain-specific research
  - URL-based deduplication
  - Daily summaries
  - Content validation
  - Markdown storage

---

**Plugin Name**: forecast-research
**Version**: 1.0.0
**Author**: Strye
**License**: Proprietary
