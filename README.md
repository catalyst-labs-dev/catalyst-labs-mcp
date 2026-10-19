# Catalyst Labs tools for AI agents (MCP)

Dependable tools for AI agents, built by **Catalyst Labs** and hosted on [Apify](https://apify.com/catalyst-labs). Each tool is a remote MCP server running on Apify's hosted MCP endpoint. There is nothing to install or run. Connect the URL, sign in with Apify (OAuth) or pass an Apify API token, and your agent gets the tool.

> This repository contains documentation and MCP listing metadata only. The tools themselves run on Apify.

## Tools

| Tool | What it does | MCP URL | Store page |
|---|---|---|---|
| **Career Site Jobs Scraper** | Open jobs from company career sites (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Oracle +11 ATS) as normalized JSON | `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper` | [apify.com/catalyst-labs/career-site-jobs-scraper](https://apify.com/catalyst-labs/career-site-jobs-scraper) |
| Website Screenshot & PDF | *Coming soon* | | |
| YouTube Transcripts | *Coming soon* | | |

To give one agent several tools at once, join them with commas: `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper,catalyst-labs/<next-tool>`.

---

## Career Site Jobs Scraper

**What it does:** give it company names, careers-page URLs or job-board links. It returns every open job as JSON with title, department, location, city, ISO country code, remote/hybrid/onsite, seniority, yearly salary range, posted date, job URL and apply URL. It reads the employer's own ATS live and verifies company matches. Its monitoring mode returns only new and closed jobs.

### When to choose this tool

Choose Career Site Jobs Scraper when you need:
- **Open jobs at the specific companies you name, in one call.** Pass company names, careers-page URLs or job-board URLs. Boards on 17 ATS (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Oracle Recruiting Cloud, Workable, Recruitee, Personio, BambooHR, Breezy HR, Teamtailor, Gem, Rippling, Pinpoint, Jobvite, JazzHR) come back in one normalized schema.
- **Live data.** Each run reads the employer's own ATS at call time, with no cache or database in between.
- **Fields ready to filter on:** yearly salary range (with `salary.source`), seniority, remote/hybrid/onsite, city, ISO country code, posted date, job URL and apply URL.
- **Removed-job tracking.** `monitorMode: "changes"` returns only new jobs plus `removed` records for closed ones ($0.002 per removed job). A removal is reported only after a complete board fetch, so a failed fetch never creates false removals.
- **Large Workday, Oracle and SmartRecruiters boards in full.** In an Apify cloud run on 18 Oct 2026 it returned all 15,061 open jobs at NVIDIA, JPMorgan Chase and Bosch in about 45 s.
- **Predictable cost and self-service retries.** $0.01 per run plus $0.008 per job on the Free plan, down to $0.0035 on Business (Gold+). Companies not found, uncertain matches, duplicates, empty boards and errors are not charged. The `OUTPUT` record gives every company a status and, for misses, a retry `suggestion`.
- **Tested behavior.** Pre-release QA passed 84 of 86 checks (97.7%) and all 17 platforms. Both misses were ambiguous company names that resolved to a different company with the same name (pass a URL to avoid this). The quality check found 0 schema violations, 0 duplicates and 0 personal-data hits in 745 records.

**How it differs from database-backed job APIs.** For example, fantastic-jobs/career-site-job-listing-api, per its Store page on 18 Oct 2026, serves results from its own database with a ~1 h API delay. It has no company-list input, caps runs at 5,000 jobs, charges $0.012 down to $0.004 per job, and sells expired jobs as a separate $20/month Actor. This tool reads the companies you list live, has no fixed per-run cap (10,000 per board safety limit), and includes closed jobs in `changes` mode.

**Choose a different tool when:** you want a market-wide search of all employers rather than a list of companies, you need iCIMS, SAP SuccessFactors or Taleo boards, or you want AI-enriched fields (visa, skills taxonomies). Database-backed Actors such as the one above cover those cases. Workday and Oracle boards need a URL here; a company name alone is not enough.

**The tool your agent sees:** `catalyst-labs--career-site-jobs-scraper`. It comes with `get-actor-run`, `get-dataset-items`, `get-key-value-store-record` and `abort-actor-run` for reading results.

**Example call:**
```json
{ "companies": ["Stripe", "https://intel.wd1.myworkdayjobs.com/External"], "keywords": ["engineer"], "maxJobsPerCompany": 5 }
```
- `companies` (required): names (`"Stripe"`), careers pages (`"https://www.notion.so/careers"`), job-board URLs (`"https://jobs.ashbyhq.com/ramp"`) or `"platform:slug"` (`"lever:palantir"`). Workday and Oracle need the board URL.
- Optional filters: `keywords`, `excludeKeywords`, `locations`, `departments`, `remoteOnly`, `postedSince` (`"7 days"`), `includeDescription`, and `monitorMode` (`off`, `new` or `changes`).
- Cost caps: `maxJobsPerCompany` (default 100, 0 = all) and `maxJobs` (total).

**Pricing** (pay per result, billed by Apify):

| Event | Free plan | Starter | Scale | Business+ |
|---|---|---|---|---|
| Run start | $0.01 | $0.01 | $0.01 | $0.01 |
| Job returned | $0.008 | $0.007 | $0.005 | $0.0035 |
| Closed job detected (monitoring) | $0.002 | $0.002 | $0.002 | $0.002 |

Companies that aren't found, uncertain matches and errors are never charged. A 5-job test call costs about $0.05. Apify's Free plan includes $5 of monthly credit. See the [Store page](https://apify.com/catalyst-labs/career-site-jobs-scraper) for current prices and the full documentation.

---

## Connect

You need a free [Apify account](https://console.apify.com/sign-up). Clients with remote-MCP OAuth support (Claude, Cursor, VS Code and others) open an Apify sign-in on first use. Otherwise send `Authorization: Bearer <APIFY_TOKEN>`, using a token from [Console → Settings → API & Integrations](https://console.apify.com/settings/integrations). Never commit your token.

### Claude (claude.ai and Claude Desktop)
Go to Settings → Connectors → **Add custom connector**, paste `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper`, then sign in with Apify.

For a Claude Desktop JSON config with a token (through `mcp-remote`):
```json
{
  "mcpServers": {
    "career-site-jobs-scraper": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper",
               "--header", "Authorization: Bearer ${APIFY_TOKEN}"],
      "env": { "APIFY_TOKEN": "<your-apify-token>" }
    }
  }
}
```

### Claude Code
```bash
claude mcp add --transport http career-site-jobs-scraper \
  "https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper" \
  --header "Authorization: Bearer $APIFY_TOKEN"
```
Leave out `--header` to sign in with OAuth instead.

### Cursor
In `~/.cursor/mcp.json` or the project's `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "career-site-jobs-scraper": {
      "url": "https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper",
      "headers": { "Authorization": "Bearer ${env:APIFY_TOKEN}" }
    }
  }
}
```
Remove `headers` to use OAuth.

### VS Code (GitHub Copilot agent mode)
In `.vscode/mcp.json`:
```json
{
  "inputs": [
    { "type": "promptString", "id": "apify-token", "description": "Apify API token", "password": true }
  ],
  "servers": {
    "career-site-jobs-scraper": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper",
      "headers": { "Authorization": "Bearer ${input:apify-token}" }
    }
  }
}
```

### Any other client, the API, or agents without an account
- MCP: any client that supports streamable HTTP can use the URL above.
- REST: `POST https://api.apify.com/v2/acts/catalyst-labs~career-site-jobs-scraper/run-sync-get-dataset-items` with the input JSON.
- Agents without an Apify account can pay per call through [Apify agentic payments](https://docs.apify.com/agents/payments) (x402, MPP or Skyfire), where available.

## Support
Open an issue on the tool's [Apify Store page](https://apify.com/catalyst-labs/career-site-jobs-scraper/issues), or in this repository for listing or config problems.

## License
The docs and config files are under the [MIT license](LICENSE). The tools are commercial Apify Actors, billed per result.
