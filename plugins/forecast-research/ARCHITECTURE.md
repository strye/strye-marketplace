# Forecast Research Plugin - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORECAST RESEARCH PLUGIN                      │
└─────────────────────────────────────────────────────────────────┘

                            COMMANDS
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        /forecast.research  /forecast.config  /forecast.status
                │              │              │
                └──────────────┼──────────────┘
                               │
                        ┌──────▼──────┐
                        │   AGENTS    │
                        └──────┬──────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
    ┌────▼─────┐         ┌─────▼──────┐        ┌────▼─────┐
    │ Research │         │  Summary   │        │ (Future) │
    │  Agent   │         │   Agent    │        │  Agents  │
    └────┬─────┘         └─────┬──────┘        └──────────┘
         │                     │
         └─────────────────────┼─────────────────────┐
                               │
                        ┌──────▼──────┐
                        │   SKILLS    │
                        └──────┬──────┘
                               │
                   ┌───────────┼───────────┐
                   │           │           │
            ┌──────▼──┐  ┌─────▼──┐  ┌────▼────┐
            │ Content │  │ Dedup  │  │ (Future)│
            │ Fetcher │  │Manager │  │ Skills  │
            └──────┬──┘  └─────┬──┘  └─────────┘
                   │           │
                   └─────┬─────┘
                         │
                    ┌────▼─────┐
                    │   I/O    │
                    └────┬─────┘
                         │
            ┌────────────┬──────────────┐
            │            │              │
        ┌───▼────┐  ┌────▼────┐  ┌─────▼──┐
        │ WEB    │  │ LOCAL   │  │ CONFIG │
        │SEARCH  │  │ STORAGE │  │  JSON  │
        └────────┘  └─────────┘  └────────┘
```

## Data Flow - Research Cycle

```
START: /forecast.research
  │
  ├─► Load config/config.json
  │
  ├─► Get list of enabled domains
  │
  └─► FOR EACH DOMAIN:
       │
       ├─► Generate search queries from keywords
       │
       ├─► FOR EACH SEARCH QUERY:
       │    │
       │    ├─► Web Search
       │    │    │ (finds article URLs)
       │    │
       │    └─► FOR EACH RESULT URL:
       │         │
       │         ├─► Check: URL in dedup database?
       │         │    │
       │         │    ├─► YES: Log duplicate, skip
       │         │    │
       │         │    └─► NO: Proceed to fetch
       │         │         │
       │         │         ├─► Content Fetcher
       │         │         │    ├─► HTTP Request
       │         │         │    ├─► Extract metadata
       │         │         │    ├─► Validate quality
       │         │         │    └─► Convert to markdown
       │         │         │
       │         │         ├─► Dedup Manager
       │         │         │    └─► Add URL to database
       │         │         │
       │         │         └─► Save markdown file
       │         │              ./forecast-research-content/
       │         │              └─ [domain]/
       │         │                 └─ article.md
       │
       ├─► Generate domain summary
       │    (X new articles, Y duplicates prevented)
       │
       └─► Report statistics

END: Session complete
     Report total articles downloaded and deduplicated
```

## Data Flow - Daily Summary

```
SCHEDULED: 09:00 AM Daily (or /forecast.summary command)
  │
  ├─► Read all markdown files from domain directories
  │
  ├─► Filter articles from last 24 hours
  │
  ├─► ANALYSIS:
  │    ├─► Identify recurring topics
  │    ├─► Find cross-domain patterns
  │    ├─► Rank articles by importance
  │    └─► Extract key insights
  │
  ├─► COMPOSITION:
  │    ├─► Executive summary (2-3 paragraphs)
  │    ├─► Domain highlights section
  │    │    ├─► Top articles per domain
  │    │    └─► Trending topics
  │    ├─► Cross-domain patterns
  │    ├─► Statistics and metrics
  │    └─► Top articles for deep dive
  │
  └─► Save summary
       ./forecast-research-content/daily-summaries/
       └─ YYYY-MM-DD-summary.md
