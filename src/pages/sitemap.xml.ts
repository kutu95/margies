import type { APIRoute } from "astro";
import { absoluteUrl } from "../config/site";
import { getProjects, projectPath } from "../lib/projects";

const staticPaths = ["/", "/godfrey", "/about", "/contact", "/work", "/georgette"];

export const GET: APIRoute = async () => {
  const projects = await getProjects();
  const paths = [
    ...staticPaths,
    ...projects
      .filter((project) => project.data.placement === "work")
      .map(projectPath),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
