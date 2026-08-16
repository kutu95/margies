const disciplines = [
  "Photography",
  "Software",
  "AI",
  "Electronics",
  "3D",
  "Immersive",
  "Research",
  "Hardware",
];

function escape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function field(label, name, value = "", extra = "") {
  return `<label class="field"><span>${escape(label)}</span><input name="${name}" value="${escape(value)}" ${extra}></label>`;
}

function area(label, name, value = "", rows = 6) {
  return `<label class="field"><span>${escape(label)}</span><textarea name="${name}" rows="${rows}">${escape(value)}</textarea></label>`;
}

function check(label, name, on) {
  return `<label class="check"><input type="checkbox" name="${name}" ${on ? "checked" : ""}> ${escape(label)}</label>`;
}

export function layout({ title, csrf, notice, error, body }) {
  return `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${escape(title)} — Admin</title>
  <style>
    :root { --paper:#f3f1eb; --ink:#171614; --muted:#5c5850; --line:#c9c2b4; --accent:#2f3d32; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font:16px/1.5 "Source Sans 3", "Helvetica Neue", sans-serif; }
    a { color:inherit; }
    header, main { width:min(68rem, calc(100% - 2.5rem)); margin-inline:auto; }
    header { display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; padding:1.2rem 0; border-bottom:1px solid var(--line); }
    .brand { font-family: Georgia, serif; font-size:1.25rem; text-decoration:none; }
    nav { display:flex; flex-wrap:wrap; gap:.8rem 1.1rem; }
    h1,h2 { font-family: Georgia, serif; font-weight:500; letter-spacing:-.02em; }
    h1 { font-size:2rem; margin:1.5rem 0 .6rem; }
    .lede, .muted { color:var(--muted); }
    .notice,.error { padding:.8rem 1rem; margin:1rem 0; }
    .notice { background:#e4eee4; }
    .error { background:#f3e4df; }
    .grid { display:grid; gap:1rem; }
    @media (min-width:760px) { .cards { grid-template-columns:repeat(2,minmax(0,1fr)); } .two { grid-template-columns:1fr 1fr; } }
    .card, .box { display:block; padding:1rem 0; border-top:1px solid var(--line); text-decoration:none; }
    .field { display:grid; gap:.35rem; margin:0 0 1rem; }
    .field span { color:var(--muted); font-size:.85rem; }
    input, textarea, select { width:100%; border:1px solid var(--line); background:#fff; color:var(--ink); font:inherit; padding:.65rem .75rem; }
    textarea { resize:vertical; }
    .check { display:flex; gap:.5rem; align-items:center; margin:0 0 1rem; }
    .check input { width:auto; }
    .row { display:grid; gap:.6rem; padding:1rem 0; border-top:1px solid var(--line); }
    .actions { display:flex; flex-wrap:wrap; gap:.7rem; margin:1.5rem 0 3rem; }
    button, .button { display:inline-flex; align-items:center; min-height:2.6rem; padding:.5rem 1rem; border:1px solid var(--ink); background:var(--ink); color:var(--paper); font:inherit; text-decoration:none; cursor:pointer; }
    .ghost { background:transparent; color:var(--ink); }
    .danger { background:transparent; color:#7a2a1c; border-color:#7a2a1c; }
    .media { display:grid; gap:1rem; grid-template-columns:repeat(auto-fill,minmax(10rem,1fr)); }
    .media figure { margin:0; }
    .media img { width:100%; aspect-ratio:1; object-fit:cover; background:#e8e4da; }
    .thumb { font-size:.8rem; color:var(--muted); word-break:break-all; }
    .login { max-width:24rem; margin:4rem auto; }
  </style>
</head>
<body>
  <header>
    <a class="brand" href="/admin">margies.app admin</a>
    <nav>
      <a href="/admin">Home</a>
      <a href="/admin/pages">Pages</a>
      <a href="/admin/projects">Projects</a>
      <a href="/admin/photography">Photography</a>
      <a href="/admin/media">Media</a>
      <a href="/" target="_blank" rel="noopener">View site</a>
      <form method="post" action="/admin/logout" style="display:inline">
        <input type="hidden" name="csrf" value="${escape(csrf)}">
        <button class="ghost" type="submit">Log out</button>
      </form>
    </nav>
  </header>
  <main>
    ${notice ? `<p class="notice">${escape(notice)}</p>` : ""}
    ${error ? `<p class="error">${escape(error)}</p>` : ""}
    ${body}
  </main>
  <script>
    document.querySelectorAll("[data-add]").forEach((button) => {
      button.addEventListener("click", () => {
        const mount = document.getElementById(button.dataset.add);
        const template = document.getElementById(button.dataset.template);
        if (!mount || !template) return;
        const index = mount.children.length;
        mount.insertAdjacentHTML("beforeend", template.innerHTML.replaceAll("__i__", String(index)));
      });
    });
  </script>
</body>
</html>`;
}

