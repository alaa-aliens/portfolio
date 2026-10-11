import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { useMode } from "../components/ModeContext";
import { useContactForm } from "../components/ContactFormContext";
import { BeforeAfter } from "../components/BeforeAfter";
import { BeforeChat } from "../components/BeforeChat";
import { PhoneFan, PhoneRow } from "../components/Phone";
import { CountUp, Doodle, PenWipe, Reveal, ScribbleUnderline, SectionTitle } from "../components/motion/Doodles";
import { categories, getNextReady, getProject, type Project } from "../data/projects";
import { ProblemSketch } from "../components/ProblemSketch";
import { ProjectCover } from "../components/ProjectCover";
import { MadeFor } from "../components/story/MadeFor";
import { CharacterMoods } from "../components/story/CharacterMoods";
import { SoundBoard } from "../components/story/SoundBoard";
import { Journey } from "../components/story/Journey";
import { DoodleTitle } from "../components/play/DoodleTitle";
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

function CtaButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="bg-white px-6 py-3 font-['DM_Serif_Display'] text-[17px] md:text-[19px] text-black border border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] transition-all"
    >
      {children}
    </button>
  );
}

/* ── Not found / not written yet ── */
function NotReady({ project }: { project?: Project }) {
  const { isProfessional } = useMode();
  const { openContact } = useContactForm();
  usePageMeta({ title: project ? `${project.name} — Ala'a Ali` : "Not found — Ala'a Ali" });
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
        <CtaButton onClick={openContact}>{isProfessional ? "Ask me about it" : "Bug me about it"}</CtaButton>
      </div>
    </section>
  );
}

