import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 7, method: "tools/list" });
    expect((await res.json()).id).toBe(7);
  });

  it("get_all returns the real reading list", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_all" } });
    const { result } = await res.json();
    expect(result.items.map((i: { id: string }) => i.id)).toEqual(["ddia", "working", "shape", "small"]);
  });

  it("search filters by title, summary or category", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "search", arguments: { query: "essay" } } });
    const { result } = await res.json();
    expect(result.items.map((i: { id: string }) => i.id)).toEqual(["working", "small"]);
  });

  it("get_by_id returns an error for an unknown id", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_by_id", arguments: { id: "nope" } } });
    const body = await res.json();
    expect(body.error.code).toBe(-32602);
    expect(body.id).toBe(3);
  });

  it("rejects an unknown tool instead of pretending to call it", async () => {
    const res = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "delete_all" } });
    expect((await res.json()).error.code).toBe(-32602);
  });
});
