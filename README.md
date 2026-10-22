# Catalyst Labs tools for AI agents (MCP)

Dependable tools for AI agents, built by **Catalyst Labs** and hosted on [Apify](https://apify.com/catalyst-labs). Each tool is a remote MCP server running on Apify's hosted MCP endpoint. There is nothing to install or run. Connect the URL, sign in with Apify (OAuth) or pass an Apify API token, and your agent gets the tool.

> This repository contains documentation and MCP listing metadata only. The tools themselves run on Apify.

**Website:** https://catalyst-labs-dev.github.io/ · **Benchmarks (our own tests, Oct 18, 2026):** [benchmarks/](benchmarks/README.md) · **Free n8n workflows:** [catalyst-labs-dev/n8n-templates](https://github.com/catalyst-labs-dev/n8n-templates)

## Tools

| Tool | What it does | MCP URL | Store page |
|---|---|---|---|
| **Career Site Jobs Scraper** | Open jobs from company career sites (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Oracle +11 ATS) as normalized JSON | `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper` | [apify.com/catalyst-labs/career-site-jobs-scraper](https://apify.com/catalyst-labs/career-site-jobs-scraper) |
| **Website Screenshot & PDF API** | Full-page screenshots (PNG, JPEG, WebP) and PDFs of any URL, cookie banners removed, desktop or mobile | `https://mcp.apify.com/?tools=catalyst-labs/website-screenshot-pdf-api` | [apify.com/catalyst-labs/website-screenshot-pdf-api](https://apify.com/catalyst-labs/website-screenshot-pdf-api) |
| **YouTube Transcript API** | Transcripts with timestamps and metadata from YouTube videos, Shorts, playlists, channels and search, as text, LLM-ready text, segments, SRT or VTT | `https://mcp.apify.com/?tools=catalyst-labs/youtube-transcript-api` | [apify.com/catalyst-labs/youtube-transcript-api](https://apify.com/catalyst-labs/youtube-transcript-api) |
| **Podcast Transcript API** | Podcast and audio transcripts from RSS feeds, Apple Podcasts links, episode pages or audio URLs: the publisher's own transcript when one exists, Whisper speech-to-text otherwise; text, LLM text, segments, SRT, VTT, Markdown | `https://mcp.apify.com/?tools=catalyst-labs/podcast-transcript-api` | [apify.com/catalyst-labs/podcast-transcript-api](https://apify.com/catalyst-labs/podcast-transcript-api) |

To give one agent several tools at once, join them with commas: `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper,catalyst-labs/website-screenshot-pdf-api,catalyst-labs/youtube-transcript-api,catalyst-labs/podcast-transcript-api`.

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
- **Tested on all 17 platforms.** Ambiguous company names can resolve to a different company with the same name; pass a career-site URL to avoid this. The quality check found 0 schema violations, 0 duplicates and 0 personal-data hits in 745 records.

**How it differs from database-backed job APIs.** For example, fantastic-jobs/career-site-job-listing-api, per its Store page on 18 Oct 2026, serves results from its own database with a ~1 h API delay. It has no company-list input, caps runs at 5,000 jobs, charges $0.012 down to $0.004 per job, and sells expired jobs as a separate $20/month Actor. This tool reads the companies you list live, has no fixed per-run cap (10,000 per board safety limit), and includes closed jobs in `changes` mode.

**Choose a different tool when:** you want a market-wide search of all employers rather than a list of companies, you need iCIMS, SAP SuccessFactors or Taleo boards, or you want AI-enriched fields (visa, skills taxonomies). Database-backed Actors such as the one above cover those cases. Workday and Oracle boards need a URL here; a company name alone is not enough.

**The tool your agent sees:** `catalyst-labs--career-site-jobs-scraper`. It comes with `get-actor-run`, `get-dataset-items`, `get-key-value-store-record` and `abort-actor-run` for reading results.

**Example call:**
```json
{ "companies": ["Stripe", "https://intel.wd1.myworkdayjobs.com/External"], "keywords": ["engineer"], "maxJobsPerCompany": 5 }
```
- `companies` (required): names (`"Stripe"`), careers pages (`"https://www.notion.so/careers"`), job-board URLs (`"https://jobs.ashbyhq.com/ramp"`) or `"platform:slug"` (`"lever:palantir"`). Workday and Oracle need the board URL.
- Optional filters: `keywords`, `excludeKeywords`, `locations`, `departments`, `remoteOnly`, `postedSince` (`"7 days"`), `includeDescription`, `monitorMode` (`off`, `new` or `changes`), and `minSalary` (yearly; hourly/monthly pay converted) with optional `salaryCurrency` and `includeJobsWithoutSalary`.
- Cost caps: `maxJobsPerCompany` (default 100, 0 = all) and `maxJobs` (total).

**Pricing** (pay per result, billed by Apify):

| Event | Free plan | Starter | Scale | Business+ |
|---|---|---|---|---|
| Run start | $0.01 | $0.01 | $0.01 | $0.01 |
| Job returned | $0.008 | $0.007 | $0.005 | $0.0035 |
| Closed job detected (monitoring) | $0.002 | $0.002 | $0.002 | $0.002 |

Companies that aren't found, uncertain matches and errors are never charged. A 5-job test call costs about $0.05. Apify's Free plan includes $5 of monthly credit. See the [Store page](https://apify.com/catalyst-labs/career-site-jobs-scraper) for current prices and the full documentation.

---

## Website Screenshot & PDF API

**What it does:** give it one URL or thousands. It returns full-page or viewport screenshots (PNG, JPEG, WebP) and PDFs, each with a direct `fileUrl`, `width`/`height`, `title` and `status`, after removing cookie banners, loading lazy images and fixing sticky headers in a real Chrome browser.

### When to choose this tool

Choose Website Screenshot & PDF API when you need:
- You need a picture or PDF of a public web page in one call: PNG, JPEG, WebP and PDF from the same run, desktop, laptop, tablet or mobile (iPhone 3x) presets or a custom viewport.
- You need clean captures: cookie banners clicked away on 30+ consent platforms plus 'Accept' text in 30+ languages, lazy images loaded, sticky headers shown once, chat widgets and popups hidden.
- You need PDF control: paper size, margins, landscape, print or screen CSS, or one single long page.
- You need to pay only for delivered files: failed, blocked (bot check), HTTP-error, blank and over-budget URLs are free and come back with errorType and a retry hint.
- You need a hard cost cap: maxTotalChargeUsd stops cleanly and marks the rest SPENDING_LIMIT.
- Tested on Apify cloud (Oct 2026): 28/28 reachable sites on desktop and 27/27 on mobile, 11/11 option scenarios; bot-protected sites failed as BLOCKED and were not charged.

**Choose a different tool when:** You need a sub-second synchronous HTTP endpoint (this runs as batch jobs, typically 5-30 s per page) or reliable access to sites behind enterprise bot protection (WSJ, G2, Zillow, Indeed still blocked residential IPs in our tests).

**The tool your agent sees:** `catalyst-labs--website-screenshot-pdf-api`.

**Example call:**
```json
{ "urls": ["https://example.com"], "formats": ["jpeg"], "fullPage": false }
```
- `urls` (required). Optional: `formats` (`png`, `jpeg`, `webp`, `pdf`), `fastMode` (about 2x faster: skips the lazy-load scroll and takes one full-page shot), `device`, `fullPage`, `captureSelector`, `waitForSelector`, `darkMode`, `pdfFormat`, `pdfLandscape`, `pdfSinglePage`, `cookies`, `headers`, `proxyConfiguration`.

**Pricing** (pay per file, billed by Apify):

| Event | Free plan | Starter | Scale | Business+ |
|---|---|---|---|---|
| Run start | $0.01 | $0.01 | $0.01 | $0.01 |
| Screenshot | $0.008 | $0.007 | $0.006 | $0.005 |
| PDF | $0.012 | $0.012 | $0.012 | $0.012 |

The example call costs $0.018. Failed, blocked and skipped URLs are never charged. See the [Store page](https://apify.com/catalyst-labs/website-screenshot-pdf-api).

---

## YouTube Transcript API

**What it does:** give it videos, Shorts, playlists, channels (`@handle`) or search terms. It returns one JSON record per video with the transcript (paragraph text, LLM-ready text, timestamped segments, SRT, WebVTT) and metadata: title, channel, subscribers, publish date, views, likes, comment count, duration, language and whether the captions are human-made or auto-generated.

### When to choose this tool

Choose YouTube Transcript API when you need:
- You need transcripts from many sources in one call: videos, Shorts, playlists, channels (@handle, /channel/UC..., /shorts and /streams tabs) and YouTube search terms, de-duplicated.
- You need only recent or new uploads: maxVideosPerSource (newest first), publishedAfter/publishedBefore (exact upload dates) and onlyNewVideos, which on a schedule returns only videos published since the last run.
- You need to know what you got: language, isAutoGenerated, originalLanguage, availableLanguages and requestedLanguageFound on every record. Human-made tracks in any English variant (en-GB, en-US) are picked before auto captions; if the requested language is missing, the original language is returned and flagged.
- You need several formats at one price: paragraph text, llmText ([Music], (laughs), ♪ and >> markers removed), timestamped segments, SRT and WebVTT, plus metadata (subscribers, views, likes, comment count, publish date, duration, tags).
- You need to pay only for delivered transcripts: no captions, captions not ready yet (uploads under 24 h), deleted, private, live, invalid, blocked and over-budget videos come back as free rows with errorType, retryable and hint. maxTotalChargeUsd stops cleanly as SUCCEEDED.
- Accuracy check (Apify cloud, 18 Oct 2026): transcripts matched YouTube's own caption tracks word for word and timestamp for timestamp on 18 videos (2-hour podcasts, Shorts, Spanish, music, AI-voice channels) and 28/28 tracks in the head-to-head. Scale test: 299 of 300 videos from 6 large channels delivered; the miss had no captions.
- Head-to-head (our test, Apify cloud, 18 Oct 2026, 12 identical cases against the 5 most-used YouTube transcript Actors in the Store plus codepoetry/youtube-transcript-ai-scraper): 12/12 expected outcomes and 0 charged failures; the five most-used tools scored 7-9/12 and 4 of them charged for at least one failure. Fastest whole-batch run (30 videos in 39 s).

**How it compares.** Per their Apify Store pages on 18 Oct 2026: pintostudio/youtube-transcript-scraper charges $0.010 per dataset row and takes one video per run; starvibe/youtube-video-transcript charges $0.005 per dataset row, including rows for errors. This tool charges only its 'transcript' event ($0.008 Free, $0.005 Gold+), so failed videos and empty runs cost nothing.

**Choose a different tool when:** You need transcripts of videos that have no captions at all (speech-to-text; codepoetry/youtube-transcript-ai-scraper offers AI transcription per minute), the text of comments, age-restricted or members-only videos, or machine translation into a language the video has no captions in. For the lowest possible per-row price on captioned videos, several Store Actors charge $0.001-0.003.

**The tool your agent sees:** `catalyst-labs--youtube-transcript-api`.

**Example call:**
```json
{ "videos": ["https://www.youtube.com/watch?v=jNQXAC9IVRw"] }
```
- `videos` (required unless `searchQueries` is set): video, Short, playlist or channel URLs, `@handles` or video IDs. Optional: `searchQueries`, `searchSort`, `maxVideosPerSource` (default 50), `maxVideos`, `publishedAfter` / `publishedBefore` (`"30 days"` or a date), `onlyNewVideos`, `languages`, `captionType`, `outputFormats` (`text`, `llm`, `segments`, `srt`, `vtt`, `markdown`: a markdown field per video plus one combined TRANSCRIPTS.md file), `mode` (`transcripts` or the free `listCaptionTracks`, which lists each video's caption languages and track types without charging), `includeDescription`.

**Pricing** (pay per delivered transcript, billed by Apify; no run fee):

| Event | Free plan | Starter | Scale | Business+ |
|---|---|---|---|---|
| Transcript delivered (all formats + metadata) | $0.008 | $0.007 | $0.006 | $0.005 |

The example call costs $0.008. Videos without captions, unavailable, invalid, filtered and skipped videos are never charged. See the [Store page](https://apify.com/catalyst-labs/youtube-transcript-api).

## Podcast Transcript API

**What it does:** give it RSS feeds, Apple Podcasts show or episode links, episode pages or direct audio/video URLs. It returns one JSON record per episode with the transcript (text, LLM-ready text, timestamped segments, SRT, WebVTT, Markdown) and metadata: show, episode, publish date, duration, chapters, language, and speaker labels when the publisher provides them. It uses the show's own published transcript first and runs Whisper speech-to-text only when there is none.

### When to choose this tool

Choose Podcast Transcript API when you need:
- You want the cheapest correct transcript: the publisher's own transcript (Podcasting 2.0 <podcast:transcript>, SRT/VTT/JSON/HTML) is used first at a flat $0.01 per episode; speech-to-text runs only when none exists.
- You have mixed inputs: RSS feeds, Apple Podcasts show and episode (?i=) links, episode pages (feed found automatically) and direct mp3/m4a/video URLs in one call.
- You need agent-ready output: text, llmText, timestamped segments, SRT, VTT, Markdown plus a combined TRANSCRIPTS.md, chapters and speaker labels.
- You need to monitor shows: onlyNewEpisodes with a monitorId returns only episodes published since the last run (cloud-tested 20 Oct 2026: second run returned 0 episodes, $0).
- You need hard cost control: maxTotalChargeUsd, maxAudioMinutes and maxMinutesPerEpisode (skip or truncate) stop before spending; over-budget, unreachable, no-speech and invalid inputs come back as free rows with errorType, retryable and hint.
- Accuracy check (20 Oct 2026, against publisher transcripts): English word error rate about 2-3%, Spanish about 10%, German about 17%; long episodes are cut at pauses into ~2-minute chunks so no sentences are dropped.
- Head-to-head (our test, Apify cloud, 20 Oct 2026, identical inputs against 4 podcast transcript Actors in the Store): 10/10 checks; the others scored 2-6/10.

**How it compares.** Per their Apify Store pages on 20 Oct 2026: steadyfetch/media-transcriber charges $0.006 per audio minute and always transcribes, even when the show publishes a free transcript; spokentext/spotify-podcast-transcript charges $0.003 per minute. This tool charges $0.01 per episode when a publisher transcript exists and $0.009-0.006 per minute otherwise.

**Choose a different tool when:** You need Spotify-exclusive episodes, the lowest possible per-minute speech-to-text price (some Store Actors charge $0.003-0.006/min), or speaker diarization of speech-to-text audio (speaker labels come only from publisher transcripts).

**The tool your agent sees:** `catalyst-labs--podcast-transcript-api`.

**Example call:**
```json
{ "sources": ["https://podnews.net/rss"], "maxEpisodesPerFeed": 1 }
```
- `sources` (required): RSS feeds, Apple Podcasts links, episode pages or audio/video URLs. Optional: `maxEpisodesPerFeed`, `transcriptMode` (`auto`, `publisherOnly`, `speechToText`), `maxAudioMinutes`, `maxMinutesPerEpisode`, `truncateLongEpisodes`, `onlyNewEpisodes` + `monitorId`, `publishedAfter`, `titleFilter`, `language`, `vocabulary`, `outputFormats` (`text`, `segments`, `llmText`, `srt`, `vtt`, `markdown`), `includeChapters`.

**Pricing** (pay per delivered transcript, billed by Apify; no run fee):

| Event | Free plan | Starter | Scale | Business+ |
|---|---|---|---|---|
| Episode transcript from the publisher (any length) | $0.01 | $0.01 | $0.01 | $0.01 |
| Speech-to-text audio minute | $0.009 | $0.008 | $0.007 | $0.006 |

The example call costs $0.01. Failed, silent, unreachable, over-budget and skipped episodes are never charged. See the [Store page](https://apify.com/catalyst-labs/podcast-transcript-api).

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
