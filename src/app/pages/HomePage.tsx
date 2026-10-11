/*
 * The front door. Short on purpose: the hero, the latest work,
 * and one teaser per page, each with its own little interaction.
 */
import { Link } from "react-router";
import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { HeroSection } from "../components/HeroSection";
import { StatsSection } from "../components/StatsSection";
import { ProjectCard } from "../components/ProjectCard";
import { ComingSoonPopup } from "../components/ComingSoonPopup";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { Reveal } from "../components/motion/Doodles";
import { Button, Eyebrow, PaperCard, Scribble } from "../components/ui/Kit";
import { StickerArt, type Kind } from "../components/play/Stickers";
import { Thing } from "../components/play/DeskThings";
import { projects } from "../data/projects";
import { usePageMeta } from "../usePageMeta";
import { useState } from "react";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

function Teaser({
  to, eyebrow, title, blurb, cta, tilt, children, tone = "card",
}: { to: string; eyebrow: string; title: string; blurb: string; cta: string; tilt: number; children: React.ReactNode; tone?: "card" | "ink" | "coral" }) {
  return (
    <Link to={to} className="block group">
      <PaperCard tilt={tilt} tone={tone} className="p-6 md:p-7 h-full flex flex-col gap-4 overflow-hidden">
        <div className="relative h-[150px] md:h-[170px] rounded-[14px] overflow-hidden" style={{ background: tone === "card" ? "#FFE9C7" : "rgba(255,250,241,.12)" }}>
          {children}
        </div>
        <div>
          <Eyebrow className={`mb-1 ${tone !== "card" ? "!text-[#fffaf1]/60" : ""}`}>{eyebrow}</Eyebrow>
          <h3 className="font-['Playfair_Display'] font-bold text-[24px] md:text-[28px] leading-tight">{title}</h3>
          <p className={`font-['Work_Sans'] text-[14.5px] md:text-[15.5px] leading-snug mt-2 ${tone === "card" ? "text-black/70" : "text-[#fffaf1]/80"}`}>{blurb}</p>
        </div>
        <span className={`mt-auto font-['DM_Serif_Display'] text-[17px] inline-flex items-center gap-2 ${tone === "card" ? "text-[#ff614c]" : "text-[#fffaf1]"}`}>
          {cta}<span className="transition-transform group-hover:translate-x-1.5">→</span>
        </span>
      </PaperCard>
    </Link>
  );
}

