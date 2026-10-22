import { NextResponse } from "next/server";
import { ITEMS, filterItems } from "@/lib/reading";

// Stateless JSON-RPC MCP endpoint over the same authored reading list the page shows.

type RpcRequest = { id?: number | string | null; method?: string; params?: { name?: string; arguments?: Record<string, unknown> } };

const TOOLS = [
  { name: "get_all", description: "List every item on the reading shelf", inputSchema: { type: "object", properties: {} } },
  { name: "get_by_id", description: "Get one reading item by id", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "search", description: "Search titles, summaries and categories", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
];

class RpcError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

function callTool(name: string | undefined, args: Record<string, unknown> = {}) {
  switch (name) {
    case "get_all":
      return { items: ITEMS };
    case "get_by_id": {
      const item = ITEMS.find((entry) => entry.id === args.id);
      if (!item) throw new RpcError(-32602, `No reading item with id ${String(args.id)}`);
      return { item };
    }
    case "search":
      return { items: filterItems(ITEMS, "All", typeof args.query === "string" ? args.query : "") };
    default:
      throw new RpcError(-32602, `Unknown tool: ${String(name)}`);
  }
}

export async function POST(request: Request) {
  let id: RpcRequest["id"] = null;
  try {
    const body = (await request.json()) as RpcRequest;
    id = body.id ?? null;
    let result: unknown;
    switch (body.method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "Reading List", version: "1.0.0" },
        };
        break;
      case "tools/list":
        result = { tools: TOOLS };
        break;
      case "tools/call":
        result = callTool(body.params?.name, body.params?.arguments);
        break;
      default:
        throw new RpcError(-32601, `Unknown method: ${String(body.method)}`);
    }
    return NextResponse.json({ jsonrpc: "2.0", id, result });
  } catch (error) {
    const code = error instanceof RpcError ? error.code : -32700;
    const message = error instanceof RpcError ? error.message : "Parse error";
    return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } }, { status: 400 });
  }
}