```

## Component Interaction - URL Deduplication

```
Research Agent Flow:
  │
  ├─ Get URL from search results
  │  │
  │  └─► Call Dedup Manager: isUrlTracked(url)
  │       │
  │       ├─► Check: URL in tracking database?
  │       │    ├─► YES: Return true
  │       │    └─► NO: Return false
  │
  │  ├─ If TRUE (duplicate):
  │  │  ├─ Skip article
  │  │  ├─ Increment domain duplicate counter
  │  │  └─ Log as skipped
  │  │
  │  └─ If FALSE (new):
  │     ├─ Fetch content
  │     ├─ Validate quality
  │     ├─ Save markdown file
  │     └─► Call Dedup Manager: trackUrl(url, domain, metadata)
  │          └─ Add to database: .forecast-tracking/url-tracking.json
```

## Storage Architecture

```
User-Configured Storage Directory
├── forecast-research-content/           (Main storage)
│   ├── ai-trends/                       (Domain 1)
│   │   ├── article-1.md
│   │   ├── article-2.md
│   │   └── ...
│   ├── climate-science/                 (Domain 2)
│   │   ├── article-1.md
│   │   └── ...
│   ├── biotech/                         (Domain 3)
│   │   └── article-1.md
│   └── daily-summaries/                 (Summaries)
│       ├── 2024-01-15-summary.md
│       ├── 2024-01-16-summary.md
│       └── ...
│
└── .forecast-tracking/                  (System files)
    └── url-tracking.json                (Dedup database)
```

## Configuration Hierarchy

```
config/config.json (Root Configuration)
│
├─ storageDirectory: "./forecast-research-content"
│
├─ domains: [
│   {
│     id: "ai-trends"
│     name: "AI & ML Trends"
│     keywords: [...]              ◄── Search queries generated from these
│     searchMode: "broad"           ◄── Affects search strategy
│     sourcePreferences: [...]     ◄── Prioritizes these sources
│     updateFrequency: "daily"     ◄── Research schedule
│     enabled: true
│   },
│   ... more domains ...
│ ]
│
├─ deduplication: {
│   strategy: "url"                ◄── Current strategy
│   trackingFile: "..."            ◄── Database location
│   cleanupOldEntriesAfterDays: 90
│ }
│
├─ research: {
│   maxResultsPerDomain: 20
│   maxArticlesPerSearch: 50
│   retryFailedRequests: 3
│   requestTimeoutSeconds: 30
│ }
│
└─ summary: {
    generateDailyAt: "09:00"
    includeTopicsSummary: true
    includeKeyInsights: true
    outputDirectory: "..."
  }
```

## Content Flow Through System

```
STAGE 1: Discovery
  Search Query → Web Search → Result URLs
       │
       └─► Feed to next stage

STAGE 2: Deduplication Check
  URLs → Dedup Manager → Unique URLs only
       │
       └─► Feed to next stage

STAGE 3: Content Fetching
  Unique URLs → Content Fetcher → Article Content + Metadata
       │
       ├─ Extract: title, author, date, content
       ├─ Validate: length, quality, language
       ├─ Score: quality assessment
       └─► Feed to next stage

STAGE 4: Storage
  Processed Content → Format as Markdown with Frontmatter
       │
       ├─ Save to domain folder
       ├─ Update URL tracking database
       └─► Generate statistics

STAGE 5: Analysis & Summarization
  All collected articles → Summary Agent → Daily Summary
       │
       ├─ Identify topics and patterns
       ├─ Extract insights
       ├─ Cross-reference domains
       └─► Save summary file
