import { ShelfView } from "@/components/reading-views";
import { ITEMS } from "@/lib/reading";

type Search = { q?: string | string[]; type?: string | string[] };
const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function Home({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  return <ShelfView items={ITEMS} q={first(params.q).slice(0, 200)} type={first(params.type)} />;
}
