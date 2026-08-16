import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { disciplines } from "./config/site";
import { contentBase } from "./lib/content-paths";

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

const titledText = z.object({
  title: z.string(),
  text: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: contentBase("projects") }),
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
  loader: glob({ pattern: "**/*.md", base: contentBase("photography") }),
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

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: contentBase("pages") }),
  schema: z.object({
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    kicker: z.string().optional(),
    headline: z.string().optional(),
    lede: z.string().optional(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
    photoKicker: z.string().optional(),
    photoTitle: z.string().optional(),
    photoLink: z.string().optional(),
    projectsKicker: z.string().optional(),
    projectsTitle: z.string().optional(),
    projectsLink: z.string().optional(),
    workKicker: z.string().optional(),
    workTitle: z.string().optional(),
    workLink: z.string().optional(),
    capabilities: z.array(titledText).optional(),
    aboutKicker: z.string().optional(),
    aboutTitle: z.string().optional(),
    aboutParagraphs: z.array(z.string()).optional(),
    aboutLink: z.string().optional(),
    ctaTitle: z.string().optional(),
    ctaText: z.string().optional(),
    kindsTitle: z.string().optional(),
    kinds: z.array(titledText).optional(),
  }),
});

export const collections = { projects, photography, pages };
