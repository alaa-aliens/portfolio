/*
<<<<<<< HEAD
 * Blog posts live in /content/blog/*.md — one file per post.
 * Front matter (between the --- lines):
 *   title, description, date (YYYY-MM-DD), lang (en|ar), cover (a drawing name), tags (comma list), draft (true|false)
 * Drafts show on the hidden v2 site with a "draft" sticker, and never on the live site or in the sitemap.
=======
 * Blog posts live in /content/blog — one story, two files:
 *   my-story.md     → English  (alaa-ali.com/blog/my-story/)
 *   my-story.ar.md  → Arabic   (alaa-ali.com/blog/my-story/ar/)
 * Front matter (between the --- lines): title, description, date (YYYY-MM-DD),
 * category (about|podcast|design|girls|drawing|clients), cover (a drawing name),
 * tags (comma list), featured (true), draft (true|false).
 * Drafts only show on preview builds, never on the live site or in the sitemap.
>>>>>>> main
 */
import { marked } from "marked";

const files = import.meta.glob("/content/blog/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
<<<<<<< HEAD
const drawings = import.meta.glob("../../assets/{comic,covers,cast}/*.webp", { import: "default", eager: true }) as Record<string, string>;

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  lang: "en" | "ar";
  cover?: string;
  tags: string[];
  draft: boolean;
  html: string;
  minutes: number;
}

function parse(path: string, raw: string): Post {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
=======
const drawings = import.meta.glob("../../assets/{comic,covers,cast,blog}/*.webp", { import: "default", eager: true }) as Record<string, string>;

export type Lang = "en" | "ar";
export type Category = "about" | "podcast" | "design" | "girls" | "drawing" | "clients";

export const CATEGORIES: Record<Category, { en: string; ar: string; color: string; emoji: string }> = {
  about: { en: "about me", ar: "عنّي", color: "#ff614c", emoji: "✏️" },
  design: { en: "how i design", ar: "كيف بصمّم", color: "#6A4CFF", emoji: "📐" },
  girls: { en: "my girls", ar: "بناتي", color: "#FF4C79", emoji: "🎹" },
  drawing: { en: "drawing", ar: "الرسم", color: "#FF9F1C", emoji: "🖍️" },
  podcast: { en: "the podcast", ar: "البودكاست", color: "#02B5C9", emoji: "🎙️" },
  clients: { en: "clients", ar: "العملاء", color: "#53B858", emoji: "🤝" },
};

export interface Heading {
  id: string;
  text: string;
}

export interface Post {
  slug: string;
  lang: Lang;
  title: string;
  description: string;
  date: string;
  category: Category;
  cover?: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  order: number;
  html: string;
  headings: Heading[];
  minutes: number;
}

export interface Story {
  slug: string;
  date: string;
  category: Category;
  featured: boolean;
  order: number;
  en?: Post;
  ar?: Post;
}

const slugify = (t: string, i: number) =>
  t
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || `part-${i + 1}`;

function parse(path: string, raw: string): Post {
  const file = path.split("/").pop()!;
  const lang: Lang = file.endsWith(".ar.md") ? "ar" : "en";
  const slug = file.replace(/(\.ar)?\.md$/, "");
>>>>>>> main
  const head = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm: Record<string, string> = {};
  if (head) for (const m of head[1].matchAll(/^(\w+):\s*(.*)$/gm)) fm[m[1]] = m[2].replace(/^["']|["']$/g, "");
  const body = head ? raw.slice(head[0].length) : raw;
  const coverKey = fm.cover && Object.keys(drawings).find((k) => k.endsWith(`/${fm.cover}.webp`));
  const words = body.split(/\s+/).filter(Boolean).length;
<<<<<<< HEAD
  return {
    slug,
    title: fm.title ?? slug,
    description: fm.description ?? "",
    date: fm.date ?? "",
    lang: fm.lang === "ar" ? "ar" : "en",
    cover: coverKey ? drawings[coverKey] : undefined,
    tags: (fm.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    draft: fm.draft === "true",
    html: marked.parse(body, { async: false }) as string,
=======

  // give every ## heading an id, for the "in this note" list and deep links
  const headings: Heading[] = [];
  const html = (marked.parse(body, { async: false }) as string).replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = slugify(text, headings.length);
    headings.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  return {
    slug,
    lang,
    title: fm.title ?? slug,
    description: fm.description ?? "",
    date: fm.date ?? "",
    category: (fm.category as Category) in CATEGORIES ? (fm.category as Category) : "about",
    cover: coverKey ? drawings[coverKey] : undefined,
    tags: (fm.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    featured: fm.featured === "true",
    draft: fm.draft === "true",
    order: Number(fm.order ?? 99),
    html,
    headings,
>>>>>>> main
    minutes: Math.max(1, Math.ceil(words / 180)),
  };
}

const SHOW_DRAFTS = import.meta.env.MODE !== "production";

<<<<<<< HEAD
export const posts: Post[] = Object.entries(files)
  .filter(([p]) => !p.endsWith("/README.md"))
  .map(([p, raw]) => parse(p, raw))
  .filter((p) => SHOW_DRAFTS || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug?: string) => posts.find((p) => p.slug === slug);

export function formatDate(d: string, lang: "en" | "ar") {
=======
const all = Object.entries(files)
  .filter(([p]) => !p.endsWith("/README.md"))
  .map(([p, raw]) => parse(p, raw))
  .filter((p) => SHOW_DRAFTS || !p.draft);

export const stories: Story[] = Object.values(
  all.reduce<Record<string, Story>>((acc, p) => {
    const s = (acc[p.slug] ??= { slug: p.slug, date: p.date, category: p.category, featured: false, order: p.order });
    s[p.lang] = p;
    if (p.date > s.date) s.date = p.date;
    if (p.featured) s.featured = true;
    if (p.lang === "en") s.category = p.category;
    return acc;
  }, {}),
).sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order);

export const getStory = (slug?: string) => stories.find((s) => s.slug === slug);

/** the version in the wanted language, or whichever exists */
export const pick = (s: Story, lang: Lang) => s[lang] ?? s.en ?? s.ar!;

export const postPath = (p: Post) => `/blog/${p.slug}${p.lang === "ar" ? "/ar" : ""}`;

/** same category first, then shared tags, then newest */
export function related(s: Story, n = 3): Story[] {
  const tags = new Set([...(s.en?.tags ?? []), ...(s.ar?.tags ?? [])].map((t) => t.toLowerCase()));
  const score = (o: Story) =>
    (o.category === s.category ? 10 : 0) + [...(o.en?.tags ?? []), ...(o.ar?.tags ?? [])].filter((t) => tags.has(t.toLowerCase())).length;
  return stories
    .filter((o) => o.slug !== s.slug)
    .map((o) => [o, score(o)] as const)
    .sort((a, b) => b[1] - a[1] || b[0].date.localeCompare(a[0].date))
    .slice(0, n)
    .map(([o]) => o);
}

export function formatDate(d: string, lang: Lang) {
>>>>>>> main
  if (!d) return "";
  return new Date(`${d}T12:00:00`).toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
