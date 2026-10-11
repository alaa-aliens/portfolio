import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useMode } from "./ModeContext";
import { ProjectCard } from "./ProjectCard";
import { ComingSoonPopup } from "./ComingSoonPopup";
import { Reveal, SectionTitle } from "./motion/Doodles";
import { featuredProjects, getProject, projects, renderFolder } from "../data/projects";

function LatestCaseStudy({ slug }: { slug: string }) {
  const { isProfessional } = useMode();
  const [hovered, setHovered] = useState(false);
  const p = getProject(slug)!;
  return (
    <Reveal className="mb-6 md:mb-10">
      <Link
        to={`/work/${p.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 border border-black bg-white/60 shadow-[6px_6px_0px_0px_black] hover:shadow-[3px_3px_0px_0px_black] hover:translate-x-[3px] hover:translate-y-[3px] transition-all p-6 md:p-10 rounded-[6px]"
      >
        <span className="absolute -top-3 left-6 bg-[#ff614c] text-white font-['Work_Sans'] font-semibold uppercase tracking-wider text-[11px] px-2 py-1 rotate-[-2deg]">
          {isProfessional ? "Latest case study" : "Fresh out of the oven"}
        </span>
        <div className="shrink-0 scale-110 md:scale-125 origin-left">{renderFolder(p, hovered)}</div>
        <div className="flex flex-col gap-3">
          <h3 className="font-['Playfair_Display'] font-bold text-black text-[26px] md:text-[36px] leading-tight">
            {p.name}
          </h3>
          <p className="font-['IBM_Plex_Serif'] text-black text-[16px] md:text-[20px] leading-[1.5] max-w-[620px]">
            {isProfessional ? p.proHook : p.funHook}
          </p>
          <span className="font-['DM_Serif_Display'] text-[18px] text-[#ff614c] inline-flex items-center gap-2">
            {isProfessional ? "Read the case study" : "Show me the chaos"}
            <span className="transition-transform group-hover:translate-x-1.5">→</span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProjectsSection() {
  const { isProfessional, mode } = useMode();
  const [soonOpen, setSoonOpen] = useState(false);
  const latest = projects.find((p) => p.status === "ready" && !p.featured);

  return (
    <section id="projects" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 mb-8">
          <SectionTitle>{isProfessional ? "Featured Projects" : "Stuff I've Designed"}</SectionTitle>
          <Link
            to="/work"
            className="group font-['Playfair_Display'] font-bold text-[#ff614c] text-[16px] md:text-[22px] self-start sm:self-auto sm:pb-4 inline-flex items-center gap-2"
          >
            <span className="group-hover:underline underline-offset-4">
              {isProfessional ? `See all ${projects.length} projects` : "The Full Damage"}
            </span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {latest && <LatestCaseStudy slug={latest.slug} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} onSoon={() => setSoonOpen(true)} />
          ))}
        </div>
      </motion.div>

      <ComingSoonPopup isOpen={soonOpen} onClose={() => setSoonOpen(false)} />
    </section>
  );
}
