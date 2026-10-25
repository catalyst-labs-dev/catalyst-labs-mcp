import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const schemaDir = join(dirname(fileURLToPath(import.meta.url)), "..", "schemas");

export const TOOLS: { actor: string; name: string; description: string }[] = [
  { actor: "agent-web-reader", name: "agent_web_reader", description: "Search the web and/or read URLs (HTML, PDF) into clean, LLM-ready text or markdown. Pass `query` to search, `urls` to read specific pages." },
  { actor: "document-to-markdown", name: "document_to_markdown", description: "Convert documents (PDF, DOCX, PPTX, XLSX, HTML, etc.) at URLs into markdown, optionally chunked for RAG." },
  { actor: "google-trends-api", name: "google_trends", description: "Google Trends data for keywords: interest over time, by region, related queries and topics." },
  { actor: "youtube-transcript-api", name: "youtube_transcript", description: "Fetch YouTube video transcripts/captions (videos, channels, playlists or search) with optional metadata." },
  { actor: "podcast-transcript-api", name: "podcast_transcript", description: "Transcripts for podcast episodes from RSS feeds, Apple Podcasts or episode URLs." },
  { actor: "website-screenshot-pdf-api", name: "website_screenshot_pdf", description: "Capture website screenshots (PNG/JPEG/WebP) or PDFs; returns download URLs." },
  { actor: "career-site-jobs-scraper", name: "career_site_jobs", description: "Scrape open jobs directly from company career sites (Greenhouse, Lever, Ashby, Workday and more) with keyword, location, remote and salary filters." },
];

export function inputSchema(actor: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(schemaDir, `${actor}.json`), "utf8"));
}

export async function runActor(actor: string, input: unknown, token: string, fetchImpl: typeof fetch = fetch): Promise<unknown> {
  const timeout = Number(process.env.APIFY_TIMEOUT_SECS ?? 300);
  const url = `https://api.apify.com/v2/acts/catalyst-labs~${actor}/run-sync-get-dataset-items?timeout=${timeout}&clean=true`;
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "User-Agent": "catalyst-labs-mcp" },
    body: JSON.stringify(input ?? {}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Apify ${actor} failed (HTTP ${res.status}): ${text.slice(0, 500)}`);
  return JSON.parse(text);
}
