# Catalyst Labs benchmarks

These are **our own tests**, run by Catalyst Labs on **Oct 18, 2026** from Apify's US cloud. They aren't independent audits.

- **Every tool got the same inputs and settings, and ran once.** Websites and YouTube can change between runs, so a re-run can differ.
- **Competitor tools are anonymized.** YouTube tools are labelled Tool A–F and screenshot tools Tool 1–5. We publish results, not reputations. The tools were chosen as the most-used Actors in each category on the Apify Store at test time.
- **Prices change.** Our prices are on each tool's Store page.

| Benchmark | Tool tested |
|---|---|
| [YouTube transcripts: 12-case head-to-head](#youtube-transcript-api-12-case-head-to-head) | [YouTube Transcript API](https://apify.com/catalyst-labs/youtube-transcript-api) |
| [Website screenshots: cookie walls, clean output, billing](#website-screenshot--pdf-api-cookie-walls-clean-output-billing) | [Website Screenshot & PDF API](https://apify.com/catalyst-labs/website-screenshot-pdf-api) |

---

## YouTube Transcript API: 12-case head-to-head

**Tools:**
- **Catalyst Labs YouTube Transcript API**
- **Tools A–E:** the five most-used YouTube transcript Actors on the Apify Store, by 30-day users
- **Tool F:** a smaller tool, added because it offers AI transcription for videos without captions

**Method:**
- 12 identical inputs, with the caption language left at the default `en`.
- **Reference:** every caption track was downloaded independently with yt-dlp. "Complete" means the transcript's word count exactly matches one of YouTube's own tracks.

**The 12 cases:**
1. A 57-minute news episode with only en-US human captions
2. A Short
3. A German video with auto captions only, requested in English
4. A human-captioned music video
5. An auto-captioned talk
6. An upload about 1 hour old
7. A music video with several English tracks
8. A video with captions disabled
9. A 46-minute faceless AI-voice story
10. An invalid video ID
11. A channel (newest 10)
12. A playlist (first 10)

**Key:** ✅ expected result · ❌ failed · 💲 the failure was charged

| Case | Catalyst Labs | Tool A | Tool B | Tool C | Tool D | Tool E | Tool F |
|---|---|---|---|---|---|---|---|
| Long, en-US human only | ✅ | ✅ | ❌ | ✅ | ❌ 💲 | ✅ | ✅ |
| Short | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| German, asked for "en" | ✅ (original German, flagged) | ✅ | ❌ | ❌ (run crashed) | ❌ 💲 | ✅ | ✅ (machine translation, flagged) |
| Human captions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto captions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1-hour-old upload | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Music | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Captions disabled* | free `NO_CAPTIONS` + hint | ❌ 💲 | ❌ | ❌ 💲 (empty result) | ❌ 💲 | ❌ 💲 | ✅ (AI transcript) |
| Faceless 46-min | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Invalid ID* | free `VIDEO_UNAVAILABLE` | ❌ 💲 | ❌ | ❌ (run crashed) | ❌ 💲 | ❌ 💲 | free error |
| Channel, newest 10 | ✅ 10/10 | ✅ | ✅ | ❌ not supported | ✅ | ❌ silently ignored | ✅ |
| Playlist, first 10 | ✅ 10/10 | ❌ input rejected | ❌ | ❌ not supported | ✅ | ❌ silently ignored | ✅ |
| **Expected outcomes (of 12)** | **12** | 9 | 9 | 7 | 8 | 8 | **12** |
| **Failures charged** | **0** | 2 | 0 | 1 | 4 | 2 | 0 |
| **Complete vs YouTube's track** | **28/28** | 17/18 | 15/16 | 7/7 | 26/26 | 8/8 | 27/27 |

\*For caption-less and invalid videos, the expected outcome is a clear, uncharged failure. Tool F's AI transcription of the caption-less video also counts as a success.

**Summary:**
- **12/12.** Tools A–E scored 7–9. Tool F also scored 12/12.
- **Zero failures charged.** Four of the five most-used tools charged for at least one failure: error rows, an empty result, a caption-less video.
- **One input list for everything:** videos, Shorts, a channel (exact newest N), a playlist and invalid input, in one run. Three of Tools A–E couldn't take the playlist.
- **Fresh data.** One competing tool served transcripts from a cache up to 18 days old by default. Ours fetches live.
- **What we don't do yet:** videos with no captions at all get a free `NO_CAPTIONS` row, not a transcript. Tool F's AI transcription handled that case. Machine translation to another language is best-effort.

### Accuracy spot check (Catalyst Labs only)
**Fidelity:**
- 25 of 25 caption tracks across 18 videos matched YouTube's track exactly, every word and every segment start time. The reference was an independent parser (the `youtube-transcript-api` Python library) reading YouTube's XML caption format.
- The videos included a 2-hour podcast (manual and auto tracks), a 1h42m AI-voice narration, Shorts, Spanish, music and talks.
- No HTML entities were left over, no timestamps were out of order or negative, and nothing was truncated.

**Track selection:** when a video had both human and auto captions, the human track was returned. The auto/human flag was correct on all 30 delivered records.

**Quality of YouTube's own auto captions,** measured against the creator's human captions on 6 talks:
- About 95% word accuracy on clear speech: average WER 5.2% after normalization, 6.2% raw.
- Weaker on names and jargon.
- Unreliable on sung lyrics: one music video measured 36.5% normalized WER.

That's a property of YouTube's speech recognition, so every caption-based tool inherits it.

---

## Website Screenshot & PDF API: cookie walls, clean output, billing

**Tools:**
- **Catalyst Labs Website Screenshot & PDF API**
- **Tools 1–5:** five popular screenshot Actors on the Apify Store, including the most-used one

**Method:**
- 12 URLs, desktop 1280×800, full page, PNG, `waitUntil: load`, 2 GB memory on every run.
- Every tool's cookie-banner option was switched on where it had one. Lazy-load scrolling was switched on where offered.
- Everything else was left at defaults, including proxies. Some tools use a proxy by default; ours doesn't.
- We checked every output image by eye.

**Scope of this summary:** it covers cookie walls, output cleanliness, rendering, failure handling and billing. In other parts of the same test, other tools did better than ours, for example on some very long pages and some scroll-triggered animations. We're working on those and will re-test.

| Check | Catalyst Labs | Tool 1 | Tool 2 | Tool 3 | Tool 4 | Tool 5 |
|---|---|---|---|---|---|---|
| EU cookie wall removed (spiegel.de, lemonde.fr) | **2/2** | 2/2 | 0/2 | 0/2 | 0/2 | 0/2 |
| Spiegel's lazy-loaded images present | **yes** | mostly blank | n/a (cookie wall only) | blank | blank | n/a (cookie wall only) |
| Chat launcher or repeated sticky header in output | **none** | none | none | none (but a menu frozen open) | none | 3 pages |
| Colour emoji | **yes** | n/a (modal covered page) | no | yes | n/a (timeout) | no |
| Timeouts on reachable pages, default settings | **0** | 2 | 0 | 1 | 3 | 0 |
| Charged for captcha / "Access denied" pages | **no** | yes (2) | no | yes (2) | no | compute-only pricing |
| Non-existent domain | **`DNS_ERROR` + hint, not charged** | error (reported as a proxy error) | `dns_error` | error | error | silently missing from output |

**What the images show:**
1. [`images/screenshot-1-eu-cookie-wall.png`](images/screenshot-1-eu-cookie-wall.png) shows spiegel.de's consent wall. Ours and Tool 1 removed it. Only ours also loaded the lazy images below the first screen.
2. [`images/screenshot-2-chat-widget-sticky-header.png`](images/screenshot-2-chat-widget-sticky-header.png) shows the bottom of intercom.com. Tool 5 shows the chat launcher and a repeated sticky header. Ours is clean.
3. [`images/screenshot-3-emoji-popups.png`](images/screenshot-3-emoji-popups.png) shows getemoji.com. Ours renders colour emoji. Tool 1 captured a popup modal, cut at 800 px. Tools 2 and 5 render black-and-white glyphs.

**Billing in our tool:** captcha, bot-wall, error and blank pages are reported with an error type (`BLOCKED`, `DNS_ERROR` and others) and a fix hint, and **are never charged**. You pay only for delivered files.

---
Questions about the method, or want us to test a case? [Open an issue](https://github.com/catalyst-labs-dev/catalyst-labs-mcp/issues).
