// After `vite build`: gives every page its own real HTML file so search engines
// and link previews (LinkedIn, WhatsApp…) see a 200 page with the right title,
// description and a readable text summary, instead of the SPA's 404 fallback.
// Also writes sitemap.xml. Blog posts in content/blog/*.md are included when present.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://alaa-ali.com";
const OUT = process.argv[2] || "dist";
const BASE = (process.argv[3] || "/").replace(/\/?$/, "/"); // "/v2/" for the hidden build

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- pages ---------- */
const pages = [
  { path: "/", title: "Ala'a Ali — UX/UI Designer", desc: "Ala'a Ali is a UX/UI designer, illustrator and workshop facilitator in Amman, Jordan. 15+ years designing apps, dashboards and platforms across MENA.", h1: "Ala'a Ali — UX/UI Designer, Illustrator, Facilitator", priority: "1.0" },
  { path: "/work", title: "Work · Ala'a Ali", desc: "Case studies and projects by Ala'a Ali: apps, dashboards and platforms for startups, game companies and growing teams across MENA.", h1: "Work", priority: "0.8" },
  { path: "/about", title: "About · Ala'a Ali", desc: "From stitching couches in Irbid to designing products across MENA. The story, the doodles, the daughters.", h1: "About Ala'a Ali", priority: "0.6" },
  { path: "/skills", title: "Skills · Ala'a Ali", desc: "What Ala'a brings to the table: UX, UI, illustration, motion, workshops, and shipping my own apps.", h1: "Skills", priority: "0.5" },
  { path: "/experience", title: "Experience · Ala'a Ali", desc: "15+ years: Al Jazeera, TRT, Syntax, Sitech, freelance; teaching at Zain, 42 Amman, HTU; a top-10 podcast.", h1: "Experience", priority: "0.6" },
  { path: "/contact", title: "Contact · Ala'a Ali", desc: "Hire Ala'a for product design, UX audits, workshops, or just say hi. Amman, Jordan.", h1: "Contact Ala'a Ali", priority: "0.5" },
];

/* case studies, read straight from the data file */
const src = readFileSync("src/app/data/projects.tsx", "utf8");
const chunks = src.split(/\n\s*slug:\s*"/).slice(1);
for (const c of chunks) {
  const slug = c.slice(0, c.indexOf('"'));
  const status = (c.match(/status:\s*"(\w+)"/) || [])[1];
  if (status !== "ready") continue;
  const name = (c.match(/\bname:\s*"([^"]+)"/) || [])[1] || slug;
  const hook = (c.match(/proHook:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || "";
  pages.push({ path: `/work/${slug}`, title: `${name} — Case study · Ala'a Ali`, desc: hook.replace(/\\"/g, '"'), h1: `${name}: case study`, priority: "0.8" });
}

/* blog posts (markdown with a small front matter block) */
const posts = [];
if (existsSync("content/blog")) {
  for (const f of readdirSync("content/blog").filter((f) => f.endsWith(".md") && f !== "README.md")) {
    const raw = readFileSync(join("content/blog", f), "utf8");
    const fm = Object.fromEntries(
      [...(raw.match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1].matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
    );
    if (fm.draft === "true") continue;
    const slug = f.replace(/\.md$/, "");
    const body = raw.replace(/^---[\s\S]*?---\n/, "");
    const firstPara = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#") && !p.startsWith("!")) || "";
    posts.push({ slug, ...fm });
    pages.push({
      path: `/blog/${slug}`,
      title: `${fm.title} · Ala'a Ali`,
      desc: fm.description || firstPara.slice(0, 160),
      h1: fm.title,
      text: firstPara.replace(/[*_`#>\[\]]/g, ""),
      lang: fm.lang || "en",
      type: "article",
      date: fm.date,
      priority: "0.7",
    });
  }
  if (posts.length) pages.push({ path: "/blog", title: "Blog · Ala'a Ali", desc: "Hand-drawn notes on UX, design, teaching and building things for my kids. In English and Arabic.", h1: "Blog", priority: "0.7" });
}

/* ---------- write one html file per page ---------- */
const shell = readFileSync(join(OUT, "index.html"), "utf8");
const links = pages.filter((p) => p.path !== "/").map((p) => `<a href="${BASE}${p.path.slice(1)}/">${esc(p.h1)}</a>`).join(" · ");

for (const p of pages) {
  const url = `${SITE}${p.path === "/" ? "/" : `${p.path}/`}`;
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(p.desc)}"`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
    .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(p.title)}"`)
    .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(p.desc)}"`)
    .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${esc(p.title)}"`)
    .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${esc(p.desc)}"`);
  if (p.type === "article") html = html.replace(/(<meta property="og:type" content=")[^"]*"/, `$1article"`);
  if (p.lang === "ar") html = html.replace(/<html[^>]*>/, '<html lang="ar" dir="rtl">');
  // readable text for crawlers that don't run JavaScript (React replaces it on load)
  const fallback = `<main class="seo-fallback" style="max-width:720px;margin:120px auto;padding:0 20px;font-family:Georgia,serif"><h1>${esc(p.h1)}</h1><p>${esc(p.text || p.desc)}</p>${p.date ? `<p><time datetime="${esc(p.date)}">${esc(p.date)}</time></p>` : ""}<nav>${links}</nav></main>`;
  html = html
    .replace("</head>", "<script>document.documentElement.classList.add('js')</script><style>.js .seo-fallback{display:none}</style></head>")
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  const dir = p.path === "/" ? OUT : join(OUT, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}
// unknown urls still fall back to the plain app shell
writeFileSync(join(OUT, "404.html"), shell);

/* ---------- sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path === "/" ? "/" : `${p.path}/`}</loc><lastmod>${p.date || today}</lastmod><priority>${p.priority}</priority></url>`).join("\n")}
</urlset>
`,
);
console.log(`prerender: ${pages.length} pages (${posts.length} posts) + sitemap`);