export function HomePage() {
  const { isProfessional } = useMode();
  const [soon, setSoon] = useState(false);
  usePageMeta();
  const lead = projects.find((p) => p.status === "ready");
  const featured = projects.filter((p) => p.featured && p.slug !== lead?.slug).slice(0, 3);

  return (
    <main className="flex flex-col">
      <HeroSection />
      <StatsSection />

      {/* Latest work */}
      <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-16 md:pt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <DoodleTitle text={isProfessional ? "Latest {pencil} work" : "Fresh {pencil} damage"} className="text-[38px] md:text-[60px]" />
          <Button to="/work" className="self-start md:self-auto md:mb-5">{isProfessional ? `All ${projects.length} projects` : "The full damage"} →</Button>
        </div>
        {lead && <div className="mb-6 md:mb-8"><ProjectCard project={lead} big onSoon={() => setSoon(true)} /></div>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-7">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i + 1} onSoon={() => setSoon(true)} />
          ))}
        </div>
        <ComingSoonPopup isOpen={soon} onClose={() => setSoon(false)} />
      </section>

      {/* One line about me */}
      <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-24 md:pt-32">
        <Reveal>
          <blockquote className="font-['IBM_Plex_Serif'] italic font-light text-[22px] md:text-[34px] leading-[1.35] max-w-[900px] [text-wrap:balance]">
            {isProfessional
              ? "I design apps, platforms and dashboards that people don't need a manual to use. That's the whole job, really."
              : "I draw stuff, break layouts, and fix them again. Somehow people pay me for this."}
          </blockquote>
          <Scribble className="mt-4">— {isProfessional ? "Ala'a, Amman" : "me, at 2am, probably"}</Scribble>
        </Reveal>
      </section>

      {/* Teasers */}
      <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-14 md:pt-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          <Teaser to="/about" tilt={-2} eyebrow={isProfessional ? "About" : "The lore"} title={isProfessional ? "From couches to pixels" : "Couch guy to pixel guy"} blurb={isProfessional ? "The story in six comic panels, plus what I actually do." : "A comic strip. Flip cards. Random facts. The cat."} cta={isProfessional ? "Read the story" : "Get the lore"}>
            <motion.span className="absolute left-4 bottom-0 w-[110px] h-[130px] overflow-hidden" animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }}>
              <img alt="" src={imgHead} className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none" />
            </motion.span>
            <span className="absolute right-4 top-4 rotate-6"><StickerArt kind="wow" size={44} /></span>
            <span className="absolute right-8 bottom-5 -rotate-12"><StickerArt kind="coffee" size={36} /></span>
          </Teaser>

          <Teaser to="/skills" tilt={2} eyebrow={isProfessional ? "Skills" : "The table"} title={isProfessional ? "What I bring to the table" : "Throw my skills around"} blurb={isProfessional ? "My desk, my tools, and how I work. You can throw things." : "My actual desk. Physics included. Poke the cat."} cta={isProfessional ? "See the desk" : "Make a mess"}>
            <span className="absolute left-3 bottom-2"><Thing id="cat" size={0.9} /></span>
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1"><Thing id="mac" size={0.78} /></span>
            <span className="absolute right-3 bottom-3"><Thing id="mug" size={0.9} /></span>
            {["UX", "RTL", "Figma"].map((s, i) => (
              <motion.span key={s} className="absolute rounded-full border-2 border-black bg-white px-2.5 py-1 font-['Work_Sans'] font-semibold text-[11px] shadow-[2px_2px_0_0_black]" style={{ left: `${18 + i * 26}%`, top: 10 + (i % 2) * 14 }} animate={{ y: [0, -6, 0], rotate: [i * 4 - 4, -i * 3, i * 4 - 4] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }}>{s}</motion.span>
            ))}
          </Teaser>

          <Teaser to="/experience" tilt={-1.5} eyebrow={isProfessional ? "Experience" : "The timeline"} title={isProfessional ? "Where I've been" : "How I got here"} blurb={isProfessional ? "Al Jazeera, TRT, Syntax, Sitech, teaching, a top-10 podcast." : "Four timelines. The PlayStation years count."} cta={isProfessional ? "See the timeline" : "Read the lore"}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 170" fill="none" aria-hidden>
              <motion.path d="M20 140 C 80 120, 90 60, 150 70 S 230 30, 280 20" stroke="#ff614c" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }} />
              {[[20, 140, "2007"], [95, 84, "2012"], [150, 70, "2018"], [220, 44, "2021"], [280, 20, "now"]].map(([x, y, l], i) => (
                <g key={l as string}>
                  <motion.circle cx={x as number} cy={y as number} r="7" fill="#fffaf1" stroke="#1d1a17" strokeWidth="2.5" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.2, type: "spring" }} />
                  <text x={x as number} y={(y as number) + 24} textAnchor="middle" fontFamily="Work Sans" fontSize="11" fontWeight="600" fill="#1d1a17">{l}</text>
                </g>
              ))}
            </svg>
          </Teaser>

          <Teaser to="/play" tilt={1.5} tone="ink" eyebrow={isProfessional ? "Play" : "Procrastinate"} title={isProfessional ? "Find the button" : "Find the button, or else"} blurb={isProfessional ? "A tiny game about UX crimes. Five screens, one real button each." : "Five cursed screens. One real button. A user losing patience."} cta={isProfessional ? "Play" : "Suffer"}>
            {(["Continue", "PAY NOW", "Place order", "✕"] as const).map((t, i) => (
              <motion.span
                key={t}
                className={`absolute font-['Work_Sans'] text-[12px] px-3 py-1.5 rounded-[8px] border-2 ${i === 2 ? "bg-[#ff614c] text-white border-black shadow-[2px_2px_0_0_#fffaf1]" : "bg-[#fffaf1]/90 text-black/60 border-transparent"}`}
                style={{ left: `${[8, 55, 22, 82][i]}%`, top: `${[18, 20, 60, 8][i]}%` }}
                animate={i === 2 ? { scale: [1, 1.08, 1] } : { x: [0, i % 2 ? 4 : -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              >
                {t}
              </motion.span>
            ))}
            <span className="absolute left-4 bottom-3"><StickerArt kind="bolt" size={36} /></span>
          </Teaser>
        </div>
      </section>

      <div className="h-8 md:h-12" />
    </main>
  );
}
