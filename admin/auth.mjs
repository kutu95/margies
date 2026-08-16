import crypto from "node:crypto";
import { adminPassword, adminUser, sessionSecret } from "./env.mjs";

const COOKIE = "margies_admin";
const MAX_AGE = 60 * 60 * 24 * 7;
const attempts = new Map();

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function sign(value) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function createSession() {
  const payload = Buffer.from(
    JSON.stringify({
      u: adminUser(),
      exp: Date.now() + MAX_AGE * 1000,
      csrf: crypto.randomBytes(16).toString("hex"),
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(cookieHeader = "") {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return null;
  const [payload, signature] = match[1].split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now() || data.u !== adminUser()) return null;
    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(value, secure) {
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearCookie(secure) {
  const parts = [`${COOKIE}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function verifyLogin(username, password, ip) {
  const now = Date.now();
  const record = attempts.get(ip) ?? { count: 0, reset: now + 15 * 60 * 1000 };
  if (now > record.reset) {
    record.count = 0;
    record.reset = now + 15 * 60 * 1000;
  }
  if (record.count >= 8) {
    attempts.set(ip, record);
    return { ok: false, error: "Too many attempts. Wait a few minutes." };
  }

  const userOk = safeEqual(username.trim(), adminUser());
  const passOk = safeEqual(password, adminPassword());
  if (!userOk || !passOk) {
    record.count += 1;
    attempts.set(ip, record);
    return { ok: false, error: "Those details were not accepted." };
  }

  attempts.delete(ip);
  return { ok: true };
}

export function csrfOk(session, token) {
  return Boolean(session?.csrf && token && safeEqual(session.csrf, token));
}
