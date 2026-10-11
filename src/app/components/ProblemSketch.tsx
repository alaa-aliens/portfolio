/*
 * A hand-drawn storyboard of the problem: frames joined by arrows, each with a little
 * drawing and a caption. Pain points get circled in red marker with a scribbled note.
 * Lines are generated with rough.js and draw themselves when they scroll into view.
 */
import { useMemo } from "react";
import { motion } from "motion/react";
import rough from "roughjs";

export type SketchIcon = "phone" | "robot" | "chat" | "pen" | "lost" | "clock" | "kids" | "eyes" | "doc" | "money" | "map";

export interface SketchFrame {
  icon: SketchIcon;
  label: string;
  pain?: string;
}

const gen = rough.generator();
type P = { d: string; stroke: string; strokeWidth: number; fill?: string };

function paths(drawables: ReturnType<typeof gen.rectangle>[]): P[] {
  return drawables.flatMap((d) => gen.toPaths(d) as P[]);
}

const INK = "#1d1a17";
const base = (seed: number, extra: object = {}) => ({ stroke: INK, strokeWidth: 2.2, roughness: 1.6, bowing: 1.2, seed, ...extra });
const fillOf = (seed: number, color: string) => base(seed, { fill: color, fillStyle: "hachure", hachureGap: 6, fillWeight: 1.2 });

