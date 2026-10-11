import { motion } from "motion/react";
import { Link } from "react-router";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { ComicStrip } from "../components/story/ComicStrip";
import { FlipCards } from "../components/story/FlipCards";
import { Doodle, Reveal, CountUp } from "../components/motion/Doodles";
import { NextTiles } from "../components/ui/Kit";
import { StickerArt, type Kind } from "../components/play/Stickers";
import { usePageMeta } from "../usePageMeta";
import imgImage14 from "figma:asset/48b24d576823e0c5848a509aca20ff871581ad60.png";

const FACTS: { kind: Kind; pro: string; fun: string }[] = [
  { kind: "coffee", pro: "Based in Amman, Jordan. Works across MENA.", fun: "Amman, Jordan. Where the coffee is strong and the meetings are stronger." },
  { kind: "user", pro: "Two daughters who test everything I build.", fun: "Two daughters, zero mercy in usability tests." },
  { kind: "bolt", pro: "15+ years, from couches to pixels.", fun: "Survived 5 PlayStation generations and 3 design-tool wars." },
  { kind: "heart", pro: "Draws UX explainers as @alaa_aliens.", fun: "Doodles about UX at 2am. It's therapy, for me not you." },
  { kind: "crown", pro: "Co-hosted a top-10 design podcast in MENA.", fun: "Had a podcast. Pretended to have my life together. Top 10, somehow." },
  { kind: "sparkle", pro: "Teaches design at universities and companies.", fun: "Teaches design. Students mostly want the Figma shortcuts." },
];

export function AboutPage() {
  const { isProfessional } = useMode();
  usePageMeta({ title: "About · Ala'a Ali", description: "From stitching couches in Irbid to designing products across MENA. The story, the doodles, the daughters." });

  return (
    <article className="w-full">
      {/* Hero */}
      <section className="relative w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] overflow-hidden">
        <Doodle kind="star" className="right-4 md:right-28 top-[100px]" size={44} />
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <Reveal y={12}>
              <p className="font-['Work_Sans'] uppercase tracking-[0.2em] text-[12px] md:text-[13px] text-black/50 mb-3">{isProfessional ? "About" : "The lore"}</p>
            </Reveal>
            <DoodleTitle as="h1" text={isProfessional ? "From couches {coffee} to pixels" : "Couch guy {coffee} turned pixel guy"} className="text-[44px] md:text-[84px]" />
            <Reveal delay={0.15}>
              <p className="font-['IBM_Plex_Serif'] text-black text-[17px] md:text-[22px] leading-[1.55] mt-6 max-w-[680px]">
                {isProfessional
                  ? "I'm Ala'a: a UX/UI designer, illustrator and workshop facilitator in Amman. I started my career stitching couches. Now I stitch pixels. The path makes no sense on paper, but both jobs are about making things people sit with comfortably."
                  : "I'm Ala'a. I used to stitch couches for a living. Plot twist: now I stitch pixels. If it has a screen and a stakeholder saying \"can we make it pop\", I've been there."}
              </p>
            </Reveal>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
            className="hidden md:block w-[230px] h-[400px] relative shrink-0 self-end"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img alt="" className="absolute h-[168%] left-[-96%] top-[-48%] w-[222%] max-w-none" src={imgImage14} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col gap-24 md:gap-32 mt-16 md:mt-24">
        {/* Comic strip */}
        <section>
          <DoodleTitle text={isProfessional ? "the story, in {star} six panels" : "the origin {star} story"} className="text-[40px] md:text-[64px] mb-10 md:mb-14" />
          <ComicStrip />
        </section>

        {/* What I do */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8 md:mb-10">
            <DoodleTitle text={isProfessional ? "what i {sparkle} do" : "what i {sparkle} actually do"} className="text-[40px] md:text-[64px]" />
            <p className="font-['Shantell_Sans',cursive] text-[14px] text-black/55 md:mb-5">flip a card</p>
          </div>
          <FlipCards />
        </section>

        {/* Numbers */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { n: 15, s: "+", l: isProfessional ? "years in design" : "years of \"can we make it pop\"" },
            { n: 100, s: "+", l: isProfessional ? "products shipped" : "things that went live" },
            { n: 50, s: "+", l: isProfessional ? "clients across MENA" : "clients who said yes" },
            { n: 300, s: "+", l: isProfessional ? "illustrations for kids' books" : "drawings, hand still sore" },
          ].map((x, i) => (
            <Reveal key={x.l} delay={i * 0.08} className="border-t-2 border-black pt-4">
              <span className="font-display text-[#ff614c] text-[52px] md:text-[72px] leading-none">
                <CountUp to={x.n} suffix={x.s} />
              </span>
              <p className="font-['IBM_Plex_Serif'] text-[15px] md:text-[17px] mt-1">{x.l}</p>
            </Reveal>
          ))}
        </section>

        {/* Facts */}
        <section>
          <DoodleTitle text={isProfessional ? "a few {heart} more things" : "random {heart} facts"} className="text-[40px] md:text-[64px] mb-8" />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {FACTS.map((f, i) => (
              <motion.li
                key={f.kind}
                initial={{ opacity: 0, y: 20, rotate: i % 2 ? 2 : -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ rotate: 0, y: -4 }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="flex items-start gap-4 rounded-[18px] border border-black bg-[#fffaf1] p-4 shadow-[3px_4px_0_0_#1d1a17]"
              >
                <span className="shrink-0 mt-0.5"><StickerArt kind={f.kind} size={40} /></span>
                <p className="font-['IBM_Plex_Serif'] text-[15.5px] md:text-[17px] leading-[1.5]">{isProfessional ? f.pro : f.fun}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <NextTiles
          items={[
            { to: "/skills", k: isProfessional ? "next" : "keep going", t: isProfessional ? "what I bring to the table" : "the skills table" },
            { to: "/experience", k: isProfessional ? "or" : "or", t: isProfessional ? "where I've worked" : "the work lore" },
          ]}
        />
      </div>
    </article>
  );
}
