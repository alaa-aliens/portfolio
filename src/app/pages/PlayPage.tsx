import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { FindTheButton } from "../components/play/FindTheButton";
import { Doodle, Reveal } from "../components/motion/Doodles";
import { Eyebrow, NextTiles, Prose, Scribble } from "../components/ui/Kit";
import { usePageMeta } from "../usePageMeta";

export function PlayPage() {
  const { isProfessional } = useMode();
  usePageMeta({ title: "Play · Ala'a Ali", description: "Find the Button: a tiny game about UX crimes, by Ala'a Ali." });
  return (
    <article className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] pb-8 flex flex-col gap-20 md:gap-28">
      <section className="relative">
        <Doodle kind="bolt" className="right-6 md:right-32 top-[-10px]" size={42} color="#FF9F1C" />
        <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Play" : "Procrastinate"}</Eyebrow></Reveal>
        <DoodleTitle as="h1" text={isProfessional ? "Find the {bolt} button" : "Find the {bolt} button, or else"} className="text-[44px] md:text-[80px]" />
        <Reveal delay={0.15}>
          <Prose lead className="mt-6 max-w-[700px]">
            {isProfessional
              ? "A small game about the UX crimes I audit every week. Five fake screens, one real button each. Find it before the user gives up."
              : "Every level is a real pattern someone has asked me to build. I said no. Now you suffer instead."}
          </Prose>
        </Reveal>
        <Scribble className="mt-3">{isProfessional ? "best on a laptop, works on a phone" : "turn your sound on. kidding. there's no sound. yet."}</Scribble>
      </section>

      <FindTheButton />

      <NextTiles
        items={[
          { to: "/work", k: isProfessional ? "Back to work" : "Ok, back to work", t: isProfessional ? "See the real projects" : "The full damage" },
          { to: "/contact", k: isProfessional ? "Or" : "Or", t: isProfessional ? "Hire the person who made this" : "Hire me, I'm fun" },
        ]}
      />
    </article>
  );
}
