import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export function hasOverlay() {
  return fs.existsSync(path.join(ROOT, "data", "content"));
}

export function contentRoot() {
  return hasOverlay()
    ? path.join(ROOT, "data", "content")
    : path.join(ROOT, "src", "content");
}

export function publicRoot() {
  return fs.existsSync(path.join(ROOT, "data", "public"))
    ? path.join(ROOT, "data", "public")
    : path.join(ROOT, "public");
}

export function imagesRoot() {
  return path.join(publicRoot(), "images");
}

export function ensureOverlay() {
  const dataContent = path.join(ROOT, "data", "content");
  const dataPublic = path.join(ROOT, "data", "public");
  if (!fs.existsSync(dataContent)) {
    fs.cpSync(path.join(ROOT, "src", "content"), dataContent, { recursive: true });
  }
  if (!fs.existsSync(dataPublic)) {
    fs.cpSync(path.join(ROOT, "public"), dataPublic, { recursive: true });
  }
}

export function safeJoin(root, relative = "") {
  const cleaned = path.posix.normalize(relative.replaceAll("\\", "/")).replace(/^(\.\.(\/|$))+/, "");
  const resolved = path.resolve(root, cleaned);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid path");
  }
  return resolved;
}
