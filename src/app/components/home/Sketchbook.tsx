import { play } from "../play/sfx";
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
import imgHead from "../../../assets/head.webp";
import { useMode } from "../ModeContext";
import { DoodleTitle } from "../play/DoodleTitle";
import { StickerArt, type Kind } from "../play/Stickers";
import { Thing } from "../play/DeskThings";
import { Button, Scribble } from "../ui/Kit";
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
/** Each shuffle tells one story from my life, in numbered sticky notes. */
const STORIES: Story[] = [
  {
    title: { pro: "how i became a designer", fun: "how i became a designer (accident)" },
    items: [
      note("1. 2007, Irbid. I stitch couches by day.", 210), note("2. By night: PlayStation. 'Research.'", 200), note("3. 2010: graphic design, with honours.", 210),
      note("4. First paid drawing. Didn't sleep.", 200), note("5. 300 kids' book pages later: a style.", 220), note("6. Now: pixels. Same job, softer couch.", 220),
      ART.head, st("controller", 100), st("pencil", 100), st("star"),
    ],
  },
  {
    title: { pro: "the night siba was born", fun: "the night siba was born" },
    items: [
      note("1. Kids photograph the textbook.", 190), note("2. I make a quiz. In iMessage. Every night.", 220), note("3. 'Can it say my name?' – Alma", 200),
      note("4. 'No red X. Ever.' – Eleen", 180), note("5. Named after Sibawayh. 9 Sep, 2am.", 220), note("6. First lesson ran before breakfast.", 210),
      st("cat", 120), st("mug", 90), st("heart", 60), st("laptop", 120),
    ],
  },
  {
    title: { pro: "the news years", fun: "the news years" },
    items: [
      note("1. 2018: Doha. Al Jazeera. Millions watching.", 230), note("2. 'We're live in 4 minutes.' Font not picked.", 230), note("3. 2019: Istanbul. TRT Arabi.", 190),
      note("4. Learned Arabic type under a ticking clock.", 230), note("5. Nobody knew my name. Perfect.", 200), note("6. Every dashboard since has that pace.", 220),
      st("headphones", 100), st("sun", 90), st("bolt"), ART.audit,
    ],
  },
  {
    title: { pro: "a client said 'make it pop'", fun: "a client said 'make it pop'" },
    items: [
      note("1. 'Make it pop.'", 150), note("2. Me: 'pop how?'", 150), note("3. 'Bigger logo.'", 150), note("4. 'No.'", 100),
      note("5. 'Ok, a little.'", 150), note("6. It popped. Nobody noticed. Good UX.", 220),
      st("wow", 70), st("bubble", 100), st("bulb", 90), ART.hand,
    ],
  },
  {
    title: { pro: "the allowance negotiations", fun: "the allowance negotiations" },
    items: [
      note("1. Rule: miss one task, lose the week.", 210), note("2. Everyone, me included: unfair.", 200), note("3. Wrote 30 rules before any screen.", 210),
      note("4. Points, a ladder, one free pass.", 200), note("5. Alma asked for a better exchange rate.", 220), note("6. Friday stopped being an argument.", 210),
      st("note", 100), st("star"), st("plant", 90), st("mug", 80),
    ],
  },
  {
    title: { pro: "teaching, by accident", fun: "talking at people, by accident" },
    items: [
      note("1. 2017: a meetup. Someone handed me a mic.", 230), note("2. HTU, Zain, Takween, 42 Amman.", 200), note("3. Every government uni in Jordan, one tour.", 230),
      note("4. Kids at YES JO: 'that's boring.' Fair.", 220), note("5. A podcast. Top ten. Mom still asks about a real job.", 250), note("6. If I can't draw it, I don't get it yet.", 220),
      ART.board, st("bulb", 90), st("sun", 90), st("crown"),
    ],
  },
  {
    title: { pro: "this website, 2am", fun: "this website, 2am, three coffees" },
    items: [
      note("1. Started with a Figma file and a grudge.", 220), note("2. 'It looks AI.' Threw half of it away.", 220), note("3. Gochi Hand. Thin lines. My doodles.", 210),
      note("4. Hearts and points, because why not.", 210), note("5. Diva gave up at coffee three.", 200), note("6. You're reading the sketchbook. Hi.", 210),
      st("cat", 120), st("mug", 80), st("mug", 70), st("laptop", 120),
    ],
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
  const EXTRA: Kind[] = ["star", "heart", "sparkle", "bolt", "sun", "bubble", "plane", "note", "bulb", "headphones", "plant", "swirl", "crown", "wow"];
  const ITEMS = useMemo(() => {
    const r = rnd(seed * 13 + story * 5 + 1);
    const extras = Array.from({ length: 4 + Math.floor(r() * 4) }, () => st(EXTRA[Math.floor(r() * EXTRA.length)], 44 + Math.floor(r() * 50)));
    return [...STORIES[story].items, ...extras];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, story]);
  const [top, setTop] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>(() => ITEMS.map((_, i) => i));

  const layout = useMemo(() => {
    const r = rnd(seed * 7 + story * 31);
    const notes = ITEMS.filter((it) => it.kind === "note").length;
    // a different reading path every shuffle: rows, zigzag, arc, or diagonal
    const pattern = Math.floor(r() * 4);
    const notePos = (i: number) => {
      const t = notes <= 1 ? 0 : i / (notes - 1);
      switch (pattern) {
        case 0: { const perRow = Math.ceil(notes / 2); const row = Math.floor(i / perRow); const col = i % perRow; return { x: 5 + (col * 82) / Math.max(1, perRow - 1) * ((perRow - 1) / perRow) + 2, y: 8 + row * 42 }; }
        case 1: return { x: 5 + t * 80, y: i % 2 ? 50 : 10 };
        case 2: return { x: 5 + t * 80, y: 12 + Math.sin(t * Math.PI) * 42 };
        default: return { x: 5 + t * 78, y: 8 + t * 52 };
      }
    };
    let n = 0;
    return ITEMS.map((it) => {
      if (it.kind === "note") {
        const p = notePos(n++);
        return { x: Math.min(80, p.x + (r() - 0.5) * 6), y: Math.min(74, p.y + (r() - 0.5) * 8), rot: -6 + r() * 12 };
      }
      return { x: 4 + r() * 80, y: 4 + r() * 70, rot: -18 + r() * 36 };
    });
  }, [seed, story, ITEMS]);

  const bring = (i: number) => {
    setTop(i);
    setOrder((o) => [...o.filter((k) => k !== i), i]);
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-32 md:pt-48">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
        <div>
          <DoodleTitle text={isProfessional ? "the {pencil} sketchbook" : "my {pencil} mess"} className="text-[44px] md:text-[72px]" />
          <Scribble className="mt-1">{isProfessional ? "one story per shuffle. read the notes in order, or don't." : "one story per shuffle. the notes are numbered. you'll still read them wrong."}</Scribble>
        </div>
        <div className="self-start md:self-auto md:mb-4">
          <Button
            onClick={() => {
              setSeed((s) => s + 1);
              play("scribble", 0.5);
              setStory((k) => (k + 1) % STORIES.length);
              setTop(null);
              setOrder([]);
              addScore(2, "shuffled the sketchbook", "sketch:shuffle");
            }}
          >
            <StickerArt kind="swirl" size={20} /> {isProfessional ? "another story" : "shuffle"}
          </Button>
        </div>
      </div>

      <div
        ref={board}
        className="relative w-full h-[520px] md:h-[600px] rounded-[20px] border border-black/60 bg-[#fffaf1]/70 overflow-visible"
        style={{ backgroundImage: "radial-gradient(rgba(29,26,23,.14) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      >
        {/* spiral binding: rings that straddle the left edge */}
        <div aria-hidden className="absolute -left-[13px] md:-left-[15px] top-0 bottom-0 flex flex-col justify-around py-8 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <svg key={i} width="30" height="16" viewBox="0 0 30 16" fill="none" className="md:w-[34px]">
              <circle cx="15" cy="8" r="2.6" fill="#1d1a17" />
              <path d="M15 8 C 12 1, 3 1, 3 8 C 3 15, 12 15, 15 8" stroke="#1d1a17" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
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
        <div className="absolute inset-0 overflow-hidden rounded-[20px]">
        {ITEMS.map((it, i) => {
          const l = layout[i];
          const z = order.length ? order.indexOf(i) + 1 : i + 1;
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
      </div>
    </section>
  );
}
