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
  shortName: "John Bowskill",
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
  ogImage: "/images/photography/georgette/installation.jpg",
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

export const printsHref = "https://exhibition.margies.app/shop";

export const headerNav = [
  { href: "/historical-characters", label: "Historical Characters" },
  { href: "/godfrey", label: "Captain Godfrey" },
  { href: "/work", label: "Interactive Works" },
  { href: "/about", label: "About John" },
  { href: "/contact", label: "Discuss an installation" },
] as const;

export const footerNav = [
  { href: "/", label: "Home" },
  { href: "/historical-characters", label: "Historical Characters" },
  { href: "/godfrey", label: "Captain Godfrey" },
  { href: "/work", label: "Interactive Works" },
  { href: "/georgette", label: "Georgette 150th" },
  { href: "/about", label: "About John" },
  { href: "/contact", label: "Contact" },
  { href: printsHref, label: "Prints" },
] as const;

export const enquiryInterests = [
  { value: "historical-characters", label: "Historical characters" },
  { value: "captain-godfrey", label: "Captain Godfrey" },
  { value: "cuborama", label: "Cuborama" },
  { value: "drift", label: "Drift" },
  { value: "layer-painter", label: "Layer Painter" },
  { value: "photographic-prints", label: "Photographic prints" },
  { value: "another-idea", label: "Another idea" },
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
