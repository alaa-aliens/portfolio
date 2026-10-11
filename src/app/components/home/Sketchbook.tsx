/*
 * The sketchbook: a dashed board with doodles scattered on it.
 * Everything is draggable; whatever you grab comes to the front.
 * "Shuffle" throws them around again.
 */
import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import imgImage37 from "figma:asset/e1bc33a6eca046916183a4821600eb03ec70fd26.png";
import imgImage36 from "figma:asset/06bd2d2586919b8105c2daf716cd136fdb5b5b11.png";
import imgImage38 from "figma:asset/7d1c70ce8d978daa5db3cd98761c352b121d3ad8.png";
import imgImage39 from "figma:asset/252ea155a12647263e0584fcfb49c846a8ff727f.png";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { useMode } from "../ModeContext";
import { DoodleTitle } from "../play/DoodleTitle";
import { StickerArt, type Kind } from "../play/Stickers";
import { Thing } from "../play/DeskThings";
import { Scribble } from "../ui/Kit";
import { addScore } from "../play/Score";

type Item =
  | { kind: "img"; src: string; w: number; label: string }
  | { kind: "sticker"; id: Kind; w: number; label: string }
  | { kind: "thing"; id: "cat" | "mug" | "controller" | "plant"; w: number; label: string }
  | { kind: "note"; text: string; w: number; label: string };

const ITEMS: Item[] = [
  { kind: "img", src: imgImage37, w: 190, label: "wireframes" },
  { kind: "img", src: imgImage36, w: 170, label: "the audit scribble" },
  { kind: "img", src: imgImage38, w: 180, label: "workshop board" },
  { kind: "img", src: imgImage39, w: 170, label: "the drawing hand" },
  { kind: "img", src: imgHead, w: 120, label: "me, apparently" },
  { kind: "thing", id: "cat", w: 130, label: "Diva" },
  { kind: "thing", id: "mug", w: 90, label: "coffee no. 4" },
  { kind: "thing", id: "controller", w: 110, label: "research" },
  { kind: "sticker", id: "star", w: 56, label: "" },
  { kind: "sticker", id: "heart", w: 52, label: "" },
  { kind: "sticker", id: "bolt", w: 54, label: "" },
  { kind: "sticker", id: "wow", w: 64, label: "" },
  { kind: "note", text: "make it pop", w: 150, label: "" },
  { kind: "note", text: "users don't read", w: 160, label: "" },
  { kind: "note", text: "border-radius: 18px?", w: 170, label: "" },
];

function rnd(seed: number) {
  // small deterministic PRNG so the board looks the same on each visit until shuffled
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Sketchbook() {
  const { isProfessional } = useMode();
  const board = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState(7);
  const [top, setTop] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>(() => ITEMS.map((_, i) => i));

  const layout = useMemo(() => {
    const r = rnd(seed);
    return ITEMS.map(() => ({ x: 4 + r() * 78, y: 4 + r() * 70, rot: -14 + r() * 28 }));
  }, [seed]);

  const bring = (i: number) => {
    setTop(i);
    setOrder((o) => [...o.filter((k) => k !== i), i]);
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-24 md:pt-36">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <DoodleTitle text={isProfessional ? "the {pencil} sketchbook" : "my {pencil} mess"} className="text-[44px] md:text-[72px]" />
          <Scribble className="mt-1">{isProfessional ? "drag things around. nothing breaks." : "drag it. shuffle it. make it worse."}</Scribble>
        </div>
        <button
          onClick={() => {
            setSeed((s) => s + 1);
            addScore(2, "shuffled the sketchbook", "sketch:shuffle");
          }}
          className="self-start md:self-auto md:mb-4 inline-flex items-center gap-2 rounded-full border border-black bg-[#fffaf1] px-4 py-2 font-['Shantell_Sans',cursive] text-[15px] shadow-[3px_3px_0_0_#1d1a17] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#1d1a17] transition-all"
        >
          <StickerArt kind="swirl" size={18} /> shuffle
        </button>
      </div>

      <div
        ref={board}
        className="relative w-full h-[420px] md:h-[560px] rounded-[20px] border border-dashed border-black/35 bg-[#fffaf1]/50 overflow-hidden"
        style={{ backgroundImage: "radial-gradient(rgba(29,26,23,.14) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      >
        {/* spiral binding */}
        <div aria-hidden className="absolute left-0 top-0 bottom-0 w-6 md:w-8 flex flex-col justify-around py-6 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block w-6 md:w-8 h-3 rounded-full border border-black/50 bg-[#fdecd0]" />
          ))}
        </div>

        {ITEMS.map((it, i) => {
          const l = layout[i];
          const z = order.indexOf(i) + 1;
          const scale = typeof window !== "undefined" && window.innerWidth < 640 ? 0.62 : 1;
          return (
            <motion.div
              key={`${i}-${seed}`}
              drag
              dragConstraints={board}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={() => bring(i)}
              onTap={() => bring(i)}
              whileHover={{ scale: 1.04 }}
              whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
              initial={{ opacity: 0, scale: 0.6, rotate: l.rot - 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: l.rot }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.04 }}
              className="absolute cursor-grab select-none touch-none"
              style={{ left: `${l.x}%`, top: `${l.y}%`, width: it.w * scale, zIndex: top === i ? 60 : z }}
              title={it.label || undefined}
            >
              {it.kind === "img" && <img src={it.src} alt={it.label} draggable={false} className="w-full h-auto max-w-none pointer-events-none" />}
              {it.kind === "sticker" && <StickerArt kind={it.id} size={it.w * scale} />}
              {it.kind === "thing" && <Thing id={it.id} size={(it.w * scale) / 120} />}
              {it.kind === "note" && (
                <div className="rounded-[4px] bg-[#FFF3B0] border border-black/50 shadow-[3px_3px_0_0_rgba(29,26,23,.25)] px-3 py-2.5 font-['Shantell_Sans',cursive] text-[14px] md:text-[16px] leading-snug text-black">
                  {it.text}
                </div>
              )}
              {it.label && it.kind !== "note" && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap font-['Shantell_Sans',cursive] text-[12px] text-black/55 pointer-events-none">{it.label}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
