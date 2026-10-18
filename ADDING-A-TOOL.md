# Adding a new Catalyst Labs tool

1. Publish the Actor on Apify, then confirm it responds at `https://mcp.apify.com/?tools=catalyst-labs/<actor-name>` (see SUBMIT.md, step 0).
2. Copy `servers/career-site-jobs-scraper/` to `servers/<actor-name>/` and edit:
   - `server.json`: `name` (`io.github.<user>/<actor-name>`), `title`, `description` (100 characters max), `websiteUrl`, `repository.subfolder`, `icons`, `remotes[0].url`. Start `version` at `1.0.0` and bump it for every re-publish.
   - `listing.json`: the shared copy every directory uses.
3. Add the tool to `.mcp.json`, to the README's Tools table and connection examples, and to `examples/`.
4. Run `python3 scripts/validate.py <github-username>`, then follow SUBMIT.md for the new server only.
