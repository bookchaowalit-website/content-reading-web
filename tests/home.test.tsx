import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the shelf with every authored item and the sample-data notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Keep a place");
    expect(html).toContain("Designing Data-Intensive Applications");
    expect(html).toContain("Small Is Beautiful");
    expect(html).toContain("NO IMPORT / NO SYNC");
  });
});
