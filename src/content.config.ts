import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { disciplines } from "./config/site";

const photoImage = z.object({
  src: z.string(),
  alt: z.string(),
  title: z.string().optional(),
  caption: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    disciplines: z.array(z.enum(disciplines)).default([]),
    technologies: z.array(z.string()),
    status: z.enum(["live", "ongoing", "experimental", "internal"]),
    url: z.string().url().optional(),
    urlLabel: z.string().optional(),
    relatedPhotography: z.string().optional(),
    hero: z.string(),
    heroAlt: z.string(),
    gallery: z.array(photoImage).default([]),
    year: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    meta: z.record(z.string(), z.string()).optional(),
  }),
});

const photography = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/photography" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero: z.string(),
    heroAlt: z.string(),
    gallery: z.array(photoImage).default([]),
    year: z.string().optional(),
    location: z.string().optional(),
    relatedProject: z.string().optional(),
    relatedProjectLabel: z.string().optional(),
    url: z.string().url().optional(),
    urlLabel: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { projects, photography };
