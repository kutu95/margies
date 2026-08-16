import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects");
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.data.featured);
}

export function projectPath(project: Project): string {
  return `/projects/${project.id}`;
}

export function statusLabel(status: Project["data"]["status"]): string {
  switch (status) {
    case "live":
      return "Live";
    case "ongoing":
      return "Ongoing";
    case "experimental":
      return "Experimental";
    case "internal":
      return "Internal";
    default:
      return status;
  }
}
