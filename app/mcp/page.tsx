import type { Metadata } from "next";
import { McpDocs } from "@/components/mcp-docs";
import { ReadingFrame, SITE } from "@/components/reading-views";
import { TOOLS } from "@/lib/mcp-tools";

export const metadata: Metadata = { title: "MCP API", description: "How to call the Reading Shelf's read-only MCP endpoint.", alternates: { canonical: "/mcp" } };

export default function McpPage() {
  return <ReadingFrame><McpDocs name="Reading Shelf" site={SITE} tools={TOOLS} /></ReadingFrame>;
}
