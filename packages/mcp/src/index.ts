#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { TOOLS, inputSchema, runActor } from "./tools.js";

const server = new Server({ name: "catalyst-labs-mcp", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: inputSchema(t.actor) as any })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find((t) => t.name === req.params.name);
  if (!tool) return { isError: true, content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }] };
  const token = process.env.APIFY_TOKEN;
  if (!token) return { isError: true, content: [{ type: "text", text: "APIFY_TOKEN is not set. Get one at https://console.apify.com/settings/integrations" }] };
  try {
    const items = await runActor(tool.actor, req.params.arguments, token);
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
  } catch (e) {
    return { isError: true, content: [{ type: "text", text: String((e as Error).message) }] };
  }
});

await server.connect(new StdioServerTransport());
