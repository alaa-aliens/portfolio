/*
 * The blog: notes on UX, drawing, teaching, the podcast and building things for my kids.
 * Every story comes in English and Arabic.
 *   /blog               all notes (featured note, topics, search)
 *   /blog/topic/:cat    one topic
 *   /blog/:slug         English post      /blog/:slug/ar   Arabic post
 * Content lives in /content/blog/*.md (see the README there).
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { HeadBadge } from "../components/play/HeadBadge";
import { Tsuzuku } from "../components/play/ToBeContinued";
import { addScore } from "../components/play/Score";
import { Button, RoughBox, Scribble } from "../components/ui/Kit";
import { usePageMeta } from "../usePageMeta";
import { CATEGORIES, formatDate, getStory, pick, postPath, related, stories, type Category, type Lang, type Post, type Story } from "../blog/posts";

const T = {
  en: {
    read: "read it →",
    min: (n: number) => `${n} min read`,
    all: "← all notes",
    hi: "say hi",
    other: "اقرأها بالعربي",
    sign: "ux director, illustrator, dad. amman.",
    toc: "in this note",
    share: "pass it on",
    copy: "copy link",
    copied: "copied ✓",
    more: "more notes like this",
    search: "search the notes…",
    allTopics: "everything",
    none: "nothing matches. try another word?",
    latest: "the latest note",
    prev: "older",
    next: "newer",
  },
  ar: {
    read: "← اقرأ",
    min: (n: number) => `${n} دقائق قراءة`,
    all: "كل الملاحظات →",
    hi: "راسلني",
    other: "Read it in English",
    sign: "مدير تجربة المستخدم، رسّام، وأب. عمّان.",
    toc: "بهالملاحظة",
    share: "شاركها",
    copy: "انسخ الرابط",
    copied: "انسخ ✓",
    more: "ملاحظات شبهها",
    search: "دوّر بالملاحظات…",
    allTopics: "كل شي",
    none: "ولا شي طلع. جرّب كلمة تانية؟",
    latest: "آخر ملاحظة",
    prev: "أقدم",
    next: "أحدث",
  },
};

const arFont = "font-['Noto_Naskh_Arabic']";
const SITE = "https://alaa-ali.com";

/* ---------- small pieces ---------- */

function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex rounded-full border border-black/80 bg-[#fffaf1] p-1" role="radiogroup" aria-label="Language">
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={lang === l}
          onClick={() => onChange(l)}
          className={`rounded-full px-5 py-1.5 text-[14px] transition-colors ${lang === l ? "bg-[#1d1a17] text-[#fdecd0]" : "hover:bg-[#fdecd0]"} ${l === "ar" ? arFont : "font-['Work_Sans']"}`}
        >
          {l === "en" ? "english" : "عربي"}
        </button>
      ))}
    </div>
  );
}

function CategoryTag({ c, lang, linked = true }: { c: Category; lang: Lang; linked?: boolean }) {
  const cat = CATEGORIES[c];
  const cls = `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] text-white ${lang === "ar" ? arFont : "font-['Work_Sans'] lowercase"}`;
  const inner = (
    <>
      <span aria-hidden>{cat.emoji}</span>
      {cat[lang]}
    </>
  );
  return linked ? (
    <Link to={`/blog/topic/${c}`} className={`${cls} hover:brightness-110`} style={{ background: cat.color }}>
      {inner}
    </Link>
  ) : (
    <span className={cls} style={{ background: cat.color }}>
      {inner}
    </span>
  );
}

function Meta({ p }: { p: Post }) {
  return (
    <span className={`text-[12.5px] text-black/55 ${p.lang === "ar" ? arFont : "font-['Shantell_Sans',cursive]"}`}>
      {formatDate(p.date, p.lang)} · {T[p.lang].min(p.minutes)}
    </span>
  );
}

function DraftSticker() {
  return (
    <span className="absolute -top-3 -end-3 rotate-6 z-10 rounded-full border border-black bg-[#FFC53D] px-2.5 py-0.5 font-['Shantell_Sans',cursive] text-[12px]" dir="ltr">
      draft
    </span>
  );
}

