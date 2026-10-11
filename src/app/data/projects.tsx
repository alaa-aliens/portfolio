/*
 * Every project on the site lives here.
 *
 * To add a project: copy one entry, give it a unique `slug`, and fill in what you have.
 * To publish its case study: set `status: "ready"` and fill `caseStudy`.
 * Anything left empty is simply hidden on the page.
 * Images: drop files in /public/work/<slug>/ and reference them as "/work/<slug>/file.webp".
 */
import React from "react";
import { BravoBravoMark, CarseerMark } from "../components/ProjectFolder";
import imgJawaker from "figma:asset/155eb9c567562f7fc4db482f0e44b69f71f4a7db.png";
import imgTamatem from "figma:asset/316e887e6e85ad89f6a04ace8c986909a43a9089.png";
import imgTrt from "figma:asset/840a0dca576b0360f028ae53fcfd9d51286d8626.png";
import imgSmasco from "figma:asset/7e7f5a4a3ea212183ac00bce26dc64a81509b513.png";
import sibaKidHome from "../../assets/work/siba/kid-home.webp";
import sibaKidLesson from "../../assets/work/siba/kid-lesson.webp";
import sibaKidLessonAr from "../../assets/work/siba/kid-lesson-ar.webp";
import sibaKidPlay from "../../assets/work/siba/kid-play.webp";
import sibaKidStreak from "../../assets/work/siba/kid-streak.webp";
import sibaKidMe from "../../assets/work/siba/kid-me.webp";
import sibaKidMap from "../../assets/work/siba/kid-mindmap.webp";
import sibaKidMatch from "../../assets/work/siba/kid-match.webp";
import sibaParentHome from "../../assets/work/siba/parent-home.webp";
import sibaParentReview from "../../assets/work/siba/parent-review.webp";
import sibaParentHomeAr from "../../assets/work/siba/parent-home-ar.webp";
import sibaParentChild from "../../assets/work/siba/parent-child.webp";
import sibaPoseMug from "../../assets/work/siba/poses/siba-mug.webp";
import sibaPoseWave from "../../assets/work/siba/poses/siba.webp";
import sibaPoseThink from "../../assets/work/siba/poses/siba-think.webp";
import sibaPoseGentle from "../../assets/work/siba/poses/siba-gentle.webp";
import sibaPoseCheer from "../../assets/work/siba/poses/siba-cheer.webp";
import sibaPoseCoin from "../../assets/work/siba/poses/siba-coin.webp";
import sibaPoseBook from "../../assets/work/siba/poses/siba-book.webp";
import sibaPoseWatch from "../../assets/work/siba/poses/siba-watch.webp";
import sibaAlma from "../../assets/work/siba/poses/alma.webp";
import sibaEleen from "../../assets/work/siba/poses/eleen.webp";
import vStart from "../../assets/work/siba/audio/start.mp3";
import vRight3 from "../../assets/work/siba/audio/right3.mp3";
import vCombo3 from "../../assets/work/siba/audio/combo3.mp3";
import vWrong2 from "../../assets/work/siba/audio/wrong2.mp3";
import vFinishHigh from "../../assets/work/siba/audio/finishHigh.mp3";
import vFixStart from "../../assets/work/siba/audio/fixStart.mp3";
import vMe from "../../assets/work/siba/audio/me.mp3";
import vEleenStart from "../../assets/work/siba/audio/eleen-start.mp3";
import vEleenRight3 from "../../assets/work/siba/audio/eleen-right3.mp3";

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
  /** The problem as a hand-drawn storyboard (pain points get circled in red) */
  problemSketch?: { frames: { icon: import("../components/ProblemSketch").SketchIcon; label: string; pain?: string }[]; loop?: string };
  /** Photos/scans of real sketches from the notebook or iPad, shown taped to the page */
  sketches?: { src: string; caption?: string }[];
  /** Who it was really made for (taped-in pictures; tap to hear a greeting) */
  madeFor?: { title?: string; intro: string; people: { name: string; img: string; note: string; audio?: string; line?: string; tint?: string }[]; closing?: string };
  /** A character with moods you can tap through */
  character?: { name: string; intro: string; moods: { img: string; label: string; when: string; line?: string; audio?: string }[] };
  /** How the product sounds */
  sounds?: { intro: string; tones?: ("right" | "wrong" | "combo" | "done" | "coin" | "flip")[]; voices?: { label: string; line: string; audio: string }[] };
  /** The build journey, stop by stop */
  journey?: { date: string; title: string; body: string; img?: string }[];
  /** Up to three screens fanned out under the hero */
  showcase?: { src: string; alt: string }[];
  /** The old way, as a chat, next to the product screen */
  beforeChat?: { lines: { who: "me" | "kid"; text: string }[]; after: string; afterAlt: string; note?: string };
  steps?: {
    title: string;
    body: string;
    image?: string;
    phones?: { src: string; alt: string; caption?: string }[];
  }[];
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
  /** Brand mark shown on the card cover (logo). If omitted, the name is lettered on the cover. */
  mark?: React.ReactNode;
  /** Brand colour behind the mark. Defaults to the category colour. */
  brand?: string;
  /** Short tags shown as chips on the card. */
  tags?: string[];
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
    brand: "#54c8e8",
    mark: <BravoBravoMark className="w-[62%] h-auto" />,
    tags: ["LMS", "Gamification"],
  },
  {
    slug: "carseer",
    name: "Carseer",
    category: "saas",
    featured: true,
    status: "soon",
    proHook: "Comprehensive vehicle history reports platform",
    funHook: "Made car history reports actually readable",
    brand: "#ff9933",
    mark: <CarseerMark className="w-[34%] h-auto" />,
    tags: ["Platform", "Data"],
  },
  {
    slug: "jawaker",
    name: "Jawaker",
    category: "games",
    featured: true,
    status: "soon",
    proHook: "Social card gaming platform profile enhancements",
    funHook: "Redesigned profiles for millions of card game addicts",
    brand: "#111",
    mark: <img src={imgJawaker} alt="" className="w-[52%] h-auto" />,
    tags: ["Games", "Profiles"],
  },
  {
    slug: "tamatem",
    name: "Tamatem +",
    category: "games",
    featured: true,
    status: "soon",
    proHook: "Player engagement & monetization platform",
    funHook: "Made gamers spend money without hating the experience",
    brand: "#ffffff",
    mark: <img src={imgTamatem} alt="" className="w-[56%] h-auto" />,
    tags: ["Games", "Monetization"],
  },
  {
    slug: "trt-news",
    name: "TRT News",
    category: "media",
    featured: true,
    status: "soon",
    proHook: "Multi-platform digital news experience for TRT Arabi",
    funHook: "Made breaking news feel less broken on mobile",
    brand: "#02b5c9",
    mark: <img src={imgTrt} alt="" className="w-[50%] h-auto" />,
    tags: ["News", "Mobile"],
  },
  {
    slug: "smasco-raha",
    name: "Smasco – Raha",
    category: "saas",
    featured: true,
    status: "soon",
    proHook: "Smart building management & tenant services app",
    funHook: 'Made "my AC is broken" feel like a premium interaction',
    brand: "#ffffff",
    mark: <img src={imgSmasco} alt="" className="w-[30%] h-auto" />,
    tags: ["Mobile app", "Services"],
  },

  /* ───────────── My own products ───────────── */
  {
    slug: "siba",
    name: "Siba",
    category: "own",
    status: "ready",
    proHook: "A study app that turns textbook photos into parent-checked lessons, games and quizzes, in Arabic and English.",
    funHook: "I got tired of marking quizzes over iMessage, so I built an app. Without knowing how to code.",
    brand: "#DDF3E8",
    tags: ["Side project", "AI", "Arabic & English"],
    caseStudy: {
      client: "My own product",
      role: "Product design + build (with Claude Code)",
      year: "2026",
      platform: "Web app you install on phone & iPad · Arabic & English",
      funTldr:
        "A UX designer who has never written a line of code builds a full study app for his kids. What could possibly go wrong?",
      showcase: [
        { src: sibaParentHome, alt: "Siba parent home: each child's progress and what needs review" },
        { src: sibaKidHome, alt: "Siba child home: today's lesson, weekly points and lesson list" },
        { src: sibaKidLesson, alt: "Siba lesson screen with study modes: read, cards, match, order, mind map, listen, quiz" },
      ],
      problem: [
        "At home, studying ran on a manual loop: the kids photographed their textbook pages, I used AI to turn them into a summary and a quiz, sent it over iMessage, then marked every answer by hand.",
        "It worked, barely. Nothing was saved, nobody else could see progress, and every quiz cost me an evening. I wanted one place where each child studies, and where a parent stays in control of what the AI produces.",
      ],
      madeFor: {
        title: "Made for Alma & Eleen",
        intro:
          "Siba exists because of two people: my daughters, Alma and Eleen. Every screen started as a question at home. Would Alma open this without being asked? Would Eleen get it before she can read every word on it?",
        people: [
          { name: "Alma", img: sibaAlma, tint: "#FFD6E0", audio: vStart, line: "Ready, Alma? Let's learn something new together!", note: "Plays the piano. Siba says her name in every lesson." },
          { name: "Eleen", img: sibaEleen, tint: "#FFE9C7", audio: vEleenStart, line: "Ready, Eleen? Let's learn something new together!", note: "The youngest tester. She gets her own early-years mode, read aloud." },
        ],
        closing: "The toughest usability testers I've ever had don't care about UX at all. They just know when something's boring.",
      },
      character: {
        name: "Siba",
        intro:
          "Siba is the girls' study buddy, never their teacher. I art-directed her as a 3D character with a pose for every moment, so the app can react like a friend would: coffee in the morning, thinking along during a lesson, and a gentle look when an answer is wrong. Never a red X.",
        moods: [
          { img: sibaPoseMug, label: "Morning", when: "greets her before noon", line: "Good morning, Alma! Ready?" },
          { img: sibaPoseWave, label: "Let's go", when: "starting a lesson", line: "Ready, Alma? Let's learn something new together!", audio: vStart },
          { img: sibaPoseThink, label: "Thinking", when: "during the lesson", line: "Quick check! Tap the right answer." },
          { img: sibaPoseGentle, label: "Not quite", when: "a wrong answer", line: "Almost! Let's see why.", audio: vWrong2 },
          { img: sibaPoseCoin, label: "On fire", when: "three right in a row", line: "Three in a row! You're on fire.", audio: vCombo3 },
          { img: sibaPoseBook, label: "Fix it", when: "the mistakes round", line: "Let's fix the ones you missed, Alma.", audio: vFixStart },
          { img: sibaPoseCheer, label: "Big win", when: "80% or more on a lesson", line: "Amazing, Alma! You nailed this lesson!", audio: vFinishHigh },
          { img: sibaPoseWatch, label: "Evening", when: "greets her after 5 PM", line: "Still studying? Let's make it a quick one." },
        ],
      },
      sounds: {
        intro:
          "Sound was designed like the character: to reward without startling. The UI sounds are tiny tones generated in code, so there's nothing to download, and a wrong answer gets a soft two-note \"hmm\", never a buzzer. Siba's voice is recorded once per line, and every line also shows as a caption.",
        tones: ["right", "wrong", "combo", "done", "coin", "flip"],
        voices: [
          { label: "Her profile", line: "This is your space, Alma. Look how far you've come!", audio: vMe },
          { label: "Right answer · Alma", line: "You got it, Alma!", audio: vRight3 },
          { label: "Right answer · Eleen", line: "You got it, Eleen!", audio: vEleenRight3 },
        ],
      },
      journey: [
        { date: "Before", title: "The iMessage era", body: "Photos in a chat, an AI quiz, and me marking every answer by hand at night." },
        { date: "Sep 2026", title: "First, a list", body: "Siba List: coding, a language, music and reading every day, tied to their allowance. Points instead of checkmarks, so one missed day doesn't wipe out the week." },
        { date: "9 Sep 2026", title: "A name and a look", body: "Named Siba (سيبا), after Sibawayh, the grammarian of Arabic. Chunky buttons with real depth, and gold only ever means points. The first working app came together overnight.", img: sibaPoseWave },
        { date: "Oct 2026", title: "Siba gets a face and a voice", body: "A 3D character with a pose for every mood, and a recorded voice that says each girl's name.", img: sibaPoseCheer },
        { date: "Oct 2026", title: "A mode just for Eleen", body: "Younger kids get the summary read to them, tap-tile challenges, amber instead of red, and the word \"exam\" never appears.", img: sibaEleen },
        { date: "10 Oct 2026", title: "Ready for other families", body: "Accounts for every family, cloud storage, installable on iPhone and iPad, and a splash screen where Siba says hi.", img: sibaPoseCoin },
      ],
      problemSketch: {
        frames: [
          { icon: "phone", label: "The kids snap the textbook pages" },
          { icon: "robot", label: "I ask an AI for a summary and a quiz" },
          { icon: "chat", label: "I send it over iMessage", pain: "lost in the chat by Monday" },
          { icon: "pen", label: "They answer, I mark every one by hand", pain: "every. single. evening." },
          { icon: "eyes", label: "Nobody else can see how they're doing", pain: "not even their mom" },
        ],
        loop: "now repeat for 2 kids × every subject × every week",
      },
      beforeChat: {
        lines: [
          { who: "kid", text: "📷 page 42" },
          { who: "kid", text: "📷 page 43" },
          { who: "me", text: "Got it. Summary + quiz in 10 min" },
          { who: "me", text: "Q1. What does the cell membrane do?" },
          { who: "kid", text: "B" },
          { who: "me", text: "It's C. Read part 2 again 🙃" },
          { who: "kid", text: "can we do the rest tomorrow" },
        ],
        after: sibaKidPlay,
        afterAlt: "Siba guiding the child through a lesson",
        note: "a reconstruction, but honestly not far off",
      },
      steps: [
        {
          title: "Draw the smallest loop that actually helps",
          body: "Photos in. The AI drafts a summary, key facts and an exam. A parent reviews, then publishes. The child studies and sits the exam in the app, and the parent sees what she got wrong without marking anything by hand.",
          phones: [
            { src: sibaParentHome, alt: "Parent home with a review queue", caption: "what needs you, first" },
            { src: sibaParentChild, alt: "A child's progress page", caption: "progress without marking" },
          ],
        },
        {
          title: "Nothing reaches the child until a parent has read it",
          body: "Four sections, four separate confirmations, and the publish button stays dead until all four are ticked, in the interface and in the database. There is deliberately no \"confidence is high, skip the review\" path. A confident wrong answer is the dangerous kind, and only someone who knows the child's book can catch it.",
          phones: [{ src: sibaParentReview, alt: "The four-part review screen with a locked publish button", caption: "publish stays locked" }],
        },
        {
          title: "Study modes come from the page, not the subject",
          body: "A page of definitions supports flashcards and matching. A page describing a process supports ordering. Siba only offers the modes a page can honestly support, and they all read the same reviewed facts, so adding a mode doesn't multiply the parent's review time.",
          phones: [
            { src: sibaKidLesson, alt: "Lesson with study modes", caption: "7 ways into one page" },
            { src: sibaKidMap, alt: "Mind map study mode", caption: "mind map" },
            { src: sibaKidMatch, alt: "Matching study mode", caption: "match" },
          ],
        },
        {
          title: "Bilingual without guessing",
          body: "Arabic and English, right-to-left and left-to-right. The content's language belongs to the material, not the subject: an Arabic science book can still have an English glossary. When detection disagrees, the parent gets a banner, never a silent correction.",
          phones: [
            { src: sibaKidLessonAr, alt: "An Arabic lesson in the child app", caption: "Arabic content" },
            { src: sibaParentHomeAr, alt: "The parent home in Arabic", caption: "Arabic interface" },
          ],
        },
        {
          title: "A streak that can't punish her",
          body: "The streak is a lantern that never goes out on its own: a missed day burns spare oil, and only when the oil runs out does the count restart. The first attempt is the score, and she's told that before she starts. There is no leaderboard between sisters.",
          phones: [
            { src: sibaKidStreak, alt: "Streak lantern screen", caption: "the lantern" },
            { src: sibaKidMe, alt: "Child profile with points and rewards", caption: "points she can spend" },
          ],
        },
        {
          title: "Built by a designer who doesn't code",
          body: "I designed every interaction, then built the app by directing Claude Code. Two AI calls, two models: a strong one reads the phone photos, a cheaper one writes the questions. That keeps a 6-page chapter at a few cents.",
          phones: [{ src: sibaKidPlay, alt: "Siba guiding a lesson", caption: "Siba, the guide" }],
        },
      ],
      results: [
        { value: "7", label: "Ways to study one page" },
        { value: "4", label: "Checks before anything reaches her" },
        { value: "2", label: "Languages, RTL + LTR" },
        { value: "0", label: "Lines of code written by hand" },
      ],
      closing:
        "The rule I kept coming back to: a confident wrong answer is the dangerous kind. So the AI drafts, a parent decides, and the kid just gets to learn.",
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
