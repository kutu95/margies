# Photography images

John: drop replacement photographs here. The pages read paths from Markdown frontmatter, so you should not need to edit components.

## Folders

| Folder | Collection page | Typical subjects |
| --- | --- | --- |
| `georgette/` | `/photography/ss-georgette` | Wreck, Redgate, underwater wreck work, exhibition rooms |
| `underwater/` | `/photography/underwater` | Wrecks, swimmers, marine environments |
| `coast/` | `/photography/coast` | Margaret River beaches, ocean, coastal weather |
| `farm/` | `/photography/farm` | Aquaponics, rural land, systems, people at work |
| `people/` | `/photography/people` | Portraits and documentary work |

## How to replace a placeholder

1. Put the file in the matching folder. Use a short, stable name (`greenhouse.jpg`, not `IMG_4821.JPG`).
2. Prefer JPEG or WebP. Keep a long edge around 1600–2400px. A 4–8MB camera original is too large for the site.
3. Open the matching file in `src/content/photography/` (for example `farm.md`).
4. Point `hero` and each `gallery` item at the new path, starting with `/images/photography/…`.
5. Write `alt` as a plain description of what is in the picture. Do not stuff keywords.
6. Add `title`, `caption`, `location` or `year` only if they are useful. They are all optional except `alt`.
7. Rebuild the site.

Example gallery item:

```yaml
- src: /images/photography/farm/greenhouse.jpg
  alt: Interior of the aquaponics greenhouse with fish tanks and grow beds
  title: Greenhouse
  caption: Morning in the Forest Grove greenhouse.
  location: Forest Grove, Western Australia
  year: "2024"
  width: 2000
  height: 1333
```

`width` and `height` are optional but stop the page jumping while images load. Use the real pixel size.

## Adding a new collection

1. Create a folder here, for example `public/images/photography/caves/`.
2. Add `src/content/photography/caves.md` using an existing collection as a template.
3. The URL becomes `/photography/caves`.
4. Set `featured: true` if it should appear on the home page.

## Current placeholders

These files are labelled stand-ins and should be replaced:

- `farm/hero.svg`
- `farm/landscape.svg`
- `people/hero.svg`

Real photographs already in use:

- Georgette wreck, Redgate, propeller study, exhibition room
- Underwater wreck and swimmer work
- Margaret River coast: Little Rock, Isaac Rock, Celestial Rock, Redgate, sunset
