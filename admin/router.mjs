import { adminEnabled } from "./env.mjs";
import {
  clearCookie,
  createSession,
  csrfOk,
  readSession,
  sessionCookie,
  verifyLogin,
} from "./auth.mjs";
import {
  deleteEntry,
  listEntries,
  pageFromForm,
  photographyFromForm,
  projectFromForm,
  readEntry,
  readSettings,
  validSlug,
  writeEntry,
  writeSettings,
} from "./content.mjs";
import {
  createFolder,
  deleteImage,
  listImages,
  mediaFoldersFromUrl,
  saveUpload,
} from "./media.mjs";
import { clientIp, htmlHeaders, isSecure, readForm, redirect, send } from "./http.mjs";
import { rebuild } from "./rebuild.mjs";
import {
  dashboard,
  layout,
  listPage,
  loginPage,
  mediaPage,
  pageForm,
  photographyForm,
  projectForm,
  settingsForm,
} from "./html.mjs";

function page(res, session, extra, body) {
  send(
    res,
    extra.status ?? 200,
    { ...htmlHeaders, ...extra.headers },
    layout({
      title: extra.title ?? "Admin",
      csrf: session.csrf,
      notice: extra.notice,
      error: extra.error,
      body,
    }),
  );
}

async function publish() {
  await rebuild();
}

