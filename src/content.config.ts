import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const galleryImage = z.object({
  src: z.string(),
  alt: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    technologies: z.array(z.string()),
    status: z.enum(["live", "ongoing", "experimental", "internal"]),
    url: z.string().url().optional(),
    urlLabel: z.string().optional(),
    hero: z.string(),
    heroAlt: z.string(),
    gallery: z.array(galleryImage).default([]),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    meta: z.record(z.string(), z.string()).optional(),
  }),
});

export const collections = { projects };
