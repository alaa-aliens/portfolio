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

type Story = { title: { pro: string; fun: string }; items: Item[] };

const ART = {
  wire: { kind: "img", src: imgImage37, w: 190, label: "wireframes" } as Item,
  audit: { kind: "img", src: imgImage36, w: 170, label: "the audit scribble" } as Item,
  board: { kind: "img", src: imgImage38, w: 180, label: "workshop board" } as Item,
  hand: { kind: "img", src: imgImage39, w: 170, label: "the drawing hand" } as Item,
  head: { kind: "img", src: imgHead, w: 120, label: "me" } as Item,
  cat: { kind: "thing", id: "cat", w: 130, label: "Diva" } as Item,
  mug: { kind: "thing", id: "mug", w: 90, label: "coffee" } as Item,
  pad: { kind: "thing", id: "controller", w: 110, label: "research" } as Item,
  plant: { kind: "thing", id: "plant", w: 90, label: "still alive" } as Item,
};
const st = (id: Kind, w = 54): Item => ({ kind: "sticker", id, w, label: "" });
const note = (text: string, w = 160): Item => ({ kind: "note", text, w, label: "" });

/** Every shuffle tells a different story. */
const STORIES: Story[] = [
  {
    title: { pro: "a normal tuesday", fun: "a normal tuesday, allegedly" },
    items: [ART.wire, ART.head, ART.cat, ART.mug, st("star"), st("heart", 50), note("make it pop"), note("users don't read"), note("border-radius: 18px?", 170)],
  },
  {
    title: { pro: "the 2am redesign", fun: "the 2am redesign (don't)" },
    items: [ART.audit, ART.head, ART.mug, { ...ART.mug, label: "coffee no. 4" }, st("bolt"), st("wow", 64), note("it's fine. it's fine."), note("ship it?"), note("one more round", 140), ART.cat],
  },
  {
    title: { pro: "workshop day", fun: "talking at people day" },
    items: [ART.board, ART.hand, st("sparkle"), st("crown", 56), st("user", 56), st("user", 48), note("figma shortcuts pls"), note("can we do this in arabic?", 190), ART.mug],
  },
  {
    title: { pro: "the night siba was born", fun: "the night siba was born" },
    items: [ART.head, ART.cat, st("heart", 60), st("star"), st("coffee", 56), note("alma: can it say my name?", 200), note("eleen: no red x!", 160), note("named after sibawayh", 180), ART.wire],
  },
  {
    title: { pro: "a client said \"make it pop\"", fun: "a client said \"make it pop\"" },
    items: [ART.audit, ART.hand, st("wow", 70), st("bolt"), st("swirl"), note("pop = ?"), note("bigger logo", 130), note("no.", 80), note("ok, a little.", 130), ART.mug],
  },
  {
    title: { pro: "drawing for kids' books", fun: "300 drawings. my hand still hurts." },
    items: [ART.hand, ART.hand, st("star"), st("sparkle"), st("heart"), note("page 212 of 300", 150), note("the dragon needs friends", 190), ART.plant, ART.head],
  },
  {
    title: { pro: "research", fun: "\"research\"" },
    items: [ART.pad, ART.pad, ART.cat, ART.mug, st("crown"), st("bolt"), note("it's for the ux game", 170), note("one more level", 140), ART.head],
  },
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
  const [story, setStory] = useState(0);
  const ITEMS = STORIES[story].items;
  const [top, setTop] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>(() => ITEMS.map((_, i) => i));

  const layout = useMemo(() => {
    const r = rnd(seed + story * 31);
    return ITEMS.map(() => ({ x: 6 + r() * 74, y: 6 + r() * 64, rot: -14 + r() * 28 }));
  }, [seed, story, ITEMS]);

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
            setStory((k) => (k + 1) % STORIES.length);
            setTop(null);
            setOrder(STORIES[(story + 1) % STORIES.length].items.map((_, i) => i));
            addScore(2, "shuffled the sketchbook", "sketch:shuffle");
          }}
          className="self-start md:self-auto md:mb-4 inline-flex items-center gap-2 rounded-full border border-black bg-[#fffaf1] px-4 py-2 font-['Shantell_Sans',cursive] text-[15px] shadow-[3px_3px_0_0_#1d1a17] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#1d1a17] transition-all"
        >
          <StickerArt kind="swirl" size={18} /> {isProfessional ? "another story" : "shuffle"}
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

        <motion.p
          key={story}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-5 bottom-3 md:right-7 md:bottom-5 font-display text-[22px] md:text-[30px] text-[#ff614c] lowercase pointer-events-none z-[70]"
        >
          {STORIES[story].title[isProfessional ? "pro" : "fun"]}
          <span className="block font-['Shantell_Sans',cursive] text-[12px] text-black/45 text-right">{story + 1} / {STORIES.length}</span>
        </motion.p>
        {ITEMS.map((it, i) => {
          const l = layout[i];
          const z = order.indexOf(i) + 1;
          const scale = typeof window !== "undefined" && window.innerWidth < 640 ? 0.62 : 1;
          return (
            <motion.div
              key={`${story}-${i}-${seed}`}
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
