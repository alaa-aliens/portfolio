import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useMode } from "./ModeContext";
import { ProjectCover } from "./ProjectCover";
import { categories, type Project } from "../data/projects";

/** Project card: cover on top, name + tag chips, and a line that slides in on hover. */
export function ProjectCard({
  project,
  index = 0,
  onSoon,
  showCategory = false,
  big = false,
}: {
  project: Project;
  index?: number;
  onSoon: () => void;
  showCategory?: boolean;
  big?: boolean;
}) {
  const { isProfessional } = useMode();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const ready = project.status === "ready";
  const cat = categories[project.category];
  const hook = isProfessional ? project.proHook : project.funHook ?? project.proHook;
  const tags = [
    ...(ready ? [isProfessional ? "Case study" : "Read me"] : []),
    ...(project.tags ?? []),
    ...(showCategory && !project.tags ? [isProfessional ? cat.title : cat.funTitle] : []),
  ].slice(0, 3);
  // Each card sits at its own tiny angle, like it was pinned by hand.
  const tilt = ((index * 37) % 5) - 2;

  const open = () => (ready ? navigate(`/work/${project.slug}`) : onSoon());

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 36, rotate: tilt * 0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt * 0.35 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={open}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${project.name}${ready ? ", read the case study" : ", case study coming soon"}`}
      className={`group relative w-full text-left flex flex-col bg-[#fffaf1] border border-black rounded-[20px] p-3 md:p-3.5 outline-none focus-visible:ring-4 focus-visible:ring-[#ff614c]/40 transition-shadow duration-300 ${
        hovered ? "shadow-[7px_8px_0_0_#1d1a17]" : "shadow-[3px_3px_0_0_#1d1a17]"
      }`}
    >
      <ProjectCover project={project} hovered={hovered} big={big} />

      <div className="flex flex-col gap-2 px-1.5 md:px-2 pt-4 pb-1.5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className={`font-['Playfair_Display'] font-bold text-black leading-tight ${big ? "text-[26px] md:text-[34px]" : "text-[21px] md:text-[24px]"}`}>
            {project.name}
          </h3>
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-1">
              {tags.map((t, i) => (
                <span
                  key={t}
                  className={`font-['Work_Sans'] text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.08em] px-2 py-[3px] rounded-[6px] border ${
                    i === 0 && ready ? "bg-black text-white border-black" : "bg-transparent text-black/70 border-black/25"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {hook && (
          <p className={`font-['Work_Sans'] text-black/75 leading-snug ${big ? "text-[16px] md:text-[18px] max-w-[640px]" : "text-[14px] md:text-[15px]"}`}>
            {hook}
          </p>
        )}

        {/* Slides in on hover (always shown on touch screens) */}
        <div className="overflow-hidden">
          <motion.div
            className="flex items-center justify-between gap-3 pt-2 mt-1 border-t border-dashed border-black/25 [@media(hover:none)]:!opacity-100 [@media(hover:none)]:!translate-y-0"
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 14 }}
            transition={{ duration: 0.25 }}
          >
            <span className="font-['Shantell_Sans',cursive] text-[13px] text-black/55">
              {ready
                ? isProfessional ? "Product design · build" : "warning: contains feelings"
                : isProfessional ? "Write-up coming soon" : "stuck in my drafts"}
            </span>
            <span className="font-['DM_Serif_Display'] text-[16px] text-[#ff614c] whitespace-nowrap">
              {ready ? (isProfessional ? "View case study →" : "Open it →") : isProfessional ? "Ask me about it →" : "Bug me →"}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}
