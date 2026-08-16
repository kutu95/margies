/**
 * Site-wide configuration. Editable identity fields live in
 * src/content/settings.json (or data/content/settings.json after admin use).
 */
import fs from "node:fs";
import { settingsPath } from "../lib/content-paths";

const settings = JSON.parse(fs.readFileSync(settingsPath(), "utf8")) as {
  title: string;
  description: string;
  tagline: string;
  jobTitle: string;
  email: string;
};

export const site = {
  name: "John Bowskill",
  shortName: "margies.app",
  title: settings.title,
  description: settings.description,
  url: "https://margies.app",
  author: "John Bowskill",
  email: settings.email,
  locale: "en_AU",
  language: "en-AU",
  region: "Margaret River region, Western Australia",
  jobTitle: settings.jobTitle,
  tagline: settings.tagline,
  ogImage: "/images/og-default.jpg",
  /**
   * Optional HTML-tag verification for Google Search Console.
   * Prefer verifying the Domain property with a Cloudflare DNS TXT record.
   * Leave empty until you have a real token — do not invent one.
   */
  googleSiteVerification: "",
  sameAs: [
    "https://exhibition.margies.app",
    "https://metal.margies.app",
  ],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const disciplines = [
  "Photography",
  "Software",
  "AI",
  "Electronics",
  "3D",
  "Immersive",
  "Research",
  "Hardware",
] as const;

export type Discipline = (typeof disciplines)[number];

export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalised, site.url).toString();
}
