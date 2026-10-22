import { describe, expect, it } from "vitest";
import { ITEMS, filterItems, pickSelected } from "@/lib/reading";

describe("filterItems", () => {
  it("returns everything for All with an empty query", () => {
    expect(filterItems(ITEMS, "All", "")).toHaveLength(ITEMS.length);
  });

  it("filters by category", () => {
    expect(filterItems(ITEMS, "Book", "").every((item) => item.category === "Book")).toBe(true);
  });

  it("matches title and summary case-insensitively", () => {
    expect(filterItems(ITEMS, "All", "SHAPE").map((item) => item.id)).toEqual(["shape"]);
    expect(filterItems(ITEMS, "All", "aura").map((item) => item.id)).toEqual(["working"]);
  });

  it("combines category and query", () => {
    expect(filterItems(ITEMS, "Essay", "shape")).toEqual([]);
  });
});

describe("pickSelected", () => {
  it("keeps the selected item while it is visible", () => {
    expect(pickSelected(ITEMS, ITEMS, "shape").id).toBe("shape");
  });

  it("falls back to the first visible item when the selection is filtered out", () => {
    const visible = filterItems(ITEMS, "Essay", "");
    expect(pickSelected(ITEMS, visible, "ddia").id).toBe("working");
  });

  it("falls back to the first item when nothing is visible", () => {
    expect(pickSelected(ITEMS, [], "ddia").id).toBe("ddia");
  });
});
