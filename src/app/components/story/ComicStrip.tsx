import imgHeadCut from "../../../assets/head.webp";
/*
 * The About section as a comic strip: hand-drawn panels (rough.js) you scroll
 * through sideways. Each panel draws itself the first time it shows up.
 * Desktop: drag or use the arrows. Phone: swipe.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useDragControls } from "motion/react";
import rough from "roughjs";
import { useMode } from "../ModeContext";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import imgCouch from "../../../assets/comic/couch1.webp";
import imgBooks from "../../../assets/comic/books.webp";
import imgNews from "../../../assets/comic/news.webp";
import imgTeach from "../../../assets/comic/teach.webp";
import imgFamily from "../../../assets/comic/family.webp";
import imgSite from "../../../assets/comic/site.webp";

const gen = rough.generator();
const INK = "#1d1a17";
type P = { d: string; stroke: string; strokeWidth: number; fill?: string };
const paths = (ds: ReturnType<typeof gen.rectangle>[]): P[] => ds.flatMap((d) => gen.toPaths(d) as P[]);
const base = (seed: number, extra: object = {}) => ({ stroke: INK, strokeWidth: 2.4, roughness: 1.5, bowing: 1.2, seed, ...extra });
const hatch = (seed: number, fill: string) => base(seed, { fill, fillStyle: "hachure", hachureGap: 6, fillWeight: 1.3 });
const solid = (seed: number, fill: string) => base(seed, { fill, fillStyle: "solid" });

type Scene = "couch" | "pencil" | "screens" | "class" | "doodle" | "home";
function scene(kind: Scene, s: number): P[] {
  switch (kind) {
    case "couch":
      return paths([
        gen.rectangle(14, 48, 92, 34, hatch(s, "#FF9F1C")),
        gen.rectangle(6, 40, 14, 42, solid(s + 1, "#FFC53D")),
        gen.rectangle(100, 40, 14, 42, solid(s + 2, "#FFC53D")),
        gen.rectangle(22, 30, 76, 20, hatch(s + 3, "#FFE1D9")),
        gen.path("M30 60 q6 -6 12 0 q6 6 12 0 q6 -6 12 0 q6 6 12 0", base(s + 4, { stroke: "#ff614c", strokeWidth: 2 })),
        gen.path("M92 20 l10 -10 M100 22 l10 -8", base(s + 5)),
      ]);
    case "pencil":
      return paths([
        gen.path("M18 96 L84 30 L98 44 L32 110 L14 114 Z", hatch(s, "#FFC53D")),
        gen.path("M84 30 L98 44 L108 34 C112 30 110 24 104 22 L96 20 Z", solid(s + 1, "#ff614c")),
        gen.path("M18 96 L32 110", base(s + 2)),
        gen.path("M14 114 L20 104 L26 110 Z", solid(s + 3, INK)),
        gen.path("M30 40 q20 -14 40 0", base(s + 4, { stroke: "#6A4CFF", strokeWidth: 2 })),
      ]);
    case "screens":
      return paths([
        gen.rectangle(10, 22, 70, 50, solid(s, "#fffaf1")),
        gen.rectangle(18, 30, 54, 10, solid(s + 1, "#02B5C9")),
        gen.rectangle(18, 46, 24, 18, hatch(s + 2, "#FFE1D9")),
        gen.rectangle(48, 46, 24, 18, hatch(s + 3, "#E6E0FF")),
        gen.rectangle(84, 36, 30, 58, solid(s + 4, "#fffaf1")),
        gen.rectangle(90, 44, 18, 10, solid(s + 5, "#ff614c")),
        gen.line(92, 62, 106, 62, base(s + 6)),
        gen.line(92, 70, 102, 70, base(s + 7)),
        gen.circle(99, 86, 5, base(s + 8)),
      ]);
    case "class":
      return paths([
        gen.rectangle(26, 14, 76, 44, solid(s, "#fffaf1")),
        gen.path("M38 30 L50 42 L64 24", base(s + 1, { stroke: "#53B858", strokeWidth: 3 })),
        gen.rectangle(72, 28, 20, 14, hatch(s + 2, "#FFE1D9")),
        gen.circle(24, 78, 14, solid(s + 3, "#FFE9C7")),
        gen.circle(50, 84, 14, solid(s + 4, "#E6E0FF")),
        gen.circle(78, 80, 14, solid(s + 5, "#D6F4F7")),
        gen.circle(104, 86, 14, solid(s + 6, "#FFD6E0")),
        gen.path("M20 100 l0 10 M50 106 l0 10 M78 102 l0 10 M104 108 l0 8", base(s + 7)),
      ]);
    case "doodle":
      return paths([
        gen.rectangle(20, 14, 80, 100, solid(s, "#fffaf1")),
        gen.circle(60, 44, 26, hatch(s + 1, "#FFE1D9")),
        gen.path("M48 42 q4 -6 8 0 M64 42 q4 -6 8 0", base(s + 2)),
        gen.path("M50 54 q10 8 20 0", base(s + 3, { stroke: "#ff614c", strokeWidth: 2.6 })),
        gen.path("M30 78 L90 78 M30 90 L80 90 M30 102 L70 102", base(s + 4, { stroke: "#1d1a17", strokeWidth: 1.6 })),
        gen.path("M100 20 l6 -8 l4 8 l-4 8 Z", solid(s + 5, "#FF4C79")),
      ]);
    case "home":
      return paths([
        gen.path("M14 60 L60 20 L106 60 L106 110 L14 110 Z", hatch(s, "#FFE9C7")),
        gen.rectangle(48, 72, 24, 38, solid(s + 1, "#ff614c")),
        gen.rectangle(24, 70, 16, 16, solid(s + 2, "#D6F4F7")),
        gen.rectangle(80, 70, 16, 16, solid(s + 3, "#D6F4F7")),
        gen.path("M84 36 l0 -14 l8 0 l0 20", base(s + 4)),
        gen.circle(36, 40, 10, solid(s + 5, "#FFD6E0")),
        gen.circle(50, 36, 9, solid(s + 6, "#E6E0FF")),
      ]);
  }
}

interface Panel { scene: Scene; year: string; text: [pro: string, fun: string]; caption?: string }
const PANELS: Panel[] = [
  {
    scene: "couch", img: imgCouch, year: "2007",
    title: ["the upholstery years", "the couch era"],
    text: ["I started out stitching couches. Really. PlayStation after work.", "Stitched couches by day, PlayStation by night. Peak multitasking."],
    bubble: ["one more stitch…", "respawn in 3, 2, 1"],
    story: [
      [
        "Before pixels there was fabric. In Irbid, I spent my days in an upholstery workshop, stretching, stitching and fixing furniture that other people would sit on for years.",
        "It taught me two things I still use every day: patience with materials that don't want to cooperate, and the idea that comfort is designed, not accidental.",
        "At night it was PlayStation. I didn't know it yet, but I was studying interfaces: menus, feedback, what makes a thing feel good in your hands.",
      ],
      [
        "Plot twist: my first job had nothing to do with screens. I stitched couches. With my hands. In Irbid.",
        "Turns out the job is the same as now: make something people can sit with comfortably and not think about. Nobody notices a good couch. Nobody notices good UX.",
        "By night, PlayStation. I called it research. My mom called it something else.",
      ],
    ],
  },
  {
    scene: "pencil", img: imgBooks, year: "2012",
    title: ["300 drawings later", "my hand still hurts"],
    text: ["300+ illustrated stories for children's books. My hand still remembers.", "Drew 300+ kids' book illustrations. My hand still hurts."],
    bubble: ["page 212…", "the dragon needs friends"],
    story: [
      [
        "After graduating with honours in graphic design from Irbid National University, I got the job every kid with a sketchbook wants: drawing for a living.",
        "At Square Design I illustrated more than 300 children's stories. Dragons, kids, villages, the lot. You learn fast when every page has a deadline and a seven-year-old critic.",
        "That's where the doodle style came from. It's still what I reach for first when I need to explain an idea: a quick drawing beats a long paragraph.",
      ],
      [
        "Got a degree (honours, thank you), then got paid to draw. 300+ children's stories. My wrist has opinions about it to this day.",
        "Kids are the toughest art directors alive. They don't care about your composition. They care if the dragon looks friendly.",
        "The doodles you see all over this site? Same hand, slightly older, same coffee.",
      ],
    ],
  },
  {
    scene: "screens", img: imgNews, year: "2018",
    title: ["news speed", "the news years"],
    text: ["Al Jazeera, then TRT: motion and visuals for news, at news speed.", "Designed things millions saw. Told nobody at dinner, or they'd ask me to fix their Wi-Fi."],
    bubble: ["we're live in 4 minutes", "no pressure"],
    story: [
      [
        "In 2018 I moved to Al Jazeera in Qatar as a motion and visual designer, building the visual identity for social platforms that reach millions.",
        "A year later, TRT Arabi: motion graphics and user experiences for Arabic digital platforms. News never waits, so you learn to design decisions in minutes and live with them on air.",
        "That pace is where I learned to ship: clear hierarchy, fast reads, Arabic typography that behaves. Those years are in every dashboard I've designed since.",
      ],
      [
        "Al Jazeera, then TRT. Motion graphics for news, which means a producer saying \"we're live in four minutes\" while you're still picking a font.",
        "Millions of people saw the work. Zero of them knew my name. Exactly how it should be.",
        "I learned Arabic typography the hard way: live, on air, with a clock in the corner.",
      ],
    ],
  },
  {
    scene: "class", img: imgTeach, year: "2020",
    title: ["talking at people", "the teaching arc"],
    text: ["Teaching UX at universities, bootcamps, Zain and 42 Amman.", "Convincing a new generation that Comic Sans is never the answer. Ok, maybe ironically."],
    bubble: ["what's the user's goal?", "any questions? no? ok, pizza"],
    story: [
      [
        "Somewhere along the way I started teaching: universities, bootcamps, workshops at Zain, 42 Amman and HTU. Design thinking, Figma, and the part nobody teaches, how to argue for a decision.",
        "Then came Ftoor Designer, a podcast I co-host that made it into the top ten design podcasts in the region, and the YES JO kids' product design program every year.",
        "Teaching is how I keep my own thinking honest. If you can't draw it on a whiteboard for a room of beginners, you don't understand it yet.",
      ],
      [
        "I stand in front of rooms and explain UX. Universities, bootcamps, Zain, 42 Amman. Sometimes they clap. Sometimes they just want the Figma shortcuts.",
        "There's also a podcast, Ftoor Designer. Top ten in the region. My mom still asks when I'll get a real job.",
        "Best students: the kids in the YES JO program. They don't pretend to understand. They just say \"that's boring\".",
      ],
    ],
  },
  {
    scene: "home", img: imgFamily, year: "2026",
    title: ["made for alma & eleen", "my two toughest clients"],
    text: ["Siba: a study app for Alma and Eleen. They review harder than any client.", "Built an app for my kids. They gave it 3 stars and asked for the iPad back."],
    bubble: ["can it say my name?", "no red X. ever."],
    story: [
      [
        "By 2025 I was Director of UX at Sitech, running my own consultancy on the side, working with government, fintech, games and edtech clients across MENA.",
        "But the project that changed how I work was at home. Studying with Alma and Eleen ran on photos in a chat and me marking quizzes at night. So I built Siba: a study buddy with a face, a voice, and a parent who always gets the last word.",
        "Then Siba List, for the daily list and the allowance that came with it. Two apps, two very demanding product owners, and the most honest usability testing of my career.",
      ],
      [
        "Director of UX by day. Dad by night. The night job has harsher reviews.",
        "Alma and Eleen were studying through iMessage and me playing teacher. So I built them Siba: a study buddy that says their names and never shows a red X.",
        "Then they asked for the allowance app. Then they asked for a better exchange rate. Negotiations are ongoing.",
      ],
    ],
  },
  {
    scene: "doodle", img: imgSite, year: "now",
    title: ["this website", "2am, three coffees"],
    text: ["This website, at 2am, three coffees in. Hi.", "This website. 2am. Three coffees. The cat gave up. Hi."],
    bubble: ["one more section…", "diva: go to sleep"],
    story: [
      [
        "And this. A site that's supposed to feel like my sketchbook: hand-drawn, a bit silly, and honest about how the work actually happens, meetings and all.",
        "Everything you can poke, drag, stamp or shuffle here is on purpose. The points and hearts at the top are too. You're playing it right now.",
        "If you made it this far, you probably want to work together, or you're a designer procrastinating. Either way: say hi.",
      ],
      [
        "This website. Built at 2am with too much coffee and a cat who gave up on me.",
        "Every doodle, sticker and heart up there is intentional. The bugs are not. Report them and I'll give you points.",
        "You've read six comic panels about a stranger. That's either a sign we should work together or a sign you should go to bed. Both are fine.",
      ],
    ],
  },
];

function Drawn({ list, delay = 0 }: { list: P[]; delay?: number }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" aria-hidden overflow="visible">
      {list.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke={p.stroke === "none" ? undefined : p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill ?? "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px -10% 0px -10%" }}
          transition={{ pathLength: { duration: 0.6, delay: delay + i * 0.05, ease: "easeInOut" }, opacity: { duration: 0.01, delay: delay + i * 0.05 } }}
        />
      ))}
    </svg>
  );
}

export function ComicStrip() {
  const { isProfessional } = useMode();
  const art = useMemo(() => PANELS.map((p, i) => scene(p.scene, i * 23 + 7)), []);
  const frames = useMemo(() => PANELS.map((_, i) => paths([gen.rectangle(4, 4, 232, 292, base(i * 11 + 3, { strokeWidth: 3, roughness: 1.4 }))])), []);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useDragControls();
  const [limit, setLimit] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useRef(false);
  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % PANELS.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + PANELS.length) % PANELS.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const measure = () => {
    const t = trackRef.current;
    const v = viewRef.current;
    if (!t || !v) return 0;
    const l = Math.max(0, t.scrollWidth - v.clientWidth);
    setLimit(l);
    return l;
  };
  const nudge = (dir: 1 | -1) => {
    const l = measure();
    const step = Math.min(300, l / 2 || 300);
    const next = Math.max(-l, Math.min(0, x.get() - dir * step));
    x.set(next);
  };

  return (
    <div className="relative">
      <div ref={viewRef} className="overflow-hidden -mx-5 md:mx-0 px-5 md:px-0" onPointerDown={() => measure()}>
        <motion.div
          ref={trackRef}
          drag="x"
          dragControls={controls}
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
          style={{ x }}
          className="flex gap-5 md:gap-7 w-max cursor-grab active:cursor-grabbing pb-4 pr-5 md:pr-0"
          onDragStart={() => measure()}
        >
          {PANELS.map((p, i) => (
            <motion.figure
              key={p.scene}
              role="button"
              tabIndex={0}
              aria-label={`Open panel ${i + 1}: ${p.title[isProfessional ? 0 : 1]}`}
              onClick={() => {
                if (!dragged.current) setOpen(i);
              }}
              onKeyDown={(e) => e.key === "Enter" && setOpen(i)}
              whileHover={{ y: -6, rotate: 0 }}
              className="relative w-[240px] md:w-[260px] shrink-0 select-none cursor-pointer"
              initial={{ opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.8 : -0.8 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: Math.min(i, 3) * 0.08 }}
            >
              <div className="relative aspect-[240/300] bg-[#fdecd0]">
                <svg viewBox="0 0 240 300" className="absolute inset-0 w-full h-full overflow-visible" fill="none" aria-hidden>
                  {frames[i].map((q, k) => (
                    <motion.path key={k} d={q.d} stroke={q.stroke} strokeWidth={q.strokeWidth} fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} />
                  ))}
                </svg>
                <span className="absolute top-3 left-3 font-['Work_Sans'] font-semibold text-[11px] uppercase tracking-[0.14em] bg-black text-white px-2 py-0.5">{p.year}</span>
                <motion.div
                  className="absolute left-[6%] right-[6%] top-[11%] h-[52%] flex items-center justify-center"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                  viewport={{ once: true, margin: "0px -10% 0px -10%" }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img src={p.img} alt="" draggable={false} className="max-w-full max-h-full w-auto h-auto" />
                </motion.div>
                <p className="absolute left-5 right-5 bottom-5 font-['Shantell_Sans',cursive] text-[14px] md:text-[15px] leading-snug text-black">
                  {p.text[isProfessional ? 0 : 1]}
                </p>
                {i === PANELS.length - 1 && (
                  <span className="absolute -right-5 -bottom-4 w-[74px] h-[88px] overflow-hidden rotate-[8deg]" aria-hidden>
                    <img src={imgHeadCut} alt="" className="absolute inset-0 w-full h-full object-contain max-w-none" />
                  </span>
                )}
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      <div className="hidden md:flex absolute -top-14 right-0 gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            onClick={() => nudge(d)}
            aria-label={d < 0 ? "Previous panels" : "Next panels"}
            className="w-10 h-10 rounded-full border border-black bg-[#fffaf1] shadow-[2px_2px_0_0_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_black] transition-all font-bold"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
      <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/50 mt-1"><span className="md:hidden">swipe → · </span>{isProfessional ? "tap a panel to read the page" : "tap a panel. there's more."}</p>

      {/* the comic page */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="comic-page"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-8 bg-[#1d1a17]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            {(() => {
              const p = PANELS[open];
              const k = isProfessional ? 0 : 1;
              return (
                <motion.article
                  key={p.scene}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.85, rotate: -3, y: 30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, rotate: 2, y: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="relative w-full max-w-[1000px] max-h-[92vh] overflow-y-auto bg-[#fffaf1] border-[3px] border-[#1d1a17] shadow-[8px_8px_0_0_#1d1a17] p-5 md:p-8"
                  style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-['Work_Sans'] font-semibold text-[11px] uppercase tracking-[0.16em] bg-black text-white px-2 py-0.5">{p.year} · page {open + 1} of {PANELS.length}</span>
                    <button onClick={() => setOpen(null)} aria-label="Close" className="w-10 h-10 rounded-full border border-black bg-[#fffaf1] hover:rotate-90 transition-transform">✕</button>
                  </div>
                  <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 mt-5 items-start">
                    {/* big panel with a speech bubble */}
                    <div className="relative border-[3px] border-[#1d1a17] bg-[#fdecd0] p-4 md:p-6" style={{ borderRadius: "12px 180px 12px 200px / 200px 12px 180px 12px" }}>
                      <motion.img
                        src={p.img}
                        alt=""
                        className="w-full h-auto"
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {p.bubble && (
                        <motion.span
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: -4 }}
                          transition={{ delay: 0.9, type: "spring", stiffness: 320, damping: 14 }}
                          className="absolute top-3 right-3 md:top-5 md:right-5 max-w-[60%] rounded-[18px] border-2 border-[#1d1a17] bg-white px-3.5 py-2 font-['Shantell_Sans',cursive] text-[13px] md:text-[15px] leading-snug shadow-[3px_3px_0_0_#1d1a17]"
                        >
                          {p.bubble[k]}
                          <span aria-hidden className="absolute -bottom-2.5 left-6 w-4 h-4 bg-white border-b-2 border-r-2 border-[#1d1a17] rotate-45" />
                        </motion.span>
                      )}
                    </div>
                    {/* the page text, in caption boxes */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display lowercase text-[36px] md:text-[52px] leading-[0.95] text-[#ff614c]">{p.title[k]}</h3>
                      {p.story[k].map((para, j) => (
                        <motion.p
                          key={j}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + j * 0.15 }}
                          className="font-['Shantell_Sans',cursive] text-[15px] md:text-[17px] leading-[1.55] text-black bg-[#FFF3B0]/70 border border-[#1d1a17]/60 px-4 py-3"
                          style={{ rotate: `${j % 2 ? 0.5 : -0.5}deg` }}
                        >
                          {para}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <button onClick={() => setOpen((open - 1 + PANELS.length) % PANELS.length)} className="font-display text-[22px] lowercase text-black hover:text-[#ff614c]">← previous</button>
                    <span className="font-['Work_Sans'] text-[12px] text-black/45 hidden sm:block">← → keys work too</span>
                    <button onClick={() => setOpen((open + 1) % PANELS.length)} className="font-display text-[22px] lowercase text-black hover:text-[#ff614c]">next →</button>
                  </div>
                </motion.article>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
