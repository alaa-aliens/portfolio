import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { ExperienceComic } from "../components/story/ExperienceComic";
import { Doodle, Reveal } from "../components/motion/Doodles";
import { Eyebrow, NextTiles, PaperCard, Prose, Scribble } from "../components/ui/Kit";
import { StickerArt } from "../components/play/Stickers";
import { usePageMeta } from "../usePageMeta";

const CLIENTS = ["Al Jazeera", "TRT Arabi", "Riot Games", "Jawaker", "Tamatem", "Carseer", "BravoBravo", "Zain", "42 Amman", "HTU", "Endeavor Jordan", "Saudi Ministry of Justice", "Queen Alia Airport", "Del Monte", "Smasco", "Trackhawk"];

const TALKS: { t: string; w: string }[] = [
  { t: "Ftoor Designer Podcast", w: "Co-host · top 10 design podcasts in MENA" },
  { t: "UX/UI across every government university in Jordan", w: "Instructor · with Zain" },
  { t: "YES JO kids product design program", w: "Instructor · yearly, with Zain" },
  { t: "The Factory · Squared Garage · Design Battle", w: "Community builder" },
];

export function ExperiencePage() {
  const { isProfessional } = useMode();
  usePageMeta({ title: "Experience · Ala'a Ali", description: "15+ years: Al Jazeera, TRT, Syntax, Sitech, freelance; teaching at Zain, 42 Amman, HTU; a top-10 podcast." });

  return (
    <article className="w-full overflow-x-clip">
      <section className="relative w-full max-w-[1000px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] text-center flex flex-col items-center">
        <Doodle kind="zigzag" className="right-6 md:right-32 top-[100px]" size={40} color="#FF9F1C" />
        <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Experience" : "The lore"}</Eyebrow></Reveal>
        <DoodleTitle as="h1" text={isProfessional ? "where i've {star} been" : "how i got {star} here"} className="text-[42px] md:text-[80px]" />
        <Reveal delay={0.15}>
          <Prose lead className="mt-6 max-w-[700px] mx-auto">
            {isProfessional
              ? "Five characters, all me: the designer, the teacher, the consultant, the content creator and the father. Pick one and read their storyline."
              : "Five versions of me. Pick one. The dad one has the harshest reviews."}
          </Prose>
        </Reveal>
      </section>

      <div className="w-full max-w-[1000px] mx-auto px-5 md:px-12 flex flex-col gap-24 md:gap-32 mt-12 md:mt-16">
        <ExperienceComic />

        {/* Clients wall */}
        <section>
          <DoodleTitle text={isProfessional ? "people i've {heart} worked with" : "who's {heart} paid me so far"} className="text-[40px] md:text-[64px] mb-8 text-center" />
          <ul className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            {CLIENTS.map((c, i) => (
              <li key={c}>
                <motion.span
                  initial={{ opacity: 0, y: 8, rotate: ((i * 7) % 5) - 2 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.04 }}
                  className="inline-block font-display text-[22px] md:text-[28px] lowercase text-black hover:text-[#ff614c] transition-colors"
                  style={{ rotate: `${((i * 7) % 5) - 2}deg` }}
                >
                  {c}<span className="text-[#ff614c] mx-2">·</span>
                </motion.span>
              </li>
            ))}
          </ul>
          <Scribble className="mt-4 text-center">{isProfessional ? "and a few I can't name yet" : "+ a few under NDA. very mysterious."}</Scribble>
        </section>

        {/* Talks + teaching */}
        <section>
          <DoodleTitle text={isProfessional ? "on stage {sparkle} and on air" : "talking {sparkle} at people"} className="text-[40px] md:text-[64px] mb-8 text-center" />
          <ul className="grid md:grid-cols-2 gap-5">
            {TALKS.map((t, i) => (
              <PaperCard key={t.t} tilt={i % 2 ? 1.5 : -1.5} className="p-5 flex items-start gap-4">
                <span className="shrink-0"><StickerArt kind={i === 0 ? "crown" : i === 1 ? "star" : i === 2 ? "heart" : "sparkle"} size={40} /></span>
                <div>
                  <h3 className="font-['Playfair_Display'] font-bold text-[19px] md:text-[21px] leading-tight">{t.t}</h3>
                  <p className="font-['Work_Sans'] text-[13.5px] text-black/65 mt-1">{t.w}</p>
                </div>
              </PaperCard>
            ))}
          </ul>
        </section>

        <NextTiles
          items={[
            { to: "/work", k: isProfessional ? "Next" : "Keep going", t: isProfessional ? "See the work" : "The full damage" },
            { to: "/contact", k: isProfessional ? "Or" : "Or", t: isProfessional ? "Say hello" : "Say hi, I don't bite" },
          ]}
        />
      </div>
    </article>
  );
}