export async function handleAdmin(req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith("/admin")) return false;

  if (!adminEnabled()) {
    send(res, 404, htmlHeaders, "Not found");
    return true;
  }

  const secure = isSecure(req);
  const session = readSession(req.headers.cookie ?? "");

  if (url.pathname === "/admin/login") {
    if (req.method === "GET") {
      send(res, session ? 303 : 200, session ? { Location: "/admin" } : htmlHeaders, session ? "" : loginPage({}));
      return true;
    }
    if (req.method === "POST") {
      const { fields } = await readForm(req);
      const result = verifyLogin(fields.username ?? "", fields.password ?? "", clientIp(req));
      if (!result.ok) {
        send(res, 401, htmlHeaders, loginPage({ error: result.error }));
        return true;
      }
      redirect(res, "/admin", { "Set-Cookie": sessionCookie(createSession(), secure) });
      return true;
    }
  }

  if (!session) {
    redirect(res, "/admin/login");
    return true;
  }

  if (url.pathname === "/admin/logout" && req.method === "POST") {
    const { fields } = await readForm(req);
    if (!csrfOk(session, fields.csrf)) {
      send(res, 403, htmlHeaders, "Forbidden");
      return true;
    }
    redirect(res, "/admin/login", { "Set-Cookie": clearCookie(secure) });
    return true;
  }

  try {
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      const [pages, projects, photography] = await Promise.all([
        listEntries("pages"),
        listEntries("projects"),
        listEntries("photography"),
      ]);
      page(res, session, { title: "Admin", notice: url.searchParams.get("notice") }, dashboard({
        pages: pages.length,
        projects: projects.length,
        photography: photography.length,
      }));
      return true;
    }

    if (url.pathname === "/admin/pages") {
      const pages = await listEntries("pages");
      const items = [
        { slug: "settings", data: { title: "Site identity" } },
        ...pages.map((item) => ({
          ...item,
          data: { title: item.data.headline || item.data.seoTitle || item.slug },
        })),
      ];
      page(res, session, { title: "Pages", notice: url.searchParams.get("notice") }, listPage({
        title: "Pages",
        items,
        href: "/admin/pages",
      }));
      return true;
    }

    if (url.pathname === "/admin/pages/settings") {
      if (req.method === "POST") {
        const { fields } = await readForm(req);
        if (!csrfOk(session, fields.csrf)) throw new Error("Session expired. Reload and try again.");
        await writeSettings({
          title: fields.title?.trim(),
          description: fields.description?.trim(),
          tagline: fields.tagline?.trim(),
          jobTitle: fields.jobTitle?.trim(),
          email: fields.email?.trim(),
        });
        await publish();
        redirect(res, "/admin/pages/settings?notice=Saved%20and%20published.");
        return true;
      }
      page(res, session, { title: "Site identity", notice: url.searchParams.get("notice") }, settingsForm({
        settings: await readSettings(),
        csrf: session.csrf,
      }));
      return true;
    }

    const pageMatch = url.pathname.match(/^\/admin\/pages\/([a-z0-9-]+)$/);
    if (pageMatch) {
      const slug = pageMatch[1];
      const entry = await readEntry("pages", slug);
      if (req.method === "POST") {
        const { fields } = await readForm(req);
        if (!csrfOk(session, fields.csrf)) throw new Error("Session expired. Reload and try again.");
        await writeEntry("pages", slug, pageFromForm(slug, fields, entry.data), fields.body ?? entry.body);
        await publish();
        redirect(res, `/admin/pages/${slug}?notice=Saved%20and%20published.`);
        return true;
      }
      page(res, session, { title: entry.data.headline || slug, notice: url.searchParams.get("notice") }, pageForm({
        entry,
        csrf: session.csrf,
      }));
      return true;
    }

    if (url.pathname === "/admin/projects" || url.pathname === "/admin/photography") {
      const kind = url.pathname.endsWith("projects") ? "projects" : "photography";
      const items = await listEntries(kind);
      page(res, session, { title: kind, notice: url.searchParams.get("notice") }, listPage({
        title: kind === "projects" ? "Projects" : "Photography",
        items,
        href: `/admin/${kind}`,
        createHref: `/admin/${kind}/new`,
      }));
      return true;
    }

    const collectionNew = url.pathname.match(/^\/admin\/(projects|photography)\/new$/);
    if (collectionNew) {
      const kind = collectionNew[1];
      if (req.method === "POST") {
        const { fields } = await readForm(req);
        if (!csrfOk(session, fields.csrf)) throw new Error("Session expired. Reload and try again.");
        const slug = (fields.slug ?? "").trim();
        if (!validSlug(slug)) throw new Error("Use a lowercase slug with hyphens only.");
        const data = kind === "projects" ? projectFromForm(fields) : photographyFromForm(fields);
        await writeEntry(kind, slug, data, fields.body ?? "");
        await publish();
        redirect(res, `/admin/${kind}/${slug}?notice=Saved%20and%20published.`);
        return true;
      }
      const empty = { slug: "", data: kind === "projects" ? { disciplines: [], technologies: [], gallery: [], status: "ongoing", featured: false, order: 10 } : { gallery: [], featured: false, order: 10 }, body: "" };
      page(res, session, { title: "New" }, kind === "projects"
        ? projectForm({ entry: empty, csrf: session.csrf, isNew: true })
        : photographyForm({ entry: empty, csrf: session.csrf, isNew: true }));
      return true;
    }

    const collectionMatch = url.pathname.match(/^\/admin\/(projects|photography)\/([a-z0-9-]+)$/);
    if (collectionMatch) {
      const [, kind, slug] = collectionMatch;
      const entry = await readEntry(kind, slug);
      if (req.method === "POST") {
        const { fields } = await readForm(req);
        if (!csrfOk(session, fields.csrf)) throw new Error("Session expired. Reload and try again.");
        if (fields.delete === "1") {
          await deleteEntry(kind, slug);
          await publish();
          redirect(res, `/admin/${kind}?notice=Deleted.`);
          return true;
        }
        const data = kind === "projects" ? projectFromForm(fields) : photographyFromForm(fields);
        await writeEntry(kind, slug, data, fields.body ?? "");
        await publish();
        redirect(res, `/admin/${kind}/${slug}?notice=Saved%20and%20published.`);
        return true;
      }
      page(res, session, { title: entry.data.title || slug, notice: url.searchParams.get("notice") }, kind === "projects"
        ? projectForm({ entry, csrf: session.csrf, isNew: false })
        : photographyForm({ entry, csrf: session.csrf, isNew: false }));
      return true;
    }

    if (url.pathname === "/admin/media" || url.pathname.startsWith("/admin/media/")) {
      const folder = mediaFoldersFromUrl(url.pathname);
      if (req.method === "POST") {
        const { fields, files } = await readForm(req);
        if (!csrfOk(session, fields.csrf)) throw new Error("Session expired. Reload and try again.");
        if (fields.action === "upload") {
          const urlPath = await saveUpload(fields.folder ?? folder, files[0]);
          await publish();
          redirect(res, `/admin/media/${fields.folder ?? folder}?notice=${encodeURIComponent(`Uploaded ${urlPath}`)}`);
          return true;
        }
        if (fields.action === "delete") {
          await deleteImage(fields.path);
          await publish();
          redirect(res, `/admin/media/${folder}?notice=Deleted.`);
          return true;
        }
        if (fields.action === "mkdir") {
          await createFolder(fields.folder ?? folder, fields.name ?? "");
          redirect(res, `/admin/media/${folder}?notice=Folder%20created.`);
          return true;
        }
      }
      const listing = await listImages(folder);
      page(res, session, { title: "Media", notice: url.searchParams.get("notice") }, mediaPage({
        ...listing,
        csrf: session.csrf,
      }));
      return true;
    }

    send(res, 404, htmlHeaders, layout({
      title: "Not found",
      csrf: session.csrf,
      body: "<h1>That admin page is not here.</h1>",
    }));
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    page(res, session, { title: "Error", error: message, status: 400 }, "<p><a href='/admin'>Back to admin</a></p>");
    return true;
  }
}
