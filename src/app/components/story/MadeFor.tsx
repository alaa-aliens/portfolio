/*
 * "Made for …": the people a project was really built for, as taped-in pictures.
 * Tap a picture and the character greets them by name (real recorded clip).
 */
import { motion } from "motion/react";
import { EqBars, useClip } from "./CharacterMoods";
import { StickerArt } from "../play/Stickers";

export interface Person {
  name: string;
  img: string;
  note: string;
  audio?: string;
  line?: string;
  tint?: string;
}

export function MadeFor({ intro, people, closing }: { intro: string; people: Person[]; closing?: string }) {
  const { play, playing } = useClip();
  return (
    <div className="flex flex-col gap-10">
      <p className="font-['IBM_Plex_Serif'] text-[17px] md:text-[21px] leading-[1.65] text-black max-w-[760px]">{intro}</p>
      <div className="grid sm:grid-cols-2 gap-10 md:gap-14 px-2 md:px-6">
        {people.map((p, i) => {
          const on = playing === p.audio;
          return (
            <motion.figure
              key={p.name}
              initial={{ opacity: 0, y: 40, rotate: i % 2 ? 6 : -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2.5 : -2.5 }}
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ rotate: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 140, damping: 14 }}
              className="relative bg-white p-3 pb-5 shadow-[0_18px_40px_-20px_rgba(60,35,10,.55)]"
            >
              <span aria-hidden className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 rotate-[-3deg] opacity-80" style={{ background: `${p.tint ?? "#FFE9C7"}` }} />
              <motion.span aria-hidden className="absolute -top-5 -right-4 z-10" animate={{ rotate: [0, 12, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.4, repeat: Infinity, delay: i }}>
                <StickerArt kind={i % 2 ? "star" : "heart"} size={40} />
              </motion.span>
              <button
                onClick={() => play(p.audio)}
                aria-label={p.audio ? `Hear Siba greet ${p.name}` : p.name}
                className="relative block w-full aspect-square overflow-hidden"
                style={{ background: `${p.tint ?? "#FFE9C7"}66` }}
              >
                <img src={p.img} alt={`${p.name}'s avatar`} className="absolute inset-0 w-full h-full object-contain object-bottom" draggable={false} />
                {p.audio && (
                  <span className={`absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-black font-['Work_Sans'] text-[12px] font-semibold ${on ? "bg-black text-white" : "bg-white"}`}>
                    {on ? <EqBars /> : "▶"} {on ? "Siba's talking" : `Siba says hi to ${p.name}`}
                  </span>
                )}
              </button>
              <figcaption className="pt-4 px-1">
                <span className="block font-display lowercase text-[34px] md:text-[42px] leading-none text-[#1d1a17]">{p.name}</span>
                <span className="block mt-2 font-['Shantell_Sans',cursive] text-[15px] md:text-[16px] leading-snug text-black/70">{p.note}</span>
                {p.line && <span className="block mt-2 font-['Work_Sans'] text-[13px] text-black/45">Siba: “{p.line}”</span>}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
      {closing && (
        <p className="font-['IBM_Plex_Serif'] italic font-light text-[18px] md:text-[24px] leading-[1.5] text-black text-center max-w-[680px] mx-auto">
          {closing}
        </p>
      )}
    </div>
  );
}
