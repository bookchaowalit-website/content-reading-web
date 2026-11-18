import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemView, SITE } from "@/components/reading-views";
import { ITEMS } from "@/lib/reading";

type Search = { q?: string | string[]; type?: string | string[] };
type Props = { params: Promise<{ id: string }>; searchParams?: Promise<Search> };
const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? "";
const find = async ({ params }: Props) => {
  const { id } = await params;
  return ITEMS.find((item) => item.id === id);
};

export function generateStaticParams() {
  return ITEMS.map((item) => ({ id: item.id }));
}

/** Each item shares as itself: its own title, summary and URL (not the shelf's, which layout.tsx sets). */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const item = await find(props);
  if (!item) return {};
  const url = `${SITE}/read/${item.id}`;
  const description = `${item.summary} ${item.category} · ${item.meta}.`;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/read/${item.id}` },
    openGraph: { type: "article", url, title: item.title, description, siteName: "Reading Shelf" },
    twitter: { card: "summary", title: item.title, description },
  };
}

export default async function ItemPage(props: Props) {
  const item = await find(props);
  if (!item) notFound();
  const search = (await props.searchParams) ?? {};
  return <ItemView item={item} items={ITEMS} q={first(search.q).slice(0, 200)} type={first(search.type)} />;
}
