import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import hoverSvgPaths from "../../imports/svg-pkeiynvjgw";
import { useMode } from "./ModeContext";
import { categories, renderFolder, type Project } from "../data/projects";

export function ProjectCard({
  project,
  index = 0,
  onSoon,
  showCategory = false,
}: {
  project: Project;
  index?: number;
  onSoon: () => void;
  showCategory?: boolean;
}) {
  const { isProfessional } = useMode();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ready = project.status === "ready";
  const cat = categories[project.category];
  const hook = isProfessional ? project.proHook : project.funHook ?? project.proHook;

  const open = () => (ready ? navigate(`/work/${project.slug}`) : onSoon());
  // Pinned-sketchbook look on the Work page: each card gets its own slight tilt + a strip of tape.
  const tilt = showCategory ? (((index * 37) % 7) - 3) * 0.45 : 0;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotate: tilt }}
      whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
      onClick={open}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${project.name}${ready ? " — read case study" : " — case study coming soon"}`}
      className={`group relative text-left flex flex-col gap-4 p-6 md:p-8 cursor-pointer rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black ${
        showCategory
          ? "bg-[#fff8ec] border border-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_24px_-14px_rgba(80,50,20,0.35)] hover:shadow-[0_18px_36px_-16px_rgba(80,50,20,0.45)]"
          : "hover:bg-[#F5E1C0] focus-visible:bg-[#F5E1C0]"
      }`}
    >
      {showCategory && (
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 w-20 h-6 -translate-x-1/2 opacity-80"
          style={{
            rotate: `${-tilt * 2 - 3}deg`,
            background: `repeating-linear-gradient(45deg, ${cat.color}55 0 6px, ${cat.color}33 6px 12px)`,
            clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 96% 100%, 2% 96%, 0 50%)",
          }}
        />
      )}
      <div className="flex justify-start">{renderFolder(project, hovered)}</div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-['Playfair_Display'] font-bold text-black text-[18px] md:text-[22px]">
            {project.name}
          </h3>
          {ready && (
            <span className="font-['Work_Sans'] text-[11px] uppercase tracking-wider font-semibold text-white bg-black px-2 py-[2px] rounded-sm">
              {isProfessional ? "Case study" : "Read me"}
            </span>
          )}
        </div>
        {showCategory && (
          <span className="flex items-center gap-2 font-['Work_Sans'] text-[12px] text-black/60">
            <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
            {isProfessional ? cat.title : cat.funTitle}
          </span>
        )}
        {hook && (
          <p className="font-['Work_Sans'] text-black text-[14px] md:text-[16px]">{hook}</p>
        )}
      </div>

      {/* Hand-drawn arrow — slides in on hover */}
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -10 }}
        transition={{ duration: 0.25 }}
        className="w-[35px] h-[25px]"
      >
        <svg className="block size-full" fill="none" viewBox="9 9.5 26 16">
          <path d={hoverSvgPaths.p956b540} fill="#FF604C" />
        </svg>
      </motion.div>
    </motion.button>
  );
}
