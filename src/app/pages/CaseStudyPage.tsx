import imgHeadCut from "../../assets/head.webp";
import { loseLife } from "../components/play/Score";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { useMode } from "../components/ModeContext";
import { useContactForm } from "../components/ContactFormContext";
import { BeforeAfter } from "../components/BeforeAfter";
import { BeforeChat } from "../components/BeforeChat";
import { BrowserShowcase, PhoneFan, ScreenRow } from "../components/Phone";
import { CountUp, Doodle, PenWipe, Reveal, ScribbleUnderline } from "../components/motion/Doodles";
import { categories, getNextReady, getProject, type Project } from "../data/projects";
import { ProblemSketch } from "../components/ProblemSketch";
import { ProjectCover } from "../components/ProjectCover";
import { MadeFor } from "../components/story/MadeFor";
import { CharacterMoods } from "../components/story/CharacterMoods";
import { SoundBoard } from "../components/story/SoundBoard";
import { Journey } from "../components/story/Journey";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { StickerArt, type Kind } from "../components/play/Stickers";
import { Button, NextTiles, Scribble } from "../components/ui/Kit";
import { Tsuzuku } from "../components/play/ToBeContinued";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { usePageMeta } from "../usePageMeta";

function BackLink() {
  const { isProfessional } = useMode();
  return (
    <Link
      to="/work"
      className="group inline-flex items-center gap-2 font-['Work_Sans'] text-[14px] md:text-[15px] text-black/60 hover:text-black transition-colors"
    >
      <span className="transition-transform group-hover:-translate-x-1">←</span>
      {isProfessional ? "All work" : "Back to the damage"}
    </Link>
  );
}


/* ── Not found / not written yet ── */
function NotReady({ project }: { project?: Project }) {
  const { isProfessional } = useMode();
  const { openContact } = useContactForm();
  usePageMeta({ title: project ? `${project.name} — Ala'a Ali` : "Not found — Ala'a Ali" });
  useEffect(() => {
    loseLife(project ? "not written yet" : "that page doesn't exist");
  }, [project]);
  return (
    <section className="w-full max-w-[900px] mx-auto px-6 md:px-12 pt-[130px] md:pt-[180px] pb-24 relative">
      <Doodle kind="sparkle" className="right-6 top-[120px]" />
      <BackLink />
      <h1 className="font-['Playfair_Display'] font-bold text-[#ff614c] text-[40px] md:text-[64px] leading-[1.05] mt-6">
        {project ? (isProfessional ? "WELL, THIS IS AWKWARD" : "BAZZINGAAAAA") : "404 — lost the file"}
      </h1>
      <p className="font-['Work_Sans'] text-black text-[18px] md:text-[24px] leading-[1.4] mt-4 max-w-[700px]">
        {project
          ? isProfessional
            ? `The ${project.name} case study isn't written up yet. The project is 100% real and I'd love to walk you through it.`
            : `No seriously, AI did NOT design ${project.name}. I just haven't uploaded the case study yet.`
          : "This page doesn't exist. Maybe it's in a folder I forgot to name."}
      </p>
      <div className="flex flex-wrap gap-4 mt-10">
        <Button onClick={openContact}>{isProfessional ? "Ask me about it" : "Bug me about it"}</Button>
      </div>
    </section>
  );
}

/* ── Steps with a line that draws as you scroll ── */
const CHAPTER_STICKERS: Kind[] = ["star", "bolt", "heart", "wow", "sparkle", "crown", "swirl"];

