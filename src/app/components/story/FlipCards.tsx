/*
 * "What I Do" as flip cards: the front says what clients think I do,
 * the back says what I actually do. Tap or hover to flip.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { professionalCards, funCards } from "../WhatIDoSection";

const ACTUALLY = [
  { front: "Make it pretty", back: "Make it obvious. Pretty is a side effect of clear." },
  { front: "Tell us what's wrong", back: "Find the three things that matter, say them kindly, then fix them with you." },
  { front: "Give a talk", back: "Get a room of people to disagree out loud, then build something together." },
  { front: "Draw a logo", back: "Draw the thing nobody could explain in a meeting, so everyone finally nods." },
];

export function FlipCards() {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      {professionalCards.map((c, i) => {
        const open = flipped === i;
        const fun = funCards[i];
        return (
          <button
            key={c.title}
            type="button"
            onClick={() => setFlipped(open ? null : i)}
            onMouseEnter={() => setFlipped(i)}
            onMouseLeave={() => setFlipped(null)}
            aria-pressed={open}
            className="group relative h-[360px] md:h-[400px] [perspective:1200px] text-left outline-none focus-visible:ring-4 focus-visible:ring-[#ff614c]/40 rounded-[20px]"
          >
            <motion.div
              className="relative w-full h-full [transform-style:preserve-3d]"
              animate={{ rotateY: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              {/* front */}
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-[18px] border border-black bg-[#fffaf1] p-5 flex flex-col" style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}>
                <span className="font-['Work_Sans'] text-[10.5px] uppercase tracking-[0.16em] text-black/45">what clients ask for</span>
                <div className="w-[70%] mx-auto mt-3 mb-2 shrink-0">
                  <c.imageRenderer />
                </div>
                <h3 className="font-display lowercase text-[26px] leading-tight mt-auto">“{ACTUALLY[i].front}”</h3>
                <span className="mt-2 font-['Shantell_Sans',cursive] text-[13px] text-black/50">{c.title} · flip me ↻</span>
              </div>
              {/* back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[18px] border border-black bg-[#ff614c] text-[#fffaf1] p-5 flex flex-col" style={{ borderRadius: "18px 225px 18px 255px / 255px 18px 225px 18px" }}>
                <span className="font-['Work_Sans'] text-[10.5px] uppercase tracking-[0.16em] text-[#fffaf1]/50">what I actually do</span>
                <h3 className="font-display lowercase text-[#1d1a17] text-[30px] leading-[1] mt-4">{fun.title}</h3>
                <p className="font-['IBM_Plex_Serif'] text-[16px] leading-[1.55] mt-4">{ACTUALLY[i].back}</p>
                <p className="font-['Work_Sans'] text-[13.5px] leading-snug text-[#fffaf1]/85 mt-auto">{c.description}</p>
              </div>
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
