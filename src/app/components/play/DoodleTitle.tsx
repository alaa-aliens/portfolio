import imgHeadCut from "../../../assets/head.webp";
/*
 * hilos-style headline: little drawings sit inside the words.
 * Write the text with {tokens} where a doodle should go, e.g. "Stuff I've {pencil} designed".
 */
import React from "react";
import { motion } from "motion/react";
import { Reveal, ScribbleUnderline } from "../motion/Doodles";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import imgHand from "figma:asset/e1bc33a6eca046916183a4821600eb03ec70fd26.png";
import imgBoard from "figma:asset/7d1c70ce8d978daa5db3cd98761c352b121d3ad8.png";
import { StickerArt, type Kind } from "./Stickers";

const ART: Record<string, React.ReactNode> = {
  coffee: <StickerArt kind="mug" size={52} />,
  head: (
    <span className="relative inline-block w-[0.9em] h-[1.05em] overflow-hidden align-[-0.15em]">
      <img src={imgHeadCut} alt="" className="absolute inset-0 w-full h-full object-contain max-w-none" />
    </span>
  ),
  pencil: (
    <svg viewBox="0 0 60 40" className="inline-block w-[1.25em] h-[0.85em] align-[-0.05em]" fill="none" aria-hidden>
      <path d="M6 30 L44 8 L52 14 L14 36 L4 38 Z" fill="#FFC53D" stroke="#1d1a17" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M44 8 L52 14 L56 11 C 57 9, 55 6, 52 5 L48 6 Z" fill="#ff614c" stroke="#1d1a17" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M6 30 L14 36" stroke="#1d1a17" strokeWidth="2.6" />
      <path d="M4 38 L8 33" stroke="#1d1a17" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  hand: (
    <span className="relative inline-block w-[1.1em] h-[1em] overflow-hidden align-[-0.12em]">
      <img src={imgHand} alt="" className="absolute w-[150%] max-w-none left-[-20%] top-[-25%]" />
    </span>
  ),
  board: (
    <span className="relative inline-block w-[1.2em] h-[0.95em] overflow-hidden align-[-0.1em]">
      <img src={imgBoard} alt="" className="absolute w-[160%] max-w-none left-[-30%] top-[-30%]" />
    </span>
  ),
};

export function DoodleTitle({
  text,
  className = "",
  as = "h2",
  underline = true,
  color,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  underline?: boolean;
  color?: string;
}) {
  const H = as;
  const parts = text.split(/(\{[a-z]+\})/g).filter(Boolean);
  // margins and centering belong to the wrapper (so the underline follows the title)
  const wrapCls = (className.match(/\b(mb-\S+|mt-\S+|my-\S+)\b/g) ?? []).join(" ");
  const center = /text-center/.test(className);
  const hCls = className.replace(/\b(mb-\S+|mt-\S+|my-\S+)\b/g, "").trim();
  return (
    <div className={`inline-flex flex-col gap-1 ${center ? "items-center" : ""} ${wrapCls}`}>
      <Reveal y={16}>
        <H
          aria-label={text.replace(/\{[a-z]+\}\s?/g, "")}
          className={`font-display lowercase text-black leading-[1] [text-wrap:balance] ${hCls}`}
        >
          {parts.map((p, i) => {
            const m = p.match(/^\{([a-z]+)\}$/);
            if (!m) return <span key={i} aria-hidden>{p}</span>;
            const node = ART[m[1]] ?? <StickerArt kind={m[1] as Kind} size={40} />;
            return (
              <motion.span
                key={i}
                aria-hidden
                className="inline-block mx-[0.08em]"
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.25 + i * 0.05 }}
                whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.5 } }}
              >
                {node}
              </motion.span>
            );
          })}
        </H>
      </Reveal>
      {underline && <ScribbleUnderline color={color} width={140} />}
    </div>
  );
}
