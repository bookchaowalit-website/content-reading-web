// The MCP tools /api/mcp serves; the /mcp page documents the same list.

export const TOOLS = [
  { name: "get_all", description: "List every item on the reading shelf", inputSchema: { type: "object", properties: {} } },
  { name: "get_by_id", description: "Get one reading item by id", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "search", description: "Search titles, summaries and categories", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];
