import { useState } from "react";
import { Link } from "react-router";
import { useMode } from "./ModeContext";
import { ProjectCard } from "./ProjectCard";
import { ComingSoonPopup } from "./ComingSoonPopup";
import { DoodleTitle } from "./play/DoodleTitle";
import { featuredProjects, projects } from "../data/projects";

export function ProjectsSection() {
  const { isProfessional } = useMode();
  const [soonOpen, setSoonOpen] = useState(false);
  const caseStudies = projects.filter((p) => p.status === "ready");
  const lead = caseStudies[0];
  const rest = featuredProjects.filter((p) => p.slug !== lead?.slug);

  return (
    <section id="projects" className="w-full max-w-[1200px] mx-auto px-5 md:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
        <DoodleTitle
          text={isProfessional ? "Selected {pencil} work" : "Stuff I've {pencil} designed"}
          className="text-[38px] md:text-[64px]"
        />
        <Link
          to="/work"
          className="group self-start md:self-auto md:mb-6 inline-flex items-center gap-2 bg-[#fffaf1] border border-black rounded-full px-4 py-2 shadow-[3px_3px_0_0_black] hover:shadow-[1px_1px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-['IBM_Plex_Serif'] text-[17px]"
        >
          {isProfessional ? `All ${projects.length} projects` : "The full damage"}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {lead && (
        <div className="mb-6 md:mb-10">
          <ProjectCard project={lead} big onSoon={() => setSoonOpen(true)} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {rest.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i + 1} onSoon={() => setSoonOpen(true)} />
        ))}
      </div>

      <ComingSoonPopup isOpen={soonOpen} onClose={() => setSoonOpen(false)} />
    </section>
  );
}
