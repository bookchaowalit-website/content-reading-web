import type { MetadataRoute } from "next";
import { SITE } from "@/components/reading-views";
import { ITEMS } from "@/lib/reading";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE}/` }, ...ITEMS.map((item) => ({ url: `${SITE}/read/${item.id}` }))];
}
