import { absoluteUrl, site } from "../config/site";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: site.author,
    url: site.url,
    email: site.email,
    jobTitle: site.jobTitle,
    image: absoluteUrl("/images/john-bowskill.jpg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Margaret River",
      addressRegion: "WA",
      addressCountry: "AU",
    },
    knowsAbout: [
      "Interactive installations",
      "Digital characters",
      "Immersive exhibitions",
      "Photography",
    ],
    sameAs: [...site.sameAs],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    founder: { "@id": absoluteUrl("/#person") },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Margaret River",
      addressRegion: "WA",
      addressCountry: "AU",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.language,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function creativeWorkJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image ? absoluteUrl(input.image) : undefined,
    author: { "@id": absoluteUrl("/#person") },
    sameAs: input.url ? [input.url] : undefined,
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  images: { src: string; alt: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    author: { "@id": absoluteUrl("/#person") },
    mainEntity: {
      "@type": "ImageGallery",
      name: input.name,
      image: input.images.map((image) => ({
        "@type": "ImageObject",
        contentUrl: absoluteUrl(image.src),
        description: image.alt,
        author: { "@id": absoluteUrl("/#person") },
      })),
    },
  };
}