export function loginPage({ error }) {
  return `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin login</title>
  <style>
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:#f3f1eb; color:#171614; font:16px/1.5 "Helvetica Neue", sans-serif; }
    form { width:min(22rem, calc(100% - 2rem)); display:grid; gap:.8rem; }
    h1 { font-family:Georgia,serif; font-weight:500; }
    input { border:1px solid #c9c2b4; padding:.7rem .8rem; font:inherit; }
    button { border:1px solid #171614; background:#171614; color:#f3f1eb; padding:.7rem 1rem; font:inherit; }
    .error { color:#7a2a1c; }
  </style>
</head>
<body>
  <form method="post" action="/admin/login">
    <h1>Admin</h1>
    ${error ? `<p class="error">${escape(error)}</p>` : ""}
    <input name="username" autocomplete="username" placeholder="Username" required>
    <input name="password" type="password" autocomplete="current-password" placeholder="Password" required>
    <button type="submit">Log in</button>
  </form>
</body>
</html>`;
}

export function dashboard({ pages, projects, photography }) {
  return `
    <h1>Admin</h1>
    <p class="lede">Edit copy, collections and images. Saving publishes a new build of the public site. Changes are stored in <code>data/</code> on this server so a later git deploy does not overwrite them.</p>
    <div class="grid cards">
      <a class="card" href="/admin/pages"><h2>Pages</h2><p class="muted">${pages} editable pages and site identity.</p></a>
      <a class="card" href="/admin/projects"><h2>Projects</h2><p class="muted">${projects} project pages.</p></a>
      <a class="card" href="/admin/photography"><h2>Photography</h2><p class="muted">${photography} collections.</p></a>
      <a class="card" href="/admin/media"><h2>Media</h2><p class="muted">Upload and replace images.</p></a>
    </div>`;
}

export function listPage({ title, items, href, createHref }) {
  const rows = items.map((item) => {
    const label = item.data.title || item.slug;
    return `<a class="card" href="${href}/${encodeURIComponent(item.slug)}"><strong>${escape(label)}</strong><p class="muted">${escape(item.slug)}</p></a>`;
  }).join("");
  return `
    <h1>${escape(title)}</h1>
    ${createHref ? `<p><a class="button" href="${createHref}">Add new</a></p>` : ""}
    <div class="grid">${rows || "<p class='muted'>Nothing here yet.</p>"}</div>`;
}

function galleryEditor(images = []) {
  const rows = images.map((image, i) => galleryRow(i, image)).join("");
  return `
    <h2>Gallery</h2>
    <div id="gallery-rows">${rows}</div>
    <p><button type="button" class="ghost" data-add="gallery-rows" data-template="gallery-template">Add image</button></p>
    <template id="gallery-template">${galleryRow("__i__", {})}</template>`;
}

