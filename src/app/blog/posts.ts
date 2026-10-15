/*
 * Blog posts live in /content/blog/*.md — one file per post.
 * Front matter (between the --- lines):
 *   title, description, date (YYYY-MM-DD), lang (en|ar), cover (a drawing name), tags (comma list), draft (true|false)
 * Drafts show on the hidden v2 site with a "draft" sticker, and never on the live site or in the sitemap.
 */
import { marked } from "marked";

const files = import.meta.glob("/content/blog/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
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
  const head = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm: Record<string, string> = {};
  if (head) for (const m of head[1].matchAll(/^(\w+):\s*(.*)$/gm)) fm[m[1]] = m[2].replace(/^["']|["']$/g, "");
  const body = head ? raw.slice(head[0].length) : raw;
  const coverKey = fm.cover && Object.keys(drawings).find((k) => k.endsWith(`/${fm.cover}.webp`));
  const words = body.split(/\s+/).filter(Boolean).length;
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
    minutes: Math.max(1, Math.ceil(words / 180)),
  };
}

const SHOW_DRAFTS = import.meta.env.MODE !== "production";

export const posts: Post[] = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .filter((p) => SHOW_DRAFTS || !p.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug?: string) => posts.find((p) => p.slug === slug);

export function formatDate(d: string, lang: "en" | "ar") {
  if (!d) return "";
  return new Date(`${d}T12:00:00`).toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
