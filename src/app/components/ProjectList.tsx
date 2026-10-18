/*
 * The long list (Pablo Stanley-style rows): name · one-liner · category.
 * On desktop, a small cover follows the cursor while you hover a row (huyml-style).
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useNavigate } from "react-router";
import { useMode } from "./ModeContext";
import { ProjectCover } from "./ProjectCover";
import { categories, type Project } from "../data/projects";

export function ProjectList({ items, onSoon, start = 1 }: { items: Project[]; onSoon: () => void; start?: number }) {
  const { isProfessional } = useMode();
  const navigate = useNavigate();
  const [active, setActive] = useState<Project | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerMove={(e) => {
        const r = wrap.current!.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t-2 border-black">
        {items.map((p, i) => {
          const cat = categories[p.category];
          const hook = isProfessional ? p.proHook : p.funHook ?? p.proHook;
          const ready = p.status === "ready";
          return (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              className="border-b border-black/20"
            >
              <button
                type="button"
                onClick={() => (ready ? navigate(`/work/${p.slug}`) : onSoon())}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(p)}
                onFocus={() => setActive(p)}
                onBlur={() => setActive(null)}
                className="group w-full grid grid-cols-[36px_1fr_auto] md:grid-cols-[52px_minmax(0,1.1fr)_minmax(0,1.6fr)_auto] items-baseline gap-x-3 md:gap-x-6 gap-y-1 py-4 md:py-5 text-left outline-none focus-visible:bg-[#F5E1C0]"
              >
                <span className="md:col-start-1 md:row-start-1 font-['Work_Sans'] text-[12px] md:text-[13px] tabular-nums text-black/40">
                  {String(start + i).padStart(2, "0")}
                </span>
                <span className="md:col-start-2 md:row-start-1 flex items-center gap-2 min-w-0">
                  <motion.span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: cat.color }}
                    animate={{ scale: active?.slug === p.slug ? 1.8 : 1 }}
                  />
                  <span className="font-['IBM_Plex_Serif'] font-bold text-[19px] md:text-[24px] text-black leading-tight transition-transform duration-300 group-hover:translate-x-1.5 truncate">
                    {p.name}
                  </span>
                </span>
                <span className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 font-['Work_Sans'] text-[13px] md:text-[15px] text-black/60 leading-snug min-w-0">
                  {hook ?? (isProfessional ? cat.title : cat.funTitle)}
                </span>
                <span className="row-start-1 col-start-3 md:col-start-4 flex items-center gap-2 justify-self-end">
                  {ready && (
                    <span className="font-['Work_Sans'] text-[10.5px] font-semibold uppercase tracking-[0.08em] px-2 py-[3px] rounded-[6px] bg-black text-white">
                      {isProfessional ? "Case study" : "Read me"}
                    </span>
                  )}
                  <span className="font-['IBM_Plex_Serif'] text-[18px] text-black/30 group-hover:text-[#ff614c] transition-all group-hover:translate-x-1">
                    {ready ? "→" : "↗"}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* Cursor-following preview (mouse only) */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="preview"
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block w-[260px]"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <div className="translate-x-6 -translate-y-1/2 bg-[#fffaf1] border border-black rounded-[16px] p-2 shadow-[5px_6px_0_0_#1d1a17]">
              <ProjectCover key={active.slug} project={active} hovered />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
