import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { WorkExperienceSection } from "../components/WorkExperienceSection";
import { Doodle, Reveal, SectionTitle } from "../components/motion/Doodles";
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
    <article className="w-full">
      <section className="relative w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px]">
        <Doodle kind="zigzag" className="right-6 md:right-32 top-[100px]" size={40} color="#FF9F1C" />
        <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Experience" : "The lore"}</Eyebrow></Reveal>
        <DoodleTitle as="h1" text={isProfessional ? "Where I've {head} been" : "How I got {head} here"} className="text-[42px] md:text-[80px]" />
        <Reveal delay={0.15}>
          <Prose lead className="mt-6 max-w-[700px]">
            {isProfessional
              ? "Four timelines, because the work never stayed in one lane: the main career, the teaching, the consulting, and the drawing that turned into content."
              : "Four timelines, because I can't stay in one lane. Tabs are below. Yes, the PlayStation years count."}
          </Prose>
        </Reveal>
      </section>

      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col gap-24 md:gap-32 mt-12 md:mt-16">
        <WorkExperienceSection embedded />

        {/* Clients wall */}
        <section>
          <SectionTitle className="mb-8">{isProfessional ? "People I've worked with" : "Who's paid me so far"}</SectionTitle>
          <ul className="flex flex-wrap gap-2.5 md:gap-3">
            {CLIENTS.map((c, i) => (
              <li key={c}>
                <PaperCard tilt={((i * 7) % 5) - 2} className="rounded-full px-4 py-2 !shadow-[2px_3px_0_0_#1d1a17]">
                  <span className="font-['Work_Sans'] font-semibold text-[14px] md:text-[15px]">{c}</span>
                </PaperCard>
              </li>
            ))}
          </ul>
          <Scribble className="mt-4">{isProfessional ? "and a few I can't name yet" : "+ a few under NDA. very mysterious."}</Scribble>
        </section>

        {/* Talks + teaching */}
        <section>
          <SectionTitle className="mb-8">{isProfessional ? "On stage and on air" : "Talking at people"}</SectionTitle>
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
            { to: "/play", k: isProfessional ? "Or" : "Or", t: isProfessional ? "Take a break" : "Play a game" },
          ]}
        />
      </div>
    </article>
  );
}
