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

/* blog posts: content/blog/<slug>.md (English) + <slug>.ar.md (Arabic) */
const posts = [];
if (existsSync("content/blog")) {
  for (const f of readdirSync("content/blog").filter((f) => f.endsWith(".md") && f !== "README.md")) {
    const raw = readFileSync(join("content/blog", f), "utf8");
    const fm = Object.fromEntries(
      [...(raw.match(/^---\n([\s\S]*?)\n---/) || ["", ""])[1].matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
    );
    if (fm.draft === "true") continue;
    const lang = f.endsWith(".ar.md") ? "ar" : "en";
    const slug = f.replace(/(\.ar)?\.md$/, "");
    const body = raw.replace(/^---[\s\S]*?---\n/, "");
    const firstPara = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#") && !p.startsWith("!") && !p.startsWith(">")) || "";
    // the cover drawing as the share image (vite puts it in assets/ with a hash)
    let image;
    if (fm.cover && existsSync(join(OUT, "assets"))) {
      const hit = readdirSync(join(OUT, "assets")).find((a) => a.startsWith(`${fm.cover}-`) && a.endsWith(".webp"));
      if (hit) image = `${SITE}/assets/${hit}`;
    }
    posts.push({ slug, lang, title: fm.title, desc: fm.description || "", date: fm.date, category: fm.category || "about" });
    pages.push({
      path: `/blog/${slug}${lang === "ar" ? "/ar" : ""}`,
      slug,
      title: `${fm.title} · ${lang === "ar" ? "علاء علي" : "Ala'a Ali"}`,
      desc: fm.description || firstPara.slice(0, 160),
      h1: fm.title,
      text: firstPara.replace(/[*_`#>\[\]]/g, ""),
      lang,
      type: "article",
      date: fm.date,
      image,
      category: fm.category || "about",
      priority: "0.7",
    });
  }
  // link each post to its other-language twin (hreflang)
  for (const p of pages.filter((x) => x.slug)) {
    const twins = pages.filter((x) => x.slug === p.slug);
    p.alternates = twins.map((x) => ({ lang: x.lang, url: `${SITE}${x.path}/` }));
  }
  if (posts.length) {
    pages.push({ path: "/blog", title: "Blog · Ala'a Ali", desc: "Hand-drawn notes on UX, design, teaching, the podcast and building things for my kids. In English and Arabic.", h1: "Blog", priority: "0.7", feed: true });
    const TOPICS = { about: "About me", design: "How I design", girls: "My girls", drawing: "Drawing", podcast: "The podcast", clients: "Clients" };
    for (const [c, label] of Object.entries(TOPICS)) {
      if (!posts.some((x) => x.category === c)) continue;
      pages.push({ path: `/blog/topic/${c}`, title: `${label} · Ala'a Ali's blog`, desc: `Notes by Ala'a Ali about ${label.toLowerCase()}, in English and Arabic.`, h1: label, priority: "0.5", feed: true });
    }
  }
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
  if (p.type === "article") {
    html = html.replace(/(<meta property="og:type" content=")[^"]*"/, `$1article"`);
    if (p.image) html = html.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${p.image}"`).replace(/(<meta name="twitter:image" content=")[^"]*"/, `$1${p.image}"`);
    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.h1,
      description: p.desc,
      datePublished: p.date,
      inLanguage: p.lang,
      url,
      image: p.image || `${SITE}/og-image.png`,
      author: { "@type": "Person", name: "Ala'a Ali", url: SITE },
      publisher: { "@type": "Person", name: "Ala'a Ali", url: SITE },
    };
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script></head>`);
  }
  if (p.type === "article" || p.feed) html = html.replace("</head>", `<link rel="alternate" type="application/rss+xml" title="Ala'a Ali — notes" href="${SITE}/blog/rss.xml" /></head>`);
  if (p.lang === "ar") html = html.replace(/<html[^>]*>/, '<html lang="ar">');
  if (p.alternates?.length > 1) {
    const alt = p.alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${a.url}" />`).join("");
    const def = p.alternates.find((a) => a.lang === "en") || p.alternates[0];
    html = html.replace("</head>", `${alt}<link rel="alternate" hreflang="x-default" href="${def.url}" /></head>`);
  }
  // readable text for crawlers that don't run JavaScript (React replaces it on load)
  const fallback = `<main class="seo-fallback"${p.lang === "ar" ? ' dir="rtl"' : ""} style="max-width:720px;margin:120px auto;padding:0 20px;font-family:Georgia,serif"><h1>${esc(p.h1)}</h1><p>${esc(p.text || p.desc)}</p>${p.date ? `<p><time datetime="${esc(p.date)}">${esc(p.date)}</time></p>` : ""}<nav>${links}</nav></main>`;
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
/* ---------- RSS feed for the blog ---------- */
if (posts.length) {
  const items = [...posts]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((x) => {
      const link = `${SITE}/blog/${x.slug}${x.lang === "ar" ? "/ar" : ""}/`;
      return `  <item><title>${esc(x.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${new Date(`${x.date}T09:00:00Z`).toUTCString()}</pubDate><description>${esc(x.desc)}</description><category>${esc(x.category)}</category></item>`;
    })
    .join("\n");
  mkdirSync(join(OUT, "blog"), { recursive: true });
  writeFileSync(
    join(OUT, "blog", "rss.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Ala'a Ali — notes</title><link>${SITE}/blog/</link>
  <description>Notes on UX, design, teaching, the podcast and building things for my kids. English and Arabic.</description>
${items}
</channel></rss>
`,
  );
}
console.log(`prerender: ${pages.length} pages (${posts.length} published post versions) + sitemap`);
