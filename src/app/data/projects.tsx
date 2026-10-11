/*
 * Every project on the site lives here.
 *
 * To add a project: copy one entry, give it a unique `slug`, and fill in what you have.
 * To publish its case study: set `status: "ready"` and fill `caseStudy`.
 * Anything left empty is simply hidden on the page.
 * Images: drop files in /public/work/<slug>/ and reference them as "/work/<slug>/file.webp".
 */
import React from "react";
import {
  BravoBravoLogo,
  CarseerLogo,
  ImageLogo,
  TextLogo,
} from "../components/ProjectFolder";
import imgJawaker from "figma:asset/155eb9c567562f7fc4db482f0e44b69f71f4a7db.png";
import imgTamatem from "figma:asset/316e887e6e85ad89f6a04ace8c986909a43a9089.png";
import imgTrt from "figma:asset/840a0dca576b0360f028ae53fcfd9d51286d8626.png";
import imgSmasco from "figma:asset/7e7f5a4a3ea212183ac00bce26dc64a81509b513.png";

export type CategoryKey = "gov" | "saas" | "fintech" | "edtech" | "games" | "media" | "own";

export const categories: Record<
  CategoryKey,
  { title: string; funTitle: string; color: string }
> = {
  gov: { title: "Government & Enterprise", funTitle: "Big Serious Orgs", color: "#FF614C" },
  saas: { title: "Platforms & SaaS", funTitle: "Cloud Stuff", color: "#6A4CFF" },
  fintech: { title: "Fintech & Commerce", funTitle: "Money Things", color: "#53B858" },
  edtech: { title: "EdTech & Learning", funTitle: "Brainy Apps", color: "#FF4C79" },
  games: { title: "Games & Entertainment", funTitle: "Fun & Games", color: "#1F1F1F" },
  media: { title: "Media & Branding", funTitle: "Artsy Stuff", color: "#FF9F1C" },
  own: { title: "My Own Products", funTitle: "Stuff I Built for Me", color: "#02B5C9" },
};

export interface CaseStudy {
  /** Short "who / what / when" row under the title */
  client?: string;
  role?: string;
  year?: string;
  platform?: string;
  /** One-line fun summary shown in Fun mode under the hook */
  funTldr?: string;
  problem?: string[];
  steps?: { title: string; body: string; image?: string }[];
  before?: string;
  after?: string;
  results?: { value: string; label: string }[];
  gallery?: string[];
  /** Optional closing quote or reflection */
  closing?: string;
}

export interface Project {
  slug: string;
  name: string;
  category: CategoryKey;
  featured?: boolean;
  status: "ready" | "soon";
  proHook?: string;
  funHook?: string;
  /** Custom folder art; if omitted, a lettered folder in the category colour is drawn. */
  folder?: (isHovered: boolean) => React.ReactNode;
  caseStudy?: CaseStudy;
}