function Cover({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div dir="ltr" className={`relative rounded-[10px] bg-[#fdecd0] overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={src} alt="" loading="lazy" className="max-h-[88%] max-w-[88%] object-contain group-hover:scale-105 transition-transform duration-500" />
      </div>
    </div>
  );
}

function PostCard({ p, i, compact = false }: { p: Post; i: number; compact?: boolean }) {
  const ar = p.lang === "ar";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotate: i % 2 ? 1.2 : -1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
      whileHover={{ y: -6, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="relative h-full"
      dir={ar ? "rtl" : "ltr"}
    >
      {p.draft && <DraftSticker />}
      <Link to={postPath(p)} className="block group h-full">
        <RoughBox fill="#fffaf1" radius={14} strokeWidth={1.5} seed={i * 31 + 9} className="p-5 md:p-6 h-full">
          <div className="flex flex-col gap-4">
          {p.cover && <Cover src={p.cover} className={compact ? "aspect-[16/9]" : "aspect-[16/10]"} />}
          <div className={ar ? "text-right" : "text-left"}>
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryTag c={p.category} lang={p.lang} linked={false} />
              <Meta p={p} />
            </div>
            <h3 className={`mt-3 leading-[1.1] ${ar ? `${arFont} font-bold ${compact ? "text-[21px]" : "text-[25px] md:text-[28px]"}` : `font-display lowercase ${compact ? "text-[26px]" : "text-[30px] md:text-[34px]"}`}`}>{p.title}</h3>
            {!compact && <p className={`mt-2 text-black/70 text-[15px] leading-relaxed ${ar ? arFont : "font-['Work_Sans']"}`}>{p.description}</p>}
            <span className={`inline-block mt-3 text-[14px] text-[#ff614c] ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{T[p.lang].read}</span>
          </div>
          </div>
        </RoughBox>
      </Link>
    </motion.article>
  );
}

function FeaturedCard({ p }: { p: Post }) {
  const ar = p.lang === "ar";
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative" dir={ar ? "rtl" : "ltr"}>
      {p.draft && <DraftSticker />}
      <Link to={postPath(p)} className="block group">
        <RoughBox fill="#fffaf1" radius={18} strokeWidth={1.8} seed={3} className="p-5 md:p-8">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-center">
          {p.cover && <Cover src={p.cover} className="aspect-[4/3]" />}
          <div className={ar ? "text-right" : "text-left"}>
            <p className={`text-[13px] uppercase tracking-[0.18em] text-black/45 ${ar ? arFont : "font-['Work_Sans']"}`}>{T[p.lang].latest}</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <CategoryTag c={p.category} lang={p.lang} linked={false} />
              <Meta p={p} />
            </div>
            <h2 className={`mt-4 leading-[1.05] ${ar ? `${arFont} font-bold text-[32px] md:text-[44px]` : "font-display lowercase text-[40px] md:text-[60px] text-[#ff614c]"}`}>{p.title}</h2>
            <p className={`mt-4 text-[16px] md:text-[18px] leading-relaxed text-black/75 ${ar ? arFont : "font-['IBM_Plex_Serif']"}`}>{p.description}</p>
            <span className={`inline-block mt-5 text-[15px] text-[#ff614c] ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{T[p.lang].read}</span>
          </div>
          </div>
        </RoughBox>
      </Link>
    </motion.article>
  );
}

/* ---------- list + topic pages ---------- */

export function BlogPage() {
  const { isProfessional, isArabic } = useMode();
  const { cat } = useParams();
  const navigate = useNavigate();
  const topic = cat && cat in CATEGORIES ? (cat as Category) : undefined;
  const [lang, setLang] = useState<Lang>(isArabic ? "ar" : "en");
  const [q, setQ] = useState("");
  useEffect(() => setLang(isArabic ? "ar" : "en"), [isArabic]);
  const ar = lang === "ar";
  const t = T[lang];

  usePageMeta({
    title: topic ? `${CATEGORIES[topic][lang]} · ${ar ? "مدونة علاء علي" : "Ala'a Ali's blog"}` : ar ? "المدونة · علاء علي" : "Blog · Ala'a Ali",
    description: ar
      ? "ملاحظات مرسومة باليد عن تجربة المستخدم والتصميم والتعليم والبودكاست، وعن بناء أشياء لبناتي. بالعربي والإنجليزي."
      : "Hand-drawn notes on UX, design, teaching, the podcast and building things for my kids. In English and Arabic.",
  });

  const counts = useMemo(() => {
    const c: Partial<Record<Category, number>> = {};
    for (const s of stories) c[s.category] = (c[s.category] ?? 0) + 1;
    return c;
  }, []);

  const needle = q.trim().toLowerCase();
  const list = stories.filter((s) => {
    if (topic && s.category !== topic) return false;
    if (!needle) return true;
    return [s.en, s.ar].some((p) => p && `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(needle));
  });
  const featured = !topic && !needle ? stories.find((s) => s.featured) ?? stories[0] : undefined;
  const rest = featured ? list.filter((s) => s !== featured) : list;

  return (
    <main className="w-full max-w-[1160px] mx-auto px-5 md:px-12 pt-32 md:pt-44 pb-32">
      <div className="text-center" dir={ar ? "rtl" : "ltr"}>
        {ar ? (
          <h1 className={`${arFont} font-bold text-[48px] md:text-[76px] leading-[1.15]`}>{topic ? `${CATEGORIES[topic].emoji} ${CATEGORIES[topic].ar}` : "ملاحظات من المكتب ✏️"}</h1>
        ) : topic ? (
          <h1 className="font-display lowercase text-[52px] md:text-[88px] leading-none" style={{ color: CATEGORIES[topic].color }}>
            {CATEGORIES[topic].emoji} {CATEGORIES[topic].en}
          </h1>
        ) : (
          <DoodleTitle text={isProfessional ? "notes from {pencil} the desk" : "things i {pencil} wrote down"} className="text-[48px] md:text-[84px]" />
        )}
        <Scribble className={`mt-3 ${ar ? arFont : ""}`}>
          {ar ? "تجربة المستخدم، الرسم، التعليم، البودكاست، وبناتي. كل ملاحظة بالعربي والإنجليزي." : isProfessional ? "UX, drawing, teaching, the podcast and my girls. every note in english + عربي." : "mostly written at 2am. in english + عربي."}
        </Scribble>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <LangSwitch lang={lang} onChange={setLang} />
          <label className="relative w-full max-w-[320px]">
            <span className="sr-only">{t.search}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.search}
              className={`w-full rounded-full border border-black/70 bg-[#fffaf1] ps-10 pe-4 py-2 text-[15px] outline-none focus:border-[#ff614c] focus:ring-2 focus:ring-[#ff614c]/20 ${ar ? arFont : "font-['Work_Sans']"}`}
            />
            <span aria-hidden className="absolute start-4 top-1/2 -translate-y-1/2 text-[15px]">🔍</span>
          </label>
        </div>
        {/* topics */}
        <nav aria-label="Topics" className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => navigate("/blog")}
            className={`rounded-full border px-3.5 py-1 text-[14px] transition-colors ${!topic ? "bg-[#1d1a17] text-[#fdecd0] border-[#1d1a17]" : "border-black/40 hover:border-black"} ${ar ? arFont : "font-['Work_Sans'] lowercase"}`}
          >
            {t.allTopics} <span className="opacity-60">{stories.length}</span>
          </button>
          {(Object.keys(CATEGORIES) as Category[])
            .filter((c) => counts[c])
            .map((c) => (
              <button
                key={c}
                onClick={() => navigate(topic === c ? "/blog" : `/blog/topic/${c}`)}
                className={`rounded-full border px-3.5 py-1 text-[14px] transition-colors ${ar ? arFont : "font-['Work_Sans'] lowercase"}`}
                style={topic === c ? { background: CATEGORIES[c].color, borderColor: CATEGORIES[c].color, color: "#fff" } : { borderColor: "rgba(0,0,0,0.4)" }}
              >
                {CATEGORIES[c].emoji} {CATEGORIES[c][lang]} <span className="opacity-60">{counts[c]}</span>
              </button>
            ))}
        </nav>
      </div>

      {featured && (
        <div className="mt-14 md:mt-20">
          <FeaturedCard p={pick(featured, lang)} />
        </div>
      )}

      <div className="mt-12 md:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {rest.map((s, i) => (
          <PostCard key={s.slug} p={pick(s, lang)} i={i} />
        ))}
      </div>
      {list.length === 0 && <p className={`mt-16 text-center text-black/55 ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{stories.length ? t.none : ar ? "ما في شي هون لسا. القلم عم يفكّر." : "nothing here yet. the pencil is thinking."}</p>}
    </main>
  );
}

/* ---------- post page ---------- */

function Share({ p }: { p: Post }) {
  const t = T[p.lang];
  const [copied, setCopied] = useState(false);
  const url = `${SITE}${postPath(p)}/`;
  const enc = encodeURIComponent;
  const links = [
    { k: "WhatsApp", href: `https://wa.me/?text=${enc(`${p.title} ${url}`)}` },
    { k: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { k: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(p.title)}` },
  ];
  const btn = "rounded-full border border-black/70 bg-[#fffaf1] px-3.5 py-1 text-[13.5px] hover:bg-[#1d1a17] hover:text-[#fdecd0] transition-colors font-['Work_Sans']";
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-[13px] text-black/55 me-1 ${p.lang === "ar" ? arFont : "font-['Shantell_Sans',cursive]"}`}>{t.share}</span>
      {links.map((l) => (
        <a key={l.k} href={l.href} target="_blank" rel="noopener noreferrer" className={btn}>
          {l.k}
        </a>
      ))}
      <button
        className={`${btn} ${p.lang === "ar" ? arFont : ""}`}
        onClick={() => {
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        }}
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}

function Toc({ p }: { p: Post }) {
  if (p.headings.length < 3) return null;
  const ar = p.lang === "ar";
  return (
    <nav aria-label={T[p.lang].toc} className="mt-10">
      <RoughBox fill="#fffaf1" radius={14} strokeWidth={1.2} seed={11} className="px-5 py-4">
        <p className={`text-[13px] text-black/55 ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{T[p.lang].toc}</p>
        <ol className={`mt-2 space-y-1 ${ar ? arFont : "font-['Work_Sans']"} text-[15px]`}>
          {p.headings.map((h, i) => (
            <li key={h.id} className="flex gap-2">
              <span className="text-[#ff614c] tabular-nums">{i + 1}.</span>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="hover:text-[#ff614c] hover:underline underline-offset-2"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </RoughBox>
    </nav>
  );
}

export function PostPage() {
  const { slug, lang: langParam } = useParams();
  const navigate = useNavigate();
  const story = getStory(slug);
  const p = story ? pick(story, langParam === "ar" ? "ar" : "en") : undefined;
  const other = story && p ? story[p.lang === "ar" ? "en" : "ar"] : undefined;
  usePageMeta({ title: p ? `${p.title} · ${p.lang === "ar" ? "علاء علي" : "Ala'a Ali"}` : "Not found · Ala'a Ali", description: p?.description });

  useEffect(() => {
    if (p) document.documentElement.lang = p.lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [p]);

  if (!story || !p) {
    return (
      <main className="pt-44 pb-32 text-center">
        <p className="font-display text-[48px]">this page wandered off</p>
        <div className="mt-8">
          <Button to="/blog">back to the blog</Button>
        </div>
      </main>
    );
  }
  const ar = p.lang === "ar";
  const t = T[p.lang];
  const idx = stories.indexOf(story);
  const newer: Story | undefined = stories[idx - 1];
  const older: Story | undefined = stories[idx + 1];
  const more = related(story);

  return (
    <main className="w-full pt-32 md:pt-44 pb-32" lang={p.lang}>
      <article dir={ar ? "rtl" : "ltr"} className="max-w-[760px] mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link to="/blog" className={`text-[14px] text-black/55 hover:text-[#ff614c] ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>
            {t.all}
          </Link>
          {other && (
            <Link
              to={postPath(other)}
              lang={other.lang}
              className={`rounded-full border border-black/70 bg-[#fffaf1] px-3.5 py-1 text-[14px] hover:bg-[#1d1a17] hover:text-[#fdecd0] transition-colors ${other.lang === "ar" ? arFont : "font-['Work_Sans']"}`}
            >
              {t.other}
            </Link>
          )}
        </div>
        <header className="mt-8 relative pt-6">
          {p.draft && <DraftSticker />}
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryTag c={p.category} lang={p.lang} />
            <Meta p={p} />
          </div>
          <h1 className={`mt-4 leading-[1.1] ${ar ? `${arFont} font-bold text-[36px] md:text-[52px]` : "font-display lowercase text-[48px] md:text-[76px] leading-[1.02] text-[#ff614c]"}`}>{p.title}</h1>
          {p.description && <p className={`mt-4 text-[18px] md:text-[21px] leading-relaxed text-black/75 ${ar ? arFont : "font-['IBM_Plex_Serif'] italic"}`}>{p.description}</p>}
        </header>
        {p.cover && (
          <motion.div initial={{ opacity: 0, scale: 0.95, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: -0.6 }} className="mt-10" dir="ltr">
            <RoughBox fill="#fffaf1" radius={14} strokeWidth={1.5} seed={7} className="aspect-[16/9]">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={p.cover} alt="" className="max-h-[86%] max-w-[86%] object-contain" />
              </div>
            </RoughBox>
          </motion.div>
        )}
        <Toc p={p} />
        <div
          className={`post-body mt-12 ${ar ? "post-ar" : ""}`}
          dangerouslySetInnerHTML={{ __html: p.html }}
          onClick={(e) => {
            // links to other pages of the site open in-app (no full reload)
            const a = (e.target as HTMLElement).closest("a");
            const href = a?.getAttribute("href");
            if (href && href.startsWith("/")) {
              e.preventDefault();
              navigate(href);
            }
          }}
        />

        {p.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <span key={tag} className={`rounded-full border border-black/30 px-3 py-0.5 text-[13px] text-black/65 ${ar ? arFont : "font-['Work_Sans']"}`}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <motion.footer
          className="mt-12 pt-8 border-t border-dashed border-black/30 flex flex-col md:flex-row md:items-center justify-between gap-6"
          onViewportEnter={() => addScore(10, ar ? "قرأت ملاحظة كاملة" : "read a whole note", `blog-${p.slug}-${p.lang}`)}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <HeadBadge size={64} />
            <div>
              <p className={ar ? `${arFont} font-bold text-[24px] leading-none` : "font-display text-[26px] leading-none"}>{ar ? "— علاء" : "— ala'a"}</p>
              <p className={`text-[13px] text-black/55 mt-1 ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{t.sign}</p>
            </div>
          </div>
          <Share p={p} />
        </motion.footer>
        <div className="mt-10 flex justify-end" dir="ltr">
          <Tsuzuku />
        </div>

        {(newer || older) && (
          <nav className="mt-10 grid grid-cols-2 gap-4" aria-label="More notes">
            <div>
              {older && (
                <Link to={postPath(pick(older, p.lang))} className="group block">
                  <span className={`text-[12.5px] text-black/50 ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>{ar ? "→" : "←"} {t.prev}</span>
                  <span className={`block mt-1 leading-tight group-hover:text-[#ff614c] ${ar ? `${arFont} font-bold text-[18px]` : "font-display lowercase text-[22px]"}`}>{pick(older, p.lang).title}</span>
                </Link>
              )}
            </div>
            <div className="text-end">
              {newer && (
                <Link to={postPath(pick(newer, p.lang))} className="group block">
                  <span className={`text-[12.5px] text-black/50 ${ar ? arFont : "font-['Shantell_Sans',cursive]"}`}>
                    {t.next} {ar ? "←" : "→"}
                  </span>
                  <span className={`block mt-1 leading-tight group-hover:text-[#ff614c] ${ar ? `${arFont} font-bold text-[18px]` : "font-display lowercase text-[22px]"}`}>{pick(newer, p.lang).title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>

      {more.length > 0 && (
        <section className="max-w-[1160px] mx-auto px-5 md:px-12 mt-24" dir={ar ? "rtl" : "ltr"}>
          <h2 className={`text-center ${ar ? `${arFont} font-bold text-[32px]` : "font-display lowercase text-[40px] md:text-[52px]"}`}>{t.more}</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {more.map((s, i) => (
              <PostCard key={s.slug} p={pick(s, p.lang)} i={i} compact />
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <Button to="/contact" tone="coral">
              {t.hi} {ar ? "←" : "→"}
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}

/* ---------- "from the blog" teaser for the home page ---------- */
export function BlogTeaser() {
  const { isProfessional, isArabic } = useMode();
  if (!stories.length) return null;
  const lang: Lang = isArabic ? "ar" : "en";
  return (
    <section className="w-full max-w-[1160px] mx-auto px-5 md:px-12 pt-32 md:pt-48">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10 md:mb-14">
        <div>
          <DoodleTitle text={isProfessional ? "from the {pencil} notes" : "stuff i {pencil} wrote"} className="text-[44px] md:text-[72px]" />
          <Scribble className="mt-1">{isProfessional ? "design, teaching, the podcast and my girls. english + عربي." : "written at 2am. in two languages, because why not."}</Scribble>
        </div>
        <Button to="/blog" className="self-start md:self-auto md:mb-4">
          {isProfessional ? `all ${stories.length} notes` : "read the lot"} →
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {stories.slice(0, 3).map((s, i) => (
          <PostCard key={s.slug} p={pick(s, lang)} i={i} compact />
        ))}
      </div>
    </section>
  );
}
