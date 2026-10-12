/*
 * The front door. One long, hand-drawn scroll:
 * hero → numbers → what I do (his illustrations) → work film strip →
 * about (comic strip) → sketchbook you can mess with → the road so far → footer.
 */
import { Link } from "react-router";
import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { HeroSection } from "../components/HeroSection";
import { StatsSection } from "../components/StatsSection";
import { WhatIDoSection } from "../components/WhatIDoSection";
import { WorkStrip } from "../components/home/WorkStrip";
import { Sketchbook } from "../components/home/Sketchbook";
import { ComicStrip } from "../components/story/ComicStrip";
import { Journey } from "../components/story/Journey";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { Reveal } from "../components/motion/Doodles";
import { ToBeContinued } from "../components/play/ToBeContinued";
import { Button, Prose, Scribble } from "../components/ui/Kit";
import { usePageMeta } from "../usePageMeta";
import stMug from "../../assets/stickers/mug.webp";

const ROAD = {
  pro: [
    { date: "2007", title: "Upholsterer & gamer", body: "Stitching couches in Irbid by day, PlayStation by night. Both taught me patience with things that don't fit." },
    { date: "2010", title: "Graphic design, with honours", body: "Irbid National University. The first time someone paid me to draw." },
    { date: "2012", title: "300+ children's book illustrations", body: "Square Design. My hand still remembers every one." },
    { date: "2018", title: "Al Jazeera, then TRT Arabi", body: "Motion and visual design for news reaching millions, in Doha and Istanbul." },
    { date: "2021", title: "Lead UI/UX at Syntax", body: "All the digital products, the interaction models, the arguments about border radius." },
    { date: "2025", title: "Director of UX, and solo", body: "Sitech/Azm by day, my own consultancy the rest of the time: gov, fintech, edtech, games." },
    { date: "now", title: "Building my own things", body: "Siba and Siba List for my daughters, teaching at 42 Amman, and this website." },
  ],
  fun: [
    { date: "2007", title: "The origin story", body: "Couches by day, PlayStation by night. Peak multitasking." },
    { date: "2010", title: "The degree", body: "Honours. Mom was proud. Dad asked when I'd get a real job." },
    { date: "2012", title: "Drawing for a living", body: "300+ kids' book illustrations. My hand still hurts." },
    { date: "2018", title: "The news years", body: "Al Jazeera, then TRT. Learned to design while everything is breaking." },
    { date: "2021", title: "The lead designer arc", body: "Led a team. Debated border-radius like it was a life decision." },
    { date: "2025", title: "The director era", body: "Fancy title. Still googled flexbox." },
    { date: "now", title: "Dad apps", body: "Built two apps for my kids. Harshest product reviews of my career." },
  ],
};

export function HomePage() {
  const { isProfessional } = useMode();
  usePageMeta();

  return (
    <main className="flex flex-col">
      <HeroSection />
      <StatsSection />

      {/* What I do: his four illustrations */}
      <WhatIDoSection />

      {/* Work: the film strip */}
      <WorkStrip />

      {/* About: a short hello + the comic strip */}
      <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-24 md:pt-36">
        <div className="grid md:grid-cols-[1fr_200px] gap-8 items-end">
          <div>
            <DoodleTitle text={isProfessional ? "a bit about {coffee} me" : "the {coffee} lore"} className="text-[44px] md:text-[72px]" />
            <Reveal delay={0.1}>
              <Prose lead className="mt-5 max-w-[680px]">
                {isProfessional
                  ? "I'm Ala'a, a UX/UI designer, illustrator and workshop facilitator in Amman. I started out stitching couches. Now I stitch pixels. Both jobs are about making something people can sit with comfortably."
                  : "I used to stitch couches for a living. Plot twist: now I stitch pixels. If it has a screen and someone saying \"can we make it pop\", I've been there."}
              </Prose>
            </Reveal>
            <Scribble className="mt-3">{isProfessional ? "six panels, then the rest on the about page" : "six panels. drag them. they like it."}</Scribble>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            className="hidden md:block relative w-[200px] h-[220px] shrink-0"
            aria-hidden
          >
            {/* steam */}
            {[0, 1, 2].map((i) => (
              <motion.svg
                key={i}
                viewBox="0 0 20 60"
                className="absolute top-0 w-[22px] h-[70px]"
                style={{ left: 60 + i * 30 }}
                fill="none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 0.6, 0], y: [10, -14, -36] }}
                transition={{ duration: 2.6, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
              >
                <path d="M10 58 C 2 46, 18 38, 10 26 S 2 10, 10 2" stroke="#1d1a17" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>
            ))}
            <img src={stMug} alt="" className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[170px] h-auto max-w-none" />
          </motion.div>
        </div>
        <div className="mt-10 md:mt-14">
          <ComicStrip />
        </div>
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <Button to="/about">{isProfessional ? "the whole story" : "more lore"} →</Button>
          <Link to="/skills" className="font-['Shantell_Sans',cursive] text-[15px] text-black/60 hover:text-[#ff614c]">{isProfessional ? "or see my desk and tools" : "or go throw my skills around"} →</Link>
        </div>
      </section>

      {/* Sketchbook */}
      <Sketchbook />

      {/* The road so far */}
      <section className="w-full max-w-[1000px] mx-auto px-5 md:px-12 pt-24 md:pt-36">
        <div className="mb-10 md:mb-14">
          <DoodleTitle text={isProfessional ? "the road {star} so far" : "how i got {star} here"} className="text-[44px] md:text-[72px]" />
          <Scribble className="mt-1">{isProfessional ? "scroll and it draws itself" : "it's a road. it draws. you scroll."}</Scribble>
        </div>
        <Journey stops={isProfessional ? ROAD.pro : ROAD.fun} color="#ff614c" />
        <ToBeContinued to="/experience" label={isProfessional ? "the road continues" : "next episode"} note={isProfessional ? "four timelines, all the detours" : "four timelines. the PlayStation years count."} />
      </section>

      <div className="h-16 md:h-24" />
    </main>
  );
}