export const projects: Project[] = [
  /* ───────────── Featured (shown on the homepage) ───────────── */
  {
    slug: "bravobravo",
    name: "BravoBravo",
    category: "edtech",
    featured: true,
    status: "soon",
    proHook: "Gamified reading system & LMS for schools",
    funHook: "Made homework less painful (you're welcome, kids)",
    folder: (h) => <BravoBravoLogo isHovered={h} />,
  },
  {
    slug: "carseer",
    name: "Carseer",
    category: "saas",
    featured: true,
    status: "soon",
    proHook: "Comprehensive vehicle history reports platform",
    funHook: "Made car history reports actually readable",
    folder: (h) => <CarseerLogo isHovered={h} />,
  },
  {
    slug: "jawaker",
    name: "Jawaker",
    category: "games",
    featured: true,
    status: "soon",
    proHook: "Social card gaming platform profile enhancements",
    funHook: "Redesigned profiles for millions of card game addicts",
    folder: (h) => (
      <ImageLogo src={imgJawaker} bgColor="#000" imgClass="w-16 h-7 object-contain" isHovered={h} />
    ),
  },
  {
    slug: "tamatem",
    name: "Tamatem +",
    category: "games",
    featured: true,
    status: "soon",
    proHook: "Player engagement & monetization platform",
    funHook: "Made gamers spend money without hating the experience",
    folder: (h) => (
      <ImageLogo src={imgTamatem} bgColor="#fff" imgClass="w-20 h-10 object-contain" isHovered={h} />
    ),
  },
  {
    slug: "trt-news",
    name: "TRT News",
    category: "media",
    featured: true,
    status: "soon",
    proHook: "Multi-platform digital news experience for TRT Arabi",
    funHook: "Made breaking news feel less broken on mobile",
    folder: (h) => (
      <ImageLogo src={imgTrt} bgColor="#02b5c9" imgClass="w-[100px] h-[52px] object-contain" isHovered={h} />
    ),
  },
  {
    slug: "smasco-raha",
    name: "Smasco – Raha",
    category: "saas",
    featured: true,
    status: "soon",
    proHook: "Smart building management & tenant services app",
    funHook: 'Made "my AC is broken" feel like a premium interaction',
    folder: (h) => (
      <ImageLogo src={imgSmasco} bgColor="#fff" imgClass="w-14 h-12 object-contain" isHovered={h} />
    ),
  },

  /* ───────────── My own products ───────────── */
  {
    slug: "siba",
    name: "Siba",
    category: "own",
    status: "ready",
    proHook: "A study app that turns textbook photos into parent-reviewed summaries and quizzes.",
    funHook: "I got tired of marking quizzes over iMessage, so I built an app. Without knowing how to code.",
    folder: (h) => <TextLogo text="سيبا" bgColor="#02B5C9" fontSize="24px" isHovered={h} />,
    caseStudy: {
      client: "My own product",
      role: "Product design + build (with Claude Code)",
      year: "2026",
      platform: "Responsive web · Arabic & English",
      funTldr:
        "A UX designer who has never written a line of code builds a full study app for his kids. What could possibly go wrong?",
      problem: [
        "At home, studying ran on a manual loop: the kids photographed their textbook pages, I used AI to turn them into a summary and a quiz, sent it over iMessage, then marked every answer by hand.",
        "It worked — barely. Nothing was saved, nobody else could see progress, and every quiz cost me an evening. I wanted a real product: one place where each child studies, and where a parent stays in control of what the AI produces.",
      ],
      steps: [
        {
          title: "Draw the smallest loop that actually helps",
          body: "Photo in → AI drafts a summary and a 20-question exam → parent reviews and edits → publish → the child takes it in-app with auto-scoring, wrong-answer review and retries. Everything else (analytics, extra modes) waited for v1.",
        },
        {
          title: "AI is always a draft",
          body: "Either side can upload, but only the parent publishes. The AI never talks to the child directly — a deliberate trust decision that shaped every screen on the parent side.",
        },
        {
          title: "Bilingual from day one",
          body: "Arabic and English, RTL and LTR, any subject, ages 8 to 16. The content language is independent of the interface language, so an English-UI child can still study an Arabic textbook.",
        },
        {
          title: "Make studying feel like a game",
          body: "Inspired by Duolingo and Brilliant: streaks, points and badges, chunky buttons with real depth, and a tablet-landscape layout for the student side. Points tie into the allowance system we already use at home.",
        },
        {
          title: "Build it without being a developer",
          body: "I designed every interaction, then built the working app by directing Claude Code on a boring, well-documented stack (Next.js, TypeScript, Tailwind). Both sides — parent and student — run fully in Arabic and English.",
        },
      ],
      results: [
        { value: "2", label: "Full apps — parent & student" },
        { value: "2", label: "Languages, RTL + LTR" },
        { value: "1–4", label: "Kids per family supported" },
        { value: "0", label: "Lines of code written by hand" },
      ],
      closing:
        "Next up: proving the AI can read real, slightly blurry Jordanian textbook pages — Arabic especially — before it goes anywhere near other families.",
    },
  },
  {
    slug: "tracktack",
    name: "TrackTack",
    category: "own",
    status: "soon",
    proHook: "A spending tracker for my own business, designed and built with AI.",
    funHook: "Finally found out where the money goes. Didn't like the answer.",
  },

  /* ───────────── Government & Enterprise ───────────── */
  { slug: "saudi-moj", name: "Saudi Ministry of Justice", category: "gov", status: "soon" },
  { slug: "uae-gov", name: "UAE Gov Platforms", category: "gov", status: "soon" },
  { slug: "queen-alia-airport", name: "Queen Alia Airport", category: "gov", status: "soon" },
  { slug: "palestine-museum", name: "Palestine Museum", category: "gov", status: "soon" },

  /* ───────────── Platforms & SaaS ───────────── */
  {
    slug: "trackhawk",
    name: "Trackhawk GPS",
    category: "saas",
    status: "soon",
    proHook: "Fleet & asset tracking, redesigned for people who aren't tech people.",
    funHook: "Made tracking 100 trucks feel calmer than tracking one pizza.",
  },
  { slug: "invoiceq", name: "InvoiceQ", category: "saas", status: "soon" },
  { slug: "zinc", name: "Zinc Platform", category: "saas", status: "soon" },
  { slug: "cms-inbox", name: "CMS Inbox", category: "saas", status: "soon" },

  /* ───────────── Fintech & Commerce ───────────── */
  { slug: "aranpay", name: "Aranpay", category: "fintech", status: "soon" },
  { slug: "gold-marketplace", name: "Gold Marketplace", category: "fintech", status: "soon" },
  { slug: "donation-platform", name: "Donation Platform", category: "fintech", status: "soon" },

  /* ───────────── EdTech & Learning ───────────── */
  { slug: "ana-athkar", name: "Ana Athkar", category: "edtech", status: "soon" },
  { slug: "glool", name: "Glool LMS", category: "edtech", status: "soon" },
  { slug: "tabshora", name: "Tabshora LMS", category: "edtech", status: "soon" },
  { slug: "sadaqa", name: "SADAQA", category: "edtech", status: "soon" },

  /* ───────────── Media & Branding ───────────── */
  { slug: "al-jazeera-visuals", name: "Al Jazeera Visuals", category: "media", status: "soon" },
  { slug: "water-table", name: "Water Table Project", category: "media", status: "soon" },
  { slug: "ey-illustration", name: "EY Illustration System", category: "media", status: "soon" },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string | undefined) {
  return projects.find((p) => p.slug === slug);
}

/** Next project that has a published case study (wraps around). */
export function getNextReady(slug: string) {
  const ready = projects.filter((p) => p.status === "ready");
  if (ready.length < 2) return undefined;
  const i = ready.findIndex((p) => p.slug === slug);
  return ready[(i + 1) % ready.length];
}

/** Folder art for any project, with a lettered fallback. */
export function renderFolder(p: Project, isHovered: boolean) {
  if (p.folder) return p.folder(isHovered);
  const initials = p.name
    .replace(/[^A-Za-z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <TextLogo
      text={initials || p.name.slice(0, 2)}
      bgColor={categories[p.category].color}
      fontSize="26px"
      isHovered={isHovered}
    />
  );
}