/** The chapters: big hand-drawn number, a title in marker, the story, how it felt, and the screens. */
function Chapters({ steps, color }: { steps: NonNullable<NonNullable<Project["caseStudy"]>["steps"]>; color: string }) {
  const { isProfessional } = useMode();
  return (
    <ol className="flex flex-col gap-20 md:gap-28 mt-12">
      {steps.map((s, i) => (
        <li key={s.title} className="relative">
          <Reveal>
            <div className="grid md:grid-cols-[110px_1fr] gap-4 md:gap-8 items-start">
              <div className="relative flex md:flex-col items-center md:items-start gap-3">
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  whileInView={{ scale: 1, rotate: i % 2 ? 6 : -6 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                  className="w-16 h-16 md:w-[84px] md:h-[84px] rounded-full border border-black bg-[#fffaf1] flex items-center justify-center font-display text-[34px] md:text-[44px] leading-none shadow-[3px_3px_0_0_#1d1a17]"
                  style={{ color }}
                >
                  {i + 1}
                </motion.span>
                <motion.span
                  aria-hidden
                  className="md:ml-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 12 }}
                >
                  <StickerArt kind={CHAPTER_STICKERS[i % CHAPTER_STICKERS.length]} size={34} />
                </motion.span>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-display lowercase text-[34px] md:text-[52px] leading-[1] text-black">{s.title}</h3>
                <p className="font-['IBM_Plex_Serif'] text-black/85 text-[17px] md:text-[20px] leading-[1.65] max-w-[720px]">{s.body}</p>
                {s.feeling && (
                  <p className="inline-flex items-start gap-2 self-start rounded-[12px] border border-dashed border-black/40 bg-[#fffaf1]/70 px-4 py-2.5 font-['Shantell_Sans',cursive] text-[15px] md:text-[16px] text-black/75 rotate-[-1deg]">
                    <span className="text-black/45">{isProfessional ? "how it felt:" : "mood:"}</span>
                    {s.feeling}
                  </p>
                )}
              </div>
            </div>
            {s.phones && s.phones.length > 0 && (
              <div className="mt-8 md:ml-[118px]">
                <ScreenRow shots={s.phones} />
              </div>
            )}
            {s.image && (
              <PenWipe className="mt-8 md:ml-[118px]">
                <img src={s.image} alt={s.title} loading="lazy" className="w-full rounded-[12px] border border-black shadow-[4px_4px_0_0_#1d1a17]" />
              </PenWipe>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

function Result({ value, label, i }: { value: string; label: string; i: number }) {
  const m = value.match(/^(\d+)(.*)$/);
  const numeric = m && m[2].trim() === "" ? Number(m[1]) : null;
  return (
    <Reveal delay={i * 0.08} className="flex flex-col gap-2 border-t border-black pt-4">
      <span className="font-display text-[#ff614c] text-[60px] md:text-[84px] leading-none">
        {numeric !== null ? <CountUp to={numeric} /> : value}
      </span>
      <span className="font-['IBM_Plex_Serif'] text-black text-[15px] md:text-[18px] leading-snug">{label}</span>
    </Reveal>
  );
}

export function CaseStudyPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  const { isProfessional } = useMode();
  const { openContact } = useContactForm();
  const [folderOpen, setFolderOpen] = useState(false);

  usePageMeta({
    title: project ? `${project.name} — Case study · Ala'a Ali` : undefined,
    description: project?.proHook,
  });

  useEffect(() => {
    const t = setTimeout(() => setFolderOpen(true), 700);
    return () => clearTimeout(t);
  }, [slug]);

  if (!project || project.status !== "ready" || !project.caseStudy) return <NotReady project={project} />;

  const cs = project.caseStudy;
  const cat = categories[project.category];
  const next = getNextReady(project.slug);
  const meta = [
    { k: isProfessional ? "Client" : "Who paid", v: cs.client },
    { k: isProfessional ? "Role" : "What I did", v: cs.role },
    { k: isProfessional ? "Year" : "When", v: cs.year },
    { k: isProfessional ? "Platform" : "Where", v: cs.platform },
  ].filter((m) => m.v);

  return (
    <article className="w-full">
      {/* ── Hero ── */}
      <header className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-[120px] md:pt-[170px] relative">
        <Doodle kind="star" className="right-6 md:right-20 top-[110px] md:top-[150px]" size={48} />
        <Doodle kind="zigzag" className="hidden md:block right-[260px] top-[330px]" color={cat.color} delay={0.3} />
        <BackLink />

        <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center mt-6 md:mt-10">
          <div>
            <Reveal y={12}>
              <span className="inline-flex items-center gap-2 font-['Work_Sans'] text-[13px] uppercase tracking-[0.18em] text-black/60">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                {isProfessional ? cat.title : cat.funTitle}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-display lowercase text-[64px] md:text-[120px] leading-[0.9] mt-3" style={{ color: cat.color === "#1F1F1F" ? "#1d1a17" : cat.color }}>
                {project.name}
              </h1>
            </Reveal>
            <ScribbleUnderline width={200} color={cat.color} delay={0.5} className="mt-3" />
            <Reveal delay={0.15}>
              <p className="font-['IBM_Plex_Serif'] text-black text-[20px] md:text-[30px] leading-[1.3] mt-6 max-w-[760px]">
                {isProfessional ? project.proHook : project.funHook}
              </p>
            </Reveal>
            {cs.funTldr && (
              <Reveal delay={0.25}>
                <p className="font-['Shantell_Sans',cursive] text-black/65 text-[15px] md:text-[18px] leading-[1.5] mt-5 max-w-[640px] rotate-[-0.5deg]">
                  {cs.funTldr}
                </p>
              </Reveal>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
            className="hidden md:block w-[300px] lg:w-[340px] bg-[#fffaf1] border border-black rounded-[20px] p-2.5 shadow-[4px_4px_0_0_#1d1a17]"
            onMouseEnter={() => setFolderOpen(true)}
          >
            <ProjectCover project={project} hovered={folderOpen} />
          </motion.div>
        </div>

        {meta.length > 0 && (
          <Reveal delay={0.3}>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-black py-6 mt-12 md:mt-16">
              {meta.map((m) => (
                <div key={m.k} className="flex flex-col gap-1">
                  <dt className="font-['Work_Sans'] text-[12px] uppercase tracking-[0.16em] text-black/50">{m.k}</dt>
                  <dd className="font-['IBM_Plex_Serif'] text-black text-[15px] md:text-[17px] leading-snug">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </header>

      {cs.showcase && cs.showcase.length > 0 && (
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 mt-10 md:mt-14">
          {cs.device === "desktop" ? <BrowserShowcase shots={cs.showcase} color={cat.color} url={cs.url} /> : <PhoneFan shots={cs.showcase} color={cat.color} />}
        </div>
      )}

      <div className="w-full max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-28 mt-16 md:mt-24">
        {/* ── Problem ── */}
        {cs.problem && cs.problem.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "where it {bolt} started" : "what was {bolt} broken"} className="text-[40px] md:text-[64px]" />
            <div className="flex flex-col gap-5 mt-8">
              {cs.problem.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="font-['IBM_Plex_Serif'] text-black text-[17px] md:text-[21px] leading-[1.7]">{p}</p>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ── The problem, sketched ── */}
        {cs.problemSketch && (
          <section className="lg:-mx-16">
            <p className="font-['Shantell_Sans',cursive] text-[15px] text-black/55 mb-3 lg:mx-16 px-1">
              {isProfessional ? "how it used to work (sketched):" : "the old system, lovingly reconstructed:"}
            </p>
            <ProblemSketch frames={cs.problemSketch.frames} loop={cs.problemSketch.loop} />
          </section>
        )}

        {/* ── Real sketches from the notebook ── */}
        {cs.sketches && cs.sketches.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "from the {pencil} sketchbook" : "napkin {pencil} math"} className="text-[40px] md:text-[64px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
              {cs.sketches.map((sk, i) => (
                <PenWipe key={sk.src} delay={(i % 2) * 0.1} direction="up">
                  <figure className="relative bg-white p-3 pb-10 shadow-[0_14px_30px_-16px_rgba(60,35,10,.5)]" style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}>
                    <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FFE9C7]/80 rotate-[-4deg]" />
                    <img src={sk.src} alt={sk.caption ?? "sketch"} loading="lazy" className="w-full" />
                    {sk.caption && <figcaption className="absolute bottom-2 left-0 right-0 text-center font-['Shantell_Sans',cursive] text-[14px] text-black/60">{sk.caption}</figcaption>}
                  </figure>
                </PenWipe>
              ))}
            </div>
          </section>
        )}

        {/* ── Who it was made for ── */}
        {cs.madeFor && (
          <section>
            <DoodleTitle text={(cs.madeFor.title ?? "Made for") .replace(" & ", " {heart} ")} className="text-[34px] md:text-[56px]" color={cat.color} />
            <div className="mt-8">
              <MadeFor intro={cs.madeFor.intro} people={cs.madeFor.people} closing={cs.madeFor.closing} />
            </div>
          </section>
        )}

        {/* ── Before / after as a chat ── */}
        {cs.beforeChat && (
          <section>
            <DoodleTitle text={isProfessional ? "before {sparkle} after" : "the {sparkle} glow-up"} className="text-[40px] md:text-[64px]" />
            <div className="mt-10">
              <BeforeChat
                lines={cs.beforeChat.lines}
                after={cs.beforeChat.after}
                afterAlt={cs.beforeChat.afterAlt}
                labels={{
                  before: isProfessional ? "Before: iMessage" : "Before: chaos",
                  after: isProfessional ? "After: Siba" : "After: an actual app",
                  note: cs.beforeChat.note,
                }}
              />
            </div>
          </section>
        )}

        {/* ── What I did ── */}
        {cs.steps && cs.steps.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "how we {star} got there" : "how i {star} fixed it"} className="text-[40px] md:text-[64px]" />
            <Scribble className="mt-2">{isProfessional ? "chapter by chapter, with how it felt at the time" : "the chapters. with moods. because there were moods."}</Scribble>
            <Chapters steps={cs.steps} color={cat.color} />
          </section>
        )}

        {/* ── The character ── */}
        {cs.character && (
          <section>
            <DoodleTitle text={isProfessional ? `meet {heart} ${cs.character.name.toLowerCase()}` : `${cs.character.name.toLowerCase()} has {heart} feelings`} className="text-[40px] md:text-[64px]" />
            <div className="mt-8">
              <CharacterMoods name={cs.character.name} intro={cs.character.intro} moods={cs.character.moods} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Sound ── */}
        {cs.sounds && (
          <section>
            <DoodleTitle text={isProfessional ? "how it {star} sounds" : "turn your {star} sound on"} className="text-[40px] md:text-[64px]" />
            <div className="mt-8">
              <SoundBoard intro={cs.sounds.intro} tones={cs.sounds.tones} voices={cs.sounds.voices} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Journey ── */}
        {cs.journey && cs.journey.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "the {swirl} journey" : "how it {swirl} actually happened"} className="text-[40px] md:text-[64px]" />
            <div className="mt-10">
              <Journey stops={cs.journey} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Before / after ── */}
        {cs.before && cs.after && (
          <section>
            <DoodleTitle text={isProfessional ? "before {sparkle} after" : "the {sparkle} glow-up"} className="text-[40px] md:text-[64px]" />
            <Reveal className="mt-8">
              <BeforeAfter before={cs.before} after={cs.after} />
            </Reveal>
          </section>
        )}

        {/* ── Results ── */}
        {cs.results && cs.results.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "what {crown} changed" : "the {crown} receipts"} className="text-[40px] md:text-[64px]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10">
              {cs.results.map((r, i) => (
                <Result key={r.label} value={r.value} label={r.label} i={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        {cs.gallery && cs.gallery.length > 0 && (
          <section>
            <DoodleTitle text={isProfessional ? "more {eye} screens" : "more pretty {eye} pictures"} className="text-[40px] md:text-[64px]" />
            <div className="columns-1 md:columns-2 gap-6 mt-10 [&>*]:mb-6">
              {cs.gallery.map((src, i) => (
                <PenWipe key={src} delay={(i % 2) * 0.1} direction="up">
                  <img
                    src={src}
                    alt={`${project.name} screen ${i + 1}`}
                    loading="lazy"
                    className="w-full rounded-[6px] border border-black"
                  />
                </PenWipe>
              ))}
            </div>
          </section>
        )}

        {/* ── Closing: a note, in my handwriting ── */}
        {cs.closing && (
          <Reveal>
            <div className="relative max-w-[760px] mx-auto">
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#FFE9C7]/90 rotate-[-3deg] border border-black/10 z-10" />
              <div className="relative rounded-[6px] bg-[#fffaf1] border border-black/70 shadow-[4px_4px_0_0_#1d1a17] px-7 md:px-12 py-9 md:py-12 rotate-[0.6deg]">
                <p className="font-['Shantell_Sans',cursive] text-black text-[19px] md:text-[26px] leading-[1.55]">{cs.closing}</p>
                <p className="font-display text-[26px] md:text-[32px] text-[#ff614c] mt-6 lowercase">— ala'a</p>
                <span className="absolute -right-6 -bottom-7 w-[92px] h-[110px] overflow-hidden rotate-[8deg]" aria-hidden>
                  <img alt="" className="absolute inset-0 w-full h-full object-contain max-w-none" src={imgHeadCut} />
                </span>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* ── episode end ── */}
      <div className="w-full max-w-[1000px] mx-auto px-6 md:px-12 mt-16 flex justify-end"><Tsuzuku /></div>

      {/* ── Footer: next episode + say hi ── */}
      <div className="w-full max-w-[1000px] mx-auto px-6 md:px-12 mt-10 md:mt-14 mb-16">
        <NextTiles
          items={[
            { to: next ? `/work/${next.slug}` : "/work", k: next ? (isProfessional ? "next episode" : "next victim") : isProfessional ? "keep exploring" : "there's more", t: next ? next.name : isProfessional ? "all projects" : "the full damage" },
            { to: "/contact", k: isProfessional ? "got a product that needs this?" : "want me to break (and fix) yours?", t: isProfessional ? "send me a postcard" : "throw me a plane" },
          ]}
        />
      </div>
    </article>
  );
}
