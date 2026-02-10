# Forecast Research Command

Initiates a domain-specific research session to discover and collect relevant content from the internet.

## Usage

This command triggers the research agent to begin exploring the internet for content relevant to configured domains. The agent will:

1. Read the research configuration from `config/config.json`
2. For each enabled domain, perform targeted web searches
3. Fetch and validate article content
4. Check for duplicates using the URL deduplication system
5. Store new content as markdown files with metadata
6. Report on the number of new articles discovered and any skipped duplicates

## Parameters

- `domain` (optional): Specify a single domain ID to research. If omitted, all enabled domains are researched.
- `force`: If set to true, bypass duplicate detection and re-fetch all results (useful for refreshing content)
- `limit`: Maximum number of articles to collect per domain (overrides config setting)

## Example Output

```
Forecast Research Session Started
====================================
Researching domains: ai-trends, climate-science, biotech

Domain: ai-trends
  - Searched for 6 keyword combinations
  - Found 45 potential articles
  - Deduplicated 12 existing URLs
  - Downloaded 33 new articles
  - Storage: ./forecast-research-content/ai-trends/

Domain: climate-science
  - Searched for 5 keyword combinations
  - Found 28 potential articles
  - Deduplicated 8 existing URLs
  - Downloaded 20 new articles
  - Storage: ./forecast-research-content/climate-science/

Domain: biotech
  - Searched for 4 keyword combinations
  - Found 18 potential articles
  - Deduplicated 3 existing URLs
  - Downloaded 15 new articles
  - Storage: ./forecast-research-content/biotech/

====================================
Session Summary
Total new articles: 68
Total duplicates skipped: 23
Total storage used: ~145 MB
Next scheduled research: Tomorrow at 09:00 AM
```

## Configuration

Research behavior is controlled by `config/config.json`:

- `domains`: Define which topics to research, keywords, search modes, and update frequency
- `deduplication.strategy`: Currently "url" - tracks URLs to prevent duplicate downloads
- `research.maxResultsPerDomain`: Limits results per domain search
- `research.maxArticlesPerSearch`: Limits individual search result sets

## Storage Structure

Articles are organized by domain:
```
forecast-research-content/
├── ai-trends/
│   ├── article-1.md
│   ├── article-2.md
│   └── ...
├── climate-science/
│   ├── article-1.md
│   └── ...
└── daily-summaries/
    ├── 2024-01-15-summary.md
    └── ...
```

Each markdown file includes frontmatter with metadata:
```yaml
---
title: Article Title
url: https://example.com/article
domain: ai-trends
fetchedDate: 2024-01-15T10:30:00Z
source: news
contentLength: 2048
---

# Article content here...
```

---

**Triggered by:** `/forecast.research`

**Agent Responsible:** research-agent

**Related Commands:** `/forecast.config`, `/forecast.status`
