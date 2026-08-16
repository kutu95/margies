import fs from "node:fs";

export function contentBase(kind: "projects" | "photography" | "pages"): string {
  const overlay = `./data/content/${kind}`;
  return fs.existsSync(overlay) ? overlay : `./src/content/${kind}`;
}

export function settingsPath(): string {
  return fs.existsSync("./data/content/settings.json")
    ? "./data/content/settings.json"
    : "./src/content/settings.json";
}

export function publicDir(): string {
  return fs.existsSync("./data/public") ? "data/public" : "public";
}
