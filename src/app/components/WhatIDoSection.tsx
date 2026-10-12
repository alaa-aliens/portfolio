import imgImage37 from "figma:asset/e1bc33a6eca046916183a4821600eb03ec70fd26.png";
import imgImage36 from "figma:asset/06bd2d2586919b8105c2daf716cd136fdb5b5b11.png";
import imgImage38 from "figma:asset/7d1c70ce8d978daa5db3cd98761c352b121d3ad8.png";
import imgImage39 from "figma:asset/252ea155a12647263e0584fcfb49c846a8ff727f.png";
import { useMode } from "./ModeContext";
import { motion } from "motion/react";
import { PenWipe } from "./motion/Doodles";
import { DoodleTitle } from "./play/DoodleTitle";
import { FlipCards } from "./story/FlipCards";

export interface ServiceCard {
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

export const professionalCards: ServiceCard[] = [
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

export const funCards: ServiceCard[] = [
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

  return (
    <section id="services" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-28 md:pt-40 pb-4">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <DoodleTitle text={isProfessional ? "what i {sparkle} do" : "what i {sparkle} actually do"} className="text-[44px] md:text-[72px] mb-2" />
        <p className="font-['Shantell_Sans',cursive] text-[14px] text-black/55 rotate-[-1deg] mb-12">{isProfessional ? "what clients ask for, and what I actually do. flip them." : "front: what you ask for. back: what you get. flip them."}</p>
        <FlipCards />
      </motion.div>
    </section>
  );
}