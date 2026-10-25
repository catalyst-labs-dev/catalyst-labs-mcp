import { test } from "node:test";
import assert from "node:assert";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { TOOLS, runActor } from "../dist/tools.js";

test("tools/list exposes exactly the 7 universal tools", async () => {
  const c = new Client({ name: "t", version: "1" });
  await c.connect(new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: { PATH: process.env.PATH } }));
  const { tools } = await c.listTools();
  assert.equal(tools.length, 7);
  for (const t of tools) assert.equal(t.inputSchema.type, "object");
  assert.ok(!tools.some((t) => /council|local|iowa/i.test(t.name)));
  const r = await c.callTool({ name: "agent_web_reader", arguments: {} });
  assert.ok(r.isError && /APIFY_TOKEN/.test(r.content[0].text));
  await c.close();
});

test("runActor posts to run-sync-get-dataset-items with bearer token", async () => {
  let seen;
  const fake = async (url, opts) => { seen = { url, opts }; return new Response('[{"ok":1}]', { status: 200 }); };
  const out = await runActor("agent-web-reader", { urls: ["https://example.com"] }, "tok", fake);
  assert.deepEqual(out, [{ ok: 1 }]);
  assert.match(seen.url, /acts\/catalyst-labs~agent-web-reader\/run-sync-get-dataset-items/);
  assert.equal(seen.opts.headers.Authorization, "Bearer tok");
});

test("runActor surfaces HTTP errors", async () => {
  const fake = async () => new Response("bad", { status: 401 });
  await assert.rejects(runActor("x", {}, "t", fake), /HTTP 401/);
});
