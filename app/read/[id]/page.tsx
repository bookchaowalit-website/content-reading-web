import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemView } from "@/components/reading-views";
import { ITEMS } from "@/lib/reading";

type Props = { params: Promise<{ id: string }> };
const find = async ({ params }: Props) => {
  const { id } = await params;
  return ITEMS.find((item) => item.id === id);
};

export function generateStaticParams() {
  return ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const item = await find(props);
  return item ? { title: item.title, description: item.summary, alternates: { canonical: `/read/${item.id}` } } : {};
}

export default async function ItemPage(props: Props) {
  const item = await find(props);
  if (!item) notFound();
  return <ItemView item={item} items={ITEMS} />;
}