function iconPaths(icon: SketchIcon, seed: number): P[] {
  const s = seed;
  switch (icon) {
    case "phone":
      return paths([
        gen.rectangle(34, 12, 34, 70, fillOf(s, "#02B5C9")),
        gen.line(44, 19, 58, 19, base(s + 1)),
        gen.circle(51, 74, 5, base(s + 2)),
        gen.rectangle(39, 26, 24, 38, base(s + 3, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.path("M18 30 L26 34 M16 42 L26 42 M18 54 L26 50", base(s + 4, { stroke: "#ff614c" })),
      ]);
    case "robot":
      return paths([
        gen.line(50, 12, 50, 26, base(s)),
        gen.circle(50, 11, 7, base(s + 1, { fill: "#ff614c", fillStyle: "solid" })),
        gen.rectangle(24, 26, 52, 40, fillOf(s + 2, "#B9A8FF")),
        gen.circle(39, 44, 9, base(s + 3, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.circle(61, 44, 9, base(s + 4, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.line(40, 58, 60, 58, base(s + 5)),
        gen.rectangle(34, 70, 32, 14, base(s + 6)),
      ]);
    case "chat":
      return paths([
        gen.path("M14 20 Q14 12 22 12 L66 12 Q74 12 74 20 L74 42 Q74 50 66 50 L34 50 L22 60 L24 50 L22 50 Q14 50 14 42 Z", fillOf(s, "#0a84ff")),
        gen.path("M30 62 Q30 56 36 56 L80 56 Q86 56 86 62 L86 78 Q86 84 80 84 L76 84 L78 92 L68 84 L36 84 Q30 84 30 78 Z", base(s + 1, { fill: "#e9e9eb", fillStyle: "solid" })),
        gen.line(24, 26, 62, 26, base(s + 2, { stroke: "#fffaf1" })),
        gen.line(24, 36, 52, 36, base(s + 3, { stroke: "#fffaf1" })),
        gen.line(40, 70, 72, 70, base(s + 4)),
      ]);
    case "pen":
      return paths([
        gen.rectangle(16, 18, 52, 66, base(s, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.path("M24 32 L30 38 L40 26", base(s + 1, { stroke: "#53B858", strokeWidth: 3 })),
        gen.path("M24 50 L36 62 M36 50 L24 62", base(s + 2, { stroke: "#ff614c", strokeWidth: 3 })),
        gen.path("M24 72 L30 78 L40 66", base(s + 3, { stroke: "#53B858", strokeWidth: 3 })),
        gen.path("M60 74 L86 22 L94 26 L68 78 L58 84 Z", fillOf(s + 4, "#FFC53D")),
      ]);
    case "lost":
      return paths([
        gen.rectangle(14, 30, 34, 40, base(s, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.rectangle(46, 18, 34, 40, base(s + 1, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.rectangle(36, 52, 34, 36, fillOf(s + 2, "#FFE1D9")),
        gen.path("M54 30 Q62 24 66 32 Q68 38 60 42 L60 46", base(s + 3, { stroke: "#ff614c", strokeWidth: 3 })),
        gen.circle(60, 52, 2, base(s + 4, { stroke: "#ff614c", fill: "#ff614c", fillStyle: "solid" })),
      ]);
    case "clock":
      return paths([
        gen.circle(50, 50, 66, fillOf(s, "#FFE9C7")),
        gen.line(50, 50, 50, 26, base(s + 1, { strokeWidth: 3 })),
        gen.line(50, 50, 68, 58, base(s + 2, { strokeWidth: 3 })),
        gen.path("M20 12 L30 20 M80 12 L70 20", base(s + 3)),
      ]);
    case "kids":
      return paths([
        gen.circle(34, 30, 20, fillOf(s, "#FF4C79")),
        gen.path("M18 84 Q20 50 34 46 Q48 50 50 84 Z", base(s + 1, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.circle(68, 40, 16, fillOf(s + 2, "#6A4CFF")),
        gen.path("M54 86 Q56 58 68 54 Q80 58 82 86 Z", base(s + 3, { fill: "#fffaf1", fillStyle: "solid" })),
      ]);
    case "eyes":
      return paths([
        gen.ellipse(32, 50, 36, 30, base(s, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.ellipse(68, 50, 36, 30, base(s + 1, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.circle(36, 52, 10, base(s + 2, { fill: INK, fillStyle: "solid" })),
        gen.circle(72, 52, 10, base(s + 3, { fill: INK, fillStyle: "solid" })),
        gen.path("M16 28 L44 34 M56 34 L84 28", base(s + 4, { strokeWidth: 3 })),
      ]);
    case "doc":
      return paths([
        gen.path("M24 12 L62 12 L78 28 L78 88 L24 88 Z", base(s, { fill: "#fffaf1", fillStyle: "solid" })),
        gen.path("M62 12 L62 28 L78 28", base(s + 1)),
        gen.line(32, 42, 70, 42, base(s + 2)),
        gen.line(32, 54, 70, 54, base(s + 3)),
        gen.line(32, 66, 56, 66, base(s + 4)),
      ]);
    case "money":
      return paths([
        gen.circle(50, 50, 62, fillOf(s, "#FFC53D")),
        gen.path("M60 34 Q50 28 42 34 Q36 42 50 48 Q64 54 58 64 Q50 72 40 64 M50 24 L50 76", base(s + 1, { strokeWidth: 3 })),
      ]);
    case "map":
      return paths([
        gen.path("M12 24 L36 14 L62 24 L88 14 L88 78 L62 88 L36 78 L12 88 Z", fillOf(s, "#DDF3DF")),
        gen.path("M24 64 Q40 40 54 54 T80 34", base(s + 1, { stroke: "#ff614c", strokeWidth: 2.6, strokeLineDash: [5, 5] })),
      ]);
  }
}

function Drawn({ list, delay = 0, className = "", viewBox = "0 0 100 100" }: { list: P[]; delay?: number; className?: string; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={className} fill="none" aria-hidden overflow="visible">
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
          viewport={{ once: true, margin: "-60px" }}
          transition={{ pathLength: { duration: 0.7, delay: delay + i * 0.06, ease: "easeInOut" }, opacity: { duration: 0.01, delay: delay + i * 0.06 } }}
        />
      ))}
    </svg>
  );
}

function Arrow({ seed, delay, vertical }: { seed: number; delay: number; vertical?: boolean }) {
  const list = useMemo(
    () =>
      vertical
        ? paths([gen.path("M20 4 Q26 20 20 36", base(seed)), gen.path("M12 28 L20 38 L28 28", base(seed + 1))])
        : paths([gen.path("M4 20 Q20 12 36 20", base(seed)), gen.path("M28 12 L38 20 L28 28", base(seed + 1))]),
    [seed, vertical],
  );
  return <Drawn list={list} delay={delay} viewBox="0 0 40 40" className={vertical ? "w-8 h-8" : "w-10 h-10"} />;
}

export function ProblemSketch({ frames, loop }: { frames: SketchFrame[]; loop?: string }) {
  const art = useMemo(() => frames.map((f, i) => iconPaths(f.icon, (i + 1) * 17)), [frames]);
  const boxes = useMemo(
    () => frames.map((_, i) => paths([gen.rectangle(3, 3, 194, 194, base(i * 31 + 5, { roughness: 1.3, strokeWidth: 2 }))])),
    [frames],
  );
  const circles = useMemo(
    () => frames.map((_, i) => paths([gen.ellipse(100, 100, 236, 222, base(i * 13 + 2, { stroke: "#ff614c", strokeWidth: 3.2, roughness: 2.2 }))])),
    [frames],
  );

  return (
    <figure className="relative w-full rounded-[18px] border-2 border-dashed border-black/25 bg-[#fffaf1] px-4 md:px-8 py-8 md:py-10 overflow-hidden">
      {/* notebook lines */}
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(2,181,201,.18) 31px 32px)" }} />
      <div className="relative flex flex-col md:flex-row md:flex-wrap items-center md:items-start justify-center gap-y-2 md:gap-y-10">
        {frames.map((f, i) => {
          const d = i * 0.45;
          return (
            <div key={i} className="flex flex-col md:flex-row items-center">
              <div className="relative w-[200px] flex flex-col items-center">
                <div className="relative w-[150px] h-[150px] md:w-[160px] md:h-[160px]">
                  <Drawn list={boxes[i]} delay={d} viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" />
                  <Drawn list={art[i]} delay={d + 0.25} className="absolute inset-[14%] w-[72%] h-[72%]" />
                  {f.pain && <Drawn list={circles[i]} delay={d + 0.9} viewBox="0 0 200 200" className="absolute inset-[-14%] w-[128%] h-[128%]" />}
                  <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-black text-white font-['Work_Sans'] font-semibold text-[12px] flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: d + 0.5 }}
                  className="mt-3 text-center font-['Shantell_Sans',cursive] text-[15px] md:text-[16px] leading-snug text-black max-w-[190px]"
                >
                  {f.label}
                </motion.p>
                {f.pain && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: d + 1.2, type: "spring", stiffness: 300, damping: 14 }}
                    className="mt-1.5 text-center font-['Shantell_Sans',cursive] font-semibold text-[14px] text-[#e5412c] max-w-[190px]"
                  >
                    ↑ {f.pain}
                  </motion.p>
                )}
              </div>
              {i < frames.length - 1 && (
                <>
                  <div className="hidden md:block md:mt-[62px] md:mx-[-8px]">
                    <Arrow seed={i * 7 + 3} delay={d + 0.4} />
                  </div>
                  <div className="md:hidden my-1">
                    <Arrow seed={i * 7 + 3} delay={d + 0.4} vertical />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {loop && (
        <motion.figcaption
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: frames.length * 0.45 + 0.6 }}
          className="relative mt-6 md:mt-8 mx-auto w-fit flex items-center gap-2 font-['Shantell_Sans',cursive] text-[15px] md:text-[17px] text-[#e5412c] rotate-[-1.5deg] text-center"
        >
          <span aria-hidden className="text-[22px]">↺</span> {loop}
        </motion.figcaption>
      )}
    </figure>
  );
}
