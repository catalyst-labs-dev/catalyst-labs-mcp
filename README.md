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
