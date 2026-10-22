// The authored reading list and the search/filter rules used by the page and the MCP route.

export type ReadingItem = { id: string; title: string; category: "Book" | "Essay"; summary: string; meta: string; note: string };
export const CATEGORIES = ["All", "Book", "Essay"] as const;
export type Category = (typeof CATEGORIES)[number];

export const ITEMS: ReadingItem[] = [
  { id: "ddia", title: "Designing Data-Intensive Applications", category: "Book", summary: "Systems fundamentals.", meta: "In progress / 24%", note: "A shelf marker for the chapters that make systems feel less mysterious: boundaries, data, and the cost of a convenient default." },
  { id: "working", title: "The Work of Art in the Age of Mechanical Reproduction", category: "Essay", summary: "Copies, aura, and attention.", meta: "Queued / 12 pages", note: "A short return to the question of what changes when a thing can travel farther than the room that made it." },
  { id: "shape", title: "Shape Up", category: "Book", summary: "Appetite before task lists.", meta: "Finished / notes open", note: "A useful reminder that a plan is a boundary around a bet, not a longer list of instructions." },
  { id: "small", title: "Small Is Beautiful", category: "Essay", summary: "Scale as a design decision.", meta: "Queued / 8 pages", note: "A compact prompt for asking whether the next layer creates leverage or merely creates somewhere else to look." },
];

/** Items in `category` ("All" for every item) whose title, summary or category contains `query`, ignoring case. */
export function filterItems(items: ReadingItem[], category: Category, query: string): ReadingItem[] {
  const needle = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(needle),
  );
}

/** The selected item if it is still visible, else the first visible item, else the first item overall. */
export function pickSelected(items: ReadingItem[], visible: ReadingItem[], selectedId: string): ReadingItem {
  return visible.find((item) => item.id === selectedId) ?? visible[0] ?? items[0];
}