/* ── Steps with a line that draws as you scroll ── */
function Steps({ steps }: { steps: NonNullable<NonNullable<Project["caseStudy"]>["steps"]> }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative flex flex-col gap-12 md:gap-16 mt-10">
      <div aria-hidden className="absolute left-[23px] md:left-[31px] top-2 bottom-2 w-[2px] bg-black/10" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute left-[23px] md:left-[31px] top-2 bottom-2 w-[2px] bg-[#ff614c] origin-top"
      />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} className="relative grid grid-cols-[48px_1fr] md:grid-cols-[64px_1fr] gap-4 md:gap-8">
          <div className="relative z-10 flex items-start justify-center">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#fdecd0] border-2 border-black flex items-center justify-center font-['Playfair_Display'] italic font-bold text-[22px] md:text-[28px] text-[#ff614c]"
            >
              {i + 1}
            </motion.span>
          </div>
          <div className="flex flex-col gap-3 pt-1 md:pt-3">
            <h3 className="font-['Playfair_Display'] font-bold text-black text-[22px] md:text-[30px] leading-tight">
              {s.title}
            </h3>
            <p className="font-['IBM_Plex_Serif'] text-black/85 text-[16px] md:text-[19px] leading-[1.65] max-w-[680px]">
              {s.body}
            </p>
            {s.phones && s.phones.length > 0 && (
              <div className="mt-5">
                <PhoneRow shots={s.phones} />
              </div>
            )}
            {s.image && (
              <PenWipe className="mt-4">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="w-full rounded-[6px] border border-black shadow-[6px_6px_0px_0px_black]"
                />
              </PenWipe>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

function Result({ value, label, i }: { value: string; label: string; i: number }) {
  const m = value.match(/^(\d+)(.*)$/);
  const numeric = m && m[2].trim() === "" ? Number(m[1]) : null;
  return (
    <Reveal delay={i * 0.08} className="flex flex-col gap-2 border-t-2 border-black pt-4">
      <span className="font-['Playfair_Display'] font-bold italic text-[#ff614c] text-[52px] md:text-[72px] leading-none">
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
              <h1 className="font-['Playfair_Display'] font-bold text-black text-[52px] md:text-[96px] leading-[0.95] mt-3">
                {project.name}
              </h1>
            </Reveal>
            <ScribbleUnderline width={200} color={cat.color} delay={0.5} className="mt-3" />
            <Reveal delay={0.15}>
              <p className="font-['IBM_Plex_Serif'] text-black text-[20px] md:text-[30px] leading-[1.3] mt-6 max-w-[760px]">
                {isProfessional ? project.proHook : project.funHook}
              </p>
            </Reveal>
            {!isProfessional && cs.funTldr && (
              <Reveal delay={0.25}>
                <p className="font-['IBM_Plex_Serif'] italic font-light text-black/70 text-[16px] md:text-[20px] leading-[1.5] mt-4 max-w-[680px]">
                  “{cs.funTldr}”
                </p>
              </Reveal>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
            className="hidden md:block w-[300px] lg:w-[340px] bg-[#fffaf1] border-2 border-black rounded-[20px] p-2.5 shadow-[6px_7px_0_0_#1d1a17]"
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
          <PhoneFan shots={cs.showcase} color={cat.color} />
        </div>
      )}

      <div className="w-full max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col gap-20 md:gap-28 mt-16 md:mt-24">
        {/* ── Problem ── */}
        {cs.problem && cs.problem.length > 0 && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? "The Problem" : "What Was Broken"}</SectionTitle>
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
            <SectionTitle color={cat.color}>{isProfessional ? "From the sketchbook" : "Napkin math"}</SectionTitle>
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
            <SectionTitle color={cat.color}>{isProfessional ? "Before & After" : "The Glow-Up"}</SectionTitle>
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
            <SectionTitle color={cat.color}>{isProfessional ? "What I Did" : "How I Fixed It"}</SectionTitle>
            <Steps steps={cs.steps} />
          </section>
        )}

        {/* ── The character ── */}
        {cs.character && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? `Meet ${cs.character.name}` : `${cs.character.name} has feelings`}</SectionTitle>
            <div className="mt-8">
              <CharacterMoods name={cs.character.name} intro={cs.character.intro} moods={cs.character.moods} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Sound ── */}
        {cs.sounds && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? "How it sounds" : "Turn your sound on"}</SectionTitle>
            <div className="mt-8">
              <SoundBoard intro={cs.sounds.intro} tones={cs.sounds.tones} voices={cs.sounds.voices} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Journey ── */}
        {cs.journey && cs.journey.length > 0 && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? "The journey" : "How it actually happened"}</SectionTitle>
            <div className="mt-10">
              <Journey stops={cs.journey} color={cat.color} />
            </div>
          </section>
        )}

        {/* ── Before / after ── */}
        {cs.before && cs.after && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? "Before / After" : "The Glow-Up"}</SectionTitle>
            <Reveal className="mt-8">
              <BeforeAfter before={cs.before} after={cs.after} />
            </Reveal>
          </section>
        )}

        {/* ── Results ── */}
        {cs.results && cs.results.length > 0 && (
          <section>
            <SectionTitle color={cat.color}>{isProfessional ? "Results" : "The Receipts"}</SectionTitle>
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
            <SectionTitle color={cat.color}>{isProfessional ? "Gallery" : "More Pretty Pictures"}</SectionTitle>
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

        {/* ── Closing ── */}
        {cs.closing && (
          <Reveal>
            <blockquote className="relative font-['IBM_Plex_Serif'] italic font-light text-black text-[20px] md:text-[28px] leading-[1.45] border-l-4 pl-6 md:pl-10" style={{ borderColor: cat.color }}>
              {cs.closing}
            </blockquote>
          </Reveal>
        )}
      </div>

      {/* ── Footer CTA ── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 mt-24 md:mt-32 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal className="border border-black rounded-[6px] p-8 md:p-10 flex flex-col gap-5 bg-white/50">
            <p className="font-['Playfair_Display'] font-bold text-black text-[26px] md:text-[34px] leading-tight">
              {isProfessional ? "Got a product that needs this treatment?" : "Want me to break (and fix) your product next?"}
            </p>
            <div>
              <CtaButton onClick={openContact}>{isProfessional ? "Get in Touch" : "Say Hi"}</CtaButton>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to={next ? `/work/${next.slug}` : "/work"}
              className="group h-full border border-black rounded-[6px] p-8 md:p-10 flex flex-col justify-between gap-6 bg-black text-white hover:bg-[#ff614c] transition-colors"
            >
              <span className="font-['Work_Sans'] uppercase tracking-[0.18em] text-[12px] text-white/60 group-hover:text-white/80">
                {next ? (isProfessional ? "Next project" : "Next victim") : isProfessional ? "Keep exploring" : "There's more"}
              </span>
              <span className="font-['Playfair_Display'] font-bold text-[30px] md:text-[44px] leading-tight flex items-center justify-between gap-4">
                {next ? next.name : isProfessional ? "See all projects" : "The Full Damage"}
                <span className="transition-transform group-hover:translate-x-2">→</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
