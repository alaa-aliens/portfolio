import imgHeadCut from "../../../assets/head.webp";
/*
 * The About section as a comic strip: hand-drawn panels (rough.js) you scroll
 * through sideways. Each panel draws itself the first time it shows up.
 * Desktop: drag or use the arrows. Phone: swipe.
 */
import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useDragControls } from "motion/react";
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
  { scene: "couch", img: imgCouch, year: "2007", text: ["I started out stitching couches. Really. PlayStation after work.", "Stitched couches by day, PlayStation by night. Peak multitasking."] },
  { scene: "pencil", img: imgBooks, year: "2012", text: ["300+ illustrated stories for children's books. My hand still remembers.", "Drew 300+ kids' book illustrations. My hand still hurts."] },
  { scene: "screens", img: imgNews, year: "2018", text: ["Al Jazeera, then TRT: motion and visuals for news, at news speed.", "Designed things millions saw. Told nobody at dinner, or they'd ask me to fix their Wi-Fi."] },
  { scene: "class", img: imgTeach, year: "2020", text: ["Teaching UX at universities, bootcamps, Zain and 42 Amman.", "Convincing a new generation that Comic Sans is never the answer. Ok, maybe ironically."] },
  { scene: "home", img: imgFamily, year: "2026", text: ["Siba: a study app for Alma and Eleen. They review harder than any client.", "Built an app for my kids. They gave it 3 stars and asked for the iPad back."] },
  { scene: "doodle", img: imgSite, year: "now", text: ["This website, at 2am, three coffees in. Hi.", "This website. 2am. Three coffees. The cat gave up. Hi."] },
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
              className="relative w-[240px] md:w-[260px] shrink-0 select-none"
              initial={{ opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.8 : -0.8 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: Math.min(i, 3) * 0.08 }}
            >
              <div className="relative aspect-[240/300] bg-[#fffaf1]">
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
      <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/50 mt-1 md:hidden">swipe →</p>
    </div>
  );
}
