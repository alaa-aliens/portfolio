import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { SkillsTable } from "../components/play/SkillsTable";
import { Doodle, Reveal, SectionTitle } from "../components/motion/Doodles";
import { Eyebrow, NextTiles, PaperCard, Prose, Scribble } from "../components/ui/Kit";
import { StickerArt, type Kind } from "../components/play/Stickers";
import { usePageMeta } from "../usePageMeta";

const TOOLS: { name: string; note: [string, string]; kind: Kind; level: number }[] = [
  { name: "Figma", note: ["Every day, since the beta.", "I dream in auto-layout."], kind: "star", level: 5 },
  { name: "Procreate", note: ["Where the doodles happen.", "iPad, Pencil, 2am."], kind: "heart", level: 5 },
  { name: "Illustrator & After Effects", note: ["Vector and motion, from the Al Jazeera days.", "Made news look pretty and move."], kind: "bolt", level: 4 },
  { name: "Claude Code", note: ["How I now ship working apps without a dev team.", "My dev team. It never sleeps."], kind: "sparkle", level: 4 },
  { name: "Rive & Lottie", note: ["Little living things in interfaces.", "Making buttons wiggle, professionally."], kind: "swirl", level: 3 },
  { name: "Arabic typography & RTL", note: ["Mirroring is not localising.", "If your Arabic UI is just flipped, we need to talk."], kind: "crown", level: 5 },
];

const HOW: { t: string; pro: string; fun: string }[] = [
  { t: "Start with the mess", pro: "Sketch the whole thing ugly first. Pretty comes last, on purpose.", fun: "Ugly first. Always. Pretty is for people who already know the answer." },
  { t: "Design for the aunt", pro: "If someone's aunt can use it without a manual, it works. That's the whole job.", fun: "My test user is someone's aunt. She is ruthless." },
  { t: "Say the hard thing kindly", pro: "Audits that name the three things that matter, not the thirty that don't.", fun: "I'll hurt your feelings gently, then fix it with you." },
  { t: "Draw it", pro: "When a meeting goes in circles, I draw the thing. Everyone nods.", fun: "Meeting stuck? I draw it. Suddenly everyone agrees. Witchcraft." },
];

export function SkillsPage() {
  const { isProfessional } = useMode();
  usePageMeta({ title: "Skills · Ala'a Ali", description: "What Ala'a brings to the table: UX, UI, illustration, motion, workshops, and building with AI." });

  return (
    <article className="w-full">
      <section className="relative w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px]">
        <Doodle kind="sparkle" className="right-6 md:right-32 top-[96px]" size={40} color="#6A4CFF" />
        <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Skills" : "The table"}</Eyebrow></Reveal>
        <DoodleTitle as="h1" text={isProfessional ? "What I bring {coffee} to the table" : "What I bring {coffee} to the table (besides snacks)"} className="text-[42px] md:text-[80px]" />
        <Reveal delay={0.15}>
          <Prose lead className="mt-6 max-w-[700px]">
            {isProfessional
              ? "Fifteen years of apps, platforms and dashboards, mostly in Arabic and English at the same time. Here's the desk, the tools, and the way I work."
              : "My actual desk. Throw the skills around, poke the things on it. The cat does not approve of any of this."}
          </Prose>
        </Reveal>
      </section>

      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col gap-24 md:gap-32 mt-8 md:mt-10">
        <SkillsTable embedded />

        {/* Tools */}
        <section>
          <SectionTitle className="mb-8">{isProfessional ? "Tools I reach for" : "My weapons"}</SectionTitle>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map((t, i) => (
              <PaperCard key={t.name} tilt={i % 2 ? 2 : -2} className="p-5 flex gap-4">
                <span className="shrink-0"><StickerArt kind={t.kind} size={44} /></span>
                <div className="min-w-0">
                  <h3 className="font-['Playfair_Display'] font-bold text-[20px] leading-tight">{t.name}</h3>
                  <p className="font-['Work_Sans'] text-[14px] text-black/70 mt-1 leading-snug">{t.note[isProfessional ? 0 : 1]}</p>
                  <div className="flex gap-1 mt-3" aria-label={`${t.level} of 5`}>
                    {[1, 2, 3, 4, 5].map((k) => (
                      <motion.span
                        key={k}
                        className="w-5 h-2.5 rounded-full border border-black"
                        style={{ background: k <= t.level ? "#ff614c" : "transparent" }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + k * 0.06 }}
                      />
                    ))}
                  </div>
                </div>
              </PaperCard>
            ))}
          </ul>
          <Scribble className="mt-4">{isProfessional ? "bars are honest. mostly." : "bars are vibes, not data"}</Scribble>
        </section>

        {/* How I work */}
        <section>
          <SectionTitle className="mb-8">{isProfessional ? "How I work" : "House rules"}</SectionTitle>
          <ol className="grid md:grid-cols-2 gap-5 md:gap-6">
            {HOW.map((h, i) => (
              <PaperCard key={h.t} tilt={i % 2 ? -1.5 : 1.5} className="p-6 md:p-7 flex gap-5">
                <span className="font-display text-[#ff614c] text-[44px] leading-none shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-['Playfair_Display'] font-bold text-[22px] md:text-[24px] leading-tight">{h.t}</h3>
                  <Prose className="mt-2 !text-[15.5px] md:!text-[17px]">{isProfessional ? h.pro : h.fun}</Prose>
                </div>
              </PaperCard>
            ))}
          </ol>
        </section>

        <NextTiles
          items={[
            { to: "/experience", k: isProfessional ? "Next" : "Keep going", t: isProfessional ? "Where I've worked" : "The work lore" },
            { to: "/work", k: isProfessional ? "Or" : "Or", t: isProfessional ? "See the work" : "The full damage" },
          ]}
        />
      </div>
    </article>
  );
}
