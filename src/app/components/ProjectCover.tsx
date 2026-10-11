/*
 * The picture at the top of every project card.
 * - Case studies with screens: the real screens, fanned out on the brand colour.
 * - Clients with a logo: the logo on their brand colour.
 * - Everything else: the name, hand-lettered, with a doodle.
 * On hover the cover "comes alive" a little (phones lift, a doodle pops).
 */
import { motion } from "motion/react";
import { categories, type Project } from "../data/projects";
import { StickerArt, type Kind } from "./play/Stickers";

const DOODLES: Kind[] = ["star", "sparkle", "heart", "bolt", "swirl", "crown"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function ProjectCover({
  project,
  hovered,
  className = "",
  big = false,
}: {
  project: Project;
  hovered: boolean;
  className?: string;
  big?: boolean;
}) {
  const cat = categories[project.category];
  const shots = project.caseStudy?.showcase ?? [];
  const bg = project.brand ?? `${cat.color}26`;
  const h = hash(project.slug);
  const doodle = DOODLES[h % DOODLES.length];
  const dark = project.brand && ["#111", "#000", "#1d1a17"].includes(project.brand);

  return (
    <div
      className={`relative overflow-hidden rounded-[14px] border border-black ${className}`}
      style={{ background: bg, aspectRatio: big ? "16 / 10" : "4 / 3" }}
    >
      {shots.length > 0 && project.caseStudy?.device === "desktop" ? (
        <div className="absolute inset-0 flex items-end justify-center px-[7%]">
          <motion.div
            className="relative w-full rounded-t-[10px] border border-b-0 border-[#1d1a17] bg-[#fffaf1] overflow-hidden shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]"
            animate={{ y: hovered ? "4%" : "12%", rotate: hovered ? -1 : 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <div className="flex items-center gap-1.5 px-2.5 h-5 border-b-2 border-[#1d1a17] bg-[#fdecd0]" aria-hidden>
              <i className="block w-1.5 h-1.5 rounded-full bg-[#ff614c]" />
              <i className="block w-1.5 h-1.5 rounded-full bg-[#FFC53D]" />
              <i className="block w-1.5 h-1.5 rounded-full bg-[#53B858]" />
            </div>
            <img src={shots[0].src} alt="" loading="lazy" className="block w-full" />
          </motion.div>
        </div>
      ) : shots.length > 0 ? (
        <div className="absolute inset-0 flex items-end justify-center gap-[3%] px-[8%]">
          {shots.slice(0, 3).map((s, i) => {
            const mid = i === 1;
            return (
              <motion.img
                key={s.src}
                src={s.src}
                alt=""
                loading="lazy"
                className="block w-[30%] rounded-t-[14px] border border-b-0 border-[#1d1a17] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]"
                style={{ zIndex: mid ? 2 : 1 }}
                animate={{
                  y: hovered ? (mid ? "6%" : "14%") : mid ? "18%" : "30%",
                  rotate: hovered ? (i - 1) * 5 : (i - 1) * 2,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
              />
            );
          })}
        </div>
      ) : project.mark ? (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? -2 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
        >
          {project.mark}
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[10%]">
          <span
            className="font-display text-center leading-[0.95] lowercase [text-wrap:balance]"
            style={{ color: cat.color === "#1F1F1F" ? "#1d1a17" : cat.color, fontSize: big ? "clamp(34px,5vw,64px)" : "clamp(26px,3.2vw,40px)", filter: "saturate(1.1) brightness(0.85)" }}
          >
            {project.name}
          </span>
        </div>
      )}

      {/* A doodle that pops on hover */}
      <motion.div
        aria-hidden
        className="absolute"
        style={{ top: "8%", right: "7%" }}
        initial={false}
        animate={{ scale: hovered ? 1 : 0, rotate: hovered ? 12 : -40 }}
        transition={{ type: "spring", stiffness: 420, damping: 14 }}
      >
        <StickerArt kind={doodle} size={big ? 46 : 34} />
      </motion.div>

      {/* subtle paper grain on the colour */}
      <div aria-hidden className={`absolute inset-0 pointer-events-none mix-blend-multiply ${dark ? "opacity-0" : "opacity-40"}`} style={{ backgroundImage: "radial-gradient(rgba(0,0,0,.08) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
    </div>
  );
}
