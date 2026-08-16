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
};

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
    const data = await fs.readFile(file);
    const ext = path.extname(file);
    const cache = file.includes(`${path.sep}_astro${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : ext === ".html" || ext === ".xml" || ext === ".txt"
        ? "public, max-age=60"
        : "public, max-age=604800";

    res.writeHead(
      status,
      baseHeaders({
        "Content-Type": TYPES[ext] || "application/octet-stream",
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
