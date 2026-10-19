import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAdmin } from "./admin/router.mjs";

const PORT = Number(process.env.PORT || 3008);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const REDIRECTS = new Map([
  ["/projects/digital-humans", "/work/captain-godfrey"],
  ["/projects/captain-godfrey", "/work/captain-godfrey"],
  ["/projects/cuborama", "/work/cuborama"],
  ["/projects/drift", "/work/drift"],
  ["/projects/layer-painter", "/work/layer-painter"],
  ["/projects/ss-georgette-150th", "/georgette"],
  ["/enquire", "/contact"],
  ["/prints", "https://exhibition.margies.app/shop"],
]);

function byteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || size <= 0) return null;
  const [, startText, endText] = match;
  if (!startText && !endText) return null;

  if (!startText) {
    const suffix = Number(endText);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }

  const start = Number(startText);
  const end = endText ? Number(endText) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start >= size || end < start) {
    return null;
  }
  return { start, end: Math.min(end, size - 1) };
}

function redirectTarget(url) {
  const path = url.split("?")[0].replace(/\/$/, "") || "/";
  const target = REDIRECTS.get(path);
  if (!target) return null;
  const query = url.includes("?") ? url.slice(url.indexOf("?")) : "";
  return `${target}${query}`;
}

function baseHeaders(extra = {}) {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    ...extra,
  };
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safe = path.posix.normalize(decoded).replace(/^(\.\.(\/|$))+/, "");
  const candidate = path.join(ROOT, safe);

  if (!candidate.startsWith(ROOT)) return null;

  try {
    const stat = await fs.stat(candidate);
    if (stat.isFile()) return candidate;
    if (stat.isDirectory()) {
      const index = path.join(candidate, "index.html");
      await fs.access(index);
      return index;
    }
  } catch {
    // fall through
  }

  try {
    const asPage = path.join(ROOT, safe, "index.html");
    await fs.access(asPage);
    return asPage;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const host = (req.headers.host ?? "").split(":")[0]?.toLowerCase() ?? "";
  const url = req.url ?? "/";

  if (host === "www.margies.app") {
    res.writeHead(301, baseHeaders({ Location: `https://margies.app${url}` }));
    res.end();
    return;
  }

  const redirectTo = redirectTarget(url);
  if (redirectTo && (req.method === "GET" || req.method === "HEAD")) {
    res.writeHead(301, baseHeaders({ Location: redirectTo }));
    res.end();
    return;
  }

  try {
    if (await handleAdmin(req, res)) return;
  } catch (error) {
    res.writeHead(500, baseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end(error instanceof Error ? error.message : "Server error");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, baseHeaders({ Allow: "GET, HEAD" }));
    res.end();
    return;
  }

  let file = await resolveFile(url);
  let status = 200;
  if (!file) {
    file = path.join(ROOT, "404.html");
    status = 404;
  }

  try {
    const ext = path.extname(file);
    const type = TYPES[ext] || "application/octet-stream";
    const cache = file.includes(`${path.sep}_astro${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : ext === ".html" || ext === ".xml" || ext === ".txt"
        ? "public, max-age=60"
        : "public, max-age=604800";

    if (type.startsWith("video/") || type.startsWith("audio/")) {
      const stat = await fs.stat(file);
      const range = req.headers.range ? byteRange(req.headers.range, stat.size) : null;
      if (req.headers.range && !range) {
        res.writeHead(416, baseHeaders({
          "Content-Range": `bytes */${stat.size}`,
          "Accept-Ranges": "bytes",
        }));
        res.end();
        return;
      }

      const start = range ? range.start : 0;
      const end = range ? range.end : stat.size - 1;
      res.writeHead(range ? 206 : status, baseHeaders({
        "Content-Type": type,
        "Content-Length": end - start + 1,
        "Accept-Ranges": "bytes",
        ...(range ? { "Content-Range": `bytes ${start}-${end}/${stat.size}` } : {}),
        "Cache-Control": cache,
      }));
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      createReadStream(file, { start, end }).pipe(res);
      return;
    }

    const data = await fs.readFile(file);
    res.writeHead(
      status,
      baseHeaders({
        "Content-Type": type,
        "Cache-Control": cache,
      }),
    );
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(500, baseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end("Server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`margies.app listening on ${HOST}:${PORT}`);
});
