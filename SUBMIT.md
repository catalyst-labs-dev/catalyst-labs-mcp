# Submitting Catalyst Labs tools to agent directories

Order: **0 → 1 (GitHub repo) → 2 (MCP Registry) → 3 (Smithery) → 4 (Glama) → 5 (mcp.so) → 6 (cursor.directory)**.
Who does what: **[USER]** = only the owner can do it (login or approval in their own account); **[BOT]** = Grok Bot can do it once GitHub is connected and the user has approved that specific submission.
Nothing here costs money. Skip every paid option ($39 on mcp.so, sponsored slots).

## 0. Preflight [BOT]
- `bash scripts/set-username.sh <github-username>` replaces `GITHUB_USERNAME` everywhere. GitHub usernames are case-sensitive in the Registry namespace, so match the profile exactly.
- `python3 scripts/validate.py` checks the schema. The official CLI check is `mcp-publisher validate servers/career-site-jobs-scraper/server.json`, which passed on 18 Oct 2026 with a sample username.
- Endpoint check: initialize, then `tools/list`, then one `tools/call` against `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper` (passed 18 Oct 2026).

## 1. Create the public GitHub repo
- **[USER]** Approve creating the public repo `<github-username>/catalyst-labs-mcp`.
- **[BOT]** Create it and push the contents of this folder. It holds docs and config only; Actor source code never goes in it. Add the repo description "Catalyst Labs AI-agent tools (remote MCP via Apify)" and the topics `mcp`, `mcp-server`, `apify`, `jobs`, `ats`.

## 2. Official MCP Registry (registry.modelcontextprotocol.io)
Free and with no human review. PulseMCP and other directories copy from it.
1. **[BOT]** Install the CLI (v1.8.1 was verified):
   ```bash
   curl -L "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_linux_amd64.tar.gz" | tar xz mcp-publisher
   ```
2. **[BOT]** Run `./mcp-publisher login github`. It prints a URL and an 8-character code.
3. **[USER]** Open https://github.com/login/device while signed in as the repo owner, enter the code, and click **Authorize**. This takes about 1 minute. The code expires after about 15 minutes.
4. **[BOT]** Run `./mcp-publisher publish servers/career-site-jobs-scraper/server.json`.
5. **[BOT]** Verify: `curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.catalyst-labs-dev/career-site-jobs-scraper"`.
6. **[BOT]** Run `./mcp-publisher logout`. The token sits in `~/.config/mcp-publisher/token.json` on the shared box.
- To update later, bump `version` in server.json and publish again; the same version can't be published twice. For the next tool, repeat steps 4-5 with its own folder (a fresh login is needed only if the token has expired).
- Notes: the Registry is in preview, so data resets are possible. The `Authorization` header is marked optional because Apify answers 401 with OAuth discovery and clients can sign in with Apify instead.

## 3. Smithery (smithery.ai)
Publish by URL. No `smithery.yaml` is needed, since that file is only for servers Smithery builds from source.
1. **[USER]** Sign in at https://smithery.ai with GitHub (this creates a free account) and pick a namespace, ideally the GitHub username.
2. **[USER or BOT in the user's browser session]** Go to https://smithery.ai/new and enter
   `https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper`, with server name `<namespace>/career-site-jobs-scraper`.
   CLI alternative: `npx -y @smithery/cli@4.11.1 mcp publish "https://mcp.apify.com/?tools=catalyst-labs/career-site-jobs-scraper" -n <namespace>/career-site-jobs-scraper` (the CLI needs a Smithery login).
3. **[USER]** Smithery's scan hits Apify's OAuth wall and asks you to authenticate. Sign in with **Apify** and approve, so Smithery can read the tool list. If the publish pauses, continue it with `smithery mcp publish --resume`.
4. **[BOT]** Fill in the display name, description and tags from `servers/career-site-jobs-scraper/listing.json`, add the Store page as the homepage, then run the free official-vendor checklist under Settings → Verification.
- Fallback: if the scan fails, the static "server card" option needs a file on the server's own domain, which we can't host on mcp.apify.com. Report the failure instead.

## 4. Glama (glama.ai)
Glama mainly indexes GitHub repos, and it may treat a config-only repo as a "remote server" listing. Expect some uncertainty here.
1. **[USER]** Sign in at https://glama.ai with GitHub.
2. **[USER or BOT]** Go to https://glama.ai/mcp/servers → **Add MCP Server**, submit `https://github.com/catalyst-labs-dev/catalyst-labs-mcp`, and paste the remote URL where it asks for one.
3. **[USER]** Click **Claim ownership**. `glama.json` lists the maintainer, and a personal repo also verifies through GitHub sign-in.
4. **[BOT]** Edit the listing's description and categories from `listing.json`.

## 5. mcp.so (free tier)
1. **[USER]** Sign in at https://mcp.so (GitHub).
2. **[USER or BOT]** Go to https://mcp.so/submit, choose type **Remote Server** and the **free** (reviewed) speed rather than the $39 option. Use repository URL `https://github.com/catalyst-labs-dev/catalyst-labs-mcp` and name "Career Site Jobs Scraper". If the form asks for server config, paste `serverConfig` from `listing.json`.
3. Free listings are reviewed manually. The wait isn't published; a third-party guide says about 2 weeks. **[BOT]** checks back weekly.

## 6. cursor.directory
1. **[USER]** Sign in at https://cursor.directory with GitHub.
2. **[USER or BOT]** Go to https://cursor.directory/plugins/new → **Auto (GitHub)**, paste `https://github.com/catalyst-labs-dev/catalyst-labs-mcp` and click **Scan repo**. It detects the root `.mcp.json`. Click **Publish Plugin**.
3. An automated security scan runs, and the listing goes live if it's marked safe. Third-party reports mention scans getting stuck, so **[BOT]** checks status after a day.

## Summary of what the user does
- Approve creating the repo (once).
- Enter the GitHub device code (once, about 1 minute).
- Sign in to Smithery, Glama, mcp.so and cursor.directory with GitHub, once each, and approve the Apify OAuth prompt during Smithery's scan.
- Say yes to each listing before it's submitted.
- Total: about 10 to 15 minutes, once. Later tools reuse the same accounts.
