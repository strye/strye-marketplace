# Forecast Status Command

Check the status of research activities and content collection progress.

## Usage

```
/forecast.status
```

Displays comprehensive status information about the research system:

## Information Provided

### Overall System Status
- Last research session timestamp
- Next scheduled research time
- Total articles collected across all domains
- Total storage used
- Deduplication tracking status

### Per-Domain Status
For each domain, displays:
- Domain name and ID
- Number of articles collected
- Storage used by domain
- Last update timestamp
- Update frequency
- Current status (active, paused, error)

### Deduplication Status
- Total unique URLs tracked
- Number of duplicates prevented
- Oldest tracked URL
- Database cleanup date

### Recent Activity
- Last 5 articles added (title, domain, date)
- Any failed research attempts with error details
- Warnings (e.g., storage near limit)

## Example Output

```
Forecast Research System Status
=================================

System Status: ACTIVE
Last Research: 2024-01-15 10:45 AM
Next Research: Tomorrow 09:00 AM

Overall Statistics:
  Total Articles: 487
  Total Storage: 245 MB
  Unique URLs Tracked: 482
  Duplicates Prevented: 58

Domain Status:
───────────────────────────────────────

1. ai-trends ✓ ACTIVE
   Articles: 187
   Storage: 95 MB
   Last Update: 2024-01-15 10:45 AM
   Frequency: daily

2. climate-science ✓ ACTIVE
   Articles: 142
   Storage: 78 MB
   Last Update: 2024-01-15 10:40 AM
   Frequency: daily

3. biotech ✓ ACTIVE
   Articles: 158
   Storage: 72 MB
   Last Update: 2024-01-12 10:30 AM
   Frequency: weekly (next: 2024-01-22)

Deduplication Status:
───────────────────────────────────────
Strategy: URL-based tracking
Total URLs in system: 482
Duplicates prevented: 58
Last cleanup: 2024-01-01
Next cleanup: 2024-04-01 (entries older than 90 days)

Recent Activity:
───────────────────────────────────────
✓ "Latest Breakthroughs in LLM Reasoning" - ai-trends (5 min ago)
✓ "Global Carbon Emissions Report 2024" - climate-science (12 min ago)
✓ "New Gene Therapy Shows Promise in Trials" - biotech (2 days ago)

No errors detected. All systems operational.
```

---

**Triggered by:** `/forecast.status`

**Related Commands:** `/forecast.research`, `/forecast.config`