function galleryRow(i, image) {
  return `<div class="row two">
    ${field("Image path", `gallery_src_${i}`, image.src ?? "", `placeholder="/images/..."`)}
    ${field("Alt text", `gallery_alt_${i}`, image.alt ?? "")}
    ${field("Title", `gallery_title_${i}`, image.title ?? "")}
    ${field("Caption", `gallery_caption_${i}`, image.caption ?? "")}
    ${field("Location", `gallery_location_${i}`, image.location ?? "")}
    ${field("Year", `gallery_year_${i}`, image.year ?? "")}
    ${field("Width", `gallery_width_${i}`, image.width ?? "")}
    ${field("Height", `gallery_height_${i}`, image.height ?? "")}
  </div>`;
}

function pairEditor(id, prefix, label, items = []) {
  const rows = items.map((item, i) => pairRow(prefix, i, item)).join("");
  return `
    <h2>${escape(label)}</h2>
    <div id="${id}">${rows}</div>
    <p><button type="button" class="ghost" data-add="${id}" data-template="${id}-template">Add item</button></p>
    <template id="${id}-template">${pairRow(prefix, "__i__", {})}</template>`;
}

function pairRow(prefix, i, item) {
  return `<div class="row two">
    ${field("Title", `${prefix}_title_${i}`, item.title ?? "")}
    ${area("Text", `${prefix}_text_${i}`, item.text ?? "", 3)}
  </div>`;
}

export function settingsForm({ settings, csrf }) {
  return `
    <h1>Site identity</h1>
    <form method="post">
      <input type="hidden" name="csrf" value="${escape(csrf)}">
      ${field("Site title", "title", settings.title, "required")}
      ${area("Site description", "description", settings.description, 4)}
      ${field("Tagline", "tagline", settings.tagline)}
      ${field("Job title", "jobTitle", settings.jobTitle)}
      ${field("Email", "email", settings.email, `type="email"`)}
      <div class="actions"><button type="submit">Save and publish</button></div>
    </form>`;
}

export function pageForm({ entry, csrf }) {
  const { slug, data, body } = entry;
  const extras = [];
  if (slug === "home") {
    extras.push(`
      ${field("Hero image", "heroImage", data.heroImage ?? "")}
      ${field("Hero alt text", "heroAlt", data.heroAlt ?? "")}
      ${field("Headline", "headline", data.headline ?? "")}
      ${area("Lede", "lede", data.lede ?? "", 3)}
      <div class="two grid">
        ${field("Photography kicker", "photoKicker", data.photoKicker ?? "")}
        ${field("Photography title", "photoTitle", data.photoTitle ?? "")}
        ${field("Photography link", "photoLink", data.photoLink ?? "")}
        ${field("Projects kicker", "projectsKicker", data.projectsKicker ?? "")}
        ${field("Projects title", "projectsTitle", data.projectsTitle ?? "")}
        ${field("Projects link", "projectsLink", data.projectsLink ?? "")}
        ${field("Work kicker", "workKicker", data.workKicker ?? "")}
        ${field("Work title", "workTitle", data.workTitle ?? "")}
        ${field("Work link", "workLink", data.workLink ?? "")}
      </div>
      ${pairEditor("caps", "cap", "What the work looks like", data.capabilities)}
      ${field("About kicker", "aboutKicker", data.aboutKicker ?? "")}
      ${field("About title", "aboutTitle", data.aboutTitle ?? "")}
      ${area("About paragraphs (one per box, add lines below)", "aboutParagraphs[]", (data.aboutParagraphs ?? [])[0] ?? "", 3)}
      ${(data.aboutParagraphs ?? []).slice(1).map((paragraph) => area("About paragraph", "aboutParagraphs[]", paragraph, 3)).join("")}
      ${area("About paragraph", "aboutParagraphs[]", "", 3)}
      ${field("About link", "aboutLink", data.aboutLink ?? "")}
      ${field("Closing title", "ctaTitle", data.ctaTitle ?? "")}
      ${area("Closing text", "ctaText", data.ctaText ?? "", 2)}
    `);
  } else {
    extras.push(`
      ${data.kicker !== undefined || ["about", "services", "contact", "photography", "projects"].includes(slug) ? field("Kicker", "kicker", data.kicker ?? "") : ""}
      ${field("Headline", "headline", data.headline ?? "")}
      ${area("Lede", "lede", data.lede ?? "", 3)}
      ${slug === "about" ? field("Portrait image", "image", data.image ?? "") + field("Portrait alt", "imageAlt", data.imageAlt ?? "") + field("Portrait caption", "imageCaption", data.imageCaption ?? "") : ""}
      ${slug === "photography" ? field("Share image", "heroImage", data.heroImage ?? "") + field("Share image alt", "heroAlt", data.heroAlt ?? "") : ""}
      ${slug === "services" ? field("Kinds heading", "kindsTitle", data.kindsTitle ?? "") + pairEditor("kinds", "kind", "Kinds of work", data.kinds) : ""}
    `);
  }

  const showBody = slug !== "home" && slug !== "contact" && slug !== "photography" && slug !== "projects";

  return `
    <h1>${escape(data.headline || data.seoTitle || slug)}</h1>
    <p class="muted">/${slug === "home" ? "" : slug}</p>
    <form method="post">
      <input type="hidden" name="csrf" value="${escape(csrf)}">
      ${field("SEO title", "seoTitle", data.seoTitle ?? "")}
      ${area("SEO description", "seoDescription", data.seoDescription ?? "", 3)}
      ${extras.join("")}
      ${showBody ? area("Page text (Markdown)", "body", body, 18) : ""}
      <div class="actions"><button type="submit">Save and publish</button></div>
    </form>`;
}

