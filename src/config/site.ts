/**
 * Site-wide configuration. Change email, verification tokens and
 * social metadata here rather than hunting through templates.
 */
export const site = {
  name: "John Bowskill",
  shortName: "margies.app",
  title: "John Bowskill — Photography, creative technology and custom projects",
  description:
    "John Bowskill makes photographs, software and unusual things from the Margaret River region of Western Australia — photography, creative technology, custom digital systems and immersive installations.",
  url: "https://margies.app",
  author: "John Bowskill",
  email: "john@margies.app",
  locale: "en_AU",
  language: "en-AU",
  region: "Margaret River region, Western Australia",
  jobTitle: "Photographer and creative technologist",
  tagline: "Photography, creative technology and custom projects",
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
