# Dedup Manager Skill

Manages URL deduplication and prevents duplicate article downloads in the forecast research system.

## Overview

The Dedup Manager maintains a tracking database of all URLs that have been downloaded, ensuring that:
- No article is fetched twice
- Duplicate prevention is logged and tracked
- Tracking data is periodically cleaned up
- Performance remains optimal with large URL datasets

## Core Functions

### Check URL Exists
**Input**: URL string
**Output**: Boolean (true if URL already tracked, false if new)

```javascript
isUrlTracked(url: string): boolean
```

Quickly checks if a URL has been previously downloaded using the tracking database.

### Track New URL
**Input**: URL, domain ID, content metadata
**Output**: Confirmation and entry ID

```javascript
trackUrl(url: string, domain: string, metadata: object): void
```

Adds a new URL to the tracking database after successful download with metadata:
- URL
- Domain ID
- Fetch timestamp
- Content hash (for future cross-validation)
- Source
- Content length

### Get Tracking Statistics
**Input**: Optional domain filter
**Output**: Statistics object

```javascript
getStats(domain?: string): object
```

Returns:
- Total URLs tracked
- URLs by domain
- Duplicates prevented (count)
- Average URLs per domain
- Last cleanup date

### Cleanup Old Entries
**Input**: Days threshold (default: 90)
**Output**: Number of entries removed

```javascript
cleanupOldEntries(daysThreshold: number = 90): number
```

Removes tracking entries older than specified days to keep database lean. Configurable in `config.json`.

### Export Tracking Database
**Input**: Optional format (json, csv)
**Output**: Data export

```javascript
exportDatabase(format: string = 'json'): string
```

Exports the complete URL tracking database for analysis or backup.

## Tracking Database Structure

Located at: `.forecast-tracking/url-tracking.json`

```json
{
  "metadata": {
    "version": "1.0",
    "lastCleanup": "2024-01-01T00:00:00Z",
    "totalUrls": 482,
    "duplicatesPrevented": 58
  },
  "urls": {
    "https://example.com/article-1": {
      "domain": "ai-trends",
      "trackedDate": "2024-01-15T10:30:00Z",
      "contentHash": "abc123def456",
      "source": "news",
      "contentLength": 2048
    },
    "https://example.com/article-2": {
      "domain": "climate-science",
      "trackedDate": "2024-01-15T10:25:00Z",
      "contentHash": "xyz789uvw012",
      "source": "scientific",
      "contentLength": 3256
    }
    // ... more URLs
  }
}
```

## Usage in Research Agent

The research agent workflow:

```
for each search result:
  1. Extract URL from result
  2. Call: isUrlTracked(url)
  3. If true:
     - Skip this article
     - Increment domain duplicate counter
     - Log as skipped
  4. If false:
     - Proceed with content fetch
     - After successful fetch:
       - Call: trackUrl(url, domain, metadata)
       - Save article to markdown file
```

## Performance Considerations

### Optimization Strategies

1. **In-Memory Cache**: Frequently checked URLs are cached to reduce file I/O
2. **Batch Operations**: Multiple URLs can be tracked in single operation
3. **Hash-Based Lookups**: Fast O(1) lookups using URL as key
4. **Lazy Loading**: Full database only loaded when needed

### Scalability

- Efficient for 1000+ URLs
- Database split by domain optional if needed (configure in advanced settings)
- Cleanup runs automatically per schedule (configurable)

## Configuration

From `config/config.json`:

```json
"deduplication": {
  "strategy": "url",
  "trackingFile": ".forecast-tracking/url-tracking.json",
  "cleanupOldEntriesAfterDays": 90,
  "cacheSizeLimit": 10000,
  "enableContentHashVerification": false
}
```

## API Methods

### Initialize Dedup Manager
```javascript
const manager = new DedupManager(configPath);
// Loads existing tracking database or creates new
```

### Check and Track
```javascript
if (!manager.isUrlTracked(url)) {
  manager.trackUrl(url, domain, {
    source: 'news',
    title: 'Article Title',
    contentLength: 2048
  });
  // Proceed with download
} else {
  // Skip - already tracked
  logDuplicate(url);
}
```

### Periodic Maintenance
```javascript
// Monthly cleanup
const removed = manager.cleanupOldEntries(90);
console.log(`Cleaned up ${removed} old entries`);

// Check statistics
const stats = manager.getStats();
console.log(`Tracking ${stats.totalUrls} unique URLs`);
```

## Error Handling

- **Corrupted Database**: Attempts automatic repair, creates backup
- **Missing Tracking File**: Automatically initializes new database
- **File Permission Error**: Reports error and prevents writes
- **Concurrent Access**: Uses file locking to prevent conflicts

## Integration Points

**Used by:**
- Research Agent (primary consumer)

**Interfaces with:**
- Content Fetcher skill (coordination)
- File system (tracking database storage)
- config/config.json (settings)

**Related Commands:**
- `/forecast.status` (displays dedup statistics)
- `/forecast.config` (configure dedup strategy)

---

## Example Execution

```javascript
// Initialize
const dedup = new DedupManager('./config/config.json');

// Check new URL
if (!dedup.isUrlTracked('https://example.com/article')) {
  // Fetch and download article...

  // After successful fetch, track it
  dedup.trackUrl('https://example.com/article', 'ai-trends', {
    source: 'news',
    title: 'AI Breakthrough',
    contentLength: 2547
  });
  console.log('✓ Article tracked');
} else {
  console.log('⊗ URL already tracked - skipping');
}

// Get stats
const stats = dedup.getStats('ai-trends');
console.log(`AI Trends: ${stats.domainUrls} unique articles`);
```

## Benefits

✓ **Prevents Duplicate Work**: No redundant fetches or storage
✓ **Bandwidth Efficiency**: Saves bandwidth by skipping known URLs
✓ **Storage Optimization**: Prevents duplicate file creation
✓ **Tracking Transparency**: Full audit trail of what's been collected
✓ **Easy Recovery**: Can export and analyze deduplication patterns
