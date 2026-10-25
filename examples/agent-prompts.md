# Example agent prompts

Paste any of these into an agent connected to the tool's MCP URL.

## Agent Web Reader
MCP: `https://mcp.apify.com/?tools=catalyst-labs/agent-web-reader`

- "Search the web for the latest Iowa property-tax changes and give me 3 cited sources."
- "Read https://example.com/report.pdf and summarize the key numbers."

## Document to Markdown
MCP: `https://mcp.apify.com/?tools=catalyst-labs/document-to-markdown`

- "Convert this PDF to markdown and list every table with its page number: <url>"
- "Chunk these 5 contracts for my vector store, 1,000 characters per chunk."

## Google Trends API
MCP: `https://mcp.apify.com/?tools=catalyst-labs/google-trends-api`

- "Is interest in 'heat pump' rising or falling in the US over the last 12 months? Where is it highest?"
- "Compare 'ChatGPT', 'Claude' and 'Gemini' on Google Trends over 90 days and list rising related queries."

## YouTube Transcript API
MCP: `https://mcp.apify.com/?tools=catalyst-labs/youtube-transcript-api`

- "Get transcripts of the 10 newest videos on @lexfridman as LLM-ready text."
- "Which caption languages does this video have? (free listCaptionTracks mode)"

## Podcast Transcript API
MCP: `https://mcp.apify.com/?tools=catalyst-labs/podcast-transcript-api`

- "Transcribe the newest episode of https://podnews.net/rss."
- "Get transcripts for the last 3 episodes of this Apple Podcasts show, publisher transcripts only."

## Website Screenshot & PDF API
MCP: `https://mcp.apify.com/?tools=catalyst-labs/website-screenshot-pdf-api`

- "Take full-page mobile screenshots of these 10 competitor homepages."
- "Save https://example.com/pricing as a PDF."

## Career Site Jobs Scraper
MCP: `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper`

- "Get all open engineering jobs at Stripe, Ramp and Notion paying over $150k, remote only."
- "Which jobs did NVIDIA post or close since my last run?"

## City Council & Public Meeting Transcripts
MCP: `https://mcp.apify.com/?tools=catalyst-labs/city-council-meeting-transcripts`

- "List King County Council meetings from the last 14 days, then transcribe the newest with agenda timestamps."
- "Find every mention of 'bond' in Dallas's latest council meeting, with timestamps."

## Local Decision Check (Iowa)
MCP: `https://mcp.apify.com/?tools=catalyst-labs/local-government-decision-lookup`

Use it as the **verification step** after a meeting or transcript search (Citizen Portal, Red Tape Recordings, Hamlet, or our City Council & Public Meeting Transcripts): the search finds the moment, this tool confirms the official recorded vote from the minutes. 82 Iowa governments (57 counties, 25 cities), 21,097 votes, 0.45% audited error rate (10 of 2,233 sampled). $0.005 per lookup; uncovered places free.

- "A transcript search shows the Des Moines council discussing the E. Locust Streetscape Repair. Verify against the official minutes: did they approve $1,750,000, and what was the tally?"
- "After finding the meeting clip, check this claim: 'Marshalltown voted 4-3 on a data center moratorium.' Return the verdict, who voted no and the minutes link."
- "Fact-check before publishing: 'Story County supervisors unanimously approved the budget.' Supported, contradicted or no record?"
- "Which recorded council decisions mention 1917 Center Street? Link the official minutes."
- "Statewide trends: how often did Iowa councils and boards pass data center items in 2026, and which places split?"
