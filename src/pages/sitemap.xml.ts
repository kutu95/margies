import type { APIRoute } from "astro";
import { absoluteUrl } from "../config/site";
import { getPhotographyCollections, photographyPath } from "../lib/photography";
import { getProjects, projectPath } from "../lib/projects";

const staticPaths = ["/", "/about", "/contact", "/services", "/projects", "/photography"];

export const GET: APIRoute = async () => {
  const [projects, photography] = await Promise.all([
    getProjects(),
    getPhotographyCollections(),
  ]);

  const paths = [
    ...staticPaths,
    ...projects.map(projectPath),
    ...photography.map(photographyPath),
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
