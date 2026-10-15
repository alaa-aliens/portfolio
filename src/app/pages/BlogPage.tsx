/*
 * The blog: hand-drawn notes on UX, design, teaching and building things for my kids.
 * List page (/blog) and post page (/blog/:slug). Posts come from /content/blog/*.md.
 */
import { useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { HeadBadge } from "../components/play/HeadBadge";
import { Tsuzuku } from "../components/play/ToBeContinued";
import { Button, RoughBox, Scribble } from "../components/ui/Kit";
import { usePageMeta } from "../usePageMeta";
import { formatDate, getPost, posts, type Post } from "../blog/posts";

function Meta({ p }: { p: Post }) {
  const ar = p.lang === "ar";
  return (
    <span className="font-['Shantell_Sans',cursive] text-[12.5px] text-black/55" dir={ar ? "rtl" : "ltr"}>
      {formatDate(p.date, p.lang)} · {ar ? `${p.minutes} دقائق قراءة` : `${p.minutes} min read`}
    </span>
  );
}

function DraftSticker() {
  return <span className="absolute -top-3 -end-3 rotate-6 z-10 rounded-full border border-black bg-[#FFC53D] px-2.5 py-0.5 font-['Shantell_Sans',cursive] text-[12px]">draft</span>;
}

function PostCard({ p, i }: { p: Post; i: number }) {
  const ar = p.lang === "ar";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotate: i % 2 ? 1.2 : -1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
      whileHover={{ y: -6, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="relative"
    >
      {p.draft && <DraftSticker />}
      <Link to={`/blog/${p.slug}`} className="block group">
        <RoughBox fill="#fffaf1" radius={14} strokeWidth={1.5} seed={i * 31 + 9} className="p-5 md:p-6 flex flex-col gap-4 h-full">
          {p.cover && (
            <div className="aspect-[16/10] rounded-[10px] bg-[#fdecd0] flex items-center justify-center overflow-hidden">
              <img src={p.cover} alt="" loading="lazy" className="max-h-[88%] max-w-[88%] object-contain group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div dir={ar ? "rtl" : "ltr"} className={ar ? "text-right" : "text-left"}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-[#ff614c] text-white px-2 py-0.5 font-['Work_Sans'] text-[10.5px] uppercase tracking-[0.12em]">{ar ? "عربي" : "EN"}</span>
              <Meta p={p} />
            </div>
            <h2 className={`mt-3 leading-[1.05] ${ar ? "font-['Noto_Naskh_Arabic'] font-bold text-[26px] md:text-[30px]" : "font-display lowercase text-[30px] md:text-[36px]"}`}>{p.title}</h2>
            <p className={`mt-2 text-black/70 text-[15px] leading-relaxed ${ar ? "font-['Noto_Naskh_Arabic']" : "font-['Work_Sans']"}`}>{p.description}</p>
            <span className="inline-block mt-3 font-['Shantell_Sans',cursive] text-[13.5px] text-[#ff614c]">{ar ? "← اقرأ" : "read it →"}</span>
          </div>
        </RoughBox>
      </Link>
    </motion.article>
  );
}

export function BlogPage() {
  const { isProfessional } = useMode();
  const [lang, setLang] = useState<"all" | "en" | "ar">("all");
  usePageMeta({ title: "Blog · Ala'a Ali", description: "Hand-drawn notes on UX, design, teaching and building things for my kids. In English and Arabic." });
  const list = posts.filter((p) => lang === "all" || p.lang === lang);

  return (
    <main className="w-full max-w-[1100px] mx-auto px-5 md:px-12 pt-32 md:pt-44 pb-32">
      <div className="text-center">
        <DoodleTitle text={isProfessional ? "notes from {pencil} the desk" : "things i {pencil} wrote down"} className="text-[48px] md:text-[84px]" />
        <Scribble className="mt-2">{isProfessional ? "UX, drawing, teaching, and building for my kids. english + عربي." : "mostly written at 2am. english + عربي."}</Scribble>
        <div className="mt-8 inline-flex rounded-full border border-black/80 bg-[#fffaf1] p-1" role="tablist" aria-label="Language">
          {(["all", "en", "ar"] as const).map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1.5 text-[14px] transition-colors ${lang === l ? "bg-[#1d1a17] text-[#fdecd0]" : "hover:bg-[#fdecd0]"} ${l === "ar" ? "font-['Noto_Naskh_Arabic']" : "font-['Work_Sans']"}`}
            >
              {l === "all" ? "all" : l === "en" ? "english" : "عربي"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-14">
        {list.map((p, i) => (
          <PostCard key={p.slug} p={p} i={i} />
        ))}
      </div>
      {list.length === 0 && <p className="mt-16 text-center font-['Shantell_Sans',cursive] text-black/55">nothing here yet. the pencil is thinking.</p>}
    </main>
  );
}

export function PostPage() {
  const { slug } = useParams();
  const p = getPost(slug);
  usePageMeta({ title: p ? `${p.title} · Ala'a Ali` : "Not found · Ala'a Ali", description: p?.description });
  if (!p) {
    return (
      <main className="pt-44 pb-32 text-center">
        <p className="font-display text-[48px]">this page wandered off</p>
        <div className="mt-8"><Button to="/blog">back to the blog</Button></div>
      </main>
    );
  }
  const ar = p.lang === "ar";
  const idx = posts.indexOf(p);
  const next = posts[idx + 1] ?? posts[0];

  return (
    <main className="w-full pt-32 md:pt-44 pb-32" lang={p.lang}>
      <article dir={ar ? "rtl" : "ltr"} className="max-w-[760px] mx-auto px-5 md:px-8">
        <Link to="/blog" className="font-['Shantell_Sans',cursive] text-[14px] text-black/55 hover:text-[#ff614c]" dir="ltr">← all notes</Link>
        <header className="mt-8 relative pt-6">
          {p.draft && <DraftSticker />}
          <Meta p={p} />
          <h1 className={`mt-3 leading-[1.02] ${ar ? "font-['Noto_Naskh_Arabic'] font-bold text-[36px] md:text-[52px]" : "font-display lowercase text-[48px] md:text-[76px] text-[#ff614c]"}`}>{p.title}</h1>
          {p.description && <p className={`mt-4 text-[18px] md:text-[21px] leading-relaxed text-black/75 ${ar ? "font-['Noto_Naskh_Arabic']" : "font-['IBM_Plex_Serif'] italic"}`}>{p.description}</p>}
        </header>
        {p.cover && (
          <motion.div initial={{ opacity: 0, scale: 0.95, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: -0.6 }} className="mt-10">
            <RoughBox fill="#fffaf1" radius={14} strokeWidth={1.5} seed={7} className="aspect-[16/9] flex items-center justify-center">
              <img src={p.cover} alt="" className="max-h-[86%] max-w-[86%] object-contain" />
            </RoughBox>
          </motion.div>
        )}
        <div className={`post-body mt-12 ${ar ? "post-ar" : ""}`} dangerouslySetInnerHTML={{ __html: p.html }} />
        <footer className="mt-16 flex items-center gap-4">
          <HeadBadge size={64} />
          <div>
            <p className="font-display text-[26px] leading-none">— ala'a</p>
            <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/55 mt-1" dir="ltr">ux director, illustrator, dad. amman.</p>
          </div>
        </footer>
        <div className="mt-10 flex justify-end" dir="ltr"><Tsuzuku /></div>
      </article>
      {next && next.slug !== p.slug && (
        <div className="max-w-[760px] mx-auto px-5 md:px-8 mt-16 text-center">
          <Scribble>{ar ? "اقرأ كمان" : "next note"}</Scribble>
          <Link to={`/blog/${next.slug}`} className="inline-block mt-2 font-display lowercase text-[34px] md:text-[44px] leading-tight hover:text-[#ff614c] transition-colors">
            {next.title} →
          </Link>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button to="/contact" tone="coral">{ar ? "راسلني" : "say hi"} →</Button>
          </div>
        </div>
      )}
    </main>
  );
}
