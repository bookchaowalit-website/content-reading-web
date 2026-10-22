"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, ITEMS, filterItems, pickSelected, type Category } from "@/lib/reading";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [selectedId, setSelectedId] = useState("ddia");
  const visible = useMemo(() => filterItems(ITEMS, category, query), [category, query]);
  // Falls back to the first visible item when a search hides the selected one.
  const selected = pickSelected(ITEMS, visible, selectedId);

  return (
    <main className="reading-shell">
      <div className="reading-frame">
        <header className="reading-topbar"><a href="https://bookchaowalit.com" className="reading-mark" aria-label="Bookchaowalit home"><span>READ</span> / SHELF</a><span>OPEN QUEUE / LOCAL LIST</span><span>{ITEMS.length} PIECES INDEXED</span></header>
        <section className="reading-intro"><div><h1>Keep a place<br /><em>for the next page.</em></h1><p>A small reading shelf for books and essays that are still becoming useful. Find the item, then give it the room to say one thing.</p></div><div className="reading-stamp" aria-hidden="true"><span>OPEN</span><b>{String(visible.length).padStart(2, "0")}</b><span>ON SHELF</span></div></section>

        <section className="reading-desk" aria-label="Reading list">
          <aside className="shelf-index"><div className="desk-head"><span>SHELF INDEX</span><span>{visible.length} FOUND</span></div><label className="reading-search"><span aria-hidden="true">/</span><span className="sr-only">Search reading list</span><input placeholder="Search the shelf" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="category-tabs">{CATEGORIES.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><div className="shelf-list">{visible.length ? visible.map((item, index) => <button type="button" key={item.id} className={selected.id === item.id ? "shelf-row selected" : "shelf-row"} onClick={() => setSelectedId(item.id)} aria-pressed={selected.id === item.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.category} / {item.meta}</small></button>) : <p className="empty-shelf">No page matches this search.</p>}</div></aside>
          <article className="reading-sheet"><div className="desk-head"><span>OPEN PAGE / {selected.category.toUpperCase()}</span><span>{selected.meta.toUpperCase()}</span></div><div className="sheet-content"><span className="page-mark">{String(ITEMS.indexOf(selected) + 1).padStart(2, "0")}</span><h2>{selected.title}</h2><p className="sheet-summary">{selected.summary}</p><div className="sheet-note"><span className="field-label">MARGIN NOTE</span><p>{selected.note}</p></div><div className="sheet-foot"><span>AUTHORED SAMPLE LIST</span><span>NO IMPORT / NO SYNC</span></div></div></article>
        </section>
        <footer className="reading-footer"><span>BOOK / DEV TOOLS</span><span>SEARCH · SORT · OPEN</span></footer>
      </div>
    </main>
  );
}
