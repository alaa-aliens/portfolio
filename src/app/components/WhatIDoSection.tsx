import imgImage37 from "figma:asset/e1bc33a6eca046916183a4821600eb03ec70fd26.png";
import imgImage36 from "figma:asset/06bd2d2586919b8105c2daf716cd136fdb5b5b11.png";
import imgImage38 from "figma:asset/7d1c70ce8d978daa5db3cd98761c352b121d3ad8.png";
import imgImage39 from "figma:asset/252ea155a12647263e0584fcfb49c846a8ff727f.png";
import { useMode } from "./ModeContext";
import { motion } from "motion/react";
import { PenWipe, SectionTitle } from "./motion/Doodles";

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  imageRenderer: () => React.ReactNode;
}

function Image37() {
  return (
    <div className="overflow-visible relative shrink-0 aspect-square w-full">
      <div
        className="absolute pointer-events-none"
        style={{
          width: "94.18%",
          height: "125.64%",
          left: "2.66%",
          top: "-21.43%",
        }}
      >
        <img
          alt="UX/UI Design & Strategy"
          className="absolute inset-0 max-w-none object-cover size-full"
          src={imgImage37}
        />
      </div>
    </div>
  );
}

function Image36() {
  return (
    <div className="overflow-visible relative shrink-0 aspect-square w-full">
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{
          width: "107.89%",
          height: "92.69%",
          left: "-11.56%",
          top: "0%",
        }}
      >
        <img
          alt="Consultation & UX Audits"
          className="absolute max-w-none w-full"
          style={{ height: "155.26%", top: "-8.44%" }}
          src={imgImage36}
        />
      </div>
    </div>
  );
}

function Image38() {
  return (
    <div className="overflow-visible relative shrink-0 aspect-square w-full">
      <div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          width: "159.75%",
          height: "110.27%",
          left: "-30.07%",
          top: "-9.80%",
        }}
      >
        <div
          style={{
            transform: "rotate(6.04deg)",
            width: "94.27%",
            height: "86.11%",
          }}
        >
          <div className="relative overflow-hidden w-full h-full">
            <img
              alt="Workshops & Training"
              className="absolute max-w-none w-full"
              style={{ height: "211.57%", top: "-44.57%" }}
              src={imgImage38}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Image39() {
  return (
    <div className="overflow-visible relative shrink-0 aspect-square w-full">
      <div
        className="absolute pointer-events-none"
        style={{
          width: "145.98%",
          height: "194.74%",
          left: "-22.99%",
          top: "-44.06%",
        }}
      >
        <img
          alt="Visual & Illustration"
          className="absolute inset-0 max-w-none object-cover size-full"
          src={imgImage39}
        />
      </div>
    </div>
  );
}

const professionalCards: ServiceCard[] = [
  {
    title: "UX/UI Design & Strategy",
    description:
      "End-to-end digital experiences, from research and wireframes to high-fidelity prototypes and design systems.",
    image: imgImage37,
    imageRenderer: Image37,
  },
  {
    title: "Consultation & UX Audits",
    description:
      "Detailed analysis and actionable insights to improve existing products \u2014 usability, flows, and interface quality.",
    image: imgImage36,
    imageRenderer: Image36,
  },
  {
    title: "Workshops & Training",
    description:
      "Teaching design thinking and Figma to teams, students, and organizations across Jordan and the MENA region.",
    image: imgImage38,
    imageRenderer: Image38,
  },
  {
    title: "Visual & Illustration",
    description:
      "Identity systems, custom illustration, hand-drawn content, and motion graphics that give brands a human touch.",
    image: imgImage39,
    imageRenderer: Image39,
  },
];

const funCards: ServiceCard[] = [
  {
    title: "Make Things Pretty (and Usable)",
    description:
      "I take messy ideas and turn them into interfaces people don't rage-quit. Research, wireframes, prototypes \u2014 the whole thing.",
    image: imgImage37,
    imageRenderer: Image37,
  },
  {
    title: "Tell You What's Wrong (Nicely)",
    description:
      "You built a product and something feels off? I'll find the problems, hurt your feelings gently, and fix it.",
    image: imgImage36,
    imageRenderer: Image36,
  },
  {
    title: "Talk at People (They Seem to Like It)",
    description:
      "I stand in front of rooms and teach UX/UI. Sometimes they clap. Sometimes they just want the Figma shortcuts.",
    image: imgImage38,
    imageRenderer: Image38,
  },
  {
    title: "Draw Stuff",
    description:
      "Logos, illustrations, doodles, motion graphics. If it can be drawn, I've probably drawn it at 2am with coffee.",
    image: imgImage39,
    imageRenderer: Image39,
  },
];

export function WhatIDoSection() {
  const { isProfessional, mode } = useMode();
  const cards = isProfessional ? professionalCards : funCards;

  return (
    <section id="services" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <SectionTitle className="mb-8">{isProfessional ? "What I Do" : "What I Actually Do"}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-row sm:flex-col items-start gap-4 sm:gap-[17px]"
            >
              <PenWipe delay={0.15 + i * 0.12} duration={1} className="w-[100px] sm:w-[75%] shrink-0">
                <motion.div
                  className="overflow-clip"
                  whileHover={{ rotate: [0, -3, 3, -2, 0], scale: 1.04 }}
                  transition={{ duration: 0.5 }}
                >
                  <card.imageRenderer />
                </motion.div>
              </PenWipe>
              <div className="flex flex-col gap-[9px] min-w-0">
                <h3 className="font-['IBM_Plex_Serif'] font-semibold text-black group-hover:text-[#ff614c] transition-colors text-[16px] md:text-[24px] leading-[1.3] md:leading-[32px]">
                  {card.title}
                </h3>
                <p className="font-['Work_Sans'] font-light text-black text-[13px] md:text-[16px] leading-[1.5] md:leading-[24px]">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}