export function projectForm({ entry, csrf, isNew }) {
  const data = entry.data ?? {};
  const disciplineBoxes = disciplines.map((item) =>
    check(item, "disciplines[]", (data.disciplines ?? []).includes(item)),
  ).join("");
  const meta = data.meta
    ? Object.entries(data.meta).map(([key, value]) => `${key}: ${value}`).join("\n")
    : "";
  return `
    <h1>${isNew ? "New project" : escape(data.title || entry.slug)}</h1>
    <form method="post">
      <input type="hidden" name="csrf" value="${escape(csrf)}">
      ${field("Slug", "slug", entry.slug ?? "", isNew ? "required" : "readonly")}
      ${field("Title", "title", data.title ?? "", "required")}
      ${area("Summary", "summary", data.summary ?? "", 3)}
      ${field("Category", "category", data.category ?? "")}
      <p class="muted">Disciplines</p>
      ${disciplineBoxes}
      ${area("Technologies (one per line)", "technologies", (data.technologies ?? []).join("\n"), 5)}
      <label class="field"><span>Status</span>
        <select name="status">
          ${["live", "ongoing", "experimental", "internal"].map((status) =>
            `<option value="${status}" ${data.status === status ? "selected" : ""}>${status}</option>`,
          ).join("")}
        </select>
      </label>
      ${field("Live URL", "url", data.url ?? "")}
      ${field("Live URL label", "urlLabel", data.urlLabel ?? "")}
      ${field("Related photography slug", "relatedPhotography", data.relatedPhotography ?? "")}
      ${field("Hero image", "hero", data.hero ?? "")}
      ${field("Hero alt text", "heroAlt", data.heroAlt ?? "")}
      ${field("Year", "year", data.year ?? "")}
      ${field("Order", "order", data.order ?? 0, `type="number"`)}
      ${check("Featured on the home page", "featured", Boolean(data.featured))}
      ${field("SEO title", "seoTitle", data.seoTitle ?? "")}
      ${area("SEO description", "seoDescription", data.seoDescription ?? "", 3)}
      ${area("Meta (Key: value, one per line)", "meta", meta, 4)}
      ${galleryEditor(data.gallery)}
      ${area("Page text (Markdown)", "body", entry.body ?? "", 18)}
      <div class="actions">
        <button type="submit">Save and publish</button>
        ${!isNew ? `<button class="danger" name="delete" value="1">Delete</button>` : ""}
      </div>
    </form>`;
}

