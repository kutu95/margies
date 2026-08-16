# margies.app

Personal and professional site for **John Bowskill**, based in the Margaret River region of Western Australia.

This repository is the root website for `https://margies.app`. It is not the Georgette exhibition (`exhibition.margies.app`) and not Metal My Mini (`metal.margies.app`). Those remain separate applications. This site introduces the work and links to them.

## Stack

The `margies.app` directory was empty. The exhibition and Metal My Mini apps are Next.js, but they are separate products with their own backends. This site is a static [Astro](https://astro.build) project so pages are HTML on first response, JavaScript stays minimal, and Cloudflare Pages can host the `dist` folder without an origin server.

- **Framework:** Astro 7 (static output)
- **Package manager:** npm
- **Node:** 24 (see `.nvmrc`; Astro 7 needs Node 22+)
- **Content:** Markdown in `src/content/projects/`
- **Config:** `src/config/site.ts`
- **Hosting assumption:** Cloudflare Pages, with DNS for `margies.app` pointed at this project

## Commands

```sh
nvm use          # or any Node 22+
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Adding a project

1. Create a Markdown file in `src/content/projects/`.
2. The filename becomes the URL: `custom-software.md` → `/projects/custom-software`.
3. Fill in the frontmatter (title, summary, category, technologies, status, hero, and so on).
4. Write the page body in Markdown.
5. Put images in `public/images/projects/<slug>/` and point `hero` / `gallery` at those paths.
6. Set `featured: true` if it should appear on the home page.
7. Rebuild. No architectural change is required.

Schema lives in `src/content.config.ts`.

## Configuration

Edit `src/config/site.ts` for:

- site name
- canonical base URL (`https://margies.app`)
- description
- author
- **email** (`john@margies.app` — change it in this one file)
- Open Graph image
- optional `googleSiteVerification` HTML-tag token

Do not invent a Google verification token. Prefer verifying a **Domain property** in Search Console with a Cloudflare DNS TXT record. If you later need the HTML tag method, paste the real token into `googleSiteVerification`.

### Contact form

The form UI is on `/contact`. There is no backend in this repo.

- If `PUBLIC_CONTACT_FORM_ENDPOINT` is set (see `.env.example`), the form POSTs JSON `{ name, email, subject, message }`.
- If it is not set, submit opens a `mailto:` message to the address in `site.ts`.
- The `company` field is a honeypot for a future backend.

## SEO

- Unique titles and descriptions per page
- Canonical URLs
- Open Graph and Twitter/X card tags
- `robots.txt` allows crawling and points at the sitemap
- `@astrojs/sitemap` writes `/sitemap-index.xml`
- JSON-LD for `Person` and `WebSite` only where it is accurate
- Project pages are prerendered HTML

After a production deploy, confirm there is no `noindex` on real pages, that canonicals use `https://margies.app`, and that `https://margies.app/robots.txt` and `https://margies.app/sitemap-index.xml` are reachable.

## Google Search Console

1. Deploy this site to `margies.app` (see Cloudflare below).
2. Remove the current redirect from `margies.app` to `exhibition.margies.app`.
3. Add `margies.app` in Search Console as a **Domain property**.
4. Verify with the DNS TXT record Cloudflare shows you.
5. Submit `https://margies.app/sitemap-index.xml`.
6. Inspect `/`, `/projects`, `/about`, `/services`, `/contact`, and a couple of project URLs.
7. Request indexing only after those production URLs return the new site, not the exhibition redirect.

## Assets still needed

The first version uses two of John’s existing photographs (Georgette wreck, Redgate) plus the Metal My Mini hero and John’s portrait. Other project images are local SVG placeholders in `public/images/projects/`. Replace them by dropping files in the same folders and updating frontmatter if the filename changes.

Still useful later:

- Additional Georgette exhibition photographs and installation shots
- Metal My Mini process images (print, bath, finished pieces)
- Aquafarm photographs and dashboard screenshots
- Anonymised ultrasound-reporting screenshots
- Unreal Engine / MetaHuman / photogrammetry stills
- Screenshots of the smaller custom tools
- A dedicated Open Graph card if the wreck photograph should not be the default share image

Search the repo for `TODO` in project Markdown for the same list.

## What currently happens at margies.app

`margies.app` and `www.margies.app` are aliases on the exhibition Cloudflare Tunnel. The exhibition Next.js app then **301 redirects** those hosts to `https://exhibition.margies.app`.

That is configured in two places, both outside this repo:

1. `exhibition/cloudflared.config.example.yml` — tunnel ingress sends `margies.app` and `www.margies.app` to the exhibition service on port 3007.
2. `exhibition/middleware.ts` — `HOSTS_REDIRECT_TO_CANONICAL` includes `margies.app` and `www.margies.app`.

Do not change the exhibition or Metal My Mini applications unless you are ready to cut traffic over.

## Cloudflare: serve this site at margies.app

Recommended: **Cloudflare Pages** for this static site, leave the exhibition on its existing tunnel.

1. Push this repository to GitHub (or upload the `dist` folder).
2. In Cloudflare, create a Pages project.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `24` (or 22+)
3. Add a custom domain: `margies.app`, and `www.margies.app` as a redirect to the apex.
4. In the Cloudflare Tunnel / `cloudflared` ingress used by the exhibition, **remove** the `margies.app` and `www.margies.app` hostname rules so they no longer point at the exhibition Next.js process.
5. Leave `exhibition.margies.app` pointed at the exhibition app. Leave `metal.margies.app` alone.
6. Check:
   - `https://margies.app` shows this portfolio
   - it does **not** 301 to `exhibition.margies.app`
   - `https://exhibition.margies.app` still shows the exhibition
   - `https://www.margies.app` 301s to `https://margies.app`

Alternative: keep everything on the tunnel. Serve this site from a static origin (for example `astro preview` or nginx on another port) and change only the `margies.app` / `www.margies.app` ingress rules to that origin. The Pages approach avoids running another process on the exhibition host.

The exhibition middleware can keep its redirect list for now. Once Cloudflare no longer sends `margies.app` traffic to that app, those rules are unused. Remove them later if you want the exhibition codebase to stop mentioning the root domain.

## Production on the farm server

The live site is served from `192.168.0.146` as a PM2 process, the same way as the exhibition and Metal My Mini.

- Repo: https://github.com/kutu95/margies.git
- Path: `/home/john/apps/margies.app`
- Process: `margies-app`
- Port: `3008` (127.0.0.1)
- Cloudflare Tunnel maps `margies.app` and `www.margies.app` to that port
- `www.margies.app` 301s to `https://margies.app`

After pushing to GitHub:

```sh
ssh john@192.168.0.146 '~/apps/margies.app/scripts/deploy.sh'
```

That pulls `main`, installs dependencies, builds, and reloads PM2. The server uses Node 24 via nvm (see `.nvmrc`).

## Local review

```sh
npm run build
npm run preview
```

Then check `/`, `/projects`, each project page, `/services`, `/about`, `/contact`, `/sitemap-index.xml`, and `/robots.txt` at a desktop width and a phone width.
