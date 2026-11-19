import type { Metadata } from "next";
import { McpDocs } from "@/components/mcp-docs";
import { ReadingFrame, SITE } from "@/components/reading-views";
import { TOOLS } from "@/lib/mcp-tools";

const title = "MCP API";
const description = "How to call the Reading Shelf's read-only MCP endpoint.";

/** Shares as itself: its own title, description and URL (not the shelf's, which layout.tsx sets). */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/mcp" },
  openGraph: { type: "website", url: `${SITE}/mcp`, title, description, siteName: "Reading Shelf" },
  twitter: { card: "summary", title, description },
};

export default function McpPage() {
  return <ReadingFrame><McpDocs name="Reading Shelf" site={SITE} tools={TOOLS} /></ReadingFrame>;
}