```

## Error Handling & Resilience

```
HTTP Request Failure
  │
  ├─► Timeout (>30 seconds)
  │   └─► Retry with backoff (up to 3 times)
  │
  ├─► 5xx Server Error (500, 502, 503, 504)
  │   └─► Retry with exponential backoff
  │
  ├─► 429 Too Many Requests
  │   └─► Implement rate limit backoff
  │
  ├─► 4xx Client Error (404, 403, 410)
  │   └─► Skip article, log error
  │
  └─► Connection Error
      └─► Retry with backoff, then skip

Content Validation Failure
  │
  ├─► Too short (<500 chars)
  │   └─► Skip, mark as low quality
  │
  ├─► High ad/boilerplate ratio
  │   └─► Skip, mark as invalid
  │
  ├─► Non-English content
  │   └─► Skip based on config
  │
  └─► Paywall/subscription detected
      └─► Skip, mark as paywalled

Storage Failure
  │
  ├─► Permission denied
  │   └─► Log error, skip article
  │
  ├─► Disk full
  │   └─► Log error, halt gracefully
  │
  └─► Database corruption
      └─► Backup and reinitialize
```

## Performance Characteristics

```
Research Session Performance:

Per Domain (with 20 articles max):
  ├─ Search: 2-5 seconds
  ├─ HTTP Fetches: 30-60 seconds (5 parallel)
  ├─ Dedup Checks: <1 second
  ├─ Content Processing: 5-10 seconds
  ├─ File I/O: 2-5 seconds
  └─► Total: ~45-140 seconds per domain

Full System (3 domains):
  ├─ All domains parallel: ~150-200 seconds
  └─► With summary: +30-60 seconds

Deduplication Impact:
  ├─ If 0% duplicates: 100% fetch time
  ├─ If 50% duplicates: 50% fetch time (half saved)
  ├─ If 80% duplicates: 20% fetch time (80% saved)
  └─► Savings grow over time as database builds

Storage Impact:
  ├─ Per article: 1-5 KB metadata + content
  ├─ Example 20 articles/day: 50-100 KB/day
  ├─ Monthly: 1.5-3 MB
  ├─ Yearly: 20-40 MB
  └─► Plus dedup database: <1 MB per 1000 URLs
```

## Extensibility Points

```
Future Enhancement Opportunities:

1. Additional Search Modes
   ├─ "academic-only" - scholarly databases
   ├─ "market-research" - industry reports
   └─ "reddit-twitter" - social media

2. Additional Skills
   ├─ ML-based content classification
   ├─ Sentiment analysis
   └─ Automatic tagging

3. Additional Agents
   ├─ Trend prediction agent
   ├─ Anomaly detection agent
   └─ Competitive intelligence agent

4. Enhanced Deduplication
   ├─ Content-hash based (not just URL)
   ├─ Semantic similarity detection
   └─ Near-duplicate detection

5. Output Formats
   ├─ JSON export
   ├─ RSS feeds
   ├─ Email delivery
   └─ Database integration

6. Integrations
   ├─ Webhook notifications
   ├─ Slack channel posts
   ├─ Email alerts
   └─ Custom API endpoints
```

## Plugin Lifecycle

```
Installation
  │
  ├─► Plugin.json loaded
  ├─► Commands registered
  ├─► Agents available
  └─► Skills initialized

First Run
  │
  ├─► Load config/config.json
  ├─► Create storage directory
  ├─► Initialize dedup database
  └─► Verify all settings

Ongoing Operation
  │
  ├─► /forecast.research (manual or scheduled)
  │   └─► Collect new content
  │
  ├─► /forecast.status (manual)
  │   └─► Check system health
  │
  ├─► Daily summary (scheduled)
  │   └─► Synthesize insights
  │
  └─► /forecast.config (as needed)
      └─► Update settings

Maintenance
  │
  ├─► Automatic dedup cleanup (90 days)
  ├─► Article archival
  └─► Storage management
```

---

This architecture provides a flexible, extensible system for domain-specific research that grows with your needs while maintaining efficiency through intelligent deduplication and quality validation.
