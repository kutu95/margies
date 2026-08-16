// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { publicDir } from "./src/lib/content-paths";

export default defineConfig({
  site: "https://margies.app",
  trailingSlash: "never",
  compressHTML: true,
  publicDir: publicDir(),
  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes("/404"),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Newsreader",
      cssVariable: "--font-heading",
      weights: ["400 700"],
      styles: ["normal", "italic"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Source Sans 3",
      cssVariable: "--font-body",
      weights: ["400 600"],
      styles: ["normal"],
      fallbacks: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
    },
  ],
});
