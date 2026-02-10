# Forecast Configuration Command

Configure research domains, sources, and storage settings for the forecast research plugin.

## Usage

This command helps you manage and view the research configuration without manually editing JSON files.

## Subcommands

### View Configuration
```
/forecast.config view
```
Displays the current research configuration, including:
- Storage directory path
- All configured domains with their settings
- Deduplication settings
- Research parameters

### Add Domain
```
/forecast.config add-domain
```
Prompts for details to add a new research domain:
- Domain ID (identifier like "ai-trends")
- Domain name (display name)
- Keywords (comma-separated list)
- Search mode: "news", "indepth", or "broad"
- Source preferences (news, academic, blogs, forums, scientific, research)
- Update frequency: "daily", "weekly", "monthly"

### Remove Domain
```
/forecast.config remove-domain
```
Lists enabled domains and allows you to disable or remove one.

### Update Domain
```
/forecast.config update-domain
```
Modify settings for an existing domain (keywords, search mode, frequency, etc.)

### Set Storage Directory
```
/forecast.config set-storage <path>
```
Changes the directory where research content is stored.

## Example

```
$ /forecast.config view

Current Forecast Research Configuration
========================================

Storage Directory: ./forecast-research-content

Configured Domains: 3

1. ai-trends
   Name: AI & Machine Learning Trends
   Keywords: artificial intelligence, machine learning, deep learning...
   Search Mode: broad
   Sources: news, academic, blogs, forums
   Update Frequency: daily
   Status: Enabled

2. climate-science
   Name: Climate Science & Sustainability
   Keywords: climate change, renewable energy, carbon emissions...
   Search Mode: news
   Sources: news, scientific
   Update Frequency: daily
   Status: Enabled

3. biotech
   Name: Biotechnology & Healthcare
   Keywords: biotechnology, gene therapy, precision medicine...
   Search Mode: indepth
   Sources: academic, news, research
   Update Frequency: weekly
   Status: Enabled

Deduplication Strategy: url
Tracking File: .forecast-tracking/url-tracking.json
Cleanup old entries after: 90 days

Research Settings:
  Max articles per domain: 20
  Max results per search: 50
  Retry failed requests: 3 times
  Request timeout: 30 seconds

Daily Summary: Generated at 09:00 AM
```

---

**Triggered by:** `/forecast.config`

**Related Commands:** `/forecast.research`, `/forecast.status`
