// @vitest-environment happy-dom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ItemView, ShelfView } from "@/components/reading-views";
import { ITEMS } from "@/lib/reading";
import Home from "@/app/page";
import McpPage from "@/app/mcp/page";
import ItemPage, { generateMetadata, generateStaticParams } from "@/app/read/[id]/page";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import nextConfig from "../next.config";

const page = (node: React.ReactNode) => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<>{node}</>);
  return host;
};
const texts = (host: Element, selector: string) => [...host.querySelectorAll(selector)].map((el) => el.textContent);
const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("shelf", () => {
  it("lists every authored item with search, type chips and a count", () => {
    const host = page(<ShelfView items={ITEMS} />);
    expect(host.querySelectorAll("h1").length).toBe(1);
    expect(host.querySelector(".rs-count")?.textContent).toBe("4 pieces");
    expect(texts(host, ".rs-chip")).toEqual(["All4", "Book2", "Essay2"]);
    expect(host.querySelector('.rs-chip[aria-current="page"]')?.textContent).toBe("All4");
    expect(texts(host, ".rs-entry-link")).toContain("Designing Data-Intensive Applications");
    expect(host.querySelector('.rs-entry-link[href="/read/ddia"]')).not.toBeNull();
    expect(host.textContent).toContain("In progress / 24%");
    expect(host.querySelector('.rs-foot a[href="https://bookchaowalit.com/"]')?.textContent).toBe("More projects");
    expect(host.textContent).not.toMatch(/SEARCH · SORT · OPEN/);
  });

  it("filters by type and query, and chip counts follow the query", () => {
    const host = page(<ShelfView items={ITEMS} type="Book" q="shape" />);
    expect(host.querySelector(".rs-count")?.textContent).toBe("Showing 1 of 4 pieces in books for “shape”");
    expect(texts(host, ".rs-chip")).toEqual(["All1", "Book1", "Essay0"]);
    expect(host.querySelector('input[type="hidden"][name="type"]')?.getAttribute("value")).toBe("Book");
    expect(host.querySelector('.rs-search a[href="/?type=Book"]')?.textContent).toBe("Clear");
  });

  it("says when nothing matches, with a way back, and ignores an unknown type", () => {
    const none = page(<ShelfView items={ITEMS} q="zzz" />);
    expect(none.querySelector(".rs-empty h2")?.textContent).toBe("Nothing on the shelf matches");
    expect(none.querySelector('.rs-empty a[href="/"]')).not.toBeNull();
    expect(page(<ShelfView items={ITEMS} type="Poem" />).querySelector(".rs-count")?.textContent).toBe("4 pieces");
  });

  it("has a nothing-yet state", () => {
    const host = page(<ShelfView items={[]} />);
    expect(host.querySelector(".rs-empty h2")?.textContent).toBe("The shelf is empty");
  });

  it("renders the real home page from search params", async () => {
    const host = page(await Home({ searchParams: Promise.resolve({ q: ["small"], type: "Essay" }) }));
    expect(texts(host, ".rs-entry-link")).toEqual(["Small Is Beautiful"]);
    expect(page(await Home({ searchParams: Promise.resolve({}) })).querySelectorAll(".rs-entry").length).toBe(4);
  });
});

describe("item pages", () => {
  it("shows the margin note and previous / next in shelf order", () => {
    const host = page(<ItemView item={ITEMS[1]} items={ITEMS} />);
    expect(host.querySelector("h1")?.textContent).toBe(ITEMS[1].title);
    expect(host.querySelector(".rs-prose p")?.textContent).toBe(ITEMS[1].note);
    expect(host.querySelector('.rs-pager a[rel="prev"]')?.getAttribute("href")).toBe("/read/ddia");
    expect(host.querySelector('.rs-pager a[rel="next"]')?.getAttribute("href")).toBe("/read/shape");
  });

  it("renders every real item page and 404s an unknown id", async () => {
    for (const { id } of generateStaticParams()) {
      const host = page(await ItemPage(params(id)));
      expect(host.querySelectorAll("h1").length).toBe(1);
      expect((await generateMetadata(params(id))).title).toBeTruthy();
    }
    expect(await generateMetadata(params("missing"))).toEqual({});
    await expect(ItemPage(params("missing"))).rejects.toThrow();
  });
});

describe("follow-ups", () => {
  it("carries the shelf's search and type into item links, and Back and the pager keep them", async () => {
    const shelf = page(<ShelfView items={ITEMS} type="Essay" q="small" />);
    expect(shelf.querySelector(".rs-entry-link")?.getAttribute("href")).toBe("/read/small?type=Essay&q=small");
    const item = page(await ItemPage({ ...params("working"), searchParams: Promise.resolve({ type: "Essay", q: [""] }) }));
    expect(item.querySelector(".rs-back")?.getAttribute("href")).toBe("/?type=Essay");
    // Within the Essay view the neighbours are the other essay, not the next book.
    expect(item.querySelector('.rs-pager a[rel="next"]')?.getAttribute("href")).toBe("/read/small?type=Essay");
    expect(item.querySelector('.rs-pager a[rel="prev"]')).toBeNull();
    const direct = page(<ItemView item={ITEMS[3]} items={ITEMS} q="nothing-matches" type="Poem" />);
    expect(direct.querySelector(".rs-back")?.getAttribute("href")).toBe("/?q=nothing-matches");
    expect(direct.querySelector('.rs-pager a[rel="prev"]')?.getAttribute("href")).toBe("/read/shape?q=nothing-matches");
  });

  it("gives each item its own share title, description and URL", async () => {
    const meta = await generateMetadata(params("shape"));
    expect(meta.openGraph).toMatchObject({ url: "https://reading.bookchaowalit.com/read/shape", title: "Shape Up", type: "article" });
    expect(meta.description).toBe("Appetite before task lists. Book · Finished / notes open.");
    expect(meta.twitter).toMatchObject({ title: "Shape Up" });
  });

  it("links the footer to an MCP how-to page that lists the real tools", () => {
    expect(page(<ShelfView items={ITEMS} />).querySelector('.rs-foot a[href="/mcp"]')?.textContent).toBe("MCP API");
    const host = page(<McpPage />);
    expect(host.querySelector("h1")?.textContent).toBe("MCP API");
    expect([...host.querySelectorAll("tbody code")].map((c) => c.textContent)).toEqual(["get_all", "get_by_id", "search"]);
    expect([...host.querySelectorAll("tbody td:last-child")].map((c) => c.textContent)).toEqual(["none", "id", "query"]);
    expect(host.querySelector("pre code")?.textContent).toContain("curl -s https://reading.bookchaowalit.com/api/mcp");
    expect(host.querySelector('.rs-table[role="region"] table')).not.toBeNull();
  });
});

describe("site files", () => {
  it("uses the site's own domain", () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain("https://reading.bookchaowalit.com/read/ddia");
    expect(robots().sitemap).toBe("https://reading.bookchaowalit.com/sitemap.xml");
  });

  it("sends /more-projects to the main site with a permanent redirect", async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
  });
});
