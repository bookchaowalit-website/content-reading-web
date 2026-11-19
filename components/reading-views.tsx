import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArticleHeader, EmptyState, EntryList, Pager, Prose, Reader, ReaderFoot, ReaderHead, ReaderTop, ResultCount, SearchForm, TagFilter,
  neighbours, type Entry, type PagerLink,
} from "@/components/reader-shell";
import { CATEGORIES, filterItems, type Category, type ReadingItem } from "@/lib/reading";

// The reading shelf's pages on the Reader shell. Route files stay thin; these views take plain data,
// so the tests can render them with no items, a query or a category.

export const SITE = "https://reading.bookchaowalit.com";
const SOURCE = "https://github.com/bookchaowalit-website/content-reading-web";

export function ReadingFrame({ children }: { children: ReactNode }) {
  return (
    <Reader>
      <ReaderTop name="Reading Shelf" tagline="Chaowalit Greepoke" links={[{ href: "/", label: "Shelf" }]} />
      <main id="main" className="rs-main">{children}</main>
      <ReaderFoot source={SOURCE} links={[{ href: "/mcp", label: "MCP API" }]} note="A short hand-written list kept in the repository: nothing is imported or synced." />
    </Reader>
  );
}

export const isCategory = (value: string): value is Category => (CATEGORIES as readonly string[]).includes(value);

/** The shelf's state (type and query) as a query string, carried to item pages so Back returns to the same view. */
const state = (category = "", q = "") => `?${new URLSearchParams({ ...(category ? { type: category } : {}), ...(q ? { q } : {}) })}`.replace(/\?$/, "");
const shelfHref = (category = "", q = "") => `/${state(category, q)}`;
const itemHref = (id: string, category = "", q = "") => `/read/${id}${state(category, q)}`;
const toEntry = (category: string, q: string) => (item: ReadingItem): Entry => ({ href: itemHref(item.id, category, q), title: item.title, summary: item.summary, meta: [item.category, item.meta] });

/** The shelf: search and type chips (counts follow the search), then each item as one row that opens its page. */
export function ShelfView({ items, q = "", type = "" }: { items: ReadingItem[]; q?: string; type?: string }) {
  const query = q.trim();
  const category: Category = isCategory(type) ? type : "All";
  const matching = filterItems(items, "All", query);
  const shown = filterItems(matching, category, "");
  const typeParam = category === "All" ? "" : category;
  return (
    <ReadingFrame>
      <ReaderHead
        title="Keep a place for the next page."
        lede="A small shelf of books and essays that are still becoming useful, each with one margin note."
      />
      {items.length === 0 ? (
        <EmptyState title="The shelf is empty">Books and essays appear here once they are added to the list.</EmptyState>
      ) : (
        <>
          <div className="rs-toolbar">
            <SearchForm label="Search the shelf" placeholder="Title or topic" defaultValue={query} hidden={typeParam ? { type: typeParam } : {}} clearHref={shelfHref(typeParam)} />
            <TagFilter
              label="Filter by type"
              options={CATEGORIES.map((c) => ({
                label: c,
                href: shelfHref(c === "All" ? "" : c, query),
                current: c === category,
                count: filterItems(matching, c, "").length,
              }))}
            />
            <ResultCount shown={shown.length} total={items.length} noun="piece" query={query || undefined} filter={typeParam ? `${typeParam.toLowerCase()}s` : undefined} />
          </div>
          {shown.length > 0 ? (
            <EntryList entries={shown.map(toEntry(typeParam, query))} />
          ) : (
            <EmptyState title="Nothing on the shelf matches" action={<Link className="rs-plain" href="/">Show the whole shelf</Link>}>
              Try fewer or different words, or another type.
            </EmptyState>
          )}
        </>
      )}
    </ReadingFrame>
  );
}

/**
 * One item: its status, summary and margin note, then previous / next. Opened from a filtered shelf, Back and the
 * pager keep that view: previous / next step through the items the shelf showed, and Back returns to it. If the
 * filter does not hold the item, previous / next step through the whole shelf with unfiltered links.
 */
export function ItemView({ item, items, q = "", type = "" }: { item: ReadingItem; items: ReadingItem[]; q?: string; type?: string }) {
  const query = q.trim();
  const category: Category = isCategory(type) ? type : "All";
  const typeParam = category === "All" ? "" : category;
  const shown = filterItems(items, category, query);
  // An old link whose filter no longer holds this item falls back to the whole shelf; then the pager links drop the
  // filter too, so previous and next keep stepping through that same full order (Back still returns to the view).
  const inView = shown.some((i) => i.id === item.id);
  const list = inView ? shown : items;
  const { previous, next } = neighbours(list, list.findIndex((i) => i.id === item.id));
  const link = (i?: ReadingItem): PagerLink | undefined => (i ? { href: inView ? itemHref(i.id, typeParam, query) : itemHref(i.id), title: i.title } : undefined);
  return (
    <ReadingFrame>
      <article className="rs-article">
        <ArticleHeader back={{ href: shelfHref(typeParam, query), label: "The shelf" }} title={item.title} lede={item.summary} meta={[item.category, item.meta]} />
        <Prose>
          <h2>Margin note</h2>
          <p>{item.note}</p>
        </Prose>
        <Pager previous={link(previous)} next={link(next)} label="More on the shelf" />
      </article>
    </ReadingFrame>
  );
}
