import fs from "node:fs/promises";
import path from "node:path";
import { ensureOverlay, imagesRoot, safeJoin } from "./paths.mjs";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".ico"]);
const MAX_BYTES = 12 * 1024 * 1024;

export function publicUrl(relative) {
  return `/images/${relative.split(path.sep).join("/")}`;
}

export async function listImages(folder = "") {
  const root = imagesRoot();
  const dir = safeJoin(root, folder);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const folders = [];
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      folders.push(entry.name);
    } else if (ALLOWED.has(path.extname(entry.name).toLowerCase())) {
      const relative = path.posix.join(folder, entry.name);
      const stat = await fs.stat(path.join(dir, entry.name));
      files.push({
        name: entry.name,
        relative,
        url: publicUrl(relative),
        bytes: stat.size,
      });
    }
  }
  return { folder, folders, files };
}

export async function saveUpload(folder, file) {
  if (!file?.filename) throw new Error("Choose a file to upload.");
  if (file.data.length > MAX_BYTES) throw new Error("That file is larger than 12 MB.");
  const ext = path.extname(file.filename).toLowerCase();
  if (!ALLOWED.has(ext)) throw new Error("Use jpg, png, webp, svg or gif.");
  const base = file.filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!base || base.startsWith(".")) throw new Error("That filename is not usable.");
  ensureOverlay();
  const destDir = safeJoin(imagesRoot(), folder);
  await fs.mkdir(destDir, { recursive: true });
  const dest = safeJoin(destDir, base);
  await fs.writeFile(dest, file.data);
  return publicUrl(path.posix.join(folder, base));
}

export async function deleteImage(relative) {
  ensureOverlay();
  const file = safeJoin(imagesRoot(), relative);
  await fs.unlink(file);
}

export async function createFolder(parent, name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) throw new Error("Give the folder a simple name.");
  ensureOverlay();
  await fs.mkdir(safeJoin(imagesRoot(), path.posix.join(parent, slug)), { recursive: true });
}

export function mediaFoldersFromUrl(urlPath) {
  return decodeURIComponent(urlPath.replace(/^\/admin\/media\/?/, "")).replace(/^\/|\/$/g, "");
}
