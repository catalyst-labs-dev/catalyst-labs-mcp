# catalyst-labs-mcp

A self-run (stdio) MCP server for the Catalyst Labs agent tools. You run it on your own machine with your own [Apify token](https://console.apify.com/settings/integrations). Each call runs the matching `catalyst-labs/*` Apify Actor and returns its results.

| Tool | What it does |
|---|---|
| `agent_web_reader` | Search the web and/or read URLs (HTML, PDF) as clean markdown |
| `document_to_markdown` | PDF, DOCX, PPTX, XLSX, HTML → markdown, optional RAG chunks |
| `google_trends` | Interest over time, by region, related queries/topics |
| `youtube_transcript` | Transcripts for videos, channels, playlists or searches |
| `podcast_transcript` | Episode transcripts from RSS, Apple Podcasts or episode URLs |
| `website_screenshot_pdf` | Screenshots (PNG/JPEG/WebP) or PDFs of web pages |
| `career_site_jobs` | Open jobs straight from Greenhouse, Lever, Ashby, Workday and more |

Usage is billed by Apify to your own account at each Actor's normal rate.

## Install

Requires Node 18+.

**Claude Desktop** (`claude_desktop_config.json`), **Cursor** (`~/.cursor/mcp.json`) and most other clients:

```json
{
  "mcpServers": {
    "catalyst-labs": {
      "command": "npx",
      "args": ["-y", "catalyst-labs-mcp"],
      "env": { "APIFY_TOKEN": "apify_api_..." }
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add catalyst-labs -e APIFY_TOKEN=apify_api_... -- npx -y catalyst-labs-mcp
```

Optional: `APIFY_TIMEOUT_SECS` (default 300) caps how long a call waits for its run.

## Develop

```bash
npm install && npm test
```