export function photographyForm({ entry, csrf, isNew }) {
  const data = entry.data ?? {};
  return `
    <h1>${isNew ? "New collection" : escape(data.title || entry.slug)}</h1>
    <form method="post">
      <input type="hidden" name="csrf" value="${escape(csrf)}">
      ${field("Slug", "slug", entry.slug ?? "", isNew ? "required" : "readonly")}
      ${field("Title", "title", data.title ?? "", "required")}
      ${area("Description", "description", data.description ?? "", 3)}
      ${field("Hero image", "hero", data.hero ?? "")}
      ${field("Hero alt text", "heroAlt", data.heroAlt ?? "")}
      ${field("Year", "year", data.year ?? "")}
      ${field("Location", "location", data.location ?? "")}
      ${field("Related project slug", "relatedProject", data.relatedProject ?? "")}
      ${field("Related project label", "relatedProjectLabel", data.relatedProjectLabel ?? "")}
      ${field("External URL", "url", data.url ?? "")}
      ${field("External URL label", "urlLabel", data.urlLabel ?? "")}
      ${field("Order", "order", data.order ?? 0, `type="number"`)}
      ${check("Featured on the home page", "featured", Boolean(data.featured))}
      ${field("SEO title", "seoTitle", data.seoTitle ?? "")}
      ${area("SEO description", "seoDescription", data.seoDescription ?? "", 3)}
      ${galleryEditor(data.gallery)}
      ${area("Page text (Markdown)", "body", entry.body ?? "", 14)}
      <div class="actions">
        <button type="submit">Save and publish</button>
        ${!isNew ? `<button class="danger" name="delete" value="1">Delete</button>` : ""}
      </div>
    </form>`;
}

export function mediaPage({ folder, folders, files, csrf }) {
  const crumbs = ["<a href='/admin/media'>images</a>"];
  const parts = folder ? folder.split("/") : [];
  let trail = "";
  for (const part of parts) {
    trail = trail ? `${trail}/${part}` : part;
    crumbs.push(`<a href="/admin/media/${trail}">${escape(part)}</a>`);
  }
  const folderLinks = folders.map((name) => {
    const href = folder ? `/admin/media/${folder}/${name}` : `/admin/media/${name}`;
    return `<a class="card" href="${href}">${escape(name)}/</a>`;
  }).join("");
  const fileCards = files.map((file) => `
    <figure>
      <img src="${escape(file.url)}" alt="">
      <figcaption class="thumb">${escape(file.url)}<br>${Math.round(file.bytes / 1024)} KB</figcaption>
      <form method="post">
        <input type="hidden" name="csrf" value="${escape(csrf)}">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="path" value="${escape(file.relative)}">
        <button class="danger" type="submit">Delete</button>
      </form>
    </figure>`).join("");

  return `
    <h1>Media</h1>
    <p class="muted">${crumbs.join(" / ")}</p>
    <div class="grid">${folderLinks}</div>
    <div class="box">
      <h2>Upload</h2>
      <form method="post" enctype="multipart/form-data">
        <input type="hidden" name="csrf" value="${escape(csrf)}">
        <input type="hidden" name="action" value="upload">
        <input type="hidden" name="folder" value="${escape(folder)}">
        <label class="field"><span>Image</span><input type="file" name="file" accept="image/*" required></label>
        <button type="submit">Upload</button>
      </form>
      <form method="post" style="margin-top:1.5rem">
        <input type="hidden" name="csrf" value="${escape(csrf)}">
        <input type="hidden" name="action" value="mkdir">
        <input type="hidden" name="folder" value="${escape(folder)}">
        ${field("New folder", "name", "")}
        <button class="ghost" type="submit">Create folder</button>
      </form>
    </div>
    <div class="media">${fileCards}</div>`;
}
