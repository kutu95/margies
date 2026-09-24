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
  if (project.data.placement === "work") return `/work/${project.id}`;
  if (project.data.placement === "study") return "/georgette";
  return `/projects/${project.id}`;
}

export function hasPhotograph(src: string | undefined): src is string {
  return Boolean(src) && !src.endsWith(".svg");
}

export async function getWorks(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.data.placement === "work");
}

export async function getArchiveProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.data.placement === "archive");
}

export async function getStudy(): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.data.placement === "study");
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
