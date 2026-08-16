import { getCollection, type CollectionEntry } from "astro:content";

export type Page = CollectionEntry<"pages">;

export async function getPage(id: string): Promise<Page> {
  const pages = await getCollection("pages");
  const page = pages.find((entry) => entry.id === id);
  if (!page) {
    throw new Error(`Missing page content: ${id}`);
  }
  return page;
}
