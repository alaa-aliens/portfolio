import { useMode } from "./ModeContext";
import { motion } from "motion/react";
import { Reveal, SectionTitle } from "./motion/Doodles";

const professionalContent = {
  title: "About Me",
  paragraphs: [
    "I'm a UX/UI Designer, Illustrator, and Workshop Facilitator based in Amman, Jordan, with over 15 years of experience designing digital products across the MENA region.",
    "I've worked with brands like Al Jazeera, TRT Arabi, Del Monte, and government entities across Jordan, Saudi Arabia, and the UAE \u2014 designing everything from news platforms and fintech apps to education systems and e-commerce experiences.",
    "Beyond client work, I teach and facilitate UX/UI workshops at universities, bootcamps, and organizations like Zain and 42 Amman. I believe design is a skill that should be shared, not gatekept.",
    "I also run @alaa_aliens on Instagram, where I create hand-drawn educational content that makes UX concepts simple, visual, and actually fun to learn.",
  ],
};

const funContent = {
  title: "From Couches to Pixels",
  paragraphs: [
    "I'm Ala'a \u2014 believe it or not, I started my career stitching couches. Plot twist: now I stitch pixels together. The career path makes absolutely no sense, but honestly? Both jobs are about making things people sit with comfortably.",
    "I've designed apps, dashboards, websites, and platforms for clients across the Middle East. Al Jazeera, TRT, Del Monte, government stuff \u2014 you name it. If it has a screen and a stakeholder saying 'can we make it pop,' I've been there.",
    "When I'm not redesigning someone's entire product in my head at dinner, I'm in a classroom teaching UX/UI workshops \u2014 convincing a new generation that Comic Sans is never the answer. Not even ironically. Ok maybe ironically.",
    "I also run @alaa_aliens on Instagram where I draw doodles that explain UX concepts. Think design education meets sleep-deprived cartoon characters. It's basically therapy \u2014 for me, not for you.",
  ],
};

export function AboutSection() {
  const { isProfessional, mode } = useMode();
  const content = isProfessional ? professionalContent : funContent;

  return (
    <section id="about" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <SectionTitle className="mb-8">{content.title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-6">
            <Reveal delay={0.0}><p className="font-['IBM_Plex_Serif'] text-black text-[16px] md:text-[20px] leading-[1.6]">
              {content.paragraphs[0]}
            </p></Reveal>
            <Reveal delay={0.1}><p className="font-['IBM_Plex_Serif'] text-black text-[16px] md:text-[20px] leading-[1.6]">
              {content.paragraphs[1]}
            </p></Reveal>
          </div>
          <div className="flex flex-col gap-6">
            <Reveal delay={0.2}><p className="font-['IBM_Plex_Serif'] text-black text-[16px] md:text-[20px] leading-[1.6]">
              {content.paragraphs[2]}
            </p></Reveal>
            <Reveal delay={0.3}><p className="font-['IBM_Plex_Serif'] text-black text-[16px] md:text-[20px] leading-[1.6]">
              {content.paragraphs[3]}
            </p></Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
}