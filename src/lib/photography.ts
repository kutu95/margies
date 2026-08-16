import { getCollection, type CollectionEntry } from "astro:content";

export type PhotographyCollection = CollectionEntry<"photography">;

export async function getPhotographyCollections(): Promise<PhotographyCollection[]> {
  const collections = await getCollection("photography");
  return collections.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedPhotography(): Promise<PhotographyCollection[]> {
  const collections = await getPhotographyCollections();
  return collections.filter((collection) => collection.data.featured);
}

export function photographyPath(collection: PhotographyCollection): string {
  return `/photography/${collection.id}`;
}

export function neighbours(current: PhotographyCollection, all: PhotographyCollection[]) {
  const index = all.findIndex((item) => item.id === current.id);
  return {
    previous: index > 0 ? all[index - 1] : undefined,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : undefined,
  };
}
