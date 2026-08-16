/**
 * Site-wide configuration. Change email, verification tokens and
 * social metadata here rather than hunting through templates.
 */
export const site = {
  name: "John Bowskill",
  shortName: "margies.app",
  title: "John Bowskill — Creative technology and custom software",
  description:
    "John Bowskill builds custom software, interactive experiences, monitoring systems and technical prototypes from the Margaret River region of Western Australia.",
  url: "https://margies.app",
  author: "John Bowskill",
  email: "john@margies.app",
  locale: "en_AU",
  language: "en-AU",
  region: "Margaret River region, Western Australia",
  jobTitle: "Creative technologist",
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
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalised, site.url).toString();
}
