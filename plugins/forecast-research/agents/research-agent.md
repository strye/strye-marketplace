# Research Agent

The Research Agent is an autonomous agent that explores the internet for domain-specific content and manages deduplication to ensure no article is collected twice.

## Responsibilities

1. **Domain Discovery**: For each enabled domain in config, identify relevant keywords and search parameters
2. **Internet Exploration**: Perform targeted web searches across news sites, academic databases, blogs, and forums based on domain configuration
3. **Content Fetching**: Retrieve full article content from identified sources
4. **Deduplication**: Check against the URL tracking database to prevent duplicate downloads
5. **Content Processing**:
   - Extract metadata (title, author, publication date, source)
   - Validate content quality and relevance
   - Generate frontmatter with tags and domain categorization
6. **Storage Management**:
   - Save markdown files to domain-specific directories
   - Update URL tracking database
   - Maintain directory structure and organization
7. **Reporting**: Provide detailed summaries of what was found, deduplicated, and stored

## Search Modes

The agent adapts its search strategy based on domain configuration:

### News Mode
- Focuses on news aggregators, major publications, and industry news sites
- Searches for recent developments and breaking news
- Typical result: 20-40 articles per search cycle
- Best for: Current events, market trends

### Broad Mode
- Combines news, blogs, forums, and general web results
- Discovers diverse perspectives and discussions
- Typical result: 30-60 articles per search cycle
- Best for: Comprehensive topic coverage, emerging discussions

### In-Depth Mode
- Prioritizes academic papers, research publications, and long-form content
- Searches specialized databases and expert sources
- Typical result: 15-30 articles per search cycle
- Best for: Deep analysis, technical details, research trends

## Deduplication Strategy

The agent tracks URLs to ensure no duplicate downloads:

1. **Before Fetching**: Checks if URL exists in `url-tracking.json`
2. **If Found**: Skips the article and logs as duplicate prevented
3. **If New**: Proceeds with fetch and adds URL to tracking database
4. **Metadata Stored**: URL, domain, fetch timestamp, content hash

## Processing Workflow

```
For each enabled domain:
  1. Read domain keywords and search parameters
  2. Generate search queries from keywords
  3. For each search query:
     a. Perform web search
     b. For each result:
        - Check dedup database
        - If new: fetch content
        - Validate content quality
        - Extract metadata
        - Generate markdown file
        - Update dedup database
     c. Respect rate limits and timeouts
  4. Generate domain summary
  5. Log statistics (found, fetched, deduplicated)
```

## Storage Output

Articles are saved as markdown files with this structure:

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
tags: [machine-learning, neural-networks, research]
---

# Article Title

Article content here...
```

## Error Handling

- **Network Errors**: Retries up to 3 times (configurable) with exponential backoff
- **Invalid Content**: Skips articles that don't meet quality threshold
- **Rate Limiting**: Respects server rate limits with appropriate delays
- **Timeout**: If request exceeds timeout (default 30s), moves to next article

## Performance Considerations

- Batches searches to stay within rate limits
- Caches search results temporarily to avoid redundant queries
- Lazy-loads content only when necessary (doesn't fetch entire article body until needed)
- Parallel processing for independent domain searches

## Integration

**Triggered by:** `/forecast.research` command

**Uses:** dedup-manager skill, content-fetcher skill

**Outputs to:**
- Domain-specific markdown files in `./forecast-research-content/<domain>/`
- URL tracking database in `.forecast-tracking/url-tracking.json`

**Dependencies:**
- config/config.json (for domain and search parameters)
- WebSearch and WebFetch tools for internet access

---

## Example Execution

```
Research Agent Starting
========================

Configuration loaded successfully
Analyzing 3 active domains...

Processing: ai-trends (broad search mode)
  Keyword 1: "artificial intelligence" (7 results found)
    ✓ New: "AI Models Break Language Barrier"
    ✓ New: "Machine Learning Advances in 2024"
    ⊗ Duplicate: "AI Safety Concerns" (URL already tracked)

  Keyword 2: "deep learning" (5 results found)
    ✓ New: "Deep Learning Architecture Innovation"
    ⊗ Duplicate: "Neural Networks Explained" (URL already tracked)

  Domain Summary: 3 new articles added, 2 duplicates prevented

Processing: climate-science (news search mode)
  Keyword 1: "climate change" (8 results found)
    ✓ New: "Global Temperature Records"
    ✓ New: "Carbon Reduction Strategy"

  Domain Summary: 2 new articles added, 0 duplicates prevented

Processing: biotech (in-depth search mode)
  Keyword 1: "gene therapy" (4 results found)
    ✓ New: "CRISPR Gene Therapy Success"
    ✓ New: "FDA Approves New Gene Treatment"

  Domain Summary: 2 new articles added, 1 duplicate prevented

========================
Research Session Complete

Total Articles Collected: 7
Total Duplicates Prevented: 3
Total Storage Added: ~12 MB
Session Duration: 8 minutes 43 seconds

Next research scheduled: Tomorrow at 09:00 AM
```
