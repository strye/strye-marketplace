---
name: content-fetcher
description: Fetches and validates web content for research articles, handling network operations, error recovery, and content quality checks.
---

# Content Fetcher Skill

Fetches and validates web content for research articles, handling network operations, error recovery, and content quality checks.

## Overview

The Content Fetcher skill handles all aspects of retrieving content from URLs discovered during research:
- HTTP requests with proper headers
- Timeout and retry logic
- Response validation and error handling
- Content quality assessment
- Metadata extraction
- Rate limiting compliance

## Core Functions

### Fetch Content
**Input**: URL, timeout (seconds), retry count
**Output**: Content object with metadata

```javascript
fetchContent(url: string, options?: FetchOptions): Promise<ContentResult>
```

Retrieves content from a URL with:
- Proper HTTP headers
- Timeout protection
- Automatic retry on failure
- Content validation

Returns:
```javascript
{
  success: boolean,
  url: string,
  title: string,
  author?: string,
  publishDate?: string,
  content: string,
  contentType: string,
  contentLength: number,
  source: string,
  fetchedAt: timestamp,
  statusCode: number,
  error?: string
}
```

### Extract Metadata
**Input**: HTML/Content and URL
**Output**: Extracted metadata object

```javascript
extractMetadata(content: string, url: string): Metadata
```

Extracts from content:
- Page title
- Article headline
- Author information
- Publication date
- Content type (article, blog, news, research)
- Key images
- Meta description
- Open Graph data

### Validate Content Quality
**Input**: Content object
**Output**: Quality score (0-100) and verdict

```javascript
validateContent(content: ContentResult): ValidationResult
```

Checks:
- Content length (minimum threshold)
- Actual text content (vs. ads/boilerplate)
- Language detection
- Spam/low-quality indicators
- Paywall detection

Returns:
```javascript
{
  isValid: boolean,
  qualityScore: number,  // 0-100
  issues: string[],      // Quality warnings
  isPaywalled: boolean,
  estimatedReadTime: number  // minutes
}
```

### Parse Article Content
**Input**: Raw HTML content
**Output**: Clean article text

```javascript
parseArticle(html: string, url: string): string
```

Converts HTML to clean markdown:
- Removes navigation, ads, sidebars
- Preserves article structure
- Extracts main content
- Cleans formatting

## Fetch Options

```javascript
{
  timeout: 30000,              // milliseconds
  maxRetries: 3,
  retryDelay: 1000,            // milliseconds between retries
  userAgent: 'forecast-research/1.0',
  acceptedLanguages: ['en'],
  validateSSL: true,
  followRedirects: true,
  maxRedirects: 5,
  minContentLength: 500        // bytes
}
```

## HTTP Headers

The fetcher uses respectful headers:

```
User-Agent: forecast-research/1.0 (Research Bot)
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate
Connection: keep-alive
```

## Retry Strategy

Automatic retry on:
- Network timeouts
- 5xx server errors (503, 502, 504)
- Temporary connection issues

Not retried:
- 4xx client errors (404, 403, 410)
- Authentication errors (401)
- Rate limit errors (429) - uses exponential backoff instead

## Error Handling

### Network Errors
- Timeout: Retries with exponential backoff
- Connection refused: Logs and moves to next
- DNS failure: Logs and moves to next

### HTTP Errors
- 404 Not Found: Logs and skips
- 403 Forbidden: Logs and skips
- 429 Too Many Requests: Implements exponential backoff with increased delay
- 5xx Server Error: Retries with backoff

### Content Errors
- Empty content: Rejected
- Non-text content: Rejected (binary files, images)
- Encoding issues: Attempts conversion, skips if fails
- Corrupt data: Rejected

## Configuration

From `config/config.json`:

```json
"research": {
  "requestTimeoutSeconds": 30,
  "retryFailedRequests": 3,
  "minArticleLength": 500,
  "validateContent": true,
  "extractMetadata": true,
  "preserveHtml": false,
  "excludePaywalled": true
}
```

## Quality Validation Thresholds

Content is rejected if:
- Length < 500 characters
- Less than 50% actual content (high ads/boilerplate ratio)
- Detected as paywall/subscription wall
- Non-English language (when configured)
- Contains spam indicators

Content is flagged if:
- Very short (500-800 chars) but still valid
- Missing key metadata
- Unusual content structure

## Rate Limiting

The fetcher respects server resources:

- Delays between requests from same domain (500ms default)
- Respects robots.txt where discoverable
- Respects X-Rate-Limit headers
- Backs off exponentially on 429 responses
- Tracks per-domain request counts

## Output Format

After successful fetch and validation, content is formatted for storage:

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
tags: [machine-learning, ai-safety]
---

# Article Title

[Cleaned and formatted article content]
```

## Integration Points

**Used by:**
- Research Agent (primary consumer)

**Dependencies:**
- HTTP client library (handles requests)
- HTML parser for metadata extraction
- Article extraction library (e.g., Readability-based parser)

**Configuration from:**
- config/config.json

## Usage in Research Workflow

```javascript
const fetcher = new ContentFetcher(config);

// In research loop:
for (const url of searchResults) {
  // Assume dedup manager already checked this URL

  try {
    const content = await fetcher.fetchContent(url, {
      timeout: config.research.requestTimeoutSeconds * 1000,
      maxRetries: config.research.retryFailedRequests
    });

    if (!content.success) {
      logError(`Failed to fetch ${url}: ${content.error}`);
      continue;
    }

    // Validate quality
    const validation = fetcher.validateContent(content);
    if (!validation.isValid) {
      console.log(`Content quality too low: ${validation.issues.join(', ')}`);
      continue;
    }

    // Save to markdown
    saveMarkdownFile(domain, content);

  } catch (error) {
    logError(`Error processing ${url}:`, error);
  }
}
```

## Performance Notes

- **Parallel Fetching**: Can fetch up to 5 URLs simultaneously per domain
- **Timeout**: Default 30 seconds per request
- **Cache**: Recent metadata cached to avoid re-parsing
- **Memory**: Streams large responses to avoid memory issues

## Monitoring & Diagnostics

Track:
- Total requests attempted
- Successful vs. failed fetches
- Average fetch time
- Timeout rate
- Retry frequency
- Content quality score distribution

---

## Example Execution

```javascript
const fetcher = new ContentFetcher(config);

const result = await fetcher.fetchContent(
  'https://example.com/article',
  { timeout: 30000, maxRetries: 3 }
);

if (result.success) {
  console.log(`Fetched: ${result.title}`);
  console.log(`  Author: ${result.author}`);
  console.log(`  Length: ${result.contentLength} bytes`);
  console.log(`  Read time: ${result.readTime} minutes`);

  const validation = fetcher.validateContent(result);
  console.log(`  Quality score: ${validation.qualityScore}/100`);

  if (validation.isValid) {
    // Proceed with storage
  }
} else {
  console.log(`Failed: ${result.error}`);
}
```
