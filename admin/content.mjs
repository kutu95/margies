import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { contentRoot, ensureOverlay, safeJoin } from "./paths.mjs";

const KINDS = {
  pages: "pages",
  projects: "projects",
  photography: "photography",
};

export function stringifyEntry(data, body = "") {
  const front = yaml.dump(data, {
    lineWidth: 100,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
  const text = body.trim();
  return text ? `---\n${front}---\n\n${text}\n` : `---\n${front}---\n`;
}

export async function listEntries(kind) {
  const dir = safeJoin(contentRoot(), KINDS[kind]);
  const names = await fs.readdir(dir);
  const entries = [];
  for (const name of names.sort()) {
    if (!name.endsWith(".md")) continue;
    const parsed = await readEntry(kind, name.slice(0, -3));
    entries.push(parsed);
  }
  return entries;
}

export async function readEntry(kind, slug) {
  const file = safeJoin(contentRoot(), path.posix.join(KINDS[kind], `${slug}.md`));
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  return { kind, slug, data: parsed.data, body: parsed.content.replace(/^\n/, ""), file };
}

export async function writeEntry(kind, slug, data, body) {
  ensureOverlay();
  const file = safeJoin(contentRoot(), path.posix.join(KINDS[kind], `${slug}.md`));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, stringifyEntry(data, body));
}

export async function deleteEntry(kind, slug) {
  if (kind === "pages") throw new Error("Page files cannot be deleted.");
  ensureOverlay();
  const file = safeJoin(contentRoot(), path.posix.join(KINDS[kind], `${slug}.md`));
  await fs.unlink(file);
}

export async function readSettings() {
  const file = safeJoin(contentRoot(), "settings.json");
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export async function writeSettings(settings) {
  ensureOverlay();
  const file = safeJoin(contentRoot(), "settings.json");
  await fs.writeFile(file, `${JSON.stringify(settings, null, 2)}\n`);
}

export function validSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function lines(value) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optional(value) {
  const text = String(value ?? "").trim();
  return text || undefined;
}

function numbered(fields, prefix) {
  const rows = [];
  for (const [key, value] of Object.entries(fields)) {
    const match = key.match(new RegExp(`^${prefix}_([a-z]+)_(\\d+)$`));
    if (!match) continue;
    const [, name, index] = match;
    rows[Number(index)] ??= {};
    rows[Number(index)][name] = value;
  }
  return rows.filter((row) => row && Object.values(row).some((item) => String(item ?? "").trim()));
}

export function projectFromForm(fields) {
  const gallery = numbered(fields, "gallery").map((row) => ({
    src: row.src?.trim(),
    alt: row.alt?.trim(),
    title: optional(row.title),
    caption: optional(row.caption),
    location: optional(row.location),
    year: optional(row.year),
    width: row.width ? Number(row.width) : undefined,
    height: row.height ? Number(row.height) : undefined,
  })).filter((row) => row.src && row.alt);

  const metaLines = String(fields.meta ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const meta = {};
  for (const line of metaLines) {
    const eq = line.indexOf(":");
    if (eq === -1) continue;
    meta[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }

  return {
    title: fields.title?.trim(),
    summary: fields.summary?.trim(),
    category: fields.category?.trim(),
    disciplines: [].concat(fields.disciplines ?? []).filter(Boolean),
    technologies: lines(fields.technologies),
    status: fields.status,
    url: optional(fields.url),
    urlLabel: optional(fields.urlLabel),
    relatedPhotography: optional(fields.relatedPhotography),
    hero: fields.hero?.trim(),
    heroAlt: fields.heroAlt?.trim(),
    gallery,
    year: optional(fields.year),
    featured: fields.featured === "on",
    order: Number(fields.order || 0),
    seoTitle: optional(fields.seoTitle),
    seoDescription: optional(fields.seoDescription),
    meta: Object.keys(meta).length ? meta : undefined,
  };
}

export function photographyFromForm(fields) {
  const gallery = numbered(fields, "gallery").map((row) => ({
    src: row.src?.trim(),
    alt: row.alt?.trim(),
    title: optional(row.title),
    caption: optional(row.caption),
    location: optional(row.location),
    year: optional(row.year),
    width: row.width ? Number(row.width) : undefined,
    height: row.height ? Number(row.height) : undefined,
  })).filter((row) => row.src && row.alt);

  return {
    title: fields.title?.trim(),
    description: fields.description?.trim(),
    hero: fields.hero?.trim(),
    heroAlt: fields.heroAlt?.trim(),
    gallery,
    year: optional(fields.year),
    location: optional(fields.location),
    relatedProject: optional(fields.relatedProject),
    relatedProjectLabel: optional(fields.relatedProjectLabel),
    url: optional(fields.url),
    urlLabel: optional(fields.urlLabel),
    featured: fields.featured === "on",
    order: Number(fields.order || 0),
    seoTitle: optional(fields.seoTitle),
    seoDescription: optional(fields.seoDescription),
  };
}

export function pageFromForm(slug, fields, existing) {
  const data = { ...existing };

  const scalars = [
    "seoTitle",
    "seoDescription",
    "kicker",
    "headline",
    "lede",
    "heroImage",
    "heroAlt",
    "image",
    "imageAlt",
    "imageCaption",
    "photoKicker",
    "photoTitle",
    "photoLink",
    "projectsKicker",
    "projectsTitle",
    "projectsLink",
    "workKicker",
    "workTitle",
    "workLink",
    "aboutKicker",
    "aboutTitle",
    "aboutLink",
    "ctaTitle",
    "ctaText",
    "kindsTitle",
  ];
  for (const key of scalars) {
    if (fields[key] !== undefined) data[key] = fields[key];
  }

  if (slug === "home") {
    data.capabilities = numbered(fields, "cap").map((row) => ({
      title: row.title?.trim() ?? "",
      text: row.text?.trim() ?? "",
    })).filter((row) => row.title || row.text);
    data.aboutParagraphs = [].concat(fields.aboutParagraphs ?? [])
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (slug === "services") {
    data.kinds = numbered(fields, "kind").map((row) => ({
      title: row.title?.trim() ?? "",
      text: row.text?.trim() ?? "",
    })).filter((row) => row.title || row.text);
  }

  return data;
}
