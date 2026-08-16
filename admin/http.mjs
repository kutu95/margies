export function send(res, status, headers, body) {
  res.writeHead(status, headers);
  res.end(body);
}

export function redirect(res, location, extra = {}) {
  send(res, 303, { Location: location, ...extra }, "");
}

export async function readRaw(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function readForm(req) {
  const type = req.headers["content-type"] ?? "";
  const raw = await readRaw(req);
  if (type.includes("multipart/form-data")) {
    return parseMultipart(raw, type);
  }
  const params = new URLSearchParams(raw.toString("utf8"));
  const fields = {};
  for (const [key, value] of params) {
    if (key.endsWith("[]")) {
      const name = key.slice(0, -2);
      fields[name] = fields[name] ? [].concat(fields[name], value) : [value];
    } else {
      fields[key] = value;
    }
  }
  return { fields, files: [] };
}

function parseMultipart(buffer, contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!match) return { fields: {}, files: [] };
  const boundary = `--${match[1] || match[2]}`;
  const text = buffer.toString("latin1");
  const chunks = text.split(boundary).slice(1);
  const fields = {};
  const files = [];

  for (const chunk of chunks) {
    if (chunk === "--\r\n" || chunk === "--") continue;
    const split = chunk.indexOf("\r\n\r\n");
    if (split === -1) continue;
    const rawHeaders = chunk.slice(0, split);
    let body = chunk.slice(split + 4);
    if (body.endsWith("\r\n")) body = body.slice(0, -2);

    const nameMatch = /name="([^"]+)"/i.exec(rawHeaders);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const fileMatch = /filename="([^"]*)"/i.exec(rawHeaders);
    if (fileMatch) {
      const filename = fileMatch[1];
      if (!filename) continue;
      const typeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(rawHeaders);
      files.push({
        field: name,
        filename,
        type: typeMatch?.[1]?.trim() ?? "application/octet-stream",
        data: Buffer.from(body, "latin1"),
      });
    } else if (name.endsWith("[]")) {
      const key = name.slice(0, -2);
      const value = Buffer.from(body, "latin1").toString("utf8");
      fields[key] = fields[key] ? [].concat(fields[key], value) : [value];
    } else {
      fields[name] = Buffer.from(body, "latin1").toString("utf8");
    }
  }

  return { fields, files };
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress ?? "unknown";
}

export function isSecure(req) {
  return (
    process.env.NODE_ENV === "production" ||
    req.headers["x-forwarded-proto"] === "https"
  );
}

export const htmlHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
};
