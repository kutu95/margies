// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { publicDir } from "./src/lib/content-paths";

export default defineConfig({
  site: "https://margies.app",
  trailingSlash: "never",
  compressHTML: true,
  publicDir: publicDir(),
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
